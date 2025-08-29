import { Loader2, AlertCircle } from 'lucide-react'

interface FieldUpdateData {
  name: string
  value: number
  displayName: string
}

interface FieldUpdatesProps {
  data: FieldUpdateData[]
  loading?: boolean
  error?: string | null
}

export function FieldUpdates({ data, loading, error }: FieldUpdatesProps) {


  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Loading update lapangan data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-400">Error loading update lapangan data</p>
          <p className="text-xs text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm text-gray-400">No update lapangan data available</p>
          <p className="text-xs text-gray-500 mt-1">Data will be loaded from Supabase</p>
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
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white">{item.displayName}</span>
              <span className="text-gray-400">
                {item.value.toLocaleString()} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-[#1B2431] rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
