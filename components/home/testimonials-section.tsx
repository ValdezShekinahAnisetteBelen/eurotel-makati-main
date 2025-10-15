import { Star, MapPin } from "lucide-react"

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Exceptional service and beautiful rooms. The staff went above and beyond to make our stay memorable.",
      location: "New York, USA",
    },
    {
      name: "Michael Chen",
      rating: 5,
      comment:
        "Perfect location and amazing amenities. The pool area is stunning and the restaurant food is outstanding.",
      location: "Toronto, Canada",
    },
    {
      name: "Emma Rodriguez",
      rating: 5,
      comment:
        "Clean, comfortable, and luxurious. Eurotel truly lives up to its promise of where service and comfort meet.",
      location: "Madrid, Spain",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-green-800">What Our Guests Say</h2>
          <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-yellow-500 to-yellow-400" />
          <p className="text-lg max-w-2xl mx-auto text-pretty text-green-700">
            Dont just take our word for it. Heres what our valued guests have to say about their Eurotel experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl h-full transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-green-50 shadow-lg border border-yellow-200"
            >
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-current text-yellow-500" />
                ))}
              </div>
              <h4 className="text-xl font-bold mb-3 text-green-800">{testimonial.name}</h4>
              <div className="flex items-center mb-4 text-green-700">
                <MapPin className="w-4 h-4 mr-2" />
                {testimonial.location}
              </div>
              <p className="text-sm italic leading-relaxed text-green-700">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
