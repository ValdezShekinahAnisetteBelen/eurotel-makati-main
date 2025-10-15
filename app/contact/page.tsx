"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CustomLoader } from "@/components/custom-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, Clock, Send, MessageCircle, CheckCircle2, Building2, HeartHandshake } from "lucide-react"
import Image from "next/image"

export default function ContactPage() {
  const [pageLoading, setPageLoading] = useState(true)
  const [contentReady, setContentReady] = useState(false) // Added contentReady state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentReady(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleLoadingComplete = () => {
    setPageLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Mock API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    }, 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (pageLoading || !contentReady) {
    return <CustomLoader isLoading={pageLoading} onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* Enhanced Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <Image src="/lobby.webp" alt="Hotel Lobby" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-green-800/70 to-transparent" />

        {/* Floating decoration elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-green-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-5xl px-4 space-y-8">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-black text-white leading-tight">
                Let&apos;s{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                  Connect
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
                Your perfect stay begins with a conversation. Our dedicated team is ready to make your experience
                extraordinary.
              </p>
            </div>

            {/* Quick contact buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-6 py-3 rounded-full transition-all duration-300 hover:scale-105">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
              <Button className="bg-yellow-500 hover:bg-yellow-400 text-green-900 font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105">
                <Mail className="w-4 h-4 mr-2" />
                Email Us
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Contact Information */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-green-800 leading-tight">
                Ready to Create
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-400">
                  Unforgettable Memories?
                </span>
              </h2>
              <p className="text-lg text-green-600 leading-relaxed">
                Whether you&apos;re planning a business trip, romantic getaway, or family vacation, our team is here to
                ensure every detail is perfect.
              </p>
            </div>

            {/* Contact Information Card */}
            <Card className="border-2 border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-xl group overflow-hidden">
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Visit Our Hotel */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Building2 className="w-7 h-7 text-green-900" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-green-800 text-lg mb-3">Visit Our Hotel</h3>
                      <div className="text-green-600 space-y-1">
                        <p className="font-bold text-green-800">Eurotel Luxury Hotel</p>
                        <p>123 Luxury Avenue</p>
                        <p>Downtown District, City 12345</p>
                      </div>
                    </div>
                  </div>

                  {/* Call Us Anytime */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-7 h-7 text-green-900" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-green-800 text-lg mb-3">Call Us Anytime</h3>
                      <div className="text-green-600 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="font-bold text-green-800">Reservations:</span>
                          <span className="text-green-800 font-semibold">+1 (555) 123-4567</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="font-bold text-green-800">Concierge:</span>
                          <span className="text-green-800 font-semibold">+1 (555) 123-4568</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="font-bold text-green-800">Emergency:</span>
                          <span className="text-green-800 font-semibold">+1 (555) 123-4569</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email Support */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-7 h-7 text-green-900" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-green-800 text-lg mb-3">Email Support</h3>
                      <div className="text-green-600 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="font-bold text-green-800">General:</span>
                          <span className="text-green-800 font-semibold">info@eurotel.com</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="font-bold text-green-800">Bookings:</span>
                          <span className="text-green-800 font-semibold">reservations@eurotel.com</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="font-bold text-green-800">Events:</span>
                          <span className="text-green-800 font-semibold">events@eurotel.com</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-7 h-7 text-green-900" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-green-800 text-lg mb-3">Service Hours</h3>
                      <div className="text-green-600 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="font-bold text-green-800">Front Desk:</span>
                          <span className="text-green-800 font-semibold">24/7</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="font-bold text-green-800">Concierge:</span>
                          <span className="text-green-800 font-semibold">6 AM - 10 PM</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="font-bold text-green-800">Restaurant:</span>
                          <span className="text-green-800 font-semibold">6 AM - 11 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Choose Us */}
            <Card className="bg-gradient-to-r from-green-700 to-green-600 border-0 text-white overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <HeartHandshake className="w-6 h-6 mr-3" />
                  Why Guests Love Us
                </h3>
                <div className="grid gap-4">
                  {[
                    "Personalized service tailored to your needs",
                    "Award-winning hospitality since 1995",
                    "Multilingual staff available 24/7",
                    "Concierge services for local experiences",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <span className="text-green-100">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Form */}
          <div className="sticky top-8">
            <div className="border-2 border-green-200 shadow-2xl overflow-hidden rounded-lg bg-white">
              <div className="bg-gradient-to-r from-green-800 to-green-700 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative p-8">
                  <h3 className="text-3xl font-black text-white flex items-center mb-2">
                    <MessageCircle className="w-8 h-8 mr-3" />
                    Get in Touch
                  </h3>
                  <p className="text-green-100 text-lg">Send us a message and we&apos;ll respond within 30 minutes</p>
                </div>
              </div>

              <div className="p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center mx-auto mb-6 animate-bounce">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-green-800 mb-4">Message Sent!</h3>
                    <p className="text-green-600 mb-8 text-lg">
                      Thank you for reaching out. Our team will contact you within 30 minutes.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 px-8 py-3 rounded-full font-semibold"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-green-800">Full Name *</label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="border-2 border-green-200 focus:border-green-500 focus:ring-green-500 h-12 rounded-lg"
                          placeholder="John Smith"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-green-800">Email Address *</label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-2 border-green-200 focus:border-green-500 focus:ring-green-500 h-12 rounded-lg"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-green-800">Phone Number</label>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="border-2 border-green-200 focus:border-green-500 focus:ring-green-500 h-12 rounded-lg"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-green-800">Subject *</label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="border-2 border-green-200 focus:border-green-500 focus:ring-green-500 h-12 rounded-lg"
                          placeholder="How can we help you?"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-green-800">Your Message *</label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="h-48 text-lg border-2 border-green-200 focus:border-green-500 focus:ring-green-500 resize-none rounded-lg"
                        placeholder="Tell us about your inquiry, special requests, or how we can make your stay perfect..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 h-14 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    >
                      {loading ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          Sending Your Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6 mr-3" />
                          Send Message
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-green-600 text-center">
                      We respect your privacy and will never share your information with third parties.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}