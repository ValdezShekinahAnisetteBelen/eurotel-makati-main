import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"
import FloatingSocialIcons from "@/components/FloatingSocialIcons"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Eurotel Hotel - Luxury Accommodation & Premium Hospitality Services",
  description:
    "Experience unparalleled luxury at Eurotel Hotel. Premium rooms, world-class amenities, exceptional service, and unforgettable stays in the heart of the city.",
  keywords: [
    "luxury hotel",
    "premium accommodation",
    "five star hotel",
    "business hotel",
    "vacation resort",
    "hotel booking",
    "luxury suites",
    "executive rooms",
    "conference facilities",
    "wedding venue",
    "spa services",
    "fine dining",
    "room service",
    "concierge",
    "valet parking",
    "fitness center",
    "swimming pool",
    "business center",
    "meeting rooms",
    "event planning",
    "luxury travel",
    "hospitality",
    "guest services",
    "hotel amenities",
    "city center hotel",
    "boutique hotel",
    "premium hospitality",
    "luxury accommodation",
    "hotel reservations",
    "travel booking",
    "comfort rooms",
    "deluxe suites",
    "presidential suite",
    "family rooms",
    "accessible rooms",
    "hotel deals",
    "special offers",
    "weekend getaway",
    "business travel",
    "leisure travel",
    "Eurotel",
    "luxury experience",
    "exceptional service",
    "world class amenities",
    "unforgettable stay",
  ].join(", "),
  authors: [{ name: "Eurotel Hotel" }],
  creator: "Eurotel Hotel",
  publisher: "Eurotel Hotel",
  robots: "index, follow",
  openGraph: {
    title: "Eurotel Hotel - Where Service and Comfort Meet",
    description:
      "Experience luxury redefined at Eurotel. From elegantly appointed rooms to world-class amenities, every detail is crafted to exceed your expectations.",
    type: "website",
    locale: "en_US",
    siteName: "Eurotel Hotel",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eurotel Hotel - Luxury Accommodation",
    description: "Experience unparalleled luxury and comfort at Eurotel Hotel. Book your perfect stay today.",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#059669",
  // PWA Manifest
  manifest: "/manifest.json",
  // Additional PWA meta tags
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Eurotel Hotel",
    "application-name": "Eurotel Hotel",
    "msapplication-TileColor": "#059669",
    "msapplication-config": "/browserconfig.xml",
  },
  icons: {
    icon: [
      { url: "/icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
        <meta name="background_color" content="#ffffff" />
        <meta name="display" content="standalone" />
        <meta name="scope" content="/" />
        <meta name="start_url" content="/" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-152x152.png" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="msapplication-TileColor" content="#059669" />
        
        {/* Splash Screens */}
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1668-2224.jpg"
          media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1536-2048.jpg"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1125-2436.jpg"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
      </head>
      <body className="font-sans">
        <ClientLayout>{children}</ClientLayout>
        <FloatingSocialIcons />
      </body>
    </html>
  )
}
