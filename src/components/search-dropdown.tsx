"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Search, FileText, BarChart3, Database, Settings, Loader2 } from 'lucide-react'
import { useSearch } from '@/contexts/search-context'

interface SearchDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchDropdown({ isOpen, onClose }: SearchDropdownProps) {
  const { searchResults, isSearching, searchQuery, clearSearch } = useSearch()
  const router = useRouter()

  const handleResultClick = (url: string) => {
    router.push(url)
    clearSearch()
    onClose()
  }

  const getIcon = (page: string) => {
    switch (page) {
      case 'Dashboard':
        return <BarChart3 className="h-4 w-4" />
      case 'Format Order':
        return <FileText className="h-4 w-4" />
      case 'Laporan':
        return <Database className="h-4 w-4" />
      case 'Monitoring':
        return <BarChart3 className="h-4 w-4" />
      case 'Settings':
        return <Settings className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-[#3a3f4b] border border-[#475569] rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto">
      {isSearching ? (
        <div className="p-4 text-center">
          <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-blue-400" />
          <p className="text-gray-400 text-sm">Searching...</p>
        </div>
      ) : searchQuery && searchResults.length === 0 ? (
        <div className="p-4 text-center">
          <Search className="h-8 w-8 mx-auto mb-2 text-gray-500" />
          <p className="text-gray-400 text-sm">No results found for &ldquo;{searchQuery}&rdquo;</p>
          <p className="text-gray-500 text-xs mt-1">Try searching for pages, orders, reports, or data</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="py-2">
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-[#475569]">
            Search Results ({searchResults.length})
          </div>
          {searchResults.map((result) => (
            <button
              key={result.id}
              onClick={() => handleResultClick(result.url)}
              className="w-full px-3 py-3 text-left hover:bg-[#475569] transition-colors border-b border-[#404552] last:border-b-0 focus:outline-none focus:bg-[#475569]"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5 text-blue-400">
                  {getIcon(result.page)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-white truncate">
                      {result.title}
                    </h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                      {result.page}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {result.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : searchQuery ? (
        <div className="p-4 text-center">
          <p className="text-gray-400 text-sm">Start typing to search...</p>
        </div>
      ) : null}
    </div>
  )
}
