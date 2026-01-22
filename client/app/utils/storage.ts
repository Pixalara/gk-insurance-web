// localStorage utilities for managing leads, customers, and companies data
// This will be replaced with Supabase API calls later

import { Lead, Customer, InsuranceCompany, Policy } from '@/app/types';

const LEADS_STORAGE_KEY = 'gk_leads';
const CUSTOMERS_STORAGE_KEY = 'gk_customers';
const COMPANIES_STORAGE_KEY = 'gk_companies';

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = 'item'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ==================== LEADS ====================

/**
 * Get all leads from localStorage
 */

export function getLeads(): Lead[] {
    if (typeof window === 'undefined') return [];
    
    try {
        const data = localStorage.getItem(LEADS_STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading leads from localStorage:', error);
        return [];
    }
}

/**
 * Save a new lead to localStorage
 */
export function saveLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Lead {
    const leads = getLeads();
    
    const newLead: Lead = {
        ...leadData,
        id: generateId('lead'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    
    leads.push(newLead);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    
    return newLead;
}

/**
 * Update an existing lead
 */
export function updateLead(id: string, updates: Partial<Omit<Lead, 'id' | 'created_at'>>): boolean {
    const leads = getLeads();
    const index = leads.findIndex(lead => lead.id === id);
    
    if (index === -1) {
        console.error(`Lead with id ${id} not found`);
        return false;
    }
    
    leads[index] = {
        ...leads[index],
        ...updates,
        updated_at: new Date().toISOString(),
    };
    
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    return true;
}

/**
 * Delete a lead from localStorage
 */
export function deleteLead(id: string): boolean {
    const leads = getLeads();
    const filteredLeads = leads.filter(lead => lead.id !== id);
    
    if (filteredLeads.length === leads.length) {
        console.error(`Lead with id ${id} not found`);
        return false;
    }
    
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(filteredLeads));
    return true;
}

/**
 * Clear all leads (useful for testing)
 */
export function clearAllLeads(): void {
    localStorage.removeItem(LEADS_STORAGE_KEY);
}

// ==================== CUSTOMERS ====================

/**
 * Get all customers from localStorage
 */
export function getCustomers(): Customer[] {
    if (typeof window === 'undefined') return [];
    
    try {
        const data = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading customers from localStorage:', error);
        return [];
    }
}

/**
 * Save a new customer to localStorage
 */
export function saveCustomer(customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Customer {
    const customers = getCustomers();
    
    const newCustomer: Customer = {
        ...customerData,
        id: generateId('customer'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    
    customers.push(newCustomer);
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
    
    return newCustomer;
}

/**
 * Update an existing customer
 */
export function updateCustomer(id: string, updates: Partial<Omit<Customer, 'id' | 'created_at'>>): boolean {
    const customers = getCustomers();
    const index = customers.findIndex(customer => customer.id === id);
    
    if (index === -1) {
        console.error(`Customer with id ${id} not found`);
        return false;
    }
    
    customers[index] = {
        ...customers[index],
        ...updates,
        updated_at: new Date().toISOString(),
    };
    
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
    return true;
}

/**
 * Delete a customer from localStorage
 */
export function deleteCustomer(id: string): boolean {
    const customers = getCustomers();
    const filteredCustomers = customers.filter(customer => customer.id !== id);
    
    if (filteredCustomers.length === customers.length) {
        console.error(`Customer with id ${id} not found`);
        return false;
    }
    
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(filteredCustomers));
    return true;
}

/**
 * Initialize customers with mock data if none exist
 */
export function initializeCustomers(): void {
    const existing = getCustomers();
    if (existing.length === 0) {
        const mockCustomers: Omit<Customer, 'id' | 'created_at' | 'updated_at'>[] = [
            {
                name: 'Rajesh Kumar',
                email: 'rajesh@example.com',
                phone: '9876543210',
                address: 'MVP Colony, Visakhapatnam',
                notes: 'Preferred customer',
            },
            {
                name: 'Priya Sharma',
                email: 'priya@example.com',
                phone: '9876543211',
                address: 'Gajuwaka, Visakhapatnam',
            },
            {
                name: 'Amit Patel',
                phone: '9876543212',
                address: 'Madhurawada, Visakhapatnam',
                notes: 'Renewal due next month',
            },
            {
                name: 'Sneha Reddy',
                email: 'sneha@example.com',
                phone: '9876543213',
                address: 'Dwaraka Nagar, Visakhapatnam',
            },
        ];
        
        mockCustomers.forEach(customer => saveCustomer(customer));
    }
}

// ==================== COMPANIES ====================

/**
 * Get all companies from localStorage
 */
export function getCompanies(): InsuranceCompany[] {
    if (typeof window === 'undefined') return [];
    
    try {
        const data = localStorage.getItem(COMPANIES_STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading companies from localStorage:', error);
        return [];
    }
}

/**
 * Save a new company to localStorage
 */
export function saveCompany(companyData: Omit<InsuranceCompany, 'id'>): InsuranceCompany {
    const companies = getCompanies();
    
    const newCompany: InsuranceCompany = {
        ...companyData,
        id: generateId('company'),
    };
    
    companies.push(newCompany);
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies));
    
    return newCompany;
}

/**
 * Update an existing company
 */
export function updateCompany(id: string, updates: Partial<Omit<InsuranceCompany, 'id'>>): boolean {
    const companies = getCompanies();
    const index = companies.findIndex(company => company.id === id);
    
    if (index === -1) {
        console.error(`Company with id ${id} not found`);
        return false;
    }
    
    companies[index] = {
        ...companies[index],
        ...updates,
    };
    
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies));
    return true;
}

/**
 * Delete a company from localStorage
 */
export function deleteCompany(id: string): boolean {
    const companies = getCompanies();
    const filteredCompanies = companies.filter(company => company.id !== id);
    
    if (filteredCompanies.length === companies.length) {
        console.error(`Company with id ${id} not found`);
        return false;
    }
    
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(filteredCompanies));
    return true;
}

/**
 * Initialize companies with mock data if none exist
 */
export function initializeCompanies(): void {
    const existing = getCompanies();
    if (existing.length === 0) {
        const mockCompanies: Omit<InsuranceCompany, 'id'>[] = [
            { name: 'Bajaj General Insurance', category: 'general', is_active: true },
            { name: 'Tata AIG', category: 'general', is_active: true },
            { name: 'ICICI Lombard', category: 'general', is_active: true },
            { name: 'Go Digit', category: 'general', is_active: true },
            { name: 'Liberty General Insurance', category: 'general', is_active: true },
            { name: 'Star Health', category: 'health', is_active: true },
            { name: 'Bajaj Health Insurance', category: 'health', is_active: true },
            { name: 'LIC', category: 'life', is_active: true },
            { name: 'Bajaj Life', category: 'life', is_active: true },
        ];
        
        mockCompanies.forEach(company => saveCompany(company));
    }
}


// ==================== POLICIES ====================

const POLICIES_STORAGE_KEY = 'gk_policies';

/**
 * Get all policies from localStorage
 */
export function getPolicies(): Policy[] {
    if (typeof window === 'undefined') return [];
    
    try {
        const data = localStorage.getItem(POLICIES_STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading policies from localStorage:', error);
        return [];
    }
}

/**
 * Get policies for a specific customer
 */
export function getCustomerPolicies(customerId: string): Policy[] {
    const policies = getPolicies();
    return policies.filter(policy => policy.customer_id === customerId);
}

/**
 * Save a new policy to localStorage
 */
export function savePolicy(policyData: Omit<Policy, 'id' | 'created_at' | 'updated_at'>): Policy {
    const policies = getPolicies();
    
    const newPolicy: Policy = {
        ...policyData,
        id: generateId('policy'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    
    policies.push(newPolicy);
    localStorage.setItem(POLICIES_STORAGE_KEY, JSON.stringify(policies));
    
    return newPolicy;
}

/**
 * Update an existing policy
 */
export function updatePolicy(id: string, updates: Partial<Omit<Policy, 'id' | 'created_at'>>): boolean {
    const policies = getPolicies();
    const index = policies.findIndex(policy => policy.id === id);
    
    if (index === -1) {
        console.error(`Policy with id ${id} not found`);
        return false;
    }
    
    policies[index] = {
        ...policies[index],
        ...updates,
        updated_at: new Date().toISOString(),
    };
    
    localStorage.setItem(POLICIES_STORAGE_KEY, JSON.stringify(policies));
    return true;
}

/**
 * Delete a policy from localStorage
 */
export function deletePolicy(id: string): boolean {
    const policies = getPolicies();
    const filteredPolicies = policies.filter(policy => policy.id !== id);
    
    if (filteredPolicies.length === policies.length) {
        console.error(`Policy with id ${id} not found`);
        return false;
    }
    
    localStorage.setItem(POLICIES_STORAGE_KEY, JSON.stringify(filteredPolicies));
    return true;
}

/**
 * Initialize policies with mock data if none exist
 */
export function initializePolicies(): void {
    const existing = getPolicies();
    if (existing.length > 0) return;

    // Ensure we have customers and companies first
    initializeCustomers();
    initializeCompanies();
    
    const customers = getCustomers();
    const companies = getCompanies();
    
    if (customers.length === 0 || companies.length === 0) return;

    const today = new Date();
    
    // Safely get IDs using modulo to prevent out of bounds
    const getCustId = (idx: number) => customers[idx % customers.length].id;
    const getCompId = (idx: number) => companies[idx % companies.length].id;
    
    const mockPolicies: Omit<Policy, 'id' | 'created_at' | 'updated_at'>[] = [
        {
            customer_id: getCustId(0),
            insurance_company_id: getCompId(0), // Bajaj General
            product_type_id: 'car',
            policy_number: 'POL-2024-001',
            policy_start_date: new Date(2024, 0, 15).toISOString(),
            policy_end_date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Expiring in 5 days
            premium_amount: 25000,
            status: 'active',
            vehicle_number: 'AP 31 AZ 1234',
            notes: 'Comprehensive plan'
        },
        {
            customer_id: getCustId(1),
            insurance_company_id: getCompId(5), // Star Health
            product_type_id: 'health',
            policy_number: 'POL-2024-002',
            policy_start_date: new Date(2024, 1, 10).toISOString(),
            policy_end_date: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(), // Expiring in 15 days
            premium_amount: 18000,
            status: 'active',
            notes: 'Family Floater'
        },
        {
            customer_id: getCustId(2),
            insurance_company_id: getCompId(0),
            product_type_id: 'two-wheeler',
            policy_number: 'POL-2024-003',
            policy_start_date: new Date(2024, 2, 5).toISOString(),
            policy_end_date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Expired 3 days ago
            premium_amount: 3500,
            status: 'expired',
            vehicle_number: 'AP 31 BC 5678'
        },
        {
            customer_id: getCustId(3),
            insurance_company_id: getCompId(7), // LIC
            product_type_id: 'life',
            policy_number: 'POL-2024-004',
            policy_start_date: new Date(2023, 5, 20).toISOString(),
            policy_end_date: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(), // Expiring in 45 days
            premium_amount: 50000,
            status: 'active',
            notes: 'Term Plan'
        }
    ];
        
    mockPolicies.forEach(policy => savePolicy(policy));
}

