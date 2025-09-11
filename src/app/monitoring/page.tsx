"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTodayOrders } from "@/hooks/use-today-orders"
import { TrendingUp, AlertCircle, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { RefreshCw, BarChart3, PieChart as PieChartIcon } from "lucide-react"
import { MonitoringChart, HSAWorkOrderChart } from "@/components/dashboard"
import { useMonitoring, useHSAWorkOrder, useMonitoringFilterOptions } from "@/hooks"
import { useTodayWorkComplete } from "@/hooks/use-work-complete"
import { useTodayWorkCancel } from "@/hooks/use-today-work-cancel"
import { useTodayWorkFail } from "@/hooks/use-today-work-fail"
import ProtectedRoute from "@/components/protected-route"

// Interfaces will be used when data is fetched from Supabase

// All data will be fetched from Supabase

export default function MonitoringPage() {
  const [selectedMonth, setSelectedMonth] = useState("Pilih Bulan")
  const [selectedBranch, setSelectedBranch] = useState("Pilih Branch")
  const [selectedCluster, setSelectedCluster] = useState("Pilih Cluster")
  
  // Fetch filter options
  const { months, branches, clusters, loading: filterLoading } = useMonitoringFilterOptions()
  
  // Create filter object for hooks
  const filters = useMemo(() => ({
    month: selectedMonth,
    branch: selectedBranch,
    cluster: selectedCluster
  }), [selectedMonth, selectedBranch, selectedCluster])
  
  const { data: todayOrders, loading: todayOrdersLoading, error: todayOrdersError } = useTodayOrders()
  const { data: workComplete, loading: workCompleteLoading, error: workCompleteError } = useTodayWorkComplete()
  // Fetch monitoring data from Supabase with filters
  const { data: monitoringData, loading: monitoringLoading, error: monitoringError } = useMonitoring(filters)
  const { data: hsaWorkOrderData, loading: hsaLoading, error: hsaError } = useHSAWorkOrder(filters)
  const { data: workCancel, loading: workCancelLoading, error: workCancelError } = useTodayWorkCancel()
  const { data: workFail, loading: workFailLoading, error: workFailError } = useTodayWorkFail()
  
  // Data will be fetched from Supabase - no filtering logic needed for now
  const filteredData = useMemo(() => {
    return {
      kpiCards: [] as Array<{title: string, value: number, trend: number, color: string, bgColor: string}>,
      updateLapangan: [] as Array<{name: string, value: number, percentage: number, color: string}>,
      hsaWorkOrder: [] as Array<{name: string, value: number, color: string}>
    }
  }, [])

  // Create dropdown options with default values
  const monthOptions = ["Pilih Bulan", ...months]
  const branchOptions = ["Pilih Branch", ...branches]
  const clusterOptions = ["Pilih Cluster", ...clusters]

  const handleResetFilter = () => {
    setSelectedMonth("Pilih Bulan")
    setSelectedBranch("Pilih Branch")
    setSelectedCluster("Pilih Cluster")
  }

  // Check if any filter is active
  const hasActiveFilters = () => {
    return selectedMonth !== "Pilih Bulan" || 
           selectedBranch !== "Pilih Branch" || 
           selectedCluster !== "Pilih Cluster"
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#1B2431] p-6">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Monitoring Dashboard</h1>
          <p className="text-gray-400 text-lg">
            Real-time monitoring of work orders and system performance metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Data Work Order */}
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">Data Work Order</h3>
                <div className={`h-3 w-3 rounded-full border-2 border-white/20 ${
                  todayOrdersLoading 
                    ? 'bg-yellow-500/20 animate-pulse' 
                    : todayOrdersError 
                      ? 'bg-red-500/20' 
                      : 'bg-green-500/20'
                }`}></div>
              </div>
              
              {/* // memanggil fungsi di database untuk mendapatkan data hari ini */}

              <div className="text-4xl font-bold text-white mb-3 tracking-tight">
                {todayOrdersLoading ? (
                  <div className="animate-pulse bg-gray-600 h-10 w-24 rounded"></div>
                ) : todayOrdersError ? (
                  <span className="text-red-400 text-xl">Error</span>
                ) : (
                  todayOrders.toLocaleString('id-ID')
                )}
              </div>
              
              <div className="flex items-center text-gray-400 text-sm font-medium">
                {todayOrdersError ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2 text-red-400" />
                    <span className="text-red-400">Gagal memuat data</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span>Total work order hari ini</span>
                  </>
                )}
              </div>
              
              {/* Optional: Show last updated time */}
              {!todayOrdersLoading && !todayOrdersError && (
                <div className="mt-2 text-xs text-gray-500">
                  Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Work Complete */}
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">Work Complete</h3>
                <div className={`h-3 w-3 rounded-full border-2 border-white/20 ${
                  workCompleteLoading 
                    ? 'bg-yellow-500/20 animate-pulse' 
                    : workCompleteError 
                      ? 'bg-red-500/20' 
                      : 'bg-green-500/20'
                }`}></div>
              </div>
              
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">
                {workCompleteLoading ? (
                  <div className="animate-pulse bg-gray-600 h-10 w-24 rounded"></div>
                ) : workCompleteError ? (
                  <span className="text-red-400 text-xl">Error</span>
                ) : (
                  workComplete.toLocaleString('id-ID')
                )}
              </div>
              
              <div className="flex items-center text-gray-400 text-sm font-medium">
                {workCompleteError ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2 text-red-400" />
                    <span className="text-red-400">Gagal memuat data</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Selesai hari ini</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Work Cancel */}
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">Work Cancel</h3>
                <div className={`h-3 w-3 rounded-full border-2 border-white/20 ${
                  workCancelLoading 
                    ? 'bg-yellow-500/20 animate-pulse' 
                    : workCancelError 
                      ? 'bg-red-500/20' 
                      : 'bg-orange-500/20'
                }`}></div>
              </div>
              
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">
                {workCancelLoading ? (
                  <div className="animate-pulse bg-gray-600 h-10 w-24 rounded"></div>
                ) : workCancelError ? (
                  <span className="text-red-400 text-xl">Error</span>
                ) : (
                  workCancel.toLocaleString('id-ID')
                )}
              </div>
              
              <div className="flex items-center text-gray-400 text-sm font-medium">
                {workCancelError ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2 text-red-400" />
                    <span className="text-red-400">Gagal memuat data</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2 text-orange-400" />
                    <span>Dibatalkan hari ini</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Work Fail */}
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">Work Fail</h3>
                <div className={`h-3 w-3 rounded-full border-2 border-white/20 ${
                  workFailLoading 
                    ? 'bg-yellow-500/20 animate-pulse' 
                    : workFailError 
                      ? 'bg-red-500/20' 
                      : 'bg-red-500/20'
                }`}></div>
              </div>
              
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">
                {workFailLoading ? (
                  <div className="animate-pulse bg-gray-600 h-10 w-24 rounded"></div>
                ) : workFailError ? (
                  <span className="text-red-400 text-xl">Error</span>
                ) : (
                  workFail.toLocaleString('id-ID')
                )}
              </div>
              
              <div className="flex items-center text-gray-400 text-sm font-medium">
                {workFailError ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2 text-red-400" />
                    <span className="text-red-400">Gagal memuat data</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
                    <span>Gagal hari ini</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
      
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredData.kpiCards.map((card, index) => (
            <Card key={index} className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wide">{card.title}</h3>
                  <div className={`h-3 w-3 rounded-full ${card.bgColor} border-2 border-white/20`}></div>
                </div>
                <div className="text-4xl font-bold text-white mb-3 tracking-tight">{card.value.toLocaleString()}</div>
                <div className={`flex items-center ${card.color} text-sm font-medium`}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span>{card.trend > 0 ? '+' : ''}{card.trend}% Up from yesterday</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-gradient-to-r from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Filter Data</h3>
                {hasActiveFilters() && (
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                    Filter Aktif
                  </span>
                )}
                {filterLoading && (
                  <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                    Loading...
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-4">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[160px] bg-[#1B2431] border-[#475569] text-white hover:bg-[#1e293b] transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#475569]">
                    {monthOptions.map((month) => (
                      <SelectItem key={month} value={month} className="text-white hover:bg-[#334155] focus:bg-[#334155]">
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-[140px] bg-[#1B2431] border-[#475569] text-white hover:bg-[#1e293b] transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#475569]">
                    {branchOptions.map((branch) => (
                      <SelectItem key={branch} value={branch} className="text-white hover:bg-[#334155] focus:bg-[#334155]">
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCluster} onValueChange={setSelectedCluster}>
                  <SelectTrigger className="w-[140px] bg-[#1B2431] border-[#475569] text-white hover:bg-[#1e293b] transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#475569]">
                    {clusterOptions.map((cluster) => (
                      <SelectItem key={cluster} value={cluster} className="text-white hover:bg-[#334155] focus:bg-[#334155]">
                        {cluster}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters() && (
                <Button 
                  onClick={handleResetFilter}
                  variant="outline" 
                  className="bg-[#dc2626] border-[#dc2626] text-white hover:bg-[#b91c1c] hover:border-[#b91c1c] transition-all duration-200 shadow-md"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Filter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Total Update Lapangan */}
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-xl font-semibold">Total Update Lapangan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <MonitoringChart 
                data={monitoringData} 
                loading={monitoringLoading} 
                error={monitoringError} 
              />
            </CardContent>
          </Card>

          {/* Total Work Order berdasarkan HSA */}
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <PieChartIcon className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-xl font-semibold">Total Work Order berdasarkan HSA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <HSAWorkOrderChart 
                data={hsaWorkOrderData} 
                loading={hsaLoading} 
                error={hsaError} 
              />
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
