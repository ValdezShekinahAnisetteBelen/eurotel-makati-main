"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  CheckCircle,
  ArrowLeft,
  Calendar,
  CreditCard,
  User,
  MapPin,
  Utensils,
  Shield,
  Heart,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

export default function RoomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { setSelectedRoom } = useRoom()
  const { user } = useAuth()
  const [room, setRoom] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [guestValidationError, setGuestValidationError] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    specialRequests: "",
  })

  // Helper function to determine room type based on name
  const determineRoomType = (name: string): "single" | "double" | "suite" => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("suite")) return "suite"
    if (lowerName.includes("double") || lowerName.includes("twin")) return "double"
    return "single"
  }

  // Helper function to get max guests based on room type
  const getMaxGuests = (roomType: string) => {
    switch (roomType) {
      case "single":
        return 2
      case "double":
        return 3
      case "suite":
        return 4
      default:
        return 2
    }
  }

  // Replace the fetchRoom function in app/rooms/[id]/page.tsx

useEffect(() => {
  const fetchRoom = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/rooms/${params.id}`, {
        headers: {
          Accept: "application/json",
        },
      })

      const data = await response.json()

      // Check if the response contains an error
      if (!response.ok || data.error) {
        if (response.status === 404 || data.error) {
          console.log(`Room issue:`, data.error || `Status ${response.status}`)
        } else {
          console.error(`Failed to fetch room (${response.status}):`, data)
        }
        setRoom(null)
        return
      }

      console.log("📦 Raw API room data:", data)
      
      // Transform API data to match Room interface
      let imageArray = data.images
      if (typeof data.images === 'string') {
        try {
          imageArray = JSON.parse(data.images)
        } catch (e) {
          console.error('Failed to parse images for room:', data.name, e)
          imageArray = []
        }
      }
      
      // Parse amenities if it's a string
      let amenitiesArray = data.amenities
      if (typeof data.amenities === 'string') {
        try {
          amenitiesArray = JSON.parse(data.amenities)
        } catch (e) {
          console.error('Failed to parse amenities for room:', data.name, e)
          amenitiesArray = []
        }
      }

      // Ensure arrays are valid
      imageArray = Array.isArray(imageArray) ? imageArray : []
      amenitiesArray = Array.isArray(amenitiesArray) ? amenitiesArray : []

      // Get first image or placeholder
      const firstImage = imageArray[0] || null
      const imageUrl = firstImage 
        ? `${process.env.NEXT_PUBLIC_API_URL}/${firstImage}`
        : "/placeholder-room.jpg"

      const transformedRoom: Room = {
        id: String(data.id),
        name: data.name,
        type: determineRoomType(data.name),
        price: Number(data.price),
        description: data.description || "",
        amenities: amenitiesArray,
        image: imageUrl,
        available: data.status === "Available",
        images: imageArray.map((img: string) => `${process.env.NEXT_PUBLIC_API_URL}/${img}`),
      }

      console.log("✅ Transformed room:", transformedRoom)
      setRoom(transformedRoom)
      setSelectedRoom(transformedRoom)
    } catch (error) {
      console.error("Network or parsing error:", error)
      setRoom(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (params.id) {
    fetchRoom()
  }
}, [params.id, setSelectedRoom])

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

  const calculateTotal = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !room) return 0
    const checkIn = new Date(bookingData.checkIn)
    const checkOut = new Date(bookingData.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    return nights > 0 ? nights * room.price : 0
  }

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    const maxGuests = room ? getMaxGuests(room.type) : 2

    if (value > maxGuests) {
      setGuestValidationError(
        `This ${room?.type} room can accommodate a maximum of ${maxGuests} guests. Please select ${maxGuests} or fewer guests.`
      )
      
      // Show toast notification
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
      }, 4000) // Hide toast after 4 seconds
      
      return
    } else {
      setGuestValidationError("")
      setBookingData({ ...bookingData, guests: value })
    }
  }

  const handleBooking = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user || !room) return;

  // Final validation before booking
  const maxGuests = getMaxGuests(room.type);
  if (bookingData.guests > maxGuests) {
    setGuestValidationError(
      `This ${room.type} room can accommodate a maximum of ${maxGuests} guests. Please select ${maxGuests} or fewer guests.`
    );
    return;
  }

  setIsBooking(true);

  try {
    // ✅ get user data from localStorage if not from context
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser).user : user;

    // ✅ Prepare booking data with all fields
    const completeBookingData = {
      user_id: parsedUser?.id || null, // <-- important
      roomId: room.id,
      roomName: room.name,
      roomPrice: room.price,
      roomType: room.type,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      firstName: parsedUser?.name?.split(" ")[0] || "Guest",
      lastName: parsedUser?.name?.split(" ")[1] || "",
      email: parsedUser?.email || bookingData.email,
      phone: bookingData.phone || "N/A",
      address: bookingData.address || "N/A",
      specialRequests: bookingData.specialRequests || "",
      totalAmount: calculateTotal(),
      nights: Math.ceil(
        (new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    };

    // ✅ Send booking data to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(completeBookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Booking failed:", errorData);
      alert(errorData.message || "Booking failed. Please try again.");
      return;
    }

    const result = await response.json();
    console.log("✅ Booking stored:", result);

    alert(`Booking confirmed for ${room.name}! Total: ₱${calculateTotal().toLocaleString()}`);
    router.push("/profile");
  } catch (error) {
    console.error("❌ Booking error:", error);
    alert("An error occurred while processing your booking. Please try again.");
  } finally {
    setIsBooking(false);
  }
};


  const roomImages = room?.images || [room?.image || "/placeholder.svg?height=400&width=600"]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % roomImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length)
  }

  if (isLoading) {
    return <CustomLoader isLoading={true} />
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
            <p className="text-muted-foreground mb-4">The room you are looking for doesn't exist.</p>
            <Link href="/rooms">
              <Button>Back to Rooms</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!room.available) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert className="mb-6 border-destructive bg-destructive/5">
            <AlertDescription className="text-destructive">
              This room is currently not available for booking.
            </AlertDescription>
          </Alert>
          <Link href="/rooms">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rooms
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const maxGuests = getMaxGuests(room.type)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">Guest Limit Exceeded!</h4>
                <p className="text-sm opacity-90 mt-1">
                  This {room?.type} room can only accommodate {room ? getMaxGuests(room.type) : 2} guests maximum.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Image Gallery */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={roomImages[currentImageIndex] || "/placeholder.svg"}
            alt={room?.name || "Room"}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Image Navigation */}
        {roomImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
              onClick={nextImage}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {roomImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </>
        )}

        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link href="/rooms">
            <Button variant="ghost" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rooms
            </Button>
          </Link>
        </div>

        {/* Room Status and Price */}
        <div className="absolute top-6 right-6 flex gap-2">
          <Badge className="bg-green-600/90 text-white backdrop-blur-sm">
            {room?.available ? "Available" : "Unavailable"}
          </Badge>
          <Badge className="bg-yellow-500/90 text-green-900 backdrop-blur-sm font-bold">₱{room?.price}/night</Badge>
        </div>

        {/* Room Title Overlay */}
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{room?.name}</h1>
          <p className="text-lg text-white/90 max-w-md">{room?.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Changed from lg:grid-cols-3 to lg:grid-cols-5 and adjusted column spans */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Room Details - Left Column - Now takes 3/5 instead of 2/3 */}
          <div className="lg:col-span-3 space-y-6">
            {/* Room Specifications */}
            <Card className="border-green-200 shadow-lg overflow-hidden py-0">
              <CardHeader className="bg-gradient-to-r from-green-700 to-green-600 text-white p-4">
                <CardTitle className="flex items-center text-white">
                  <Bed className="w-5 h-5 mr-2" />
                  Room Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                      <Bed className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="font-semibold text-green-800">Bed Type</p>
                    <p className="text-sm text-green-600">
                      {room?.type === "single" ? "Queen Bed" : room?.type === "double" ? "King Bed" : "King + Sofa"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="font-semibold text-green-800">Capacity</p>
                    <p className="text-sm text-green-600">
                      Max {maxGuests} Guests
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                      <div className="w-6 h-6 border-2 border-green-600 rounded-sm flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600">m²</span>
                      </div>
                    </div>
                    <p className="font-semibold text-green-800">Size</p>
                    <p className="text-sm text-green-600">
                      {room?.type === "single" ? "25" : room?.type === "double" ? "35" : "55"} m²
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="font-semibold text-green-800">Location</p>
                    <p className="text-sm text-green-600">Makati City</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities Grid */}
            <Card className="border-green-200 shadow-lg overflow-hidden py-0">
              <CardHeader className="bg-gradient-to-r from-green-700 to-green-600 text-white p-4">
                <CardTitle className="flex items-center text-white">
                  <Star className="w-5 h-5 mr-2" />
                  Room Amenities
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room?.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                      {getAmenityIcon(amenity)}
                      <span className="ml-3 text-green-800 font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hotel Features */}
            <Card className="border-green-200 shadow-lg overflow-hidden py-0">
              <CardHeader className="bg-gradient-to-r from-green-700 to-green-600 text-white p-4">
                <CardTitle className="flex items-center text-white">
                  <Shield className="w-5 h-5 mr-2" />
                  Hotel Features & Services
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4 mt-1">
                      <Coffee className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1">24/7 Concierge Service</h4>
                      <p className="text-sm text-green-600">Our dedicated team is available around the clock</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4 mt-1">
                      <Utensils className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1">Complimentary Breakfast</h4>
                      <p className="text-sm text-green-600">Start your day with our delicious continental breakfast</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4 mt-1">
                      <MapPin className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1">Prime Makati Location</h4>
                      <p className="text-sm text-green-600">Located in the heart of Makati's business district</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4 mt-1">
                      <Heart className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1">Spa & Wellness Center</h4>
                      <p className="text-sm text-green-600">Relax and rejuvenate at our luxury spa</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form - Right Column - Now takes 2/5 instead of 1/3 */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-green-200 shadow-lg overflow-hidden sticky top-4 py-0">
              <CardHeader className="bg-gradient-to-r from-green-800 to-green-700 text-white p-4">
                <CardTitle className="flex items-center text-white">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book This Room
                </CardTitle>
                <CardDescription className="text-green-100">
                  Fill in your details to complete the booking
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {user ? (
                  <form onSubmit={handleBooking} className="space-y-4">
                    {/* Room Summary Section */}
                    <Card className="bg-gradient-to-r from-green-50 to-yellow-50 border-green-200 overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-green-800 text-lg">{room.name}</h4>
                            <p className="text-sm text-green-600 mt-1">{room.description}</p>
                          </div>
                          <div className="ml-4 text-right">
                            <div className="text-2xl font-bold text-yellow-600">₱{room.price}</div>
                            <div className="text-sm text-green-700">per night</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-green-700">
                              {room?.type === "single" ? "Queen Bed" : room?.type === "double" ? "King Bed" : "King + Sofa"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-green-700">
                              Max {maxGuests} Guests
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-4 h-4 border border-green-600 rounded-sm flex items-center justify-center mr-2">
                              <span className="text-xs font-bold text-green-600">m²</span>
                            </div>
                            <span className="text-green-700">
                              {room?.type === "single" ? "25" : room?.type === "double" ? "35" : "55"} m²
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-green-700">Makati City</span>
                          </div>
                        </div>

                        {/* Quick Amenities Preview */}
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="flex flex-wrap gap-1">
                            {room.amenities.slice(0, 4).map((amenity, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-white/50 text-green-700 border-green-300">
                                {amenity}
                              </Badge>
                            ))}
                            {room.amenities.length > 4 && (
                              <Badge variant="outline" className="text-xs bg-white/50 text-green-600 border-green-300">
                                +{room.amenities.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkIn" className="text-green-800 font-medium">
                          Check-in Date
                        </Label>
                        <Input
                          id="checkIn"
                          type="date"
                          value={bookingData.checkIn}
                          onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                          min={new Date().toISOString().split("T")[0]}
                          className="border-green-200 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkOut" className="text-green-800 font-medium">
                          Check-out Date
                        </Label>
                        <Input
                          id="checkOut"
                          type="date"
                          value={bookingData.checkOut}
                          onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                          min={bookingData.checkIn || new Date().toISOString().split("T")[0]}
                          className="border-green-200 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Guests with Validation */}
                    <div className="space-y-2">
                      <Label htmlFor="guests" className="text-green-800 font-medium">
                        Number of Guests (Max {maxGuests})
                      </Label>
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        max={maxGuests}
                        value={bookingData.guests}
                        onChange={handleGuestChange}
                        className={`border-green-200 focus:border-green-500 focus:ring-green-500 ${
                          guestValidationError ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        required
                      />
                      {guestValidationError && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-700 text-sm">
                            {guestValidationError}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Guest Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-green-800 font-medium">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={bookingData.firstName}
                          onChange={(e) => setBookingData({ ...bookingData, firstName: e.target.value })}
                          className="border-green-200 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-green-800 font-medium">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={bookingData.lastName}
                          onChange={(e) => setBookingData({ ...bookingData, lastName: e.target.value })}
                          className="border-green-200 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-green-800 font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-green-800 font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-green-800 font-medium">
                        Address
                      </Label>
                      <Textarea
                        id="address"
                        value={bookingData.address}
                        onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialRequests" className="text-green-800 font-medium">
                        Special Requests (Optional)
                      </Label>
                      <Textarea
                        id="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                        placeholder="Any special requests or preferences..."
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>

                    {/* Booking Summary */}
                    {bookingData.checkIn && bookingData.checkOut && (
                      <Card className="bg-gradient-to-r from-green-50 to-yellow-50 border-green-200 overflow-hidden">
                        <div className="p-4">
                          <h4 className="font-semibold mb-2 text-green-800">Booking Summary</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-green-700">Room:</span>
                              <span className="text-green-800 font-medium">{room.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-700">Nights:</span>
                              <span className="text-green-800 font-medium">
                                {Math.ceil(
                                  (new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) /
                                    (1000 * 60 * 60 * 24),
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-700">Rate per night:</span>
                              <span className="text-green-800 font-medium">₱{room.price}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-base border-t border-green-300 pt-1">
                              <span className="text-green-800">Total:</span>
                              <span className="text-yellow-600 font-bold">₱{calculateTotal()}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-semibold"
                      disabled={isBooking || calculateTotal() === 0 || !!guestValidationError}
                    >
                      {isBooking ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing Booking...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Book Now - ₱{calculateTotal()}
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-green-800">Login Required</h3>
                    <p className="text-green-600 mb-4">Please log in to your account to book this room.</p>
                    <Link href="/login">
                      <Button className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-green-900 font-semibold">
                        Login to Book
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}