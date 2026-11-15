import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Briefcase, Building, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface IndustryDoc {
    id: number;
    source_type: 'job_advert' | 'dit_profile' | 'esco';
    title: string;
    organization: string;
    publication_date: string;
    target_field: string;
    extracted_competences: string[];
    full_text: string | null;
}

interface GapFlag {
    id: number;
    flag_title: string;
    flag_reason: string;
    suggested_action: string;
    resolution_status: string;
}

interface Props {
    evidence: IndustryDoc[];
    gapFlags: GapFlag[];
}

export default function IndustryGaps({ evidence, gapFlags }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="ACMIS - Industry Evidence & Gaps" />

            <div className="space-y-4">
                {/* Header Banner Card */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                    <div className="border-b border-slate-200 px-4 py-2.5 bg-[#f8fafc] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <h1 className="text-xs font-black uppercase tracking-tight text-[#1E5E8A]">
                                Industry Evidence & Workplace Competence Gaps
                            </h1>
                            <p className="text-[11px] text-slate-500">
                                Alignment check against Ugandan job market postings (Great Uganda Jobs) and DIT Occupational Standards
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded">
                                {gapFlags.length} GAPS FLAGGED
                            </span>
                        </div>
                    </div>

                    <div className="p-4 bg-white">
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Under NCHE Minimum Standards (Section 2.4), curriculum reviews must derive competences directly from the world of work. The system extracts workplace requirements from the Directorate of Industrial Training (DIT) Assessment and Training Packages (ATPs) and live Ugandan employment postings.
                        </p>
                    </div>
                </div>

                {/* Flagged Missing Skills in Curriculum */}
                {gapFlags.length > 0 && (
                    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                        <div className="border-b border-slate-200 px-4 py-2.5 bg-[#f8fafc]">
                            <h2 className="text-xs font-black uppercase tracking-tight text-rose-700 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                <span>High-Demand Industry Skills Missing in Current Syllabi</span>
                            </h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {gapFlags.map((gap) => (
                                <div key={gap.id} className="p-3 bg-rose-50/50 rounded border border-rose-200 space-y-1">
                                    <div className="font-bold text-xs text-rose-900">{gap.flag_title}</div>
                                    <div className="text-[11px] text-slate-600 leading-relaxed">{gap.flag_reason}</div>
                                    <div className="text-[10px] text-slate-700 bg-white p-2 rounded border border-rose-100 font-semibold mt-1">
                                        <strong>Curriculum Action:</strong> {gap.suggested_action}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Evidence Documents List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {evidence.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-2.5 flex flex-col justify-between"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                                        doc.source_type === 'dit_profile'
                                            ? 'bg-amber-100 text-amber-900'
                                            : 'bg-sky-100 text-[#1b688b]'
                                    }`}>
                                        {doc.source_type === 'dit_profile' ? 'DIT Occupational Standard' : 'Great Uganda Jobs'}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {doc.publication_date}
                                    </span>
                                </div>

                                <h3 className="text-xs font-bold text-slate-900 leading-snug">{doc.title}</h3>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                    <Building className="w-3 h-3" /> {doc.organization}
                                </div>

                                {/* Extracted skills */}
                                <div className="pt-2 border-t border-slate-100 space-y-1">
                                    <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                        Extracted Workplace Skills:
                                    </div>
                                    <div className="space-y-1">
                                        {doc.extracted_competences.map((skill, idx) => (
                                            <div
                                                key={idx}
                                                className="text-[11px] p-1.5 bg-[#f8fafc] rounded border border-slate-200 text-slate-800 font-medium"
                                            >
                                                • {skill}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                                <span>Domain: {doc.target_field}</span>
                                <span className="text-[#198754] font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Verified Source
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
