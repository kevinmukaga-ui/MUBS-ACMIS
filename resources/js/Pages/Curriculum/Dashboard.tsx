import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    FileText,
    Layers,
    TrendingUp,
    ShieldAlert,
    ExternalLink,
    Briefcase,
    Sparkles,
    ArrowUpRight,
    Search,
    BookOpenCheck,
    Check,
    GraduationCap,
    School,
    RefreshCw,
    Filter,
    Info,
    ShieldCheck,
    BookOpen,
    Scale,
    ChevronRight,
    Award
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface Programme {
    id: number;
    code: string;
    name: string;
    faculty: string;
    course_units_count: number;
    competences_count: number;
}

interface CourseUnit {
    id: number;
    code: string;
    title: string;
    year_of_study: number;
    semester: number;
    credit_units: number;
    version_type: 'old' | 'cbet_revised';
    alignment_status: 'pending' | 'checked' | 'requires_revision' | 'approved';
    alignment_score: number | null;
    programme: {
        code: string;
        name: string;
    };
}

interface Props {
    programmes: Programme[];
    recentCourses: CourseUnit[];
    flagsCount: {
        total: number;
        errors: number;
        warnings: number;
        info: number;
    };
    bloomDistribution: Record<string, number>;
    complianceRate: number;
    totalUnits: number;
}

export default function Dashboard({
    programmes,
    recentCourses,
    flagsCount,
    bloomDistribution,
    complianceRate,
    totalUnits
}: Props) {
    const user = usePage().props.auth.user;
    const isLecturer = user?.is_lecturer || user?.role === 'lecturer';
    const isCommittee = user?.is_committee || user?.role === 'committee_member' || user?.role === 'coordinator';
    const isQA = user?.is_qa || user?.role === 'qa_officer' || user?.role === 'admin';

    const [activeTab, setActiveTab] = useState<'overview' | 'bloom' | 'programmes'>('overview');
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [selectedProg, setSelectedProg] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isReloading, setIsReloading] = useState(false);

    // ACMIS Institutional Palette for Bloom's Taxonomy
    const bloomColors: Record<string, string> = {
        remember: '#64748b',
        understand: '#d97706',
        apply: '#1E5E8A',
        analyse: '#0284c7',
        evaluate: '#b91c1c',
        create: '#198754'
    };

    const totalBloomVerbs = Object.values(bloomDistribution || {}).reduce((acc, v) => acc + (v || 0), 0) || 1;
    const higherOrderCount =
        (bloomDistribution.apply || 0) +
        (bloomDistribution.analyse || 0) +
        (bloomDistribution.evaluate || 0) +
        (bloomDistribution.create || 0);
    const higherOrderPct = Math.round((higherOrderCount / totalBloomVerbs) * 100);

    const chartData = [
        {
            level: 'Remember',
            count: bloomDistribution.remember || 0,
            pct: Math.round(((bloomDistribution.remember || 0) / totalBloomVerbs) * 100),
            color: bloomColors.remember,
            desc: 'Recall terms & facts',
            verbs: 'Define, identify, list, name, recall, state'
        },
        {
            level: 'Understand',
            count: bloomDistribution.understand || 0,
            pct: Math.round(((bloomDistribution.understand || 0) / totalBloomVerbs) * 100),
            color: bloomColors.understand,
            desc: 'Explain concepts & ideas',
            verbs: 'Describe, explain, discuss, classify, summarize'
        },
        {
            level: 'Apply',
            count: bloomDistribution.apply || 0,
            pct: Math.round(((bloomDistribution.apply || 0) / totalBloomVerbs) * 100),
            color: bloomColors.apply,
            desc: 'Execute procedures & SQL code',
            verbs: 'Implement, execute, compute, manipulate, use'
        },
        {
            level: 'Analyse',
            count: bloomDistribution.analyse || 0,
            pct: Math.round(((bloomDistribution.analyse || 0) / totalBloomVerbs) * 100),
            color: bloomColors.analyse,
            desc: 'Model data & troubleshoot systems',
            verbs: 'Differentiate, model, examine, diagnose, deconstruct'
        },
        {
            level: 'Evaluate',
            count: bloomDistribution.evaluate || 0,
            pct: Math.round(((bloomDistribution.evaluate || 0) / totalBloomVerbs) * 100),
            color: bloomColors.evaluate,
            desc: 'Audit security & verify standards',
            verbs: 'Appraise, evaluate, audit, validate, assess'
        },
        {
            level: 'Create',
            count: bloomDistribution.create || 0,
            pct: Math.round(((bloomDistribution.create || 0) / totalBloomVerbs) * 100),
            color: bloomColors.create,
            desc: 'Architect & build full software',
            verbs: 'Design, develop, formulate, build, innovate'
        }
    ];

    const filteredCourses = recentCourses.filter((course) => {
        const matchesYear = selectedYear === 'all' || course.year_of_study.toString() === selectedYear;
        const matchesProg = selectedProg === 'all' || course.programme?.code === selectedProg;
        const matchesSearch =
            searchQuery.trim() === '' ||
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesYear && matchesProg && matchesSearch;
    });

    const reloadData = () => {
        setIsReloading(true);
        router.reload({
            onFinish: () => {
                setTimeout(() => setIsReloading(false), 400);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="ACMIS Dashboard - Curriculum Alignment" />

            <div className="space-y-4">
                {/* Role Specific Governance Banner */}
                <div
                    className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-2xs transition-colors duration-200 ${
                        isLecturer
                            ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-[#1E5E8A] dark:text-sky-300'
                            : isCommittee
                            ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-300'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        {isLecturer ? (
                            <BookOpen className="w-4 h-4 text-[#1b688b] dark:text-sky-400 shrink-0" />
                        ) : isCommittee ? (
                            <Scale className="w-4 h-4 text-purple-700 dark:text-purple-400 shrink-0" />
                        ) : (
                            <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                        )}
                        <div>
                            <span className="font-extrabold uppercase">
                                {isLecturer
                                    ? 'Course Lecturer Workspace: '
                                    : isCommittee
                                    ? 'Curriculum Review Committee Workspace: '
                                    : 'Quality Assurance Directorate Oversight: '}
                            </span>
                            <span className="text-slate-600 dark:text-slate-300">
                                {isLecturer
                                    ? 'Analyze your course outlines, eliminate vague action verbs, and ensure constructive alignment with assessments.'
                                    : isCommittee
                                    ? 'Evaluate whole-programme alignment matrices, adjudicate ML flags with justification notes, and ensure all competences are covered.'
                                    : 'Monitor cross-faculty compliance for statutory NCHE 2027/28 re-accreditation and issue official CBET accreditation sign-offs.'}
                            </span>
                        </div>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white dark:bg-[#151f38] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0 self-start sm:self-center">
                        Access: {user?.role || 'Lecturer'}
                    </span>
                </div>

                {/* 4 ACMIS Key Metric KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white dark:bg-[#151f38] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                                Verified CBET Rate
                            </span>
                            <CheckCircle2 className="w-4 h-4 text-[#198754] dark:text-emerald-400" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-black text-[#1E5E8A] dark:text-sky-400">{complianceRate}%</span>
                            <span className="bg-[#198754] text-white text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                                Compliant
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div
                                className="bg-[#198754] dark:bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${complianceRate}%` }}
                            />
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            Constructively aligned to Biggs' model
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#151f38] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                                Active Audit Flags
                            </span>
                            <ShieldAlert className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-black text-orange-700 dark:text-orange-400">{flagsCount.total}</span>
                            <span className="border border-orange-300 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                                {flagsCount.errors} Critical
                            </span>
                        </div>
                        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                            {flagsCount.warnings} warnings needing lecturer review
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#151f38] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                                Degrees in Scope
                            </span>
                            <School className="w-4 h-4 text-[#1b688b] dark:text-sky-400" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-black text-[#1E5E8A] dark:text-sky-400">{programmes.length}</span>
                            <span className="bg-[#14648c] text-white text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                                Programmes
                            </span>
                        </div>
                        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                            BBC, BOIM (Computing) & BCOM
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#151f38] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                                Evaluated Outlines
                            </span>
                            <BookOpenCheck className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-black text-[#1E5E8A] dark:text-sky-400">{totalUnits}</span>
                            <span className="border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                                Syllabi
                            </span>
                        </div>
                        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                            Legacy vs. CBET outline comparisons
                        </p>
                    </div>
                </div>

                {/* Main ACMIS Card Container with Dynamic Active Tab Body */}
                <div className="bg-white dark:bg-[#151f38] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-200">
                    {/* Tab Strip with Animated Reload Button */}
                    <div className="border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between bg-white dark:bg-[#151f38] transition-colors duration-200">
                        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto">
                            <button
                                type="button"
                                onClick={() => setActiveTab('overview')}
                                className={`flex items-center gap-1.5 py-1 text-xs font-bold uppercase tracking-tight border-b-2 transition-all duration-200 cursor-pointer ${
                                    activeTab === 'overview'
                                        ? 'border-[#1b688b] text-[#1b688b] dark:border-sky-400 dark:text-sky-400'
                                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                <FileText className="w-3.5 h-3.5" />
                                <span>CURRICULUM AUDIT</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('bloom')}
                                className={`flex items-center gap-1.5 py-1 text-xs font-bold uppercase tracking-tight border-b-2 transition-all duration-200 cursor-pointer ${
                                    activeTab === 'bloom'
                                        ? 'border-[#1b688b] text-[#1b688b] dark:border-sky-400 dark:text-sky-400'
                                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                <Layers className="w-3.5 h-3.5" />
                                <span>BLOOM'S TAXONOMY</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('programmes')}
                                className={`flex items-center gap-1.5 py-1 text-xs font-bold uppercase tracking-tight border-b-2 transition-all duration-200 cursor-pointer ${
                                    activeTab === 'programmes'
                                        ? 'border-[#1b688b] text-[#1b688b] dark:border-sky-400 dark:text-sky-400'
                                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                <School className="w-3.5 h-3.5" />
                                <span>TARGET DEGREES</span>
                            </button>
                        </div>

                        {/* Top-Right ACMIS Outline Reload Button */}
                        <button
                            type="button"
                            onClick={reloadData}
                            disabled={isReloading}
                            className="inline-flex items-center gap-1 px-3 py-1 border border-orange-400 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 active:scale-95 rounded text-[11px] font-bold uppercase tracking-tight transition-all duration-200 shadow-2xs shrink-0"
                        >
                            <RefreshCw className={`w-3 h-3 ${isReloading ? 'animate-spin' : ''}`} />
                            <span>{isReloading ? 'RELOADING...' : 'RELOAD'}</span>
                        </button>
                    </div>

                    {/* DYNAMIC TAB 1: CURRICULUM AUDIT (Filter Row + Courses Table) */}
                    {activeTab === 'overview' && (
                        <div>
                            {/* Inner Header Bar */}
                            <div className="bg-[#f8fafc] dark:bg-[#101a33] border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
                                <span className="font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-tight flex items-center gap-2">
                                    <span>AUDIT COHORT: <strong>SEMESTER I, 2026/2027</strong></span>
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                </span>
                                <span className="font-bold text-[#1E5E8A] dark:text-sky-400 uppercase tracking-tight">
                                    {selectedProg === 'all' ? 'FACULTY OF COMPUTING & COMMERCE' : `PROG: ${selectedProg}`}
                                </span>
                            </div>

                            {/* Interactive Filter Controls */}
                            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151f38]">
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            YEAR OF STUDY
                                        </label>
                                        <select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                            className="w-full text-xs bg-[#f0f5fa] dark:bg-[#0b1329] border border-[#d2e0ec] dark:border-slate-700 rounded py-2 px-3 text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0b1329] focus:border-[#1b688b] dark:focus:border-sky-500 focus:ring-1 focus:ring-[#1b688b] transition-colors"
                                        >
                                            <option value="all">-- All Academic Years --</option>
                                            <option value="1">Year 1 (CBET Foundation)</option>
                                            <option value="2">Year 2 (Core Competences)</option>
                                            <option value="3">Year 3 (Capstone & Specialization)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            DEGREE PROGRAMME
                                        </label>
                                        <select
                                            value={selectedProg}
                                            onChange={(e) => setSelectedProg(e.target.value)}
                                            className="w-full text-xs bg-[#f0f5fa] dark:bg-[#0b1329] border border-[#d2e0ec] dark:border-slate-700 rounded py-2 px-3 text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0b1329] focus:border-[#1b688b] dark:focus:border-sky-500 focus:ring-1 focus:ring-[#1b688b] transition-colors"
                                        >
                                            <option value="all">-- All Degree Programmes --</option>
                                            {programmes.map((p) => (
                                                <option key={p.code} value={p.code}>
                                                    {p.code} - {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            SEARCH OUTLINE
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Code or course title..."
                                                className="w-full text-xs bg-[#f0f5fa] dark:bg-[#0b1329] border border-[#d2e0ec] dark:border-slate-700 rounded py-2 pl-8 pr-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#0b1329] focus:border-[#1b688b] dark:focus:border-sky-500 focus:ring-1 focus:ring-[#1b688b] transition-colors"
                                            />
                                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                                        </div>
                                    </div>

                                    <div>
                                        <Link
                                            href={route('courses.create')}
                                            className="w-full bg-[#1b688b] hover:bg-[#165775] active:scale-98 text-white font-bold py-2 px-4 rounded text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-all duration-200"
                                        >
                                            <span>+ SUBMIT OUTLINE</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Evaluated Courses Table */}
                            <div>
                                <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[#f8fafc] dark:bg-[#101a33] border-b border-slate-200 dark:border-slate-800">
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-tight text-[#1E5E8A] dark:text-sky-400 flex items-center gap-1.5">
                                            <span>{isLecturer ? 'My Assigned Course Outlines & Quality Audit Reports' : 'Evaluated Course Outlines & Quality Audit Reports'}</span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                                {filteredCourses.length} of {totalUnits}
                                            </span>
                                        </h3>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            {isLecturer
                                                ? 'Inspect immediate machine learning feedback on your course outlines and fix non-measurable verbs'
                                                : 'Click any course unit to inspect the 4 CBET verification checks and human-in-the-loop audit logs'}
                                        </p>
                                    </div>

                                    <div>
                                        <Link
                                            href={route('courses.index')}
                                            className="text-xs font-bold text-[#1b688b] dark:text-sky-400 hover:underline inline-flex items-center gap-1 uppercase transition-colors"
                                        >
                                            View All Syllabi ({totalUnits}) <ArrowUpRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs">
                                        <thead className="bg-[#f1f5f9] dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                                            <tr>
                                                <th className="px-5 py-3">Course Code & Title</th>
                                                <th className="px-5 py-3">Prog</th>
                                                <th className="px-5 py-3">Version</th>
                                                <th className="px-5 py-3">Alignment Score</th>
                                                <th className="px-5 py-3">CBET Status</th>
                                                <th className="px-5 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-[#151f38]">
                                            {filteredCourses.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                                                        No course outlines match your selected filter criteria.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredCourses.map((c) => (
                                                    <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors duration-150">
                                                        <td className="px-5 py-3.5">
                                                            <div className="font-extrabold text-xs text-[#1E5E8A] dark:text-sky-400 font-mono">{c.code}</div>
                                                            <div className="text-slate-800 dark:text-slate-100 font-bold text-xs mt-0.5">{c.title}</div>
                                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Year {c.year_of_study}, Sem {c.semester} • {c.credit_units} CU</div>
                                                        </td>
                                                        <td className="px-5 py-3.5">
                                                            <span className="font-bold text-slate-800 dark:text-slate-200">{c.programme?.code}</span>
                                                        </td>
                                                        <td className="px-5 py-3.5">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                                                c.version_type === 'cbet_revised'
                                                                    ? 'bg-sky-50 dark:bg-sky-950/40 text-[#1b688b] dark:text-sky-300 border-sky-200 dark:border-sky-800'
                                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                                            }`}>
                                                                {c.version_type === 'cbet_revised' ? 'CBET Revised' : 'Legacy Outline'}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3.5">
                                                            {c.alignment_score !== null ? (
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className={`font-black text-xs ${
                                                                        c.alignment_score >= 80 ? 'text-[#198754] dark:text-emerald-400' :
                                                                        c.alignment_score >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                                                                    }`}>
                                                                        {c.alignment_score}%
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-slate-400 italic text-[11px]">Pending</span>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-3.5">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                                c.alignment_status === 'checked' || c.alignment_status === 'approved'
                                                                    ? 'bg-[#198754] text-white shadow-2xs' :
                                                                c.alignment_status === 'requires_revision'
                                                                    ? 'border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400' :
                                                                    'border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                                                            }`}>
                                                                {c.alignment_status === 'checked' ? 'CBET APPROVED' :
                                                                 c.alignment_status === 'requires_revision' ? 'REVISION REQUIRED' : 'UNDER AUDIT'}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3.5 text-right">
                                                            <Link
                                                                href={route('courses.show', c.id)}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1b688b] hover:bg-[#165775] active:scale-95 text-white rounded text-[11px] font-bold transition-all duration-200 shadow-2xs uppercase tracking-tight"
                                                            >
                                                                INSPECT
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC TAB 2: BLOOM'S TAXONOMY WORKSPACE */}
                    {activeTab === 'bloom' && (
                        <div className="p-4 sm:p-6 space-y-6">
                            {/* Inner Header Bar */}
                            <div className="bg-[#f8fafc] dark:bg-[#101a33] -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-tight text-[#1E5E8A] dark:text-sky-400 flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-[#1b688b] dark:text-sky-400" />
                                        <span>BLOOM'S REVISED TAXONOMY (ANDERSON & KRATHWOHL, 2001)</span>
                                    </h3>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        Automated NLP machine learning classification of Course Learning Outcomes (CLOs) into 6 cognitive hierarchy levels.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-[#1b688b] dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 px-2.5 py-1 rounded">
                                        Higher-Order Cognitive Engagement: <strong>{higherOrderPct}%</strong> (Target ≥ 65%)
                                    </span>
                                </div>
                            </div>

                            {/* Visual Chart Card */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                                        Cognitive Depth Distribution ({totalBloomVerbs} Evaluated Outcomes)
                                    </span>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                                        Undergraduate University Standard: Heavy concentration in Apply, Analyse & Create
                                    </span>
                                </div>

                                <div className="h-64 w-full bg-slate-50 dark:bg-[#0b1329] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                                            <XAxis dataKey="level" tick={{ fontSize: 11, fontWeight: 700, fill: '#1E5E8A' }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#ffffff',
                                                    borderRadius: '8px',
                                                    border: '1px solid #cbd5e1',
                                                    color: '#1e293b',
                                                    fontSize: '11px',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.08)'
                                                }}
                                            />
                                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* 6 Detailed Cognitive Level Breakdown Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {chartData.map((item) => (
                                    <div
                                        key={item.level}
                                        className="p-3.5 rounded-lg bg-[#f8fafc] dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 hover:border-[#1b688b] dark:hover:border-sky-500 transition-all duration-200 shadow-2xs space-y-1.5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase text-[#1E5E8A] dark:text-sky-400">
                                                {item.level}
                                            </span>
                                            <span
                                                className="text-[10px] font-black px-2 py-0.5 rounded text-white"
                                                style={{ backgroundColor: item.color }}
                                            >
                                                {item.count} outcomes ({item.pct}%)
                                            </span>
                                        </div>
                                        <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                            {item.desc}
                                        </div>
                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                                            <span className="font-bold text-slate-600 dark:text-slate-300">Action Verbs: </span>
                                            <span>{item.verbs}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quality Assurance Alert: Measurability Guidance */}
                            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs space-y-2">
                                <div className="flex items-center gap-2 font-black text-amber-900 dark:text-amber-300 uppercase tracking-tight">
                                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                                    <span>NCHE CBET Audit Rule: Measurable Action Verbs Enforcement</span>
                                </div>
                                <p className="text-amber-800 dark:text-amber-200 text-[11px] leading-relaxed">
                                    Under NCHE guidelines (2024) and Biggs' constructive alignment, learning outcomes must use <strong>overt, measurable action verbs</strong>. Non-measurable verbs such as <em>"understand"</em>, <em>"know"</em>, <em>"appreciate"</em>, or <em>"be familiar with"</em> are automatically flagged by the ML audit engine and will block CBET certification until rewritten as <em>"Demonstrate"</em>, <em>"Formulate"</em>, <em>"Execute"</em>, or <em>"Model"</em>.
                                </p>
                                <div className="pt-1 flex items-center justify-end">
                                    <Link
                                        href={route('courses.index')}
                                        className="text-[11px] font-bold text-amber-900 dark:text-amber-300 underline hover:text-amber-700 inline-flex items-center gap-1 uppercase"
                                    >
                                        Inspect Course Syllabi For Flagged Verbs <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC TAB 3: TARGET DEGREE PROGRAMMES */}
                    {activeTab === 'programmes' && (
                        <div className="p-4 sm:p-6 space-y-6">
                            {/* Inner Header Bar */}
                            <div className="bg-[#f8fafc] dark:bg-[#101a33] -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-tight text-[#1E5E8A] dark:text-sky-400 flex items-center gap-2">
                                        <School className="w-4 h-4 text-[#1b688b] dark:text-sky-400" />
                                        <span>TARGET DEGREE PROGRAMMES & NCHE RE-ACCREDITATION SCOPE</span>
                                    </h3>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        Statutory CBET curriculum alignment for academic programmes under the 2027/2028 NCHE re-accreditation mandate.
                                    </p>
                                </div>

                                <Link
                                    href={route('industry.gaps')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f5fa] dark:bg-[#0b1329] hover:bg-[#e4eff8] dark:hover:bg-slate-800 text-[#1b688b] dark:text-sky-400 text-xs font-bold rounded border border-[#d2e0ec] dark:border-slate-700 transition"
                                >
                                    <Briefcase className="w-3.5 h-3.5" />
                                    <span>INDUSTRY GAPS MATRIX</span>
                                </Link>
                            </div>

                            {/* 3 Detailed Programme Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {programmes.map((prog) => (
                                    <div
                                        key={prog.id}
                                        className="bg-[#f8fafc] dark:bg-[#0b1329] rounded-lg border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between hover:border-[#1b688b] dark:hover:border-sky-500 transition-all duration-200 shadow-xs group"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono font-black text-sm text-[#1E5E8A] dark:text-sky-400 group-hover:text-[#1b688b]">
                                                    {prog.code}
                                                </span>
                                                <span className="text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                                    NCHE In-Scope
                                                </span>
                                            </div>

                                            <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 leading-snug">
                                                {prog.name}
                                            </h4>

                                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                                                {prog.faculty}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                                                <div className="p-2 rounded bg-white dark:bg-[#151f38] border border-slate-200 dark:border-slate-800 text-center">
                                                    <div className="font-black text-xs text-[#1E5E8A] dark:text-sky-400">{prog.competences_count}</div>
                                                    <div className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">Competences</div>
                                                </div>
                                                <div className="p-2 rounded bg-white dark:bg-[#151f38] border border-slate-200 dark:border-slate-800 text-center">
                                                    <div className="font-black text-xs text-[#1E5E8A] dark:text-sky-400">{prog.course_units_count}</div>
                                                    <div className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">Syllabi Evaluated</div>
                                                </div>
                                            </div>

                                            <div className="space-y-1 pt-1">
                                                <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                                    <span>CBET Competency Coverage</span>
                                                    <span>100% Core</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-[#198754] h-full rounded-full w-full" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <Link
                                                href={route('programmes.matrix', prog.id)}
                                                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#1b688b] hover:bg-[#165775] text-white rounded text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-2xs"
                                            >
                                                <span>OPEN PROGRAMME MATRIX</span>
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
