"use client"

import { Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserAvatar } from "@/components/user-avatar"
import { useSearch } from "@/contexts/search-context"
import { SearchDropdown } from "@/components/search-dropdown"
import { useState, useEffect, useRef, useCallback } from "react"

export function TopBar() {
  const { searchQuery, setSearchQuery, performSearch, clearSearch, searchResults } = useSearch()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery)
        setIsSearchOpen(true)
        setSelectedIndex(-1)
      } else {
        setIsSearchOpen(false)
        setSelectedIndex(-1)
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery, performSearch])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
  }

  const handleSearchFocus = () => {
    setIsSearchOpen(true)
  }

  const handleSearchBlur = () => {
    // Delay closing to allow clicks on results
    setTimeout(() => {
      setIsSearchOpen(false)
      setSelectedIndex(-1)
    }, 150)
  }

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false)
    setIsMobileSearchOpen(false)
    setSelectedIndex(-1)
    clearSearch()
  }, [clearSearch])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchOpen || searchResults.length === 0) {
      if (e.key === 'Escape') {
        closeSearch()
        searchInputRef.current?.blur()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          const result = searchResults[selectedIndex]
          window.location.href = result.url
          closeSearch()
        }
        break
      case 'Escape':
        closeSearch()
        searchInputRef.current?.blur()
        break
    }
  }

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen)
    if (!isMobileSearchOpen) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 100)
    } else {
      closeSearch()
    }
  }

  return (
    <header className="w-full h-16 bg-sidebar flex items-center justify-between px-4 md:px-6 transition-all duration-300 ease-in-out shrink-0">
      {/* Left Section - Sidebar Trigger and Search Bar */}
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="text-white hover:text-blue-400 transition-colors" />
        
        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search pages, orders, reports..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onKeyDown={handleKeyDown}
              className="w-80 pl-11 pr-4 py-3 text-sm bg-[#3a3f4b] text-white placeholder-gray-400 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              autoComplete="off"
              spellCheck="false"
            />
            {searchQuery && (
              <button
                onClick={closeSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                type="button"
              >
                ✕
              </button>
            )}
            <SearchDropdown 
              isOpen={isSearchOpen} 
              onClose={closeSearch}
              selectedIndex={selectedIndex}
            />
          </div>
        </div>
      </div>

      {/* Right Section - Actions & User Profile */}
      <div className="flex items-center space-x-3">
        {/* Mobile Search Button */}
        <button 
          onClick={toggleMobileSearch}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-[#3a3f4b]"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* User Profile */}
        <UserAvatar />
      </div>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#282c34] border-t border-[#475569] p-4 z-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={mobileSearchInputRef}
              type="text"
              placeholder="Search pages, orders, reports..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="w-full pl-11 pr-10 py-3 text-sm bg-[#3a3f4b] text-white placeholder-gray-400 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              onClick={closeSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              type="button"
            >
              ✕
            </button>
            <SearchDropdown 
              isOpen={isSearchOpen} 
              onClose={closeSearch}
              selectedIndex={selectedIndex}
            />
          </div>
        </div>
      )}
    </header>
  )
}