"use client"

import { 
  BarChart3, 
  FileText, 
  Home, 
  Settings, 
  LogOut 
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const mainNav = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Monitoring", href: "/monitoring" },
  { title: "Format Order", href: "/laporan" },
  { title: "Report", href: "/laporan" },
]

const utilityNav = [
  { title: "User login", href: "/" },
  { title: "Settings", href: "/settings" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div 
      className="w-64 bg-[#282c34] text-white border-r border-[#404552] flex flex-col"
      style={{ backgroundColor: '#282c34' }}
    >
      {/* Header */}
      <div 
        className="border-b border-[#404552] p-6"
        style={{ backgroundColor: '#282c34' }}
      >
        <div className="text-xl font-bold">
          <span className="text-blue-400">Provisioning</span>
          <span className="text-white">TSEL</span>
        </div>
      </div>
      
      {/* Content */}
      <div 
        className="flex-1 p-4 overflow-y-auto"
        style={{ backgroundColor: '#282c34' }}
      >
        {/* Main Navigation */}
        <div className="mb-6">
          <ul className="space-y-2">
            {mainNav.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <li key={item.title}>
                  <Link 
                    href={item.href}
                    className={`
                      block w-full px-3 py-2 rounded-md transition-colors text-center
                      ${isActive 
                        ? "bg-blue-500 text-white" 
                        : "text-white hover:bg-[#404552]"
                      }
                    `}
                    style={isActive ? { backgroundColor: '#3b82f6' } : {}}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        
        {/* Separator */}
        <div className="border-t border-[#404552] my-4"></div>
        
        {/* Utility Navigation */}
        <div className="mb-6">
          <ul className="space-y-2">
            {utilityNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.title}>
                  <Link 
                    href={item.href}
                    className={`
                      block w-full px-3 py-2 rounded-md transition-colors text-center
                      ${isActive 
                        ? "bg-blue-500 text-white" 
                        : "text-white hover:bg-[#404552]"
                      }
                    `}
                    style={isActive ? { backgroundColor: '#3b82f6' } : {}}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        
        {/* Separator */}
        <div className="border-t border-[#404552] my-4"></div>
        
        {/* Logout */}
        <div>
          <Link 
            href="#"
            className="block w-full px-3 py-2 rounded-md text-white hover:bg-[#404552] transition-colors text-center"
          >
            Log out
          </Link>
        </div>
      </div>
    </div>
  )
}
