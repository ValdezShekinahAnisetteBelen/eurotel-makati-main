"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CustomLoader } from "@/components/custom-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, CreditCard, Phone, Mail, User, X } from "lucide-react"
import axios from "axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"

interface Booking {
  id: number
  room: {
    id: number
    name: string
    price: number
    status: string
    description: string
  } | null
  check_in: string
  check_out: string
  guests: number
  total_amount: number
  status: string
  created_at: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState(true)
  const [contentReady, setContentReady] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentReady(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const storedUser = user || JSON.parse(localStorage.getItem("user") || "null")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookings/user`, {
          params: { email: storedUser.email },
        })
        setBookings(res.data)
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user, router])

  const handleLoadingComplete = () => setPageLoading(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "declined":
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/cancel`)
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
      )
      alert("Booking cancelled successfully!")
    } catch (error) {
      console.error("Failed to cancel booking:", error)
      alert("Failed to cancel booking. Try again later.")
    }
  }

  if (pageLoading || !contentReady) {
    return <CustomLoader isLoading={pageLoading} onLoadingComplete={handleLoadingComplete} />
  }

  const displayUser = user || JSON.parse(localStorage.getItem("user") || "{}")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* User Header */}
   

        {/* Bookings List */}
        <Card className="rounded-2xl border-green-200 shadow-lg py-0">
          <CardHeader className="bg-gradient-to-r from-green-800 to-green-700 text-white rounded-t-2xl">
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5" />
              Your Bookings
            </CardTitle>
            <CardDescription className="text-green-100">
              View and manage your hotel reservations
            </CardDescription>
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
                <p className="text-green-600 mb-6">Start planning your perfect stay</p>
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
                        <h3 className="text-xl font-semibold text-green-800 mb-1">
                          {booking.room?.name || "Room"}
                        </h3>
                        <p className="text-green-600">Booking #{booking.id}</p>
                      </div>
                      <Badge className={`${getStatusColor(booking.status)} capitalize`}>
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          Room ID: {booking.room?.id || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          {new Date(booking.check_in).toLocaleDateString()} -{" "}
                          {new Date(booking.check_out).toLocaleDateString()}
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
                        <span className="text-sm font-semibold text-green-800">
                          ₱{booking.total_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-green-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-700 hover:bg-green-50"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        View Details
                      </Button>

                      {booking.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
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

      {/* ✅ Booking Details Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle>Booking Details</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-2 mt-2 text-sm text-gray-700">
              <p>
                <strong>Room:</strong> {selectedBooking.room?.name || "N/A"}
              </p>
              <p>
                <strong>Check-in:</strong>{" "}
                {new Date(selectedBooking.check_in).toLocaleDateString()}
              </p>
              <p>
                <strong>Check-out:</strong>{" "}
                {new Date(selectedBooking.check_out).toLocaleDateString()}
              </p>
              <p>
                <strong>Guests:</strong> {selectedBooking.guests}
              </p>
              <p>
                <strong>Total Amount:</strong> ₱{selectedBooking.total_amount.toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedBooking.status}
              </p>
              <p>
                <strong>Room Description:</strong> {selectedBooking.room?.description || "N/A"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
