// hooks/use-today-work-fail.js
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useTodayWorkFail() {
  const [data, setData] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTodayWorkFail() {
      try {
        setLoading(true)
        
        const { data: result, error } = await supabase
          .rpc('get_today_work_fail')

        if (error) throw error
        setData(result || 0)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching today work fail:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTodayWorkFail()
    
    const interval = setInterval(fetchTodayWorkFail, 30000)
    return () => clearInterval(interval)
  }, [])

  return { data, loading, error }
}