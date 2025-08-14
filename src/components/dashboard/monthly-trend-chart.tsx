import { useState } from "react"
import { ChevronDown, TrendingUp } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { chartConfig } from "@/config/dashboard-data"

interface MonthlyTrendChartProps {
  data: Array<{ date: string; value: number }>
  months: string[]
}

export function MonthlyTrendChart({ data, months }: MonthlyTrendChartProps) {
  const [selectedMonth, setSelectedMonth] = useState("October")

  // Calculate trend percentage
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)
  const avgValue = totalValue / data.length
  const currentMonthValue = data[data.length - 1]?.value || 0
  const trendPercentage = avgValue > 0 ? ((currentMonthValue - avgValue) / avgValue * 100) : 0

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Tren Order Bulanan</h3>
          <p className="text-sm text-gray-400">Showing work orders distribution across months</p>
          <div className="flex items-center text-sm text-green-400 mt-1">
            <TrendingUp className="h-4 w-4 mr-1" />
            {trendPercentage > 0 ? "Trending up" : "Trending down"} by {Math.abs(trendPercentage).toFixed(1)}% this month
          </div>
          <p className="text-xs text-gray-500 mt-1">January - December 2024</p>
        </div>
        
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-[#0f172a] text-white border border-[#334155] rounded-lg px-4 py-2 pr-8 appearance-none cursor-pointer"
          >
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.colors.primary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={chartConfig.colors.primary} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.colors.grid} />
            <XAxis 
              dataKey="date" 
              stroke={chartConfig.colors.text}
              fontSize={12}
            />
            <YAxis 
              stroke={chartConfig.colors.text}
              fontSize={12}
              domain={[0, 'dataMax + 10']}
            />
            <Tooltip 
              contentStyle={chartConfig.tooltipStyle}
              formatter={(value: number) => [`${value} work orders`, 'Work Orders']}
              labelFormatter={(label) => `Month ${label}`}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartConfig.colors.primary}
              strokeWidth={2}
              fill="url(#colorValue)"
              dot={{ fill: chartConfig.colors.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: chartConfig.colors.secondary }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
