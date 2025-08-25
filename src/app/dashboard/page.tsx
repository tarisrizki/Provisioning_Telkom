"use client"

export const dynamic = 'force-dynamic'

import { useDashboard } from "@/hooks/use-dashboard"
import { 
  KPICard, 
  MonthlyTrendChart, 
  BIMAStatusChart, 
  FieldUpdates,
  DataStatusIndicator
} from "@/components/dashboard"
import { RefreshCw, Upload, FileText, TrendingUp, TrendingDown } from "lucide-react"

export default function DashboardPage() {
  const { dashboardMetrics, csvData, lastUpdate, refreshData, dbTotalWorkOrders, dbTotalColumns } = useDashboard()

  const handleRefresh = () => {
    // Use the dashboard refresh function instead of page reload
    refreshData()
  }

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
              Data dashboard dibaca dari tabel `test` di Supabase.
            </p>
            <a
              href="/laporan"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Laporan
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Order"
          value={`${dashboardMetrics.totalWorkOrders.toLocaleString()}`}
          trend={`Dibaca dari database`}
          trendType="up"
          color="green"
        />
        <KPICard
          title="Order Complete"
          value={dashboardMetrics.avgProvisioningTime}
          trend={"Up from past week"}
          trendType="up"
          color="green"
        />
        <KPICard
          title="Target Static"
          value={`${dashboardMetrics.successRate}%`}
          trend={"Up from past week"}
          trendType="up"
          color="green"
        />
        <KPICard
          title="PS/RE"
          value={`${dashboardMetrics.failureRate}%`}
          trend={"Down from yesterday"}
          trendType="down"
          color="red"
        />
         <KPICard
          title="Target This Month"
          value={`${dashboardMetrics.failureRate}%`}
          trend={"Down from yesterday"}
          trendType="down"
          color="red"
        />
      </div>
      
      {/* Monthly Trend Chart Section */}
      {dashboardMetrics.monthlyData.length > 0 && (
        <MonthlyTrendChart 
          data={dashboardMetrics.monthlyData}
          months={[
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ]}
        />
      )}
      
      {/* Bottom Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dashboardMetrics.bimaStatusData.length > 0 && (
          <BIMAStatusChart data={dashboardMetrics.bimaStatusData} />
        )}
        {dashboardMetrics.fieldUpdateData.length > 0 && (
          <FieldUpdates data={dashboardMetrics.fieldUpdateData} />
        )}
      </div>

   
    </div>
  )
}
