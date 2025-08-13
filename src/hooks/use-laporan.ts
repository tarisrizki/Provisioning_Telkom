import { useState, useCallback, useEffect } from "react"
import { 
  validateCSVStructure, 
  mapCSVToLaporan, 
  createColumnMapping, 
  verifyDataIntegrity, 
  generateDataIntegrityReport,
  readCSVDataFromStorage
} from "@/lib/utils"

interface CSVData {
  headers: string[]
  rows: string[][]
}

interface FilteredData {
  headers: string[]
  rows: string[][]
}

export function useLaporan() {
  const [csvData, setCsvData] = useState<CSVData | null>(null)
  const [filteredData, setFilteredData] = useState<FilteredData | null>(null)
  const [visibleRows, setVisibleRows] = useState<number>(50)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
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

  // Load CSV data from storage
  const loadCSVData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log("Laporan: Loading CSV data from storage...")
      
      // Use the new optimized storage function
      const data = await readCSVDataFromStorage()
      
      if (data) {
        console.log("Laporan: CSV data loaded successfully", {
          headers: data.headers.length,
          rows: data.rows.length
        })
        
        setCsvData(data)
        
        // Apply initial filters
        if (data.rows.length > 0) {
          applyFiltersWithData(data)
        }
      } else {
        console.log("Laporan: No CSV data found in storage")
        setCsvData(null)
        setFilteredData(null)
      }
    } catch (error) {
      console.error("Laporan: Failed to load CSV data:", error)
      setError("Failed to load CSV data. Please try uploading again.")
      setCsvData(null)
      setFilteredData(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Apply filters with memoization
  const applyFilters = useCallback(() => {
    if (!csvData) return
    applyFiltersWithData(csvData)
  }, [csvData])

  // Apply filters with specific data
  const applyFiltersWithData = useCallback((data: CSVData) => {
    console.log("Laporan: Applying filters to data", {
      totalRows: data.rows.length,
      filters: { aoFilter, channelFilter, dateFilter, branchFilter }
    })

    // Get column mapping for filtering
    const columnMapping = createColumnMapping(data.headers)
    console.log("Laporan: Column mapping for filtering", columnMapping)

    // Use more efficient filtering based on actual column indices
    const filtered = data.rows.filter(row => {
      // Early return for better performance
      if (aoFilter && columnMapping.aoIndex >= 0 && !row[columnMapping.aoIndex]?.toLowerCase().includes(aoFilter.toLowerCase())) return false
      if (channelFilter && columnMapping.channelIndex >= 0 && !row[columnMapping.channelIndex]?.toLowerCase().includes(channelFilter.toLowerCase())) return false
      if (dateFilter && columnMapping.dateIndex >= 0 && !row[columnMapping.dateIndex]?.toLowerCase().includes(dateFilter.toLowerCase())) return false
      if (branchFilter && columnMapping.branchIndex >= 0 && !row[columnMapping.branchIndex]?.toLowerCase().includes(branchFilter.toLowerCase())) return false
      return true
    })

    console.log("Laporan: Filtered data", {
      originalRows: data.rows.length,
      filteredRows: filtered.length
    })

    // Create filtered CSV data and map to laporan format
    const filteredCSVData = { headers: data.headers, rows: filtered }
    const laporanData = mapCSVToLaporan(filteredCSVData)

    console.log("Laporan: Mapped to laporan format", {
      headers: laporanData.headers.length,
      rows: laporanData.rows.length
    })

    setFilteredData(laporanData)
    
    // Reset visible rows when filter changes
    setVisibleRows(50)
  }, [aoFilter, channelFilter, dateFilter, branchFilter])

  // Reset filters
  const resetFilters = useCallback(() => {
    setDateFilter("")
    setAoFilter("")
    setChannelFilter("")
    setBranchFilter("")
    if (csvData) {
      applyFiltersWithData(csvData)
    }
  }, [csvData, applyFiltersWithData])

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

    // Listen for storage changes (when data is uploaded from another tab/page)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "uploadedCSVData" || e.key?.startsWith("uploadedCSVData_")) {
        console.log("Laporan: Storage change detected, reloading data")
        loadCSVData()
      }
    }

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
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('csvDataUpdated', handleDataUpdate as EventListener)
    window.addEventListener('focus', handleWindowFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
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
