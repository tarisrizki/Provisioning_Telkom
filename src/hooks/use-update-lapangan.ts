import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface UpdateLapanganData {
  name: string
  value: number
  displayName: string
}

export function useUpdateLapangan() {
  const [data, setData] = useState<UpdateLapanganData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)



  useEffect(() => {
    console.log('UpdateLapangan: Hook initialized, starting data fetch...')
    
    // Mapping dari data Supabase ke display names (berdasarkan format actual di database)
    const statusMappingLocal: Record<string, string> = {
      'a.closed': 'A.CLOSED',
      'b.kendala pelanggan': 'B.Kendala Pelanggan', 
      'c.kendala teknik (unsc)': 'C.Kendala Teknik (UNSC)',
      'd.kendala teknik (non unsc)': 'D.Kendala Teknik (Non-UNSC)', // Note: NON UNSC tanpa tanda kurung
      'h.assigned': 'H.Assigned'
    }

    // Helper function to normalize status for matching
    const normalizeStatus = (status: string) => status.toLowerCase().trim()

    async function fetchUpdateLapanganData() {
      try {
        setLoading(true)
        setError(null)
        
        console.log('UpdateLapangan: Starting to fetch data from Supabase...')
        
        // Check if Supabase is configured
        if (!supabase) {
          throw new Error('Supabase client not configured')
        }


        
        // Fetch all update_lapangan data with pagination
        let allData: Array<{update_lapangan: string}> = []
        let page = 0
        const pageSize = 1000
        let hasMore = true

        while (hasMore) {
          const { data: updateData, error } = await supabase
            .from('format_order')
            .select('update_lapangan')
            .not('update_lapangan', 'is', null)
            .not('update_lapangan', 'eq', '')
            .range(page * pageSize, (page + 1) * pageSize - 1)

          if (error) {
            console.error('UpdateLapangan: Error fetching data from Supabase:', error)
            throw error
          }

          if (updateData && updateData.length > 0) {
            allData = [...allData, ...updateData]
            console.log(`UpdateLapangan: Fetched page ${page + 1}, got ${updateData.length} records, total: ${allData.length}`)
            
            if (updateData.length < pageSize) {
              hasMore = false
            } else {
              page++
            }
          } else {
            hasMore = false
          }
        }

        console.log(`UpdateLapangan: Total records fetched: ${allData.length}`)

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

        // Debug: Log all unique statuses found in database
        console.log('UpdateLapangan: All unique statuses found in database:', Array.from(uniqueStatuses).sort())

        // Convert to array with display names, filter only mapped statuses, and sort by count
        const allMappedData = Array.from(statusCounts.entries())
          .map(([status, count]) => ({
            name: status,
            value: count,
            displayName: statusMappingLocal[normalizeStatus(status)] || status
          }))

        // Filter to show only the 5 mapped statuses
        const chartData: UpdateLapanganData[] = allMappedData
          .filter(item => statusMappingLocal[normalizeStatus(item.name)]) // Only show the 5 mapped statuses
          .sort((a, b) => b.value - a.value)

        console.log('UpdateLapangan: Final filtered results:', {
          totalUniqueStatusesInDB: uniqueStatuses.size,
          allStatusesInDB: Array.from(uniqueStatuses).sort(),
          filteredStatusesShown: chartData.map(item => `${item.name} → ${item.displayName} (${item.value.toLocaleString()})`),
          finalChartDataCount: chartData.length,
          expectedCount: 5
        })

        setData(chartData)

      } catch (err) {
        console.error('UpdateLapangan: Error processing data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchUpdateLapanganData()
  }, [])

  return { data, loading, error }
}
