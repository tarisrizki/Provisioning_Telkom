"use client"

export const dynamic = 'force-dynamic'

import { Filter, Calendar, Upload, AlertCircle, Loader2, Database } from "lucide-react"
import { useLaporan } from "@/hooks/use-laporan"
import { FilterDropdown, DataTable } from "@/components/laporan"

export default function LaporanPage() {
  const {
    // State
    csvData,
    filteredData,
    visibleRows,
    isLoading,
    error,
    totalCount,
    dateFilter,
    aoFilter,
    channelFilter,
    branchFilter,
    showDatePicker,
    showAoDropdown,
    showChannelDropdown,
    showBranchDropdown,
    
    // Actions
    setAoFilter,
    setChannelFilter,
    setBranchFilter,
    setShowDatePicker,
    setShowAoDropdown,
    setShowChannelDropdown,
    setShowBranchDropdown,
    closeOtherDropdowns,
    resetFilters,
    handleScroll,
    loadCSVData
  } = useLaporan()

  const currentData = filteredData || { headers: [], rows: [] }

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Laporan</h1>
          <p className="text-gray-400">
            View and manage your provisioning reports and data analysis.
          </p>
        </div>
        
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-12 text-center">
          <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Loading Data...
          </h3>
          <p className="text-gray-400">
            Please wait while we load your data from database.
          </p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Laporan</h1>
          <p className="text-gray-400">
            View and manage your provisioning reports and data analysis.
          </p>
        </div>
        
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={loadCSVData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Show no data state
  if (!csvData || csvData.rows.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Laporan</h1>
          <p className="text-gray-400">
            View and manage your provisioning reports and data analysis.
          </p>
        </div>
        
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-12 text-center">
          <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Data Available
          </h3>
          <p className="text-gray-400 mb-6">
            No data found in database. Please upload a CSV file first to view reports.
          </p>
          <a 
            href="/upload" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Data
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Laporan</h1>
        <p className="text-gray-400">
          View and manage your provisioning reports and data analysis.
        </p>
        <div className="mt-2 text-sm text-green-400">
          📊 Data loaded: {csvData.rows.length.toLocaleString()} rows • {csvData.headers.length} columns
          {totalCount > csvData.rows.length && ` • Total in database: ${totalCount.toLocaleString()}`}
        </div>
      </div>

      {/* Data Status Indicator */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Data Status:</span>
              <span className="text-sm text-green-400 font-medium">Connected to Database</span>
            </div>
            <div className="text-sm text-gray-400">
              Source: Supabase Database
            </div>
          </div>
          <button
            onClick={loadCSVData}
            className="px-3 py-1 bg-[#334155] text-white rounded text-sm hover:bg-[#475569] transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Filter By:</span>
            </div>
            
            {/* Date Filter */}
            <FilterDropdown
              label="Date"
              value={dateFilter}
              isOpen={showDatePicker}
              onToggle={() => {
                closeOtherDropdowns('date')
                setShowDatePicker(!showDatePicker)
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Select Date</h3>
                <div className="flex space-x-2">
                  <button className="p-1 hover:bg-[#334155] rounded">
                    <Calendar className="h-4 w-4 text-gray-400 rotate-90" />
                  </button>
                  <button className="p-1 hover:bg-[#334155] rounded">
                    <Calendar className="h-4 w-4 text-gray-400 -rotate-90" />
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
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </FilterDropdown>

            {/* AO Filter */}
            <FilterDropdown
              label="AO"
              value={aoFilter}
              isOpen={showAoDropdown}
              onToggle={() => {
                closeOtherDropdowns('ao')
                setShowAoDropdown(!showAoDropdown)
              }}
            >
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search AO..."
                  value={aoFilter}
                  onChange={(e) => setAoFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded text-white placeholder-gray-400"
                />
                <div className="max-h-40 overflow-y-auto">
                  {/* Sample AO options */}
                  {['AO001', 'AO002', 'AO003', 'AO004', 'AO005'].map((ao) => (
                    <button
                      key={ao}
                      onClick={() => {
                        setAoFilter(ao)
                        setShowAoDropdown(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#334155] rounded text-gray-300"
                    >
                      {ao}
                    </button>
                  ))}
                </div>
              </div>
            </FilterDropdown>

            {/* Channel Filter */}
            <FilterDropdown
              label="Channel"
              value={channelFilter}
              isOpen={showChannelDropdown}
              onToggle={() => {
                closeOtherDropdowns('channel')
                setShowChannelDropdown(!showChannelDropdown)
              }}
            >
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search Channel..."
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded text-white placeholder-gray-400"
                />
                <div className="max-h-40 overflow-y-auto">
                  {/* Sample channel options */}
                  {['Online', 'Offline', 'Mobile', 'Store'].map((channel) => (
                    <button
                      key={channel}
                      onClick={() => {
                        setChannelFilter(channel)
                        setShowChannelDropdown(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#334155] rounded text-gray-300"
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>
            </FilterDropdown>

            {/* Branch Filter */}
            <FilterDropdown
              label="Branch"
              value={branchFilter}
              isOpen={showBranchDropdown}
              onToggle={() => {
                closeOtherDropdowns('branch')
                setShowBranchDropdown(!showBranchDropdown)
              }}
            >
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search Branch..."
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded text-white placeholder-gray-400"
                />
                <div className="max-h-40 overflow-y-auto">
                  {/* Sample branch options */}
                  {['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang'].map((branch) => (
                    <button
                      key={branch}
                      onClick={() => {
                        setBranchFilter(branch)
                        setShowBranchDropdown(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#334155] rounded text-gray-300"
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              </div>
            </FilterDropdown>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-[#334155] text-white rounded-lg hover:bg-[#475569] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg">
        <div className="p-4 border-b border-[#334155]">
          <h2 className="text-lg font-semibold text-white">
            Data Table
          </h2>
          <p className="text-sm text-gray-400">
            Showing {Math.min(visibleRows, currentData.rows.length)} of {currentData.rows.length} rows
            {totalCount > currentData.rows.length && ` (${totalCount.toLocaleString()} total in database)`}
          </p>
        </div>
        
        <div onScroll={handleScroll} className="max-h-96 overflow-y-auto">
          <DataTable 
            headers={currentData.headers}
            rows={currentData.rows}
            visibleRows={visibleRows}
            onScroll={handleScroll}
          />
        </div>
      </div>
    </div>
  )
}