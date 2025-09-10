import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/format-order',
  '/laporan',
  '/monitoring',
  '/user-management',
  '/manage-account'
]

// Define admin-only routes
const adminOnlyRoutes = [
  '/user-management',
  '/manage-account'
]

// Define public routes that are accessible without authentication
const publicRoutes = [
  '/',
  '/api/auth/login',
  '/api/auth/logout',
  '/test-connection',
  '/test-data',
  '/test-env',
  '/debug-connection',
  '/simple-login-test'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and API routes (except auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public') ||
    (pathname.startsWith('/api') && !pathname.startsWith('/api/auth'))
  ) {
    return NextResponse.next()
  }

  // Get authentication cookie
  const authTokenCookie = request.cookies.get('auth-token')
  const userInfoCookie = request.cookies.get('user-info')
  let user = null
  
  if (authTokenCookie && userInfoCookie) {
    try {
      user = JSON.parse(userInfoCookie.value)
    } catch (error) {
      console.error('Error parsing user info cookie:', error)
    }
  }

  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if route requires authentication
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Check admin-only routes
    if (adminOnlyRoutes.some(route => pathname.startsWith(route))) {
      if (user.role !== 'admin') {
        // Redirect to dashboard if not admin
        const dashboardUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(dashboardUrl)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
