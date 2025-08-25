"use client"

export const dynamic = 'force-dynamic'

import { useDashboard } from "@/hooks/use-dashboard"
import { 
  MonthlyTrendChart, 
  BIMAStatusChart, 
  FieldUpdates
} from "@/components/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, TrendingUp, TrendingDown } from "lucide-react"

export default function DashboardPage() {
  const { dashboardMetrics, csvData } = useDashboard()

  // Show message if no data available
  if (!csvData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">
            Selamat datang di sistem manajemen ProvisioningTSEL.
          </p>
        </div>
        
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Belum Ada Data
            </h3>
            <p className="text-gray-400 mb-6">
              Upload file CSV terlebih dahulu untuk melihat dashboard yang lengkap.
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards Section - Matching the design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1e293b] border-[#334155] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Data Work Order</p>
                <p className="text-2xl font-bold text-white">11,729</p>
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+5% dari bulan kemarin</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1e293b] border-[#334155] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Avg Provisioning Time</p>
                <p className="text-2xl font-bold text-white">5.4 hr</p>
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+8% dari rata-rata</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1e293b] border-[#334155] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-white">78%</p>
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+3% dari bulan kemarin</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1e293b] border-[#334155] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Failure Rate</p>
                <p className="text-2xl font-bold text-white">15%</p>
                <div className="flex items-center text-red-400 text-sm mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  <span>-2% dari dari sebelumnya</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tren Order Harian Chart - Full Width */}
      <Card className="bg-[#1e293b] border-[#334155] text-white">
        <CardContent className="p-6">
          <MonthlyTrendChart />
        </CardContent>
      </Card>

      {/* Bottom Row with Distribusi Status BIMA on Left and Top Update Lapangan on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribusi Status BIMA */}
        <Card className="bg-[#1e293b] border-[#334155] text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-white">
              Distribusi Status BIMA
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
        <Card className="bg-[#1e293b] border-[#334155] text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-white">
              Top Update Lapaorgan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Kendala Pelanggan</span>
                <div className="flex-1 mx-3 bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Kendala Teknis Infrastruktur</span>
                <div className="flex-1 mx-3 bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '70%'}}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Force Majeure</span>
                <div className="flex-1 mx-3 bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '55%'}}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Field Updates Section (if data available) */}
      {dashboardMetrics.fieldUpdateData.length > 0 && (
        <Card className="bg-[#1e293b] border-[#334155] text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-white">
              Field Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldUpdates data={dashboardMetrics.fieldUpdateData} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
