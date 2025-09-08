"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Activity, BarChart3, RefreshCw, Database, Upload, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { DetailModal } from "@/components/format-order/detail-modal"
import { useTabData } from "@/hooks/use-format-order"
import { useAnalysisData } from "@/hooks/use-analysis-data"

import { FormatOrder } from "@/lib/supabase"

export default function FormatOrderPage() {
  const [selectedTab, setSelectedTab] = useState("Work Order")
  const [selectedFilter, setSelectedFilter] = useState("Oktober")
  const [selectedChannel, setSelectedChannel] = useState("Channel")
  const [selectedDateCreated, setSelectedDateCreated] = useState("Date created")

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

  const tabs = ["Work Order", "Update lapangan", "MANJA"]
  const filters = ["Oktober", "November", "Desember", "Januari"]



  const getCurrentTabData = (): string[][] => {
    return tabData
  }

  const getCurrentTableHeaders = () => {
    switch (selectedTab) {
      case "Work Order":
        return ["Order ID", "Date Created", "Work Order", "Service NO", "Work Zone", "ODP", "Mitra", "Labor Teknisi"]
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

  // Function to close detail modal
  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedOrderData(null)
  }

  const renderTableRow = (rowData: string[], index: number) => {
    const orderData = formatOrderData[index] as FormatOrder // Get full order data for modal
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
    <div className="min-h-screen bg-[#1B2431] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Format Order Management</h1>
          <p className="text-gray-400 text-lg">
            Manage and analyze your provisioning orders across different categories.
          </p>
          <div className="text-sm text-green-400">
            📊 Total records: {totalCount.toLocaleString()} • Page {currentPage} of {totalPages}
          </div>
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
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
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
  )
}