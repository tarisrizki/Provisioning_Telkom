import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KPICardProps {
  title: string
  value: string
  trend: string
  trendType: "up" | "down" | "neutral"
  color: "green" | "red" | "blue" | "yellow"
}

export function KPICard({ title, value, trend, trendType, color }: KPICardProps) {
  const getTrendColor = () => {
    switch (color) {
      case "green": return "text-green-400"
      case "red": return "text-red-400"
      case "blue": return "text-blue-400"
      case "yellow": return "text-yellow-400"
      default: return "text-gray-400"
    }
  }

  const getTrendIcon = () => {
    switch (trendType) {
      case "up": return <TrendingUp className="h-3 w-3 mr-1" />
      case "down": return <TrendingDown className="h-3 w-3 mr-1" />
      case "neutral": return <Minus className="h-3 w-3 mr-1" />
      default: return <TrendingUp className="h-3 w-3 mr-1" />
    }
  }

  const trendColor = getTrendColor()

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <div className={`flex items-center text-xs ${trendColor}`}>
            {getTrendIcon()}
            {trend}
          </div>
        </div>
      </div>
    </div>
  )
}
