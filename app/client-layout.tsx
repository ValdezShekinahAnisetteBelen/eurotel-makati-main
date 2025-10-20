"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
import { RoomProvider } from "@/contexts/room-context"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // ✅ Check if current route is an auth page
  const isAuthPage = pathname === "/login" || pathname === "/signup"
  
  // ✅ Check if current route is an admin or internal page
  const isAdminPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/room") ||
    pathname.startsWith("/reservations") ||
    pathname.startsWith("/guests") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/settings") 

  // ✅ Only show Navbar and Footer for public-facing pages
  const showCustomerLayout = !isAuthPage && !isAdminPage

  return (
    <AuthProvider>
      <RoomProvider>
        {showCustomerLayout && <Navbar />}
        <main className="min-h-screen">{children}</main>
        {showCustomerLayout && <Footer />}
      </RoomProvider>
    </AuthProvider>
  )
}
