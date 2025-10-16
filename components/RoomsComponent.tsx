"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRoom, type Room } from "@/contexts/room-context"
import { useAuth } from "@/contexts/auth-context"
import { CustomLoader } from "@/components/custom-loader"
import {
  Wifi,
  Coffee,
  Tv,
  Bath,
  Bed,
  Users,
  Star,
  Filter,
  Search,
  CheckCircle,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

export default function RoomsComponent() {
  const { rooms, setRooms, selectedRoom, setSelectedRoom } = useRoom()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priceFilter, setPriceFilter] = useState<string>("all")
  const [contentReady, setContentReady] = useState(false)

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true)
      setContentReady(false)

      try {
        const response = await fetch("/api/rooms", {
          headers: {
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch rooms")
        }

        const data = await response.json()
        console.log("📦 Raw API data:", data)
        
        // Transform API data to match Room interface
        const transformedRooms: Room[] = data.map((room: any) => {
          // Parse images if it's a string
          let imageArray = room.images
          if (typeof room.images === 'string') {
            try {
              imageArray = JSON.parse(room.images)
            } catch (e) {
              console.error('Failed to parse images for room:', room.name, e)
              imageArray = []
            }
          }
          
          // Parse amenities if it's a string
          let amenitiesArray = room.amenities
          if (typeof room.amenities === 'string') {
            try {
              amenitiesArray = JSON.parse(room.amenities)
            } catch (e) {
              console.error('Failed to parse amenities for room:', room.name, e)
              amenitiesArray = []
            }
          }

          // Ensure arrays are valid
          imageArray = Array.isArray(imageArray) ? imageArray : []
          amenitiesArray = Array.isArray(amenitiesArray) ? amenitiesArray : []

          // Get first image or placeholder
          const firstImage = imageArray[0] || null
          const imageUrl = firstImage 
            ? `http://localhost:8000/${firstImage}`
            : "/placeholder-room.jpg"

          console.log(`🖼️ Room ${room.name} - Image URL:`, imageUrl)

          return {
            id: String(room.id),
            name: room.name,
            type: determineRoomType(room.name),
            price: Number(room.price),
            description: room.description || "",
            amenities: amenitiesArray,
            image: imageUrl,
            available: room.status === "Available",
            images: imageArray.map((img: string) => `http://localhost:8000/${img}`),
          }
        })

        console.log("✅ Transformed rooms:", transformedRooms)
        setRooms(transformedRooms)
        setFilteredRooms(transformedRooms)
      } catch (error) {
        console.error("Error fetching rooms:", error)
        setRooms([])
        setFilteredRooms([])
      } finally {
        setTimeout(() => {
          setIsLoading(false)
          setContentReady(true)
        }, 1000)
      }
    }

    fetchRooms()
  }, [setRooms])

  // Helper function to determine room type based on name
  const determineRoomType = (name: string): string => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("suite")) return "suite"
    if (lowerName.includes("double") || lowerName.includes("twin")) return "double"
    return "single"
  }

  useEffect(() => {
    let filtered = rooms

    if (searchTerm) {
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((room) => room.type === typeFilter)
    }

    if (priceFilter !== "all") {
      switch (priceFilter) {
        case "budget":
          filtered = filtered.filter((room) => room.price <= 150)
          break
        case "mid":
          filtered = filtered.filter((room) => room.price > 150 && room.price <= 300)
          break
        case "luxury":
          filtered = filtered.filter((room) => room.price > 300)
          break
      }
    }

    setFilteredRooms(filtered)
  }, [rooms, searchTerm, typeFilter, priceFilter])

  const handleSelectRoom = (room: Room) => {
    if (!room.available) return
    setSelectedRoom(room)
  }

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

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setContentReady(true)
  }

  if (isLoading || !contentReady) {
    return <CustomLoader isLoading={isLoading} onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <section className="py-16 bg-gradient-to-r from-green-800 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Our <span className="text-yellow-400">Rooms & Suites</span>
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto text-pretty">
            Choose from our carefully designed accommodations, each offering comfort, luxury, and exceptional service.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter section */}
        <div className="mb-8 bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-800 to-green-700 px-4 py-3">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Find Your Perfect Room
            </h2>
          </div>

          <div className="p-4">
            {/* Mobile filters */}
            <div className="md:hidden space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-4 h-4 z-10" />
                <Input
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 border-green-200 focus:border-green-500 focus:ring-green-500 bg-green-50/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-11 border-green-200 focus:border-green-500 focus:ring-green-500 bg-green-50/30">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-2 text-green-600" />
                      <SelectValue placeholder="Room Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="h-11 border-green-200 focus:border-green-500 focus:ring-green-500 bg-green-50/30">
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">₱</span>
                      <SelectValue placeholder="Price Range" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="budget">Budget (₱0-₱150)</SelectItem>
                    <SelectItem value="mid">Mid (₱151-₱300)</SelectItem>
                    <SelectItem value="luxury">Luxury (₱300+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(searchTerm || typeFilter !== "all" || priceFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setTypeFilter("all")
                    setPriceFilter("all")
                  }}
                  className="text-green-700 hover:bg-green-50 text-xs h-6 px-2"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Desktop filters */}
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-white via-green-50/50 to-yellow-50/50 rounded-2xl p-8 border-2 border-green-100 shadow-xl">
                <div className="flex flex-wrap gap-6 items-end">
                  <div className="flex-1 min-w-[280px] space-y-2">
                    <Label className="text-green-800 font-bold text-sm flex items-center gap-2">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <Search className="w-4 h-4 text-green-700" />
                      </div>
                      Search Rooms
                    </Label>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                      <Input
                        placeholder="Find your perfect room..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-4 h-14 border-2 border-green-200/60 focus:border-green-400 focus:ring-2 focus:ring-green-200 bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 min-w-[180px]">
                    <Label className="text-green-800 font-bold text-sm flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Bed className="w-4 h-4 text-blue-700" />
                      </div>
                      Room Type
                    </Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="h-14 border-2 border-blue-200/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="single">Single Rooms</SelectItem>
                        <SelectItem value="double">Double Rooms</SelectItem>
                        <SelectItem value="suite">Luxury Suites</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 min-w-[180px]">
                    <Label className="text-green-800 font-bold text-sm flex items-center gap-2">
                      <div className="p-1.5 bg-yellow-100 rounded-lg">
                        <span className="text-yellow-700 font-bold text-sm">₱</span>
                      </div>
                      Price Range
                    </Label>
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                      <SelectTrigger className="h-14 border-2 border-yellow-200/60 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                        <SelectValue placeholder="All Prices" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="budget">Budget (₱0-₱150)</SelectItem>
                        <SelectItem value="mid">Mid-Range (₱151-₱300)</SelectItem>
                        <SelectItem value="luxury">Luxury (₱300+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-transparent">.</Label>
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setTypeFilter("all")
                        setPriceFilter("all")
                      }}
                      className="h-14 px-8 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl"
                    >
                      <Filter className="w-5 h-5 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length === 0 ? (
          <Card className="text-center py-12 border-green-200">
            <CardContent>
              <AlertCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="mb-2 text-green-800">No rooms found</CardTitle>
              <CardDescription className="text-green-600">
                {rooms.length === 0 
                  ? "No rooms available at the moment. Please check back later."
                  : "Try adjusting your filters to see more room options."}
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <Card
                key={room.id}
                className={`overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col p-0 border-green-200 hover:border-green-400 ${
                  selectedRoom?.id === room.id ? "ring-2 ring-green-600" : ""
                } ${!room.available ? "opacity-60" : ""}`}
              >
                <div
                  className="h-48 bg-cover bg-center relative bg-gray-100"
                  style={{
                    backgroundImage: `url('${room.image}')`,
                  }}
                >
                  <div className="absolute top-4 left-4">
                    <Badge variant={room.available ? "default" : "secondary"}>
                      {room.available ? "Available" : "Booked"}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-background/80">
                      ₱{room.price}/night
                    </Badge>
                  </div>
                </div>

                <CardHeader className="px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-green-800">
                      {getRoomTypeIcon(room.type)}
                      <span className="ml-2">{room.name}</span>
                    </CardTitle>
                    {selectedRoom?.id === room.id && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  <CardDescription className="text-green-600">{room.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col px-6 pb-6">
                  <div className="space-y-4 flex-1">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-green-800">Amenities:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {room.amenities.slice(0, 6).map((amenity, index) => (
                          <div key={index} className="flex items-center text-xs text-muted-foreground">
                            {getAmenityIcon(amenity)}
                            <span className="ml-1 truncate">{amenity}</span>
                          </div>
                        ))}
                      </div>
                      {room.amenities.length > 6 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          +{room.amenities.length - 6} more amenities
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-green-200 mt-auto">
                    <div className="text-2xl font-bold text-green-800">
                      ₱{room.price}
                      <span className="text-sm text-green-600 font-normal">/night</span>
                    </div>

                    {room.available ? (
                      user ? (
                        <Link href={`/rooms/${room.id}`}>
                          <Button
                            className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white"
                            size="sm"
                          >
                            Select Room
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/login">
                          <Button
                            className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-green-900"
                            size="sm"
                          >
                            Login to Book
                          </Button>
                        </Link>
                      )
                    ) : (
                      <Button disabled size="sm" className="bg-gray-400">
                        Not Available
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedRoom && user && (
          <Card className="mt-8 bg-gradient-to-r from-green-800 to-green-700 text-white border-green-600">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Ready to Book?</h3>
              <p className="mb-4 text-green-100">
                You've selected the <strong className="text-yellow-400">{selectedRoom.name}</strong>. Proceed to
                check-in/checkout to complete your booking.
              </p>
              <Link href="/checkin-checkout">
                <Button
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-green-900"
                  size="lg"
                >
                  Continue to Booking
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}