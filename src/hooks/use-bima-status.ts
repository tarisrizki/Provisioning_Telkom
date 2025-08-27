import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface BimaStatusData {
  name: string
  value: number
  color: string
}

export function useBimaStatus() {
  const [data, setData] = useState<BimaStatusData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBimaStatus()
  }, [])

  const fetchBimaStatus = async () => {
    try {
      setLoading(true)
      setError(null)

      // Opsi 1: Menggunakan RPC function untuk aggregation (lebih efisien)
      // Jika Anda ingin menggunakan ini, buat function di Supabase:
      /*
      CREATE OR REPLACE FUNCTION get_status_bima_distribution()
      RETURNS TABLE(status_bima text, count bigint) AS $$
      BEGIN
        RETURN QUERY
        SELECT fo.status_bima, COUNT(*) as count
        FROM format_order fo
        WHERE fo.status_bima IS NOT NULL AND fo.status_bima != ''
        GROUP BY fo.status_bima;
      END;
      $$ LANGUAGE plpgsql;
      */

      // Untuk sementara, kita gunakan cara manual dengan limit tinggi
      let allStatusData: Array<{status_bima: string}> = []
      let page = 0
      const pageSize = 1000
      let hasMore = true

      // Pagination untuk mengambil semua data
      while (hasMore) {
        const { data: statusData, error } = await supabase
          .from('format_order')
          .select('status_bima')
          .not('status_bima', 'is', null)
          .not('status_bima', 'eq', '')
          .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) {
          throw error
        }

        if (statusData && statusData.length > 0) {
          allStatusData = [...allStatusData, ...statusData]
          hasMore = statusData.length === pageSize
          page++
        } else {
          hasMore = false
        }
      }

      console.log(`Loaded ${allStatusData.length} status records from Supabase`)

      // Hitung distribusi status
      const statusCounts = new Map<string, number>()
      
      allStatusData.forEach(item => {
        const status = item.status_bima?.trim().toUpperCase() || 'UNKNOWN'
        statusCounts.set(status, (statusCounts.get(status) || 0) + 1)
      })

      // Konversi ke format yang dibutuhkan chart dengan warna yang sesuai
      const chartData: BimaStatusData[] = []
      
      statusCounts.forEach((count, status) => {
        let color = '#6b7280' // default gray
        let displayName = status
        
        // Mapping status ke warna dan nama display dengan warna unik untuk setiap status
        switch (status) {
          case 'COMPLETE':
            color = '#22c55e' // green
            displayName = 'Complete'
            break
          case 'WORKFAIL':
          case 'WORK FAIL':
            color = '#ef4444' // red
            displayName = 'Work Fail'
            break
          case 'CANCLWORK':
          case 'CANCEL WORK':
            color = '#f59e0b' // amber
            displayName = 'Cancel Work'
            break
          case 'PROGRESS':
          case 'IN PROGRESS':
            color = '#3b82f6' // blue
            displayName = 'In Progress'
            break
          case 'PENDING':
            color = '#8b5cf6' // violet
            displayName = 'Pending'
            break
          case 'ASSIGNED':
            color = '#06b6d4' // cyan
            displayName = 'Assigned'
            break
          case 'CLOSED':
            color = '#10b981' // emerald
            displayName = 'Closed'
            break
          case 'OPEN':
            color = '#f97316' // orange
            displayName = 'Open'
            break
          case 'RESOLVED':
            color = '#84cc16' // lime
            displayName = 'Resolved'
            break
          case 'REJECTED':
            color = '#dc2626' // red-600
            displayName = 'Rejected'
            break
          case 'ON HOLD':
          case 'ONHOLD':
            color = '#6366f1' // indigo
            displayName = 'On Hold'
            break
          default:
            // Generate unique color for unknown statuses based on hash
            const hash = status.split('').reduce((a, b) => {
              a = ((a << 5) - a) + b.charCodeAt(0)
              return a & a
            }, 0)
            const colors = [
              '#f472b6', // pink
              '#a78bfa', // purple
              '#fb7185', // rose
              '#fbbf24', // yellow
              '#34d399', // green-400
              '#60a5fa', // blue-400
              '#f87171', // red-400
              '#a3a3a3', // gray-400
              '#fcd34d', // amber-300
              '#93c5fd'  // blue-300
            ]
            color = colors[Math.abs(hash) % colors.length]
            displayName = status.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
        }
        
        chartData.push({
          name: displayName,
          value: count,
          color
        })
      })

      // Sort berdasarkan jumlah (descending)
      chartData.sort((a, b) => b.value - a.value)

      setData(chartData)
      console.log('BIMA Status distribution loaded:', {
        totalRecords: allStatusData.length,
        statusDistribution: chartData
      })
      
    } catch (err) {
      console.error('Error fetching BIMA status:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch BIMA status data')
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const refresh = () => {
    fetchBimaStatus()
  }

  return {
    data,
    loading,
    error,
    refresh
  }
}
