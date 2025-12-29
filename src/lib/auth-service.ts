// Internal Auth Service with LocalStorage Support
// CRUD operations stored in browser localStorage

export interface User {
  id: string
  username: string
  email: string
  name: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  avatar_url?: string
  created_at: string
  updated_at: string
  last_login?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface CreateUserData {
  username: string
  email: string
  name: string
  password: string
  role: 'admin' | 'user'
}

export interface UpdateUserData {
  username?: string
  email?: string
  name?: string
  password?: string
  role?: 'admin' | 'user'
  status?: 'active' | 'inactive'
}

interface InternalUser extends User {
  password: string
}

// Default users - will be loaded into localStorage on first run
const DEFAULT_USERS: InternalUser[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@telkom.co.id',
    name: 'Administrator',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'user',
    email: 'user@telkom.co.id',
    name: 'User Biasa',
    password: 'user123',
    role: 'user',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    username: 'taris',
    email: 'taris@telkom.co.id',
    name: 'Taris Rizki',
    password: 'taris123',
    role: 'admin',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

const STORAGE_KEY = 'provisioning_users'

class AuthService {
  private users: InternalUser[] = []

  constructor() {
    this.loadUsers()
  }

  // Load users from localStorage or initialize with defaults
  private loadUsers(): void {
    if (typeof window === 'undefined') {
      this.users = [...DEFAULT_USERS]
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        this.users = JSON.parse(stored)
      } else {
        this.users = [...DEFAULT_USERS]
        this.saveUsers()
      }
    } catch {
      this.users = [...DEFAULT_USERS]
    }
  }

  // Save users to localStorage
  private saveUsers(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users))
    } catch {
      // Ignore localStorage errors
    }
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<{ user: User | null; error: string | null }> {
    try {
      this.loadUsers()

      const foundUser = this.users.find(
        u => u.username === credentials.username && u.status === 'active'
      )

      if (!foundUser) {
        return { user: null, error: 'Username atau password salah' }
      }

      if (credentials.password !== foundUser.password) {
        return { user: null, error: 'Username atau password salah' }
      }

      foundUser.last_login = new Date().toISOString()
      this.saveUsers()

      const { password: _, ...userWithoutPassword } = foundUser
      return { user: userWithoutPassword, error: null }
    } catch {
      return { user: null, error: 'Autentikasi gagal' }
    }
  }

  // Get all users
  async getAllUsers(): Promise<{ users: User[]; error: string | null }> {
    try {
      this.loadUsers()
      const users = this.users.map(({ password: _, ...user }) => user)
      return { users, error: null }
    } catch {
      return { users: [], error: 'Gagal mengambil data user' }
    }
  }

  // Create new user
  async createUser(userData: CreateUserData): Promise<{ user: User | null; error: string | null }> {
    try {
      this.loadUsers()

      if (this.users.some(u => u.username === userData.username)) {
        return { user: null, error: 'Username sudah digunakan' }
      }

      if (this.users.some(u => u.email === userData.email)) {
        return { user: null, error: 'Email sudah digunakan' }
      }

      const now = new Date().toISOString()
      const newUser: InternalUser = {
        id: this.generateId(),
        username: userData.username,
        email: userData.email,
        name: userData.name,
        password: userData.password,
        role: userData.role,
        status: 'active',
        created_at: now,
        updated_at: now,
      }

      this.users.push(newUser)
      this.saveUsers()

      const { password: _, ...userWithoutPassword } = newUser
      return { user: userWithoutPassword, error: null }
    } catch {
      return { user: null, error: 'Gagal membuat user baru' }
    }
  }

  // Update user
  async updateUser(userId: string, userData: UpdateUserData): Promise<{ user: User | null; error: string | null }> {
    try {
      this.loadUsers()

      const userIndex = this.users.findIndex(u => u.id === userId)
      if (userIndex === -1) {
        return { user: null, error: 'User tidak ditemukan' }
      }

      if (userData.username && this.users.some(u => u.username === userData.username && u.id !== userId)) {
        return { user: null, error: 'Username sudah digunakan' }
      }

      if (userData.email && this.users.some(u => u.email === userData.email && u.id !== userId)) {
        return { user: null, error: 'Email sudah digunakan' }
      }

      const updatedUser = { ...this.users[userIndex] }
      
      if (userData.username) updatedUser.username = userData.username
      if (userData.email) updatedUser.email = userData.email
      if (userData.name) updatedUser.name = userData.name
      if (userData.password) updatedUser.password = userData.password
      if (userData.role) updatedUser.role = userData.role
      if (userData.status) updatedUser.status = userData.status
      updatedUser.updated_at = new Date().toISOString()

      this.users[userIndex] = updatedUser
      this.saveUsers()

      // Update auth-user if it's the current user
      if (typeof window !== 'undefined') {
        const authUser = localStorage.getItem('auth-user')
        if (authUser) {
          const parsedAuthUser = JSON.parse(authUser)
          if (parsedAuthUser.id === userId) {
            const { password: _, ...userWithoutPassword } = updatedUser
            localStorage.setItem('auth-user', JSON.stringify(userWithoutPassword))
          }
        }
      }

      const { password: _, ...userWithoutPassword } = updatedUser
      return { user: userWithoutPassword, error: null }
    } catch {
      return { user: null, error: 'Gagal mengupdate user' }
    }
  }

  // Delete user
  async deleteUser(userId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      this.loadUsers()

      const userIndex = this.users.findIndex(u => u.id === userId)
      if (userIndex === -1) {
        return { success: false, error: 'User tidak ditemukan' }
      }

      const user = this.users[userIndex]
      if (user.role === 'admin') {
        const adminCount = this.users.filter(u => u.role === 'admin').length
        if (adminCount <= 1) {
          return { success: false, error: 'Tidak dapat menghapus admin terakhir' }
        }
      }

      this.users.splice(userIndex, 1)
      this.saveUsers()

      return { success: true, error: null }
    } catch {
      return { success: false, error: 'Gagal menghapus user' }
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<{ user: User | null; error: string | null }> {
    try {
      this.loadUsers()

      const foundUser = this.users.find(u => u.id === userId)
      if (!foundUser) {
        return { user: null, error: 'User tidak ditemukan' }
      }

      const { password: _, ...userWithoutPassword } = foundUser
      return { user: userWithoutPassword, error: null }
    } catch {
      return { user: null, error: 'Gagal mengambil data user' }
    }
  }

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error: string | null }> {
    try {
      this.loadUsers()

      const userIndex = this.users.findIndex(u => u.id === userId)
      if (userIndex === -1) {
        return { success: false, error: 'User tidak ditemukan' }
      }

      if (this.users[userIndex].password !== currentPassword) {
        return { success: false, error: 'Password saat ini salah' }
      }

      this.users[userIndex].password = newPassword
      this.users[userIndex].updated_at = new Date().toISOString()
      this.saveUsers()

      return { success: true, error: null }
    } catch {
      return { success: false, error: 'Gagal mengubah password' }
    }
  }

  // Validate user data
  validateUserData(userData: Partial<CreateUserData>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    if (!userData.username || userData.username.trim() === '') {
      errors.username = 'Username wajib diisi'
    } else if (userData.username.length < 3) {
      errors.username = 'Username minimal 3 karakter'
    } else if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
      errors.username = 'Username hanya boleh huruf, angka, dan underscore'
    }

    if (!userData.email || userData.email.trim() === '') {
      errors.email = 'Email wajib diisi'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userData.email)) {
        errors.email = 'Format email tidak valid'
      }
    }

    if (!userData.name || userData.name.trim() === '') {
      errors.name = 'Nama wajib diisi'
    } else if (userData.name.length < 2) {
      errors.name = 'Nama minimal 2 karakter'
    }

    if (!userData.password || userData.password.trim() === '') {
      errors.password = 'Password wajib diisi'
    } else if (userData.password.length < 6) {
      errors.password = 'Password minimal 6 karakter'
    }

    return { isValid: Object.keys(errors).length === 0, errors }
  }

  // Reset to default users
  async resetToDefaults(): Promise<void> {
    this.users = [...DEFAULT_USERS]
    this.saveUsers()
  }
}

export const authService = new AuthService()
