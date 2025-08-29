"use client"

import { usePathname } from "next/navigation"
import { MainLayout } from "@/components/main-layout"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // Routes that should not use the main layout (login page)
  const publicRoutes = ["/", "/login"]
  
  const isPublicRoute = publicRoutes.includes(pathname)
  
  if (isPublicRoute) {
    // Return children directly for public routes (like login)
    return <div className="h-full w-full bg-[#1B2431]">{children}</div>
  }
  
  // Wrap with MainLayout for authenticated routes
  return <MainLayout>{children}</MainLayout>
}
