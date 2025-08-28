"use client"

import { Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserAvatar } from "@/components/user-avatar"

export function TopBar() {
  return (
    <header className="w-full h-16 bg-sidebar flex items-center justify-between px-4 md:px-6 transition-all duration-300 ease-in-out shrink-0">
      {/* Left Section - Sidebar Trigger */}
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="text-white hover:text-blue-400 transition-colors" />
        
        {/* Brand/Logo - Hidden on mobile when sidebar is open */}
     
      </div>

      {/* Center Section - Search Bar (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-[#3a3f4b] text-white placeholder-gray-400 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Right Section - Actions & User Profile */}
      <div className="flex items-center space-x-3">
        {/* Mobile Search Button */}
        <button className="md:hidden p-2 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-[#3a3f4b]">
          <Search className="h-5 w-5" />
        </button>

        {/* User Profile */}
        <UserAvatar name="Moni Roy" role="Admin" />
      </div>
    </header>
  )
}