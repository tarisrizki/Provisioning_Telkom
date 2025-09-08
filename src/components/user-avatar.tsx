"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, User, Key, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

interface UserAvatarProps {
  name?: string
  role?: string
  avatarUrl?: string
}

export function UserAvatar({ name, role, avatarUrl }: UserAvatarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, logout } = useAuth()

  // Use auth user data if no props provided
  const displayName = name || user?.name || "User"
  const displayRole = role || (user?.role === 'admin' ? 'Admin' : 'User') || "User"

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
    setIsDropdownOpen(false)
    logout()
  }

  const handleManageAccount = () => {
    // Navigate to manage account page
    router.push('/manage-account')
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
            <Image 
              src={avatarUrl} 
              alt={displayName} 
              width={40}
              height={40}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{displayName.charAt(0)}</span>
          )}
        </div>
        
        {/* User Info */}
        <div className="text-left">
          <div className="text-white font-medium text-sm">{displayName}</div>
          <div className="text-gray-400 text-xs">{displayRole}</div>
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
