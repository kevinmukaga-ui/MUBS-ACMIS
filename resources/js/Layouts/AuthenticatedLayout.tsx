import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import {
    LayoutDashboard,
    BookOpen,
    FilePlus2,
    Grid3X3,
    Briefcase,
    LogOut,
    Menu,
    ChevronDown,
    ChevronRight,
    User as UserIcon,
    CheckCircle2,
    Mail,
    Sparkles,
    ShieldAlert,
    Scale,
    ShieldCheck
} from 'lucide-react';
import MubsCrest from '@/Components/MubsCrest';
import ThemeToggle from '@/Components/ThemeToggle';

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('mubs_sidebar_collapsed') === 'true';
        }
        return false;
    });
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    // Save collapse state to localStorage
    const toggleSidebar = () => {
        setIsCollapsed((prev) => {
            const next = !prev;
            if (typeof window !== 'undefined') {
                localStorage.setItem('mubs_sidebar_collapsed', String(next));
            }
            return next;
        });
    };

    // Role-tailored navigation items based on Project Proposal
    const isLecturer = user?.role === 'lecturer' || user?.is_lecturer;
    const isCommittee = user?.role === 'committee_member' || user?.role === 'coordinator' || user?.is_committee || user?.is_coordinator;
    const isQA = user?.role === 'qa_officer' || user?.role === 'admin' || user?.is_qa;

    let navItems = [];

    if (isLecturer) {
        navItems = [
            {
                num: '01',
                name: 'MY COURSE OUTLINES',
                shortName: 'My Outlines',
                href: route('courses.index'),
                icon: BookOpen,
                active: route().current('courses.*') && !route().current('courses.create'),
            },
            {
                num: '02',
                name: '+ SUBMIT NEW OUTLINE',
                shortName: 'New Outline',
                href: route('courses.create'),
                icon: FilePlus2,
                active: route().current('courses.create'),
            },
            {
                num: '03',
                name: 'BLOOM DIAGNOSTICS',
                shortName: 'Dashboard',
                href: route('dashboard'),
                icon: LayoutDashboard,
                active: route().current('dashboard'),
            },
            {
                num: '04',
                name: 'PROGRAMME COMPETENCES',
                shortName: 'Competences',
                href: route('programmes.matrix', 1),
                icon: Grid3X3,
                active: route().current('programmes.*'),
            },
        ];
    } else if (isCommittee) {
        navItems = [
            {
                num: '01',
                name: 'COMMITTEE DASHBOARD',
                shortName: 'Dashboard',
                href: route('dashboard'),
                icon: LayoutDashboard,
                active: route().current('dashboard'),
            },
            {
                num: '02',
                name: 'PROGRAMME MATRIX',
                shortName: 'Matrix',
                href: route('programmes.matrix', 1),
                icon: Grid3X3,
                active: route().current('programmes.*'),
            },
            {
                num: '03',
                name: 'COURSE OUTLINES AUDIT',
                shortName: 'Audit',
                href: route('courses.index'),
                icon: BookOpen,
                active: route().current('courses.*') && !route().current('courses.create'),
            },
            {
                num: '04',
                name: '+ SUBMIT OUTLINE',
                shortName: 'New Outline',
                href: route('courses.create'),
                icon: FilePlus2,
                active: route().current('courses.create'),
            },
            {
                num: '05',
                name: 'INDUSTRY EVIDENCE & GAPS',
                shortName: 'Industry',
                href: route('industry.gaps'),
                icon: Briefcase,
                active: route().current('industry.*'),
            },
        ];
    } else {
        // QA Officer / Admin
        navItems = [
            {
                num: '01',
                name: 'QA EXECUTIVE DASHBOARD',
                shortName: 'Dashboard',
                href: route('dashboard'),
                icon: LayoutDashboard,
                active: route().current('dashboard'),
            },
            {
                num: '02',
                name: 'ACCREDITATION REVIEWS',
                shortName: 'Accreditation',
                href: route('courses.index'),
                icon: BookOpen,
                active: route().current('courses.*') && !route().current('courses.create'),
            },
            {
                num: '03',
                name: 'ALL PROGRAMMES MATRIX',
                shortName: 'Matrix',
                href: route('programmes.matrix', 1),
                icon: Grid3X3,
                active: route().current('programmes.*'),
            },
            {
                num: '04',
                name: '+ SUBMIT OUTLINE',
                shortName: 'New Outline',
                href: route('courses.create'),
                icon: FilePlus2,
                active: route().current('courses.create'),
            },
            {
                num: '05',
                name: 'INDUSTRY GAPS & DIT ATPS',
                shortName: 'Industry',
                href: route('industry.gaps'),
                icon: Briefcase,
                active: route().current('industry.*'),
            },
        ];
    }

    const firstName = user?.name ? user.name.split(' ')[0] : 'User';
    const userInitials = user?.name ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('') : 'MU';

    const getRoleBadge = () => {
        if (isLecturer) {
            return {
                title: 'COURSE LECTURER',
                badgeBg: 'bg-sky-500/20 text-sky-400 border-sky-400/40',
                headerPortal: 'CBET COURSE OUTLINE PORTAL',
            };
        }
        if (user?.role === 'coordinator') {
            return {
                title: 'PROGRAMME COORDINATOR',
                badgeBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-400/40',
                headerPortal: 'PROGRAMME COORDINATION PORTAL',
            };
        }
        if (isCommittee) {
            return {
                title: 'REVIEW COMMITTEE CHAIR',
                badgeBg: 'bg-purple-500/20 text-purple-400 border-purple-400/40',
                headerPortal: 'CURRICULUM REVIEW COMMITTEE',
            };
        }
        return {
            title: 'QUALITY ASSURANCE DIRECTORATE',
            badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-400/40',
            headerPortal: 'QA INSTITUTIONAL ACCREDITATION',
        };
    };

    const roleInfo = getRoleBadge();

    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#f4f6f9] dark:bg-[#0b1329] text-[#2c3e50] dark:text-slate-100 font-sans antialiased text-xs transition-colors duration-200">
            {/* Top ACMIS Institutional Navbar (Image 1) */}
            <header className="h-16 shrink-0 bg-white dark:bg-[#151f38] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between z-30 shadow-xs select-none transition-colors duration-200">
                {/* Left: MUBS Crest & Branding */}
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Trigger */}
                    <button
                        onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
                        title="Toggle Menu"
                    >
                        <Menu className="w-5 h-5 text-[#1b688b]" />
                    </button>

                    <Link href="/" className="flex items-center gap-2.5 group">
                        <MubsCrest className="w-10 h-10 transition-transform duration-300 group-hover:scale-105" />
                        <div className="text-left font-black tracking-tight text-[#1E5E8A] dark:text-sky-400 text-xs sm:text-sm leading-tight uppercase font-sans">
                            <div className="group-hover:text-[#165775] dark:group-hover:text-sky-300 transition-colors">Makerere University</div>
                            <div className="text-[#184d72] dark:text-sky-500 font-extrabold">Business School</div>
                        </div>
                    </Link>
                </div>

                {/* Center / Navigation Quick Links in ACMIS Tab Strip Style */}
                <div className="hidden lg:flex items-center gap-2">
                    {/* Collapsible MENU Toggle Button */}
                    <button
                        onClick={toggleSidebar}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded text-[11px] font-bold uppercase tracking-tight transition-all duration-200 active:scale-95 ${
                            isCollapsed
                                ? 'border-[#1b688b] bg-[#eef4f9] dark:bg-slate-800 text-[#1b688b] dark:text-sky-400 shadow-2xs'
                                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-[#1b688b]'
                        }`}
                        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                    >
                        <Menu className={`w-3.5 h-3.5 transition-transform duration-300 ${isCollapsed ? 'rotate-90 text-[#1b688b]' : 'text-slate-500 dark:text-slate-400'}`} />
                        <span>MENU</span>
                    </button>

                    {isLecturer ? (
                        <>
                            <Link
                                href={route('courses.index')}
                                className={`px-3 py-1.5 border rounded text-[11px] font-bold uppercase tracking-tight transition-all duration-200 ${
                                    route().current('courses.*') && !route().current('courses.create')
                                        ? 'border-[#1b688b] bg-[#1b688b] text-white shadow-xs'
                                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                MY OUTLINES
                            </Link>
                            <Link
                                href={route('courses.create')}
                                className="px-3 py-1.5 border border-[#1b688b] bg-white dark:bg-slate-800 text-[#1b688b] dark:text-sky-400 hover:bg-[#1b688b] hover:text-white rounded text-[11px] font-bold uppercase tracking-tight transition-all duration-200 shadow-2xs"
                            >
                                + SUBMIT OUTLINE
                            </Link>
                            <Link
                                href={route('dashboard')}
                                className={`px-3 py-1.5 border rounded text-[11px] font-bold uppercase tracking-tight transition-all duration-200 ${
                                    route().current('dashboard')
                                        ? 'border-[#1b688b] bg-[#1b688b] text-white shadow-xs'
                                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                BLOOM DIAGNOSTICS
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href={route('dashboard')}
                                className={`px-3 py-1.5 border rounded text-[11px] font-bold uppercase tracking-tight transition-all duration-200 ${
                                    route().current('dashboard')
                                        ? 'border-[#1b688b] bg-[#1b688b] text-white shadow-xs'
                                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                DASHBOARD
                            </Link>
                            <Link
                                href={route('programmes.matrix', 1)}
                                className={`px-3 py-1.5 border rounded text-[11px] font-bold uppercase tracking-tight transition-all duration-200 ${
                                    route().current('programmes.*')
                                        ? 'border-[#1b688b] bg-[#1b688b] text-white shadow-xs'
                                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                PROGRAMME MATRIX
                            </Link>
                            <Link
                                href={route('courses.index')}
                                className={`px-3 py-1.5 border rounded text-[11px] font-bold uppercase tracking-tight transition-all duration-200 ${
                                    route().current('courses.*') && !route().current('courses.create')
                                        ? 'border-[#1b688b] bg-[#1b688b] text-white shadow-xs'
                                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                {isQA ? 'ACCREDITATION' : 'COURSE AUDIT'}
                            </Link>
                        </>
                    )}
                </div>

                {/* Right: Theme Toggle, Notifications & User Profile */}
                <div className="flex items-center gap-2.5">
                    {/* Role Pill Banner */}
                    <span className={`hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${roleInfo.badgeBg}`}>
                        {roleInfo.title}
                    </span>

                    {/* Dark / Light Mode Switcher */}
                    <ThemeToggle />

                    {/* ACMIS Notification Mailbox Icon with Badge (Image 1) */}
                    <div className="relative">
                        <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all relative"
                            title="Notifications"
                        >
                            <Mail className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-extrabold text-[9px] px-1 rounded-full shadow-xs">
                                1/
                            </span>
                        </button>

                        {/* Notifications Dropdown */}
                        {notificationsOpen && (
                            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#151f38] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 animate-scale-in text-xs space-y-2">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                    <span className="font-black text-[#1E5E8A] dark:text-sky-400 uppercase tracking-wide text-[11px]">
                                        ACMIS Audit Alerts
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold">Role: {user.role}</span>
                                </div>
                                <div className="p-2 rounded bg-sky-50 dark:bg-slate-800 border border-sky-100 dark:border-slate-700 space-y-1">
                                    <div className="font-bold text-[#1E5E8A] dark:text-sky-400 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3 text-[#1b688b]" />
                                        <span>NCHE CBET Mandate 2027/28</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                                        {isLecturer
                                            ? 'Please review your course learning outcomes and replace any vague verbs before committee submission.'
                                            : isCommittee
                                            ? 'Please review the Programme Alignment Matrix and resolve any unmapped outcomes or orphaned competences.'
                                            : 'Quality Assurance review of BBC, BOIM, and BCOM is 87.5% complete for NCHE re-accreditation.'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile Dropdown Button */}
                    <div className="relative">
                        <button
                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#1e2d3d] text-white font-bold flex items-center justify-center text-xs overflow-hidden border border-slate-300 shadow-2xs">
                                {userInitials}
                            </div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline">
                                Hi, {firstName}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* User Dropdown Menu */}
                        {userDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#151f38] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs animate-scale-in">
                                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                                    <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                                    <p className="text-[11px] text-[#1b688b] dark:text-sky-400 font-bold uppercase mt-0.5">{roleInfo.title}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{user.department}</p>
                                </div>
                                <button
                                    onClick={toggleSidebar}
                                    className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                                >
                                    <span>{isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}</span>
                                    <Menu className="w-3.5 h-3.5 text-slate-400" />
                                </button>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 transition"
                                >
                                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Body: Left Sidebar + Right Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* ACMIS Left Sidebar (100% Pinned, Collapsible, Role-Tailored) */}
                <aside
                    className={`fixed inset-y-0 left-0 top-16 z-40 h-[calc(100vh-4rem)] shrink-0 bg-white dark:bg-[#151f38] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out md:static ${
                        mobileDrawerOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
                    } ${isCollapsed ? 'md:w-18' : 'md:w-64'}`}
                >
                    <div className={`flex-1 ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto overflow-x-hidden'}`}>
                        {/* The ACMIS Dark Blue User Profile Box (Image 1) */}
                        <div
                            className={`transition-all duration-300 bg-[#1e2d3d] rounded-lg text-white shadow-xs mx-2 my-3 ${
                                isCollapsed
                                    ? 'p-2 flex flex-col items-center justify-center'
                                    : 'p-4 text-center m-3'
                            }`}
                        >
                            {isCollapsed ? (
                                /* Compact Icon Profile in Collapsed Mode */
                                <div className="relative group/avatar">
                                    <div className="w-10 h-10 rounded-full bg-[#2b3d52] border-2 border-white/50 flex items-center justify-center font-bold text-white text-xs shadow-xs">
                                        {userInitials}
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
                                    {/* Tooltip on Hover */}
                                    <div className="pointer-events-none opacity-0 group-hover/avatar:opacity-100 group-hover/avatar:translate-x-1.5 absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1e2d3d] dark:bg-slate-900 text-white text-[11px] font-bold rounded shadow-xl whitespace-nowrap z-50 transition-all duration-200 border border-white/10">
                                        <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1e2d3d] dark:bg-slate-900 rotate-45 border-l border-b border-white/10" />
                                        <div>{user.name}</div>
                                        <div className="text-[9px] text-sky-300 font-semibold uppercase">
                                            {roleInfo.title}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Full ACMIS Profile Box in Expanded Mode */
                                <>
                                    <div className="w-16 h-20 mx-auto rounded bg-slate-200 border-2 border-white/60 overflow-hidden flex items-center justify-center text-slate-600 mb-2.5 shadow-xs transition-transform duration-300 hover:scale-105">
                                        <div className="w-full h-full bg-[#2b3d52] flex flex-col items-center justify-center text-white">
                                            <UserIcon className="w-8 h-8 text-slate-300" />
                                        </div>
                                    </div>

                                    <div className="font-black text-xs uppercase tracking-tight text-white leading-tight truncate">
                                        {user.name}
                                    </div>
                                    <div className="text-[9px] font-bold text-sky-300 uppercase tracking-wider mt-1 border border-white/20 px-2 py-0.5 rounded-full bg-white/10">
                                        {roleInfo.title}
                                    </div>
                                    <div className="text-[9px] text-slate-400 mt-1 truncate">
                                        {user.department || 'Faculty of Computing & Informatics'}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Navigation Links with Smooth Tooltips when Collapsed */}
                        <nav className={`py-1 space-y-1 ${isCollapsed ? 'px-2' : 'px-2.5'}`}>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.name} className="relative group">
                                        <Link
                                            href={item.href}
                                            className={`flex items-center rounded-lg text-[11px] font-bold tracking-tight transition-all duration-200 ${
                                                isCollapsed
                                                    ? 'justify-center p-2.5'
                                                    : 'justify-between px-3 py-2.5'
                                            } ${
                                                item.active
                                                    ? 'bg-[#eef4f9] dark:bg-slate-800 text-[#1b688b] dark:text-sky-400 border-l-4 border-l-[#1b688b] shadow-2xs font-extrabold'
                                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 truncate">
                                                <Icon
                                                    className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                                        item.active ? 'text-[#1b688b] dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'
                                                    }`}
                                                />
                                                {!isCollapsed && <span className="truncate">{item.name}</span>}
                                            </div>
                                            {!isCollapsed && (
                                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                            )}
                                        </Link>

                                        {/* Floating Hover Tooltip (Only visible in collapsed mode) */}
                                        {isCollapsed && (
                                            <div className={`pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 ${
                                                item.active ? 'bg-[#1b688b]' : 'bg-[#1e2d3d] dark:bg-slate-900'
                                            } text-white text-[11px] font-bold rounded shadow-xl whitespace-nowrap z-50 transition-all duration-200 flex items-center gap-1.5 border border-white/10`}>
                                                <span className={`absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 ${
                                                    item.active ? 'bg-[#1b688b]' : 'bg-[#1e2d3d] dark:bg-slate-900'
                                                } rotate-45 border-l border-b border-white/10`} />
                                                <span className="text-sky-300 font-mono text-[9px] font-bold">{item.num}</span>
                                                <span>{item.name}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Footer in Sidebar */}
                    <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center">
                        <div className="relative group">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className={`w-full py-1.5 border border-red-200 dark:border-red-900/60 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded text-[11px] font-bold flex items-center justify-center gap-1.5 transition active:scale-95 ${
                                    isCollapsed ? 'px-0' : 'px-3'
                                }`}
                            >
                                <LogOut className="w-3.5 h-3.5 shrink-0" />
                                {!isCollapsed && <span>SIGN OUT</span>}
                            </Link>
                            {isCollapsed && (
                                <div className="pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-red-700 text-white text-[11px] font-bold rounded shadow-xl whitespace-nowrap z-50 transition-all duration-200 flex items-center gap-1.5 border border-white/10">
                                    <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-700 rotate-45 border-l border-b border-white/10" />
                                    <span>SIGN OUT</span>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Right Scrollable Content Area */}
                <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] min-w-0 overflow-y-auto">
                    {/* ACMIS Programme & Academic Status Banner (Image 1) */}
                    <div className="bg-white dark:bg-[#151f38] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 shrink-0 shadow-2xs select-none transition-colors duration-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-[#1E5E8A] dark:text-sky-400 text-xs">
                                    PROGRAMME: BACHELOR OF BUSINESS COMPUTING - (BBCO)
                                </span>
                                {/* Animated Live Active Pill Badge */}
                                <span className="inline-flex items-center gap-1.5 bg-[#198754] text-white px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-2xs">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                                    </span>
                                    <span>ACTIVE</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-slate-500 dark:text-slate-400 font-bold text-[11px]">ROLE ACCESS:</span>
                                <span className="border border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-950/40 text-[#1E5E8A] dark:text-sky-300 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase">
                                    {roleInfo.title}
                                </span>
                            </div>
                        </div>

                        {/* Secondary Status Badge Row (Image 1) */}
                        <div className="mt-2.5 flex items-center gap-2 flex-wrap text-[11px] font-bold">
                            <span className="bg-[#14648c] text-white px-2.5 py-0.5 rounded shadow-2xs transition-transform hover:scale-105">
                                CURRENT YR: 2026/2027
                            </span>
                            <span className="bg-[#14648c] text-white px-2.5 py-0.5 rounded shadow-2xs transition-transform hover:scale-105">
                                CURRENT SEM: SEMESTER I
                            </span>
                            <span className="border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> NCHE CBET ALIGNED
                            </span>
                            <span className="bg-[#1b688b] text-white px-2.5 py-0.5 rounded shadow-2xs">
                                {isLecturer
                                    ? 'ACTION: REWRITE VAGUE VERBS'
                                    : isCommittee
                                    ? 'ACTION: HUMAN-IN-THE-LOOP AUDIT'
                                    : 'ACTION: NCHE ACCREDITATION SIGN-OFF'}
                            </span>
                        </div>
                    </div>

                    {/* Page Main Content with Smooth Fade-In Animation */}
                    <main className="flex-1 p-4 sm:p-6 space-y-4 animate-fade-in">
                        {children}
                    </main>

                    {/* ACMIS System Footer (Image 1) */}
                    <footer className="shrink-0 bg-white dark:bg-[#151f38] border-t border-slate-200 dark:border-slate-800 py-3 px-6 text-center text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between select-none transition-colors duration-200">
                        <div>
                            © 2026 <strong>ACMIS CBET Alignment System</strong>. All rights Reserved.
                        </div>
                        <div className="text-slate-400 dark:text-slate-500 text-[10px]">
                            Makerere University Business School • Group 8 (BBC)
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
