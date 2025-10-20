"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  id: number
  name: string
  username: string
  email: string
  role: string
  created_at: string
}

export default function GuestsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [guests, setGuests] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (!storedUser || !storedToken) {
      router.replace("/login")
      return
    }

    setUser(JSON.parse(storedUser))
    setToken(storedToken)

    fetchGuests(storedToken)
  }, [router])

  const fetchGuests = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Failed to fetch users")

      const data = await res.json()
      setGuests(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <p>Loading...</p>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Guest Accounts</h1>
        <p className="text-muted-foreground mt-1">
          Manage and view all guest user profiles
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{guests.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{guests.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">User</p>
          </CardContent>
        </Card>
      </div>

      {/* Guests Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Guests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading guests...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-semibold">Name</th>
                    <th className="text-left py-3 px-2 font-semibold">Username</th>
                    <th className="text-left py-3 px-2 font-semibold">Email</th>
                    <th className="text-left py-3 px-2 font-semibold">Role</th>
                    <th className="text-left py-3 px-2 font-semibold">Date Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest) => (
                    <tr
                      key={guest.id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-2">{guest.name}</td>
                      <td className="py-3 px-2">{guest.username}</td>
                      <td className="py-3 px-2 text-muted-foreground">
                        {guest.email}
                      </td>
                      <td className="py-3 px-2 capitalize">{guest.role}</td>
                      <td className="py-3 px-2">
                        {new Date(guest.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
