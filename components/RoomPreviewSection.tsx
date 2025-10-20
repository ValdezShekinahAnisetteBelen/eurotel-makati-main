"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Wifi, Coffee, Tv, Bath, Bed, Users, Star, CheckCircle, ArrowRight, Eye } from "lucide-react"
import Link from "next/link"
import axios from "axios"

type Room = {
  id: string
  name: string
  type?: string
  price: number
  description: string
  amenities: string[]
  images?: string[]
  status?: string
  featured?: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL

export default function RoomsPreviewSection() {
  const { user } = useAuth()
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        const res = await axios.get(`${API_URL}/rooms/featured`)
        setFeaturedRooms(res.data)
      } catch (error) {
        console.error("Error fetching featured rooms:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedRooms()
  }, [])

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "free wifi":
        return <Wifi className="w-4 h-4" />
      case "room service":
        return <Coffee className="w-4 h-4" />
      case "flat screen tv":
        return <Tv className="w-4 h-4" />
      case "jacuzzi":
        return <Bath className="w-4 h-4" />
      case "city view":
      case "balcony":
        return <Star className="w-4 h-4" />
      default:
        return <CheckCircle className="w-4 h-4" />
    }
  }

  const getRoomTypeIcon = (type?: string) => {
    switch (type) {
      case "single":
        return <Bed className="w-5 h-5" />
      case "double":
        return <Users className="w-5 h-5" />
      case "suite":
        return <Star className="w-5 h-5" />
      default:
        return <Bed className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 to-yellow-50 text-center text-green-800">
        <p>Loading featured rooms...</p>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            Our <span className="text-yellow-600">Featured Rooms</span>
          </h2>
          <p className="text-lg text-green-600 max-w-2xl mx-auto">
            Discover comfort and luxury in our carefully designed accommodations, each offering exceptional amenities and service.
          </p>
        </div>

        {featuredRooms.length === 0 ? (
          <p className="text-center text-green-700">No featured rooms available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredRooms.map((room) => (
              <Card
                key={room.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col p-0 border-green-200 hover:border-green-400 group"
              >
                <div
                  className="h-48 bg-cover bg-center relative group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundImage: `url('${
                      room.images?.[0]?.startsWith("http")
                        ? room.images[0]
                        : `${IMAGE_BASE_URL}/${room.images?.[0] || "rooms/default.jpg"}`
                    }')`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                      {room.status || "Available"}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-green-200">
                      ₱{room.price}/night
                    </Badge>
                  </div>
                </div>

                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="flex items-center text-green-800">
                    {getRoomTypeIcon(room.type)}
                    <span className="ml-2">{room.name}</span>
                  </CardTitle>
                  <CardDescription className="text-green-600 line-clamp-2">{room.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col px-6 pb-6">
                  <div className="space-y-4 flex-1">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-green-800">Top Amenities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities?.slice(0, 4).map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full"
                          >
                            {getAmenityIcon(amenity)}
                            <span className="ml-1">{amenity}</span>
                          </div>
                        ))}
                        {room.amenities?.length > 4 && (
                          <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            +{room.amenities.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-green-200 mt-auto">
                    <div className="text-2xl font-bold text-green-800">
                      ₱{room.price}
                      <span className="text-sm text-green-600 font-normal">/night</span>
                    </div>

                    {user ? (
                      <Link href={`/rooms/${room.id}`}>
                        <Button
                          className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white group/btn"
                          size="sm"
                        >
                          Book Now
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/login">
                        <Button
                          className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-green-900 group/btn"
                          size="sm"
                        >
                          Login to Book
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/rooms">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-green-900 font-bold px-8 py-3 text-lg group/cta hover:scale-105 transition-transform"
            >
              <Eye className="mr-3 w-5 h-5" />
              View All Rooms
              <ArrowRight className="ml-3 w-5 h-5 group-hover/cta:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
