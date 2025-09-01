"use client"

import { useState, useEffect, useCallback } from 'react'
import { supabase, FormatOrder } from '@/lib/supabase'

interface UseFormatOrderOptions {
  pageSize?: number
  filters?: {
    channel?: string
    dateCreated?: string
    branch?: string
    serviceArea?: string
    mitra?: string
    updateLapangan?: string
    statusBima?: string
  }
}

interface UseFormatOrderReturn {
  data: FormatOrder[]
  loading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextPage: () => void
  previousPage: () => void
  goToPage: (page: number) => void
  refresh: () => void
  setFilters: (filters: UseFormatOrderOptions['filters']) => void
}

export function useFormatOrder(options: UseFormatOrderOptions = {}): UseFormatOrderReturn {
  const { pageSize = 50, filters: initialFilters } = options
  
  const [data, setData] = useState<FormatOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFiltersState] = useState(initialFilters || {})

  const totalPages = Math.ceil(totalCount / pageSize)
  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  const fetchData = useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)

      // Build query
      let query = supabase
        .from('format_order')
        .select('*', { count: 'exact' })
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.channel) {
        query = query.ilike('channel', `%${filters.channel}%`)
      }
      if (filters.dateCreated) {
        query = query.gte('date_created', filters.dateCreated)
      }
      if (filters.branch) {
        query = query.ilike('branch', `%${filters.branch}%`)
      }
      if (filters.serviceArea) {
        query = query.ilike('service_area', `%${filters.serviceArea}%`)
      }
      if (filters.mitra) {
        query = query.ilike('mitra', `%${filters.mitra}%`)
      }
      if (filters.updateLapangan) {
        query = query.ilike('update_lapangan', `%${filters.updateLapangan}%`)
      }
      if (filters.statusBima) {
        query = query.ilike('status_bima', `%${filters.statusBima}%`)
      }

      const { data: result, error: queryError, count } = await query

      if (queryError) {
        throw queryError
      }

      setData(result || [])
      setTotalCount(count || 0)
      setCurrentPage(page)
    } catch (err) {
      console.error('Error fetching format_order data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      setData([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [pageSize, filters])

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      fetchData(currentPage + 1)
    }
  }, [hasNextPage, currentPage, fetchData])

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      fetchData(currentPage - 1)
    }
  }, [hasPreviousPage, currentPage, fetchData])

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchData(page)
    }
  }, [totalPages, fetchData])

  const refresh = useCallback(() => {
    fetchData(currentPage)
  }, [currentPage, fetchData])

  const setFilters = useCallback((newFilters: UseFormatOrderOptions['filters']) => {
    setFiltersState(newFilters || {})
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  // Fetch data when component mounts or filters change
  useEffect(() => {
    fetchData(1)
  }, [filters, fetchData])

  return {
    data,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    refresh,
    setFilters
  }
}

// Helper function to get data for specific tabs
export function useTabData(tab: string, options: UseFormatOrderOptions = {}) {
  const formatOrderHook = useFormatOrder(options)
  
  const getTabData = useCallback((data: FormatOrder[], tabName: string) => {
    switch (tabName) {
      case "Work Order":
        return data.map(item => [
          item.order_id,
          item.channel || '-',
          item.date_created || '-',
          item.workorder || '-',
          item.sc_order_no || '-'
        ])
      case "Mitra":
        return data.map(item => [
          item.order_id,
          item.mitra || '-',
          item.labor_teknisi || '-'
        ])
      case "Update lapangan":
        return data.map(item => [
          item.order_id,
          item.update_lapangan || '-',
          item.symptom || '-',
          item.tinjut_hd_oplang || '-',
          item.status_bima || '-'
        ])
      case "MANJA":
        // Calculate kategori and umur manja from existing data
        const getKategoriManja = (item: FormatOrder) => {
          // This would need business logic to determine MANJA category
          // For now, return a placeholder based on order_id existence
          return item.order_id ? 'Normal' : 'Unknown'
        }
        
        const getUmurManja = (item: FormatOrder) => {
          // This would need business logic to calculate MANJA age
          // For now, return a placeholder based on order_id existence
          return item.order_id ? '0 hari' : 'N/A'
        }
        
        return data.map(item => [
          item.order_id,
          getKategoriManja(item),
          getUmurManja(item)
        ])
      default:
        return []
    }
  }, [])

  return {
    ...formatOrderHook,
    tabData: getTabData(formatOrderHook.data, tab)
  }
}
