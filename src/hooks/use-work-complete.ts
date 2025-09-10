// hooks/use-work-complete.js
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useTodayWorkComplete() {
  const [data, setData] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWorkComplete() {
      try {
        setLoading(true)
        
        const { data: result, error } = await supabase
          .rpc('get_today_work_complete')

        if (error) throw error
        setData(result || 0)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('Error fetching work complete:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkComplete()
    
    const interval = setInterval(fetchWorkComplete, 30000)
    return () => clearInterval(interval)
  }, [])

  return { data, loading, error }
}