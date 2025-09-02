"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#1B2431] overflow-hidden">
        {/* Sidebar - Fixed position */}
        <AppSidebar />
        
        {/* Main Content Area - Takes full remaining width */}
        <div className="flex-1 flex flex-col min-w-0 w-full bg-[#1B2431]">
          {/* Top Bar - Spans the full width of content area */}
          <TopBar />
          
          {/* Main Content - Scrollable area below top bar with overscroll prevention */}
          <main 
            className="flex-1 overflow-y-auto bg-[#1B2431] w-full scroll-container" 
            style={{ 
              overscrollBehavior: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="p-4 md:p-6 w-full min-h-full bg-[#1B2431]">
              <div className="w-full min-h-full bg-[#1B2431]">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
