"use client"

import { 
  Home, 
  BarChart3, 
  Users, 
  Database,
  Upload as UploadIcon
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

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
  { title: "Format Order", href: "/format-order", icon: UploadIcon },
]

// User navigation will be conditionally rendered based on role

const utilityNav = [
  { title: "Log out", href: "/logout", icon: Database },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { isAdmin, logout } = useAuth()

  // Admin-only navigation
  const adminNav = [
    { title: "User Management", href: "/user-management", icon: Users },
  ]

  return (
    <Sidebar className="w-64 bg-[#282c34] text-white">
      <SidebarHeader className="p-4">
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

        {/* Admin Section - Only show for admins */}
        {isAdmin && (
          <div className="p-4 mt-auto">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminNav.map((item) => {
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
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityNav.map((item) => {
                const isActive = pathname === item.href
                const isLogout = item.title === "Log out"
                
                if (isLogout) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-3 py-3 rounded-md transition-colors mb-1 text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

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
      </SidebarFooter>
    </Sidebar>
  )
}
