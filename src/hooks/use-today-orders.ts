// hooks/use-monitoring.js atau hooks/use-today-orders.js
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useTodayOrders() {
  const [data, setData] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTodayOrders() {
      try {
        setLoading(true)
        
        const { data: result, error } = await supabase
          .rpc('get_today_total_orders')

        if (error) throw error
        setData(result || 0)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('Error fetching today orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTodayOrders()
    
    // Auto refresh setiap 30 detik untuk real-time data
    const interval = setInterval(fetchTodayOrders, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return { data, loading, error }
}