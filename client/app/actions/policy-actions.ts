// app/actions/policy-actions.ts
'use server';

import { supabase } from '../utils/supabaseClient';
import { Policy } from '@/app/types';

// Type for creating a policy (matches the structure needed for insertion)
export type AddPolicyParams = {
  policy_number: string;
  insurance_company_id: string;
  product_type: string;
  premium_amount: number;
  policy_start_date: string;
  policy_end_date: string;
  status: 'active' | 'expired' | 'renewed' | 'pending';
  vehicle_number?: string;
  notes?: string;
};

/**
 * Fetch all policies (for master list or calculations)
 */
export async function getPolicies(): Promise<Policy[]> {
  const { data, error } = await supabase
    .from('policies')
    .select(`
      *,
      insurance_company:insurance_companies(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching policies:', error);
    throw new Error('Failed to fetch policies');
  }

  return data || [];
}

/**
 * Fetch policies for a specific customer
 */
export async function getPoliciesByCustomer(customerId: string): Promise<Policy[]> {
  const { data, error } = await supabase
    .from('policies')
    .select(`
      *,
      insurance_company:insurance_companies(*)
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching policies for customer ${customerId}:`, error);
    throw new Error('Failed to fetch policies');
  }

  return data || [];
}

/**
 * Add a new policy
 */
export async function createPolicy(policyData: AddPolicyParams, customerId: string): Promise<Policy> {
  // 1. Check for duplicate policy number
  const { data: existingPolicy } = await supabase
    .from('policies')
    .select('id')
    .eq('policy_number', policyData.policy_number)
    .single();

  if (existingPolicy) {
    throw new Error('A policy with this number already exists.');
  }

  // 2. Insert the Policy
  const { data: newPolicy, error: insertError } = await supabase
    .from('policies')
    .insert({
      customer_id: customerId,
      ...policyData
    })
    .select(`
      *,
      insurance_company:insurance_companies(*)
    `)
    .single();

  if (insertError) {
    console.error('Error inserting policy:', insertError);
    // Handle specific Supabase duplicate key error if race condition missed above
    if (insertError.code === '23505') throw new Error('A policy with this number already exists.');
    throw new Error('Failed to create policy record');
  }

  return newPolicy;
}

/**
 * Update a policy
 */
export async function updatePolicy(id: string, policyData: Partial<Policy>): Promise<Policy> {
  const { data, error } = await supabase
    .from('policies')
    .update(policyData)
    .eq('id', id)
    .select(`
      *,
      insurance_company:insurance_companies(*)
    `)
    .single();

  if (error) {
    console.error('Error updating policy:', error);
    throw new Error('Failed to update policy');
  }

  return data;
}

/**
 * Delete a policy
 */
export async function deletePolicy(id: string): Promise<void> {
  const { error } = await supabase
    .from('policies')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting policy:', error);
    throw new Error('Failed to delete policy');
  }
}
