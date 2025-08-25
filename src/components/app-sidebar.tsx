"use client"

import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  FileText, 
  Database,
  Upload as UploadIcon
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
} from "@/components/ui/sidebar"

const mainNav = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Monitoring", href: "/monitoring", icon: BarChart3 },
  { title: "Format Order", href: "/upload", icon: UploadIcon },
  { title: "Report", href: "/laporan", icon: FileText },
]

const userNav = [
  { title: "User login", href: "/login", icon: Users },
]

const utilityNav = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Log out", href: "/logout", icon: Database },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="w-64 bg-[#282c34] text-white border-r border-[#404552]">
      <SidebarHeader className="border-b border-[#404552] p-4">
        <div className="text-xl font-bold">
          <span className="text-blue-400">Provisioning</span>
          <span className="text-white">TSEL</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1 flex flex-col">
        {/* Main Navigation */}
        <div className="p-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNav.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className={`
                          w-full flex items-center space-x-3 px-3 py-3 rounded-md transition-colors mb-1
                          ${isActive 
                            ? "bg-blue-500 text-white" 
                            : "text-white hover:bg-[#3a3f4b]"
                          }
                        `}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* User Section */}
        <div className="p-4 mt-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {userNav.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className={`
                          w-full flex items-center space-x-3 px-3 py-3 rounded-md transition-colors mb-1
                          ${isActive 
                            ? "bg-blue-500 text-white" 
                            : "text-white hover:bg-[#3a3f4b]"
                          }
                        `}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-[#404552] p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityNav.map((item) => {
                const isActive = pathname === item.href
                const isLogout = item.title === "Log out"
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-3 rounded-md transition-colors mb-1
                        ${isActive 
                          ? "bg-blue-500 text-white" 
                          : isLogout 
                            ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            : "text-white hover:bg-[#3a3f4b]"
                        }
                      `}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
