"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService, type User } from '@/lib/auth-service'

// Helper to set cookies
function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

// Helper to delete cookies
function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for saved auth state on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth-user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('auth-user')
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { user: loggedInUser, error } = await authService.login({ username, password })

      if (error || !loggedInUser) {
        return { success: false, error: error || 'Login failed' }
      }

      setUser(loggedInUser)
      setIsAuthenticated(true)
      
      // Save to localStorage
      localStorage.setItem('auth-user', JSON.stringify(loggedInUser))
      
      // Set cookies for middleware authentication
      setCookie('auth-token', 'authenticated', 7)
      setCookie('user-info', JSON.stringify(loggedInUser), 7)
      
      return { success: true }
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const refreshUser = async () => {
    if (user?.id) {
      const { user: updatedUser } = await authService.getUserById(user.id)
      if (updatedUser) {
        setUser(updatedUser)
        localStorage.setItem('auth-user', JSON.stringify(updatedUser))
      }
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('auth-user')
    
    // Clear cookies
    deleteCookie('auth-token')
    deleteCookie('user-info')
    
    window.location.href = '/'
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      isAdmin,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
