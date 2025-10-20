"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface Booking {
  id: number
  first_name: string
  last_name: string
  room_name: string
  check_in: string
  check_out: string
  total_amount: number
  status: string
}

interface DashboardStats {
  totalBookings: number
  totalRooms: number
  availableRooms: number
  monthlyRevenue: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ Use environment variables
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (!storedUser || !storedToken) {
      router.replace("/login")
      return
    }

    setUser(JSON.parse(storedUser))
    setToken(storedToken)
  }, [router])

  useEffect(() => {
    if (!token) return
    fetchData()
  }, [token])

  const fetchData = async () => {
    try {
      const [bookingsRes, roomsRes] = await Promise.all([
        fetch(`${API_URL}/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/rooms`),
      ])

      if (!bookingsRes.ok || !roomsRes.ok) {
        throw new Error("Failed to fetch dashboard data.")
      }

      const bookingsData = await bookingsRes.json()
      const roomsData = await roomsRes.json()

      setBookings(bookingsData.bookings || [])
      setRooms(roomsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !user) return <p>Loading...</p>

  // Compute dashboard statistics
  const stats: DashboardStats = {
    totalBookings: bookings.length,
    totalRooms: rooms.length,
    availableRooms: rooms.filter((r) => r.status === "Available").length,
    monthlyRevenue: bookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0),
  }

  // Monthly reservations chart data (group by month)
  const reservationData = Object.values(
    bookings.reduce((acc: any, booking) => {
      const month = new Date(booking.check_in).toLocaleString("default", { month: "short" })
      acc[month] = acc[month] || { month, reservations: 0 }
      acc[month].reservations += 1
      return acc
    }, {})
  )

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalBookings}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.availableRooms}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₱{stats.monthlyRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reservationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="reservations"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Guest</th>
                <th className="text-left py-2">Room</th>
                <th className="text-left py-2">Check-In</th>
                <th className="text-left py-2">Check-Out</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((res) => (
                <tr key={res.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{res.id}</td>
                  <td className="py-2">
                    {res.first_name} {res.last_name}
                  </td>
                  <td className="py-2">{res.room_name}</td>
                  <td className="py-2">{res.check_in}</td>
                  <td className="py-2">{res.check_out}</td>
                  <td className="py-2 capitalize">{res.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
