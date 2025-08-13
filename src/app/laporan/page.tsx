"use client"

import { useState, useEffect, useCallback } from "react"
import { Filter, RefreshCw, Database, Download, ChevronDown, Calendar } from "lucide-react"

interface TableData {
  headers: string[]
  rows: string[][]
}

export default function LaporanPage() {
  const [csvData, setCsvData] = useState<TableData | null>(null)
  const [filteredData, setFilteredData] = useState<TableData | null>(null)
  
  // Filter states
  const [dateFilter, setDateFilter] = useState("")
  const [aoFilter, setAoFilter] = useState("")
  const [channelFilter, setChannelFilter] = useState("")
  const [branchFilter, setBranchFilter] = useState("")
  
  // Filter dropdown states
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showAoDropdown, setShowAoDropdown] = useState(false)
  const [showChannelDropdown, setShowChannelDropdown] = useState(false)
  const [showBranchDropdown, setShowBranchDropdown] = useState(false)
  
  // Virtual scrolling state
  const [visibleRows, setVisibleRows] = useState<number>(50)
  const [scrollPosition, setScrollPosition] = useState<number>(0)

  // Function to close all other dropdowns
  const closeOtherDropdowns = (currentDropdown: string) => {
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
  }

  // Get data from localStorage (from upload page)
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("uploadedCSVData")
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setCsvData(parsedData)
        
        // Find column indices based on actual CSV headers with more specific matching
        const findColumnIndex = (headerName: string, alternatives: string[] = []) => {
          const searchTerms = [headerName, ...alternatives]
          return parsedData.headers.findIndex((header: string) => 
            searchTerms.some(term => 
              header.toLowerCase().includes(term.toLowerCase())
            )
          )
        }

        // Try multiple approaches for each column
        let aoIndex = findColumnIndex("ao", ["ad"])
        if (aoIndex === -1) aoIndex = findColumnIndex("ad")
        
        let channelIndex = findColumnIndex("channel")
        
        let dateIndex = findColumnIndex("date", ["created", "tanggal"])
        if (dateIndex === -1) dateIndex = findColumnIndex("created")
        if (dateIndex === -1) dateIndex = findColumnIndex("tanggal")
        
        let workOrderIndex = findColumnIndex("work order", ["wo", "workorder"])
        if (workOrderIndex === -1) workOrderIndex = findColumnIndex("wo")
        if (workOrderIndex === -1) workOrderIndex = findColumnIndex("workorder")
        
        let hsaIndex = findColumnIndex("hsa")
        
        let branchIndex = findColumnIndex("branch")
        
        let updateLapanganIndex = findColumnIndex("update lapangan", ["update", "lapangan"])
        if (updateLapanganIndex === -1) updateLapanganIndex = findColumnIndex("update")
        if (updateLapanganIndex === -1) updateLapanganIndex = findColumnIndex("lapangan")
        
        let symptomIndex = findColumnIndex("symptom")
        
        let tinjutIndex = findColumnIndex("tinjut", ["hd oplang"])
        if (tinjutIndex === -1) tinjutIndex = findColumnIndex("hd oplang")
        if (tinjutIndex === -1) tinjutIndex = findColumnIndex("tinjut hd")
        
        let kategoriIndex = findColumnIndex("kategori", ["manja", "mania"])
        if (kategoriIndex === -1) kategoriIndex = findColumnIndex("manja")
        if (kategoriIndex === -1) kategoriIndex = findColumnIndex("mania")
        
        let statusIndex = findColumnIndex("status", ["bima"])
        if (statusIndex === -1) statusIndex = findColumnIndex("bima")

        // Fallback to default indices if not found (for backward compatibility)
        if (aoIndex === -1) aoIndex = 0
        if (channelIndex === -1) channelIndex = 1
        if (dateIndex === -1) dateIndex = 2
        if (workOrderIndex === -1) workOrderIndex = 3
        if (hsaIndex === -1) hsaIndex = 4
        if (branchIndex === -1) branchIndex = 5
        if (updateLapanganIndex === -1) updateLapanganIndex = 6
        if (symptomIndex === -1) symptomIndex = 7
        if (tinjutIndex === -1) tinjutIndex = 8
        if (kategoriIndex === -1) kategoriIndex = 9
        if (statusIndex === -1) statusIndex = 10

        // Debug log untuk melihat column mapping
        console.log("=== CSV COLUMN MAPPING DEBUG ===")
        console.log("CSV Headers:", parsedData.headers)
        console.log("Column Mapping:", {
          ao: aoIndex >= 0 ? `${aoIndex} (${parsedData.headers[aoIndex]})` : "NOT FOUND",
          channel: channelIndex >= 0 ? `${channelIndex} (${parsedData.headers[channelIndex]})` : "NOT FOUND",
          date: dateIndex >= 0 ? `${dateIndex} (${parsedData.headers[dateIndex]})` : "NOT FOUND",
          workOrder: workOrderIndex >= 0 ? `${workOrderIndex} (${parsedData.headers[workOrderIndex]})` : "NOT FOUND",
          hsa: hsaIndex >= 0 ? `${hsaIndex} (${parsedData.headers[hsaIndex]})` : "NOT FOUND",
          branch: branchIndex >= 0 ? `${branchIndex} (${parsedData.headers[branchIndex]})` : "NOT FOUND",
          updateLapangan: updateLapanganIndex >= 0 ? `${updateLapanganIndex} (${parsedData.headers[updateLapanganIndex]})` : "NOT FOUND",
          symptom: symptomIndex >= 0 ? `${symptomIndex} (${parsedData.headers[symptomIndex]})` : "NOT FOUND",
          tinjut: tinjutIndex >= 0 ? `${tinjutIndex} (${parsedData.headers[tinjutIndex]})` : "NOT FOUND",
          kategori: kategoriIndex >= 0 ? `${kategoriIndex} (${parsedData.headers[kategoriIndex]})` : "NOT FOUND",
          status: statusIndex >= 0 ? `${statusIndex} (${parsedData.headers[statusIndex]})` : "NOT FOUND"
        })
        
        // Show sample data for verification
        if (parsedData.rows.length > 0) {
          console.log("Sample Row Data:", parsedData.rows[0])
          console.log("Mapped Row Data:", [
            aoIndex >= 0 ? parsedData.rows[0][aoIndex] : "",
            channelIndex >= 0 ? parsedData.rows[0][channelIndex] : "",
            dateIndex >= 0 ? parsedData.rows[0][dateIndex] : "",
            workOrderIndex >= 0 ? parsedData.rows[0][workOrderIndex] : "",
            hsaIndex >= 0 ? parsedData.rows[0][hsaIndex] : "",
            branchIndex >= 0 ? parsedData.rows[0][branchIndex] : "",
            updateLapanganIndex >= 0 ? parsedData.rows[0][updateLapanganIndex] : "",
            symptomIndex >= 0 ? parsedData.rows[0][symptomIndex] : "",
            tinjutIndex >= 0 ? parsedData.rows[0][tinjutIndex] : "",
            kategoriIndex >= 0 ? parsedData.rows[0][kategoriIndex] : "",
            statusIndex >= 0 ? parsedData.rows[0][statusIndex] : ""
          ])
        }
        console.log("=== END DEBUG ===")

        // Map to specific columns for laporan using actual CSV headers
        const laporanHeaders = [
          "AO", "Channel", "Date Created", "Work Order", "HSA", "Branch", 
          "Update Lapangan", "Symptom", "Tinjut HD Oplang", "Kategori MANJA", "Status BIMA"
        ]

        const laporanRows = parsedData.rows.map((row: string[]) => [
          aoIndex >= 0 ? row[aoIndex] || "" : "",
          channelIndex >= 0 ? row[channelIndex] || "" : "",
          dateIndex >= 0 ? row[dateIndex] || "" : "",
          workOrderIndex >= 0 ? row[workOrderIndex] || "" : "",
          hsaIndex >= 0 ? row[hsaIndex] || "" : "",
          branchIndex >= 0 ? row[branchIndex] || "" : "",
          updateLapanganIndex >= 0 ? row[updateLapanganIndex] || "" : "",
          symptomIndex >= 0 ? row[symptomIndex] || "" : "",
          tinjutIndex >= 0 ? row[tinjutIndex] || "" : "",
          kategoriIndex >= 0 ? row[kategoriIndex] || "" : "",
          statusIndex >= 0 ? row[statusIndex] || "" : ""
        ])

        setFilteredData({
          headers: laporanHeaders,
          rows: laporanRows
        })
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error)
      // Clear corrupted data
      localStorage.removeItem("uploadedCSVData")
    }
  }, [])

  // Apply filters with memoization
  const applyFilters = useCallback(() => {
    if (!csvData) return

    // Find column indices based on actual CSV headers with more specific matching
    const findColumnIndex = (headerName: string, alternatives: string[] = []) => {
      const searchTerms = [headerName, ...alternatives]
      return csvData.headers.findIndex(header => 
        searchTerms.some(term => 
          header.toLowerCase().includes(term.toLowerCase())
        )
      )
    }

    // Try multiple approaches for each column
    let aoIndex = findColumnIndex("ao", ["ad"])
    if (aoIndex === -1) aoIndex = findColumnIndex("ad")
    
    let channelIndex = findColumnIndex("channel")
    
    let dateIndex = findColumnIndex("date", ["created", "tanggal"])
    if (dateIndex === -1) dateIndex = findColumnIndex("created")
    if (dateIndex === -1) dateIndex = findColumnIndex("tanggal")
    
    let workOrderIndex = findColumnIndex("work order", ["wo", "workorder"])
    if (workOrderIndex === -1) workOrderIndex = findColumnIndex("wo")
    if (workOrderIndex === -1) workOrderIndex = findColumnIndex("workorder")
    
    let hsaIndex = findColumnIndex("hsa")
    
    let branchIndex = findColumnIndex("branch")
    
    let updateLapanganIndex = findColumnIndex("update lapangan", ["update", "lapangan"])
    if (updateLapanganIndex === -1) updateLapanganIndex = findColumnIndex("update")
    if (updateLapanganIndex === -1) updateLapanganIndex = findColumnIndex("lapangan")
    
    let symptomIndex = findColumnIndex("symptom")
    
    let tinjutIndex = findColumnIndex("tinjut", ["hd oplang"])
    if (tinjutIndex === -1) tinjutIndex = findColumnIndex("hd oplang")
    if (tinjutIndex === -1) tinjutIndex = findColumnIndex("tinjut hd")
    
    let kategoriIndex = findColumnIndex("kategori", ["manja", "mania"])
    if (kategoriIndex === -1) kategoriIndex = findColumnIndex("manja")
    if (kategoriIndex === -1) kategoriIndex = findColumnIndex("mania")
    
    let statusIndex = findColumnIndex("status", ["bima"])
    if (statusIndex === -1) statusIndex = findColumnIndex("bima")

    // Fallback to default indices if not found (for backward compatibility)
    if (aoIndex === -1) aoIndex = 0
    if (channelIndex === -1) channelIndex = 1
    if (dateIndex === -1) dateIndex = 2
    if (workOrderIndex === -1) workOrderIndex = 3
    if (hsaIndex === -1) hsaIndex = 4
    if (branchIndex === -1) branchIndex = 5
    if (updateLapanganIndex === -1) updateLapanganIndex = 6
    if (symptomIndex === -1) symptomIndex = 7
    if (tinjutIndex === -1) tinjutIndex = 8
    if (kategoriIndex === -1) kategoriIndex = 9
    if (statusIndex === -1) statusIndex = 10

    // Debug log untuk filter mapping
    console.log("=== FILTER COLUMN MAPPING DEBUG ===")
    console.log("Filter Column Mapping:", {
      ao: aoIndex >= 0 ? `${aoIndex} (${csvData.headers[aoIndex]})` : "NOT FOUND",
      channel: channelIndex >= 0 ? `${channelIndex} (${csvData.headers[channelIndex]})` : "NOT FOUND",
      date: dateIndex >= 0 ? `${dateIndex} (${csvData.headers[dateIndex]})` : "NOT FOUND",
      branch: branchIndex >= 0 ? `${branchIndex} (${csvData.headers[branchIndex]})` : "NOT FOUND"
    })
    console.log("=== END FILTER DEBUG ===")

    // Use more efficient filtering based on actual column indices
    const filtered = csvData.rows.filter(row => {
      // Early return for better performance
      if (aoFilter && aoIndex >= 0 && !row[aoIndex]?.includes(aoFilter)) return false
      if (channelFilter && channelIndex >= 0 && !row[channelIndex]?.includes(channelFilter)) return false
      if (dateFilter && dateIndex >= 0 && !row[dateIndex]?.includes(dateFilter)) return false
      if (branchFilter && branchIndex >= 0 && !row[branchIndex]?.includes(branchFilter)) return false
      return true
    })

    // Map to specific columns for laporan using actual CSV headers
    const laporanHeaders = [
      "AO", "Channel", "Date Created", "Work Order", "HSA", "Branch", 
      "Update Lapangan", "Symptom", "Tinjut HD Oplang", "Kategori MANJA", "Status BIMA"
    ]

    const laporanRows = filtered.map(row => [
      aoIndex >= 0 ? row[aoIndex] || "" : "",
      channelIndex >= 0 ? row[channelIndex] || "" : "",
      dateIndex >= 0 ? row[dateIndex] || "" : "",
      workOrderIndex >= 0 ? row[workOrderIndex] || "" : "",
      hsaIndex >= 0 ? row[hsaIndex] || "" : "",
      branchIndex >= 0 ? row[branchIndex] || "" : "",
      updateLapanganIndex >= 0 ? row[updateLapanganIndex] || "" : "",
      symptomIndex >= 0 ? row[symptomIndex] || "" : "",
      tinjutIndex >= 0 ? row[tinjutIndex] || "" : "",
      kategoriIndex >= 0 ? row[kategoriIndex] || "" : "",
      statusIndex >= 0 ? row[statusIndex] || "" : ""
    ])

    setFilteredData({
      headers: laporanHeaders,
      rows: laporanRows
    })
    
    // Reset visible rows when filter changes
    setVisibleRows(50)
  }, [csvData, aoFilter, channelFilter, dateFilter, branchFilter])

  // Reset filters
  const resetFilters = () => {
    setDateFilter("")
    setAoFilter("")
    setChannelFilter("")
    setBranchFilter("")
    if (csvData) {
      setFilteredData(csvData)
    }
  }

  // Apply filters when filter values change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.filter-dropdown')) {
        closeOtherDropdowns('none')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentData = filteredData || { headers: [], rows: [] }

  // Handle infinite scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    setScrollPosition(scrollTop)
    
    // Load more rows when near bottom
    if (scrollHeight - scrollTop - clientHeight < 100) {
      setVisibleRows(prev => Math.min(prev + 50, currentData.rows.length))
    }
  }, [currentData.rows.length])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Laporan</h1>
        <p className="text-gray-400">
          View and manage your provisioning reports and data analysis.
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Filter By:</span>
              </div>
              
              {/* Date Filter Button */}
              <div className="relative filter-dropdown">
                <button
                  onClick={() => {
                    closeOtherDropdowns('date')
                    setShowDatePicker(!showDatePicker)
                  }}
                  className="px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white text-sm flex items-center space-x-2 hover:bg-[#334155] transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  <span>{dateFilter || "Date"}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1e293b] border border-[#334155] rounded-lg p-4 z-50 min-w-[280px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-medium">February 2019</h3>
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-[#334155] rounded">
                          <ChevronDown className="h-4 w-4 text-gray-400 rotate-90" />
                        </button>
                        <button className="p-1 hover:bg-[#334155] rounded">
                          <ChevronDown className="h-4 w-4 text-gray-400 -rotate-90" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                        <div key={`day-header-${index}`} className="text-center text-xs text-gray-400 py-1">
                          {day}
                        </div>
                      ))}
                      {/* Calendar days - simplified for demo */}
                      {Array.from({length: 35}, (_, i) => (
                        <button
                          key={`day-${i}`}
                          className="text-center text-sm text-gray-300 py-1 hover:bg-[#334155] rounded"
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      *You can choose multiple date
                    </div>
                    
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                )}
              </div>
              
              {/* AO Filter Button */}
              <div className="relative filter-dropdown">
                <button
                  onClick={() => {
                    closeOtherDropdowns('ao')
                    setShowAoDropdown(!showAoDropdown)
                  }}
                  className="px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white text-sm flex items-center space-x-2 hover:bg-[#334155] transition-colors"
                >
                  <span>{aoFilter || "AO"}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showAoDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1e293b] border border-[#334155] rounded-lg p-2 z-50 min-w-[150px]">
                    {["All AO", "AO00001", "AO00002"].map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          setAoFilter(option)
                          setShowAoDropdown(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#334155] rounded transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Channel Filter Button */}
              <div className="relative filter-dropdown">
                <button
                  onClick={() => {
                    closeOtherDropdowns('channel')
                    setShowChannelDropdown(!showChannelDropdown)
                  }}
                  className="px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white text-sm flex items-center space-x-2 hover:bg-[#334155] transition-colors"
                >
                  <span>{channelFilter || "Channel"}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showChannelDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1e293b] border border-[#334155] rounded-lg p-2 z-50 min-w-[150px]">
                    {["DIGIPOS", "ORBIT"].map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          setChannelFilter(option)
                          setShowChannelDropdown(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#334155] rounded transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Branch Filter Button */}
              <div className="relative filter-dropdown">
                <button
                  onClick={() => {
                    closeOtherDropdowns('branch')
                    setShowBranchDropdown(!showBranchDropdown)
                  }}
                  className="px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white text-sm flex items-center space-x-2 hover:bg-[#334155] transition-colors"
                >
                  <span>{branchFilter || "Branch"}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showBranchDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1e293b] border border-[#334155] rounded-lg p-2 z-50 min-w-[150px]">
                    {["BINJAI", "MEDAN", "LANGSA"].map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          setBranchFilter(option)
                          setShowBranchDropdown(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#334155] rounded transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={resetFilters}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset Filter</span>
            </button>
            
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Sync Database</span>
            </button>
            
            <button className="px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg overflow-hidden">

        {/* Table Content */}
        <div 
          className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb scrollbar-track"
          onScroll={handleScroll}
        >
          <table className="min-w-full divide-y divide-[#334155]">
                              <thead className="bg-[#0f172a] sticky top-0 z-10">
                    <tr>
                      {currentData.headers.map((header, index) => (
                        <th
                          key={index}
                          className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap bg-[#0f172a] min-w-[150px] ${
                            index === 0 ? 'sticky left-0 z-20 bg-[#0f172a] shadow-lg' : ''
                          }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-[#1e293b] divide-y divide-[#334155]">
                    {currentData.rows.slice(0, visibleRows).map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-[#334155] transition-colors">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`px-6 py-4 text-sm text-gray-300 whitespace-nowrap min-w-[150px] ${
                              cellIndex === 0 ? 'sticky left-0 z-20 bg-[#1e293b] shadow-lg' : ''
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {visibleRows < currentData.rows.length && (
                      <tr>
                        <td colSpan={currentData.headers.length} className="px-6 py-4 text-center text-gray-400">
                          Loading more data...
                        </td>
                      </tr>
                    )}
                  </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
