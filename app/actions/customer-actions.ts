// app/actions/customer-actions.ts
'use server';

import { supabase } from '../utils/supabaseClient';
import { Customer } from '@/app/types';

export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
    throw new Error('Failed to fetch customers');
  }

  return data || [];
}

export async function createCustomer(customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .insert([customerData])
    .select()
    .single();

  if (error) {
    console.error('Error creating customer:', error);
    if (error.code === '23505') throw new Error('Customer with this phone number already exists.');
    throw new Error('Failed to create customer');
  }

  return data;
}

export async function updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .update(customerData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating customer:', error);
    throw new Error('Failed to update customer');
  }

  return data;
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting customer:', error);
    throw new Error('Failed to delete customer');
  }
}

