"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Room {
  id: string
  name: string
  type: "single" | "double" | "suite"
  price: number
  description: string
  amenities: string[]
  image: string
  images: string[]
  available: boolean
}

interface RoomContextType {
  rooms: Room[]
  setRooms: (rooms: Room[]) => void
  selectedRoom: Room | null
  setSelectedRoom: (room: Room | null) => void
}

const RoomContext = createContext<RoomContextType | undefined>(undefined)

export function RoomProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  return (
    <RoomContext.Provider
      value={{
        rooms,
        setRooms,
        selectedRoom,
        setSelectedRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  const context = useContext(RoomContext)
  if (context === undefined) {
    throw new Error("useRoom must be used within a RoomProvider")
  }
  return context
}
