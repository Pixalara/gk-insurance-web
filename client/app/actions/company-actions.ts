// app/actions/company-actions.ts
import { supabase } from '../utils/supabaseClient';
import { InsuranceCompany } from '@/app/types';

export async function getCompanies(): Promise<InsuranceCompany[]> {
  const { data, error } = await supabase
    .from('insurance_companies')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
}

export async function saveCompany(companyData: Omit<InsuranceCompany, 'id'>): Promise<InsuranceCompany> {
  const { data, error } = await supabase
    .from('insurance_companies')
    .insert([companyData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCompany(id: string, updates: Partial<Omit<InsuranceCompany, 'id'>>): Promise<InsuranceCompany> {
  const { data, error } = await supabase
    .from('insurance_companies')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCompany(id: string): Promise<void> {
  const { error } = await supabase
    .from('insurance_companies')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
