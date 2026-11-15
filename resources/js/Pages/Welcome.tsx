import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ShieldCheck,
    BookOpen,
    Layers,
    TrendingUp,
    CheckCircle2,
    ArrowRight,
    Award,
    School,
    Clock,
    Briefcase,
    LogIn,
    FileCheck,
    Check,
    ChevronRight
} from 'lucide-react';
import MubsCrest from '@/Components/MubsCrest';
import ThemeToggle from '@/Components/ThemeToggle';

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="MUBS ACMIS - CBET Curriculum Alignment Portal" />
            <div className="min-h-screen bg-[#f4f6f9] dark:bg-[#0b1329] text-[#2c3e50] dark:text-slate-100 font-sans antialiased flex flex-col justify-between selection:bg-[#1b688b] selection:text-white text-xs transition-colors duration-200">
                {/* Institutional Top Header (ACMIS White Banner) */}
                <header className="bg-white dark:bg-[#151f38] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-xs transition-colors duration-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        {/* Left: MUBS Crest & Branding */}
                        <div className="flex items-center gap-3">
                            <MubsCrest className="w-10 h-10" />
                            <div>
                                <h1 className="font-black text-[#1E5E8A] dark:text-sky-400 text-xs sm:text-sm uppercase tracking-tight leading-tight">
                                    Makerere University Business School
                                </h1>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                    ACMIS • CBET Curriculum Alignment System
                                </p>
                            </div>
                        </div>

                        {/* Right: Quick Portal Links & Theme Toggle */}
                        <div className="flex items-center gap-2.5">
                            <ThemeToggle />
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1b688b] hover:bg-[#165775] text-white text-xs font-bold rounded uppercase tracking-wider shadow-xs transition"
                                >
                                    <span>ENTER DASHBOARD</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1b688b] hover:bg-[#165775] text-white text-xs font-bold rounded uppercase tracking-wider shadow-xs transition"
                                >
                                    <LogIn className="w-3.5 h-3.5" />
                                    <span>STAFF SIGN IN</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* Sub-Header Status Strip (Matching ACMIS Image 1) */}
                <div className="bg-white dark:bg-[#101a33] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-2.5 shadow-2xs transition-colors duration-200">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold">
                            <span className="text-[#1E5E8A] dark:text-sky-400 font-extrabold uppercase">
                                PROGRAMME: BACHELOR OF BUSINESS COMPUTING - (BBC)
                            </span>
                            <span className="bg-[#198754] text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                                ACTIVE
                            </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold">
                            <span className="bg-[#14648c] text-white px-2.5 py-0.5 rounded">
                                CURRENT YR: 2026/2027
                            </span>
                            <span className="bg-[#14648c] text-white px-2.5 py-0.5 rounded">
                                CURRENT SEM: SEMESTER I
                            </span>
                            <span className="border border-orange-300 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded">
                                NCHE MANDATE: 2027/2028
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
                    {/* Clean ACMIS Announcement Card */}
                    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                        {/* Tab-Style Bar (Image 1) */}
                        <div className="border-b border-slate-200 px-4 py-2.5 bg-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold text-[#1E5E8A] uppercase tracking-wide text-xs">
                                    ACMIS COMPETENCE-BASED EDUCATION & TRAINING (CBET) AUDIT
                                </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">
                                Cap. 262 Statutory Alignment
                            </span>
                        </div>

                        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-4">
                                <h2 className="text-xl sm:text-2xl font-black text-[#1E5E8A] tracking-tight uppercase font-sans">
                                    Automated Machine Learning Curriculum Alignment Checker
                                </h2>
                                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                                    In fulfillment of the National Council for Higher Education (NCHE) statutory mandate for Ugandan universities, all undergraduate computing and business degree programmes must transition to Competence-Based Education and Training (CBET) starting from the <strong>2027/2028 Academic Year</strong>.
                                </p>
                                <p className="text-slate-600 leading-relaxed text-xs">
                                    This machine learning system, designed by <strong>Group 8 (Bachelor of Business Computing)</strong> under the supervision of <strong>Mr. Samuel Ssendi</strong>, automatically extracts Course Learning Outcomes (CLOs), measures Bloom's Taxonomy cognitive progression, aligns courses to Programme Competences, and cross-references Ugandan employer skill demand.
                                </p>

                                <div className="pt-2 flex flex-wrap items-center gap-3">
                                    <Link
                                        href={auth.user ? route('dashboard') : route('login')}
                                        className="px-5 py-2.5 bg-[#1b688b] hover:bg-[#165775] text-white font-bold rounded text-xs uppercase tracking-wider shadow-xs transition inline-flex items-center gap-2"
                                    >
                                        <span>LAUNCH CBET AUDIT PORTAL</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded text-xs uppercase tracking-wider transition inline-flex items-center gap-1.5"
                                    >
                                        <span>STAFF SINGLE SIGN-ON</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Quick Metrics Box */}
                            <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                                        MUBS FACULTY OF COMPUTING AUDIT
                                    </div>
                                    <div className="mt-2 text-3xl font-black text-[#1E5E8A]">87.5%</div>
                                    <div className="text-[11px] font-bold text-[#198754] mt-0.5">
                                        CBET Alignment Pass Rate
                                    </div>
                                </div>

                                <div className="space-y-2 text-[11px]">
                                    <div className="flex justify-between py-1 border-b border-slate-200">
                                        <span className="text-slate-600">Target Programmes:</span>
                                        <span className="font-bold text-slate-900">BBC, BOIM, BCOM</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-slate-200">
                                        <span className="text-slate-600">Cognitive Framework:</span>
                                        <span className="font-bold text-slate-900">Bloom's Revised (2001)</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-slate-200">
                                        <span className="text-slate-600">Industry Standards:</span>
                                        <span className="font-bold text-slate-900">DIT ATPs & Job Postings</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-slate-600">Human-in-the-Loop:</span>
                                        <span className="font-bold text-slate-900">Accept / Edit / Reject</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The 4 CBET Verification Checks (Clean ACMIS Card Grid) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-2">
                            <div className="text-[10px] font-extrabold text-[#1b688b] uppercase tracking-wider">
                                CHECK 1
                            </div>
                            <h3 className="font-bold text-slate-900 text-xs uppercase">
                                Bloom's Taxonomy Quality
                            </h3>
                            <p className="text-slate-500 text-[11px] leading-relaxed">
                                Classifies verbs across all 6 cognitive levels. Flags vague non-measurable verbs like <em>"understand"</em> and suggests actionable verbs.
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-2">
                            <div className="text-[10px] font-extrabold text-[#1b688b] uppercase tracking-wider">
                                CHECK 2
                            </div>
                            <h3 className="font-bold text-slate-900 text-xs uppercase">
                                Competence Semantic Mapping
                            </h3>
                            <p className="text-slate-500 text-[11px] leading-relaxed">
                                Maps Course Learning Outcomes (CLOs) to Programme Competences (PCs) using TF-IDF and cosine similarity, flagging orphaned outcomes.
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-2">
                            <div className="text-[10px] font-extrabold text-[#1b688b] uppercase tracking-wider">
                                CHECK 3
                            </div>
                            <h3 className="font-bold text-slate-900 text-xs uppercase">
                                Constructive Assessment
                            </h3>
                            <p className="text-slate-500 text-[11px] leading-relaxed">
                                Validates Biggs' constructive alignment between CLOs and authentic assessment tasks (practicals, coursework, and exams).
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-2">
                            <div className="text-[10px] font-extrabold text-[#1b688b] uppercase tracking-wider">
                                CHECK 4
                            </div>
                            <h3 className="font-bold text-slate-900 text-xs uppercase">
                                Ugandan Labour Market
                            </h3>
                            <p className="text-slate-500 text-[11px] leading-relaxed">
                                Cross-references course outlines against DIT Assessment and Training Packages (ATPs) and recent Ugandan job postings.
                            </p>
                        </div>
                    </div>
                </main>

                {/* ACMIS Institutional Footer */}
                <footer className="bg-white dark:bg-[#151f38] border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                        <div>
                            © 2026 <strong>Makerere University Business School</strong>. All rights Reserved.
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">
                            ACMIS / HEMIS Consortium • Group 8 (Bachelor of Business Computing)
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
