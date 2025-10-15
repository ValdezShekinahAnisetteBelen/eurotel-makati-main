// app/(admin)/layout.tsx
"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Toaster } from "sonner"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      {children}
      <Toaster richColors position="top-right" />
    </DashboardLayout>
  )
}
