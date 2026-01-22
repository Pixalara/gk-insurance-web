'use client';

import { useState, useEffect } from 'react';
import { Customer, Policy } from '@/app/types';
import Link from 'next/link';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<(Customer & { policies_count: number; active_policies: number })[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        // TODO: Fetch from API
        const mockCustomers = [
            {
                id: '1',
                name: 'Rajesh Kumar',
                email: 'rajesh@example.com',
                phone: '9876543210',
                address: 'MVP Colony, Visakhapatnam',
                notes: 'Preferred customer',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                policies_count: 3,
                active_policies: 2,
            },
            {
                id: '2',
                name: 'Priya Sharma',
                email: 'priya@example.com',
                phone: '9876543211',
                address: 'Gajuwaka, Visakhapatnam',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                policies_count: 1,
                active_policies: 1,
            },
            {
                id: '3',
                name: 'Amit Patel',
                phone: '9876543212',
                address: 'Madhurawada, Visakhapatnam',
                notes: 'Renewal due next month',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                policies_count: 2,
                active_policies: 2,
            },
            {
                id: '4',
                name: 'Sneha Reddy',
                email: 'sneha@example.com',
                phone: '9876543213',
                address: 'Dwaraka Nagar, Visakhapatnam',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                policies_count: 4,
                active_policies: 3,
            },
        ];

        setTimeout(() => {
            setCustomers(mockCustomers);
            setLoading(false);
        }, 500);
    }, []);

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <button className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center gap-2">
                        <i className="fas fa-file-import"></i>
                        Bulk Import
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
                            <Link
                                href={`/admin/customers/${customer.id}`}
                                className="flex-1 py-2 bg-[#004aad] text-white text-sm font-semibold rounded-lg hover:bg-[#003580] transition-all text-center"
                            >
                                View Details
                            </Link>
                            <button className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-all">
                                <i className="fas fa-ellipsis-v"></i>
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
                <AddCustomerModal onClose={() => setShowAddModal(false)} />
            )}
        </div>
    );
}

function AddCustomerModal({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: API call to create customer
        console.log('Creating customer:', formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center p-4">
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
