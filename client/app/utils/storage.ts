'use client';

// --- Interfaces ---

export interface Lead {
    id: string;
    name: string;
    phone: string;
    email?: string;
    insurance_type: string; // Added to match QuoteForm logic
    vehicle_number?: string;
    message?: string;
    status: 'new' | 'contacted' | 'closed';
    source?: string;
    created_at: string;
    updated_at: string;
}

export interface InsuranceCompany {
    id: string;
    name: string;
    category: 'general' | 'health' | 'life';
    is_active: boolean;
    created_at: string; // Required field causing the build error
}

// --- Storage Keys ---
const LEADS_KEY = 'gk_insurance_leads';
const COMPANIES_KEY = 'gk_insurance_companies';

// --- Lead Management ---

export const getLeads = (): Lead[] => {
    if (typeof window === 'undefined') return [];
    const leads = localStorage.getItem(LEADS_KEY);
    return leads ? JSON.parse(leads) : [];
};

export const saveLead = (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Lead => {
    const leads = getLeads();
    const now = new Date().toISOString();
    
    const newLead: Lead = {
        ...leadData,
        id: Math.random().toString(36).substr(2, 9),
        created_at: now,
        updated_at: now,
    };

    localStorage.setItem(LEADS_KEY, JSON.stringify([newLead, ...leads]));
    return newLead;
};

export const updateLeadStatus = (id: string, status: Lead['status']): void => {
    const leads = getLeads();
    const updatedLeads = leads.map((lead) =>
        lead.id === id ? { ...lead, status, updated_at: new Date().toISOString() } : lead
    );
    localStorage.setItem(LEADS_KEY, JSON.stringify(updatedLeads));
};

// --- Company Management (Fixing Mock Data Build Error) ---

export const getCompanies = (): InsuranceCompany[] => {
    if (typeof window === 'undefined') return [];
    const companies = localStorage.getItem(COMPANIES_KEY);
    const existing = companies ? JSON.parse(companies) : [];

    // Initialize mock data if empty
    if (existing.length === 0) {
        const now = new Date().toISOString();
        const mockCompanies: Omit<InsuranceCompany, 'id'>[] = [
            // Added created_at to all mock items to satisfy TypeScript
            { name: 'Bajaj General Insurance', category: 'general', is_active: true, created_at: now },
            { name: 'Tata AIG', category: 'general', is_active: true, created_at: now },
            { name: 'ICICI Lombard', category: 'general', is_active: true, created_at: now },
            { name: 'Go Digit', category: 'general', is_active: true, created_at: now },
            { name: 'Star Health', category: 'health', is_active: true, created_at: now },
            { name: 'LIC', category: 'life', is_active: true, created_at: now },
        ];

        const initialized = mockCompanies.map((c) => ({
            ...c,
            id: Math.random().toString(36).substr(2, 9),
        }));

        localStorage.setItem(COMPANIES_KEY, JSON.stringify(initialized));
        return initialized;
    }

    return existing;
};