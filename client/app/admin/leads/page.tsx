'use client';

import { useState, useEffect } from 'react';
import { Lead } from '@/app/types';
import { getLeads, updateLead, deleteLead } from '@/app/utils/storage';

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const loadLeads = () => {
        const storedLeads = getLeads();
        setLeads(storedLeads);
        setLoading(false);
    };

    useEffect(() => {
        // Load leads from localStorage
        setTimeout(() => {
            loadLeads();
        }, 300);
    }, []);

    const filteredLeads = leads.filter((lead) => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.phone.includes(searchTerm) ||
            lead.insurance_type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const badges = {
            new: 'bg-yellow-100 text-yellow-700',
            contacted: 'bg-blue-100 text-blue-700',
            converted: 'bg-green-100 text-green-700',
            lost: 'bg-red-100 text-red-700',
        };
        return badges[status as keyof typeof badges] || badges.new;
    };

    const handleStatusChange = (leadId: string, newStatus: string) => {
        const success = updateLead(leadId, { status: newStatus as Lead['status'] });
        if (success) {
            loadLeads();
        }
    };

    const handleDelete = (leadId: string) => {
        if (confirm('Are you sure you want to delete this lead?')) {
            const success = deleteLead(leadId);
            if (success) {
                loadLeads();
            }
        }
    };

    const handleEdit = (lead: Lead) => {
        setEditingLead({ ...lead });
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        if (!editingLead) return;

        const success = updateLead(editingLead.id, {
            name: editingLead.name,
            phone: editingLead.phone,
            email: editingLead.email,
            insurance_type: editingLead.insurance_type,
            vehicle_number: editingLead.vehicle_number,
            message: editingLead.message,
            status: editingLead.status,
        });

        if (success) {
            loadLeads();
            setShowEditModal(false);
            setEditingLead(null);
        }
    };

    const handleCancelEdit = () => {
        setShowEditModal(false);
        setEditingLead(null);
    };

    const getTimeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
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
                <h1 className="text-3xl font-black text-slate-900 mb-2">Leads Management</h1>
                <p className="text-slate-600">Manage and track all website inquiries</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">Total Leads</p>
                            <p className="text-2xl font-black text-slate-900">{leads.length}</p>
                        </div>
                        <i className="fas fa-envelope-open-text text-2xl text-blue-500"></i>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">New</p>
                            <p className="text-2xl font-black text-yellow-600">
                                {leads.filter(l => l.status === 'new').length}
                            </p>
                        </div>
                        <i className="fas fa-star text-2xl text-yellow-500"></i>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">Contacted</p>
                            <p className="text-2xl font-black text-blue-600">
                                {leads.filter(l => l.status === 'contacted').length}
                            </p>
                        </div>
                        <i className="fas fa-phone text-2xl text-blue-500"></i>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">Converted</p>
                            <p className="text-2xl font-black text-green-600">
                                {leads.filter(l => l.status === 'converted').length}
                            </p>
                        </div>
                        <i className="fas fa-check-circle text-2xl text-green-500"></i>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input
                                type="text"
                                placeholder="Search by name, phone, or insurance type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                            />
                        </div>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent min-w-[200px]"
                    >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                    </select>
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Insurance Type
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Vehicle #
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Time
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-slate-900">{lead.name}</p>
                                            <p className="text-sm text-slate-500">{lead.phone}</p>
                                            {lead.email && <p className="text-xs text-slate-400">{lead.email}</p>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-700">{lead.insurance_type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">{lead.vehicle_number || '-'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={lead.status}
                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(lead.status)} border-0 cursor-pointer`}
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="converted">Converted</option>
                                            <option value="lost">Lost</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-500">{getTimeAgo(lead.created_at)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <a
                                                href={`tel:${lead.phone}`}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Call"
                                            >
                                                <i className="fas fa-phone"></i>
                                            </a>
                                            <a
                                                href={`https://wa.me/91${lead.phone}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="WhatsApp"
                                            >
                                                <i className="fab fa-whatsapp"></i>
                                            </a>
                                            {lead.email && (
                                                <a
                                                    href={`mailto:${lead.email}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Email"
                                                >
                                                    <i className="fas fa-envelope"></i>
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleEdit(lead)}
                                                className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(lead.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredLeads.length === 0 && (
                    <div className="text-center py-12">
                        <i className="fas fa-inbox text-4xl text-slate-300 mb-3"></i>
                        <p className="text-slate-500">No leads found</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && editingLead && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-2xl font-black text-slate-900">Edit Lead</h2>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editingLead.name}
                                    onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={editingLead.phone}
                                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={editingLead.email || ''}
                                    onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                                />
                            </div>

                            {/* Insurance Type */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Insurance Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={editingLead.insurance_type}
                                    onChange={(e) => setEditingLead({ ...editingLead, insurance_type: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                                >
                                    <option value="Two-Wheeler Insurance">Two-Wheeler Insurance</option>
                                    <option value="Car Insurance">Car Insurance</option>
                                    <option value="Commercial Vehicle Insurance">Commercial Vehicle Insurance</option>
                                    <option value="Travel Insurance">Travel Insurance</option>
                                    <option value="Shopkeeper Insurance">Shopkeeper Insurance</option>
                                    <option value="Commercial Business Insurance">Commercial Business Insurance</option>
                                    <option value="Health Insurance">Health Insurance</option>
                                    <option value="Life Insurance">Life Insurance</option>
                                </select>
                            </div>

                            {/* Vehicle Number */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Vehicle Number
                                </label>
                                <input
                                    type="text"
                                    value={editingLead.vehicle_number || ''}
                                    onChange={(e) => setEditingLead({ ...editingLead, vehicle_number: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                                    placeholder="e.g., AP 01 AB 1234"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    value={editingLead.message || ''}
                                    onChange={(e) => setEditingLead({ ...editingLead, message: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent resize-none"
                                    placeholder="Any notes or requirements..."
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={editingLead.status}
                                    onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value as Lead['status'] })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                                >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="converted">Converted</option>
                                    <option value="lost">Lost</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
                            <button
                                onClick={handleCancelEdit}
                                className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-6 py-3 bg-[#004aad] text-white font-semibold rounded-lg hover:bg-[#003580] transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
