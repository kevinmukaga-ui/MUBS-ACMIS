"""
Machine Learning & NLP Curriculum Alignment Checker
Implements the 4 alignment checks from the MUBS CBET Research Proposal:
1. Learning Outcome Measurability & Bloom's Taxonomy Level
2. Outcome-to-Programme Competence Semantic Alignment
3. Outcome-to-Assessment Alignment
4. Industry & World-of-Work Gap Analysis
"""

import os
import sys
import types

# Ensure critical Windows environment variables exist for Winsock / _overlapped / asyncio
if sys.platform == "win32":
    system_root = os.environ.get("SystemRoot") or os.environ.get("SYSTEMROOT") or r"C:\Windows"
    os.environ["SystemRoot"] = system_root
    os.environ["SYSTEMROOT"] = system_root
    if "WINDIR" not in os.environ:
        os.environ["WINDIR"] = system_root
    if "PATH" not in os.environ:
        os.environ["PATH"] = rf"{system_root}\System32;{system_root}"
    elif rf"{system_root}\System32" not in os.environ.get("PATH", ""):
        os.environ["PATH"] = rf"{system_root}\System32;{system_root};" + os.environ.get("PATH", "")

    # In Python 3.14+, joblib imports asyncio on Windows which imports _overlapped.
    # If the Windows Sockets (Winsock) service provider fails to initialize in a restricted environment,
    # safely provide a fallback module so scikit-learn / joblib can load cleanly without networking.
    try:
        import _overlapped
    except OSError:
        dummy_overlapped = types.ModuleType('_overlapped')
        sys.modules['_overlapped'] = dummy_overlapped

import json
import re
from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
try:
    from bloom_taxonomy import BLOOM_LEVELS, NON_MEASURABLE_VERBS
except ImportError:
    from ml_engine.bloom_taxonomy import BLOOM_LEVELS, NON_MEASURABLE_VERBS


def clean_text(text: str) -> str:
    """Preprocess text by stripping extra punctuation and lowercasing."""
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'[\r\n\t]+', ' ', text)
    return text


def extract_lead_verb(outcome_text: str) -> Tuple[str, str]:
    """
    Extract the main action verb or phrase from a course learning outcome.
    Handles phrases like 'be able to design', 'students will formulate', 'understand and apply'.
    """
    cleaned = clean_text(outcome_text)
    
    # Remove standard institutional prefixes
    prefixes = [
        r'^(by the end of the (course|course unit|programme),?\s*(the\s*)?(student|learner)s?\s*(will|should|shall)\s*(be able to\s*)?)',
        r'^(students?\s*(will|should|shall)\s*(be able to\s*)?)',
        r'^(learners?\s*(will|should|shall)\s*(be able to\s*)?)',
        r'^(to\s+)',
        r'^(the\s+course\s+enables\s+students\s+to\s+)',
    ]
    
    core_text = cleaned
    for p in prefixes:
        core_text = re.sub(p, '', core_text).strip()
        
    words = core_text.split()
    if not words:
        return ("unknown", core_text)

    # Check multi-word non-measurable phrases first
    for phrase in NON_MEASURABLE_VERBS.keys():
        if core_text.startswith(phrase):
            return (phrase, core_text)

    # First word is typically the primary action verb
    first_word = re.sub(r'[^a-z]', '', words[0])
    return (first_word, core_text)


def check_outcome_quality(outcome_text: str) -> Dict[str, Any]:
    """
    Check 1: Evaluate outcome quality, action verb, measurability, and Bloom's level.
    """
    verb, core_text = extract_lead_verb(outcome_text)
    
    # Check measurability against known vague verbs
    is_measurable = True
    flag = None
    suggested_verbs = []

    if verb in NON_MEASURABLE_VERBS:
        is_measurable = False
        vague_info = NON_MEASURABLE_VERBS[verb]
        suggested_verbs = vague_info['suggested_verbs']
        flag = {
            'check_type': 'outcome_quality',
            'severity': vague_info['severity'],
            'flag_title': f"Non-measurable verb '{verb}' detected",
            'flag_reason': vague_info['reason'],
            'suggested_action': f"Replace '{verb}' with a higher-order measurable verb such as: {', '.join(suggested_verbs)}."
        }

    # Determine Bloom's Level
    detected_level = None
    confidence = 0.50

    # 1. Direct verb lookup
    for level, data in BLOOM_LEVELS.items():
        if verb in data['verbs']:
            detected_level = level
            confidence = 0.95
            break

    # 2. Contextual / TF-IDF matching if direct verb match not found
    if not detected_level:
        corpus = [core_text]
        level_keys = list(BLOOM_LEVELS.keys())
        level_docs = [
            f"{lvl} {' '.join(BLOOM_LEVELS[lvl]['verbs'])} {BLOOM_LEVELS[lvl]['description']}"
            for lvl in level_keys
        ]
        
        all_docs = corpus + level_docs
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(all_docs)
        
        sims = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        best_idx = int(sims.argmax())
        best_score = float(sims[best_idx])
        
        detected_level = level_keys[best_idx]
        confidence = round(max(0.60, min(0.92, best_score * 2.0)), 2)

    return {
        'outcome_text': outcome_text,
        'action_verb': verb,
        'bloom_level': detected_level,
        'bloom_confidence': confidence,
        'is_measurable': is_measurable,
        'suggested_verbs': suggested_verbs,
        'flag': flag
    }


def check_competence_alignment(outcomes: List[Dict[str, Any]], competences: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Check 2: Compute semantic similarity between Course Learning Outcomes and Programme Competences.
    Flags unmapped outcomes and orphaned programme competences.
    """
    if not outcomes or not competences:
        return {'matches': [], 'flags': [], 'orphaned_competences': []}

    outcome_texts = [clean_text(o.get('description', '')) for o in outcomes]
    comp_texts = [f"{clean_text(c.get('title', ''))} {clean_text(c.get('description', ''))}" for c in competences]

    vectorizer = TfidfVectorizer(stop_words='english', sublinear_tf=True)
    all_texts = outcome_texts + comp_texts
    matrix = vectorizer.fit_transform(all_texts)

    num_outcomes = len(outcome_texts)
    outcome_matrix = matrix[:num_outcomes]
    comp_matrix = matrix[num_outcomes:]

    sim_matrix = cosine_similarity(outcome_matrix, comp_matrix)

    matches = []
    flags = []
    hit_competences = set()

    for i, o in enumerate(outcomes):
        scores = sim_matrix[i]
        best_comp_idx = int(scores.argmax())
        best_score = float(scores[best_comp_idx])
        best_comp = competences[best_comp_idx]

        # Threshold for meaningful alignment
        is_aligned = best_score >= 0.25
        if is_aligned:
            hit_competences.add(best_comp.get('id', best_comp_idx))

        match_record = {
            'outcome_id': o.get('id'),
            'outcome_number': o.get('outcome_number', i + 1),
            'outcome_description': o.get('description'),
            'matched_competence_id': best_comp.get('id'),
            'matched_competence_code': best_comp.get('code'),
            'matched_competence_title': best_comp.get('title'),
            'similarity_score': round(best_score, 4),
            'is_aligned': is_aligned
        }
        matches.append(match_record)

        if not is_aligned:
            flags.append({
                'check_type': 'competence_alignment',
                'severity': 'warning',
                'learning_outcome_id': o.get('id'),
                'programme_competence_id': None,
                'flag_title': f"Outcome #{o.get('outcome_number', i+1)} has weak alignment to Programme Competences",
                'flag_reason': f"The learning outcome has a low semantic similarity score ({round(best_score, 3)}) with available programme competences (closest: '{best_comp.get('title')}').",
                'suggested_action': "Revise the outcome to explicitly support an approved Programme Competence or consult the Curriculum Review Committee."
            })

    # Identify orphaned competences (competences not addressed by any course outcome)
    orphaned = []
    for c in competences:
        c_id = c.get('id')
        if c_id not in hit_competences:
            orphaned.append(c)
            flags.append({
                'check_type': 'competence_alignment',
                'severity': 'info',
                'learning_outcome_id': None,
                'programme_competence_id': c_id,
                'flag_title': f"Programme Competence [{c.get('code')}] is unaddressed",
                'flag_reason': f"Competence '{c.get('title')}' is not covered by any learning outcome in this course outline.",
                'suggested_action': "Confirm whether this competence is developed in other course units across the degree programme."
            })

    return {
        'matches': matches,
        'flags': flags,
        'orphaned_competences': orphaned
    }


def check_assessment_alignment(outcomes: List[Dict[str, Any]], assessments: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Check 3: Verify constructive alignment between Learning Outcomes and Assessment Tasks.
    Flags unassessed learning outcomes.
    """
    flags = []
    matches = []

    if not assessments:
        for o in outcomes:
            flags.append({
                'check_type': 'assessment_alignment',
                'severity': 'error',
                'learning_outcome_id': o.get('id'),
                'flag_title': f"Outcome #{o.get('outcome_number', 1)} is completely unassessed",
                'flag_reason': "No assessment tasks exist in the course unit to measure this learning outcome.",
                'suggested_action': "Add a corresponding practical project, test, or assessment component to evaluate this outcome."
            })
        return {'matches': matches, 'flags': flags}

    # Vectorize outcome text vs assessment titles and descriptions
    outcome_texts = [clean_text(o.get('description', '')) for o in outcomes]
    ass_texts = [f"{clean_text(a.get('title', ''))} {clean_text(a.get('description', ''))}" for a in assessments]

    vectorizer = TfidfVectorizer(stop_words='english')
    matrix = vectorizer.fit_transform(outcome_texts + ass_texts)

    num_outcomes = len(outcome_texts)
    o_mat = matrix[:num_outcomes]
    a_mat = matrix[num_outcomes:]

    sim_matrix = cosine_similarity(o_mat, a_mat)

    for i, o in enumerate(outcomes):
        scores = sim_matrix[i]
        best_ass_idx = int(scores.argmax())
        best_score = float(scores[best_ass_idx])
        best_ass = assessments[best_ass_idx]

        is_assessed = best_score >= 0.20 or len(assessments) >= 1  # If assessments exist and relate

        matches.append({
            'outcome_id': o.get('id'),
            'assessment_id': best_ass.get('id'),
            'assessment_title': best_ass.get('title'),
            'coverage_score': round(best_score, 4),
            'is_assessed': is_assessed
        })

        if not is_assessed:
            flags.append({
                'check_type': 'assessment_alignment',
                'severity': 'warning',
                'learning_outcome_id': o.get('id'),
                'flag_title': f"Outcome #{o.get('outcome_number', i+1)} lacks authentic assessment",
                'flag_reason': f"No assessment task clearly evaluates this outcome statement (highest match: '{best_ass.get('title')}').",
                'suggested_action': "Align this outcome with a specific coursework rubric, lab task, or examination section."
            })

    return {'matches': matches, 'flags': flags}


def check_industry_alignment(competences: List[Dict[str, Any]], industry_evidence: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Check 4: Compare Programme Competences against Ugandan job adverts and DIT Occupational Profiles.
    Identifies in-demand industry skills missing from the curriculum.
    """
    if not competences or not industry_evidence:
        return {'gap_flags': [], 'coverage_matrix': []}

    comp_texts = [f"{clean_text(c.get('title', ''))} {clean_text(c.get('description', ''))}" for c in competences]
    
    # Collect all extracted industry skills/competences
    industry_items = []
    for doc in industry_evidence:
        skills = doc.get('extracted_competences', [])
        for s in skills:
            industry_items.append({
                'skill': s,
                'source': doc.get('organization', doc.get('title')),
                'source_type': doc.get('source_type')
            })

    if not industry_items:
        return {'gap_flags': [], 'coverage_matrix': []}

    item_texts = [clean_text(item['skill']) for item in industry_items]

    vectorizer = TfidfVectorizer(stop_words='english')
    matrix = vectorizer.fit_transform(comp_texts + item_texts)

    num_comp = len(comp_texts)
    c_mat = matrix[:num_comp]
    i_mat = matrix[num_comp:]

    sim_matrix = cosine_similarity(i_mat, c_mat)

    gap_flags = []
    coverage_matrix = []

    for idx, item in enumerate(industry_items):
        scores = sim_matrix[idx]
        best_comp_idx = int(scores.argmax())
        best_score = float(scores[best_comp_idx])
        best_comp = competences[best_comp_idx]

        covered = best_score >= 0.28
        coverage_matrix.append({
            'industry_skill': item['skill'],
            'source': item['source'],
            'closest_competence': best_comp.get('title'),
            'similarity_score': round(best_score, 4),
            'covered': covered
        })

        if not covered:
            gap_flags.append({
                'check_type': 'industry_gap',
                'severity': 'info',
                'programme_competence_id': None,
                'flag_title': f"Industry Competence Gap: {item['skill']}",
                'flag_reason': f"Required by '{item['source']}' but not strongly covered in programme competences (similarity {round(best_score, 3)}).",
                'suggested_action': f"Consider introducing practical modules or elective topics addressing '{item['skill']}'."
            })

    return {
        'coverage_matrix': coverage_matrix,
        'gap_flags': gap_flags
    }


def analyze_course_unit(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main entry point for running all 4 alignment checks on a course outline.
    """
    course_unit = payload.get('course_unit', {})
    outcomes = payload.get('learning_outcomes', [])
    competences = payload.get('programme_competences', [])
    assessments = payload.get('assessment_tasks', [])
    industry_evidence = payload.get('industry_evidence', [])

    # Check 1: Outcome Quality & Bloom's
    quality_results = []
    all_flags = []
    for o in outcomes:
        q = check_outcome_quality(o.get('description', ''))
        q['id'] = o.get('id')
        q['outcome_number'] = o.get('outcome_number')
        quality_results.append(q)
        if q.get('flag'):
            flag_data = q['flag']
            flag_data['learning_outcome_id'] = o.get('id')
            all_flags.append(flag_data)

    # Check 2: Outcome-to-Competence Alignment
    comp_results = check_competence_alignment(outcomes, competences)
    all_flags.extend(comp_results.get('flags', []))

    # Check 3: Outcome-to-Assessment Alignment
    ass_results = check_assessment_alignment(outcomes, assessments)
    all_flags.extend(ass_results.get('flags', []))

    # Check 4: Industry Evidence Gap Analysis
    ind_results = check_industry_alignment(competences, industry_evidence)
    all_flags.extend(ind_results.get('gap_flags', []))

    # Compute overall alignment score (%)
    total_checks = len(outcomes) * 3 + len(competences)
    critical_errors = sum(1 for f in all_flags if f.get('severity') == 'error')
    warnings = sum(1 for f in all_flags if f.get('severity') == 'warning')
    
    score = max(10.0, 100.0 - (critical_errors * 18.0) - (warnings * 8.0))

    return {
        'course_unit_id': course_unit.get('id'),
        'course_code': course_unit.get('code'),
        'overall_alignment_score': round(score, 1),
        'quality_results': quality_results,
        'competence_alignment': comp_results.get('matches', []),
        'assessment_alignment': ass_results.get('matches', []),
        'industry_coverage': ind_results.get('coverage_matrix', []),
        'flags': all_flags
    }


if __name__ == '__main__':
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            input_data = json.load(f)
    else:
        input_data = json.loads(sys.stdin.read())

    result = analyze_course_unit(input_data)
    print(json.dumps(result, indent=2))
