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
          item.date_created || '-',
          item.workorder || '-',
          item.service_no || '-',
          item.workzone || '-',
          item.odp || '-',
          item.mitra || '-',
          item.labor_teknisi || '-'
        ])
      case "Aktivasi":
        return data.map(item => [
          item.order_id,
          item.workorder || '-',
          item.service_no || '-',
          item.mitra || '-',
          item.uic || '-', // Using UIC as SN
          item.keterangan_uic || '-', // Using keterangan_uic as KET
          item.status_bima || '-' // Using status_bima as Status
        ])
      case "Update lapangan":
        return data.map(item => [
          item.order_id,
          item.update_lapangan || '-',
          item.symptom || '-',
          item.tinjut_hd_oplang || '-',
          item.keterangan_hd_oplang || '-',
          item.status_bima || '-'
        ])
      case "MANJA":
        // Calculate kategori, umur, and sisa manja from existing data
        const getKategoriManja = (item: FormatOrder) => {
          // Business logic for MANJA category based on booking date and current status
          if (!item.booking_date) return 'No Booking Date'
          
          const bookingDate = new Date(item.booking_date)
          const currentDate = new Date()
          const daysDiff = Math.floor((currentDate.getTime() - bookingDate.getTime()) / (1000 * 3600 * 24))
          
          if (daysDiff <= 0) return 'MANJA H'
          if (daysDiff === 1) return 'MANJA H+'
          if (daysDiff === 2) return 'MANJA H++'
          if (daysDiff >= 3) return 'Lewat MANJA'
          
          return 'MANJA HI'
        }
        
        const getUmurManja = (item: FormatOrder) => {
          // Calculate age in days from booking date
          if (!item.booking_date) return '0 hari'
          
          const bookingDate = new Date(item.booking_date)
          const currentDate = new Date()
          const daysDiff = Math.floor((currentDate.getTime() - bookingDate.getTime()) / (1000 * 3600 * 24))
          
          return daysDiff >= 0 ? `${daysDiff} hari` : '0 hari'
        }
        
        const getSisaManja = (item: FormatOrder) => {
          // Calculate remaining MANJA days (3 days SLA - current age)
          if (!item.booking_date) return '3 hari'
          
          const bookingDate = new Date(item.booking_date)
          const currentDate = new Date()
          const daysDiff = Math.floor((currentDate.getTime() - bookingDate.getTime()) / (1000 * 3600 * 24))
          const remainingDays = 3 - daysDiff
          
          if (remainingDays <= 0) return '0 hari (Lewat SLA)'
          return `${remainingDays} hari`
        }
        
        return data.map(item => [
          item.order_id,
          item.booking_date || '-',
          getKategoriManja(item),
          getUmurManja(item),
          getSisaManja(item)
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

