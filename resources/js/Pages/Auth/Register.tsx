import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { User, Mail, Lock, Building, Briefcase, UserPlus } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'lecturer',
        faculty: 'Faculty of Computing and Informatics',
        department: 'Department of Applied Computing & IT',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Staff Registration" />

            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Academic Staff Registration</h3>
                <p className="text-xs text-slate-500 mt-1">
                    Register to review course units and participate in the CBET alignment process
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name & Title
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                        </div>
                        <input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Dr. Stephen Lumu"
                            className="pl-9 text-xs block w-full rounded-lg border-slate-300 focus:border-blue-600 focus:ring-blue-600 transition"
                            required
                        />
                    </div>
                    <InputError message={errors.name} className="mt-1" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        MUBS Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="username@mubs.ac.ug"
                            className="pl-9 text-xs block w-full rounded-lg border-slate-300 focus:border-blue-600 focus:ring-blue-600 transition"
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Staff Role
                        </label>
                        <select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="text-xs block w-full rounded-lg border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                        >
                            <option value="lecturer">Course Lecturer</option>
                            <option value="coordinator">Programme Coordinator</option>
                            <option value="committee_member">Curriculum Review Committee</option>
                            <option value="qa_officer">Quality Assurance Officer</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Faculty
                        </label>
                        <select
                            value={data.faculty}
                            onChange={(e) => setData('faculty', e.target.value)}
                            className="text-xs block w-full rounded-lg border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                        >
                            <option value="Faculty of Computing and Informatics">Faculty of Computing & Informatics</option>
                            <option value="Faculty of Commerce">Faculty of Commerce</option>
                            <option value="Faculty of Management">Faculty of Management</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Department
                    </label>
                    <input
                        type="text"
                        value={data.department}
                        onChange={(e) => setData('department', e.target.value)}
                        className="text-xs block w-full rounded-lg border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="pl-9 text-xs block w-full rounded-lg border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                                required
                            />
                        </div>
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="pl-9 text-xs block w-full rounded-lg border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                                required
                            />
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-1" />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-md transition disabled:opacity-50"
                    >
                        <UserPlus className="w-4 h-4" />
                        {processing ? 'Registering...' : 'Complete Staff Registration'}
                    </button>
                </div>

                <div className="text-center pt-2 text-xs text-slate-500">
                    Already registered?{' '}
                    <Link href={route('login')} className="text-blue-700 font-bold hover:underline">
                        Sign In Here
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
