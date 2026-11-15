import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import MubsCrest from '@/Components/MubsCrest';
import ThemeToggle from '@/Components/ThemeToggle';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-[#f4f6f9] dark:bg-[#0b1329] text-[#2c3e50] dark:text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased relative selection:bg-[#1b688b] selection:text-white transition-colors duration-200">
            {/* Top Right Theme Toggle */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            {/* Main Centered Content (Image 2) */}
            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Institutional Header with Authentic MUBS Crest */}
                <div className="text-center mb-6 space-y-2">
                    <MubsCrest className="w-28 h-28 sm:w-32 sm:h-32 mx-auto" />
                    <div>
                        <h1 className="text-base sm:text-lg font-black tracking-wide text-[#1E5E8A] dark:text-sky-400 uppercase font-sans">
                            MAKERERE UNIVERSITY BUSINESS SCHOOL
                        </h1>
                        <h2 className="text-xs sm:text-sm font-bold text-[#1E5E8A] dark:text-sky-500 uppercase tracking-wider mt-0.5">
                            ACMIS CBET CURRICULUM PORTAL
                        </h2>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                            Competence-Based Education & Training Alignment System
                        </p>
                    </div>
                </div>

                {/* The Clean Form Card with Dark Mode */}
                <div className="w-full max-w-md bg-white dark:bg-[#151f38] rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors duration-200">
                    {children}
                </div>

                {/* Bottom Footer Details from Image 2 */}
                <div className="mt-6 text-center space-y-2 text-xs">
                    <div className="text-slate-600 dark:text-slate-400 font-medium">
                        Forgot your Password?{' '}
                        <a
                            href="#reset"
                            onClick={(e) => {
                                e.preventDefault();
                                alert('Please contact the MUBS Directorate of ICT / Quality Assurance to reset your credentials.');
                            }}
                            className="text-[#1b688b] dark:text-sky-400 font-bold hover:underline inline-flex items-center gap-1"
                        >
                            🔎 Reset Here!
                        </a>
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        © 2026 ACMIS / HEMIS Consortium. All rights Reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}
