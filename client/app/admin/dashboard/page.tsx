'use client';

import { useEffect, useState } from 'react';
import { DashboardStats, Lead } from '@/app/types';
import { getDashboardStats } from '@/app/actions/dashboard-actions';
import Link from 'next/link';

/* ✅ ADD THIS TYPE */
interface UpcomingRenewal {
    id: string;
    customer_name: string;
    product_type: string;
    days_remaining: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
    const [upcomingRenewals, setUpcomingRenewals] = useState<UpcomingRenewal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getDashboardStats();
            setStats(data.stats);
            setRecentLeads(data.recentLeads);
            setUpcomingRenewals(data.upcomingRenewals);
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

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
                    value={(stats?.expiring_soon || 0).toString()}
                    color="orange"
                    badge={(stats?.expiring_soon || 0) > 0}
                />
                <StatsCard
                    icon="fa-rupee-sign"
                    label="Total Premium"
                    value={`₹${((stats?.total_premium || 0) / 100000).toFixed(2)}L`}
                    color="purple"
                />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Leads */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Recent Leads</h2>
                        <Link href="/admin/leads" className="text-sm text-[#004aad] hover:underline font-semibold">
                            View all →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentLeads.length === 0 ? (
                            <p className="text-slate-400 text-sm">No recent leads</p>
                        ) : (
                            recentLeads.map((lead) => (
                                <div key={lead.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">{lead.name}</p>
                                        <p className="text-xs text-slate-500 capitalize">
                                            {lead.product_type} • {new Date(lead.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        lead.status === 'new'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {lead.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Upcoming Renewals */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Upcoming Renewals</h2>
                        <Link href="/admin/renewals" className="text-sm text-[#004aad] hover:underline font-semibold">
                            View all →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {upcomingRenewals.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-4 text-center">
                                <i className="fas fa-check-circle text-2xl text-green-400 mb-2"></i>
                                <p className="text-slate-400 text-sm">No renewals in next 30 days</p>
                            </div>
                        ) : (
                            upcomingRenewals.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">{item.customer_name}</p>
                                        <p className="text-xs text-slate-500 capitalize">
                                            {item.product_type} Insurance
                                        </p>
                                    </div>
                                    <span className={`text-xs font-bold ${
                                        item.days_remaining < 0
                                            ? 'text-red-600'
                                            : item.days_remaining <= 7
                                            ? 'text-orange-600'
                                            : 'text-slate-600'
                                    }`}>
                                        {item.days_remaining < 0
                                            ? 'Expired'
                                            : `${item.days_remaining} days`}
                                    </span>
                                </div>
                            ))
                        )}
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
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
        </div>
    );
}
