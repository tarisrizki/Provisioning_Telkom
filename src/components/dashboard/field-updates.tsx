interface FieldUpdateData {
  name: string
  value: number
}

interface FieldUpdatesProps {
  data: FieldUpdateData[]
}

export function FieldUpdates({ data }: FieldUpdatesProps) {
  // Calculate total for percentage calculation
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  // Sort data by value (descending) for better visualization
  const sortedData = [...data].sort((a, b) => b.value - a.value)

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Top Update Lapangan</h3>
      <div className="space-y-4">
        {sortedData.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white">{item.name}</span>
                <span className="text-gray-400">
                  {item.value} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-[#0f172a] rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )
        })}
        <div className="pt-3 border-t border-gray-600">
          <div className="flex justify-between text-sm">
            <span className="text-white font-medium">Total</span>
            <span className="text-gray-400 font-medium">{total} work orders</span>
          </div>
        </div>
      </div>
    </div>
  )
}
