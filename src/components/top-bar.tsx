"use client"

import { Bell, ChevronDown, Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserAvatar } from "@/components/user-avatar"

export function TopBar() {
  return (
    <div className="h-16 bg-[#282c34] border-b border-[#404552] px-6 flex items-center w-screen">
      {/* Brand/Logo Section */}
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="text-white hover:text-blue-400" />
      </div>

      {/* Search Bar - Left Aligned */}
      <div className="max-w-md ml-15 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-[#3a3f4b] text-white placeholder-gray-400 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Spacer to push right content to the far right */}
      <div className="flex-1"></div>

      {/* Right Section - Notification & User Profile */}
      <div className="flex items-center space-x-6">
        {/* Mobile Search Button */}
        <button className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
          <Search className="h-5 w-5" />
        </button>

        {/* Notification Icon */}
        <div className="relative">
          <Bell className="h-6 w-6 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#3a3f4b] px-2 py-1 rounded-lg transition-colors">
          <UserAvatar name="Mikel New" role="Admin" />
          <div className="text-white hidden sm:block">
            <div className="text-sm font-medium">Mikel New</div>
            <div className="text-xs text-gray-400">Admin</div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
        </div>
      </div>
    </div>
  )
}