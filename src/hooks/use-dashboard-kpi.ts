"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface DashboardKPI {
  ps: number // PS count
  re: number // RE count  
  totalOrder: number // Total orders (RE not counted if cancelwork && statusdsc)
  orderComplete: number // Order complete in 1 month based on date_created
  psReRatio: number // PS/RE ratio as percentage
  targetStatic: number // Static target 75.12%
  targetAchievement: number // (PS/RE) / TARGET as percentage
}

export function useDashboardKPI() {
  const [kpiData, setKpiData] = useState<DashboardKPI>({
    ps: 0,
    re: 0,
    totalOrder: 0,
    orderComplete: 0,
    psReRatio: 0,
    targetStatic: 75.12,
    targetAchievement: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateKPI = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get current date for 1 month calculation
      const now = new Date()
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      const oneMonthAgoISO = oneMonthAgo.toISOString().split('T')[0]

      console.log("Calculating KPI metrics...", {
        currentDate: now.toISOString().split('T')[0],
        oneMonthAgo: oneMonthAgoISO
      })

      // Fetch all data from format_order table
      const { data: orders, error: fetchError } = await supabase
        .from('format_order')
        .select('order_id, status_bima, status_dsc, date_created, tanggal_ps')
        .order('date_created', { ascending: false })

      if (fetchError) {
        throw new Error(`Database fetch error: ${fetchError.message}`)
      }

      if (!orders || orders.length === 0) {
        console.log("No orders found in database")
        return
      }

      console.log(`Processing ${orders.length} orders for KPI calculation`)

      let psCount = 0
      let reCount = 0
      let totalOrderCount = 0
      let orderCompleteCount = 0

      orders.forEach((order, index) => {
        const statusBima = (order.status_bima || '').trim().toLowerCase()
        const statusDsc = (order.status_dsc || '').trim().toLowerCase()
        const dateCreated = order.date_created
        const tanggalPs = order.tanggal_ps

        // Log first few orders for debugging
        if (index < 5) {
          console.log(`Order ${index + 1}:`, {
            order_id: order.order_id,
            status_bima: statusBima,
            status_dsc: statusDsc,
            date_created: dateCreated,
            tanggal_ps: tanggalPs
          })
        }

        // Count PS (based on tanggal_ps being filled)
        if (tanggalPs && tanggalPs.trim() !== '') {
          psCount++
        }

        // Count RE (orders that are not PS)
        // RE tidak dihitung jika cancelwork && statusdsc
        const isCancelWork = statusBima.includes('cancel') || statusBima.includes('canclwork')
        const hasStatusDsc = statusDsc && statusDsc.trim() !== ''
        
        if (!tanggalPs || tanggalPs.trim() === '') {
          // This is potentially RE
          if (!(isCancelWork && hasStatusDsc)) {
            // Only count as RE if NOT (cancelwork AND statusdsc)
            reCount++
          }
        }

        // Count Total Orders
        // RE tidak dihitung jika cancelwork && statusdsc
        if (tanggalPs && tanggalPs.trim() !== '') {
          // PS orders are always counted
          totalOrderCount++
        } else {
          // For RE orders, only count if NOT (cancelwork AND statusdsc)
          if (!(isCancelWork && hasStatusDsc)) {
            totalOrderCount++
          }
        }

        // Count Order Complete (1 month based on date_created)
        if (dateCreated) {
          try {
            const orderDate = new Date(dateCreated)
            if (!isNaN(orderDate.getTime()) && orderDate >= oneMonthAgo) {
              // Order is within the last month
              const isComplete = statusBima.includes('complete') || 
                               statusBima.includes('success') || 
                               statusBima.includes('done') ||
                               statusBima.includes('resolved')
              
              if (isComplete) {
                orderCompleteCount++
              }
            }
          } catch {
            console.warn(`Invalid date format for order ${order.order_id}: ${dateCreated}`)
          }
        }
      })

      // Calculate ratios
      const psReRatio = reCount > 0 ? (psCount / reCount) * 100 : 0
      const targetStatic = 75.12
      const targetAchievement = targetStatic > 0 ? (psReRatio / targetStatic) * 100 : 0

      const newKpiData: DashboardKPI = {
        ps: psCount,
        re: reCount,
        totalOrder: totalOrderCount,
        orderComplete: orderCompleteCount,
        psReRatio: Math.round(psReRatio * 100) / 100, // Round to 2 decimal places
        targetStatic: targetStatic,
        targetAchievement: Math.round(targetAchievement * 100) / 100 // Round to 2 decimal places
      }

      console.log("KPI Calculation Results:", {
        totalOrders: orders.length,
        psCount,
        reCount,
        totalOrderCount,
        orderCompleteCount,
        psReRatio: newKpiData.psReRatio,
        targetAchievement: newKpiData.targetAchievement,
        oneMonthPeriod: `${oneMonthAgoISO} to ${now.toISOString().split('T')[0]}`
      })

      setKpiData(newKpiData)

    } catch (err) {
      console.error("Error calculating KPI:", err)
      setError(err instanceof Error ? err.message : "Failed to calculate KPI")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    calculateKPI()

    // Set up periodic refresh every 5 minutes
    const intervalId = setInterval(calculateKPI, 5 * 60 * 1000)

    // Listen for data updates
    const handleDataUpdate = () => {
      console.log("Data updated, recalculating KPI...")
      calculateKPI()
    }

    window.addEventListener('csvDataUpdated', handleDataUpdate)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('csvDataUpdated', handleDataUpdate)
    }
  }, [])

  return {
    kpiData,
    isLoading,
    error,
    refreshKPI: calculateKPI
  }
}
