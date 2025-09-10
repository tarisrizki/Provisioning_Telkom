// hooks/use-today-work-cancel.js
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useTodayWorkCancel() {
  const [data, setData] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTodayWorkCancel() {
      try {
        setLoading(true)
        
        const { data: result, error } = await supabase
          .rpc('get_today_work_cancel')

        if (error) throw error
        setData(result || 0)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('Error fetching today work cancel:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTodayWorkCancel()
    
    const interval = setInterval(fetchTodayWorkCancel, 30000)
    return () => clearInterval(interval)
  }, [])

  return { data, loading, error }
}