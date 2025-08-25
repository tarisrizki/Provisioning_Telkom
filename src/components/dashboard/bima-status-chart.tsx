import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface BIMAStatusData {
  name: string
  value: number
  color: string
}

interface BIMAStatusChartProps {
  data: BIMAStatusData[]
}

export function BIMAStatusChart({ data }: BIMAStatusChartProps) {
  // Calculate total for percentage calculation
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  // Format data for display with percentages
  const formattedData = data.map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item.value / total) * 100) : 0
  }))

  return (
    <div className="flex items-center justify-center">
      <div className="w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number, name: string) => [
                `${value} orders (${Math.round((value / total) * 100)}%)`,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="ml-8 space-y-3">
        {formattedData.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-white text-sm">{item.name}</span>
            <span className="text-gray-400 text-sm">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
