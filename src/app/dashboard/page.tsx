"use client"

export const dynamic = 'force-dynamic'

import { useDashboard } from "@/hooks/use-dashboard"
import { useBimaStatus } from "@/hooks/use-bima-status"
import { useUpdateLapangan } from "@/hooks/use-update-lapangan"
import { useDashboardKPI } from "@/hooks/use-dashboard-kpi"
import { 
  MonthlyTrendChart, 
  BIMAStatusChart, 
  FieldUpdates
} from "@/components/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, TrendingUp, BarChart3, PieChart, Activity } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

export default function DashboardPage() {
  const { csvData } = useDashboard()
  const { data: bimaStatusData, loading: bimaLoading, error: bimaError } = useBimaStatus()
  const { data: updateLapanganData, loading: updateLapanganLoading, error: updateLapanganError } = useUpdateLapangan()
  const { kpiData, isLoading: kpiLoading } = useDashboardKPI()



  // Show message if no data available
  if (!csvData) {
    return (
      <div className="min-h-screen bg-[#1B2431] p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-gray-400 text-lg">
              Selamat datang di sistem manajemen ProvisioningTSEL.
            </p>
          </div>
          
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-6">📊</div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  Belum Ada Data
                </h3>
                <p className="text-gray-400 mb-8 text-lg">
                  Upload file CSV terlebih dahulu untuk melihat dashboard yang lengkap.
                </p>
                <a 
                  href="/format-order" 
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Upload className="h-5 w-5 mr-3" />
                  Upload Data
                </a>
              </div>
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
        {/* <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-400 text-lg">
            Real-time insights and analytics for your provisioning system.
          </p>
        </div> */}

        {/* KPI Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* PS Card */}
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="py-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">PS</h3>
                <div className="h-3 w-3 rounded-full bg-green-500/20 border-2 border-white/20"></div>
              </div>
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">
                {kpiLoading ? "..." : kpiData.ps.toLocaleString()}
              </div>
              <div className="flex items-center text-gray-400 text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Data dari Supabase</span>
              </div>
            </CardContent>
          </Card> 

          {/* RE Card */}
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">RE</h3>
                <div className="h-3 w-3 rounded-full bg-blue-500/20 border-2 border-white/20"></div>
              </div>
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">
                {kpiLoading ? "..." : `${kpiData.re.toLocaleString()} hr`}
              </div>
              <div className="flex items-center text-gray-400 text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Data dari Supabase</span>
              </div>
            </CardContent>
          </Card>

          {/* PS/RE Ratio Card */}
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">PS/RE</h3>
                <div className="h-3 w-3 rounded-full bg-green-500/20 border-2 border-white/20"></div>
              </div>
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">
                {kpiLoading ? "..." : `${kpiData.psReRatio}%`}
              </div>
              <div className="flex items-center text-gray-400 text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Data dari Supabase</span>
              </div>
            </CardContent>
          </Card>

          {/* Target Static Card */}
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">Target Static</h3>
                <div className="h-3 w-3 rounded-full bg-red-500/20 border-2 border-white/20"></div>
              </div>
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">75,12%</div>
              <div className="flex items-center text-gray-400 text-sm font-medium">
                <span>Per bulan</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tren Order Bulanan Chart - Full Width */}
        <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-xl font-semibold">Tren Order Bulanan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <MonthlyTrendChart />
          </CardContent>
        </Card>

        {/* Bottom Row with Distribusi Status BIMA on Left and Top Update Lapangan on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Distribusi Status BIMA */}
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <PieChart className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-xl font-semibold">Distribusi Status BIMA</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BIMAStatusChart 
                data={bimaStatusData} 
                loading={bimaLoading} 
                error={bimaError} 
              />
            </CardContent>
          </Card>

          {/* Top Update Lapangan */}
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-xl font-semibold">Top Update Lapangan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FieldUpdates 
                data={updateLapanganData} 
                loading={updateLapanganLoading} 
                error={updateLapanganError} 
              />
            </CardContent>
          </Card>
        </div>


        </div>
      </div>
    </ProtectedRoute>
  )
}
