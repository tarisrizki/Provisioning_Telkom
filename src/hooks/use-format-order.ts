"use client"

import { useState, useEffect, useCallback } from 'react'
import { supabase, FormatOrder } from '@/lib/supabase'

interface UseFormatOrderOptions {
  pageSize?: number
  filters?: {
    month?: string
    channel?: string
    dateCreated?: string
    branch?: string
    serviceArea?: string
    updateLapangan?: string
    statusBima?: string
    sa?: string
    cluster?: string
    workZone?: string
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

      console.log('Fetching data with filters:', filters) // Debug log

      // Test basic connection first
      const testQuery = await supabase.from('format_order').select('count', { count: 'exact', head: true })
      console.log('Database connection test:', testQuery)

      if (testQuery.error) {
        throw new Error(`Database connection failed: ${testQuery.error.message}`)
      }

      // Build query
      let query = supabase
        .from('format_order')
        .select('*', { count: 'exact' })
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.channel && filters.channel !== "Pilih Channel") {
        console.log('Applying channel filter:', filters.channel) // Debug log
        query = query.ilike('channel', `%${filters.channel}%`)
      }
      if (filters.month && filters.month !== "Pilih Bulan") {
        // Handle month filtering for format like "Oktober 2024"
        const monthMap: {[key: string]: string} = {
          "Januari": "01", "Februari": "02", "Maret": "03", "April": "04",
          "Mei": "05", "Juni": "06", "Juli": "07", "Agustus": "08", 
          "September": "09", "Oktober": "10", "November": "11", "Desember": "12"
        }
        
        // Extract month and year from filter like "Oktober 2024"
        const parts = filters.month.split(' ')
        if (parts.length === 2) {
          const monthName = parts[0]
          const year = parts[1]
          const monthNum = monthMap[monthName]
          if (monthNum) {
            // Get the last day of the month
            const lastDay = new Date(parseInt(year), parseInt(monthNum), 0).getDate()
            const startDate = `${year}-${monthNum}-01`
            const endDate = `${year}-${monthNum}-${lastDay.toString().padStart(2, '0')}`
            console.log('Applying month filter:', startDate, 'to', endDate) // Debug log
            
            // Use OR condition to check multiple date columns
            query = query.or(`and(date_created.gte.${startDate},date_created.lte.${endDate}),and(status_date.gte.${startDate},status_date.lte.${endDate}),and(booking_date.gte.${startDate},booking_date.lte.${endDate}),and(tanggal_ps.gte.${startDate},tanggal_ps.lte.${endDate})`)
          }
        }
      }
      if (filters.dateCreated) {
        query = query.gte('date_created', filters.dateCreated)
      }
      if (filters.branch && filters.branch !== "Pilih Branch") {
        console.log('Applying branch filter:', filters.branch) // Debug log
        query = query.ilike('branch', `%${filters.branch}%`)
      }
      if (filters.serviceArea && filters.serviceArea !== "Pilih SA") {
        query = query.ilike('service_area', `%${filters.serviceArea}%`)
      }
      if (filters.sa && filters.sa !== "Pilih SA") {
        console.log('Applying SA filter:', filters.sa) // Debug log
        query = query.ilike('service_area', `%${filters.sa}%`)
      }
      if (filters.cluster && filters.cluster !== "Pilih Cluster") {
        console.log('Applying cluster filter:', filters.cluster) // Debug log
        query = query.ilike('cluster', `%${filters.cluster}%`)
      }
      if (filters.workZone && filters.workZone !== "Pilih Work Zone") {
        console.log('Applying workZone filter:', filters.workZone) // Debug log
        query = query.ilike('workzone', `%${filters.workZone}%`)
      }
      if (filters.updateLapangan) {
        query = query.ilike('update_lapangan', `%${filters.updateLapangan}%`)
      }
      if (filters.statusBima) {
        query = query.ilike('status_bima', `%${filters.statusBima}%`)
      }

      const { data: result, error: queryError, count } = await query

      if (queryError) {
        console.error('Supabase query error details:', queryError)
        throw new Error(`Database query failed: ${queryError.message || 'Unknown database error'}`)
      }

      console.log('Query result count:', count, 'Data length:', result?.length) // Debug log
      setData(result || [])
      setTotalCount(count || 0)
      setCurrentPage(page)
    } catch (err) {
      console.error('Error fetching format_order data:', err)
      let errorMessage = 'Failed to fetch data'
      
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'object' && err !== null) {
        errorMessage = JSON.stringify(err)
      }
      
      setError(errorMessage)
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
    console.log('setFilters called with:', newFilters)
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

