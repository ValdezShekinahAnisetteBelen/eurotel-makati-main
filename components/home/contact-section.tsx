import Link from "next/link"
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react"

export default function ContactSection() {
  return (
    <section className="py-20 text-white relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-green-800">
      <div className="absolute inset-0 bg-gradient-radial from-yellow-600/20 via-transparent to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Ready to Experience Eurotel?</h2>
        <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-yellow-500 to-yellow-400" />
        <p className="text-lg mb-12 text-pretty max-w-2xl mx-auto opacity-95">
          Contact us today to book your stay or learn more about our services and amenities.
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-12">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-500/20">
              <Phone className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-lg">+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-500/20">
              <Mail className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-lg">info@eurotel.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-500/20">
              <MapPin className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-lg">123 Luxury Ave, City Center</span>
          </div>
        </div>

        <Link href="/rooms">
          <button className="px-10 py-5 rounded-lg flex items-center justify-center mx-auto font-semibold text-lg transition-all duration-300 transform hover:scale-105 bg-yellow-500 text-green-900 shadow-xl hover:bg-yellow-400">
            Book Your Stay Today
            <ArrowRight className="ml-3 w-5 h-5" />
          </button>
        </Link>
      </div>
    </section>
  )
}
