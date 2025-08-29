import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Loader2, AlertCircle } from 'lucide-react'

interface HSAWorkOrderData {
  name: string
  value: number
  color: string
}

interface HSAWorkOrderChartProps {
  data: HSAWorkOrderData[]
  loading?: boolean
  error?: string | null
}

export function HSAWorkOrderChart({ data, loading, error }: HSAWorkOrderChartProps) {
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500 mx-auto mb-3" />
            <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-pulse" />
          </div>
          <p className="text-sm text-gray-300 font-medium">Loading HSA work order data...</p>
          <p className="text-xs text-gray-500 mt-1">Fetching from Supabase</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center p-6 rounded-lg bg-red-500/5 border border-red-500/20">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <p className="text-sm text-red-400 font-medium">Error loading HSA data</p>
          <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">{error}</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center p-6 rounded-lg bg-gray-500/5 border border-gray-500/20">
          <div className="w-16 h-16 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏢</span>
          </div>
          <p className="text-sm text-gray-300 font-medium">No HSA data available</p>
          <p className="text-xs text-gray-500 mt-2">Data will be loaded from Supabase</p>
        </div>
      </div>
    )
  }

  // Calculate total for percentage calculation
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Format data for display with percentages
  const formattedData = data.map(item => ({
    ...item,
    percentage: Math.round((item.value / total) * 100)
  }))

  return (
    <div className="space-y-6">
      {/* Pie Chart - Centered */}
      <div className="flex justify-center mb-2">
        <div className="w-72 h-72 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={130}
                paddingAngle={2}
                dataKey="value"
                stroke="#1e293b"
                strokeWidth={3}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1B2431',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '13px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(8px)'
                }}
                labelStyle={{ color: '#ffffff' }}
                itemStyle={{ color: '#ffffff' }}
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString()} orders (${Math.round((value / total) * 100)}%)`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400 font-medium">
                Total Orders
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend - Grid Layout */}
      <div className="grid grid-cols-2 gap-4">
        {formattedData.map((item, index) => (
          <div 
            key={index} 
            className="group flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-[#1B2431] to-[#1e293b] border border-[#475569]/20 hover:border-[#475569]/40 transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-0.5"
          >
            <div 
              className="w-5 h-5 rounded-full flex-shrink-0 shadow-lg transition-all duration-300 group-hover:scale-110"
              style={{ 
                backgroundColor: item.color,
                boxShadow: `0 0 12px ${item.color}50, inset 0 0 8px ${item.color}30`
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm font-semibold truncate group-hover:text-gray-100 transition-colors" title={item.name}>
                  {item.name}
                </span>
                <span className="text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full bg-gray-800/50 group-hover:bg-gray-700/50 transition-colors">
                  {item.percentage}%
                </span>
              </div>
              <div className="text-gray-400 text-xs font-medium tracking-wide">
                {item.value.toLocaleString()} <span className="text-gray-500">orders</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 16px rgba(59, 130, 246, 0.6);
          }
        }
        
        .legend-item:hover .color-dot {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
