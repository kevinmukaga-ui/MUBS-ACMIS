import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    FileText,
    Filter,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    Search,
    BookOpenCheck,
    Plus,
    Layers,
    Sparkles,
    RefreshCw
} from 'lucide-react';
import { useState } from 'react';

interface Programme {
    id: number;
    code: string;
    name: string;
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
    learning_outcomes_count?: number;
    programme: Programme;
}

interface Props {
    courses: {
        data: CourseUnit[];
        links: any[];
    };
    programmes: Programme[];
    filters: {
        programme_id?: string;
        version?: string;
    };
}

export default function Courses({ courses, programmes, filters }: Props) {
    const [search, setSearch] = useState('');

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            route('courses.index'),
            { ...filters, [key]: value || undefined },
            { preserveState: true, replace: true }
        );
    };

    const filteredCourses = courses.data.filter((c) => {
        if (!search) return true;
        const query = search.toLowerCase();
        return c.code.toLowerCase().includes(query) || c.title.toLowerCase().includes(query);
    });

    return (
        <AuthenticatedLayout>
            <Head title="ACMIS - Course Unit Outlines" />

            <div className="space-y-4">
                {/* Search & Filter ACMIS Card (Matching Image 1 Form Style) */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                    <div className="border-b border-slate-200 px-4 py-2.5 bg-[#f8fafc] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-tight text-[#1E5E8A]">
                                Course Outlines & Syllabi Registry
                            </h2>
                            <p className="text-[11px] text-slate-500">
                                Competence-Based Education & Training (CBET) Review Directory
                            </p>
                        </div>

                        <Link
                            href={route('courses.create')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1b688b] hover:bg-[#165775] text-white rounded text-xs font-bold uppercase tracking-wider transition shadow-xs self-start sm:self-auto"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ SUBMIT NEW OUTLINE</span>
                        </Link>
                    </div>

                    <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                SEARCH COURSE
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Search className="w-3.5 h-3.5" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Code or title (e.g. BBC 3101)..."
                                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#f0f5fa] border border-[#d2e0ec] rounded text-slate-800 focus:bg-white focus:border-[#1b688b] focus:ring-1 focus:ring-[#1b688b]"
                                />
                            </div>
                        </div>

                        {/* Programme Dropdown */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                DEGREE PROGRAMME
                            </label>
                            <select
                                value={filters.programme_id || ''}
                                onChange={(e) => handleFilterChange('programme_id', e.target.value)}
                                className="w-full py-2 px-3 text-xs bg-[#f0f5fa] border border-[#d2e0ec] rounded text-slate-800 focus:bg-white focus:border-[#1b688b] focus:ring-1 focus:ring-[#1b688b]"
                            >
                                <option value="">-- All Degree Programmes --</option>
                                {programmes.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.code} - {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Version Dropdown */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                CURRICULUM VERSION
                            </label>
                            <select
                                value={filters.version || ''}
                                onChange={(e) => handleFilterChange('version', e.target.value)}
                                className="w-full py-2 px-3 text-xs bg-[#f0f5fa] border border-[#d2e0ec] rounded text-slate-800 focus:bg-white focus:border-[#1b688b] focus:ring-1 focus:ring-[#1b688b]"
                            >
                                <option value="">-- All Versions --</option>
                                <option value="cbet_revised">CBET Revised (2026/27)</option>
                                <option value="old">Legacy / Old Outlines</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Courses List as Clean ACMIS Table */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                            <thead className="bg-[#f1f5f9] text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                                <tr>
                                    <th className="px-5 py-3">Course Code & Title</th>
                                    <th className="px-5 py-3">Programme</th>
                                    <th className="px-5 py-3">Version</th>
                                    <th className="px-5 py-3">Credit Units</th>
                                    <th className="px-5 py-3">Alignment Score</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filteredCourses.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50 transition">
                                        <td className="px-5 py-3.5">
                                            <div className="font-extrabold text-xs text-[#1E5E8A] font-mono">{c.code}</div>
                                            <div className="text-slate-800 font-bold text-xs mt-0.5">{c.title}</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5">Year {c.year_of_study}, Semester {c.semester}</div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="font-bold text-slate-800">{c.programme.code}</span>
                                            <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{c.programme.name}</div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                                c.version_type === 'cbet_revised'
                                                    ? 'bg-sky-50 text-[#1b688b] border-sky-200'
                                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                                {c.version_type === 'cbet_revised' ? 'CBET Revised' : 'Legacy Outline'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 font-bold text-slate-700">
                                            {c.credit_units} CU
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {c.alignment_score !== null ? (
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`font-black text-xs ${
                                                        c.alignment_score >= 80 ? 'text-[#198754]' :
                                                        c.alignment_score >= 60 ? 'text-amber-600' : 'text-rose-600'
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
                                                    ? 'bg-[#198754] text-white' :
                                                c.alignment_status === 'requires_revision'
                                                    ? 'border border-rose-300 bg-rose-50 text-rose-700' :
                                                    'border border-amber-300 bg-amber-50 text-amber-700'
                                            }`}>
                                                {c.alignment_status === 'checked' ? 'CBET APPROVED' :
                                                 c.alignment_status === 'requires_revision' ? 'REVISION NEEDED' : 'AUDIT PENDING'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <Link
                                                href={route('courses.show', c.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1b688b] hover:bg-[#165775] text-white rounded text-[11px] font-bold uppercase tracking-tight transition shadow-xs"
                                            >
                                                INSPECT
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
