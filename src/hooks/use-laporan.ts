import { useState, useEffect, useCallback } from "react"
import { supabase, type FormatOrder } from "@/lib/supabase"

interface FilteredData {
  headers: string[]
  rows: string[][]
}

interface FilterState {
  date: string
  ao: string
  channel: string
  branch: string
}

interface DropdownState {
  datePicker: boolean
  ao: boolean
  channel: boolean
  branch: boolean
}

export function useLaporan() {
  const [csvData, setCsvData] = useState<FilteredData | null>(null)
  const [filteredData, setFilteredData] = useState<FilteredData | null>(null)
  const [visibleRows, setVisibleRows] = useState<number>(50)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)
  
  // Consolidated filter states
  const [filters, setFilters] = useState<FilterState>({
    date: "",
    ao: "",
    channel: "",
    branch: ""
  })
  
  // Consolidated dropdown states
  const [dropdowns, setDropdowns] = useState<DropdownState>({
    datePicker: false,
    ao: false,
    channel: false,
    branch: false
  })

  // Function to close all other dropdowns
  const closeOtherDropdowns = useCallback((currentDropdown: string) => {
    setDropdowns(prev => ({
      datePicker: currentDropdown === 'date' ? prev.datePicker : false,
      ao: currentDropdown === 'ao' ? prev.ao : false,
      channel: currentDropdown === 'channel' ? prev.channel : false,
      branch: currentDropdown === 'branch' ? prev.branch : false
    }))
    
    // If 'none' is passed, close all dropdowns
    if (currentDropdown === 'none') {
      setDropdowns({
        datePicker: false,
        ao: false,
        channel: false,
        branch: false
      })
    }
  }, [])

  // Apply filters with specific data
  const applyFiltersWithData = useCallback((data: FilteredData) => {
    let filtered = data.rows

    // Apply ORDER_ID filter
    if (filters.ao) {
      filtered = filtered.filter(row => 
        row[0]?.toLowerCase().includes(filters.ao.toLowerCase())
      )
    }

    // Apply Channel filter
    if (filters.channel) {
      filtered = filtered.filter(row => 
        row[1]?.toLowerCase().includes(filters.channel.toLowerCase())
      )
    }

    // Apply Date filter
    if (filters.date) {
      filtered = filtered.filter(row => 
        row[2]?.toLowerCase().includes(filters.date.toLowerCase())
      )
    }

    // Apply Branch filter
    if (filters.branch) {
      filtered = filtered.filter(row => 
        row[5]?.toLowerCase().includes(filters.branch.toLowerCase())
      )
    }

    setFilteredData({ headers: data.headers, rows: filtered })
    
    // Reset visible rows when filter changes
    setVisibleRows(50)
  }, [filters])

  // Load data from Supabase database
  const loadCSVData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Get all format orders from database using pagination
      let allFormatOrders: FormatOrder[] = []
      let page = 0
      const pageSize = 1000
      let hasMore = true
      let totalCount = 0

      // Pagination to get all data
      while (hasMore) {
        const { data: formatOrders, error: supabaseError, count } = await supabase
          .from('format_order')
          .select('*', { count: page === 0 ? 'exact' : undefined })
          .range(page * pageSize, (page + 1) * pageSize - 1)

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        if (formatOrders && formatOrders.length > 0) {
          allFormatOrders = [...allFormatOrders, ...formatOrders]
          if (page === 0 && count) {
            totalCount = count
          }
          hasMore = formatOrders.length === pageSize
          page++
        } else {
          hasMore = false
        }
      }

      setTotalCount(totalCount || allFormatOrders.length)
      
      if (allFormatOrders && allFormatOrders.length > 0) {
        // Define the specific columns we want to display
        const headers = [
          "ORDER_ID", 
          "CHANNEL", 
          "DATE_CREATED", 
          "WORKORDER", 
          "SERVICE_AREA", 
          "BRANCH", 
          "UPDATE_LAPANGAN", 
          "SYMPTOM", 
          "TINJUT_HD_OPLANG", 
          "KATEGORI_MANJA", 
          "STATUS_BIMA"
        ]
        
        // Convert format orders to table format
        const rows = allFormatOrders.map((fo: FormatOrder) => [
          fo.order_id || "",
          fo.channel || "",
          fo.date_created || "",
          fo.workorder || "",
          fo.service_area || "",
          fo.branch || "",
          fo.update_lapangan || "",
          fo.symptom || "",
          fo.tinjut_hd_oplang || "",
          "Normal", // Placeholder for kategori_manja
          fo.status_bima || ""
        ])
        
        const data = { headers, rows }
        
        setCsvData(data)
        
        // Apply initial filters
        if (data.rows.length > 0) {
          applyFiltersWithData(data)
        }
      } else {
        setCsvData(null)
        setFilteredData(null)
        setTotalCount(0)
        setError("No data available. Please upload CSV data first.")
      }
    } catch (error) {
      console.error("Laporan: Failed to load data from Supabase:", error)
      setError("Failed to load data from database. Please try again.")
      setCsvData(null)
      setFilteredData(null)
      setTotalCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [applyFiltersWithData])

  // Apply filters with memoization
  const applyFilters = useCallback(() => {
    if (!csvData) return
    applyFiltersWithData(csvData)
  }, [csvData, applyFiltersWithData])

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      date: "",
      ao: "",
      channel: "",
      branch: ""
    })
    if (csvData) {
      applyFiltersWithData(csvData)
    }
  }, [csvData, applyFiltersWithData])

  // Helper functions to update individual filters
  const setDateFilter = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, date: value }))
  }, [])

  const setAoFilter = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, ao: value }))
  }, [])

  const setChannelFilter = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, channel: value }))
  }, [])

  const setBranchFilter = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, branch: value }))
  }, [])

  // Helper functions to update individual dropdown states
  const setShowDatePicker = useCallback((value: boolean) => {
    setDropdowns(prev => ({ ...prev, datePicker: value }))
  }, [])

  const setShowAoDropdown = useCallback((value: boolean) => {
    setDropdowns(prev => ({ ...prev, ao: value }))
  }, [])

  const setShowChannelDropdown = useCallback((value: boolean) => {
    setDropdowns(prev => ({ ...prev, channel: value }))
  }, [])

  const setShowBranchDropdown = useCallback((value: boolean) => {
    setDropdowns(prev => ({ ...prev, branch: value }))
  }, [])

  // Handle infinite scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    
    // Load more rows when near bottom
    if (scrollHeight - scrollTop - clientHeight < 100) {
      setVisibleRows(prev => Math.min(prev + 50, (filteredData?.rows.length || 0)))
    }
  }, [filteredData?.rows.length])

  // Load data on mount and listen for updates
  useEffect(() => {
    // Load initial data
    loadCSVData()

    // Listen for custom events (when data is uploaded in same tab)
    const handleDataUpdate = () => loadCSVData()

    // Listen for window focus (when user returns to tab)
    const handleWindowFocus = () => loadCSVData()

    // Listen for visibility change (when tab becomes visible)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadCSVData()
      }
    }

    // Add all event listeners
    window.addEventListener('csvDataUpdated', handleDataUpdate)
    window.addEventListener('focus', handleWindowFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('csvDataUpdated', handleDataUpdate)
      window.removeEventListener('focus', handleWindowFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [loadCSVData])

  // Apply filters when filter values change
  useEffect(() => {
    if (csvData) {
      applyFilters()
    }
  }, [csvData, applyFilters])

  return {
    // State
    csvData,
    filteredData,
    visibleRows,
    isLoading,
    error,
    totalCount,
    
    // Filter states
    dateFilter: filters.date,
    aoFilter: filters.ao,
    channelFilter: filters.channel,
    branchFilter: filters.branch,
    
    // Dropdown states
    showDatePicker: dropdowns.datePicker,
    showAoDropdown: dropdowns.ao,
    showChannelDropdown: dropdowns.channel,
    showBranchDropdown: dropdowns.branch,
    
    // Actions
    setDateFilter,
    setAoFilter,
    setChannelFilter,
    setBranchFilter,
    setShowDatePicker,
    setShowAoDropdown,
    setShowChannelDropdown,
    setShowBranchDropdown,
    closeOtherDropdowns,
    applyFilters,
    resetFilters,
    handleScroll,
    loadCSVData
  }
}
