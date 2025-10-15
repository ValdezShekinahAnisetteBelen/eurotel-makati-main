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

  // Mock room data - In production, this would come from API
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

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true)
      setContentReady(false)

      // Simulate realistic loading time for better UX
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setRooms(mockRooms)
      setFilteredRooms(mockRooms)
    }

    fetchRooms()
  }, [setRooms])

  useEffect(() => {
    let filtered = rooms

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((room) => room.type === typeFilter)
    }

    // Filter by price range
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
        {/* Filter section - keeping your existing filter code */}
        <div className="mb-8 bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
          {/* Mobile-First Compact Header */}
          <div className="bg-gradient-to-r from-green-800 to-green-700 px-4 py-3">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Find Your Perfect Room
            </h2>
          </div>

          <div className="p-4">
            {/* Mobile: Stack filters vertically with better spacing */}
            <div className="md:hidden space-y-4">
              {/* Search - Full width on mobile */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-4 h-4 z-10" />
                <Input
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 border-green-200 focus:border-green-500 focus:ring-green-500 bg-green-50/30"
                />
              </div>

              {/* Horizontal filter row for mobile */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-11 border-green-200 focus:border-green-500 focus:ring-green-500 bg-green-50/30">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-2 text-green-600" />
                        <SelectValue placeholder="Room Type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="single">
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-2" />
                          Single
                        </div>
                      </SelectItem>
                      <SelectItem value="double">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Double
                        </div>
                      </SelectItem>
                      <SelectItem value="suite">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-2" />
                          Suite
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
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
              </div>

              {/* Active filters display */}
              {(searchTerm || typeFilter !== "all" || priceFilter !== "all") && (
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                      Search: {searchTerm}
                      <button onClick={() => setSearchTerm("")} className="ml-1 hover:bg-green-200 rounded-full p-0.5">
                        ×
                      </button>
                    </Badge>
                  )}
                  {typeFilter !== "all" && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                      {typeFilter === "single" && <Bed className="w-3 h-3" />}
                      {typeFilter === "double" && <Users className="w-3 h-3" />}
                      {typeFilter === "suite" && <Star className="w-3 h-3" />}
                      {typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
                      <button
                        onClick={() => setTypeFilter("all")}
                        className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {priceFilter !== "all" && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                      ₱ {priceFilter === "budget" ? "Budget" : priceFilter === "mid" ? "Mid-range" : "Luxury"}
                      <button
                        onClick={() => setPriceFilter("all")}
                        className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
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
                </div>
              )}
            </div>

            {/* Desktop: Modern engaging design */}
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-white via-green-50/50 to-yellow-50/50 rounded-2xl p-8 border-2 border-green-100 shadow-xl backdrop-blur-sm max-w-6xl mx-auto relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-yellow-400/20 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-300/20 to-blue-300/20 rounded-full -ml-12 -mb-12"></div>

                <div className="relative z-10">
                  <div className="flex flex-wrap gap-6 items-end">
                    {/* Search Input - More prominent */}
                    <div className="flex-1 min-w-[280px] space-y-2">
                      <Label className="text-green-800 font-bold text-sm flex items-center gap-2">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                          <Search className="w-4 h-4 text-green-700" />
                        </div>
                        Search Rooms
                      </Label>
                      <div className="relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5 group-focus-within:text-green-700 group-focus-within:scale-110 transition-all duration-200" />
                        <Input
                          placeholder="Find your perfect room..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-12 pr-4 h-14 border-2 border-green-200/60 focus:border-green-400 focus:ring-2 focus:ring-green-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-medium text-gray-800 placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    {/* Room Type Filter */}
                    <div className="space-y-2 min-w-[180px]">
                      <Label className="text-green-800 font-bold text-sm flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <Bed className="w-4 h-4 text-blue-700" />
                        </div>
                        Room Type
                      </Label>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="h-14 border-2 border-blue-200/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                          <div className="flex items-center gap-3">
                            {typeFilter === "single" && <Bed className="w-5 h-5 text-blue-600" />}
                            {typeFilter === "double" && <Users className="w-5 h-5 text-blue-600" />}
                            {typeFilter === "suite" && <Star className="w-5 h-5 text-blue-600" />}
                            {typeFilter === "all" && <Filter className="w-5 h-5 text-blue-600" />}
                            <SelectValue placeholder="All Types" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-sm border-blue-200 shadow-2xl rounded-xl">
                          <SelectItem value="all" className="hover:bg-blue-50 rounded-lg m-1">
                            <div className="flex items-center gap-3 py-1">
                              <Filter className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">All Types</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="single" className="hover:bg-blue-50 rounded-lg m-1">
                            <div className="flex items-center gap-3 py-1">
                              <Bed className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">Single Rooms</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="double" className="hover:bg-blue-50 rounded-lg m-1">
                            <div className="flex items-center gap-3 py-1">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">Double Rooms</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="suite" className="hover:bg-blue-50 rounded-lg m-1">
                            <div className="flex items-center gap-3 py-1">
                              <Star className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">Luxury Suites</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range Filter */}
                    <div className="space-y-2 min-w-[180px]">
                      <Label className="text-green-800 font-bold text-sm flex items-center gap-2">
                        <div className="p-1.5 bg-yellow-100 rounded-lg">
                          <span className="text-yellow-700 font-bold text-sm">₱</span>
                        </div>
                        Price Range
                      </Label>
                      <Select value={priceFilter} onValueChange={setPriceFilter}>
                        <SelectTrigger className="h-14 border-2 border-yellow-200/60 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className="text-yellow-600 font-bold text-lg">₱</span>
                            <SelectValue placeholder="All Prices" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-sm border-yellow-200 shadow-2xl rounded-xl">
                          <SelectItem value="all" className="hover:bg-yellow-50 rounded-lg m-1">
                            <div className="flex items-center gap-3 py-1">
                              <span className="text-yellow-600 text-lg">💰</span>
                              <span className="font-medium">All Prices</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="budget" className="hover:bg-yellow-50 rounded-lg m-1">
                            <div className="flex items-center gap-3 py-1">
                              <span className="text-green-600 text-lg">💵</span>
                              <div>
                                <span className="font-medium">Budget</span>
                                <div className="text-xs text-gray-500">₱0 - ₱150</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="mid" className="hover:bg-yellow-50 rounded-lg m-1">
                            <div className="flex items-center gap-3 py-1">
                              <span className="text-blue-600 text-lg">💳</span>
                              <div>
                                <span className="font-medium">Mid-Range</span>
                                <div className="text-xs text-gray-500">₱151 - ₱300</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="luxury" className="hover:bg-yellow-50 rounded-lg m-1">
                            <div className="flex items-center gap-3 py-1">
                              <span className="text-purple-600 text-lg">💎</span>
                              <div>
                                <span className="font-medium">Luxury</span>
                                <div className="text-xs text-gray-500">₱300+</div>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="space-y-2">
                      <Label className="text-transparent">.</Label>
                      <Button
                        onClick={() => {
                          setSearchTerm("")
                          setTypeFilter("all")
                          setPriceFilter("all")
                        }}
                        className="h-14 px-8 bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 text-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl font-bold text-sm border-2 border-green-500/20 hover:border-green-400/30 hover:scale-105 active:scale-95"
                      >
                        <Filter className="w-5 h-5 mr-2" />
                        Clear All
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Active Filters - Modern pill design */}
                {(searchTerm || typeFilter !== "all" || priceFilter !== "all") && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                        <Filter className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-lg font-bold text-gray-800">Active Filters</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {searchTerm && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-300/50 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
                          <Search className="w-4 h-4" />
                          <span className="font-semibold">&quot;{searchTerm}&quot;</span>

                          <button
                            onClick={() => setSearchTerm("")}
                            className="ml-1 p-1 hover:bg-green-300 rounded-full text-green-700 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {typeFilter !== "all" && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-2 border-blue-300/50 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
                          {typeFilter === "single" && <Bed className="w-4 h-4" />}
                          {typeFilter === "double" && <Users className="w-4 h-4" />}
                          {typeFilter === "suite" && <Star className="w-4 h-4" />}
                          <span className="font-semibold">
                            {typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)} Rooms
                          </span>
                          <button
                            onClick={() => setTypeFilter("all")}
                            className="ml-1 p-1 hover:bg-blue-300 rounded-full text-blue-700 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {priceFilter !== "all" && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-2 border-yellow-300/50 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
                          <span className="text-yellow-700 font-bold">₱</span>
                          <span className="font-semibold">
                            {priceFilter === "budget"
                              ? "Budget Range"
                              : priceFilter === "mid"
                                ? "Mid-Range"
                                : "Luxury Range"}
                          </span>
                          <button
                            onClick={() => setPriceFilter("all")}
                            className="ml-1 p-1 hover:bg-yellow-300 rounded-full text-yellow-700 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                Try adjusting your filters to see more room options.
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
                  className="h-48 bg-cover bg-center relative"
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
                Youve selected the <strong className="text-yellow-400">{selectedRoom.name}</strong>. Proceed to
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
