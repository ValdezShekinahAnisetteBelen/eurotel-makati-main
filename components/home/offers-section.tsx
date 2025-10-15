import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function OffersSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 to-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-green-800">Exclusive Offers</h2>
          <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-yellow-500 to-yellow-400" />
          <p className="text-lg max-w-2xl mx-auto text-pretty text-green-700">
            Take advantage of our exclusive deals and packages designed to make your stay even more memorable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-green-50 shadow-xl border border-yellow-200">
            <div
              className="h-56 bg-cover bg-center relative"
              style={{
                backgroundImage: "url('/deluxe-double-room.jpg')",
              }}
            >
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold bg-yellow-500 text-green-900">
                Save 25%
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-green-800">Romantic Getaway Package</h3>
              <p className="mb-6 text-green-700">
                Perfect for couples seeking a romantic escape. Includes champagne, roses, and a couples spa treatment.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm text-green-700">
                  <CheckCircle className="w-5 h-5 mr-3 text-yellow-500" />
                  Luxury suite upgrade
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <CheckCircle className="w-5 h-5 mr-3 text-yellow-500" />
                  Complimentary breakfast
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <CheckCircle className="w-5 h-5 mr-3 text-yellow-500" />
                  Couples spa treatment
                </li>
              </ul>
              <Link href="/rooms">
                <button className="w-full py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 bg-yellow-500 text-green-900 shadow-lg hover:bg-yellow-400">
                  Book Now
                </button>
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-green-50 shadow-xl border border-yellow-200">
            <div
              className="h-56 bg-cover bg-center relative"
              style={{
                backgroundImage: "url('/superior-single-room.jpg')",
              }}
            >
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold bg-yellow-500 text-green-900">
                Save 20%
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-green-800">Business Traveler Special</h3>
              <p className="mb-6 text-green-700">
                Designed for the modern business traveler with all the essentials for productivity and comfort.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm text-green-700">
                  <CheckCircle className="w-5 h-5 mr-3 text-yellow-500" />
                  High-speed WiFi
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <CheckCircle className="w-5 h-5 mr-3 text-yellow-500" />
                  Meeting room access
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <CheckCircle className="w-5 h-5 mr-3 text-yellow-500" />
                  Express check-in/out
                </li>
              </ul>
              <Link href="/rooms">
                <button className="w-full py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 bg-yellow-500 text-green-900 shadow-lg hover:bg-yellow-400">
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
