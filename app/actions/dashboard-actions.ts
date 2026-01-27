// app/actions/dashboard-actions.ts
'use server';

import { supabase } from '../utils/supabaseClient';
import { DashboardStats, Policy } from '@/app/types';

export async function getDashboardStats() {
  const today = new Date();
  const next30Days = new Date();
  next30Days.setDate(today.getDate() + 30);

  // 1. Fetch Customers Count
  const { count: customerCount } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true });

  // 2. Fetch Policies (with customer join)
  const { data: policies, error: policiesError } = await supabase
    .from('policies')
    .select(`
      id,
      premium_amount,
      status,
      product_type,
      policy_end_date,
      policy_start_date,
      insurance_company_id,
      customer:customers(
        id,
        name,
        email,
        phone
      )
    `)
    .returns<Policy[]>();

  if (policiesError || !policies) {
    throw new Error('Failed to fetch policies');
  }

  // Active policies
  const activePolicies = policies.filter(p => p.status === 'active');

  const totalPremium = activePolicies.reduce(
    (sum, p) => sum + (Number(p.premium_amount) || 0),
    0
  );

  // Expiring Soon (next 30 days)
  const expiringSoon = activePolicies.filter(p => {
    if (!p.policy_end_date) return false;
    const end = new Date(p.policy_end_date);
    return end >= today && end <= next30Days;
  });

  // 3. Product Distribution
  const productStats: Record<string, number> = {};
  activePolicies.forEach(p => {
    const type = p.product_type || 'Other';
    productStats[type] = (productStats[type] || 0) + 1;
  });

  const productDistribution = Object.entries(productStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // 4. Company Distribution
  const { data: companies } = await supabase
    .from('insurance_companies')
    .select('id, name');

  const companyMap = new Map(
    companies?.map(c => [c.id, c.name]) || []
  );

  const companyStats: Record<string, number> = {};
  activePolicies.forEach(p => {
    const name =
      companyMap.get(p.insurance_company_id) || 'Unknown';
    companyStats[name] = (companyStats[name] || 0) + 1;
  });

  const companyDistribution = Object.entries(companyStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // 5. Monthly Trends (Current Year)
  const currentYear = today.getFullYear();
  const monthlyStats: Record<number, { count: number; premium: number }> = {};

  policies.forEach(p => {
    if (!p.policy_start_date) return;

    const date = new Date(p.policy_start_date);
    if (date.getFullYear() !== currentYear) return;

    const month = date.getMonth();
    if (!monthlyStats[month]) {
      monthlyStats[month] = { count: 0, premium: 0 };
    }

    monthlyStats[month].count++;
    monthlyStats[month].premium += Number(p.premium_amount) || 0;
  });

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const monthlyTrends = Object.entries(monthlyStats)
    .map(([monthIdx, data]) => ({
      month: months[Number(monthIdx)],
      count: data.count,
      premium: data.premium
    }))
    .sort(
      (a, b) => months.indexOf(a.month) - months.indexOf(b.month)
    );

  // 6. Recent Leads
  const { data: recentLeads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // 7. Upcoming Renewals
  const upcomingRenewals = expiringSoon
    .map(p => {
      const end = new Date(p.policy_end_date!);
      const diffTime = end.getTime() - today.getTime();
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        id: p.id,
        customer_name: p.customer?.name ?? 'Unknown',
        product_type: p.product_type,
        days_remaining: days
      };
    })
    .sort((a, b) => a.days_remaining - b.days_remaining)
    .slice(0, 5);

  const stats: DashboardStats = {
    total_customers: customerCount || 0,
    active_policies: activePolicies.length,
    total_premium: totalPremium,
    expiring_soon: expiringSoon.length,
    recent_leads_count: recentLeads?.length || 0,
    product_distribution: productDistribution,
    company_distribution: companyDistribution,
    monthly_trends: monthlyTrends
  };

  return {
    stats,
    recentLeads: recentLeads || [],
    upcomingRenewals
  };
}
