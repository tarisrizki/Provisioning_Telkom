# User Management System - Setup Guide

## 📋 Quick Setup

### 1. Database Setup (Supabase)
1. Buka Supabase SQL Editor
2. Copy dan paste seluruh isi file `users_crud_queries.sql`
3. Jalankan script tersebut
4. Sistem akan membuat tabel `users` dan memasukkan data sample

### 2. Login Credentials (Ready to Use)
```
Admin User:
- Username: admin
- Password: admin123
- Role: admin

Regular User:
- Username: user  
- Password: user123
- Role: user

Additional Test Users:
- Username: tarisrizki | Password: password123 | Role: admin
- Username: operator1  | Password: operator123 | Role: user
- Username: manager1   | Password: manager123 | Role: admin
```

## 🔐 Authentication System

### Route Protection
- **Public Routes**: `/` (login page)
- **Protected Routes**: Semua route lain memerlukan login
- **Admin Only**: `/user-management`, `/manage-account`

### Login Process
1. User mengakses `/` (login page)
2. Masukkan username/password
3. Sistem validasi ke database Supabase
4. Jika berhasil, redirect ke `/dashboard`
5. Cookie authentication tersimpan

### Middleware Protection
File `src/middleware.ts` secara otomatis:
- Mengecek authentication status
- Redirect ke login jika belum login
- Mengontrol akses berdasarkan role

## 🛠 CRUD Operations

### 1. Create User
```javascript
// Melalui Web Interface: /user-management (Admin only)
// Atau langsung via SQL:
INSERT INTO users (username, email, name, password_hash, role, status) 
VALUES ('newuser', 'new@email.com', 'Name', 'password123', 'user', 'active');
```

### 2. Read Users
```javascript
// Web Interface: /user-management menampilkan semua user
// SQL Query:
SELECT * FROM users WHERE status = 'active' ORDER BY created_at DESC;
```

### 3. Update User
```javascript
// Web Interface: Edit button di /user-management
// SQL Query:
UPDATE users SET name = 'New Name', role = 'admin' WHERE username = 'user';
```

### 4. Delete User
```javascript
// Web Interface: Delete button di /user-management
// Soft Delete (Recommended):
UPDATE users SET status = 'inactive' WHERE username = 'user';
// Hard Delete:
DELETE FROM users WHERE username = 'user';
```

## 🎯 Key Features

### ✅ Implemented
- [x] Database table dengan indexes
- [x] Authentication middleware
- [x] Route protection
- [x] Role-based access control
- [x] Login/logout functionality
- [x] CRUD operations (Web + SQL)
- [x] Password tanpa hashing (sesuai permintaan)
- [x] User management interface
- [x] Protected pages (dashboard, laporan, dll)

### 🔧 Usage Instructions

1. **Start Application**:
   ```bash
   npm run dev
   ```

2. **Access Login**: Buka `http://localhost:3000`

3. **Login dengan credentials di atas**

4. **Navigate aplikasi** - semua route otomatis terproteksi

5. **User Management** - Hanya admin yang bisa akses `/user-management`

### 📁 File Structure
```
src/
├── middleware.ts              # Route protection
├── app/
│   ├── page.tsx              # Login page
│   ├── api/auth/
│   │   ├── login/route.ts    # Login API
│   │   └── logout/route.ts   # Logout API
│   ├── dashboard/page.tsx    # Protected dashboard
│   ├── user-management/      # Admin-only user CRUD
│   └── [other pages]/        # All protected
├── components/
│   ├── protected-route.tsx   # Client-side protection
│   └── login-form.tsx        # Login interface
└── lib/
    ├── auth-service.ts       # Auth business logic
    └── auth-utils.ts         # Auth utilities

users_crud_queries.sql        # Complete database setup
```

### 🚀 Ready to Use!
Sistem sudah siap digunakan. Jalankan SQL script, start aplikasi, dan login dengan credentials yang disediakan.
