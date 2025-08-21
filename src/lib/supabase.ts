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

// Database types - Updated to match the comprehensive CSV structure
export interface WorkOrder {
  id?: string
  
  // Core identification fields
  ao: string
  channel?: string
  date_created?: string // Flexible date format support
  workorder: string
  odp?: string
  service_no?: string
  description?: string
  
  // Location and customer information
  address?: string
  customer_name?: string
  workzone?: string
  status_date?: string // Flexible date format support
  contact_phone?: string
  booking_date?: string // Flexible date format support
  hsa?: string
  branch?: string
  cluster?: string
  
  // Technical details
  mitra?: string
  labor_teknisi?: string
  kategori?: string
  update_lapangan?: string
  symptom?: string
  engineering_memo?: string
  
  // TIKOR coordinates
  tikor_inputan_pelanggan?: string
  tikor_real_pelanggan?: string
  selisih?: number
  
  // Manja related fields
  umur_manja?: string
  kategori_manja?: string
  sheet_aktivasi?: string
  tanggal_ps?: string // Flexible date format support
  tinjut_hd_oplang?: string
  keterangan_hd_oplang?: string
  
  // Error and status codes
  suberrorcode?: string
  uic?: string
  update_uic?: string
  keterangan_uic?: string
  status_bima?: string
  status_dsc?: string
  
  // Additional fields
  sisa_manja?: number
  bulan_order?: string
  bulan_ps?: string
  backup?: string
  
  // GPS coordinates
  lat_inputan?: number
  long_inputan?: number
  lat_real?: number
  long_real?: number
  
  // User and system fields
  username?: string
  sending_status?: string
  timestamp?: string
  
  // Metadata
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
