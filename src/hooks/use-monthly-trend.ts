import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface MonthlyTrendData {
  month: string
  orders: number
  monthName: string
}

export function useMonthlyTrend() {
  const [data, setData] = useState<MonthlyTrendData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMonthlyTrend()
  }, [])

  const fetchMonthlyTrend = async () => {
    try {
      setLoading(true)
      setError(null)

      // Pagination untuk mengambil semua data
      let allData: Array<{date_created: string}> = []
      let page = 0
      const pageSize = 1000
      let hasMore = true

      while (hasMore) {
        const { data: orderData, error } = await supabase
          .from('format_order')
          .select('date_created')
          .not('date_created', 'is', null)
          .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) {
          throw error
        }

        if (orderData && orderData.length > 0) {
          allData = [...allData, ...orderData]
          hasMore = orderData.length === pageSize
          page++
        } else {
          hasMore = false
        }
      }

      console.log(`Loaded ${allData.length} date records for monthly trend`)

      // Hitung distribusi per bulan
      const monthCounts = new Map<string, number>()
      
      allData.forEach(item => {
        if (item.date_created) {
          try {
            const date = new Date(item.date_created)
            if (!isNaN(date.getTime())) {
              // Format: YYYY-MM untuk grouping
              const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
              monthCounts.set(monthKey, (monthCounts.get(monthKey) || 0) + 1)
            }
          } catch {
            // Skip invalid dates
          }
        }
      })

      // Konversi ke format chart dan sort berdasarkan bulan
      const chartData: MonthlyTrendData[] = []
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ]

      // Generate 12 bulan terakhir (termasuk bulan kosong)
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() // 0-based

      // Generate 12 bulan terakhir
      for (let i = 11; i >= 0; i--) {
        const targetDate = new Date(currentYear, currentMonth - i, 1)
        const year = targetDate.getFullYear()
        const month = targetDate.getMonth() + 1 // Convert to 1-based
        const monthKey = `${year}-${String(month).padStart(2, '0')}`
        const monthIndex = month - 1
        const monthName = monthNames[monthIndex]
        
        const count = monthCounts.get(monthKey) || 0
        
        chartData.push({
          month: monthKey,
          orders: count,
          monthName: `${monthName} ${year}`
        })
      }

      const recentData = chartData

      setData(recentData)
      console.log('Monthly trend data loaded:', {
        totalRecords: allData.length,
        monthlyDistribution: recentData
      })
      
    } catch (err) {
      console.error('Error fetching monthly trend:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch monthly trend data')
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const refresh = () => {
    fetchMonthlyTrend()
  }

  return {
    data,
    loading,
    error,
    refresh
  }
}
