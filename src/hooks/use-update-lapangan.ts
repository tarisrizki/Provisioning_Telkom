import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

export interface UpdateLapanganData {
  name: string
  value: number
  displayName: string
}

// Status mapping configuration - include more variations and patterns
const STATUS_MAPPING: Record<string, string> = {
  // Main categories
  'a.closed': 'A.CLOSED',
  'b.kendala pelanggan': 'B.Kendala Pelanggan', 
  'c.kendala teknik (unsc)': 'C.Kendala Teknik (UNSC)',
  'd.kendala teknik (non unsc)': 'D.Kendala Teknik (Non-UNSC)',
  'd.kendala teknik (non-unsc)': 'D.Kendala Teknik (Non-UNSC)', // Alternative format
  'h.assigned': 'H.Assigned',
  
  // Additional possible variations
  'closed': 'A.CLOSED',
  'assigned': 'H.Assigned',
  'kendala pelanggan': 'B.Kendala Pelanggan',
  'kendala teknik': 'C.Kendala Teknik',
  
  // Common status patterns
  'complete': 'Complete',
  'completed': 'Complete',
  'pending': 'Pending',
  'in progress': 'In Progress',
  'failed': 'Failed',
  'cancelled': 'Cancelled'
}

// Helper function to normalize status for matching - more flexible
const normalizeStatus = (status: string) => {
  if (!status) return ''
  return status.toLowerCase().trim().replace(/[^\w\s().]/g, '').replace(/\s+/g, ' ')
}

export function useUpdateLapangan() {
  const [data, setData] = useState<UpdateLapanganData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data from Supabase with pagination
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!supabase) {
        throw new Error('Supabase client not configured')
      }

      console.log('UpdateLapangan: Fetching data from Supabase...')

      // Fetch all update_lapangan data using pagination
      let allUpdateData: Array<{update_lapangan: string; order_id: string}> = []
      let page = 0
      let hasMore = true
      const pageSize = 1000

      while (hasMore) {
        const { data: pageData, error } = await supabase
          .from('format_order')
          .select('update_lapangan, order_id')
          .not('update_lapangan', 'is', null)
          .not('update_lapangan', 'eq', '')
          .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) {
          console.error('UpdateLapangan: Error fetching data from Supabase:', error)
          throw error
        }

        if (pageData && pageData.length > 0) {
          allUpdateData = [...allUpdateData, ...pageData]
          hasMore = pageData.length === pageSize
          page++
          console.log(`UpdateLapangan: Loaded page ${page}, got ${pageData.length} records, total: ${allUpdateData.length}`)
        } else {
          hasMore = false
        }
      }

      const updateData = allUpdateData

      console.log('UpdateLapangan: Raw data fetched:', updateData?.length || 0, 'records')
      
      // Debug: Show sample of raw data
      if (updateData && updateData.length > 0) {
        console.log('UpdateLapangan: Sample raw data:', updateData.slice(0, 5))
      }

      if (!updateData || updateData.length === 0) {
        console.log('UpdateLapangan: No data found with filter, checking all update_lapangan data...')
        
        // Fallback: check first 100 records as sample to see what's in the table
        const { data: allData, error: allError } = await supabase
          .from('format_order')
          .select('update_lapangan, order_id')
          .range(0, 99) // Get first 100 records as sample
        
        if (allError) {
          console.error('UpdateLapangan: Error in fallback query:', allError)
        } else {
          console.log('UpdateLapangan: All data sample:', allData?.slice(0, 10))
          const validUpdateLapangan = allData?.filter(item => 
            item.update_lapangan && 
            item.update_lapangan.trim() !== ''
          )
          console.log('UpdateLapangan: Valid update_lapangan entries:', validUpdateLapangan?.length || 0)
        }
        
        setData([])
        return
      }

      // Process the data
      const statusCounts = new Map<string, number>()
      const uniqueStatuses = new Set<string>()
      
      updateData?.forEach((item, index) => {
        const status = item.update_lapangan?.toString().trim()
        if (status) {
          uniqueStatuses.add(status)
          statusCounts.set(status, (statusCounts.get(status) || 0) + 1)
        } else {
          // Debug: log items without valid update_lapangan
          if (index < 5) {
            console.log('UpdateLapangan: Item without valid update_lapangan:', item)
          }
        }
      })

      console.log('UpdateLapangan: Processing complete:', {
        totalItems: updateData.length,
        uniqueStatusesFound: uniqueStatuses.size,
        statusCounts: Object.fromEntries(statusCounts)
      })

      // Convert to final format and filter mapped statuses
      const allMappedData = Array.from(statusCounts.entries())
        .map(([status, count]) => ({
          name: status,
          value: count,
          displayName: STATUS_MAPPING[normalizeStatus(status)] || status
        }))
        .sort((a, b) => b.value - a.value) // Sort by count first

      // Try to get mapped statuses first
      let chartData: UpdateLapanganData[] = allMappedData
        .filter(item => STATUS_MAPPING[normalizeStatus(item.name)])

      // If no mapped data found, show top 5 statuses regardless of mapping
      if (chartData.length === 0 && allMappedData.length > 0) {
        console.log('UpdateLapangan: No mapped statuses found, using top 5 most frequent')
        chartData = allMappedData.slice(0, 5) // Take top 5
      }

      // Final fallback: if still no data, create dummy data for testing
      if (chartData.length === 0) {
        console.log('UpdateLapangan: No data found, creating fallback test data')
        chartData = [
          { name: 'No Data', value: 1, displayName: 'No Update Lapangan Data Available' }
        ]
      }

      console.log('UpdateLapangan debug:', {
        totalUniqueStatuses: uniqueStatuses.size,
        allStatuses: Array.from(uniqueStatuses).sort(),
        allMappedData: allMappedData.slice(0, 10), // Show first 10
        filteredChartData: chartData,
        statusMapping: Object.keys(STATUS_MAPPING)
      })
      
      console.log('UpdateLapangan data processed:', chartData)
      setData(chartData)

    } catch (err) {
      console.error('UpdateLapangan: Error processing data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Memoized computed values
  const totalRecords = useMemo(() => 
    data.reduce((sum, item) => sum + item.value, 0)
  , [data])

  const statusNames = useMemo(() => 
    data.map(item => item.displayName)
  , [data])

  return { 
    data, 
    loading, 
    error, 
    totalRecords, 
    statusNames,
    refresh: fetchData 
  }
}
