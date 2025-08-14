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
  const { dashboardMetrics, csvData, lastUpdate, refreshData } = useDashboard()

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">
            Selamat datang di sistem manajemen ProvisioningTSEL.
          </p>
          <div className="mt-2 text-sm text-green-400">
            📈 Data real-time dari {csvData.rows.length} work orders
          </div>
          <div className="mt-1 text-xs text-blue-400">
            🔄 Auto-refresh setiap 5 detik • Event-driven updates
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <FileText className="h-4 w-4" />
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="px-3 py-2 bg-[#334155] text-white rounded-lg hover:bg-[#475569] transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      {/* Data Status Indicator */}
      <DataStatusIndicator 
        csvData={csvData}
        lastUpdate={lastUpdate}
        onRefresh={refreshData}
      />
      
      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Work Order"
          value={dashboardMetrics.totalWorkOrders.toLocaleString()}
          trend={`${csvData.rows.length} work orders loaded`}
          trendType="up"
          color="green"
        />
        <KPICard
          title="Avg Provisioning Time"
          value={dashboardMetrics.avgProvisioningTime}
          trend="Based on current data"
          trendType="up"
          color="blue"
        />
        <KPICard
          title="Success Rate"
          value={`${dashboardMetrics.successRate}%`}
          trend={`${dashboardMetrics.successRate}% of total orders`}
          trendType="up"
          color="green"
        />
        <KPICard
          title="Failure Rate"
          value={`${dashboardMetrics.failureRate}%`}
          trend={`${dashboardMetrics.failureRate}% of total orders`}
          trendType="down"
          color="red"
        />
      </div>

      {/* Additional KPI Cards for In Progress */}
      {dashboardMetrics.inProgressRate > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KPICard
            title="In Progress Rate"
            value={`${dashboardMetrics.inProgressRate}%`}
            trend={`${dashboardMetrics.inProgressRate}% of total orders`}
            trendType="neutral"
            color="blue"
          />
        </div>
      )}
      
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

      {/* Data Summary Section */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Data Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-[#0f172a] rounded-lg">
            <div className="text-2xl font-bold text-green-400">{dashboardMetrics.totalWorkOrders}</div>
            <div className="text-gray-400">Total Work Orders</div>
          </div>
          <div className="text-center p-3 bg-[#0f172a] rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{csvData.headers.length}</div>
            <div className="text-gray-400">Total Columns</div>
          </div>
          <div className="text-center p-3 bg-[#0f172a] rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{csvData.rows.length}</div>
            <div className="text-gray-400">Total Rows</div>
          </div>
        </div>
      </div>
    </div>
  )
}
