"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, BedDouble, CalendarDays, User, Settings, BarChart3, CreditCard, X, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Rooms", href: "/room", icon: BedDouble },
  { label: "Reservations", href: "/reservations", icon: CalendarDays },
  { label: "Guests", href: "/guests", icon: User },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Profile", href: "/settings", icon: Settings },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <>
      {/* Mobile Sidebar (drawer style) */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity",
          open ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 w-64 bg-white border-r shadow-sm h-screen z-50 p-4 transform transition-transform",
          open ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static md:block"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Eurotel</h1>
          {/* Close button on mobile */}
          <button className="md:hidden" onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                  isActive
                    ? "bg-gray-100 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2 mt-6 text-red-600 hover:bg-red-50 w-full"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </aside>
    </>
  )
}
