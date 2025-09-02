import { Loader2, AlertCircle } from 'lucide-react'

interface MonitoringData {
  name: string
  value: number
  displayName: string
  color: string
}

interface MonitoringChartProps {
  data: MonitoringData[]
  loading?: boolean
  error?: string | null
}

export function MonitoringChart({ data, loading, error }: MonitoringChartProps) {
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-3" />
            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse" />
          </div>
          <p className="text-sm text-gray-300 font-medium">Loading monitoring data...</p>
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
          <p className="text-sm text-red-400 font-medium">Error loading monitoring data</p>
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
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-sm text-gray-300 font-medium">No monitoring data available</p>
          <p className="text-xs text-gray-500 mt-2">Data will be loaded from Supabase</p>
        </div>
      </div>
    )
  }

  // Calculate total for percentage calculation
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  // Sort data by value (descending) for better visualization
  const sortedData = [...data].sort((a, b) => b.value - a.value)

  return (
    <div className="space-y-4">
      {sortedData.map((item, index) => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0
        return (
          <div key={index} className="group">
            {/* Header with name and count */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm font-medium tracking-wide">
                {item.displayName}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm font-bold">
                  {item.value.toLocaleString()}
                </span>
                <span className="text-gray-400 text-xs">
                  ({percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="relative overflow-hidden">
              <div className="w-full bg-[#1B2431] rounded-lg h-7 border border-gray-700/30">
                <div 
                  className="h-full rounded-lg transition-all duration-500 ease-out flex items-center justify-start relative group-hover:brightness-110"
                  style={{ 
                    width: `${Math.max(percentage, 3)}%`, // Minimum 3% width for visibility
                    backgroundColor: item.color,
                    boxShadow: `0 0 8px ${item.color}30`
                  }}
                >
                  {/* Percentage text inside bar (only if bar is wide enough) */}
                  {percentage > 15 && (
                    <span className="text-white text-xs font-semibold pl-3">
                      {percentage.toFixed(1)}%
                    </span>
                  )}
                  
                  {/* Subtle gradient overlay */}
                  <div 
                    className="absolute inset-0 rounded-lg opacity-20"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, ${item.color} 100%)`
                    }}
                  />
                </div>
              </div>
              
              {/* Subtle glow effect */}
              <div 
                className="absolute inset-0 rounded-lg opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${item.color} 50%, transparent 100%)`,
                  filter: 'blur(8px)'
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
