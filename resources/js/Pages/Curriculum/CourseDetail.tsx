import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Play,
    Edit3,
    Check,
    X,
    Info,
    ArrowLeft,
    Layers,
    BookOpen,
    HelpCircle,
    Printer,
    Sparkles,
    ShieldAlert,
    Target,
    Scale,
    CheckCheck,
    RotateCcw,
    RefreshCw,
    ShieldCheck,
    Send
} from 'lucide-react';
import { useState } from 'react';

interface ProgrammeCompetence {
    id: number;
    code: string;
    title: string;
    description: string;
}

interface CompetenceLink {
    id: number;
    similarity_score: number;
    programme_competence: ProgrammeCompetence;
}

interface AssessmentTask {
    id: number;
    title: string;
    type: string;
    weight_percentage: number;
    description: string;
}

interface LearningOutcome {
    id: number;
    outcome_number: number;
    description: string;
    action_verb: string | null;
    bloom_level: string | null;
    bloom_confidence: number;
    is_measurable: boolean;
    suggested_verbs: string[] | null;
    competence_links: CompetenceLink[];
}

interface AlignmentFlag {
    id: number;
    check_type: string;
    severity: 'error' | 'warning' | 'info';
    flag_title: string;
    flag_reason: string;
    suggested_action: string | null;
    resolution_status: 'pending' | 'accepted' | 'edited' | 'rejected';
    resolution_note: string | null;
    resolved_at: string | null;
    learning_outcome_id: number | null;
}

interface CourseUnit {
    id: number;
    code: string;
    title: string;
    year_of_study: number;
    semester: number;
    credit_units: number;
    version_type: 'old' | 'cbet_revised';
    alignment_status: string;
    alignment_score: number | null;
    description: string | null;
    lecturer_name: string | null;
}

interface Props {
    course: CourseUnit;
    programme: {
        id: number;
        code: string;
        name: string;
        competences: ProgrammeCompetence[];
    };
    outcomes: LearningOutcome[];
    assessments: AssessmentTask[];
    flags: AlignmentFlag[];
}

export default function CourseDetail({ course, programme, outcomes, assessments, flags }: Props) {
    const user = usePage().props.auth.user;
    const canResolveFlags = user?.can_resolve_flags ?? false;
    const canApproveAccreditation = user?.can_approve_accreditation ?? false;
    const canRequestRevision = user?.can_request_revision ?? false;
    const isLecturer = user?.is_lecturer ?? (user?.role === 'lecturer');

    const [runningCheck, setRunningCheck] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [activeTab, setActiveTab] = useState<'outcomes' | 'assessments' | 'flags'>('outcomes');
    const [editingOutcomeId, setEditingOutcomeId] = useState<number | null>(null);
    const [editOutcomeText, setEditOutcomeText] = useState('');
    const [activeFlagId, setActiveFlagId] = useState<number | null>(null);
    const [flagDecision, setFlagDecision] = useState<'accepted' | 'edited' | 'rejected'>('accepted');
    const [flagNote, setFlagNote] = useState('');

    const handleRunCheck = () => {
        setRunningCheck(true);
        router.post(route('courses.check', course.id), {}, {
            onFinish: () => setRunningCheck(false)
        });
    };

    const handleSaveOutcome = (outcomeId: number) => {
        router.patch(route('outcomes.update', outcomeId), {
            description: editOutcomeText
        }, {
            onSuccess: () => setEditingOutcomeId(null)
        });
    };

    const handleResolveFlag = (flagId: number) => {
        if (!flagNote.trim()) {
            alert('Please provide a formal justification note for this Quality Assurance audit decision.');
            return;
        }

        router.patch(route('flags.resolve', flagId), {
            resolution_status: flagDecision,
            resolution_note: flagNote
        }, {
            onSuccess: () => {
                setActiveFlagId(null);
                setFlagNote('');
            }
        });
    };

    const handleSetCourseStatus = (status: 'approved' | 'requires_revision' | 'checked') => {
        const confirmMsg = status === 'approved'
            ? 'Are you sure you want to certify this course unit as officially CBET ACCREDITED for NCHE submission?'
            : 'Return this course unit to the lecturer for revision?';

        if (confirm(confirmMsg)) {
            setUpdatingStatus(true);
            router.patch(route('courses.status', course.id), { status }, {
                onFinish: () => setUpdatingStatus(false)
            });
        }
    };

    const bloomColors: Record<string, { bg: string; text: string; border: string }> = {
        remember: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
        understand: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
        apply: { bg: 'bg-sky-50', text: 'text-[#1E5E8A]', border: 'border-sky-300' },
        analyse: { bg: 'bg-blue-50', text: 'text-[#14648c]', border: 'border-blue-300' },
        evaluate: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-300' },
        create: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300' }
    };

    const pendingFlags = flags.filter(f => f.resolution_status === 'pending');
    const resolvedFlags = flags.filter(f => f.resolution_status !== 'pending');

    return (
        <AuthenticatedLayout>
            <Head title={`ACMIS - Alignment: ${course.code}`} />

            <div className="space-y-4">
                {/* ACMIS Course Banner Card */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                    <div className="border-b border-slate-200 px-4 py-2.5 bg-[#f8fafc] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <Link
                                href={route('courses.index')}
                                className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 transition"
                                title="Back to Courses"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-black text-[#1E5E8A]">
                                        {course.code}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded border ${
                                        course.version_type === 'cbet_revised'
                                            ? 'bg-sky-50 text-[#1b688b] border-sky-200'
                                            : 'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}>
                                        {course.version_type === 'cbet_revised' ? 'CBET Revised' : 'Legacy Outline'}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-semibold">
                                        Lecturer: <strong>{course.lecturer_name || 'Dr. Stephen Lumu'}</strong>
                                    </span>
                                </div>
                                <h1 className="text-sm font-black text-slate-900 uppercase">
                                    {course.title}
                                </h1>
                            </div>
                        </div>

                        {/* Top Action Buttons based on User Role */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* QA Officer Accreditation Action */}
                            {canApproveAccreditation && (
                                <button
                                    onClick={() => handleSetCourseStatus('approved')}
                                    disabled={updatingStatus}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#198754] hover:bg-[#157347] text-white rounded text-[11px] font-bold uppercase tracking-wider shadow-xs transition"
                                    title="Officially certify outline for NCHE submission"
                                >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>OFFICIALLY ACCREDIT</span>
                                </button>
                            )}

                            {/* Committee Revision Action */}
                            {canRequestRevision && course.alignment_status !== 'requires_revision' && (
                                <button
                                    onClick={() => handleSetCourseStatus('requires_revision')}
                                    disabled={updatingStatus}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded text-[11px] font-bold uppercase tracking-wider shadow-xs transition"
                                    title="Request lecturer to revise unaligned outcomes"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>REQUEST REVISION</span>
                                </button>
                            )}

                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-[11px] font-bold uppercase tracking-tight transition"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                <span>EXPORT</span>
                            </button>

                            <button
                                onClick={handleRunCheck}
                                disabled={runningCheck}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1b688b] hover:bg-[#165775] text-white rounded text-[11px] font-bold uppercase tracking-wider shadow-xs transition disabled:opacity-50"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${runningCheck ? 'animate-spin' : ''}`} />
                                <span>{runningCheck ? 'RUNNING ML...' : 'RE-RUN CBET AUDIT'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Metric Bar */}
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white">
                        <div className="p-3 bg-[#f8fafc] rounded border border-slate-200 text-center">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Alignment Score</div>
                            <div className={`text-xl font-black mt-0.5 ${
                                (course.alignment_score || 0) >= 80 ? 'text-[#198754]' :
                                (course.alignment_score || 0) >= 60 ? 'text-amber-600' : 'text-rose-600'
                            }`}>
                                {course.alignment_score !== null ? `${course.alignment_score}%` : 'Pending'}
                            </div>
                        </div>

                        <div className="p-3 bg-[#f8fafc] rounded border border-slate-200 text-center">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Learning Outcomes</div>
                            <div className="text-xl font-black text-[#1E5E8A] mt-0.5">{outcomes.length}</div>
                        </div>

                        <div className="p-3 bg-[#f8fafc] rounded border border-slate-200 text-center">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Assessments</div>
                            <div className="text-xl font-black text-[#1E5E8A] mt-0.5">{assessments.length}</div>
                        </div>

                        <div className="p-3 bg-[#f8fafc] rounded border border-slate-200 text-center">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending Flags</div>
                            <div className="text-xl font-black text-rose-600 mt-0.5">{pendingFlags.length}</div>
                        </div>
                    </div>
                </div>

                {/* ACMIS Tab Strip */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                    <div className="border-b border-slate-200 px-4 py-2 flex items-center gap-6 bg-white">
                        <button
                            onClick={() => setActiveTab('outcomes')}
                            className={`pb-1 text-xs font-bold uppercase tracking-tight border-b-2 flex items-center gap-1.5 transition ${
                                activeTab === 'outcomes'
                                    ? 'border-[#1b688b] text-[#1b688b]'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>1. Outcomes & Bloom Quality ({outcomes.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('assessments')}
                            className={`pb-1 text-xs font-bold uppercase tracking-tight border-b-2 flex items-center gap-1.5 transition ${
                                activeTab === 'assessments'
                                    ? 'border-[#1b688b] text-[#1b688b]'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Scale className="w-3.5 h-3.5" />
                            <span>2. Assessment Tasks ({assessments.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('flags')}
                            className={`pb-1 text-xs font-bold uppercase tracking-tight border-b-2 flex items-center gap-1.5 transition ${
                                activeTab === 'flags'
                                    ? 'border-[#1b688b] text-[#1b688b]'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>
                                {canResolveFlags
                                    ? `3. Committee Flag Decisions (${flags.length})`
                                    : `3. Review Recommendations (${flags.length})`}
                            </span>
                            {pendingFlags.length > 0 && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-600 text-white font-black">
                                    {pendingFlags.length}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="p-4">
                        {/* TAB 1: Outcomes & Bloom's Quality */}
                        {activeTab === 'outcomes' && (
                            <div className="space-y-3">
                                {isLecturer && (
                                    <div className="p-3 bg-sky-50 border border-sky-200 rounded text-xs text-[#1E5E8A] flex items-center gap-2">
                                        <Info className="w-4 h-4 shrink-0 text-[#1b688b]" />
                                        <span>
                                            <strong>Lecturer Workspace:</strong> Review each Course Learning Outcome (CLO). Any vague verbs (e.g. <em>understand, know</em>) will be flagged. Click <strong>Edit</strong> to rewrite using measurable action verbs.
                                        </span>
                                    </div>
                                )}

                                {outcomes.map((clo) => {
                                    const badge = clo.bloom_level ? bloomColors[clo.bloom_level] : bloomColors.understand;
                                    return (
                                        <div
                                            key={clo.id}
                                            className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition space-y-2.5 shadow-2xs"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                                        CLO #{clo.outcome_number}
                                                    </span>
                                                    {clo.bloom_level && (
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}>
                                                            Bloom: {clo.bloom_level} ({Math.round(clo.bloom_confidence * 100)}%)
                                                        </span>
                                                    )}
                                                    {clo.action_verb && (
                                                        <span className="text-[10px] text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                                                            Verb: <strong className="text-[#1E5E8A]">{clo.action_verb}</strong>
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {!clo.is_measurable ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            Non-Measurable Verb
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Measurable
                                                        </span>
                                                    )}

                                                    <button
                                                        onClick={() => {
                                                            setEditingOutcomeId(clo.id);
                                                            setEditOutcomeText(clo.description);
                                                        }}
                                                        className="inline-flex items-center gap-1 text-[11px] text-[#1b688b] hover:underline font-bold px-2 py-0.5"
                                                    >
                                                        <Edit3 className="w-3 h-3" /> Edit
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Description or Inline Editor */}
                                            {editingOutcomeId === clo.id ? (
                                                <div className="space-y-2 p-3 bg-[#f0f5fa] rounded border border-[#d2e0ec]">
                                                    <label className="block text-[11px] font-bold text-[#1E5E8A] uppercase">
                                                        Edit Outcome Text (Measurable verb required):
                                                    </label>
                                                    <textarea
                                                        value={editOutcomeText}
                                                        onChange={(e) => setEditOutcomeText(e.target.value)}
                                                        rows={2}
                                                        className="w-full text-xs rounded border-[#d2e0ec] focus:border-[#1b688b] focus:ring-[#1b688b]"
                                                    />
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setEditingOutcomeId(null)}
                                                            className="px-3 py-1 text-xs font-bold text-slate-600 hover:text-slate-800"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleSaveOutcome(clo.id)}
                                                            className="px-3.5 py-1 bg-[#1b688b] hover:bg-[#165775] text-white text-xs font-bold rounded shadow-xs uppercase tracking-wider"
                                                        >
                                                            Save & Re-Check
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                                                    {clo.description}
                                                </p>
                                            )}

                                            {/* Vague Verb Suggestion Alert */}
                                            {!clo.is_measurable && clo.suggested_verbs && clo.suggested_verbs.length > 0 && (
                                                <div className="p-2.5 rounded bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                                                    <div className="font-bold flex items-center gap-1 text-[11px]">
                                                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                                                        <span>Suggested Measurable Alternatives:</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {clo.suggested_verbs.map((verb) => (
                                                            <button
                                                                key={verb}
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingOutcomeId(clo.id);
                                                                    setEditOutcomeText(clo.description.replace(new RegExp(`\\b${clo.action_verb}\\b`, 'i'), verb));
                                                                }}
                                                                className="px-2 py-0.5 rounded bg-white border border-amber-300 text-amber-900 text-[10px] font-bold hover:bg-amber-100 transition shadow-2xs"
                                                            >
                                                                + {verb}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Semantic Alignment Link */}
                                            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                                                <span className="font-bold text-slate-700">Programme Competence Link:</span>
                                                {clo.competence_links && clo.competence_links.length > 0 ? (
                                                    clo.competence_links.map((link) => (
                                                        <span
                                                            key={link.id}
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f0f5fa] text-[#1E5E8A] rounded font-semibold border border-[#d2e0ec]"
                                                        >
                                                            <Target className="w-3 h-3 text-[#1b688b]" />
                                                            <span>[{link.programme_competence?.code}] {link.programme_competence?.title}</span>
                                                            <span className="text-[#1b688b] font-black">
                                                                ({Math.round(link.similarity_score * 100)}%)
                                                            </span>
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-rose-600 font-bold italic">
                                                        Unmapped to programme competences!
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* TAB 2: Assessments */}
                        {activeTab === 'assessments' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {assessments.map((ass) => (
                                    <div
                                        key={ass.id}
                                        className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-2.5"
                                    >
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-50 text-[#1b688b] border border-sky-200">
                                                    {ass.type.replace('_', ' ')}
                                                </span>
                                                <span className="text-sm font-black text-[#1E5E8A]">
                                                    {ass.weight_percentage}%
                                                </span>
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-900">{ass.title}</h4>
                                            <p className="text-[11px] text-slate-600 leading-relaxed">{ass.description}</p>
                                        </div>

                                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                                            <span>Authentic Assessment</span>
                                            <span className="text-[#198754] font-bold flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> Aligned
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TAB 3: Human-in-the-Loop Flags & Decisions */}
                        {activeTab === 'flags' && (
                            <div className="space-y-3">
                                {/* Role Instructions Notice */}
                                <div className={`p-3 rounded border text-xs flex items-center justify-between ${
                                    canResolveFlags
                                        ? 'bg-purple-50 border-purple-200 text-purple-900'
                                        : 'bg-sky-50 border-sky-200 text-[#1E5E8A]'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <Info className="w-4 h-4 shrink-0" />
                                        <span>
                                            {canResolveFlags
                                                ? 'Review Committee Governance: Adjudicate each flag by selecting Accept (requires revision) or Reject (valid academic reason), providing an NCHE audit justification note.'
                                                : 'Lecturer Action Required: The items below have been flagged by the Machine Learning audit. Please edit your learning outcomes above to address each recommendation.'}
                                        </span>
                                    </div>
                                    <span className="font-bold uppercase text-[10px] shrink-0">
                                        {user?.role} Access
                                    </span>
                                </div>

                                {flags.length === 0 ? (
                                    <div className="bg-white p-8 text-center rounded-lg border border-slate-200 text-slate-400 text-xs italic">
                                        No flags detected. Click "RE-RUN CBET AUDIT" above to re-evaluate with ML.
                                    </div>
                                ) : (
                                    flags.map((f) => (
                                        <div
                                            key={f.id}
                                            className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-2.5"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                <div className="space-y-1 max-w-3xl">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <span className={`px-2 py-0.2 rounded text-[9px] font-black uppercase tracking-wider ${
                                                            f.severity === 'error' ? 'bg-rose-100 text-rose-800' :
                                                            f.severity === 'warning' ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-[#1b688b]'
                                                        }`}>
                                                            {f.severity}
                                                        </span>
                                                        <span className="text-[10px] font-bold uppercase text-slate-400">
                                                            {f.check_type.replace('_', ' ')}
                                                        </span>
                                                        <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase ${
                                                            f.resolution_status === 'accepted' ? 'bg-[#198754] text-white' :
                                                            f.resolution_status === 'rejected' ? 'bg-slate-200 text-slate-800' :
                                                            f.resolution_status === 'edited' ? 'bg-[#1b688b] text-white' :
                                                            'border border-amber-300 bg-amber-50 text-amber-800'
                                                        }`}>
                                                            {f.resolution_status}
                                                        </span>
                                                    </div>

                                                    <h4 className="text-xs font-bold text-slate-900">{f.flag_title}</h4>
                                                    <p className="text-[11px] text-slate-600 leading-relaxed">{f.flag_reason}</p>

                                                    {f.suggested_action && (
                                                        <div className="p-2.5 bg-[#f0f5fa] rounded border border-[#d2e0ec] text-[11px] text-slate-700 font-medium mt-1.5">
                                                            <strong>Suggested Action:</strong> {f.suggested_action}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Role-Specific Action Controls */}
                                                <div className="shrink-0">
                                                    {canResolveFlags ? (
                                                        f.resolution_status === 'pending' ? (
                                                            <button
                                                                onClick={() => {
                                                                    setActiveFlagId(f.id);
                                                                    setFlagDecision('accepted');
                                                                }}
                                                                className="px-3 py-1.5 bg-[#1b688b] hover:bg-[#165775] text-white rounded text-[11px] font-bold uppercase tracking-wider shadow-xs transition"
                                                            >
                                                                Resolve Flag
                                                            </button>
                                                        ) : (
                                                            <div className="text-right text-[11px] bg-slate-50 p-2 rounded border border-slate-200">
                                                                <div className="font-bold text-slate-800 uppercase">{f.resolution_status}</div>
                                                                <div className="text-[10px] text-slate-500 italic mt-0.5">{f.resolution_note}</div>
                                                            </div>
                                                        )
                                                    ) : (
                                                        /* Lecturer View: Action button to jump to outcome editing */
                                                        <button
                                                            onClick={() => setActiveTab('outcomes')}
                                                            className="px-3 py-1.5 bg-sky-50 border border-sky-300 text-[#1E5E8A] hover:bg-sky-100 rounded text-[11px] font-bold uppercase tracking-wider transition"
                                                        >
                                                            ✏ Fix in Outcomes
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Committee Resolution Form Box (Only for Committee / QA) */}
                                            {canResolveFlags && activeFlagId === f.id && (
                                                <div className="mt-2.5 p-3 bg-[#f8fafc] rounded border border-slate-200 space-y-2.5">
                                                    <div className="text-[11px] font-bold text-slate-800 uppercase flex items-center justify-between">
                                                        <span>Curriculum Review Committee Resolution Decision:</span>
                                                        <span className="text-[10px] text-purple-700 font-bold">NCHE Statutory Audit Trail</span>
                                                    </div>
                                                    <div className="flex gap-4 text-xs font-semibold">
                                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="decision"
                                                                checked={flagDecision === 'accepted'}
                                                                onChange={() => setFlagDecision('accepted')}
                                                                className="text-[#1b688b] focus:ring-[#1b688b]"
                                                            />
                                                            Accept Flag (Outline requires revision)
                                                        </label>
                                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="decision"
                                                                checked={flagDecision === 'rejected'}
                                                                onChange={() => setFlagDecision('rejected')}
                                                                className="text-[#1b688b] focus:ring-[#1b688b]"
                                                            />
                                                            Reject Flag (Valid academic justification)
                                                        </label>
                                                    </div>

                                                    <input
                                                        type="text"
                                                        placeholder="Enter formal justification note for NCHE compliance audit..."
                                                        value={flagNote}
                                                        onChange={(e) => setFlagNote(e.target.value)}
                                                        className="w-full text-xs rounded bg-white border-slate-300"
                                                    />

                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setActiveFlagId(null)}
                                                            className="px-3 py-1 text-xs font-semibold text-slate-600"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleResolveFlag(f.id)}
                                                            className="px-3.5 py-1 bg-[#1b688b] hover:bg-[#165775] text-white text-xs font-bold rounded shadow-xs uppercase tracking-wider"
                                                        >
                                                            Submit Decision
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
