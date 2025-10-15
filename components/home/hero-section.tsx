"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      image: "/home-cover.png",
      title: "Where Service and Comfort Meet",
      subtitle:
        "Experience luxury redefined at Eurotel. From our elegantly appointed rooms to our world-class amenities, every detail is crafted to exceed your expectations.",
      highlight: "Comfort",
    },
    {
      image: "/elegant-hotel-room-with-king-bed-and-city-view.jpg",
      title: "Luxurious Accommodations",
      subtitle:
        "Discover our beautifully appointed rooms and suites, each designed with your comfort in mind and featuring premium amenities.",
      highlight: "Accommodations",
    },
    {
      image: "/table-3-casablanca-fine-dining.jpg",
      title: "Exceptional Dining Experience",
      subtitle:
        "Savor world-class cuisine at our award-winning restaurant, where culinary artistry meets impeccable service.",
      highlight: "Dining",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const renderTitle = (title: string, highlight: string) => {
    if (!title.includes(highlight)) {
      return <span className="text-white drop-shadow-2xl">{title}</span>
    }

    const beforeHighlight = title.substring(0, title.indexOf(highlight))
    const afterHighlight = title.substring(title.indexOf(highlight) + highlight.length)

    return (
      <>
        <span className="text-white drop-shadow-2xl">{beforeHighlight}</span>
        <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent font-normal italic drop-shadow-lg">
          {highlight}
        </span>
        <span className="text-white drop-shadow-2xl">{afterHighlight}</span>
      </>
    )
  }

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Slider Images */}
      <div className="relative h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 brightness-110"
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
            {/* Softer overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/20" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center max-w-5xl mx-auto px-6 lg:px-8">
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-light mb-6 text-balance leading-tight tracking-wide"
            style={{
              textShadow:
                "0 0 20px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.7)",
            }}
          >
            {renderTitle(heroSlides[currentSlide].title, heroSlides[currentSlide].highlight)}
          </h1>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-6"></div>

          <p
            className="text-lg md:text-xl mb-10 text-pretty max-w-2xl mx-auto text-white font-medium leading-relaxed"
            style={{
              textShadow:
                "0 0 12px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.7), 1px 1px 2px rgba(0,0,0,1)",
            }}
          >
            {heroSlides[currentSlide].subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/rooms">
              <button className="group px-10 py-4 rounded-sm w-full sm:w-auto flex items-center justify-center font-medium text-lg transition-all duration-500 transform hover:scale-105 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 shadow-2xl hover:shadow-3xl hover:from-yellow-300 hover:to-amber-400 border border-yellow-400/20">
                <span className="mr-3">Book Your Stay</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
            <Link href="/about">
              <button
                className="px-10 py-4 rounded-sm w-full sm:w-auto font-medium text-lg transition-all duration-500 hover:bg-white/15 border-2 border-white/70 text-white bg-black/20 backdrop-blur-sm hover:border-yellow-400/80 hover:text-yellow-300 hover:bg-black/30 transition-colors"
                style={{
                  textShadow: "0 0 10px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                Discover More
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex space-x-4">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`relative transition-all duration-500 ${
              index === currentSlide
                ? "w-12 h-1 bg-gradient-to-r from-yellow-400 to-amber-500"
                : "w-8 h-1 bg-white/40 hover:bg-yellow-400/70"
            }`}
          >
            {index === currentSlide && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg shadow-yellow-400/50"></div>
            )}
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-yellow-400/80 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
