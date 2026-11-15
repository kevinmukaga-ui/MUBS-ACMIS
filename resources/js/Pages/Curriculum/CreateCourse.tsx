import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    FilePlus,
    Plus,
    Trash2,
    AlertCircle,
    CheckCircle2,
    HelpCircle,
    ArrowLeft,
    Sparkles,
    Layers,
    BookOpen
} from 'lucide-react';
import { useState } from 'react';

interface Programme {
    id: number;
    code: string;
    name: string;
    competences: {
        id: number;
        code: string;
        title: string;
    }[];
}

interface Props {
    programmes: Programme[];
}

export default function CreateCourse({ programmes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        programme_id: programmes[0]?.id || 1,
        code: '',
        title: '',
        year_of_study: 1,
        semester: 1,
        credit_units: 3,
        version_type: 'cbet_revised',
        description: '',
        outcomes: [
            { description: 'Design responsive web interfaces utilizing modern front-end frameworks and accessibility standards.' },
            { description: 'Implement database queries and transactional operations using relational database engines.' }
        ],
        assessments: [
            { title: 'Continuous Assessment & Lab Project', type: 'practical_project', weight_percentage: 30, description: 'Hands-on practical development project.' },
            { title: 'Mid-Semester Competency Test', type: 'continuous_assessment', weight_percentage: 20, description: 'Scenario-based practical test in computer laboratory.' },
            { title: 'Final Examination', type: 'written_exam', weight_percentage: 50, description: 'Authentic problem-solving examination.' }
        ]
    });

    const addOutcome = () => {
        setData('outcomes', [
            ...data.outcomes,
            { description: '' }
        ]);
    };

    const removeOutcome = (index: number) => {
        if (data.outcomes.length <= 1) return;
        setData('outcomes', data.outcomes.filter((_, i) => i !== index));
    };

    const updateOutcome = (index: number, text: string) => {
        const next = [...data.outcomes];
        next[index].description = text;
        setData('outcomes', next);
    };

    const addAssessment = () => {
        setData('assessments', [
            ...data.assessments,
            { title: '', type: 'practical_project', weight_percentage: 20, description: '' }
        ]);
    };

    const removeAssessment = (index: number) => {
        if (data.assessments.length <= 1) return;
        setData('assessments', data.assessments.filter((_, i) => i !== index));
    };

    const updateAssessment = (index: number, field: string, value: any) => {
        const next = [...data.assessments];
        next[index] = { ...next[index], [field]: value };
        setData('assessments', next);
    };

    const totalWeight = data.assessments.reduce((sum, a) => sum + (Number(a.weight_percentage) || 0), 0);

    const checkVerbWarning = (text: string) => {
        const lower = text.toLowerCase().trim();
        const vague = ['understand', 'appreciate', 'know', 'be familiar with', 'learn', 'grasp'];
        for (const v of vague) {
            if (lower.startsWith(v) || lower.includes(` ${v} `)) {
                return `Detected vague verb "${v}". In CBET, prefer measurable verbs like "Analyze", "Design", "Construct", or "Evaluate".`;
            }
        }
        return null;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('courses.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="ACMIS - Submit Course Outline" />

            <div className="space-y-4">
                <form onSubmit={submit} className="space-y-4">
                    {/* Header Banner Card */}
                    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                        <div className="border-b border-slate-200 px-4 py-2.5 bg-[#f8fafc] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route('courses.index')}
                                    className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 transition"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </Link>
                                <h1 className="text-xs font-black uppercase tracking-tight text-[#1E5E8A]">
                                    Submit Course Unit Outline For CBET Audit
                                </h1>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">
                                MUBS ACMIS Portal
                            </span>
                        </div>

                        {/* 1. Identification Fields */}
                        <div className="p-4 sm:p-5 space-y-3">
                            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-[#1b688b]" />
                                <span>1. Course Unit Identification</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                        Target Programme <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.programme_id}
                                        onChange={(e) => setData('programme_id', Number(e.target.value))}
                                        className="w-full text-xs bg-[#f0f5fa] border border-[#d2e0ec] rounded py-2 px-3 text-slate-800 focus:bg-white focus:border-[#1b688b] focus:ring-1 focus:ring-[#1b688b]"
                                    >
                                        {programmes.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.code} - {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                        Course Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        placeholder="e.g. BBC 3105"
                                        className="w-full text-xs bg-[#f0f5fa] border border-[#d2e0ec] rounded py-2 px-3 text-slate-800 focus:bg-white focus:border-[#1b688b] focus:ring-1 focus:ring-[#1b688b] uppercase font-mono"
                                        required
                                    />
                                    {errors.code && <p className="text-[10px] text-rose-600 mt-1">{errors.code}</p>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                        Curriculum Version <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.version_type}
                                        onChange={(e) => setData('version_type', e.target.value as any)}
                                        className="w-full text-xs bg-[#f0f5fa] border border-[#d2e0ec] rounded py-2 px-3 text-slate-800 focus:bg-white focus:border-[#1b688b] focus:ring-1 focus:ring-[#1b688b]"
                                    >
                                        <option value="cbet_revised">CBET Revised (2026/2027)</option>
                                        <option value="old">Legacy / Old Outline</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                    Course Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Advanced Business Programming & Web Services"
                                    className="w-full text-xs bg-[#f0f5fa] border border-[#d2e0ec] rounded py-2 px-3 text-slate-800 focus:bg-white focus:border-[#1b688b] focus:ring-1 focus:ring-[#1b688b]"
                                    required
                                />
                                {errors.title && <p className="text-[10px] text-rose-600 mt-1">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                        Year of Study
                                    </label>
                                    <select
                                        value={data.year_of_study}
                                        onChange={(e) => setData('year_of_study', Number(e.target.value))}
                                        className="w-full text-xs bg-[#f0f5fa] border border-[#d2e0ec] rounded py-2 px-3 text-slate-800 focus:bg-white focus:border-[#1b688b] focus:ring-1 focus:ring-[#1b688b]"
                                    >
                                        <option value={1}>Year 1</option>
                                        <option value={2}>Year 2</option>
                                        <option value={3}>Year 3</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                        Semester
                                    </label>
                                    <select
                                        value={data.semester}
                                        onChange={(e) => setData('semester', Number(e.target.value))}
                                        className="w-full text-xs bg-[#f0f5fa] border border-[#d2e0ec] rounded py-2 px-3 text-slate-800 focus:bg-white focus:border-[#1b688b] focus:ring-1 focus:ring-[#1b688b]"
                                    >
                                        <option value={1}>Semester I</option>
                                        <option value={2}>Semester II</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                        Credit Units (CU)
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={6}
                                        value={data.credit_units}
                                        onChange={(e) => setData('credit_units', Number(e.target.value))}
                                        className="w-full text-xs bg-[#f0f5fa] border border-[#d2e0ec] rounded py-2 px-3 text-slate-800 focus:bg-white focus:border-[#1b688b] focus:ring-1 focus:ring-[#1b688b]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Course Learning Outcomes */}
                    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                        <div className="border-b border-slate-200 px-4 py-2.5 bg-[#f8fafc] flex items-center justify-between">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-tight text-[#1E5E8A]">
                                    2. Course Learning Outcomes (CLOs)
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                    Each outcome must start with a measurable action verb (Bloom's Taxonomy)
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addOutcome}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 text-[#1b688b] border border-[#1b688b] rounded text-[11px] font-bold uppercase tracking-tight transition"
                            >
                                <Plus className="w-3.5 h-3.5" /> + ADD OUTCOME
                            </button>
                        </div>

                        <div className="p-4 sm:p-5 space-y-3">
                            {data.outcomes.map((clo, idx) => {
                                const warning = checkVerbWarning(clo.description);
                                return (
                                    <div key={idx} className="p-3 rounded border border-slate-200 bg-[#f8fafc] space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-[#1E5E8A] bg-sky-50 border border-sky-200 px-2 py-0.5 rounded uppercase">
                                                CLO #{idx + 1}
                                            </span>
                                            {data.outcomes.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeOutcome(idx)}
                                                    className="text-slate-400 hover:text-red-600 transition"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        <textarea
                                            value={clo.description}
                                            onChange={(e) => updateOutcome(idx, e.target.value)}
                                            placeholder="e.g. Design and evaluate relational database schemas meeting 3NF standards..."
                                            rows={2}
                                            className="w-full text-xs rounded bg-white border-[#d2e0ec] focus:border-[#1b688b] focus:ring-[#1b688b]"
                                            required
                                        />

                                        {warning && (
                                            <div className="flex items-start gap-1 p-2 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                                                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                                <span>{warning}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. Authentic Assessment Tasks */}
                    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                        <div className="border-b border-slate-200 px-4 py-2.5 bg-[#f8fafc] flex items-center justify-between">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-tight text-[#1E5E8A]">
                                    3. Authentic Assessment Plan & Weighting
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                    Total weighting must sum to 100%
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addAssessment}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 text-[#1b688b] border border-[#1b688b] rounded text-[11px] font-bold uppercase tracking-tight transition"
                            >
                                <Plus className="w-3.5 h-3.5" /> + ADD ASSESSMENT
                            </button>
                        </div>

                        <div className="p-4 sm:p-5 space-y-3">
                            <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-200 flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-700">Total Assessment Weighting:</span>
                                <span className={`font-black text-xs ${totalWeight === 100 ? 'text-[#198754]' : 'text-amber-600'}`}>
                                    {totalWeight}% {totalWeight === 100 ? '(Valid 100%)' : '(Must total 100%)'}
                                </span>
                            </div>

                            {data.assessments.map((ass, idx) => (
                                <div key={idx} className="p-3 rounded border border-slate-200 bg-[#f8fafc] space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-700 uppercase">
                                            Task #{idx + 1}
                                        </span>
                                        {data.assessments.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeAssessment(idx)}
                                                className="text-slate-400 hover:text-red-600 transition"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <div className="sm:col-span-2">
                                            <input
                                                type="text"
                                                value={ass.title}
                                                onChange={(e) => updateAssessment(idx, 'title', e.target.value)}
                                                placeholder="Task Title (e.g. Lab Project, Mid-term Test)"
                                                className="w-full text-xs rounded bg-white border-[#d2e0ec] focus:border-[#1b688b] focus:ring-[#1b688b]"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <select
                                                value={ass.type}
                                                onChange={(e) => updateAssessment(idx, 'type', e.target.value)}
                                                className="w-full text-xs rounded bg-white border-[#d2e0ec] focus:border-[#1b688b] focus:ring-[#1b688b]"
                                            >
                                                <option value="practical_project">Practical Project</option>
                                                <option value="continuous_assessment">Continuous Test</option>
                                                <option value="practical_lab">Practical Lab</option>
                                                <option value="written_exam">Final Examination</option>
                                                <option value="presentation">Presentation / Defense</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="w-28">
                                            <label className="text-[9px] font-bold text-slate-500 uppercase">Weight %</label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={100}
                                                value={ass.weight_percentage}
                                                onChange={(e) => updateAssessment(idx, 'weight_percentage', Number(e.target.value))}
                                                className="w-full text-xs rounded bg-white border-[#d2e0ec]"
                                                required
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <label className="text-[9px] font-bold text-slate-500 uppercase">Description / Rubric</label>
                                            <input
                                                type="text"
                                                value={ass.description}
                                                onChange={(e) => updateAssessment(idx, 'description', e.target.value)}
                                                placeholder="Assessment criteria or rubric..."
                                                className="w-full text-xs rounded bg-white border-[#d2e0ec]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex items-center justify-end gap-2.5 pt-2">
                        <Link
                            href={route('courses.index')}
                            className="px-4 py-2 rounded border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 uppercase tracking-tight transition"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing || totalWeight !== 100}
                            className="px-5 py-2 rounded bg-[#1b688b] hover:bg-[#165775] text-white text-xs font-bold shadow-xs transition disabled:opacity-50 inline-flex items-center gap-1.5 uppercase tracking-wider"
                        >
                            <FilePlus className="w-3.5 h-3.5" />
                            {processing ? 'RUNNING ML...' : 'SUBMIT & RUN CBET AUDIT'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
