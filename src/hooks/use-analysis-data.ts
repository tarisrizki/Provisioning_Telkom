"use client"

import { useState, useEffect, useCallback } from 'react'
import { supabase, type FormatOrder } from '@/lib/supabase'

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

// Helper function to create stats reducer
const createStatsReducer = (fieldExtractor: (item: FormatOrder) => string | undefined) => 
  (acc: Record<string, number>, item: FormatOrder) => {
    const value = fieldExtractor(item)?.trim() || 'Unknown'
    acc[value] = (acc[value] || 0) + 1
    return acc
  }

// Helper function to calculate MANJA category
const calculateManjaCategory = (item: FormatOrder): string => {
  if (!item.booking_date || !item.date_created) return 'Normal'
  
  try {
    const bookingDate = new Date(item.booking_date)
    const createdDate = new Date(item.date_created)
    const daysDiff = Math.floor((createdDate.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff > 3) return 'Lewat MANJA'
    if (daysDiff > 1) return 'MANJA H+'
    if (daysDiff > 0) return 'MANJA H++'
    return 'MANJA HI'
  } catch {
    return 'Normal'
  }
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

      // Create stat reducers for each field
      const channelReducer = createStatsReducer(item => item.channel)
      const serviceAreaReducer = createStatsReducer(item => item.service_area)
      const mitraReducer = createStatsReducer(item => item.mitra)
      const laborTeknisiReducer = createStatsReducer(item => item.labor_teknisi)
      const updateLapanganReducer = createStatsReducer(item => item.update_lapangan)
      const statusBimaReducer = createStatsReducer(item => item.status_bima)
      const symptomReducer = createStatsReducer(item => item.symptom)
      const tinjutReducer = createStatsReducer(item => item.tinjut_hd_oplang)
      const manjaReducer = createStatsReducer(calculateManjaCategory)

      // Calculate all statistics efficiently
      const analysisData: AnalysisData = {
        totalAO: allData.length,
        channelStats: allData.reduce(channelReducer, {}),
        serviceAreaStats: allData.reduce(serviceAreaReducer, {}),
        mitraStats: allData.reduce(mitraReducer, {}),
        laborTeknisiStats: allData.reduce(laborTeknisiReducer, {}),
        updateLapanganStats: allData.reduce(updateLapanganReducer, {}),
        statusBimaStats: allData.reduce(statusBimaReducer, {}),
        symptomStats: allData.reduce(symptomReducer, {}),
        tinjutStats: allData.reduce(tinjutReducer, {}),
        manjaStats: allData.reduce(manjaReducer, {})
      }

      setData(analysisData)
      
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
