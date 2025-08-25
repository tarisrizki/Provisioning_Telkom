"use client"

export const dynamic = 'force-dynamic'

import { useDashboard } from "@/hooks/use-dashboard"
import { 
  MonthlyTrendChart, 
  BIMAStatusChart, 
  FieldUpdates
} from "@/components/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, TrendingUp, TrendingDown, BarChart3, PieChart, Activity } from "lucide-react"

export default function DashboardPage() {
  const { dashboardMetrics, csvData } = useDashboard()

  // Show message if no data available
  if (!csvData) {
    return (
      <div className="min-h-screen bg-[#0f172a] p-6">
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
                  href="/upload" 
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
    <div className="min-h-screen bg-[#0f172a] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-400 text-lg">
            Real-time insights and analytics for your provisioning system.
          </p>
        </div>

        {/* KPI Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">Data Work Order</h3>
                <div className="h-3 w-3 rounded-full bg-green-500/20 border-2 border-white/20"></div>
              </div>
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">11,729</div>
              <div className="flex items-center text-green-400 text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>+5% dari bulan kemarin</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">Avg Provisioning Time</h3>
                <div className="h-3 w-3 rounded-full bg-blue-500/20 border-2 border-white/20"></div>
              </div>
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">5.4 hr</div>
              <div className="flex items-center text-green-400 text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>+8% dari rata-rata</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">Success Rate</h3>
                <div className="h-3 w-3 rounded-full bg-green-500/20 border-2 border-white/20"></div>
              </div>
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">78%</div>
              <div className="flex items-center text-green-400 text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>+3% dari bulan kemarin</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">Failure Rate</h3>
                <div className="h-3 w-3 rounded-full bg-red-500/20 border-2 border-white/20"></div>
              </div>
              <div className="text-4xl font-bold text-white mb-3 tracking-tight">15%</div>
              <div className="flex items-center text-red-400 text-sm font-medium">
                <TrendingDown className="h-4 w-4 mr-2" />
                <span>-2% dari sebelumnya</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tren Order Harian Chart - Full Width */}
        <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-xl font-semibold">Tren Order Harian</span>
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
              <BIMAStatusChart data={[
                { name: "Complete", value: 45, color: "#22c55e" },
                { name: "Cancel Work", value: 25, color: "#ef4444" },
                { name: "Working/Fixing", value: 30, color: "#f59e0b" }
              ]} />
            </CardContent>
          </Card>

          {/* Top Update Lapangan */}
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-xl font-semibold">Top Update Lapaorgan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium text-sm">Kendala Pelanggan</span>
                    <span className="text-gray-400 font-semibold text-sm">85%</span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={85} 
                      className="h-3 bg-[#0f172a]"
                      style={{
                        '--progress-background': '#0f172a',
                        '--progress-foreground': '#3b82f6'
                      } as React.CSSProperties}
                    />
                    <div className="absolute inset-0 rounded-full opacity-20 bg-blue-500"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium text-sm">Kendala Teknis Infrastruktur</span>
                    <span className="text-gray-400 font-semibold text-sm">70%</span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={70} 
                      className="h-3 bg-[#0f172a]"
                      style={{
                        '--progress-background': '#0f172a',
                        '--progress-foreground': '#10b981'
                      } as React.CSSProperties}
                    />
                    <div className="absolute inset-0 rounded-full opacity-20 bg-green-500"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium text-sm">Force Majeure</span>
                    <span className="text-gray-400 font-semibold text-sm">55%</span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={55} 
                      className="h-3 bg-[#0f172a]"
                      style={{
                        '--progress-background': '#0f172a',
                        '--progress-foreground': '#f59e0b'
                      } as React.CSSProperties}
                    />
                    <div className="absolute inset-0 rounded-full opacity-20 bg-yellow-500"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Field Updates Section (if data available) */}
        {dashboardMetrics.fieldUpdateData.length > 0 && (
          <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Activity className="h-5 w-5 text-orange-400" />
                </div>
                <span className="text-xl font-semibold">Field Updates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FieldUpdates data={dashboardMetrics.fieldUpdateData} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
