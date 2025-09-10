'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

interface UserInfo {
  id: string
  username: string
  name: string
  role: 'admin' | 'user'
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<UserInfo | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get user info from cookie
        const userInfoCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('user-info='))
          ?.split('=')[1]

        if (!userInfoCookie) {
          router.push('/')
          return
        }

        const userInfo: UserInfo = JSON.parse(decodeURIComponent(userInfoCookie))
        
        // Check if admin access is required
        if (requireAdmin && userInfo.role !== 'admin') {
          router.push('/dashboard')
          return
        }

        setUser(userInfo)
        setIsLoading(false)
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/')
      }
    }

    checkAuth()
  }, [router, requireAdmin])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
