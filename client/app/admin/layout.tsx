'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

const menuItems = [
    { icon: 'fa-chart-line', label: 'Dashboard', href: '/admin/dashboard' },
    { icon: 'fa-envelope-open-text', label: 'Leads', href: '/admin/leads' },
    { icon: 'fa-users', label: 'Customers', href: '/admin/customers' },
    { icon: 'fa-file-contract', label: 'Renewals', href: '/admin/renewals' },
    { icon: 'fa-building', label: 'Companies', href: '/admin/companies' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { admin, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Don't show layout on login/signup pages
    if (pathname === '/admin/login' || pathname === '/admin/signup') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 md:px-6 py-4">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl text-slate-700`}></i>
                        </button>

                        {/* Logo */}
                        <div>
                            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#004aad]">
                                GK Insurance
                            </h1>
                            <p className="text-xs text-slate-500 hidden sm:block">Admin Dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Notifications */}
                        <button className="relative p-2 text-slate-600 hover:text-[#004aad] transition-colors">
                            <i className="fas fa-bell text-lg md:text-xl"></i>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Profile */}
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-semibold text-slate-900">{admin?.name || 'Admin User'}</p>
                                <p className="text-xs text-slate-500">{admin?.email || 'admin@gkinsurance.com'}</p>
                            </div>
                            <button className="w-8 h-8 md:w-10 md:h-10 bg-[#004aad] text-white rounded-full flex items-center justify-center font-bold text-sm md:text-base">
                                {admin?.name?.charAt(0).toUpperCase() || 'A'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex relative">
                {/* Mobile Sidebar Overlay */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    ></div>
                )}

                {/* Sidebar */}
                <aside
                    className={`
            fixed top-[73px] left-0 z-40
            w-64 bg-white border-r border-slate-200 
            h-[calc(100vh-73px)] overflow-y-auto
            transform transition-transform duration-300 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
                >
                    <nav className="p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${isActive
                                                ? 'bg-[#004aad] text-white shadow-lg'
                                                : 'text-slate-700 hover:bg-slate-100'
                                                }`}
                                        >
                                            <i className={`fas ${item.icon} w-5`}></i>
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="mt-8 pt-8 border-t border-slate-200">
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 transition-all"
                            >
                                <i className="fas fa-globe w-5"></i>
                                <span>View Website</span>
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition-all"
                            >
                                <i className="fas fa-sign-out-alt w-5"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 w-full md:ml-64">
                    {children}
                </main>
            </div>
        </div>
    );
}
