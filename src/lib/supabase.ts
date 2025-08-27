import { createClient } from '@supabase/supabase-js'

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

// Create a singleton instance
export const supabase = createSupabaseClient()

// Database table names
export const TABLES = {
  FORMAT_ORDER: 'format_order',
  WORK_ORDERS: 'work_orders',
  UPLOADS: 'uploads',
  DASHBOARD_METRICS: 'dashboard_metrics'
} as const

// Database types - Updated to match the format_order table schema
export interface FormatOrder {
  order_id: string // Primary key
  channel?: string
  date_created?: string
  workorder?: string
  sc_order_no?: string
  service_no?: string
  description?: string
  address?: string
  customer_name?: string
  workzone?: string
  status_date?: string
  contact_phone?: string
  booking_date?: string
  service_area?: string
  branch?: string
  cluster?: string
  odp?: string
  mitra?: string
  labor_teknisi?: string
  update_lapangan?: string
  symptom?: string
  engineering_memo?: string
  tikor_inputan_pelanggan?: string
  tikor_real_pelanggan?: string
  sheet_aktivasi?: string
  tanggal_ps?: string
  tinjut_hd_oplang?: string
  keterangan_hd_oplang?: string
  suberrorcode?: string
  uic?: string
  update_uic?: string
  keterangan_uic?: string
  status_bima?: string
  status_dsc?: string
  symptom_timestamp?: string
  created_at?: string
  updated_at?: string
}

// Legacy interface for backward compatibility
export interface WorkOrder extends FormatOrder {
  id?: string
  ao?: string // Maps to order_id
}

export interface Upload {
  id?: string
  filename: string
  total_rows: number
  total_columns: number
  upload_date: string
  status: 'processing' | 'completed' | 'failed'
  error_message?: string
  created_at?: string
  updated_at?: string
}

export interface DashboardMetrics {
  id?: string
  total_work_orders: number
  avg_provisioning_time?: string
  success_rate?: number
  failure_rate?: number
  in_progress_rate?: number
  monthly_data?: Array<{ date: string; value: number }>
  bima_status_data?: Array<{ name: string; value: number; color: string }>
  field_update_data?: Array<{ name: string; value: number }>
  calculated_at: string
  created_at?: string
}

export interface WorkOrderStats {
  total_work_orders: number
  status_distribution: { [key: string]: number }
  branch_distribution: { [key: string]: number }
  channel_distribution: { [key: string]: number }
  manja_stats: {
    lewat_manja_count: number
    overdue_manja_count: number
  }
}
