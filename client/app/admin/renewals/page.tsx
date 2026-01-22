'use client';

import { useState, useEffect } from 'react';
import { Policy } from '@/app/types';

interface PolicyWithCustomer extends Policy {
    customer_name: string;
    company_name: string;
    product_name: string;
    days_remaining: number;
}

export default function RenewalsPage() {
    const [policies, setPolicies] = useState<PolicyWithCustomer[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterRange, setFilterRange] = useState<'expired' | 'week' | 'month' | 'twomonths'>('week');

    useEffect(() => {
        // TODO: Fetch from API
        const today = new Date();
        const mockPolicies: PolicyWithCustomer[] = [
            {
                id: '1',
                customer_id: '1',
                customer_name: 'Rajesh Kumar',
                insurance_company_id: '1',
                company_name: 'ICICI Lombard',
                product_type_id: '1',
                product_name: 'Car Insurance',
                policy_number: 'POL-2024-001',
                policy_start_date: new Date(2024, 0, 15).toISOString(),
                policy_end_date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                premium_amount: 25000,
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                days_remaining: 5,
            },
            {
                id: '2',
                customer_id: '2',
                customer_name: 'Priya Sharma',
                insurance_company_id: '2',
                company_name: 'Star Health',
                product_type_id: '2',
                product_name: 'Health Insurance',
                policy_number: 'POL-2024-002',
                policy_start_date: new Date(2024, 1, 10).toISOString(),
                policy_end_date: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                premium_amount: 18000,
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                days_remaining: 15,
            },
            {
                id: '3',
                customer_id: '3',
                customer_name: 'Amit Patel',
                insurance_company_id: '3',
                company_name: 'Bajaj General',
                product_type_id: '3',
                product_name: 'Two-Wheeler Insurance',
                policy_number: 'POL-2024-003',
                policy_start_date: new Date(2024, 2, 5).toISOString(),
                policy_end_date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                premium_amount: 3500,
                status: 'expired',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                days_remaining: -3,
            },
            {
                id: '4',
                customer_id: '4',
                customer_name: 'Sneha Reddy',
                insurance_company_id: '4',
                company_name: 'LIC',
                product_type_id: '4',
                product_name: 'Life Insurance',
                policy_number: 'POL-2024-004',
                policy_start_date: new Date(2023, 5, 20).toISOString(),
                policy_end_date: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
                premium_amount: 50000,
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                days_remaining: 45,
            },
        ];

        setTimeout(() => {
            setPolicies(mockPolicies);
            setLoading(false);
        }, 500);
    }, []);

    const getFilteredPolicies = () => {
        switch (filterRange) {
            case 'expired':
                return policies.filter(p => p.days_remaining < 0);
            case 'week':
                return policies.filter(p => p.days_remaining >= 0 && p.days_remaining <= 7);
            case 'month':
                return policies.filter(p => p.days_remaining >= 0 && p.days_remaining <= 30);
            case 'twomonths':
                return policies.filter(p => p.days_remaining >= 0 && p.days_remaining <= 60);
            default:
                return policies;
        }
    };

    const filteredPolicies = getFilteredPolicies();

    const getUrgencyColor = (days: number) => {
        if (days < 0) return 'bg-red-100 text-red-700 border-red-200';
        if (days <= 7) return 'bg-orange-100 text-orange-700 border-orange-200';
        if (days <= 30) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-green-100 text-green-700 border-green-200';
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
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Renewals Tracker</h1>
                <p className="text-slate-600">Track and manage upcoming policy renewals</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <button
                    onClick={() => setFilterRange('expired')}
                    className={`bg-white rounded-xl p-4 border-2 transition-all text-left ${filterRange === 'expired' ? 'border-red-500 shadow-lg' : 'border-slate-200'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">Expired</p>
                            <p className="text-2xl font-black text-red-600">
                                {policies.filter(p => p.days_remaining < 0).length}
                            </p>
                        </div>
                        <i className="fas fa-exclamation-circle text-2xl text-red-500"></i>
                    </div>
                </button>
                <button
                    onClick={() => setFilterRange('week')}
                    className={`bg-white rounded-xl p-4 border-2 transition-all text-left ${filterRange === 'week' ? 'border-orange-500 shadow-lg' : 'border-slate-200'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">This Week</p>
                            <p className="text-2xl font-black text-orange-600">
                                {policies.filter(p => p.days_remaining >= 0 && p.days_remaining <= 7).length}
                            </p>
                        </div>
                        <i className="fas fa-calendar-week text-2xl text-orange-500"></i>
                    </div>
                </button>
                <button
                    onClick={() => setFilterRange('month')}
                    className={`bg-white rounded-xl p-4 border-2 transition-all text-left ${filterRange === 'month' ? 'border-yellow-500 shadow-lg' : 'border-slate-200'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">This Month</p>
                            <p className="text-2xl font-black text-yellow-600">
                                {policies.filter(p => p.days_remaining >= 0 && p.days_remaining <= 30).length}
                            </p>
                        </div>
                        <i className="fas fa-calendar-alt text-2xl text-yellow-500"></i>
                    </div>
                </button>
                <button
                    onClick={() => setFilterRange('twomonths')}
                    className={`bg-white rounded-xl p-4 border-2 transition-all text-left ${filterRange === 'twomonths' ? 'border-green-500 shadow-lg' : 'border-slate-200'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">Next 60 Days</p>
                            <p className="text-2xl font-black text-green-600">
                                {policies.filter(p => p.days_remaining >= 0 && p.days_remaining <= 60).length}
                            </p>
                        </div>
                        <i className="fas fa-calendar text-2xl text-green-500"></i>
                    </div>
                </button>
            </div>

            {/* Renewals Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900">
                        {filterRange === 'expired' && 'Expired Policies'}
                        {filterRange === 'week' && 'Expiring This Week'}
                        {filterRange === 'month' && 'Expiring This Month'}
                        {filterRange === 'twomonths' && 'Expiring in Next 60 Days'}
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Company
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Premium
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    End Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredPolicies.map((policy) => (
                                <tr key={policy.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-slate-900">{policy.customer_name}</p>
                                        <p className="text-xs text-slate-500">{policy.policy_number}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-700">{policy.company_name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-700">{policy.product_name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-slate-900">
                                            ₹{policy.premium_amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">
                                            {new Date(policy.policy_end_date).toLocaleDateString('en-IN')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(policy.days_remaining)}`}>
                                            {policy.days_remaining < 0
                                                ? `Expired ${Math.abs(policy.days_remaining)}d ago`
                                                : `${policy.days_remaining} days left`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                className="px-4 py-2 bg-[#004aad] text-white text-xs font-semibold rounded-lg hover:bg-[#003580] transition-all"
                                            >
                                                Renew
                                            </button>
                                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                <i className="fab fa-whatsapp"></i>
                                            </button>
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <i className="fas fa-phone"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredPolicies.length === 0 && (
                    <div className="text-center py-12">
                        <i className="fas fa-calendar-check text-4xl text-slate-300 mb-3"></i>
                        <p className="text-slate-500">No policies found in this range</p>
                    </div>
                )}
            </div>
        </div>
    );
}
