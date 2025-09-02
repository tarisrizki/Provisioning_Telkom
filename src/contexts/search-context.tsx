"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface SearchResult {
  id: string
  title: string
  description: string
  page: string
  url: string
  data?: unknown
}

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: SearchResult[]
  isSearching: boolean
  performSearch: (query: string) => void
  clearSearch: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    
    try {
      const results: SearchResult[] = []
      
      // Search in navigation/pages
      const pages = [
        { title: 'Dashboard', description: 'View analytics and metrics', url: '/dashboard', page: 'Dashboard' },
        { title: 'Format Order', description: 'Manage work orders and provisioning', url: '/format-order', page: 'Format Order' },
        { title: 'Laporan', description: 'View reports and data analysis', url: '/laporan', page: 'Laporan' },
        { title: 'Monitoring', description: 'Monitor system performance', url: '/monitoring', page: 'Monitoring' },
        { title: 'Settings', description: 'Application settings', url: '/settings', page: 'Settings' },
        { title: 'Test Connection', description: 'Test database connection', url: '/test-connection', page: 'Test Connection' },
        { title: 'Test Data', description: 'Test data functionality', url: '/test-data', page: 'Test Data' },
      ]

      // Search in pages
      pages.forEach((page, index) => {
        if (page.title.toLowerCase().includes(query.toLowerCase()) || 
            page.description.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: `page-${index}`,
            title: page.title,
            description: page.description,
            page: page.page,
            url: page.url
          })
        }
      })

      // Search in Supabase format_order data
      try {
        const { data: formatOrders, error } = await supabase
          .from('format_order')
          .select('order_id, channel, workorder, customer_name, status_bima, mitra')
          .or(`order_id.ilike.%${query}%,workorder.ilike.%${query}%,channel.ilike.%${query}%,customer_name.ilike.%${query}%,status_bima.ilike.%${query}%,mitra.ilike.%${query}%`)
          .limit(5)

        if (!error && formatOrders && formatOrders.length > 0) {
          formatOrders.forEach((order, index) => {
            results.push({
              id: `order-${order.order_id}-${index}`,
              title: `Order ${order.order_id}`,
              description: `${order.workorder || 'N/A'} - ${order.channel || 'N/A'} - ${order.status_bima || 'N/A'}`,
              page: 'Format Order',
              url: '/format-order',
              data: order
            })
          })
        }
      } catch (supabaseError) {
        console.log('Supabase search error:', supabaseError)
        // Continue with other search results even if Supabase search fails
      }

      // Add quick access results based on search terms
      const quickAccess = [
        { terms: ['order', 'work', 'bima', 'manja', 'mitra'], title: 'Format Order Management', page: 'Format Order', url: '/format-order' },
        { terms: ['report', 'laporan', 'data', 'analysis'], title: 'Data Reports', page: 'Laporan', url: '/laporan' },
        { terms: ['monitor', 'performance', 'system'], title: 'System Monitoring', page: 'Monitoring', url: '/monitoring' },
        { terms: ['dashboard', 'analytics', 'metrics'], title: 'Analytics Dashboard', page: 'Dashboard', url: '/dashboard' },
      ]

      quickAccess.forEach((item, index) => {
        if (item.terms.some(term => query.toLowerCase().includes(term))) {
          // Only add if not already in results
          if (!results.some(r => r.url === item.url && r.title.includes(item.title))) {
            results.push({
              id: `quick-${index}`,
              title: item.title,
              description: `Quick access to ${item.title.toLowerCase()}`,
              page: item.page,
              url: item.url
            })
          }
        }
      })

      setSearchResults(results.slice(0, 8)) // Limit to 8 results
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setSearchResults([])
  }, [])

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      searchResults,
      isSearching,
      performSearch,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
