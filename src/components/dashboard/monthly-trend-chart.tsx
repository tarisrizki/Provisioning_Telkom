import { Loader2, AlertCircle } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useMonthlyTrend } from "@/hooks/use-monthly-trend"

export function MonthlyTrendChart() {
  const { data: monthlyData, loading, error } = useMonthlyTrend()

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Loading monthly trend data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-400">Error loading trend data</p>
          <p className="text-xs text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (monthlyData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center">
          <div className="text-4xl mb-2">📈</div>
          <p className="text-sm text-gray-400">No monthly trend data available</p>
          <p className="text-xs text-gray-500 mt-1">Data will be loaded from Supabase</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="monthName"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 'dataMax + 100']}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#ffffff'
              }}
              labelStyle={{ color: '#ffffff' }}
              itemStyle={{ color: '#ffffff' }}
              formatter={(value: number) => [`${value.toLocaleString()} orders`, 'Orders']}
              labelFormatter={(label) => `${label}`}
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#colorOrders)"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#60a5fa" }}
            />
          </AreaChart>
        </ResponsiveContainer>
    </div>
  )
}
