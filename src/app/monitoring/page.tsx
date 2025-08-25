"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp, RefreshCw, BarChart3, PieChart as PieChartIcon } from "lucide-react"

interface KPICard {
  title: string
  value: number
  trend: number
  color: string
  bgColor: string
}

interface UpdateLapanganItem {
  name: string
  value: number
  percentage: number
  color: string
}

interface HSAWorkOrder {
  name: string
  value: number
  color: string
}

// Sample data for different months
const monthlyData = {
  "January": {
    kpiCards: [
      { title: "Work Order Todays", value: 1456, trend: 12.5, color: "text-green-400", bgColor: "bg-green-500/20" },
      { title: "Work Complete", value: 1289, trend: 15.2, color: "text-green-400", bgColor: "bg-green-500/20" },
      { title: "Work Cancel", value: 89, trend: -5.3, color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
      { title: "Work Fail", value: 23, trend: -8.1, color: "text-red-400", bgColor: "bg-red-500/20" }
    ],
    updateLapangan: [
      { name: "Kendala pelanggan", value: 67, percentage: 75, color: "#3b82f6" },
      { name: "Kendala teknik (UNSC)", value: 45, percentage: 55, color: "#10b981" },
      { name: "Kendala teknik (NON UNSC)", value: 38, percentage: 40, color: "#f59e0b" },
      { name: "INPUT ULANG", value: 15, percentage: 20, color: "#ef4444" },
      { name: "ASSIGNED", value: 67, percentage: 75, color: "#8b5cf6" },
      { name: "FORCE MAJUERE", value: 45, percentage: 55, color: "#06b6d4" },
      { name: "SALAH SEGMEN", value: 38, percentage: 40, color: "#f97316" },
      { name: "PENDING IKR", value: 15, percentage: 20, color: "#ec4899" }
    ],
    hsaWorkOrder: [
      { name: "Langsa", value: 20, color: "#10b981" },
      { name: "Banda Aceh", value: 25, color: "#f59e0b" },
      { name: "Lhokseumawe", value: 20, color: "#ef4444" },
      { name: "Meulaboh", value: 15, color: "#8b5cf6" },
      { name: "Sigli", value: 20, color: "#3b82f6" }
    ]
  },
  "February": {
    kpiCards: [
      { title: "Work Order Todays", value: 1678, trend: 8.2, color: "text-green-400", bgColor: "bg-green-500/20" },
      { title: "Work Complete", value: 1456, trend: 12.8, color: "text-green-400", bgColor: "bg-green-500/20" },
      { title: "Work Cancel", value: 78, trend: -2.1, color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
      { title: "Work Fail", value: 19, trend: -12.5, color: "text-red-400", bgColor: "bg-red-500/20" }
    ],
    updateLapangan: [
      { name: "Kendala pelanggan", value: 78, percentage: 80, color: "#3b82f6" },
      { name: "Kendala teknik (UNSC)", value: 52, percentage: 60, color: "#10b981" },
      { name: "Kendala teknik (NON UNSC)", value: 42, percentage: 45, color: "#f59e0b" },
      { name: "INPUT ULANG", value: 18, percentage: 22, color: "#ef4444" },
      { name: "ASSIGNED", value: 78, percentage: 80, color: "#8b5cf6" },
      { name: "FORCE MAJUERE", value: 52, percentage: 60, color: "#06b6d4" },
      { name: "SALAH SEGMEN", value: 42, percentage: 45, color: "#f97316" },
      { name: "PENDING IKR", value: 18, percentage: 22, color: "#ec4899" }
    ],
    hsaWorkOrder: [
      { name: "Langsa", value: 22, color: "#10b981" },
      { name: "Banda Aceh", value: 23, color: "#f59e0b" },
      { name: "Lhokseumawe", value: 18, color: "#ef4444" },
      { name: "Meulaboh", value: 17, color: "#8b5cf6" },
      { name: "Sigli", value: 20, color: "#3b82f6" }
    ]
  },
  "October": {
    kpiCards: [
      { title: "Work Order Todays", value: 1837, trend: 8.5, color: "text-green-400", bgColor: "bg-green-500/20" },
      { title: "Work Complete", value: 1655, trend: 8.5, color: "text-green-400", bgColor: "bg-green-500/20" },
      { title: "Work Cancel", value: 65, trend: 8.5, color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
      { title: "Work Fail", value: 16, trend: 8.5, color: "text-red-400", bgColor: "bg-red-500/20" }
    ],
    updateLapangan: [
      { name: "Kendala pelanggan", value: 97, percentage: 85, color: "#3b82f6" },
      { name: "Kendala teknik (UNSC)", value: 75, percentage: 65, color: "#10b981" },
      { name: "Kendala teknik (NON UNSC)", value: 58, percentage: 50, color: "#f59e0b" },
      { name: "INPUT ULANG", value: 27, percentage: 25, color: "#ef4444" },
      { name: "ASSIGNED", value: 97, percentage: 85, color: "#8b5cf6" },
      { name: "FORCE MAJUERE", value: 75, percentage: 65, color: "#06b6d4" },
      { name: "SALAH SEGMEN", value: 58, percentage: 50, color: "#f97316" },
      { name: "PENDING IKR", value: 27, percentage: 25, color: "#ec4899" }
    ],
    hsaWorkOrder: [
      { name: "Langsa", value: 25, color: "#10b981" },
      { name: "Banda Aceh", value: 20, color: "#f59e0b" },
      { name: "Lhokseumawe", value: 15, color: "#ef4444" },
      { name: "Meulaboh", value: 15, color: "#8b5cf6" },
      { name: "Sigli", value: 25, color: "#3b82f6" }
    ]
  }
}

// Branch-specific data adjustments
const branchData = {
  "Banda Aceh": { multiplier: 1.2, offset: 10 },
  "Langsa": { multiplier: 0.9, offset: -5 },
  "Lhokseumawe": { multiplier: 1.1, offset: 8 },
  "Meulaboh": { multiplier: 0.8, offset: -8 },
  "Sigli": { multiplier: 1.0, offset: 0 }
}

// WOK-specific data adjustments
const wokData = {
  "WOK-001": { multiplier: 1.15, offset: 15 },
  "WOK-002": { multiplier: 0.95, offset: -3 },
  "WOK-003": { multiplier: 1.05, offset: 5 },
  "WOK-004": { multiplier: 0.9, offset: -10 }
}

export default function MonitoringPage() {
  const [selectedMonth, setSelectedMonth] = useState("October")
  const [selectedBranch, setSelectedBranch] = useState("Branch")
  const [selectedWOK, setSelectedWOK] = useState("WOK")

  // Get base data for selected month
  const baseData = monthlyData[selectedMonth as keyof typeof monthlyData] || monthlyData["October"]

  // Apply filters and calculate filtered data
  const filteredData = useMemo(() => {
    const data = { ...baseData }

    // Apply branch filter
    if (selectedBranch !== "Branch" && branchData[selectedBranch as keyof typeof branchData]) {
      const branchAdjustment = branchData[selectedBranch as keyof typeof branchData]
      
      // Adjust KPI cards
      data.kpiCards = data.kpiCards.map(card => ({
        ...card,
        value: Math.round(card.value * branchAdjustment.multiplier + branchAdjustment.offset)
      }))

      // Adjust update lapangan
      data.updateLapangan = data.updateLapangan.map(item => ({
        ...item,
        value: Math.round(item.value * branchAdjustment.multiplier + branchAdjustment.offset),
        percentage: Math.min(100, Math.max(0, Math.round(item.percentage * branchAdjustment.multiplier + branchAdjustment.offset)))
      }))

      // Adjust HSA work order
      data.hsaWorkOrder = data.hsaWorkOrder.map(item => ({
        ...item,
        value: Math.round(item.value * branchAdjustment.multiplier + branchAdjustment.offset)
      }))
    }

    // Apply WOK filter
    if (selectedWOK !== "WOK" && wokData[selectedWOK as keyof typeof wokData]) {
      const wokAdjustment = wokData[selectedWOK as keyof typeof wokData]
      
      // Adjust KPI cards
      data.kpiCards = data.kpiCards.map(card => ({
        ...card,
        value: Math.round(card.value * wokAdjustment.multiplier + wokAdjustment.offset)
      }))

      // Adjust update lapangan
      data.updateLapangan = data.updateLapangan.map(item => ({
        ...item,
        value: Math.round(item.value * wokAdjustment.multiplier + wokAdjustment.offset),
        percentage: Math.min(100, Math.max(0, Math.round(item.percentage * wokAdjustment.multiplier + wokAdjustment.offset)))
      }))

      // Adjust HSA work order
      data.hsaWorkOrder = data.hsaWorkOrder.map(item => ({
        ...item,
        value: Math.round(item.value * wokAdjustment.multiplier + wokAdjustment.offset)
      }))
    }

    return data
  }, [selectedMonth, selectedBranch, selectedWOK])

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
    <div className="min-h-screen bg-[#0f172a] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Monitoring Dashboard</h1>
          <p className="text-gray-400 text-lg">
            Real-time monitoring of work orders and system performance metrics.
          </p>
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
                  <SelectTrigger className="w-[160px] bg-[#0f172a] border-[#475569] text-white hover:bg-[#1e293b] transition-colors">
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
                  <SelectTrigger className="w-[140px] bg-[#0f172a] border-[#475569] text-white hover:bg-[#1e293b] transition-colors">
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
                  <SelectTrigger className="w-[120px] bg-[#0f172a] border-[#475569] text-white hover:bg-[#1e293b] transition-colors">
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
                className="bg-[#0f172a] border-[#475569] text-white hover:bg-[#1e293b] hover:border-[#64748b] transition-all duration-200 shadow-md"
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
            <CardContent>
              <div className="space-y-6">
                {filteredData.updateLapangan.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">{item.value} {item.name}</span>
                      <span className="text-gray-400 font-semibold">{item.percentage}%</span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={item.percentage} 
                        className="h-3 bg-[#0f172a]"
                        style={{
                          '--progress-background': '#0f172a',
                          '--progress-foreground': item.color
                        } as React.CSSProperties}
                      />
                      <div 
                        className="absolute inset-0 rounded-full opacity-20"
                        style={{ backgroundColor: item.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
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
            <CardContent>
              <div className="flex items-center justify-center mb-8">
                <div className="w-56 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={filteredData.hsaWorkOrder}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="#0f172a"
                        strokeWidth={2}
                      >
                        {filteredData.hsaWorkOrder.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '12px',
                          color: 'white',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                        }}
                        labelStyle={{ color: '#94a3b8' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-4">
                {filteredData.hsaWorkOrder.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-[#0f172a] rounded-lg hover:bg-[#1e293b] transition-colors">
                    <div 
                      className="h-4 w-4 rounded-full shadow-lg" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-300 font-medium">{item.name}</span>
                    <span className="text-xs text-gray-400 ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
