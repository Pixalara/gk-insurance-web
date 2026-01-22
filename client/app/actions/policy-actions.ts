// app/actions/policy-actions.ts
import { supabase } from '../utils/supabaseClient';
import { Policy } from '@/app/types';

export async function getPolicies(): Promise<Policy[]> {
  const { data, error } = await supabase
    .from('policies')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getCustomerPolicies(customerId: string): Promise<Policy[]> {
  const { data, error } = await supabase
    .from('policies')
    .select('*')
    .eq('customer_id', customerId)
    .order('policy_end_date', { ascending: true });
  if (error) throw error;
  return data;
}

export async function savePolicy(policyData: Omit<Policy, 'id'>): Promise<Policy> {
  const { data, error } = await supabase
    .from('policies')
    .insert([policyData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePolicy(id: string, updates: Partial<Omit<Policy, 'id'>>): Promise<Policy> {
  const { data, error } = await supabase
    .from('policies')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePolicy(id: string): Promise<void> {
  const { error } = await supabase
    .from('policies')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
