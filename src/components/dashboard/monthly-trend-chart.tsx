import { useState } from "react"
import { ChevronDown } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// Generate daily data for a month (30 days)
const generateDailyData = () => {
  const data = []
  for (let day = 1; day <= 30; day++) {
    data.push({
      day: day.toString(),
      date: `${day}`,
      orders: Math.floor(Math.random() * 100) + 20 // Random orders between 20-120
    })
  }
  return data
}

const monthOptions = [
  "None",
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

// Generate monthly data for the year
const generateMonthlyData = () => {
  return [
    { month: "Jan", orders: 820 },
    { month: "Feb", orders: 920 },
    { month: "Mar", orders: 1100 },
    { month: "Apr", orders: 890 },
    { month: "May", orders: 1050 },
    { month: "Jun", orders: 1200 },
    { month: "Jul", orders: 950 },
    { month: "Aug", orders: 1150 },
    { month: "Sep", orders: 1080 },
    { month: "Oct", orders: 1250 },
    { month: "Nov", orders: 1180 },
    { month: "Dec", orders: 1300 }
  ]
}

export function MonthlyTrendChart() {
  const [selectedMonth, setSelectedMonth] = useState("None")
  const [dailyData, setDailyData] = useState(() => generateDailyData())
  const monthlyData = generateMonthlyData()

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
    if (month !== "None") {
      setDailyData(generateDailyData())
    }
    // In a real app, you would fetch data for the selected month here
  }

  const isMonthlyView = selectedMonth === "None"
  const chartData = isMonthlyView ? monthlyData : dailyData
  const dataKey = isMonthlyView ? "month" : "date"

  return (
    <div className="space-y-4">
      {/* Month Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">
            {isMonthlyView ? "Tren Order Bulanan" : "Tren Order Harian"}
          </h3>
          <p className="text-sm text-gray-400">
            {isMonthlyView 
              ? "Data 12 bulan dalam setahun" 
              : `Data 30 hari untuk bulan ${selectedMonth}`
            }
          </p>
        </div>
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="bg-[#0f172a] text-white border border-[#334155] rounded-lg px-4 py-2 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {monthOptions.map((month) => (
              <option key={month} value={month} className="bg-[#0f172a]">
                {month === "None" ? "Bulanan" : month}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey={dataKey}
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval={isMonthlyView ? 0 : "preserveStartEnd"}
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, isMonthlyView ? 'dataMax + 100' : 'dataMax + 20']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => [`${value} orders`, 'Orders']}
              labelFormatter={(label) => 
                isMonthlyView 
                  ? `Bulan ${label}` 
                  : `Tanggal ${label} ${selectedMonth}`
              }
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#colorOrders)"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: isMonthlyView ? 4 : 3 }}
              activeDot={{ r: isMonthlyView ? 6 : 5, fill: "#60a5fa" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
