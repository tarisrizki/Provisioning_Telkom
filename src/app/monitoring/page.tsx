"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


import { TrendingUp, RefreshCw, BarChart3, PieChart as PieChartIcon } from "lucide-react"
import { MonitoringChart, HSAWorkOrderChart } from "@/components/dashboard"
import { useMonitoring, useHSAWorkOrder } from "@/hooks"



import { TrendingDown} from "lucide-react"

// Interfaces will be used when data is fetched from Supabase

// All data will be fetched from Supabase

export default function MonitoringPage() {
  const [selectedMonth, setSelectedMonth] = useState("October")
  const [selectedBranch, setSelectedBranch] = useState("Branch")
  const [selectedWOK, setSelectedWOK] = useState("WOK")
  
  // Fetch monitoring data from Supabase
  const { data: monitoringData, loading: monitoringLoading, error: monitoringError } = useMonitoring()
  const { data: hsaWorkOrderData, loading: hsaLoading, error: hsaError } = useHSAWorkOrder()

  // Data will be fetched from Supabase - no filtering logic needed for now
  const filteredData = useMemo(() => {
    return {
      kpiCards: [] as Array<{title: string, value: number, trend: number, color: string, bgColor: string}>,
      updateLapangan: [] as Array<{name: string, value: number, percentage: number, color: string}>,
      hsaWorkOrder: [] as Array<{name: string, value: number, color: string}>
    }
  }, [])

  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const branchOptions = ["Branch", "Banda Aceh", "Langsa", "Lhokseumawe", "Meulaboh", "Sigli"]
  const wokOptions = ["WOK", "WOK-001", "WOK-002", "WOK-003", "WOK-004"]

  const handleResetFilter = () => {
    setSelectedMonth("October")
    setSelectedBranch("Branch")
    setSelectedWOK("WOK")
  }

  return (
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
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">Data Work Order</h3>
                <div className="h-3 w-3 rounded-full bg-green-500/20 border-2 border-white/20"></div>
              </div>
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">0</div>
              <div className="flex items-center text-gray-400 text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Data akan dimuat dari Supabase</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">Avg Provisioning Time</h3>
                <div className="h-3 w-3 rounded-full bg-blue-500/20 border-2 border-white/20"></div>
              </div>
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">0 hr</div>
              <div className="flex items-center text-gray-400 text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Data akan dimuat dari Supabase</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">Success Rate</h3>
                <div className="h-3 w-3 rounded-full bg-green-500/20 border-2 border-white/20"></div>
              </div>
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">0%</div>
              <div className="flex items-center text-gray-400 text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Data akan dimuat dari Supabase</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">Failure Rate</h3>
                <div className="h-3 w-3 rounded-full bg-red-500/20 border-2 border-white/20"></div>
              </div>
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">0%</div>
              <div className="flex items-center text-gray-400 text-sm font-medium">
                <TrendingDown className="h-4 w-4 mr-2" />
                <span>Data akan dimuat dari Supabase</span>
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

                <Select value={selectedWOK} onValueChange={setSelectedWOK}>
                  <SelectTrigger className="w-[120px] bg-[#1B2431] border-[#475569] text-white hover:bg-[#1e293b] transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#475569]">
                    {wokOptions.map((wok) => (
                      <SelectItem key={wok} value={wok} className="text-white hover:bg-[#334155] focus:bg-[#334155]">
                        {wok}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleResetFilter}
                variant="outline" 
                className="bg-[#1B2431] border-[#475569] text-white hover:bg-[#1e293b] hover:border-[#64748b] transition-all duration-200 shadow-md"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Filter
              </Button>
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
  )
}
