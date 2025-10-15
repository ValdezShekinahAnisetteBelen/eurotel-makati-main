import { Wifi, Car, Coffee, Utensils, Dumbbell, Waves } from "lucide-react"

export default function AmenitiesSection() {
  const amenities = [
    { icon: Wifi, name: "Free WiFi", description: "High-speed internet throughout the hotel" },
    { icon: Car, name: "Free Parking", description: "Complimentary valet parking service" },
    { icon: Coffee, name: "24/7 Room Service", description: "Round-the-clock dining at your convenience" },
    { icon: Utensils, name: "Fine Dining", description: "Award-winning restaurant with international cuisine" },
    { icon: Dumbbell, name: "Fitness Center", description: "State-of-the-art gym equipment" },
    { icon: Waves, name: "Swimming Pool", description: "Outdoor pool with city views" },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-green-800">Premium Amenities</h2>
          <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-yellow-500 to-yellow-400" />
          <p className="text-lg max-w-2xl mx-auto text-pretty text-green-700">
            Discover the exceptional facilities and services that make Eurotel your perfect home away from home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl transition-all duration-300 hover:scale-105 group bg-gradient-to-br from-white to-green-50 shadow-lg border border-yellow-200"
            >
              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300">
                  <amenity.icon className="w-10 h-10 text-green-800" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-green-800">{amenity.name}</h3>
                <p className="text-green-700">{amenity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
