"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import axios from "axios"

type Room = {
  id: number
  name: string
  description: string
  price: number
  discount: number
  images?: string[]
}

export default function OffersSection() {
  const [discountedRooms, setDiscountedRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDiscountedRooms = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/discounted`)
        setDiscountedRooms(res.data)
      } catch (error) {
        console.error("Error fetching discounted rooms:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscountedRooms()
  }, [])

  if (loading) {
    return (
      <section className="py-20 text-center bg-gradient-to-br from-yellow-50 to-yellow-100">
        <p className="text-green-700">Loading exclusive offers...</p>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 to-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-800">Exclusive Offers</h2>
          <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-yellow-500 to-yellow-400" />
          <p className="text-lg max-w-2xl mx-auto text-green-700">
            Enjoy discounted rates on our selected rooms for a limited time.
          </p>
        </div>

        {discountedRooms.length === 0 ? (
          <p className="text-center text-green-700">No discounted offers available right now.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {discountedRooms.map((room) => {
              const discountedPrice = room.price - (room.price * (room.discount / 100))
              return (
                <div
                  key={room.id}
                  className="overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-green-50 shadow-xl border border-yellow-200"
                >
                  <div
                    className="h-56 bg-cover bg-center relative"
                    style={{
                      backgroundImage: `url('${room.images?.[0] || "/rooms/default.jpg"}')`,
                    }}
                  >
                    <div className="absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold bg-yellow-500 text-green-900">
                      Save {room.discount}%
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4 text-green-800">{room.name}</h3>
                    <p className="mb-6 text-green-700 line-clamp-2">{room.description}</p>
                    <ul className="space-y-3 mb-8 text-sm text-green-700">
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-3 text-yellow-500" />
                        Original Price: ₱{room.price.toLocaleString()}
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-3 text-yellow-500" />
                        Discounted Price: <span className="font-bold text-green-800 ml-1">₱{discountedPrice.toLocaleString()}</span>
                      </li>
                    </ul>
                    <Link href={`/rooms/${room.id}`}>
                      <button className="w-full py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 bg-yellow-500 text-green-900 shadow-lg hover:bg-yellow-400">
                        Book Now
                      </button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
