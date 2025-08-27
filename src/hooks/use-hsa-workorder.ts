import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface HSAWorkOrderData {
  name: string
  value: number
  color: string
}

export function useHSAWorkOrder() {
  const [data, setData] = useState<HSAWorkOrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('HSAWorkOrder: Hook initialized, starting data fetch...')
    
    // Color palette untuk HSA yang berbeda
    const hsaColors = [
      '#3b82f6', // blue
      '#ef4444', // red
      '#10b981', // emerald
      '#f59e0b', // amber
      '#8b5cf6', // violet
      '#06b6d4', // cyan
      '#84cc16', // lime
      '#f97316', // orange
      '#ec4899', // pink
      '#6366f1', // indigo
      '#14b8a6', // teal
      '#f43f5e', // rose
      '#a78bfa', // purple
      '#fbbf24', // yellow
      '#22c55e'  // green
    ]

    async function fetchHSAWorkOrderData() {
      try {
        setLoading(true)
        setError(null)
        
        console.log('HSAWorkOrder: Starting to fetch data from Supabase...')
        console.log('HSAWorkOrder: Supabase client available:', !!supabase)
        
        // Check if Supabase is configured
        if (!supabase) {
          console.error('HSAWorkOrder: Supabase client not configured')
          throw new Error('Supabase client not configured')
        }

        // Test simple query first
        console.log('HSAWorkOrder: Testing simple query...')
        const { data: testData, error: testError } = await supabase
          .from('format_order')
          .select('service_area')
          .limit(5)

        if (testError) {
          console.error('HSAWorkOrder: Test query failed:', testError)
          throw new Error(`Database connection failed: ${testError.message}`)
        }

        console.log('HSAWorkOrder: Test query successful, sample data:', testData)
        
        // Fetch all service_area data with pagination
        let allData: Array<{service_area?: string}> = []
        let page = 0
        const pageSize = 1000
        let hasMore = true

        console.log('HSAWorkOrder: Starting paginated fetch...')

        while (hasMore) {
          console.log(`HSAWorkOrder: Fetching page ${page + 1}...`)
          
          const { data: hsaData, error } = await supabase
            .from('format_order')
            .select('service_area')
            .not('service_area', 'is', null)
            .not('service_area', 'eq', '')
            .range(page * pageSize, (page + 1) * pageSize - 1)

          if (error) {
            console.error('HSAWorkOrder: Error fetching data from Supabase:', error)
            throw new Error(`Database query failed: ${error.message}`)
          }

          console.log(`HSAWorkOrder: Page ${page + 1} result:`, {
            dataLength: hsaData?.length || 0,
            sampleData: hsaData?.slice(0, 3) || []
          })

          if (hsaData && hsaData.length > 0) {
            allData = [...allData, ...hsaData]
            console.log(`HSAWorkOrder: Fetched page ${page + 1}, got ${hsaData.length} records, total: ${allData.length}`)
            
            if (hsaData.length < pageSize) {
              hasMore = false
              console.log('HSAWorkOrder: Last page reached')
            } else {
              page++
            }
          } else {
            hasMore = false
            console.log('HSAWorkOrder: No more data')
          }
        }

        console.log(`HSAWorkOrder: Total records fetched: ${allData.length}`)

        if (allData.length === 0) {
          console.warn('HSAWorkOrder: No HSA data found in database')
          setData([])
          return
        }

        // Count occurrences of each HSA
        const hsaCounts = new Map<string, number>()
        const uniqueHSAs = new Set<string>()
        
        allData.forEach(item => {
          const hsa = item.service_area?.trim()
          if (hsa && hsa.length > 0) {
            uniqueHSAs.add(hsa)
            const currentCount = hsaCounts.get(hsa) || 0
            hsaCounts.set(hsa, currentCount + 1)
          }
        })

        console.log('HSAWorkOrder: Processing results:', {
          totalRecords: allData.length,
          uniqueHSACount: uniqueHSAs.size,
          topHSAs: Array.from(hsaCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5)
        })

        if (hsaCounts.size === 0) {
          console.warn('HSAWorkOrder: No valid HSA values found')
          setData([])
          return
        }

        // Convert to array with colors and sort by count (show top 10)
        const chartData: HSAWorkOrderData[] = Array.from(hsaCounts.entries())
          .map(([hsa, count], index) => ({
            name: hsa,
            value: count,
            color: hsaColors[index % hsaColors.length]
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10) // Show top 10 HSAs

        console.log('HSAWorkOrder: Final chart data:', {
          dataCount: chartData.length,
          chartData: chartData.map(item => `${item.name}: ${item.value.toLocaleString()}`)
        })

        setData(chartData)

      } catch (err) {
        console.error('HSAWorkOrder: Error processing data:', err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        console.error('HSAWorkOrder: Full error details:', {
          error: err,
          message: errorMessage,
          stack: err instanceof Error ? err.stack : undefined
        })
        setError(errorMessage)
        setData([])
      } finally {
        setLoading(false)
        console.log('HSAWorkOrder: Fetch completed')
      }
    }

    fetchHSAWorkOrderData()
  }, [])

  return { data, loading, error }
}
