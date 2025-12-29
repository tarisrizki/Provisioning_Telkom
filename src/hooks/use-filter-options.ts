"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface FilterOptions {
  months: string[]
  channels: string[]
  serviceAreas: string[]
  branches: string[]
  clusters: string[]
  workZones: string[]
  loading: boolean
  error: string | null
}

export function useFilterOptions(): FilterOptions {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    months: [],
    channels: [],
    serviceAreas: [],
    branches: [],
    clusters: [],
    workZones: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchFilterOptions = async () => {
      if (!supabase) {
        setFilterOptions(prev => ({ ...prev, loading: false, error: 'Database not configured' }))
        return
      }
      
      try {
        setFilterOptions(prev => ({ ...prev, loading: true, error: null }))

        // Fetch unique values for each filter
        const [
          channelsData,
          serviceAreasData,
          branchesData,
          clustersData,
          workZonesData,
          datesData
        ] = await Promise.all([
          // Channels
          supabase
            .from('format_order')
            .select('channel')
            .not('channel', 'is', null)
            .not('channel', 'eq', ''),
          
          // Service Areas
          supabase
            .from('format_order')
            .select('service_area')
            .not('service_area', 'is', null)
            .not('service_area', 'eq', ''),
          
          // Branches
          supabase
            .from('format_order')
            .select('branch')
            .not('branch', 'is', null)
            .not('branch', 'eq', ''),
          
          // Clusters
          supabase
            .from('format_order')
            .select('cluster')
            .not('cluster', 'is', null)
            .not('cluster', 'eq', ''),
          
          // Work Zones
          supabase
            .from('format_order')
            .select('workzone')
            .not('workzone', 'is', null)
            .not('workzone', 'eq', ''),
          
          // All date columns for months extraction
          supabase
            .from('format_order')
            .select('date_created, status_date, booking_date, tanggal_ps, created_at, updated_at')
        ])

        // Process unique values
        const uniqueChannels = [...new Set(
          channelsData.data?.map(item => item.channel).filter(Boolean) || []
        )].sort()

        const uniqueServiceAreas = [...new Set(
          serviceAreasData.data?.map(item => item.service_area).filter(Boolean) || []
        )].sort()

        const uniqueBranches = [...new Set(
          branchesData.data?.map(item => item.branch).filter(Boolean) || []
        )].sort()

        const uniqueClusters = [...new Set(
          clustersData.data?.map(item => item.cluster).filter(Boolean) || []
        )].sort()

        const uniqueWorkZones = [...new Set(
          workZonesData.data?.map(item => item.workzone).filter(Boolean) || []
        )].sort()

        // Extract unique months from all date columns
        const uniqueMonthsSet = new Set<string>()
        
        if (datesData.data) {
          datesData.data.forEach(item => {
            // Check all date columns
            const dateColumns = [
              item.date_created,
              item.status_date,
              item.booking_date,
              item.tanggal_ps,
              item.created_at,
              item.updated_at
            ]
            
            dateColumns.forEach(dateStr => {
              if (dateStr) {
                try {
                  const date = new Date(dateStr)
                  if (!isNaN(date.getTime())) {
                    const month = date.getMonth() + 1
                    const year = date.getFullYear()
                    uniqueMonthsSet.add(`${month.toString().padStart(2, '0')}-${year}`)
                  }
                } catch {
                  console.warn('Invalid date format:', dateStr)
                }
              }
            })
          })
        }
        
        const uniqueMonths = [...uniqueMonthsSet].sort().reverse() // Most recent first

        // Convert month numbers to readable format
        const monthNames = uniqueMonths.map(monthYear => {
          if (!monthYear) return ''
          const [month, year] = monthYear.split('-')
          const monthNamesList = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
          ]
          const monthIndex = parseInt(month) - 1
          if (monthIndex >= 0 && monthIndex < 12) {
            return `${monthNamesList[monthIndex]} ${year}`
          }
          return ''
        }).filter(Boolean) // Remove any empty strings

        setFilterOptions({
          months: monthNames,
          channels: uniqueChannels,
          serviceAreas: uniqueServiceAreas,
          branches: uniqueBranches,
          clusters: uniqueClusters,
          workZones: uniqueWorkZones,
          loading: false,
          error: null
        })

      } catch (error) {
        console.error('Error fetching filter options:', error)
        setFilterOptions(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch filter options'
        }))
      }
    }

    fetchFilterOptions()
  }, [])

  return filterOptions
}
