"use client"

import { useState, useEffect, useCallback } from 'react'
import { supabase, FormatOrder } from '@/lib/supabase'

interface AnalysisData {
  totalAO: number
  channelStats: Record<string, number>
  serviceAreaStats: Record<string, number>
  mitraStats: Record<string, number>
  laborTeknisiStats: Record<string, number>
  updateLapanganStats: Record<string, number>
  statusBimaStats: Record<string, number>
  symptomStats: Record<string, number>
  tinjutStats: Record<string, number>
  manjaStats: Record<string, number>
}

export function useAnalysisData() {
  const [data, setData] = useState<AnalysisData>({
    totalAO: 0,
    channelStats: {},
    serviceAreaStats: {},
    mitraStats: {},
    laborTeknisiStats: {},
    updateLapanganStats: {},
    statusBimaStats: {},
    symptomStats: {},
    tinjutStats: {},
    manjaStats: {}
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalysisData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all data from format_order table for analysis
      let allData: FormatOrder[] = []
      let page = 0
      const pageSize = 1000
      let hasMore = true

      // Pagination to get all data
      while (hasMore) {
        const { data: formatOrders, error } = await supabase
          .from('format_order')
          .select('*')
          .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) {
          throw error
        }

        if (formatOrders && formatOrders.length > 0) {
          allData = [...allData, ...formatOrders]
          hasMore = formatOrders.length === pageSize
          page++
        } else {
          hasMore = false
        }
      }

      console.log(`Analysis: Loaded ${allData.length} records for analysis`)

      // Calculate all statistics
      const analysisData: AnalysisData = {
        totalAO: allData.length,
        
        // Channel distribution
        channelStats: allData.reduce((acc: Record<string, number>, item) => {
          const channel = item.channel?.trim() || 'Unknown'
          acc[channel] = (acc[channel] || 0) + 1
          return acc
        }, {}),
        
        // Service Area distribution
        serviceAreaStats: allData.reduce((acc: Record<string, number>, item) => {
          const serviceArea = item.service_area?.trim() || 'Unknown'
          acc[serviceArea] = (acc[serviceArea] || 0) + 1
          return acc
        }, {}),
        
        // Mitra distribution
        mitraStats: allData.reduce((acc: Record<string, number>, item) => {
          const mitra = item.mitra?.trim() || 'Unknown'
          acc[mitra] = (acc[mitra] || 0) + 1
          return acc
        }, {}),
        
        // Labor teknisi distribution
        laborTeknisiStats: allData.reduce((acc: Record<string, number>, item) => {
          const labor = item.labor_teknisi?.trim() || 'Unknown'
          acc[labor] = (acc[labor] || 0) + 1
          return acc
        }, {}),
        
        // Update lapangan distribution
        updateLapanganStats: allData.reduce((acc: Record<string, number>, item) => {
          const update = item.update_lapangan?.trim() || 'Unknown'
          acc[update] = (acc[update] || 0) + 1
          return acc
        }, {}),
        
        // Status BIMA distribution
        statusBimaStats: allData.reduce((acc: Record<string, number>, item) => {
          const status = item.status_bima?.trim() || 'Unknown'
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {}),
        
        // Symptom distribution
        symptomStats: allData.reduce((acc: Record<string, number>, item) => {
          const symptom = item.symptom?.trim() || 'Unknown'
          acc[symptom] = (acc[symptom] || 0) + 1
          return acc
        }, {}),
        
        // TINJUT HD OPLANG distribution
        tinjutStats: allData.reduce((acc: Record<string, number>, item) => {
          const tinjut = item.tinjut_hd_oplang?.trim() || 'Unknown'
          acc[tinjut] = (acc[tinjut] || 0) + 1
          return acc
        }, {}),
        
        // MANJA analysis (calculate from existing data)
        manjaStats: allData.reduce((acc: Record<string, number>, item) => {
          // This would need business logic to determine MANJA category
          // For now, we'll use a placeholder categorization
          let category = 'Normal'
          
          // Example business logic - you can customize this
          if (item.booking_date && item.date_created) {
            try {
              const bookingDate = new Date(item.booking_date)
              const createdDate = new Date(item.date_created)
              const daysDiff = Math.floor((createdDate.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24))
              
              if (daysDiff > 3) {
                category = 'Lewat MANJA'
              } else if (daysDiff > 1) {
                category = 'MANJA H+'
              } else if (daysDiff > 0) {
                category = 'MANJA H++'
              } else {
                category = 'MANJA HI'
              }
            } catch {
              category = 'Normal'
            }
          }
          
          acc[category] = (acc[category] || 0) + 1
          return acc
        }, {})
      }

      setData(analysisData)
      
      console.log('Analysis data calculated:', {
        totalRecords: analysisData.totalAO,
        channels: Object.keys(analysisData.channelStats).length,
        serviceAreas: Object.keys(analysisData.serviceAreaStats).length,
        mitras: Object.keys(analysisData.mitraStats).length,
        laborTeknisi: Object.keys(analysisData.laborTeknisiStats).length
      })
      
    } catch (err) {
      console.error('Error fetching analysis data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch analysis data')
      setData({
        totalAO: 0,
        channelStats: {},
        serviceAreaStats: {},
        mitraStats: {},
        laborTeknisiStats: {},
        updateLapanganStats: {},
        statusBimaStats: {},
        symptomStats: {},
        tinjutStats: {},
        manjaStats: {}
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalysisData()
  }, [fetchAnalysisData])

  const refresh = useCallback(() => {
    fetchAnalysisData()
  }, [fetchAnalysisData])

  // Helper function to get top N items from stats
  const getTopItems = useCallback((stats: Record<string, number>, limit = 5) => {
    return Object.entries(stats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
  }, [])

  // Helper function to calculate percentage width for bars
  const getPercentageWidth = useCallback((value: number, total: number) => {
    return total > 0 ? Math.max((value / total) * 100, 5) : 0
  }, [])

  return {
    data,
    loading,
    error,
    refresh,
    getTopItems,
    getPercentageWidth
  }
}
