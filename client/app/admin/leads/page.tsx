'use client';

import { useState, useEffect } from 'react';
import { Lead } from '@/app/types';

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        // TODO: Fetch from API
        const mockLeads: Lead[] = [
            {
                id: '1',
                name: 'Rajesh Kumar',
                phone: '9876543210',
                email: 'rajesh@example.com',
                insurance_type: 'Car Insurance',
                vehicle_number: 'AP 01 AB 1234',
                message: 'Need comprehensive coverage',
                status: 'new',
                source: 'website',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: '2',
                name: 'Priya Sharma',
                phone: '9876543211',
                email: 'priya@example.com',
                insurance_type: 'Health Insurance',
                message: 'Looking for family floater plan',
                status: 'contacted',
                source: 'website',
                created_at: new Date(Date.now() - 86400000).toISOString(),
                updated_at: new Date(Date.now() - 86400000).toISOString(),
            },
            {
                id: '3',
                name: 'Amit Patel',
                phone: '9876543212',
                insurance_type: 'Two-Wheeler Insurance',
                vehicle_number: 'AP 05 XY 5678',
                status: 'converted',
                source: 'website',
                created_at: new Date(Date.now() - 172800000).toISOString(),
                updated_at: new Date(Date.now() - 172800000).toISOString(),
            },
            {
                id: '4',
                name: 'Sneha Reddy',
                phone: '9876543213',
                email: 'sneha@example.com',
                insurance_type: 'Life Insurance',
                message: 'Term insurance for 1 crore',
                status: 'new',
                source: 'website',
                created_at: new Date(Date.now() - 3600000).toISOString(),
                updated_at: new Date(Date.now() - 3600000).toISOString(),
            },
        ];

        setTimeout(() => {
            setLeads(mockLeads);
            setLoading(false);
        }, 500);
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
        setLeads(leads.map(lead =>
            lead.id === leadId ? { ...lead, status: newStatus as Lead['status'] } : lead
        ));
    };

    const handleDelete = (leadId: string) => {
        if (confirm('Are you sure you want to delete this lead?')) {
            setLeads(leads.filter(lead => lead.id !== leadId));
        }
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
        </div>
    );
}
