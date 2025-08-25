"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserAvatar } from "@/components/user-avatar"

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({
    firstName: "Taris",
    lastName: "Rizki",
    email: "bo.mraz@yahoo.com",
    phoneNumber: "+62 8134 1945 1708",
    dateOfBirth: "11-03-1994",
    gender: "Male"
  })

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    // Handle save logic here
    console.log("Profile data saved:", profileData)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center space-x-4 mb-6">
        <UserAvatar />
        <div>
          <h2 className="text-xl font-semibold text-white">Manage Account</h2>
          <p className="text-gray-400">Update your profile information</p>
        </div>
      </div>

      <Card className="bg-[#334155] border-0">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-white text-2xl font-semibold">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
                <UserAvatar />
              </div>
            </div>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
              Edit Photo
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-300 text-sm font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                value={profileData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-300 text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={profileData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your last name"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                Your email
              </Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-300 text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                value={profileData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-gray-300 text-sm font-medium">
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-300 text-sm font-medium">
                Gender
              </Label>
              <Select value={profileData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="Male" className="text-white hover:bg-gray-600">Male</SelectItem>
                  <SelectItem value="Female" className="text-white hover:bg-gray-600">Female</SelectItem>
                  <SelectItem value="Other" className="text-white hover:bg-gray-600">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
