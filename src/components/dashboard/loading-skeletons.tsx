"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function KPICardSkeleton() {
  return (
    <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-16 bg-slate-600" />
          <Skeleton className="h-3 w-3 rounded-full bg-slate-600" />
        </div>
        <Skeleton className="h-10 w-24 mb-3 bg-slate-600" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 bg-slate-600" />
          <Skeleton className="h-4 w-32 bg-slate-600" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ChartSkeleton() {
  return (
    <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-40 mb-4 bg-slate-600" />
        <div className="h-[300px] flex items-end justify-around gap-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton 
              key={i} 
              className="w-8 bg-slate-600" 
              style={{ height: `${Math.random() * 60 + 40}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card className="bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#475569] shadow-xl">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4 bg-slate-600" />
        <div className="space-y-3">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-full bg-slate-600" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
