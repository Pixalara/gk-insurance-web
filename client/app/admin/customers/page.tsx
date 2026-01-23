'use client';

import { useState, useEffect } from 'react';
import { Customer, Policy, InsuranceCompany } from '@/app/types';
import {
    getCustomers,
    saveCustomer,
    updateCustomer,
    deleteCustomer,
    initializeCustomers,
    getPolicies,
    savePolicy,
    deletePolicy,
    getCompanies,
    initializeCompanies,
    initializePolicies
} from '@/app/utils/storage';
import ConfirmationModal from '@/app/components/ConfirmationModal';

type CustomerWithCounts = Customer & { policies_count: number; active_policies: number };

export default function CustomersPage() {
    const [customers, setCustomers] = useState<CustomerWithCounts[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<CustomerWithCounts | null>(null);

    // Delete state
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const loadData = () => {
        initializeCustomers();
        initializeCompanies();
        initializePolicies();

        const storedCustomers = getCustomers();
        const storedPolicies = getPolicies();

        // Calculate real stats
        const customersWithCounts: CustomerWithCounts[] = storedCustomers.map((customer) => {
            const customerPolicies = storedPolicies.filter(p => p.customer_id === customer.id);
            const activePolicies = customerPolicies.filter(p => p.status === 'active');

            return {
                ...customer,
                policies_count: customerPolicies.length,
                active_policies: activePolicies.length,
            };
        });

        setCustomers(customersWithCounts);
        setLoading(false);
    };

    useEffect(() => {
        setTimeout(() => {
            loadData();
        }, 300);
    }, []);

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (customer: CustomerWithCounts) => {
        setEditingCustomer({ ...customer });
        setShowEditModal(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            deleteCustomer(deleteId);
            loadData();
            setDeleteId(null);
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
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Customer Management</h1>
                    <p className="text-slate-600">Manage all your customers and their policies</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-3 bg-[#004aad] text-white font-bold rounded-lg hover:bg-[#003580] transition-all duration-300 flex items-center gap-2"
                    >
                        <i className="fas fa-plus"></i>
                        Add Customer
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">Total Customers</p>
                            <p className="text-2xl font-black text-slate-900">{customers.length}</p>
                        </div>
                        <i className="fas fa-users text-2xl text-blue-500"></i>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">Total Policies</p>
                            <p className="text-2xl font-black text-green-600">
                                {customers.reduce((sum, c) => sum + c.policies_count, 0)}
                            </p>
                        </div>
                        <i className="fas fa-file-contract text-2xl text-green-500"></i>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">Active Policies</p>
                            <p className="text-2xl font-black text-purple-600">
                                {customers.reduce((sum, c) => sum + c.active_policies, 0)}
                            </p>
                        </div>
                        <i className="fas fa-check-double text-2xl text-purple-500"></i>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                <div className="relative">
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                        type="text"
                        placeholder="Search by name, phone, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                    />
                </div>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map((customer) => (
                    <div
                        key={customer.id}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#004aad] text-white rounded-full flex items-center justify-center font-bold text-lg">
                                    {customer.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{customer.name}</h3>
                                    <p className="text-sm text-slate-500">{customer.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 mb-4">
                            {customer.email && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <i className="fas fa-envelope w-4"></i>
                                    <span className="truncate">{customer.email}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <i className="fas fa-map-marker-alt w-4"></i>
                                <span className="truncate">{customer.address}</span>
                            </div>
                        </div>

                        {/* Policy Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                                <p className="text-2xl font-black text-blue-600">{customer.policies_count}</p>
                                <p className="text-xs text-blue-600 font-medium">Total Policies</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 text-center">
                                <p className="text-2xl font-black text-green-600">{customer.active_policies}</p>
                                <p className="text-xs text-green-600 font-medium">Active</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(customer)}
                                className="flex-1 py-2 bg-[#004aad] text-white text-sm font-semibold rounded-lg hover:bg-[#003580] transition-all"
                            >
                                <i className="fas fa-edit mr-1"></i> Manage
                            </button>
                            <button
                                onClick={() => handleDeleteClick(customer.id)}
                                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>

                        {customer.notes && (
                            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                                <i className="fas fa-sticky-note mr-1"></i>
                                {customer.notes}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredCustomers.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                    <i className="fas fa-users text-4xl text-slate-300 mb-3"></i>
                    <p className="text-slate-500">No customers found</p>
                </div>
            )}

            {/* Add Customer Modal */}
            {showAddModal && (
                <AddCustomerModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={() => {
                        loadData();
                        setShowAddModal(false);
                    }}
                />
            )}

            {/* Edit Customer Modal */}
            {showEditModal && editingCustomer && (
                <EditCustomerModal
                    customer={editingCustomer}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingCustomer(null);
                    }}
                    onSave={() => {
                        loadData();
                    }}
                />
            )}

            {/* Delete Customer Modal */}
            <ConfirmationModal
                isOpen={!!deleteId}
                title="Delete Customer?"
                message="Are you sure you want to delete this customer? This will also delete all associated policies."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}

function AddCustomerModal({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveCustomer({
            name: formData.name,
            phone: formData.phone,
            email: formData.email || undefined,
            address: formData.address || undefined,
            notes: formData.notes || undefined,
        });
        onAdd();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"
                >
                    <i className="fas fa-times text-2xl"></i>
                </button>

                <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Customer</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                            placeholder="Enter customer name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                            placeholder="Enter email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Address
                        </label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent resize-none"
                            placeholder="Enter address"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent resize-none"
                            placeholder="Any additional notes..."
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-[#004aad] text-white font-bold rounded-lg hover:bg-[#003580] transition-all duration-300"
                        >
                            Add Customer
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

function EditCustomerModal({ customer, onClose, onSave }: { customer: Customer; onClose: () => void; onSave: () => void }) {
    const [activeTab, setActiveTab] = useState<'details' | 'policies'>('policies');
    const [formData, setFormData] = useState({
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone,
        address: customer.address || '',
        notes: customer.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateCustomer(customer.id, {
            name: formData.name,
            phone: formData.phone,
            email: formData.email || undefined,
            address: formData.address || undefined,
            notes: formData.notes || undefined,
        });
        onSave();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0 relative flex flex-col">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">{customer.name}</h2>
                        <p className="text-sm text-slate-500">Manage customer details and policies</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900">
                        <i className="fas fa-times text-2xl"></i>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 px-6">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`px-6 py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'details'
                            ? 'border-[#004aad] text-[#004aad]'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Customer Details
                    </button>
                    <button
                        onClick={() => setActiveTab('policies')}
                        className={`px-6 py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'policies'
                            ? 'border-[#004aad] text-[#004aad]'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Policies
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {activeTab === 'details' ? (
                        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] resize-none"
                                />
                            </div>
                            <button type="submit" className="px-6 py-3 bg-[#004aad] text-white font-bold rounded-lg hover:bg-[#003580] transition-colors">
                                Save Details
                            </button>
                        </form>
                    ) : (
                        <CustomerPoliciesManager customer={customer} onUpdate={onSave} />
                    )}
                </div>
            </div>
        </div>
    );
}

function CustomerPoliciesManager({ customer, onUpdate }: { customer: Customer; onUpdate: () => void }) {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);

    // Policy Delete State
    const [deletePolicyId, setDeletePolicyId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [customer.id]);

    const loadData = () => {
        const allPolicies = getPolicies();
        const allCompanies = getCompanies();
        setPolicies(allPolicies.filter(p => p.customer_id === customer.id));
        setCompanies(allCompanies);
    };

    const handleDeletePolicyClick = (id: string) => {
        setDeletePolicyId(id);
    };

    const confirmDeletePolicy = () => {
        if (deletePolicyId) {
            deletePolicy(deletePolicyId);
            loadData();
            onUpdate(); // Update customer stats
            setDeletePolicyId(null);
        }
    };

    // Need a separate component for adding policies to keep clean
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Active Policies ({policies.length})</h3>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                    <i className="fas fa-plus"></i> Add Policy
                </button>
            </div>

            {showAddForm && (
                <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4">New Policy Details</h4>
                    <AddPolicyForm
                        customerId={customer.id}
                        companies={companies}
                        onCancel={() => setShowAddForm(false)}
                        onSuccess={() => {
                            setShowAddForm(false);
                            loadData();
                            onUpdate();
                        }}
                    />
                </div>
            )}

            <div className="space-y-4">
                {policies.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
                        No policies found for this customer.
                    </div>
                ) : (
                    policies.map(policy => {
                        const company = companies.find(c => c.id === policy.insurance_company_id);
                        return (
                            <div key={policy.id} className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors bg-white group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-slate-900">{company?.name || 'Unknown Company'}</span>
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full uppercase font-medium">
                                                {policy.product_type_id}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">Policy No: <span className="font-mono text-slate-800">{policy.policy_number}</span></p>
                                        <div className="flex gap-4 text-xs text-slate-500">
                                            <span>Start: {new Date(policy.policy_start_date).toLocaleDateString()}</span>
                                            <span>End: {new Date(policy.policy_end_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <p className="text-lg font-black text-[#004aad]">₹{policy.premium_amount.toLocaleString()}</p>
                                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase ${policy.status === 'active' ? 'bg-green-100 text-green-700' :
                                            policy.status === 'expired' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                                            }`}>
                                            {policy.status}
                                        </span>
                                        <button
                                            onClick={() => handleDeletePolicyClick(policy.id)}
                                            className="text-red-500 hover:text-red-700 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <i className="fas fa-trash mr-1"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Policy Delete Confirmation */}
            <ConfirmationModal
                isOpen={!!deletePolicyId}
                title="Delete Policy?"
                message="Are you sure you want to delete this policy? This action cannot be undone."
                onConfirm={confirmDeletePolicy}
                onCancel={() => setDeletePolicyId(null)}
            />
        </div>
    );
}

function AddPolicyForm({ customerId, companies, onCancel, onSuccess }: { customerId: string; companies: InsuranceCompany[]; onCancel: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        insurance_company_id: '',
        product_type_id: 'car',
        policy_number: '',
        premium_amount: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        vehicle_number: '',
        status: 'active' as const,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        savePolicy({
            customer_id: customerId,
            insurance_company_id: formData.insurance_company_id,
            product_type_id: formData.product_type_id,
            policy_number: formData.policy_number,
            policy_start_date: new Date(formData.start_date).toISOString(),
            policy_end_date: new Date(formData.end_date).toISOString(),
            premium_amount: Number(formData.premium_amount),
            status: formData.status,
            vehicle_number: formData.vehicle_number || undefined,
        });
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Insurance Company <span className="text-red-500">*</span></label>
                    <select
                        required
                        value={formData.insurance_company_id}
                        onChange={(e) => setFormData({ ...formData, insurance_company_id: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                    >
                        <option value="">Select Company</option>
                        {companies.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Product Type <span className="text-red-500">*</span></label>
                    <select
                        required
                        value={formData.product_type_id}
                        onChange={(e) => setFormData({ ...formData, product_type_id: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                    >
                        <option value="car">Car Insurance</option>
                        <option value="two-wheeler">Two-Wheeler</option>
                        <option value="health">Health Insurance</option>
                        <option value="life">Life Insurance</option>
                        <option value="commercial">Commercial Vehicle</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Policy Number <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        required
                        value={formData.policy_number}
                        onChange={(e) => setFormData({ ...formData, policy_number: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                        placeholder="e.g. POL-12345"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Premium Amount (₹) <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        required
                        value={formData.premium_amount}
                        onChange={(e) => setFormData({ ...formData, premium_amount: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        required
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">End Date <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        required
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-[#004aad] text-white text-sm font-bold rounded-lg hover:bg-[#003580] transition-colors"
                >
                    Create Policy
                </button>
            </div>
        </form>
    );
}
