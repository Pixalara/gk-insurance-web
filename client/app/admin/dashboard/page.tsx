'use client';

import { useEffect, useState } from 'react';
import { DashboardStats, Policy, Lead } from '@/app/types';
import {
    getCustomers,
    getPolicies,
    getLeads,
    getCompanies,
    initializeCustomers,
    initializePolicies
} from '@/app/utils/storage';
import Link from 'next/link';

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
    const [upcomingRenewals, setUpcomingRenewals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        initializeCustomers();
        initializePolicies();

        const customers = getCustomers();
        const policies = getPolicies();
        const leads = getLeads();
        const companies = getCompanies();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Basic Stats
        const totalCustomers = customers.length;
        const activePolicies = policies.filter(p => p.status === 'active').length;

        // Expiring in next 30 days
        const expiringPolicies = policies.filter(p => {
            const endDate = new Date(p.policy_end_date);
            const diffTime = endDate.getTime() - today.getTime();
            const daysRemaining = diffTime / (1000 * 60 * 60 * 24);
            return daysRemaining >= 0 && daysRemaining <= 30;
        });

        const totalPremium = policies.reduce((sum, p) => sum + (Number(p.premium_amount) || 0), 0);

        // 2. Company Distribution
        const companyStats: Record<string, number> = {};
        policies.forEach(p => {
            const id = p.insurance_company_id;
            companyStats[id] = (companyStats[id] || 0) + 1;
        });

        const companyDistribution = Object.entries(companyStats).map(([id, count]) => {
            const company = companies.find(c => c.id === id);
            return {
                name: company?.name || 'Unknown',
                count
            };
        }).sort((a, b) => b.count - a.count);

        // 3. Product Distribution
        const productStats: Record<string, number> = {};
        policies.forEach(p => {
            const type = p.product_type_id;
            productStats[type] = (productStats[type] || 0) + 1;
        });

        const productDistribution = Object.entries(productStats).map(([name, count]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
            count
        })).sort((a, b) => b.count - a.count);

        // 4. Monthly Trends (Simulated based on policy start dates for this year)
        const currentYear = new Date().getFullYear();
        const monthlyStats: Record<number, { count: number, premium: number }> = {};

        policies.forEach(p => {
            const startDate = new Date(p.policy_start_date);
            if (startDate.getFullYear() === currentYear) {
                const month = startDate.getMonth();
                if (!monthlyStats[month]) monthlyStats[month] = { count: 0, premium: 0 };
                monthlyStats[month].count++;
                monthlyStats[month].premium += Number(p.premium_amount) || 0;
            }
        });

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyTrends = Object.entries(monthlyStats)
            .map(([monthIdx, data]) => ({
                month: months[Number(monthIdx)],
                count: data.count,
                premium: data.premium
            }))
            .slice(0, 6); // Show first 6 available months

        // 5. Recent Leads
        const sortedLeads = [...leads].sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 5);
        setRecentLeads(sortedLeads);

        // 6. Upcoming Renewals (Enriched)
        const renewalsList = expiringPolicies.map(p => {
            const c = customers.find(cust => cust.id === p.customer_id);
            const endDate = new Date(p.policy_end_date);
            const diffTime = endDate.getTime() - today.getTime();
            const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return {
                id: p.id,
                customer_name: c?.name || 'Unknown',
                product_type: p.product_type_id,
                days_remaining: days
            };
        }).sort((a, b) => a.days_remaining - b.days_remaining).slice(0, 5);
        setUpcomingRenewals(renewalsList);

        setStats({
            total_customers: totalCustomers,
            active_policies: activePolicies,
            expiring_soon: expiringPolicies.length,
            total_premium: totalPremium,
            company_distribution: companyDistribution,
            product_distribution: productDistribution,
            monthly_trends: monthlyTrends.length > 0 ? monthlyTrends : [{ month: 'Jan', count: 0, premium: 0 }]
        });

        setLoading(false);
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

            {/* Charts Grid - 3 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Product Distribution */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Product Distribution</h2>
                    <div className="space-y-3">
                        {stats?.product_distribution.length === 0 ? (
                            <p className="text-slate-400 text-sm">No data available</p>
                        ) : (
                            stats?.product_distribution.map((product, idx) => {
                                const total = stats.product_distribution.reduce((sum, p) => sum + p.count, 0);
                                const percentage = total > 0 ? ((product.count / total) * 100).toFixed(1) : '0';
                                const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500'];
                                return (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-semibold text-slate-700">{product.name}</span>
                                            <span className="text-slate-500">{product.count}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div
                                                className={`${colors[idx % colors.length]} h-2 rounded-full`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Company Distribution */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Company Distribution</h2>
                    <div className="space-y-3">
                        {stats?.company_distribution.length === 0 ? (
                            <p className="text-slate-400 text-sm">No data available</p>
                        ) : (
                            stats?.company_distribution.map((company, idx) => {
                                const total = stats.company_distribution.reduce((sum, c) => sum + c.count, 0);
                                const percentage = total > 0 ? ((company.count / total) * 100).toFixed(1) : '0';
                                return (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-semibold text-slate-700 overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">{company.name}</span>
                                            <span className="text-slate-500">{company.count}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div
                                                className="bg-[#004aad] h-2 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Monthly Trends */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Monthly Trends</h2>
                    <div className="h-48 flex items-end gap-2 px-2">
                        {stats?.monthly_trends.map((month, idx) => {
                            const max = Math.max(...(stats?.monthly_trends.map(m => m.premium) || [1]));
                            const height = max > 0 ? (month.premium / max) * 100 : 0;

                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className="w-full bg-green-500 rounded-t-lg opacity-80 hover:opacity-100 transition-all duration-300 relative group"
                                        style={{ height: `${height}%`, minHeight: '4px' }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                            {month.count}
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500">{month.month}</span>
                                </div>
                            )
                        })}
                        {(!stats?.monthly_trends || stats.monthly_trends.length === 0) && (
                            <p className="text-slate-400 text-sm w-full text-center self-center">No trend data</p>
                        )}
                    </div>
                </div>
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
                                        <p className="text-xs text-slate-500 capitalize">{lead.insurance_type} • {new Date(lead.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${lead.status === 'new' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'
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
                                        <p className="text-xs text-slate-500 capitalize">{item.product_type} Insurance</p>
                                    </div>
                                    <span className={`text-xs font-bold ${item.days_remaining < 0 ? 'text-red-600' :
                                        item.days_remaining <= 7 ? 'text-orange-600' : 'text-slate-600'
                                        }`}>
                                        {item.days_remaining < 0 ? 'Expired' : `${item.days_remaining} days`}
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
