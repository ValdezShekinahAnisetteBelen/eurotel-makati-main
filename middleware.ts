import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes that require authentication
const protectedRoutes = ["/checkin-checkout", "/profile", "/bookings", "/api/booking", "/api/users"]

// Define admin routes that require admin privileges
const adminRoutes = ["/admin", "/api/admin"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the route is admin-only
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // For API routes, check for authorization header
  if (pathname.startsWith("/api/")) {
    // Skip auth check for public API routes
    const publicApiRoutes = [
      "/api/auth/login",
      "/api/auth/logout",
      "/api/rooms",
      "/api/hotel/info",
      "/api/testimonials",
      "/api/contact",
      "/api/feedback",
    ]

    const isPublicApiRoute = publicApiRoutes.some((route) => pathname.startsWith(route))

    if (!isPublicApiRoute && (isProtectedRoute || isAdminRoute)) {
      const authHeader = request.headers.get("authorization")

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      // In production, you would validate the JWT token here
      // For now, we'll just check if the header exists
      const token = authHeader.split(" ")[1]
      if (!token) {
        return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
      }

      // For admin routes, check if user has admin privileges
      if (isAdminRoute) {
        // In production, decode JWT and check user role
        // For now, we'll assume the token contains role information
        // This is just a placeholder - implement proper JWT validation
        return NextResponse.json({ error: "Admin privileges required" }, { status: 403 })
      }
    }

    return NextResponse.next()
  }

  // For page routes, redirect to login if not authenticated
  if (isProtectedRoute) {
    // In a real app, you would check for a valid session/token
    // For now, we'll let the client-side handle authentication
    // The useAuth hook will redirect to login if needed
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
