-- =====================================================
-- COMPLETE USER MANAGEMENT SQL FOR SUPABASE
-- =====================================================
-- Execute this SQL in your Supabase SQL Editor
-- This file contains everything needed for user management:
-- 1. Table creation
-- 2. Sample data insertion
-- 3. All CRUD operations examples
-- =====================================================

-- ⚠️  IMPORTANT NOTES:
-- - Semua contoh query siap dijalankan
-- - Untuk query berdasarkan ID, gunakan username dulu untuk mendapatkan UUID
-- - Ganti placeholder values dengan data aktual sesuai kebutuhan
-- =====================================================

-- =====================================================
-- 1. TABLE SETUP
-- =====================================================

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- =====================================================
-- 2. SAMPLE DATA INSERTION
-- =====================================================

-- Clear existing data first (optional - remove if you want to keep existing data)
-- DELETE FROM users;

-- Insert default users (admin and regular user)
INSERT INTO users (username, email, name, password_hash, role, status) VALUES
('admin', 'admin@telkom.co.id', 'Administrator', 'admin123', 'admin', 'active'),
('user', 'user@telkom.co.id', 'Regular User', 'user123', 'user', 'active'),
('tarisrizki', 'taris@telkom.co.id', 'Taris Rizki', 'password123', 'admin', 'active'),
('operator1', 'operator1@telkom.co.id', 'Operator Satu', 'operator123', 'user', 'active'),
('manager1', 'manager1@telkom.co.id', 'Manager Satu', 'manager123', 'admin', 'active')
ON CONFLICT (username) DO NOTHING;

-- Display created users
SELECT 
  id,
  username,
  email,
  name,
  role,
  status,
  created_at
FROM users
ORDER BY role DESC, username;

-- =====================================================
-- QUICK TEST QUERIES (Ready to Run)
-- =====================================================

-- Test login untuk admin
SELECT id, username, name, role, status 
FROM users 
WHERE username = 'admin' AND password_hash = 'admin123' AND status = 'active';

-- Test login untuk user biasa
SELECT id, username, name, role, status 
FROM users 
WHERE username = 'user' AND password_hash = 'user123' AND status = 'active';

-- Lihat semua user yang tersedia
SELECT username, name, role, status, created_at 
FROM users 
ORDER BY role DESC, username;

-- =====================================================
-- 3. CRUD OPERATIONS EXAMPLES
-- =====================================================

-- ==================
-- CREATE (Insert new user)
-- ==================

-- Example: Insert a new user
INSERT INTO users (username, email, name, password_hash, role, status) 
VALUES ('newuser', 'newuser@telkom.co.id', 'New User Name', 'password123', 'user', 'active');

-- Bulk insert multiple users
INSERT INTO users (username, email, name, password_hash, role, status) VALUES
('user1', 'user1@telkom.co.id', 'User One', 'password123', 'user', 'active'),
('user2', 'user2@telkom.co.id', 'User Two', 'password123', 'user', 'active'),
('user3', 'user3@telkom.co.id', 'User Three', 'password123', 'admin', 'active')
ON CONFLICT (username) DO NOTHING;

-- ==================
-- READ (Select/Query users)
-- ==================

-- Get all users with essential information
SELECT 
  id,
  username,
  email,
  name,
  role,
  status,
  avatar_url,
  created_at,
  updated_at,
  last_login
FROM users 
ORDER BY created_at DESC;

-- Get user by ID (replace with actual UUID)
-- Example: First get the ID from username, then use it
SELECT 
  id,
  username,
  email,
  name,
  role,
  status,
  avatar_url,
  created_at,
  updated_at,
  last_login
FROM users 
WHERE username = 'admin';

-- Or if you have the actual UUID:
-- WHERE id = '123e4567-e89b-12d3-a456-426614174000';

-- Get user ID by username (useful for getting actual UUID)
SELECT id, username FROM users WHERE username = 'admin';

-- Get user by username (for login authentication)
SELECT * FROM users 
WHERE username = 'admin' AND status = 'active';

-- Get users by role
SELECT * FROM users 
WHERE role = 'admin' 
ORDER BY name;

-- Get active users only
SELECT * FROM users 
WHERE status = 'active' 
ORDER BY created_at DESC;

-- Search users by name or username (case-insensitive)
SELECT * FROM users 
WHERE (name ILIKE '%search-term%' OR username ILIKE '%search-term%')
ORDER BY name;

-- Get paginated results (example: page 1, 10 items per page)
SELECT 
  id,
  username,
  email,
  name,
  role,
  status,
  created_at
FROM users 
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;

-- ==================
-- UPDATE (Modify existing user)
-- ==================

-- Update user profile information
UPDATE users 
SET 
  name = 'Updated Name',
  email = 'updated@telkom.co.id',
  updated_at = NOW()
WHERE username = 'admin';

-- Update user password
UPDATE users 
SET 
  password_hash = 'newpassword123',
  updated_at = NOW()
WHERE username = 'admin';

-- Update user role
UPDATE users 
SET 
  role = 'admin',
  updated_at = NOW()
WHERE username = 'user';

-- Update user status (activate/deactivate)
UPDATE users 
SET 
  status = 'inactive',
  updated_at = NOW()
WHERE username = 'user1';

-- Update last login time (this happens automatically during login)
UPDATE users 
SET last_login = NOW()
WHERE username = 'admin';

-- Update multiple fields at once
UPDATE users 
SET 
  name = 'New Name',
  email = 'new@telkom.co.id',
  role = 'user',
  status = 'active',
  updated_at = NOW()
WHERE username = 'user2';

-- Bulk update - deactivate multiple users
UPDATE users 
SET status = 'inactive', updated_at = NOW()
WHERE role = 'user' AND last_login < NOW() - INTERVAL '90 days';

-- ==================
-- DELETE (Remove user)
-- ==================

-- Soft delete (recommended - deactivate user instead of permanent deletion)
UPDATE users 
SET 
  status = 'inactive',
  updated_at = NOW()
WHERE username = 'user3';

-- Hard delete (permanent removal - use with extreme caution!)
DELETE FROM users 
WHERE username = 'user3' AND status = 'inactive';

-- Delete inactive users older than 30 days
DELETE FROM users 
WHERE status = 'inactive' 
AND updated_at < NOW() - INTERVAL '30 days';

-- =====================================================
-- 4. UTILITY QUERIES & REPORTS
-- =====================================================

-- Count users by role
SELECT 
  role,
  COUNT(*) as user_count
FROM users 
GROUP BY role
ORDER BY role;

-- Count users by status
SELECT 
  status,
  COUNT(*) as user_count
FROM users 
GROUP BY status;

-- Get comprehensive user statistics
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
  COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_users,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
  COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users,
  COUNT(CASE WHEN last_login >= NOW() - INTERVAL '7 days' THEN 1 END) as recent_logins,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as new_users_this_week
FROM users;

-- Get users created in last 7 days
SELECT * FROM users 
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Get users who haven't logged in for 30 days
SELECT 
  username,
  name,
  email,
  role,
  last_login,
  CASE 
    WHEN last_login IS NULL THEN 'Never logged in'
    ELSE CONCAT(EXTRACT(DAYS FROM (NOW() - last_login)), ' days ago')
  END as last_login_info
FROM users 
WHERE last_login < NOW() - INTERVAL '30 days'
   OR last_login IS NULL
ORDER BY last_login ASC NULLS LAST;

-- Check for duplicate usernames or emails (data integrity check)
SELECT username, email, COUNT(*)
FROM users 
GROUP BY username, email
HAVING COUNT(*) > 1;

-- Get login activity summary
SELECT 
  DATE(last_login) as login_date,
  COUNT(*) as login_count
FROM users 
WHERE last_login >= NOW() - INTERVAL '30 days'
GROUP BY DATE(last_login)
ORDER BY login_date DESC;

-- =====================================================
-- 5. ADVANCED QUERIES
-- =====================================================

-- Full-text search across multiple columns
SELECT * FROM users 
WHERE to_tsvector('english', name || ' ' || username || ' ' || email) 
@@ plainto_tsquery('english', 'search-term')
ORDER BY created_at DESC;

-- Get users with role hierarchy info
SELECT 
  username,
  name,
  role,
  status,
  CASE 
    WHEN role = 'admin' THEN 'Full Access'
    WHEN role = 'user' THEN 'Limited Access'
    ELSE 'No Access'
  END as access_level,
  created_at
FROM users
ORDER BY 
  CASE role 
    WHEN 'admin' THEN 1 
    WHEN 'user' THEN 2 
    ELSE 3 
  END,
  name;

-- Get user account age and activity status
SELECT 
  username,
  name,
  role,
  status,
  created_at,
  last_login,
  AGE(NOW(), created_at) as account_age,
  CASE 
    WHEN last_login IS NULL THEN 'Never logged in'
    WHEN last_login > NOW() - INTERVAL '7 days' THEN 'Active'
    WHEN last_login > NOW() - INTERVAL '30 days' THEN 'Recent'
    ELSE 'Inactive'
  END as activity_status
FROM users
ORDER BY last_login DESC NULLS LAST;

-- =====================================================
-- 6. MAINTENANCE QUERIES
-- =====================================================

-- Reset all user passwords (for testing purposes)
-- UPDATE users SET password_hash = 'defaultpass123' WHERE role = 'user';

-- Reactivate all users
-- UPDATE users SET status = 'active', updated_at = NOW();

-- Clean up test data (use carefully!)
-- DELETE FROM users WHERE username LIKE 'test%' OR email LIKE '%test%';

-- =====================================================
-- LOGIN CREDENTIALS FOR TESTING:
-- =====================================================
-- Username: admin     | Password: admin123     | Role: admin
-- Username: user      | Password: user123      | Role: user  
-- Username: tarisrizki| Password: password123  | Role: admin
-- Username: operator1 | Password: operator123  | Role: user
-- Username: manager1  | Password: manager123   | Role: admin
-- =====================================================
