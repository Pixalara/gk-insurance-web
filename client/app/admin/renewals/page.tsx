'use client';

import { useState, useEffect } from 'react';
import { Policy } from '@/app/types';
import { getPolicies, updatePolicy } from '@/app/actions/policy-actions';
import { getCustomers } from '@/app/actions/customer-actions';
import { getCompanies } from '@/app/actions/company-actions';

interface PolicyWithDetails extends Policy {
    customer_name: string;
    company_name: string;
    product_name: string;
    days_remaining: number;
}

export default function RenewalsPage() {
    const [policies, setPolicies] = useState<PolicyWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterRange, setFilterRange] = useState<'expired' | 'week' | 'month' | 'twomonths'>('week');
    const [renewingId, setRenewingId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [storedPolicies, storedCustomers, storedCompanies] = await Promise.all([
                getPolicies(),
                getCustomers(),
                getCompanies()
            ]);

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize today to start of day

            const enrichedPolicies: PolicyWithDetails[] = storedPolicies.map(policy => {
                const customer = storedCustomers.find(c => c.id === policy.customer_id);
                const company = storedCompanies.find(c => c.id === policy.insurance_company_id);
                const endDate = new Date(policy.policy_end_date);
                const diffTime = endDate.getTime() - today.getTime();
                const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // Map product type id to readable name
                const productNames: Record<string, string> = {
                    'car': 'Car Insurance',
                    'two-wheeler': 'Two-Wheeler',
                    'health': 'Health Insurance',
                    'life': 'Life Insurance',
                    'commercial': 'Commercial Vehicle'
                };

                return {
                    ...policy,
                    customer_name: customer?.name || 'Unknown Customer',
                    company_name: company?.name || 'Unknown Company',
                    product_name: productNames[policy.product_type] || policy.product_type,
                    days_remaining: daysRemaining
                };
            });

            // Sort by days remaining (ascending)
            enrichedPolicies.sort((a, b) => a.days_remaining - b.days_remaining);

            setPolicies(enrichedPolicies);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

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
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider ">
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
                                    <td className="px-6 py-4 ">
                                        <span className={`px-3 py-1 rounded-md text-xs font-semibold border ${getUrgencyColor(policy.days_remaining)}`}>
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
