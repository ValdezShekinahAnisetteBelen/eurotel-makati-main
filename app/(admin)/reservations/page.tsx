"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { CustomLoader } from "@/components/custom-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, CreditCard, Mail, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Booking {
  id: number
  user_id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  guests: number
  nights: number
  total_amount: number
  check_in: string
  check_out: string
  status: string
  created_at: string
  special_requests?: string
  room_id: number
  room_name: string
  room_price: string
  room: {
    id: number
    name: string
    price: string
    status: string
    description?: string
  }
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookings`)
      setBookings(res.data.bookings || res.data) // handle if response is {total, bookings}
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const updateStatus = async (bookingId: number, status: string) => {
    setActionLoading(bookingId)
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/status`, { status })
      fetchBookings()
    } catch (error) {
      console.error("Failed to update booking:", error)
      alert("Failed to update booking status")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <CustomLoader isLoading={loading} onLoadingComplete={() => {}} />

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin - All Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="rounded-xl border shadow">
              <CardHeader className="bg-gray-100 rounded-t-xl p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    Booking #{booking.id} - {booking.room_name || booking.room?.name || "Room"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    User: {booking.first_name} {booking.last_name} (<Mail className="inline w-4 h-4" />{" "}
                    {booking.email})
                  </p>
                </div>
                <Badge className={`${getStatusColor(booking.status)} capitalize`}>
                  {booking.status}
                </Badge>
              </CardHeader>

              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span>
                      {new Date(booking.check_in).toLocaleDateString()} -{" "}
                      {new Date(booking.check_out).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span>{booking.guests} Guest{booking.guests > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    <span>₱{parseFloat(booking.room_price || booking.total_amount.toString()).toLocaleString()}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Created: {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => {
                      setSelectedBooking(booking)
                      setModalOpen(true)
                    }}
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </Button>

                  {/* Pending → Confirmed / Cancelled */}
                  {booking.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => updateStatus(booking.id, "confirmed")}
                        disabled={actionLoading === booking.id}
                      >
                        {actionLoading === booking.id ? "Processing..." : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => updateStatus(booking.id, "cancelled")}
                        disabled={actionLoading === booking.id}
                      >
                        {actionLoading === booking.id ? "Processing..." : "Cancel"}
                      </Button>
                    </>
                  )}

                  {/* Confirmed → Completed / Cancelled */}
                  {booking.status === "confirmed" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => updateStatus(booking.id, "completed")}
                        disabled={actionLoading === booking.id}
                      >
                        {actionLoading === booking.id ? "Processing..." : "Mark as Completed"}
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => updateStatus(booking.id, "cancelled")}
                        disabled={actionLoading === booking.id}
                      >
                        {actionLoading === booking.id ? "Processing..." : "Cancel"}
                      </Button>
                    </>
                  )}

                  {/* Completed → Optional revert (admin only) */}
                  {booking.status === "completed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(booking.id, "pending")}
                      disabled={actionLoading === booking.id}
                    >
                      {actionLoading === booking.id ? "Processing..." : "Revert to Pending"}
                    </Button>
                  )}

                  {/* Cancelled → Optional revert */}
                  {booking.status === "cancelled" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(booking.id, "pending")}
                      disabled={actionLoading === booking.id}
                    >
                      {actionLoading === booking.id ? "Processing..." : "Reopen"}
                    </Button>
                  )}
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Booking #{selectedBooking.id} Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-2">
              <p>
                <strong>User:</strong> {selectedBooking.first_name} {selectedBooking.last_name} ({selectedBooking.email})
              </p>
              <p>
                <strong>Room:</strong> {selectedBooking.room_name || selectedBooking.room?.name} - ₱{parseFloat(selectedBooking.room_price).toLocaleString()}
              </p>
              <p>
                <strong>Check In:</strong> {new Date(selectedBooking.check_in).toLocaleDateString()}
              </p>
              <p>
                <strong>Check Out:</strong> {new Date(selectedBooking.check_out).toLocaleDateString()}
              </p>
              <p>
                <strong>Guests:</strong> {selectedBooking.guests}
              </p>
              <p>
                <strong>Total Amount:</strong> ₱{parseFloat(selectedBooking.room_price).toLocaleString()}
              </p>
              {selectedBooking.special_requests && (
                <p>
                  <strong>Special Requests:</strong> {selectedBooking.special_requests}
                </p>
              )}
              <p>
                <strong>Phone:</strong> {selectedBooking.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedBooking.address}
              </p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={() => setModalOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
