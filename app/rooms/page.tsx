"use client"

import { Navbar } from "@/components/navbar"
import RoomsComponent from "@/components/RoomsComponent"

export default function RoomsPage() {
  return (
    <>
      <Navbar />
      <main className="mt-0">
        <RoomsComponent />
      </main>

    </>
  )
}
