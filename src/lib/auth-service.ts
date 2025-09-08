import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

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

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<{ user: User | null; error: string | null }> {
    try {
      console.log('Attempting login for username:', credentials.username)
      
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', credentials.username)
        .eq('status', 'active')
        .limit(1)

      console.log('Supabase query result:', { users, error })

      if (error) {
        console.error('Supabase error:', error)
        return { user: null, error: `Database error: ${error.message}` }
      }

      if (!users || users.length === 0) {
        return { user: null, error: 'Invalid username or password' }
      }

      const user = users[0]
      
      // Check if password is hashed (starts with $2a$, $2b$, or $2y$) or plain text
      let isValidPassword = false
      
      if (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$') || user.password_hash.startsWith('$2y$')) {
        // Hashed password - use bcrypt
        isValidPassword = await bcrypt.compare(credentials.password, user.password_hash)
      } else {
        // Plain text password - direct comparison
        isValidPassword = credentials.password === user.password_hash
      }
      
      if (!isValidPassword) {
        return { user: null, error: 'Invalid username or password' }
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id)

      // Remove password hash from returned user
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...userWithoutPassword } = user
      
      return { user: userWithoutPassword as User, error: null }
    } catch (error) {
      console.error('Login error:', error)
      return { user: null, error: 'Authentication failed' }
    }
  }

  // Get all users (admin only)
  async getAllUsers(): Promise<{ users: User[]; error: string | null }> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, username, email, name, role, status, avatar_url, created_at, updated_at, last_login')
        .order('created_at', { ascending: false })

      if (error) {
        return { users: [], error: 'Failed to fetch users' }
      }

      return { users: users as User[], error: null }
    } catch (error) {
      console.error('Get users error:', error)
      return { users: [], error: 'Failed to fetch users' }
    }
  }

  // Create new user (admin only)
  async createUser(userData: CreateUserData): Promise<{ user: User | null; error: string | null }> {
    try {
      // Hash password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds)

      const { data: newUser, error } = await supabase
        .from('users')
        .insert([
          {
            username: userData.username,
            email: userData.email,
            name: userData.name,
            password_hash: hashedPassword,
            role: userData.role,
            status: 'active'
          }
        ])
        .select('id, username, email, name, role, status, avatar_url, created_at, updated_at')
        .single()

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return { user: null, error: 'Username or email already exists' }
        }
        return { user: null, error: 'Failed to create user' }
      }

      return { user: newUser as User, error: null }
    } catch (error) {
      console.error('Create user error:', error)
      return { user: null, error: 'Failed to create user' }
    }
  }

  // Update user (admin only or own profile)
  async updateUser(userId: string, userData: UpdateUserData): Promise<{ user: User | null; error: string | null }> {
    try {
      const updateData: Record<string, unknown> = { ...userData }

      // Hash password if provided
      if (userData.password) {
        const saltRounds = 12
        updateData.password_hash = await bcrypt.hash(userData.password, saltRounds)
        delete updateData.password
      }

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select('id, username, email, name, role, status, avatar_url, created_at, updated_at, last_login')
        .single()

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return { user: null, error: 'Username or email already exists' }
        }
        return { user: null, error: 'Failed to update user' }
      }

      return { user: updatedUser as User, error: null }
    } catch (error) {
      console.error('Update user error:', error)
      return { user: null, error: 'Failed to update user' }
    }
  }

  // Delete user (admin only)
  async deleteUser(userId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) {
        return { success: false, error: 'Failed to delete user' }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Delete user error:', error)
      return { success: false, error: 'Failed to delete user' }
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, username, email, name, role, status, avatar_url, created_at, updated_at, last_login')
        .eq('id', userId)
        .single()

      if (error) {
        return { user: null, error: 'User not found' }
      }

      return { user: user as User, error: null }
    } catch (error) {
      console.error('Get user by ID error:', error)
      return { user: null, error: 'Failed to fetch user' }
    }
  }

  // Validate user data
  validateUserData(userData: Partial<CreateUserData>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    if (userData.username) {
      if (userData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters long'
      }
      if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
        errors.username = 'Username can only contain letters, numbers, and underscores'
      }
    }

    if (userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userData.email)) {
        errors.email = 'Please enter a valid email address'
      }
    }

    if (userData.name) {
      if (userData.name.length < 2) {
        errors.name = 'Name must be at least 2 characters long'
      }
    }

    if (userData.password) {
      if (userData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long'
      }
    }

    return { isValid: Object.keys(errors).length === 0, errors }
  }
}

export const authService = new AuthService()
