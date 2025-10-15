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

// Sample reservation stats chart data
const reservationData = [
  { month: "Jan", reservations: 120 },
  { month: "Feb", reservations: 95 },
  { month: "Mar", reservations: 150 },
  { month: "Apr", reservations: 130 },
  { month: "May", reservations: 180 },
  { month: "Jun", reservations: 200 },
]

// Sample recent reservations table
const reservations = [
  { id: 1, guest: "Juan Dela Cruz", room: "Deluxe Room", checkIn: "2025-09-15", checkOut: "2025-09-17" },
  { id: 2, guest: "Maria Clara", room: "Suite Room", checkIn: "2025-09-14", checkOut: "2025-09-16" },
  { id: 3, guest: "Jose Rizal", room: "Standard Room", checkIn: "2025-09-13", checkOut: "2025-09-14" },
]

export default function DashboardPage() {
  const router = useRouter()
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
    console.log("Token:", storedToken)
  }, [router])

  if (!user) return <p>Loading...</p>

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">320</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">45</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₱520,000</p>
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
                <Line type="monotone" dataKey="reservations" stroke="#2563eb" strokeWidth={2} />
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
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{res.id}</td>
                  <td className="py-2">{res.guest}</td>
                  <td className="py-2">{res.room}</td>
                  <td className="py-2">{res.checkIn}</td>
                  <td className="py-2">{res.checkOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
