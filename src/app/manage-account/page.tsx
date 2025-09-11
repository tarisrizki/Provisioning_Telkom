"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { authService } from "@/lib/auth-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Save, 
  AlertTriangle,
  CheckCircle,
  Camera
} from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

export default function ManageAccountPage() {
  const { user, refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' })
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: ''
  })

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: ''
      })
    }
  }, [user])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim() || !profileForm.email.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields!' })
      return
    }

    if (!user) {
      setMessage({ type: 'error', text: 'User not found!' })
      return
    }

    setIsLoading(true)
    setMessage({ type: null, text: '' })

    try {
      const { error } = await authService.updateUser(user.id, {
        email: profileForm.email,
        name: `${profileForm.firstName} ${profileForm.lastName}`
      })

      if (error) {
        setMessage({ type: 'error', text: error })
        return
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      await refreshUser()
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#1B2431] flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400">Please log in to manage your account.</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-400 mb-8">Edit Profile</h1>
          </div>

          {/* Success/Error Messages */}
          {message.type && (
            <div className="mb-8">
              <div className={`p-6 rounded-xl flex items-center gap-4 backdrop-blur-sm ${
                message.type === 'success' 
                  ? 'bg-green-500/20 border border-green-400/40 text-green-300' 
                  : 'bg-red-500/20 border border-red-400/40 text-red-300'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <AlertTriangle className="h-6 w-6" />
                )}
                <span className="text-lg font-medium">{message.text}</span>
              </div>
            </div>
          )}

          {/* Profile Photo */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-blue-400/30">
                {profileForm.firstName.charAt(0)}{profileForm.lastName.charAt(0)}
              </div>
              <button className="absolute bottom-1 right-1 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
                <Camera className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/30 shadow-2xl">
            <form onSubmit={handleProfileSubmit} className="space-y-8">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-300 text-lg font-medium mb-3 block">First Name</Label>
                  <Input
                    value={profileForm.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-lg py-4 px-4 rounded-xl transition-all duration-300"
                    placeholder="Taris"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-lg font-medium mb-3 block">Last Name</Label>
                  <Input
                    value={profileForm.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-lg py-4 px-4 rounded-xl transition-all duration-300"
                    placeholder="Rizki"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-300 text-lg font-medium mb-3 block">Your email</Label>
                  <Input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-lg py-4 px-4 rounded-xl transition-all duration-300"
                    placeholder="bo.rizki@yahoo.com"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-lg font-medium mb-3 block">Phone Number</Label>
                  <Input
                    type="tel"
                    value={profileForm.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-lg py-4 px-4 rounded-xl transition-all duration-300"
                    placeholder="+62 8134 1945 5708"
                  />
                </div>
              </div>

              {/* Date of Birth & Gender */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-300 text-lg font-medium mb-3 block">Date of Birth</Label>
                  <Input
                    type="date"
                    value={profileForm.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-lg py-4 px-4 rounded-xl transition-all duration-300"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-lg font-medium mb-3 block">Gender</Label>
                  <Select value={profileForm.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-lg py-4 px-4 rounded-xl transition-all duration-300">
                      <SelectValue placeholder="Male" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="male" className="text-white hover:bg-slate-600 focus:bg-slate-600 text-lg">Male</SelectItem>
                      <SelectItem value="female" className="text-white hover:bg-slate-600 focus:bg-slate-600 text-lg">Female</SelectItem>
                      <SelectItem value="other" className="text-white hover:bg-slate-600 focus:bg-slate-600 text-lg">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-xl py-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Save className="h-5 w-5 mr-3" />
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
