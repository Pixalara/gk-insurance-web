// app/actions/company-actions.ts
'use server';

import { supabase } from '../utils/supabaseClient';
import { InsuranceCompany } from '@/app/types';

export async function getCompanies(): Promise<InsuranceCompany[]> {
  const { data, error } = await supabase
    .from('insurance_companies')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching companies:', error);
    throw new Error('Failed to fetch insurance companies');
  }

  return data || [];
}

export async function createCompany(companyData: Omit<InsuranceCompany, 'id' | 'is_active' | 'created_at'>): Promise<InsuranceCompany> {
  const { data, error } = await supabase
    .from('insurance_companies')
    .insert([{ ...companyData, is_active: true }])
    .select()
    .single();

  if (error) {
    console.error('Error creating company:', error);
    throw new Error('Failed to create company');
  }

  return data;
}

export async function updateCompany(id: string, companyData: Partial<InsuranceCompany>): Promise<InsuranceCompany> {
  const { data, error } = await supabase
    .from('insurance_companies')
    .update(companyData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating company:', error);
    throw new Error('Failed to update company');
  }

  return data;
}

export async function deleteCompany(id: string): Promise<void> {
  // Soft delete by setting is_active to false, or hard delete if no dependencies?
  // Schema has RESTRICT on delete policy, so we might want to soft delete or handle error.
  // For now let's try hard delete and let DB enforce constraints.
  
  const { error } = await supabase
    .from('insurance_companies')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting company:', error);
     // likely a foreign key violation
    if (error.code === '23503') throw new Error('Cannot delete company because it has associated policies.');
    throw new Error('Failed to delete company');
  }
}
