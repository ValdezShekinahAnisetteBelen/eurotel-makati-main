"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CustomLoader } from "@/components/custom-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, CreditCard, Phone, Mail, User } from "lucide-react"

interface Booking {
  id: string
  roomType: string
  roomNumber: string
  checkIn: string
  checkOut: string
  guests: number
  totalAmount: number
  status: "confirmed" | "completed" | "cancelled"
  bookingDate: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState(true)
  const [contentReady, setContentReady] = useState(false) // Added contentReady state

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentReady(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Mock booking data - replace with actual API call
    const mockBookings: Booking[] = [
      {
        id: "BK001",
        roomType: "Deluxe Suite",
        roomNumber: "205",
        checkIn: "2024-01-15",
        checkOut: "2024-01-18",
        guests: 2,
        totalAmount: 450,
        status: "completed",
        bookingDate: "2024-01-10",
      },
      {
        id: "BK002",
        roomType: "Executive Room",
        roomNumber: "312",
        checkIn: "2024-02-20",
        checkOut: "2024-02-23",
        guests: 1,
        totalAmount: 300,
        status: "confirmed",
        bookingDate: "2024-02-15",
      },
    ]

    setTimeout(() => {
      setBookings(mockBookings)
      setLoading(false)
    }, 1000)
  }, [user, router])

  const handleLoadingComplete = () => {
    setPageLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!user) return null

  if (pageLoading || !contentReady) {
    return <CustomLoader isLoading={pageLoading} onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center text-2xl font-bold text-green-900">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, <span className="text-yellow-400">{user.username}</span>!
              </h1>
              <p className="text-green-100">Manage your bookings and account details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-green-100">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-green-100">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-green-100">
              <User className="w-4 h-4" />
              <span className="text-yellow-400 font-semibold">Gold Member</span>
            </div>
          </div>
        </div>

        <Card className="rounded-2xl border-green-200 shadow-lg py-0">
          <CardHeader className="bg-gradient-to-r from-green-800 to-green-700 text-white rounded-t-2xl">
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5" />
              Your Bookings
            </CardTitle>
            <CardDescription className="text-green-100">View and manage your hotel reservations</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-3 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-green-600">Loading your bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">No bookings yet</h3>
                <p className="text-green-600 mb-6">Start planning your perfect stay at Eurotel</p>
                <Button
                  onClick={() => router.push("/rooms")}
                  className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700"
                >
                  Browse Rooms
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-green-200 rounded-xl p-6 bg-gradient-to-r from-white to-green-50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-green-800 mb-1">{booking.roomType}</h3>
                        <p className="text-green-600">Booking #{booking.id}</p>
                      </div>
                      <Badge className={`${getStatusColor(booking.status)} capitalize`}>{booking.status}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">Room {booking.roomNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          {booking.guests} Guest{booking.guests > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-800">${booking.totalAmount}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-green-200">
                      {booking.status === "confirmed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                        >
                          Modify Booking
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-green-700 hover:bg-green-50">
                        View Details
                      </Button>
                      {booking.status === "confirmed" && (
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
