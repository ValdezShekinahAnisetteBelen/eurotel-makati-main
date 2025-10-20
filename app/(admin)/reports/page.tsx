"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Booking {
  id: number
  room_name: string
  room_type: string
  total_amount: number
  check_in: string
  check_out: string
  status: string
}

export default function ReportsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)

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
    if (token) fetchBookings()
  }, [token])

  const fetchBookings = async () => {
    try {
   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {

        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      const data = await res.json()
      setBookings(data)
    } catch (err) {
      console.error("Error fetching bookings:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Loading reports...</p>
  if (!bookings.length) return <p>No booking data available.</p>

  // ---------- COMPUTE STATS ----------
  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.total_amount), 0)
  const totalBookings = bookings.length
  const completed = bookings.filter((b) => b.status === "completed").length
  const cancelled = bookings.filter((b) => b.status === "cancelled").length
  const pending = bookings.filter((b) => b.status === "pending").length
  const avgRate = Math.round(totalRevenue / (totalBookings || 1))

  // Monthly grouping
  const monthlyMap: Record<string, { revenue: number; bookings: number }> = {}
  bookings.forEach((b) => {
    const month = new Date(b.check_in).toLocaleString("default", { month: "short" })
    if (!monthlyMap[month]) monthlyMap[month] = { revenue: 0, bookings: 0 }
    monthlyMap[month].revenue += Number(b.total_amount)
    monthlyMap[month].bookings += 1
  })
  const monthlyData = Object.entries(monthlyMap).map(([month, val]) => ({
    month,
    revenue: val.revenue,
    bookings: val.bookings,
  }))

  // Room type distribution
  const roomTypeCount: Record<string, number> = {}
  bookings.forEach((b) => {
    roomTypeCount[b.room_type] = (roomTypeCount[b.room_type] || 0) + 1
  })
  const roomTypeData = Object.entries(roomTypeCount).map(([name, value], i) => ({
    name,
    value,
    fill: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"][i % 5],
  }))

  // Booking status data
  const bookingStatusData = [
    { status: "Completed", count: completed, fill: "#10b981" },
    { status: "Pending", count: pending, fill: "#f59e0b" },
    { status: "Cancelled", count: cancelled, fill: "#ef4444" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Hotel reservation performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₱{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Overall Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalBookings}</p>
            <p className="text-xs text-muted-foreground mt-1">All bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg Rate per Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₱{avgRate.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Revenue / Bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{completed}</p>
            <p className="text-xs text-muted-foreground mt-1">Successful stays</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue & Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue & Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (₱)" />
                  <Bar dataKey="bookings" fill="#8b5cf6" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Booking Status */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookingStatusData.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{item.count}</span>
                    <span className="text-xs text-muted-foreground">
                      ({Math.round((item.count / totalBookings) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings by Room Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {roomTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-semibold">Month</th>
                  <th className="text-right py-3 px-2 font-semibold">Revenue</th>
                  <th className="text-right py-3 px-2 font-semibold">Bookings</th>
                  <th className="text-right py-3 px-2 font-semibold">Avg Rate</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((item) => (
                  <tr key={item.month} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2">{item.month}</td>
                    <td className="text-right py-3 px-2 font-medium">₱{item.revenue.toLocaleString()}</td>
                    <td className="text-right py-3 px-2">{item.bookings}</td>
                    <td className="text-right py-3 px-2">
                      ₱{Math.round(item.revenue / item.bookings).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
