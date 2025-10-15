"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRoom, type Room } from "@/contexts/room-context"
import { useAuth } from "@/contexts/auth-context"
import { Wifi, Coffee, Tv, Bath, Bed, Users, Star, CheckCircle, ArrowRight, Eye } from "lucide-react"
import Link from "next/link"

// ✅ Move mockRooms OUTSIDE component so it's not treated as a dependency
const mockRooms: Room[] = [
  {
    id: "1",
    name: "Deluxe Single Room",
    type: "single",
    price: 150,
    description: "Perfect for solo travelers, featuring a comfortable queen bed and modern amenities.",
    amenities: ["Free WiFi", "Air Conditioning", "Mini Bar", "Room Service", "Flat Screen TV"],
    image: "/deluxe-single-room.jpg",
    available: true,
    images: [],
  },
  {
    id: "2",
    name: "Superior Single Room",
    type: "single",
    price: 120,
    description: "Cozy single room with all essential amenities for a comfortable stay.",
    amenities: ["Free WiFi", "Air Conditioning", "Room Service", "Flat Screen TV"],
    image: "/superior-single-room.jpg",
    available: true,
    images: [],
  },
  {
    id: "3",
    name: "Standard Double Room",
    type: "double",
    price: 200,
    description: "Spacious double room perfect for couples with a king-size bed and city views.",
    amenities: ["Free WiFi", "Air Conditioning", "Mini Bar", "Room Service", "Flat Screen TV", "City View"],
    image: "/standard-double-room.jpg",
    available: true,
    images: [],
  },
  {
    id: "4",
    name: "Deluxe Double Room",
    type: "double",
    price: 250,
    description: "Luxurious double room with premium amenities and stunning city panorama.",
    amenities: [
      "Free WiFi",
      "Air Conditioning",
      "Mini Bar",
      "Room Service",
      "Flat Screen TV",
      "City View",
      "Balcony",
    ],
    image: "/deluxe-double-room.jpg",
    available: false,
    images: [],
  },
  {
    id: "5",
    name: "Executive Suite",
    type: "suite",
    price: 400,
    description: "Spacious suite with separate living area, perfect for business travelers and extended stays.",
    amenities: [
      "Free WiFi",
      "Air Conditioning",
      "Mini Bar",
      "Room Service",
      "Flat Screen TV",
      "City View",
      "Balcony",
      "Work Desk",
      "Sofa",
    ],
    image: "/executive-suite.jpg",
    available: true,
    images: [],
  },
  {
    id: "6",
    name: "Presidential Suite",
    type: "suite",
    price: 600,
    description: "The ultimate luxury experience with premium amenities and personalized service.",
    amenities: [
      "Free WiFi",
      "Air Conditioning",
      "Mini Bar",
      "Room Service",
      "Flat Screen TV",
      "City View",
      "Balcony",
      "Work Desk",
      "Sofa",
      "Jacuzzi",
      "Butler Service",
    ],
    image: "/luxury-hotel-spa-and-wellness-center.jpg",
    available: true,
    images: [],
  },
]

export default function RoomsPreviewSection() {
  const { rooms, setRooms } = useRoom()
  const { user } = useAuth()
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([])

  useEffect(() => {
    // Set rooms in context if not already set
    if (rooms.length === 0) {
      setRooms(mockRooms)
    }

    // Show only 3 featured rooms (single, double, suite)
    const featured = [
      mockRooms.find((room) => room.type === "single" && room.available),
      mockRooms.find((room) => room.type === "double" && room.available),
      mockRooms.find((room) => room.type === "suite" && room.available),
    ].filter(Boolean) as Room[]

    setFeaturedRooms(featured)
  }, [rooms.length, setRooms]) // ✅ warning gone

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

  const getRoomTypeIcon = (type: string) => {
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

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            Our <span className="text-yellow-600">Featured Rooms</span>
          </h2>
          <p className="text-lg text-green-600 max-w-2xl mx-auto">
            Discover comfort and luxury in our carefully designed accommodations, each offering exceptional amenities
            and service.
          </p>
        </div>

        {/* Featured Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredRooms.map((room) => (
            <Card
              key={room.id}
              className="overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col p-0 border-green-200 hover:border-green-400 group"
            >
              <div
                className="h-48 bg-cover bg-center relative group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundImage: `url('${room.image}')` }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="absolute top-4 left-4">
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                    Available
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-green-200">
                    ₱{room.price}/night
                  </Badge>
                </div>
                {/* Overlay with quick view */}
                <div className="absolute inset-0 bg-green-800/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Eye className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Quick View</p>
                  </div>
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
                      {room.amenities.slice(0, 4).map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full"
                        >
                          {getAmenityIcon(amenity)}
                          <span className="ml-1">{amenity}</span>
                        </div>
                      ))}
                      {room.amenities.length > 4 && (
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

        {/* View All Rooms CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-2xl p-8 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/20 rounded-full -ml-12 -mb-12"></div>

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Discover All Our <span className="text-yellow-400">Amazing Rooms</span>
              </h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Explore our complete collection of rooms and suites. From budget-friendly options to luxury
                accommodations, find the perfect space for your stay with advanced filtering and detailed information.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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

                <div className="text-center sm:text-left">
                  <div className="text-yellow-200 text-sm font-medium">{mockRooms.length} Total Rooms Available</div>
                  <div className="text-green-100 text-xs">Advanced search & filtering options</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
