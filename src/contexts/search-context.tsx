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
  searchError: string | null
  recentSearches: string[]
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recent-searches')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const addToRecentSearches = useCallback((query: string) => {
    const trimmed = query.trim()
    if (trimmed.length < 2) return
    
    setRecentSearches(prev => {
      const updated = [trimmed, ...prev.filter(q => q !== trimmed)].slice(0, 5)
      if (typeof window !== 'undefined') {
        localStorage.setItem('recent-searches', JSON.stringify(updated))
      }
      return updated
    })
  }, [])

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setSearchError(null)
      return
    }

    setIsSearching(true)
    setSearchError(null)
    
    try {
      const results: SearchResult[] = []
      
      // Search in navigation/pages
      const pages = [
        { title: 'Dashboard', description: 'View analytics and metrics', url: '/dashboard', page: 'Dashboard' },
        { title: 'Format Order', description: 'Manage work orders and provisioning', url: '/format-order', page: 'Format Order' },
        { title: 'Laporan', description: 'View reports and data analysis', url: '/laporan', page: 'Laporan' },
        { title: 'Monitoring', description: 'Monitor system performance', url: '/monitoring', page: 'Monitoring' },
        { title: 'User Management', description: 'Manage user accounts', url: '/user-management', page: 'User Management' },
        { title: 'Manage Account', description: 'Account management', url: '/manage-account', page: 'Manage Account' },
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
        // First try exact matches for order_id, workorder, and service_no
        const { data: exactMatches, error: exactError } = await supabase
          .from('format_order')
          .select('*')
          .or(`order_id.eq.${query},workorder.eq.${query},service_no.eq.${query}`)
          .limit(3)

        const exactMatchIds = new Set<string>()

        if (!exactError && exactMatches && exactMatches.length > 0) {
          exactMatches.forEach((order, index) => {
            exactMatchIds.add(order.order_id)
            results.push({
              id: `exact-${order.order_id}-${index}`,
              title: `🎯 ${order.order_id} (Exact Match)`,
              description: `${order.workorder || 'N/A'} - ${order.customer_name || order.channel || 'N/A'} - ${order.status_bima || 'N/A'}`,
              page: 'Format Order',
              url: `/format-order?openDetail=${order.order_id}`,
              data: order
            })
          })
        }

        // Then search for partial matches (only if we need more results)
        const remainingSlots = 10 - results.length
        if (remainingSlots > 0) {
          const { data: formatOrders, error } = await supabase
            .from('format_order')
            .select('order_id, channel, workorder, customer_name, status_bima, mitra, service_no, address')
            .or(`order_id.ilike.%${query}%,workorder.ilike.%${query}%,channel.ilike.%${query}%,customer_name.ilike.%${query}%,status_bima.ilike.%${query}%,mitra.ilike.%${query}%,service_no.ilike.%${query}%`)
            .limit(remainingSlots)

          if (!error && formatOrders && formatOrders.length > 0) {
            formatOrders.forEach((order, index) => {
              // Skip if this order was already added as exact match
              if (!exactMatchIds.has(order.order_id)) {
                results.push({
                  id: `order-${order.order_id}-${index}`,
                  title: `${order.order_id}`,
                  description: `${order.workorder || 'N/A'} - ${order.customer_name || order.channel || 'N/A'} - ${order.status_bima || 'N/A'}`,
                  page: 'Format Order',
                  url: '/format-order',
                  data: order
                })
              }
            })
          }
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
      
      // Add to recent searches if we found results
      if (results.length > 0) {
        addToRecentSearches(query)
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchError('Search failed. Please try again.')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [addToRecentSearches])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setSearchResults([])
    setSearchError(null)
  }, [])

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      searchResults,
      isSearching,
      performSearch,
      clearSearch,
      searchError,
      recentSearches
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
