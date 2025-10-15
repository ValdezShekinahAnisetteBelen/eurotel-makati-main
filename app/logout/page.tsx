"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { CustomLoader } from "@/components/custom-loader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function LogoutPage() {
  const { logout, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      logout()
    }
  }, [user, logout])

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <>
      <CustomLoader isLoading={isLoading} />
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Successfully Logged Out</CardTitle>
            <CardDescription>Thank you for visiting Eurotel. We hope to see you again soon!</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGoHome} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
