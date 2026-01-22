'use client';

import { useState, useEffect } from 'react';
import { InsuranceCompany } from '@/app/types';

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        // TODO: Fetch from API
        const mockCompanies: InsuranceCompany[] = [
            { id: '1', name: 'Bajaj General Insurance', category: 'general', is_active: true },
            { id: '2', name: 'Tata AIG', category: 'general', is_active: true },
            { id: '3', name: 'ICICI Lombard', category: 'general', is_active: true },
            { id: '4', name: 'Go Digit', category: 'general', is_active: true },
            { id: '5', name: 'Liberty General Insurance', category: 'general', is_active: true },
            { id: '6', name: 'Star Health', category: 'health', is_active: true },
            { id: '7', name: 'Bajaj Health Insurance', category: 'health', is_active: true },
            { id: '8', name: 'LIC', category: 'life', is_active: true },
            { id: '9', name: 'Bajaj Life', category: 'life', is_active: true },
        ];

        setTimeout(() => {
            setCompanies(mockCompanies);
            setLoading(false);
        }, 500);
    }, []);

    const filteredCompanies = companies.filter(company =>
        categoryFilter === 'all' || company.category === categoryFilter
    );

    const toggleActive = (id: string) => {
        setCompanies(companies.map(company =>
            company.id === id ? { ...company, is_active: !company.is_active } : company
        ));
    };

    const getCategoryBadge = (category: string) => {
        const badges = {
            general: 'bg-blue-100 text-blue-700',
            health: 'bg-green-100 text-green-700',
            life: 'bg-purple-100 text-purple-700',
        };
        return badges[category as keyof typeof badges];
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
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Insurance Companies</h1>
                    <p className="text-slate-600">Manage your insurance company partners</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-[#004aad] text-white font-bold rounded-lg hover:bg-[#003580] transition-all duration-300 flex items-center gap-2"
                >
                    <i className="fas fa-plus"></i>
                    Add Company
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <button
                    onClick={() => setCategoryFilter('all')}
                    className={`bg-white rounded-xl p-4 border-2 transition-all text-left ${categoryFilter === 'all' ? 'border-[#004aad] shadow-lg' : 'border-slate-200'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">All Companies</p>
                            <p className="text-2xl font-black text-slate-900">{companies.length}</p>
                        </div>
                        <i className="fas fa-building text-2xl text-slate-500"></i>
                    </div>
                </button>
                <button
                    onClick={() => setCategoryFilter('general')}
                    className={`bg-white rounded-xl p-4 border-2 transition-all text-left ${categoryFilter === 'general' ? 'border-blue-500 shadow-lg' : 'border-slate-200'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">General</p>
                            <p className="text-2xl font-black text-blue-600">
                                {companies.filter(c => c.category === 'general').length}
                            </p>
                        </div>
                        <i className="fas fa-car text-2xl text-blue-500"></i>
                    </div>
                </button>
                <button
                    onClick={() => setCategoryFilter('health')}
                    className={`bg-white rounded-xl p-4 border-2 transition-all text-left ${categoryFilter === 'health' ? 'border-green-500 shadow-lg' : 'border-slate-200'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">Health</p>
                            <p className="text-2xl font-black text-green-600">
                                {companies.filter(c => c.category === 'health').length}
                            </p>
                        </div>
                        <i className="fas fa-heart-pulse text-2xl text-green-500"></i>
                    </div>
                </button>
                <button
                    onClick={() => setCategoryFilter('life')}
                    className={`bg-white rounded-xl p-4 border-2 transition-all text-left ${categoryFilter === 'life' ? 'border-purple-500 shadow-lg' : 'border-slate-200'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">Life</p>
                            <p className="text-2xl font-black text-purple-600">
                                {companies.filter(c => c.category === 'life').length}
                            </p>
                        </div>
                        <i className="fas fa-hand-holding-heart text-2xl text-purple-500"></i>
                    </div>
                </button>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company) => (
                    <div
                        key={company.id}
                        className={`bg-white rounded-2xl shadow-sm border-2 p-6 transition-all duration-300 ${company.is_active
                                ? 'border-slate-200 hover:shadow-lg'
                                : 'border-slate-200 opacity-60'
                            }`}
                    >
                        {/* Company Logo Placeholder */}
                        <div className="w-full h-24 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                            <i className="fas fa-building text-3xl text-slate-300"></i>
                        </div>

                        {/* Company Name */}
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{company.name}</h3>

                        {/* Category Badge */}
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getCategoryBadge(company.category)}`}>
                            {company.category.charAt(0).toUpperCase() + company.category.slice(1)}
                        </span>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => toggleActive(company.id)}
                                className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${company.is_active
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {company.is_active ? (
                                    <>
                                        <i className="fas fa-check-circle mr-1"></i> Active
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-times-circle mr-1"></i> Inactive
                                    </>
                                )}
                            </button>
                            <button className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-all">
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all">
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Company Modal */}
            {showAddModal && (
                <AddCompanyModal onClose={() => setShowAddModal(false)} />
            )}
        </div>
    );
}

function AddCompanyModal({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'general',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: API call to create company
        console.log('Creating company:', formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"
                >
                    <i className="fas fa-times text-2xl"></i>
                </button>

                <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Company</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                            placeholder="Enter company name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                        >
                            <option value="general">General Insurance</option>
                            <option value="health">Health Insurance</option>
                            <option value="life">Life Insurance</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-[#004aad] text-white font-bold rounded-lg hover:bg-[#003580] transition-all duration-300"
                        >
                            Add Company
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
