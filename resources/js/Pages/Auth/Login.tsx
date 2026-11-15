import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'lecturer@mubs.ac.ug',
        password: 'password',
        remember: true as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fillDemoUser = (email: string) => {
        setData('email', email);
        setData('password', 'password');
    };

    return (
        <GuestLayout>
            <Head title="ACMIS Portal Login" />

            {status && (
                <div className="mb-4 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-300">
                    {status}
                </div>
            )}

            {/* Card Title (Exactly as Image 2) */}
            <div className="text-center mb-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    LOGIN TO YOUR ACCOUNT
                </h3>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Username / Staff ID / Email Input with Light Blue Background (Image 2) */}
                <div>
                    <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                        </div>
                        <input
                            id="email"
                            type="text"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Staff ID / Email (e.g. 2300718734)"
                            className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#f0f5fa] dark:bg-[#0f172a] border border-[#d2e0ec] dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0f172a] focus:border-[#1b688b] focus:ring-1 focus:ring-[#1b688b] transition"
                            autoComplete="username"
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1" />
                </div>

                {/* Password Input with Lock & Eye toggle (Image 2) */}
                <div>
                    <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            className="w-full pl-9 pr-9 py-2.5 text-xs bg-[#f0f5fa] dark:bg-[#0f172a] border border-[#d2e0ec] dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-[#0f172a] focus:border-[#1b688b] focus:ring-1 focus:ring-[#1b688b] transition font-mono tracking-wider"
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1" />
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center text-slate-600 dark:text-slate-400 font-medium cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-[#1b688b] focus:ring-[#1b688b]"
                        />
                        <span className="ms-2 text-[11px]">Remember credentials</span>
                    </label>

                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        MUBS Staff Single Sign-On
                    </span>
                </div>

                {/* Solid ACMIS Teal Sign-In Button (Image 2) */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#1b688b] hover:bg-[#165775] text-white font-bold py-2.5 px-4 rounded text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50"
                    >
                        <span>➔</span>
                        <span>SIGN IN</span>
                    </button>
                </div>
            </form>

            {/* Quick Demo Credentials Autofill (All 4 Roles from Proposal) */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Switch Role & Permissions:</span>
                    <span className="text-[9px] text-[#1b688b] dark:text-sky-400 font-bold">Proposal Roles</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <button
                        type="button"
                        onClick={() => fillDemoUser('lecturer@mubs.ac.ug')}
                        className={`p-1.5 rounded border text-left transition ${
                            data.email === 'lecturer@mubs.ac.ug'
                                ? 'bg-[#1b688b] text-white border-[#1b688b] font-bold'
                                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        <div className="truncate font-bold">Dr. Stephen Lumu</div>
                        <div className="text-[8px] opacity-80 uppercase">1. Course Lecturer</div>
                    </button>

                    <button
                        type="button"
                        onClick={() => fillDemoUser('coordinator@mubs.ac.ug')}
                        className={`p-1.5 rounded border text-left transition ${
                            data.email === 'coordinator@mubs.ac.ug'
                                ? 'bg-[#1b688b] text-white border-[#1b688b] font-bold'
                                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        <div className="truncate font-bold">BBC Coordinator</div>
                        <div className="text-[8px] opacity-80 uppercase">2. Programme Coord.</div>
                    </button>

                    <button
                        type="button"
                        onClick={() => fillDemoUser('committee@mubs.ac.ug')}
                        className={`p-1.5 rounded border text-left transition ${
                            data.email === 'committee@mubs.ac.ug'
                                ? 'bg-[#1b688b] text-white border-[#1b688b] font-bold'
                                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        <div className="truncate font-bold">Review Committee</div>
                        <div className="text-[8px] opacity-80 uppercase">3. Committee Chair</div>
                    </button>

                    <button
                        type="button"
                        onClick={() => fillDemoUser('qa@mubs.ac.ug')}
                        className={`p-1.5 rounded border text-left transition ${
                            data.email === 'qa@mubs.ac.ug'
                                ? 'bg-[#1b688b] text-white border-[#1b688b] font-bold'
                                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        <div className="truncate font-bold">QA Directorate</div>
                        <div className="text-[8px] opacity-80 uppercase">4. Quality Assurance</div>
                    </button>
                </div>
            </div>
        </GuestLayout>
    );
}
