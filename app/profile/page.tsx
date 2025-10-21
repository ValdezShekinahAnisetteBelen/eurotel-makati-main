"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CustomLoader } from "@/components/custom-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, CreditCard } from "lucide-react"
import axios from "axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { usePathname } from "next/navigation"
import { toast } from "sonner"

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
  const pathname = usePathname()

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

const handleCancelBooking = (bookingId: number) => {
  toast.custom((id) => (
    <div className="flex flex-col gap-2 bg-yellow-50 border border-green-300 text-green-900 p-4 rounded-xl shadow-lg w-[340px]">
      <div className="flex items-start gap-2">
        <svg
          className="w-5 h-5 text-yellow-600 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.366-.756 1.42-.756 1.786 0l7.451 15.373A1 1 0 0116.451 20H3.549a1 1 0 01-.894-1.528L8.257 3.1zM11 15a1 1 0 10-2 0 1 1 0 002 0zm-.25-2.75a.75.75 0 01-1.5 0V8a.75.75 0 011.5 0v4.25z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <p className="font-semibold">Are you sure you want to cancel this booking?</p>
          <p className="text-sm text-green-800">This action cannot be undone.</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => toast.dismiss(id)}
          className="px-3 py-1.5 text-sm rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
        >
          No, Keep Booking
        </button>
        <button
          onClick={async () => {
            toast.dismiss(id)
            toast.loading("Cancelling booking...")

            try {
              await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/cancel`)
              setBookings((prev) =>
                prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
              )
              toast.dismiss() // remove loading
              toast.success("Booking cancelled successfully!", {
                description: "Your booking has been marked as cancelled.",
              })
            } catch (error) {
              console.error("Failed to cancel booking:", error)
              toast.dismiss()
              toast.error("Cancellation failed", {
                description: "Something went wrong. Please try again later.",
              })
            }
          }}
          className="px-3 py-1.5 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white transition"
        >
          Yes, Cancel
        </button>
      </div>
    </div>
  ))
}


  if (pageLoading || !contentReady) {
    return <CustomLoader isLoading={pageLoading} onLoadingComplete={handleLoadingComplete} />
  }

  const displayUser = user || JSON.parse(localStorage.getItem("user") || "{}")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* User Header */}
        {pathname !== "/reservation" && (
          <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-2xl p-8 mb-8 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center text-2xl font-bold text-green-900">
                {(displayUser.name?.charAt(0) || "U").toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, <span className="text-yellow-400">{displayUser.name || "User"}</span>!
                </h1>
                <p className="text-green-100">Manage your bookings and account details</p>
              </div>
            </div>
          </div>
        )}


        {/* Bookings List */}
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
                        <h3 className="text-xl font-semibold text-green-800 mb-1">{booking.room?.name || "Room"}</h3>
                        <p className="text-green-600">Booking #{booking.id}</p>
                      </div>
                      <Badge className={`${getStatusColor(booking.status)} capitalize`}>{booking.status}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">Room ID: {booking.room?.id || "N/A"}</span>
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

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-yellow-50">
          <DialogHeader className="border-b-2 border-green-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-green-800">Booking Details</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 mt-4">
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <p className="text-sm mb-3">
                  <strong className="text-green-800">Room:</strong>{" "}
                  <span className="text-green-700">{selectedBooking.room?.name || "N/A"}</span>
                </p>
                <p className="text-sm mb-3">
                  <strong className="text-green-800">Check-in:</strong>{" "}
                  <span className="text-green-700">{new Date(selectedBooking.check_in).toLocaleDateString()}</span>
                </p>
                <p className="text-sm mb-3">
                  <strong className="text-green-800">Check-out:</strong>{" "}
                  <span className="text-green-700">{new Date(selectedBooking.check_out).toLocaleDateString()}</span>
                </p>
                <p className="text-sm mb-3">
                  <strong className="text-green-800">Guests:</strong>{" "}
                  <span className="text-green-700">{selectedBooking.guests}</span>
                </p>
                <p className="text-sm mb-3">
                  <strong className="text-green-800">Total Amount:</strong>{" "}
                  <span className="font-semibold text-yellow-700">
                    ₱{selectedBooking.total_amount.toLocaleString()}
                  </span>
                </p>
                <p className="text-sm mb-3">
                  <strong className="text-green-800">Status:</strong>{" "}
                  <Badge className={`ml-2 ${getStatusColor(selectedBooking.status)} capitalize`}>
                    {selectedBooking.status}
                  </Badge>
                </p>
                <p className="text-sm">
                  <strong className="text-green-800">Description:</strong>{" "}
                  <span className="text-green-700">{selectedBooking.room?.description || "N/A"}</span>
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
