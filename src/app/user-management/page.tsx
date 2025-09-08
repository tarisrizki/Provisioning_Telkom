"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { authService, type User, type CreateUserData, type UpdateUserData } from "@/lib/auth-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Shield, 
  User as UserIcon,
  Search,
  Filter,
  ChevronDown,
  X,
  Save,
  AlertTriangle,
  Loader2
} from "lucide-react"

export default function UserManagementPage() {
  const { user, isAdmin } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load users on component mount
  useEffect(() => {
    loadUsers()
  }, [])

  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin) {
      window.location.href = '/dashboard'
    }
  }, [user, isAdmin])

  // Load users from Supabase
  const loadUsers = async () => {
    setIsLoading(true)
    setError(null)
    
    const { users: fetchedUsers, error: fetchError } = await authService.getAllUsers()
    
    if (fetchError) {
      setError(fetchError)
    } else {
      setUsers(fetchedUsers)
    }
    
    setIsLoading(false)
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'user'
    })
    setFormErrors({})
  }

  // Handle create user
  const handleCreateUser = async () => {
    setIsSubmitting(true)
    setFormErrors({})
    
    const { isValid, errors } = authService.validateUserData(formData)
    
    if (!isValid) {
      setFormErrors(errors)
      setIsSubmitting(false)
      return
    }

    const { user: newUser, error } = await authService.createUser(formData as CreateUserData)
    
    if (error) {
      setFormErrors({ general: error })
    } else if (newUser) {
      setUsers(prev => [newUser, ...prev])
      setShowAddModal(false)
      resetForm()
    }
    
    setIsSubmitting(false)
  }

  // Handle edit user
  const handleEditUser = (userToEdit: User) => {
    setEditingUser(userToEdit)
    setFormData({
      name: userToEdit.name,
      username: userToEdit.username,
      email: userToEdit.email,
      password: '', // Don't prefill password
      role: userToEdit.role
    })
    setShowEditModal(true)
  }

  // Handle update user
  const handleUpdateUser = async () => {
    if (!editingUser) return
    
    setIsSubmitting(true)
    setFormErrors({})
    
    const updateData: UpdateUserData = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      role: formData.role
    }
    
    // Only include password if it's provided
    if (formData.password.trim()) {
      updateData.password = formData.password
    }
    
    const { isValid, errors } = authService.validateUserData(updateData)
    
    if (!isValid) {
      setFormErrors(errors)
      setIsSubmitting(false)
      return
    }

    const { user: updatedUser, error } = await authService.updateUser(editingUser.id, updateData)
    
    if (error) {
      setFormErrors({ general: error })
    } else if (updatedUser) {
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u))
      setShowEditModal(false)
      setEditingUser(null)
      resetForm()
    }
    
    setIsSubmitting(false)
  }

  // Handle delete user
  const handleDeleteUser = (userToDelete: User) => {
    setDeletingUser(userToDelete)
    setShowDeleteModal(true)
  }

  // Confirm delete user
  const confirmDeleteUser = async () => {
    if (!deletingUser) return
    
    setIsSubmitting(true)
    
    const { success, error } = await authService.deleteUser(deletingUser.id)
    
    if (error) {
      setError(error)
    } else if (success) {
      setUsers(prev => prev.filter(u => u.id !== deletingUser.id))
      setSelectedUsers(prev => prev.filter(id => id !== deletingUser.id))
      setShowDeleteModal(false)
      setDeletingUser(null)
    }
    
    setIsSubmitting(false)
  }

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id))
    }
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#1B2431] flex items-center justify-center">
        <Card className="bg-[#1e293b] border-[#334155]">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1B2431] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
            <p className="text-gray-400 text-lg mt-2">Manage system users and permissions</p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah pengguna
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="bg-[#1e293b] border-[#334155]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#3a3f4b] border-[#475569] text-white placeholder-gray-400"
                  />
                </div>
                <Button variant="outline" className="border-[#475569] text-gray-300 hover:bg-[#3a3f4b]">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter By
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" className="border-[#475569] text-gray-300 hover:bg-[#3a3f4b]">
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Date
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-[#1e293b] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#334155]">
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded bg-[#3a3f4b] border-[#475569]"
                      />
                    </th>
                    <th className="text-left p-4 text-gray-300 font-medium">Nama</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Role</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Username</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Email</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Date Created</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[#334155] hover:bg-[#334155]/30">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded bg-[#3a3f4b] border-[#475569]"
                        />
                      </td>
                      <td className="p-4 text-white font-medium">{user.name}</td>
                      <td className="p-4">
                        <Badge 
                          variant={user.role === 'admin' ? 'default' : 'secondary'}
                          className={user.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}
                        >
                          {user.role === 'admin' ? (
                            <><Shield className="h-3 w-3 mr-1" />Admin</>
                          ) : (
                            <><UserIcon className="h-3 w-3 mr-1" />User</>
                          )}
                        </Badge>
                      </td>
                      <td className="p-4 text-gray-300">{user.username}</td>
                      <td className="p-4 text-gray-300">{user.email}</td>
                      <td className="p-4 text-gray-300">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-blue-400 hover:bg-blue-400/10"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-400 hover:bg-red-400/10"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No users found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-400" />
                <p className="text-gray-400">Loading users...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {error && (
          <Card className="bg-red-900/20 border-red-500/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="text-red-400">{error}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={loadUsers}
                  className="ml-auto"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-[#1e293b] border-[#334155] w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Add New User</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formErrors.general && (
                <div className="p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-sm">
                  {formErrors.general}
                </div>
              )}
              
              <div>
                <Label className="text-gray-300">Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-[#3a3f4b] border-[#475569] text-white"
                  placeholder="Full name"
                />
                {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Username</Label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="bg-[#3a3f4b] border-[#475569] text-white"
                  placeholder="Username"
                />
                {formErrors.username && <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-[#3a3f4b] border-[#475569] text-white"
                  placeholder="email@example.com"
                />
                {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Password</Label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-[#3a3f4b] border-[#475569] text-white"
                  placeholder="Password"
                />
                {formErrors.password && <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Role</Label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-[#3a3f4b] border border-[#475569] text-white rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleCreateUser}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Create User
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="border-[#475569]"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-[#1e293b] border-[#334155] w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Edit User</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingUser(null)
                    resetForm()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formErrors.general && (
                <div className="p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-sm">
                  {formErrors.general}
                </div>
              )}
              
              <div>
                <Label className="text-gray-300">Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-[#3a3f4b] border-[#475569] text-white"
                  placeholder="Full name"
                />
                {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Username</Label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="bg-[#3a3f4b] border-[#475569] text-white"
                  placeholder="Username"
                />
                {formErrors.username && <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-[#3a3f4b] border-[#475569] text-white"
                  placeholder="email@example.com"
                />
                {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Password (leave blank to keep current)</Label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-[#3a3f4b] border-[#475569] text-white"
                  placeholder="New password (optional)"
                />
                {formErrors.password && <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Role</Label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-[#3a3f4b] border border-[#475569] text-white rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleUpdateUser}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Update User
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingUser(null)
                    resetForm()
                  }}
                  className="border-[#475569]"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && deletingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-[#1e293b] border-[#334155] w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                Delete User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Are you sure you want to delete <strong>{deletingUser.name}</strong>? 
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={confirmDeleteUser}
                  disabled={isSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                  Delete User
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeletingUser(null)
                  }}
                  className="border-[#475569]"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
