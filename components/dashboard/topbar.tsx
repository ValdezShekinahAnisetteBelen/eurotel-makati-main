"use client"

import { Bell, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

// Sidebar items to match routes with titles
const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Rooms", href: "/room" },
  { label: "Reservations", href: "/reservations" },
  { label: "Guests", href: "/guests" },
  { label: "Reports", href: "/reports" },
  { label: "Profile", href: "/settings" },
]

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()

  // Find the current page title
  const currentPage = navItems.find((item) => pathname.startsWith(item.href))
  const pageTitle = currentPage ? currentPage.label : "Dashboard"

  return (
    <header className="h-16 w-full bg-white border-b shadow-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu - show only on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">{pageTitle}</h2>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
