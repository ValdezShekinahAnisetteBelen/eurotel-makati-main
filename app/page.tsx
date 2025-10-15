import HeroSection from "@/components/home/hero-section"
import AmenitiesSection from "@/components/home/amenities-section"
import OffersSection from "@/components/home/offers-section"
import TestimonialsSection from "@/components/home/testimonials-section"
import ContactSection from "@/components/home/contact-section"
import SectionDivider from "@/components/home/section-divider"
import RoomsPreviewSection from "@/components/RoomPreviewSection"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <RoomsPreviewSection />
      <SectionDivider />
      <OffersSection />
      <SectionDivider />
      <AmenitiesSection />
      <SectionDivider />
      <TestimonialsSection />
      <ContactSection />
    </div>
  )
}