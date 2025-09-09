import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useREStats() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchREStats() {
      try {
        setLoading(true)
        
        // Menggunakan view
        const { data: result, error } = await supabase
          .from('monthly_re_stats')
          .select('total_re')
          .single()

        // Atau menggunakan function
        // const { data: result, error } = await supabase
        //   .rpc('get_monthly_re_count')

        if (error) throw error
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchREStats()
  }, [])

  return { data, loading, error }
}