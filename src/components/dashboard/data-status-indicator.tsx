import { FileText, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

interface DataStatusIndicatorProps {
  csvData: any
  lastUpdate: Date
  onRefresh: () => void
}

export function DataStatusIndicator({ csvData, lastUpdate, onRefresh }: DataStatusIndicatorProps) {
  const isDataAvailable = csvData && csvData.rows && csvData.rows.length > 0
  const timeSinceUpdate = Date.now() - lastUpdate.getTime()
  const isDataFresh = timeSinceUpdate < 30000 // 30 seconds

  const getStatusColor = () => {
    if (!isDataAvailable) return "text-red-400"
    if (isDataFresh) return "text-green-400"
    return "text-yellow-400"
  }

  const getStatusIcon = () => {
    if (!isDataAvailable) return <AlertCircle className="h-4 w-4" />
    if (isDataFresh) return <CheckCircle className="h-4 w-4" />
    return <RefreshCw className="h-4 w-4" />
  }

  const getStatusText = () => {
    if (!isDataAvailable) return "No Data"
    if (isDataFresh) return "Live"
    return "Stale"
  }

  const getStatusDescription = () => {
    if (!isDataAvailable) return "Upload CSV to see dashboard data"
    if (isDataFresh) return "Data is up to date"
    return "Data may be outdated"
  }

  return (
    <div className="bg-[#0f172a] border border-[#334155] rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`${getStatusColor()} flex items-center space-x-2`}>
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>
          
          <div className="text-sm text-gray-400">
            {getStatusDescription()}
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          {isDataAvailable && (
            <div className="flex items-center space-x-2 text-gray-400">
              <FileText className="h-4 w-4" />
              <span>{csvData.rows.length} rows</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-gray-400">
            <span>Updated:</span>
            <span className={isDataFresh ? "text-green-400" : "text-yellow-400"}>
              {lastUpdate.toLocaleTimeString()}
            </span>
          </div>

          <button
            onClick={onRefresh}
            className="px-3 py-1 bg-[#334155] text-white rounded text-xs hover:bg-[#475569] transition-colors flex items-center space-x-1"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mt-3 pt-3 border-t border-[#334155]">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Event Listener Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Auto-refresh (5s)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Storage Sync</span>
            </div>
          </div>
          
          <div className="text-xs">
            {isDataAvailable ? (
              <span className="text-green-400">✓ Connected to CSV Data</span>
            ) : (
              <span className="text-red-400">✗ No CSV Data</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
