import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    AlertOctagon,
    Printer,
    Layers,
    ArrowRight,
    School,
    ShieldCheck,
    HelpCircle
} from 'lucide-react';

interface CourseCoverage {
    code: string;
    title: string;
    similarity: number;
}

interface MatrixRow {
    competence_id: number;
    code: string;
    title: string;
    category: string;
    course_coverage: CourseCoverage[];
    is_orphaned: boolean;
}

interface Programme {
    id: number;
    code: string;
    name: string;
    faculty: string;
    department: string;
}

interface Props {
    programme: Programme;
    matrix: MatrixRow[];
    allProgrammes: Programme[];
}

export default function ProgrammeMatrix({ programme, matrix, allProgrammes }: Props) {
    const handlePrint = () => {
        window.print();
    };

    const orphanedCount = matrix.filter((m) => m.is_orphaned).length;
    const alignedCount = matrix.length - orphanedCount;

    return (
        <AuthenticatedLayout>
            <Head title={`ACMIS - Matrix: ${programme.code}`} />

            <div className="space-y-4">
                {/* Header Card */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                    <div className="border-b border-slate-200 px-4 py-2.5 bg-[#f8fafc] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-black text-[#1E5E8A]">
                                    {programme.code}
                                </span>
                                <span className="text-[11px] text-slate-500 font-bold uppercase">
                                    • {programme.faculty}
                                </span>
                            </div>
                            <h1 className="text-xs font-black uppercase tracking-tight text-slate-800 mt-0.5">
                                Programme Competence Curriculum Alignment Matrix
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Programme selector tabs */}
                            <div className="flex items-center gap-1 bg-[#f0f5fa] p-1 rounded border border-[#d2e0ec]">
                                {allProgrammes.map((p) => (
                                    <Link
                                        key={p.id}
                                        href={route('programmes.matrix', p.id)}
                                        className={`px-2.5 py-1 text-[11px] font-bold rounded uppercase tracking-wider transition ${
                                            p.id === programme.id
                                                ? 'bg-[#1b688b] text-white shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        {p.code}
                                    </Link>
                                ))}
                            </div>

                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-[11px] font-bold uppercase tracking-tight transition"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                <span>EXPORT</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Metric Bar */}
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white">
                        <div className="p-3 bg-[#f8fafc] rounded border border-slate-200 text-center">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Total Programme Competences
                            </div>
                            <div className="text-xl font-black text-[#1E5E8A] mt-0.5">{matrix.length}</div>
                        </div>

                        <div className="p-3 bg-[#f8fafc] rounded border border-slate-200 text-center">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Aligned by Courses
                            </div>
                            <div className="text-xl font-black text-[#198754] mt-0.5">{alignedCount}</div>
                        </div>

                        <div className="p-3 bg-[#f8fafc] rounded border border-slate-200 text-center">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Orphaned (Uncovered) Competences
                            </div>
                            <div className="text-xl font-black text-rose-600 mt-0.5">{orphanedCount}</div>
                        </div>
                    </div>
                </div>

                {/* Matrix Table Card */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                            <thead className="bg-[#f1f5f9] text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                                <tr>
                                    <th className="px-5 py-3">Competence Code & Title</th>
                                    <th className="px-5 py-3">Category</th>
                                    <th className="px-5 py-3">Course Unit Coverage</th>
                                    <th className="px-5 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {matrix.map((row) => (
                                    <tr key={row.competence_id} className="hover:bg-slate-50 transition">
                                        <td className="px-5 py-3.5 max-w-sm">
                                            <div className="font-extrabold text-xs text-[#1E5E8A] font-mono">{row.code}</div>
                                            <div className="text-slate-800 font-semibold text-xs mt-0.5">{row.title}</div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                                                {row.category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {row.course_coverage && row.course_coverage.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {row.course_coverage.map((c, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#f0f5fa] border border-[#d2e0ec] text-[#1E5E8A]"
                                                        >
                                                            <span>{c.code}</span>
                                                            <span className="text-[#1b688b]">({Math.round(c.similarity * 100)}%)</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-rose-600 font-bold italic text-[11px]">
                                                    No course covers this competence!
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {row.is_orphaned ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border border-rose-300 bg-rose-50 text-rose-700">
                                                    ORPHANED
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#198754] text-white">
                                                    <CheckCircle2 className="w-3 h-3" /> COVERED
                                                </span>
                                            )}
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
