"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple login validation
    if (username === "admin" && password === "admin") {
      // Redirect to dashboard or set auth state
      window.location.href = "/dashboard"
    } else {
      setError("Username atau password salah!")
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1d29] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#282c34] rounded-lg p-8 shadow-xl">
          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center mb-8">
            Sign in
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username/Email Field */}
            <div>
              <input
                type="text"
                placeholder="Username/Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#3a3f4b] text-white placeholder-gray-400 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#3a3f4b] text-white placeholder-gray-400 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500 transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-white hover:text-green-400 text-sm transition-colors">
                Lupa password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Sign in
            </button>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <span className="text-white">Dont have an account? </span>
              <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
