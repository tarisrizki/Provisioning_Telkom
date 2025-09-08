"use client"

import { usePathname } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { SearchProvider } from "@/contexts/search-context"
import { AuthProvider } from "@/contexts/auth-context"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // Routes that should not use the main layout (login page)
  const publicRoutes = ["/", "/login"]
  
  const isPublicRoute = publicRoutes.includes(pathname)
  
  // Always wrap with AuthProvider
  return (
    <AuthProvider>
      {isPublicRoute ? (
        // Return children directly for public routes (like login)
        <div className="h-full w-full bg-[#1B2431]">{children}</div>
      ) : (
        // Wrap with SearchProvider and MainLayout for authenticated routes
        <SearchProvider>
          <MainLayout>{children}</MainLayout>
        </SearchProvider>
      )}
    </AuthProvider>
  )
}
