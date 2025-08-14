import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy function to create Supabase client
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
      url: supabaseUrl ? 'Set' : 'Missing',
      key: supabaseAnonKey ? 'Set' : 'Missing'
    })
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
}

// Create a singleton instance for server-side usage
let supabaseInstance: SupabaseClient | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient()
  }
  return supabaseInstance
}

// Database table names
export const TABLES = {
  WORK_ORDERS: 'work_orders',
  UPLOADS: 'uploads',
  DASHBOARD_METRICS: 'dashboard_metrics'
} as const

// Database types
export interface WorkOrder {
  id?: string
  ao: string
  channel: string
  date_created: string
  workorder: string
  hsa: string
  branch: string
  update_lapangan: string
  symptom: string
  tinjut_hd_oplang: string
  kategori_manja: string
  status_bima: string
  created_at?: string
  updated_at?: string
}

export interface Upload {
  id?: string
  filename: string
  total_rows: number
  total_columns: number
  upload_date: string
  status: 'processing' | 'completed' | 'failed'
  created_at?: string
}

export interface DashboardMetrics {
  id?: string
  total_work_orders: number
  avg_provisioning_time: string
  success_rate: number
  failure_rate: number
  in_progress_rate: number
  monthly_data: Array<{ date: string; value: number }>
  bima_status_data: Array<{ name: string; value: number; color: string }>
  field_update_data: Array<{ name: string; value: number }>
  calculated_at: string
  created_at?: string
}

export interface WorkOrderStats {
  total_work_orders: number
  status_distribution: { [key: string]: number }
  branch_distribution: { [key: string]: number }
}
