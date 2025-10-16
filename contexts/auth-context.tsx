"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: number
  name?: string
  username?: string
  email: string
  role?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ✅ Restore from localStorage on mount
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser)
        // Handle both {user:{...}} or {...}
        setUser(parsed.user || parsed)
        setToken(storedToken)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) return false

      const data = await response.json()

      // ✅ Expect { user: {...}, token: "..." }
      const userData = data.user || data.userData || data
      const accessToken = data.token || data.access_token

      setUser(userData)
      setToken(accessToken)

      localStorage.setItem("user", JSON.stringify({ user: userData }))
      localStorage.setItem("token", accessToken)

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {})
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
