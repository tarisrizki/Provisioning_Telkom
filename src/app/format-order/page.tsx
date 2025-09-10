"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Activity, BarChart3, RefreshCw, Database, Upload, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import * as XLSX from 'xlsx'
import { DetailModal } from "@/components/format-order/detail-modal"
import { EditableCell } from "@/components/format-order/editable-cell"
import { useTabData } from "@/hooks/use-format-order"
import { useAnalysisData } from "@/hooks/use-analysis-data"
import ProtectedRoute from "@/components/protected-route"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

import { FormatOrder } from "@/lib/supabase"

function FormatOrderContent() {
  const { isAdmin } = useAuth()
  const [selectedTab, setSelectedTab] = useState("Work Order")
  const [selectedFilter, setSelectedFilter] = useState("Oktober")
  const [selectedChannel, setSelectedChannel] = useState("Channel")
  const [selectedDateCreated, setSelectedDateCreated] = useState("Date created")
  
  const searchParams = useSearchParams()
  const openDetailParam = searchParams.get('openDetail')
  
  // Track if we've already processed the openDetail parameter
  const [hasProcessedOpenDetail, setHasProcessedOpenDetail] = useState(false)
  
  // Export states
  const [isExportingFiltered, setIsExportingFiltered] = useState(false)
  const [isExportingAll, setIsExportingAll] = useState(false)

  // Use Supabase hook to fetch data
  const {
    data: formatOrderData,
    tabData,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    refresh
  } = useTabData(selectedTab, {
    pageSize: 50,
    filters: {
      channel: selectedChannel !== "Channel" ? selectedChannel : undefined,
      dateCreated: selectedDateCreated !== "Date created" ? selectedDateCreated : undefined
    }
  })

  // Use analysis data for all statistics (fetches all data, not paginated)
  const {
    data: analysisData,
    getTopItems,
    getPercentageWidth
  } = useAnalysisData()

  // Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedOrderData, setSelectedOrderData] = useState<FormatOrder | null>(null)

  const tabs = ["Work Order", "Aktivasi", "Update lapangan", "MANJA"]
  const filters = ["Oktober", "November", "Desember", "Januari"]



  const getCurrentTabData = (): string[][] => {
    return tabData
  }

  const getCurrentTableHeaders = () => {
    switch (selectedTab) {
      case "Work Order":
        return ["Order ID", "Date Created", "Work Order", "Service NO", "Work Zone", "ODP", "Mitra", "Labor Teknisi"]
      case "Aktivasi":
        return ["Order ID", "Work Order", "Service NO", "Mitra", "UIC (SN)", "KET", "Status"]
      case "Update lapangan":
        return ["Order ID", "Update lapangan", "Symptom", "TINJUT HD OPLANG", "KET HD OPLANG", "Status BIMA"]
      case "MANJA":
        return ["Order ID", "Booking Date", "Kategori MANJA", "Umur MANJA", "Sisa MANJA"]
      default:
        return ["Order ID", "Date Created", "Work Order", "Service NO", "Work Zone", "ODP", "Mitra", "Labor Teknisi"]
    }
  }

  // Calculate MANJA analysis data from actual Supabase data
  const manjaAnalysisData = {
    totalAO: analysisData.totalAO,
    kategoriManja: {
      lewatManja: analysisData.manjaStats['Lewat MANJA'] || 0,
      manjaHPlus: analysisData.manjaStats['MANJA H+'] || 0,
      manjaHPlusPlus: analysisData.manjaStats['MANJA H++'] || 0,
      manjaHI: analysisData.manjaStats['MANJA HI'] || 0
    },
    umurManja: {
      umurLebih3Hari: analysisData.manjaStats['Lewat MANJA'] || 0
    }
  }

  // Function to open detail modal
  const openDetailModal = (orderData: FormatOrder) => {
    setSelectedOrderData(orderData)
    setIsDetailModalOpen(true)
  }

  // Function to close detail modal and clean URL
  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedOrderData(null)
    
    // Clean URL parameter when closing modal
    if (openDetailParam) {
      const url = new URL(window.location.href)
      url.searchParams.delete('openDetail')
      window.history.replaceState({}, '', url.toString())
      setHasProcessedOpenDetail(false)
    }
  }

  // Handle direct detail opening from URL parameter (only once per URL change)
  useEffect(() => {
    if (openDetailParam && !hasProcessedOpenDetail && formatOrderData.length > 0) {
      setHasProcessedOpenDetail(true)
      
      // Find the order by order_id
      const orderToOpen = formatOrderData.find(order => order.order_id === openDetailParam)
      if (orderToOpen) {
        openDetailModal(orderToOpen)
      } else {
        // If not found in current data, fetch specifically
        const fetchSpecificOrder = async () => {
          try {
            const { data, error } = await supabase
              .from('format_order')
              .select('*')
              .eq('order_id', openDetailParam)
              .single()
            
            if (!error && data) {
              openDetailModal(data as FormatOrder)
            }
          } catch (err) {
            console.error('Error fetching specific order:', err)
          }
        }
        fetchSpecificOrder()
      }
    }
    
    // Reset flag when openDetailParam changes or is removed
    if (!openDetailParam && hasProcessedOpenDetail) {
      setHasProcessedOpenDetail(false)
    }
  }, [openDetailParam, formatOrderData, hasProcessedOpenDetail])

  // Function to handle cell updates
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCellUpdate = (orderId: string, field: string, value: string) => {
    // Update local data state to reflect changes immediately
    refresh()
  }

  // Export functions
  const exportToExcel = (data: FormatOrder[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data to export!')
      return
    }

    // Get headers based on selected tab
    const headers = getCurrentTableHeaders()
    
    // Get Excel data based on tab
    let excelData: (string | number)[][]
    
    switch (selectedTab) {
      case "Work Order":
        excelData = data.map(item => [
          item.order_id,
          item.date_created || '-',
          item.workorder || '-',
          item.service_no || '-',
          item.workzone || '-',
          item.odp || '-',
          item.mitra || '-',
          item.labor_teknisi || '-'
        ])
        break
      case "Aktivasi":
        excelData = data.map(item => [
          item.order_id,
          item.workorder || '-',
          item.service_no || '-',
          item.mitra || '-',
          item.uic || '-',
          item.keterangan_uic || '-',
          item.status_bima || '-'
        ])
        break
      case "Update lapangan":
        excelData = data.map(item => [
          item.order_id,
          item.update_lapangan || '-',
          item.symptom || '-',
          item.tinjut_hd_oplang || '-',
          item.keterangan_hd_oplang || '-',
          item.status_bima || '-'
        ])
        break
      case "MANJA":
        excelData = data.map(item => [
          item.order_id,
          item.booking_date || '-',
          item.status_bima || '-', // kategori manja
          '-', // umur manja (calculated field)
          '-'  // sisa manja (calculated field)
        ])
        break
      default:
        excelData = data.map(item => [item.order_id, item.customer_name || '-', item.status_bima || '-'])
    }

    // Create workbook and worksheet
    const ws = XLSX.utils.aoa_to_sheet([headers, ...excelData])
    const wb = XLSX.utils.book_new()
    
    // Set column widths based on content
    const colWidths = headers.map(() => ({ wch: 20 }))
    ws['!cols'] = colWidths
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, selectedTab)
    
    // Write Excel file
    const excelFilename = filename.replace('.csv', '.xlsx')
    XLSX.writeFile(wb, excelFilename)
  }

  // Export filtered data (current tab + filters)
  const handleExportFiltered = async () => {
    setIsExportingFiltered(true)
    try {
      // Use current filtered data from the tab
      if (!formatOrderData || formatOrderData.length === 0) {
        alert('No filtered data to export!')
        return
      }
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')
      const filename = `format-order-${selectedTab.toLowerCase().replace(' ', '-')}-filtered-${timestamp}.xlsx`
      exportToExcel(formatOrderData, filename)
    } catch (error) {
      console.error('Export filtered error:', error)
      alert('Error exporting filtered data')
    } finally {
      setIsExportingFiltered(false)
    }
  }

  // Export all data from database (no filters, no pagination)
  const handleExportAll = async () => {
    setIsExportingAll(true)
    try {
      console.log('Fetching ALL data from database without any limits...')
      
      // Fetch ALL data from database without any filters or pagination
      const { data: allData, error } = await supabase
        .from('format_order')
        .select('*')
        .order('order_id')

      if (error) {
        console.error('Database error:', error)
        throw error
      }

      console.log('Total data fetched for export:', allData?.length || 0)

      if (!allData || allData.length === 0) {
        alert('No data to export!')
        return
      }

      // Create single comprehensive Excel sheet with all important columns
      const headers = [
        'Order ID', 'Channel', 'Date Created', 'Work Order', 'Service NO', 
        'Customer Name', 'Address', 'Work Zone', 'ODP', 'Mitra', 'Labor Teknisi',
        'SYMPTOM', 'TINJUT HD OPLANG', 'Keterangan HD OPLANG', 'UIC', 'Keterangan UIC',
        'Update Lapangan', 'Engineering MEMO', 'Status BIMA', 'Booking Date'
      ]
      
      const excelData = allData.map(item => [
        item.order_id || '-',
        item.channel || '-',
        item.date_created || '-',
        item.workorder || '-',
        item.service_no || '-',
        item.customer_name || '-',
        item.address || '-',
        item.workzone || '-',
        item.odp || '-',
        item.mitra || '-',
        item.labor_teknisi || '-',
        item.symptom || '-',
        item.tinjut_hd_oplang || '-',
        item.keterangan_hd_oplang || '-',
        item.uic || '-',
        item.keterangan_uic || '-',
        item.update_lapangan || '-',
        item.engineering_memo || '-',
        item.status_bima || '-',
        item.booking_date || '-'
      ])

      // Create workbook and worksheet
      const ws = XLSX.utils.aoa_to_sheet([headers, ...excelData])
      const wb = XLSX.utils.book_new()
      
      // Set column widths
      const colWidths = headers.map(() => ({ wch: 20 }))
      ws['!cols'] = colWidths
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'All Data')

      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')
      const filename = `format-order-all-data-${timestamp}.xlsx`
      XLSX.writeFile(wb, filename)
      
      console.log(`Successfully exported ${allData.length} records to ${filename}`)
    } catch (error) {
      console.error('Export all error:', error)
      alert('Error exporting all data')
    } finally {
      setIsExportingAll(false)
    }
  }

  // Status options for Aktivasi dropdown
  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Failed', label: 'Failed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ]

  const renderTableRow = (rowData: string[], index: number) => {
    const orderData = formatOrderData[index] as FormatOrder // Get full order data for modal
    
    // Special rendering for Aktivasi tab with editable cells
    if (selectedTab === "Aktivasi") {
      return (
        <tr 
          key={index} 
          className="border-b border-[#334155] hover:bg-[#334155]/30 transition-colors"
        >
          {/* Order ID - not editable, clickable for detail */}
          <td 
            className="px-6 py-4 text-sm text-gray-300 cursor-pointer hover:bg-[#334155]/50 font-medium"
            onClick={() => openDetailModal(orderData)}
            title="Click to view order details"
          >
            {rowData[0]}
          </td>
          {/* Work Order - editable, no click action */}
          <td className="px-6 py-4 text-sm bg-[#1e293b]/30">
            <EditableCell
              value={orderData.workorder || ''}
              orderId={orderData.order_id}
              field="workorder"
              type="text"
              isAdmin={isAdmin}
              onUpdate={handleCellUpdate}
            />
          </td>
          {/* Service NO - not editable, clickable for detail */}
          <td 
            className="px-6 py-4 text-sm text-gray-300 cursor-pointer hover:bg-[#334155]/50"
            onClick={() => openDetailModal(orderData)}
            title="Click to view order details"
          >
            {rowData[2] || '-'}
          </td>
          {/* Mitra - not editable, clickable for detail */}
          <td 
            className="px-6 py-4 text-sm text-gray-300 cursor-pointer hover:bg-[#334155]/50"
            onClick={() => openDetailModal(orderData)}
            title="Click to view order details"
          >
            {rowData[3] || '-'}
          </td>
          {/* UIC (SN) - editable, no click action */}
          <td className="px-6 py-4 text-sm bg-[#1e293b]/30">
            <EditableCell
              value={orderData.uic || ''}
              orderId={orderData.order_id}
              field="uic"
              type="text"
              isAdmin={isAdmin}
              onUpdate={handleCellUpdate}
            />
          </td>
          {/* KET - editable, no click action */}
          <td className="px-6 py-4 text-sm bg-[#1e293b]/30">
            <EditableCell
              value={orderData.keterangan_uic || ''}
              orderId={orderData.order_id}
              field="keterangan_uic"
              type="text"
              isAdmin={isAdmin}
              onUpdate={handleCellUpdate}
            />
          </td>
          {/* Status - editable, no click action */}
          <td className="px-6 py-4 text-sm bg-[#1e293b]/30">
            <EditableCell
              value={orderData.status_bima || ''}
              orderId={orderData.order_id}
              field="status_bima"
              type="select"
              options={statusOptions}
              isAdmin={isAdmin}
              onUpdate={handleCellUpdate}
            />
          </td>
        </tr>
      )
    }

    // Default rendering for other tabs
    return (
      <tr 
        key={index} 
        className="border-b border-[#334155] hover:bg-[#334155]/30 cursor-pointer transition-colors"
        onClick={() => openDetailModal(orderData)}
      >
        {rowData.map((cell, cellIndex) => (
          <td key={cellIndex} className="px-6 py-4 text-sm text-gray-300">
            {cell}
          </td>
        ))}
      </tr>
    )
  }

  const getTabIcon = (tabName: string) => {
    switch (tabName) {
      case "Work Order":
        return <FileText className="h-4 w-4" />
      case "Aktivasi":
        return <CheckCircle className="h-4 w-4" />
      case "Update lapangan":
        return <Activity className="h-4 w-4" />
      case "MANJA":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B2431] p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Format Order Management</h1>
            <p className="text-gray-400 text-lg">
              Loading your provisioning orders...
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#1B2431] p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Format Order Management</h1>
            <p className="text-gray-400 text-lg">
              Error loading data
            </p>
          </div>
          <Card className="bg-gradient-to-r from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardContent className="p-6 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={refresh} className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#1B2431] p-6">
        <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Format Order Management</h1>
          <p className="text-gray-400 text-lg">
            Manage and analyze your provisioning orders across different categories.
          </p>
          <div className="text-sm text-green-400">
            📊 Total records: {totalCount.toLocaleString()} • Page {currentPage} of {totalPages}
          </div>
        </div>
        {/* Export All Button */}
        <Button 
          onClick={handleExportAll}
          disabled={isExportingAll}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExportingAll ? 'Exporting...' : 'Export All Data'}
        </Button>
      </div>

        {/* Tabs Navigation */}
        <Card className="bg-gradient-to-r from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedTab === tab
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-[#1B2431] text-gray-300 hover:bg-[#334155] hover:text-white"
                  }`}
                >
                  {getTabIcon(tab)}
                  <span>{tab}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-gradient-to-r from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-4">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-[140px] bg-[#1B2431] border-[#475569] text-white hover:bg-[#1e293b] transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#475569]">
                    {filters.map((filter) => (
                      <SelectItem key={filter} value={filter} className="text-white hover:bg-[#334155] focus:bg-[#334155]">
                        {filter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                  <SelectTrigger className="w-[140px] bg-[#1B2431] border-[#475569] text-white hover:bg-[#1e293b] transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#475569]">
                    <SelectItem value="Channel" className="text-white hover:bg-[#334155] focus:bg-[#334155]">Channel</SelectItem>
                    <SelectItem value="DIGIPOS" className="text-white hover:bg-[#334155] focus:bg-[#334155]">DIGIPOS</SelectItem>
                    <SelectItem value="ATM" className="text-white hover:bg-[#334155] focus:bg-[#334155]">ATM</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDateCreated} onValueChange={setSelectedDateCreated}>
                  <SelectTrigger className="w-[160px] bg-[#1B2431] border-[#475569] text-white hover:bg-[#1e293b] transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#475569]">
                    <SelectItem value="Date created" className="text-white hover:bg-[#334155] focus:bg-[#334155]">Date created</SelectItem>
                    <SelectItem value="Today" className="text-white hover:bg-[#334155] focus:bg-[#334155]">Today</SelectItem>
                    <SelectItem value="This Week" className="text-white hover:bg-[#334155] focus:bg-[#334155]">This Week</SelectItem>
                    <SelectItem value="This Month" className="text-white hover:bg-[#334155] focus:bg-[#334155]">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                className="bg-[#1B2431] border-[#475569] text-white hover:bg-[#1e293b] hover:border-[#64748b] transition-all duration-200 shadow-md"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>

              <Button 
                onClick={handleExportFiltered}
                disabled={isExportingFiltered}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExportingFiltered ? 'Exporting...' : 'Export Filtered Data'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FileText className="h-5 w-5 text-green-400" />
              </div>
              <span className="text-xl font-semibold">{selectedTab} Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#475569]">
                    {getCurrentTableHeaders().map((header, index) => (
                      <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]">
                  {getCurrentTabData().length > 0 ? (
                    getCurrentTabData().map((item, index) => renderTableRow(item, index))
                  ) : (
                    <tr>
                      <td colSpan={getCurrentTableHeaders().length} className="px-6 py-8 text-center text-gray-400">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#475569]">
                <div className="text-sm text-gray-400">
                  Showing page {currentPage} of {totalPages} ({totalCount.toLocaleString()} total records)
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={previousPage}
                    disabled={!hasPreviousPage}
                    variant="outline"
                    size="sm"
                    className="border-[#475569] text-gray-300 hover:bg-[#334155] disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-400 px-3">
                    Page {currentPage}
                  </span>
                  <Button
                    onClick={nextPage}
                    disabled={!hasNextPage}
                    variant="outline"
                    size="sm"
                    className="border-[#475569] text-gray-300 hover:bg-[#334155] disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Section */}
        {selectedTab === "Work Order" && (
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-xl font-semibold">Analisis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total AO */}
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm font-medium">Total AO</span>
                  <span className="text-white font-semibold text-lg">{analysisData.totalAO.toLocaleString()}</span>
                </div>
              </div>

              {/* Channel Analysis */}
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Channel</span>
                  <span className="text-white font-semibold text-lg">{Object.values(analysisData.channelStats).reduce((a, b) => a + b, 0)}</span>
                </div>
                <div className="space-y-3">
                  {getTopItems(analysisData.channelStats, 5).map(([channel, count], index) => (
                    <div key={channel} className="relative">
                      <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                        <div 
                          className={`${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-blue-400' : 'bg-blue-300'} h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300`} 
                          style={{width: `${getPercentageWidth(count, analysisData.totalAO)}%`}}
                        >
                          <span className="text-white text-sm font-medium">{count}</span>
                        </div>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                          {channel}
                        </div>
                      </div>
                    </div>
                  ))}
                  {getTopItems(analysisData.channelStats).length === 0 && (
                    <div className="text-center text-gray-400 py-4">
                      No channel data available
                    </div>
                  )}
                </div>
              </div>

              {/* Work Zone Analysis */}
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Work Zone</span>
                  <span className="text-white font-semibold text-lg">{Object.values(analysisData.serviceAreaStats).reduce((a, b) => a + b, 0)}</span>
                </div>
                <div className="space-y-3">
                  {getTopItems(analysisData.serviceAreaStats, 5).map(([serviceArea, count], index) => (
                    <div key={serviceArea} className="relative">
                      <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                        <div 
                          className={`${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-blue-400' : 'bg-blue-300'} h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300`} 
                          style={{width: `${getPercentageWidth(count, analysisData.totalAO)}%`}}
                        >
                          <span className="text-white text-sm font-medium">{count}</span>
                        </div>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                          {serviceArea}
                        </div>
                      </div>
                    </div>
                  ))}
                  {getTopItems(analysisData.serviceAreaStats).length === 0 && (
                    <div className="text-center text-gray-400 py-4">
                      No service area data available
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Section for Aktivasi */}
        {selectedTab === "Aktivasi" && (
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-xl font-semibold">Analisis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total AO */}
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm font-medium">Total AO</span>
                  <span className="text-white font-semibold text-lg">10,069</span>
                </div>
              </div>

              {/* Status Analysis */}
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Status</span>
                  <span className="text-white font-semibold text-lg">10,069</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '28%'}}>
                        <span className="text-white text-sm font-medium">28</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        COMPLETE
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '30%'}}>
                        <span className="text-white text-sm font-medium">30</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        FO ACT - ONT MATILOSS
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '26%'}}>
                        <span className="text-white text-sm font-medium">26</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        FO DATA BELUM PI - PUSH DAMAN
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-300 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '26%'}}>
                        <span className="text-white text-sm font-medium">26</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        RET BLM START - PUSH OPEN ONT
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-300 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '28%'}}>
                        <span className="text-white text-sm font-medium">28</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        INPUT ULANG
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-300 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '22%'}}>
                        <span className="text-white text-sm font-medium">22</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        PUSH SYAP - ACT IOMP
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-200 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '38%'}}>
                        <span className="text-slate-800 text-sm font-medium">38</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        PUSH EVGAP - CG
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-200 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: '26%'}}>
                        <span className="text-slate-800 text-sm font-medium">26</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        WAIT CLOSE TEKHISH
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}




        {selectedTab === "Update lapangan" && (
          <Card className="bg-gradient-to-br from-[#1e293b] via-[#2d3748] to-[#334155] border-[#475569] shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl border border-purple-500/20">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Analisis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Grid Layout for Analysis Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Total AO and Update Lapangan */}
                <div className="space-y-6">
                  {/* Total AO */}
                  <div className="bg-gradient-to-br from-[#1B2431] to-[#1a202c] rounded-xl p-6 border border-[#475569] shadow-inner">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/20">
                        <Database className="h-6 w-6 text-blue-400" />
                      </div>
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Total AO</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-base font-medium">Total AO</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-bold text-2xl">{analysisData.totalAO.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Update Lapangan */}
                  <div className="bg-gradient-to-br from-[#1B2431] to-[#1a202c] rounded-xl p-6 border border-[#475569] shadow-inner">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-500/20">
                        <Upload className="h-6 w-6 text-green-400" />
                      </div>
                      <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">Update Lapangan</span>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-gray-300 text-base font-medium">Progress Update</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-bold text-2xl">{Object.values(analysisData.updateLapanganStats).reduce((a, b) => a + b, 0)}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {getTopItems(analysisData.updateLapanganStats, 5).map(([updateLapangan, count], index) => (
                        <div key={updateLapangan} className="relative group">
                          <div className="w-full bg-gradient-to-r from-[#1e293b] to-[#2d3748] rounded-xl h-10 relative overflow-hidden border border-[#475569] shadow-inner">
                            <div 
                              className={`bg-gradient-to-r ${index === 0 ? 'from-green-500 to-green-400' : index === 1 ? 'from-green-400 to-green-300' : 'from-green-300 to-green-200'} h-10 rounded-xl absolute left-0 top-0 flex items-center justify-start pl-4 transition-all duration-500 shadow-lg`} 
                              style={{width: `${getPercentageWidth(count, analysisData.totalAO)}%`}}
                            >
                              <span className="text-white text-sm font-bold">{count}</span>
                            </div>
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-semibold">
                              {updateLapangan.length > 15 ? `${updateLapangan.substring(0, 15)}...` : updateLapangan}
                            </div>
                          </div>
                        </div>
                      ))}
                      {getTopItems(analysisData.updateLapanganStats).length === 0 && (
                        <div className="text-center text-gray-400 py-4">
                          No update lapangan data available
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Status BIMA */}
                <div>
                  <div className="bg-gradient-to-br from-[#1B2431] to-[#1a202c] rounded-xl p-6 border border-[#475569] shadow-inner h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl border border-yellow-500/20">
                        <CheckCircle className="h-6 w-6 text-yellow-400" />
                      </div>
                      <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">Status BIMA</span>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-gray-300 text-base font-medium">Status Overview</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-bold text-2xl">{Object.values(analysisData.statusBimaStats).reduce((a, b) => a + b, 0)}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {getTopItems(analysisData.statusBimaStats, 5).map(([status, count]) => {
                        const getStatusColor = (status: string) => {
                          const statusUpper = status.toUpperCase()
                          if (statusUpper.includes('COMPLETE') || statusUpper.includes('SUCCESS')) {
                            return 'from-green-600 to-green-500'
                          } else if (statusUpper.includes('FAIL') || statusUpper.includes('ERROR')) {
                            return 'from-red-600 to-red-500'
                          } else if (statusUpper.includes('CANCEL')) {
                            return 'from-yellow-600 to-yellow-500'
                          } else if (statusUpper.includes('PROGRESS') || statusUpper.includes('PENDING')) {
                            return 'from-blue-600 to-blue-500'
                          } else {
                            return 'from-gray-600 to-gray-500'
                          }
                        }
                        
                        const getBorderColor = (status: string) => {
                          const statusUpper = status.toUpperCase()
                          if (statusUpper.includes('COMPLETE') || statusUpper.includes('SUCCESS')) {
                            return 'hover:border-green-500/30'
                          } else if (statusUpper.includes('FAIL') || statusUpper.includes('ERROR')) {
                            return 'hover:border-red-500/30'
                          } else if (statusUpper.includes('CANCEL')) {
                            return 'hover:border-yellow-500/30'
                          } else if (statusUpper.includes('PROGRESS') || statusUpper.includes('PENDING')) {
                            return 'hover:border-blue-500/30'
                          } else {
                            return 'hover:border-gray-500/30'
                          }
                        }
                        
                        return (
                          <div key={status} className={`flex items-center justify-between p-3 bg-gradient-to-r from-[#1a2332] to-[#2d3748] rounded-lg border border-[#475569] ${getBorderColor(status)} transition-all duration-300`}>
                            <div className={`bg-gradient-to-r ${getStatusColor(status)} px-4 py-2 rounded-lg text-white text-sm font-bold shadow-lg transition-all duration-300`}>
                              {status}
                            </div>
                            <span className="text-white font-bold text-xl">{count}</span>
                          </div>
                        )
                      })}
                      {getTopItems(analysisData.statusBimaStats).length === 0 && (
                        <div className="text-center text-gray-400 py-4">
                          No status BIMA data available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Symptom */}
              <div className="bg-gradient-to-br from-[#1B2431] to-[#1a202c] rounded-xl p-6 border border-[#475569] shadow-inner">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Activity className="h-5 w-5 text-blue-400" />
                    </div>
                    <span className="text-gray-300 text-lg font-semibold">Symptom</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-bold text-xl">{Object.values(analysisData.symptomStats).reduce((a, b) => a + b, 0)}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="w-full bg-gradient-to-r from-[#1e293b] to-[#2d3748] rounded-xl h-10 relative overflow-hidden border border-[#475569] shadow-inner">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-10 rounded-xl absolute left-0 top-0 flex items-center justify-start pl-4 transition-all duration-500 hover:from-blue-400 hover:to-blue-300 shadow-lg" style={{width: '26%'}}>
                        <span className="text-white text-sm font-bold">0</span>
                      </div>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <span className="text-white text-sm font-bold">RO</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="w-full bg-gradient-to-r from-[#1e293b] to-[#2d3748] rounded-xl h-10 relative overflow-hidden border border-[#475569] shadow-inner">
                      <div className="bg-gradient-to-r from-blue-400 to-blue-300 h-10 rounded-xl absolute left-0 top-0 flex items-center justify-start pl-4 transition-all duration-500 hover:from-blue-300 hover:to-blue-200 shadow-lg" style={{width: '26%'}}>
                        <span className="text-white text-sm font-bold">0</span>
                      </div>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-semibold">
                        MRO
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="w-full bg-gradient-to-r from-[#1e293b] to-[#2d3748] rounded-xl h-10 relative overflow-hidden border border-[#475569] shadow-inner">
                      <div className="bg-gradient-to-r from-blue-300 to-blue-200 h-10 rounded-xl absolute left-0 top-0 flex items-center justify-start pl-4 transition-all duration-500 hover:from-blue-200 hover:to-blue-100 shadow-lg" style={{width: '0%'}}>
                        <span className="text-slate-800 text-sm font-bold">85</span>
                      </div>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-semibold">
                        LPS
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tindak Lanjut HD OPLANG */}
              <div className="bg-gradient-to-br from-[#1B2431] to-[#1a202c] rounded-xl p-6 border border-[#475569] shadow-inner">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                      <FileText className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span className="text-gray-300 text-lg font-semibold">Tindak Lanjut HD OPLANG</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-bold text-xl">{Object.values(analysisData.tinjutStats).reduce((a, b) => a + b, 0)}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {getTopItems(analysisData.tinjutStats, 5).map(([tinjut, count], index) => (
                    <div key={tinjut} className="relative group">
                      <div className="w-full bg-gradient-to-r from-[#1e293b] to-[#2d3748] rounded-xl h-10 relative overflow-hidden border border-[#475569] shadow-inner">
                        <div 
                          className={`bg-gradient-to-r ${index === 0 ? 'from-indigo-500 to-indigo-400' : index === 1 ? 'from-indigo-400 to-indigo-300' : 'from-indigo-300 to-indigo-200'} h-10 rounded-xl absolute left-0 top-0 flex items-center justify-start pl-4 transition-all duration-500 shadow-lg`} 
                          style={{width: `${getPercentageWidth(count, analysisData.totalAO)}%`}}
                        >
                          <span className={`${index === 2 ? 'text-slate-800' : 'text-white'} text-sm font-bold`}>{count}</span>
                        </div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-semibold">
                          {tinjut.length > 15 ? `${tinjut.substring(0, 15)}...` : tinjut}
                        </div>
                      </div>
                    </div>
                  ))}
                  {getTopItems(analysisData.tinjutStats).length === 0 && (
                    <div className="text-center text-gray-400 py-4">
                      No tindak lanjut HD OPLANG data available
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === "MANJA" && (
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-xl font-semibold">Analisis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total AO */}
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm font-medium">Total AO</span>
                  <span className="text-white font-semibold text-lg">{manjaAnalysisData.totalAO.toLocaleString()}</span>
                </div>
              </div>

              {/* Kategori MANJA */}
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Kategori MANJA</span>
                  <span className="text-white font-semibold text-lg">0</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: `${Math.min((manjaAnalysisData.kategoriManja.lewatManja/100)*100, 100)}%`}}>
                        <span className="text-white text-sm font-medium">{manjaAnalysisData.kategoriManja.lewatManja}</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        Lewat MANJA
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: `${Math.min((manjaAnalysisData.kategoriManja.manjaHPlus/100)*100, 100)}%`}}>
                        <span className="text-white text-sm font-medium">{manjaAnalysisData.kategoriManja.manjaHPlus}</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        MANJA H+
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-400 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: `${Math.min((manjaAnalysisData.kategoriManja.manjaHPlusPlus/100)*100, 100)}%`}}>
                        <span className="text-white text-sm font-medium">{manjaAnalysisData.kategoriManja.manjaHPlusPlus}</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        MANJA H++
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-200 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: `${Math.min((manjaAnalysisData.kategoriManja.manjaHI/100)*100, 100)}%`}}>
                        <span className="text-white text-sm font-medium">{manjaAnalysisData.kategoriManja.manjaHI}</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        MANJA HI
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Umur MANJA */}
              <div className="bg-[#1B2431] rounded-lg p-4 border border-[#475569]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">Umur MANJA</span>
                  <span className="text-white font-semibold text-lg">0</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="w-full bg-[#1e293b] rounded-lg h-8 relative overflow-hidden border border-[#475569]">
                      <div className="bg-blue-500 h-8 rounded-lg absolute left-0 top-0 flex items-center justify-start pl-3 transition-all duration-300" style={{width: `${Math.min((manjaAnalysisData.umurManja.umurLebih3Hari/100)*100, 100)}%`}}>
                        <span className="text-white text-sm font-medium">{manjaAnalysisData.umurManja.umurLebih3Hari}</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm font-medium">
                        Umur &gt; 3 hari
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detail Modal */}
        <DetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          orderData={selectedOrderData}
        />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default function FormatOrderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormatOrderContent />
    </Suspense>
  )
}