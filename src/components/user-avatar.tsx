"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, User, Key, LogOut } from "lucide-react"

interface UserAvatarProps {
  name?: string
  role?: string
  avatarUrl?: string
}

export function UserAvatar({ name = "Moni Roy", role = "Admin", avatarUrl }: UserAvatarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...')
    // You can redirect to login page or clear auth tokens
    setIsDropdownOpen(false)
  }

  const handleManageAccount = () => {
    // Add manage account logic here
    console.log('Opening manage account...')
    setIsDropdownOpen(false)
  }

  const handleChangePassword = () => {
    // Add change password logic here
    console.log('Opening change password...')
    setIsDropdownOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#334155] transition-colors cursor-pointer"
      >
        {/* Avatar Image */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={name} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{name.charAt(0)}</span>
          )}
        </div>
        
        {/* User Info */}
        <div className="text-left">
          <div className="text-white font-medium text-sm">{name}</div>
          <div className="text-gray-400 text-xs">{role}</div>
        </div>
        
        {/* Chevron Icon */}
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#1e293b] border border-[#334155] rounded-lg shadow-lg z-50">
          {/* Menu Items */}
          <div className="py-2">
            {/* Manage Account */}
            <button
              onClick={handleManageAccount}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-[#334155] transition-colors"
            >
              <div className="w-5 h-5 text-blue-400">
                <User className="w-5 h-5" />
              </div>
              <span className="text-sm">Manage Account</span>
            </button>

            {/* Change Password */}
            <button
              onClick={handleChangePassword}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-[#334155] transition-colors"
            >
              <div className="w-5 h-5 text-pink-400">
                <Key className="w-5 h-5" />
              </div>
              <span className="text-sm">Change Password</span>
            </button>

            {/* Divider */}
            <div className="border-t border-[#334155] my-1"></div>

            {/* Log out */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-[#334155] transition-colors"
            >
              <div className="w-5 h-5 text-red-400">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="text-sm">Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
