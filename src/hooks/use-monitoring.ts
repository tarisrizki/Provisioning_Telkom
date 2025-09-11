import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface MonitoringData {
  name: string
  value: number
  displayName: string
  color: string
}

export interface MonitoringFilters {
  month?: string
  branch?: string
  cluster?: string
}

export function useMonitoring(filters?: MonitoringFilters) {
  const [data, setData] = useState<MonitoringData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('Monitoring: Hook initialized, starting data fetch with filters:', filters)
    
    // Mapping dari data Supabase ke display names dan warna
    const statusMappingLocal: Record<string, { displayName: string; color: string }> = {
      'b.kendala pelanggan': { displayName: 'Kendala Pelanggan', color: '#ef4444' }, // red
      'c.kendala teknik (unsc)': { displayName: 'Kendala teknik (UNSC)', color: '#f59e0b' }, // amber
      'd.kendala teknik (non unsc)': { displayName: 'Kendala teknik (NON UNSC)', color: '#f97316' }, // orange
      'i.input ulang': { displayName: 'INPUT ULANG', color: '#8b5cf6' }, // violet
      'h.assigned': { displayName: 'ASSIGNED', color: '#06b6d4' }, // cyan
      'e.force majuere': { displayName: 'FORCE MAJUERE', color: '#dc2626' }, // red-600
      'k. salah segment': { displayName: 'SALAH SEGMEN', color: '#84cc16' }, // lime
      'f.pending ikr': { displayName: 'PENDING IKR', color: '#6366f1' } // indigo
    }

    // Helper function to normalize status for matching
    const normalizeStatus = (status: string) => status.toLowerCase().trim()

    async function fetchMonitoringData() {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Monitoring: Starting to fetch data from Supabase with filters...')
        
        // Check if Supabase is configured
        if (!supabase) {
          throw new Error('Supabase client not configured')
        }
        
        // Build query with filters
        let query = supabase
          .from('format_order')
          .select('update_lapangan, branch, cluster, date_created, status_date, booking_date, tanggal_ps')
          .not('update_lapangan', 'is', null)
          .not('update_lapangan', 'eq', '')

        // Apply filters
        if (filters?.branch && filters.branch !== "Pilih Branch") {
          console.log('Applying branch filter:', filters.branch)
          query = query.ilike('branch', `%${filters.branch}%`)
        }
        if (filters?.cluster && filters.cluster !== "Pilih Cluster") {
          console.log('Applying cluster filter:', filters.cluster)
          query = query.ilike('cluster', `%${filters.cluster}%`)
        }
        if (filters?.month && filters.month !== "Pilih Bulan") {
          // Handle month filtering for format like "Oktober 2024"
          const monthMap: {[key: string]: string} = {
            "Januari": "01", "Februari": "02", "Maret": "03", "April": "04",
            "Mei": "05", "Juni": "06", "Juli": "07", "Agustus": "08", 
            "September": "09", "Oktober": "10", "November": "11", "Desember": "12"
          }
          
          const parts = filters.month.split(' ')
          if (parts.length === 2) {
            const monthName = parts[0]
            const year = parts[1]
            const monthNum = monthMap[monthName]
            if (monthNum) {
              const lastDay = new Date(parseInt(year), parseInt(monthNum), 0).getDate()
              const startDate = `${year}-${monthNum}-01`
              const endDate = `${year}-${monthNum}-${lastDay.toString().padStart(2, '0')}`
              console.log('Applying month filter:', startDate, 'to', endDate)
              
              // Use OR condition to check multiple date columns
              query = query.or(`and(date_created.gte.${startDate},date_created.lte.${endDate}),and(status_date.gte.${startDate},status_date.lte.${endDate}),and(booking_date.gte.${startDate},booking_date.lte.${endDate}),and(tanggal_ps.gte.${startDate},tanggal_ps.lte.${endDate})`)
            }
          }
        }

        // Fetch all data with pagination
        let allData: Array<{update_lapangan: string}> = []
        let page = 0
        const pageSize = 1000
        let hasMore = true

        while (hasMore) {
          const { data: updateData, error } = await query
            .range(page * pageSize, (page + 1) * pageSize - 1)

          if (error) {
            console.error('Monitoring: Error fetching data from Supabase:', error)
            throw error
          }

          if (updateData && updateData.length > 0) {
            allData = [...allData, ...updateData]
            console.log(`Monitoring: Fetched page ${page + 1}, got ${updateData.length} records, total: ${allData.length}`)
            
            if (updateData.length < pageSize) {
              hasMore = false
            } else {
              page++
            }
          } else {
            hasMore = false
          }
        }

        console.log(`Monitoring: Total records fetched: ${allData.length}`)

        // Count occurrences of each update_lapangan status
        const statusCounts = new Map<string, number>()
        const uniqueStatuses = new Set<string>()
        
        allData.forEach(item => {
          const status = item.update_lapangan?.trim()
          if (status) {
            uniqueStatuses.add(status)
            const currentCount = statusCounts.get(status) || 0
            statusCounts.set(status, currentCount + 1)
          }
        })

        console.log('Monitoring: All unique statuses found in database:', Array.from(uniqueStatuses).sort())

        // Convert to array with display names and colors, filter only mapped statuses, and sort by count
        const allMappedData = Array.from(statusCounts.entries())
          .map(([status, count]) => ({
            name: status,
            value: count,
            displayName: statusMappingLocal[normalizeStatus(status)]?.displayName || status,
            color: statusMappingLocal[normalizeStatus(status)]?.color || '#6b7280'
          }))

        const chartData: MonitoringData[] = allMappedData
          .filter(item => statusMappingLocal[normalizeStatus(item.name)]) // Only show the mapped statuses
          .sort((a, b) => b.value - a.value)

        console.log('Monitoring: Final filtered results:', {
          totalUniqueStatusesInDB: uniqueStatuses.size,
          allStatusesInDB: Array.from(uniqueStatuses).sort(),
          filteredStatusesShown: chartData.map(item => `${item.name} → ${item.displayName} (${item.value.toLocaleString()})`),
          finalChartDataCount: chartData.length,
          expectedCount: 8
        })

        setData(chartData)

      } catch (err) {
        console.error('Monitoring: Error processing data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchMonitoringData()
  }, [filters])

  return { data, loading, error }
}
