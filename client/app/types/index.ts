// Type definitions for GK Insurance application

export interface InsuranceCompany {
  id: string;
  name: string;
  category: 'general' | 'health' | 'life';
  logo_url?: string;
  is_active: boolean;
}

export interface ProductType {
  id: string;
  name: string;
  category: 'vehicle' | 'health' | 'life' | 'commercial';
  description?: string;
  icon?: string;
  is_active: boolean;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  insurance_type: string;
  vehicle_number?: string;
  message?: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  source: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Policy {
  id: string;
  customer_id: string;
  insurance_company_id: string;
  product_type_id: string;
  policy_number?: string;
  policy_start_date: string;
  policy_end_date: string;
  premium_amount: number;
  status: 'active' | 'expired' | 'renewed' | 'cancelled';
  vehicle_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Populated fields
  customer?: Customer;
  insurance_company?: InsuranceCompany;
  product_type?: ProductType;
}

export interface DashboardStats {
  total_customers: number;
  active_policies: number;
  expiring_soon: number;
  total_premium: number;
  company_distribution: { name: string; count: number }[];
  product_distribution: { name: string; count: number }[];
  monthly_trends: { month: string; count: number; premium: number }[];
}

export interface QuoteFormData {
  name: string;
  phone: string;
  email?: string;
  insurance_type: string;
  vehicle_number?: string;
  message?: string;
}
