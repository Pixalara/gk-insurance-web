'use client';

import { useEffect, useState } from 'react';
import { DashboardStats } from '@/app/types';

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch actual data from API
        const mockStats: DashboardStats = {
            total_customers: 1523,
            active_policies: 2147,
            expiring_soon: 45,
            total_premium: 12450000,
            company_distribution: [
                { name: 'Bajaj General', count: 520 },
                { name: 'ICICI Lombard', count: 380 },
                { name: 'Tata AIG', count: 290 },
                { name: 'Star Health', count: 450 },
                { name: 'LIC', count: 507 },
            ],
            product_distribution: [
                { name: 'Two-Wheeler', count: 650 },
                { name: 'Car', count: 480 },
                { name: 'Health', count: 450 },
                { name: 'Life', count: 507 },
                { name: 'Commercial', count: 60 },
            ],
            monthly_trends: [
                { month: 'Jan', count: 120, premium: 850000 },
                { month: 'Feb', count: 145, premium: 920000 },
                { month: 'Mar', count: 180, premium: 1200000 },
            ],
        };

        setTimeout(() => {
            setStats(mockStats);
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-pulse text-slate-400">
                    <i className="fas fa-spinner fa-spin text-4xl"></i>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Dashboard</h1>
                <p className="text-slate-600">Overview of your insurance business</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    icon="fa-users"
                    label="Total Customers"
                    value={stats?.total_customers.toLocaleString() || '0'}
                    color="blue"
                />
                <StatsCard
                    icon="fa-file-contract"
                    label="Active Policies"
                    value={stats?.active_policies.toLocaleString() || '0'}
                    color="green"
                />
                <StatsCard
                    icon="fa-clock"
                    label="Expiring Soon"
                    value={stats?.expiring_soon.toString() || '0'}
                    color="orange"
                    badge
                />
                <StatsCard
                    icon="fa-rupee-sign"
                    label="Total Premium"
                    value={`₹${((stats?.total_premium || 0) / 100000).toFixed(1)}L`}
                    color="purple"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Company Distribution */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Company-wise Distribution</h2>
                    <div className="space-y-3">
                        {stats?.company_distribution.map((company, idx) => {
                            const total = stats.company_distribution.reduce((sum, c) => sum + c.count, 0);
                            const percentage = ((company.count / total) * 100).toFixed(1);
                            return (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-semibold text-slate-700">{company.name}</span>
                                        <span className="text-slate-500">{company.count} ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div
                                            className="bg-[#004aad] h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Product Distribution */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Product-wise Distribution</h2>
                    <div className="space-y-3">
                        {stats?.product_distribution.map((product, idx) => {
                            const total = stats.product_distribution.reduce((sum, p) => sum + p.count, 0);
                            const percentage = ((product.count / total) * 100).toFixed(1);
                            const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500'];
                            return (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-semibold text-slate-700">{product.name}</span>
                                        <span className="text-slate-500">{product.count} ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div
                                            className={`${colors[idx % colors.length]} h-2 rounded-full transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Leads */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Recent Leads</h2>
                        <a href="/admin/leads" className="text-sm text-[#004aad] hover:underline font-semibold">
                            View all →
                        </a>
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                <div>
                                    <p className="font-semibold text-slate-900 text-sm">Rajesh Kumar</p>
                                    <p className="text-xs text-slate-500">Car Insurance • 2 hours ago</p>
                                </div>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                                    New
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Renewals */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Upcoming Renewals</h2>
                        <a href="/admin/renewals" className="text-sm text-[#004aad] hover:underline font-semibold">
                            View all →
                        </a>
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                <div>
                                    <p className="font-semibold text-slate-900 text-sm">Priya Sharma</p>
                                    <p className="text-xs text-slate-500">Health • Star Health</p>
                                </div>
                                <span className="text-xs text-slate-500">
                                    {i * 3} days
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface StatsCardProps {
    icon: string;
    label: string;
    value: string;
    color: 'blue' | 'green' | 'orange' | 'purple';
    badge?: boolean;
}

function StatsCard({ icon, label, value, color, badge }: StatsCardProps) {
    const colorMap = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        orange: 'bg-orange-50 text-orange-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center`}>
                    <i className={`fas ${icon} text-xl`}></i>
                </div>
                {badge && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                        Action Required
                    </span>
                )}
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">{value}</h3>
            <p className="text-sm text-slate-600 font-medium">{label}</p>

            {/* Decorative element */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${colorMap[color]} opacity-10 group-hover:scale-150 transition-transform duration-500`}></div>
        </div>
    );
}
