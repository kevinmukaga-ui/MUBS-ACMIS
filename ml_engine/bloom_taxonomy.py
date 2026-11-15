"""
Bloom's Revised Taxonomy (Anderson & Krathwohl, 2001) & Measurability Lexicon
Used for automatic classification of learning outcomes and detection of vague verbs.
"""

BLOOM_LEVELS = {
    'remember': {
        'level_number': 1,
        'description': 'Retrieve relevant knowledge from long-term memory.',
        'verbs': [
            'define', 'describe', 'identify', 'label', 'list', 'match', 'name', 
            'outline', 'recall', 'recognize', 'reproduce', 'select', 'state', 'locate'
        ]
    },
    'understand': {
        'level_number': 2,
        'description': 'Construct meaning from instructional messages.',
        'verbs': [
            'classify', 'compare', 'contrast', 'demonstrate', 'explain', 'illustrate', 
            'interpret', 'paraphrase', 'summarize', 'translate', 'discuss', 'distinguish',
            'generalize', 'infer', 'predict'
        ]
    },
    'apply': {
        'level_number': 3,
        'description': 'Carry out or use a procedure in a given situation.',
        'verbs': [
            'apply', 'calculate', 'complete', 'compute', 'construct', 'implement', 
            'execute', 'manipulate', 'modify', 'operate', 'practice', 'solve', 
            'use', 'utilize', 'query', 'code', 'deploy'
        ]
    },
    'analyse': {
        'level_number': 4,
        'description': 'Break material into constituent parts and determine how parts relate.',
        'verbs': [
            'analyze', 'analyse', 'appraise', 'categorize', 'differentiate', 'discriminate', 
            'distinguish', 'examine', 'experiment', 'investigate', 'organize', 'question', 
            'test', 'debug', 'audit', 'profile', 'deconstruct'
        ]
    },
    'evaluate': {
        'level_number': 5,
        'description': 'Make judgments based on criteria and standards.',
        'verbs': [
            'assess', 'critique', 'defend', 'evaluate', 'judge', 'justify', 
            'measure', 'rate', 'recommend', 'validate', 'verify', 'score'
        ]
    },
    'create': {
        'level_number': 6,
        'description': 'Put elements together to form a coherent whole or make an original product.',
        'verbs': [
            'assemble', 'compose', 'construct', 'design', 'develop', 'formulate', 
            'generate', 'integrate', 'model', 'plan', 'produce', 'synthesize', 
            'architect', 'author', 'build', 'engineer'
        ]
    }
}

# Verbs that are notoriously non-measurable / vague in CBET (Biggs, 1996; NCHE CBET Guidelines)
NON_MEASURABLE_VERBS = {
    'understand': {
        'severity': 'error',
        'reason': "The verb 'understand' refers to an internal mental state rather than an observable, measurable workplace competence.",
        'suggested_verbs': ['Explain', 'Analyze', 'Apply', 'Construct', 'Demonstrate']
    },
    'appreciate': {
        'severity': 'error',
        'reason': "The verb 'appreciate' cannot be objectively evaluated in an authentic competence assessment.",
        'suggested_verbs': ['Assess', 'Critique', 'Evaluate', 'Explain']
    },
    'know': {
        'severity': 'error',
        'reason': "The verb 'know' indicates passive retention rather than active competence demonstration.",
        'suggested_verbs': ['Identify', 'State', 'Formulate', 'Implement']
    },
    'be familiar with': {
        'severity': 'error',
        'reason': "Familiarity is not an observable performance standard required under NCHE CBET guidelines.",
        'suggested_verbs': ['Examine', 'Apply', 'Execute', 'Analyze']
    },
    'learn': {
        'severity': 'warning',
        'reason': "'Learn' describes the instructional process rather than the terminal competence possessed by the graduate.",
        'suggested_verbs': ['Design', 'Implement', 'Formulate', 'Execute']
    },
    'grasp': {
        'severity': 'error',
        'reason': "'Grasp' is a colloquial term that does not specify an observable assessment criterion.",
        'suggested_verbs': ['Interpret', 'Differentiate', 'Synthesize']
    },
    'study': {
        'severity': 'warning',
        'reason': "'Study' describes a student learning activity rather than a demonstrated skill outcome.",
        'suggested_verbs': ['Investigate', 'Analyze', 'Model']
    }
}
