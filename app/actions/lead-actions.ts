// app/actions/lead-actions.ts
'use server';

import { supabase } from '../utils/supabaseClient';
import { Lead } from '@/app/types';

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    throw new Error('Failed to fetch leads');
  }

  return data || [];
}

export async function createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .insert([leadData])
    .select()
    .single();

  if (error) {
    console.error('Error creating lead:', error);
    throw new Error('Failed to create lead');
  }

  return data;
}

export async function updateLead(id: string, leadData: Partial<Lead>): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .update(leadData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating lead:', error);
    throw new Error('Failed to update lead');
  }

  return data;
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting lead:', error);
    throw new Error('Failed to delete lead');
  }
}
