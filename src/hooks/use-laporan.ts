import { useState, useEffect, useCallback } from "react"
import { DatabaseService } from "@/lib/database"

interface WorkOrderData {
  ao: string
  channel: string
  date_created: string
  workorder: string
  hsa: string
  branch: string
  update_lapangan: string
  symptom: string
  tinjut_hd_oplang: string
  kategori_manja: string
  status_bima: string
}

interface FilteredData {
  headers: string[]
  rows: string[][]
}

export function useLaporan() {
  const [csvData, setCsvData] = useState<FilteredData | null>(null)
  const [filteredData, setFilteredData] = useState<FilteredData | null>(null)
  const [visibleRows, setVisibleRows] = useState<number>(50)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)
  
  // Filter states
  const [dateFilter, setDateFilter] = useState("")
  const [aoFilter, setAoFilter] = useState("")
  const [channelFilter, setChannelFilter] = useState("")
  const [branchFilter, setBranchFilter] = useState("")
  
  // Dropdown states
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showAoDropdown, setShowAoDropdown] = useState(false)
  const [showChannelDropdown, setShowChannelDropdown] = useState(false)
  const [showBranchDropdown, setShowBranchDropdown] = useState(false)

  // Function to close all other dropdowns
  const closeOtherDropdowns = useCallback((currentDropdown: string) => {
    if (currentDropdown !== 'date') setShowDatePicker(false)
    if (currentDropdown !== 'ao') setShowAoDropdown(false)
    if (currentDropdown !== 'channel') setShowChannelDropdown(false)
    if (currentDropdown !== 'branch') setShowBranchDropdown(false)
    
    // If 'none' is passed, close all dropdowns
    if (currentDropdown === 'none') {
      setShowDatePicker(false)
      setShowAoDropdown(false)
      setShowChannelDropdown(false)
      setShowBranchDropdown(false)
    }
  }, [])

  // Load data from Supabase database
  const loadCSVData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log("Laporan: Loading data from Supabase database...")
      
      // Get all work orders from database
      const result = await DatabaseService.getWorkOrders({
        limit: 10000, // Load up to 10,000 records
        offset: 0
      })
      
      if (result.success && result.data && result.data.length > 0) {
        // Define the specific columns we want to display
        const headers = [
          "AO", 
          "CHANNEL", 
          "DATE_CREATED", 
          "WORKORDER", 
          "HSA", 
          "BRANCH", 
          "UPDATE_LAPANGAN", 
          "SYMPTOM", 
          "TINJUT_HD_OPLANG", 
          "KATEGORI_MANJA", 
          "STATUS_BIMA"
        ]
        
        // Convert work orders to table format
        const rows = result.data.map(wo => [
          wo.ao || "",
          wo.channel || "",
          wo.date_created || "",
          wo.workorder || "",
          wo.hsa || "",
          wo.branch || "",
          wo.update_lapangan || "",
          wo.symptom || "",
          wo.tinjut_hd_oplang || "",
          wo.kategori_manja || "",
          wo.status_bima || ""
        ])
        
        const data = { headers, rows }
        
        console.log("Laporan: Data loaded successfully from Supabase", {
          headers: data.headers.length,
          rows: data.rows.length,
          totalCount: result.count || 0
        })
        
        setCsvData(data)
        setTotalCount(result.count || 0)
        
        // Apply initial filters
        if (data.rows.length > 0) {
          applyFiltersWithData(data)
        }
      } else {
        console.log("Laporan: No data found in Supabase database")
        setCsvData(null)
        setFilteredData(null)
        setTotalCount(0)
        if (result.error) {
          setError(`Failed to load data: ${result.error}`)
        } else {
          setError("No data available. Please upload CSV data first.")
        }
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
  }, [])

  // Apply filters with specific data
  const applyFiltersWithData = useCallback((data: FilteredData) => {
    console.log("Laporan: Applying filters to data", {
      totalRows: data.rows.length,
      filters: { aoFilter, channelFilter, dateFilter, branchFilter }
    })

    let filtered = data.rows

    // Apply AO filter
    if (aoFilter) {
      filtered = filtered.filter(row => 
        row[0]?.toLowerCase().includes(aoFilter.toLowerCase())
      )
    }

    // Apply Channel filter
    if (channelFilter) {
      filtered = filtered.filter(row => 
        row[1]?.toLowerCase().includes(channelFilter.toLowerCase())
      )
    }

    // Apply Date filter
    if (dateFilter) {
      filtered = filtered.filter(row => 
        row[2]?.toLowerCase().includes(dateFilter.toLowerCase())
      )
    }

    // Apply Branch filter
    if (branchFilter) {
      filtered = filtered.filter(row => 
        row[5]?.toLowerCase().includes(branchFilter.toLowerCase())
      )
    }

    console.log("Laporan: Filtered data", {
      originalRows: data.rows.length,
      filteredRows: filtered.length
    })

    setFilteredData({ headers: data.headers, rows: filtered })
    
    // Reset visible rows when filter changes
    setVisibleRows(50)
  }, [aoFilter, channelFilter, dateFilter, branchFilter])

  // Apply filters with memoization
  const applyFilters = useCallback(() => {
    if (!csvData) return
    applyFiltersWithData(csvData)
  }, [csvData, applyFiltersWithData])

  // Reset filters
  const resetFilters = useCallback(() => {
    setDateFilter("")
    setAoFilter("")
    setChannelFilter("")
    setBranchFilter("")
    if (csvData) {
      applyFiltersWithData(csvData)
    }
  }, [applyFiltersWithData])

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
    const handleDataUpdate = (e: CustomEvent) => {
      console.log("Laporan: Custom event 'csvDataUpdated' received", e)
      loadCSVData()
    }

    // Listen for window focus (when user returns to tab)
    const handleWindowFocus = () => {
      console.log("Laporan: Window focused, checking for data updates")
      loadCSVData()
    }

    // Listen for visibility change (when tab becomes visible)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Laporan: Tab became visible, checking for data updates")
        loadCSVData()
      }
    }

    // Add all event listeners
    window.addEventListener('csvDataUpdated', handleDataUpdate as EventListener)
    window.addEventListener('focus', handleWindowFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('csvDataUpdated', handleDataUpdate as EventListener)
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
    dateFilter,
    aoFilter,
    channelFilter,
    branchFilter,
    
    // Dropdown states
    showDatePicker,
    showAoDropdown,
    showChannelDropdown,
    showBranchDropdown,
    
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
