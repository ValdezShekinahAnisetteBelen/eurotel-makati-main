"use client"

import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
import { RoomProvider } from "@/contexts/room-context"
import { usePathname } from "next/navigation"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isAuthPage = pathname === "/login" || pathname === "/register"

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="font-sans">
        <AuthProvider>
          <RoomProvider>
            {!isAuthPage && <Navbar />}
            <main className="min-h-screen">{children}</main>
            {!isAuthPage && <Footer />}
          </RoomProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
