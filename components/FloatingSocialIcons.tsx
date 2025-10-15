"use client"
import { useState } from "react"
import { Facebook, Instagram, Mail, Phone, Share2, X } from "lucide-react"

const FloatingSocialIcons = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const socialLinks = [
    {
      name: "Facebook",
      icon: <Facebook size={20} />,
      href: "#", // Replace with your Facebook URL
      bgColor: "bg-blue-600 hover:bg-blue-700",
      label: "Visit our Facebook page",
    },
    {
      name: "Telegram",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.58 7.448c-.12.537-.432.668-.864.415l-2.39-1.764-1.154 1.11c-.128.128-.236.236-.484.236l.172-2.44 4.432-4.004c.192-.172-.044-.268-.3-.096L9.732 13.2l-2.388-.744c-.52-.16-.532-.52.108-.772l9.312-3.588c.432-.16.812.096.672.764z" />
        </svg>
      ),
      href: "#", // Replace with your Telegram URL
      bgColor: "bg-blue-500 hover:bg-blue-600",
      label: "Contact us on Telegram",
    },
    {
      name: "Instagram",
      icon: <Instagram size={20} />,
      href: "#", // Replace with your Instagram URL
      bgColor:
        "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500",
      label: "Follow us on Instagram",
    },
    {
      name: "Email",
      icon: <Mail size={20} />,
      href: "mailto:info@yourhotel.com", // Replace with your email
      bgColor: "bg-gray-600 hover:bg-gray-700",
      label: "Send us an email",
    },
    {
      name: "Call",
      icon: <Phone size={20} />,
      href: "tel:+1234567890", // Replace with your phone number
      bgColor: "bg-green-600 hover:bg-green-700",
      label: "Call us now",
    },
    {
      name: "Viber",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm4.52 7.33l-1.25 1.25c-.35.35-.82.55-1.31.55-.49 0-.96-.2-1.31-.55l-.69-.69c-.35-.35-.55-.82-.55-1.31s.2-.96.55-1.31l1.25-1.25c.35-.35.82-.55 1.31-.55s.96.2 1.31.55c.35.35.55.82.55 1.31s-.2.96-.55 1.31zm-1.25-3.12c-.49 0-.96.2-1.31.55l-1.25 1.25c-.35.35-.55.82-.55 1.31s.2.96.55 1.31l.69.69c.35.35.82.55 1.31.55s.96-.2 1.31-.55l1.25-1.25c.35-.35.55-.82.55-1.31s-.2-.96-.55-1.31c-.35-.35-.82-.55-1.31-.55z" />
        </svg>
      ),
      href: "viber://chat?number=+1234567890", // Replace with your Viber number
      bgColor: "bg-purple-600 hover:bg-purple-700",
      label: "Message us on Viber",
    },
  ]

  return (
    <>
      {/* Desktop View - Show all icons */}
      <div className="hidden md:flex fixed right-4 top-1/2 transform -translate-y-1/2 z-50 flex-col space-y-3">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target={social.name !== "Email" && social.name !== "Call" ? "_blank" : "_self"}
            rel={social.name !== "Email" && social.name !== "Call" ? "noopener noreferrer" : ""}
            className={`${social.bgColor} text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl group`}
            aria-label={social.label}
          >
            {social.icon}
            <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {social.name}
            </span>
          </a>
        ))}
      </div>

      {/* Mobile View - Single expandable icon */}
      <div className="md:hidden fixed right-4 bottom-6 z-50">
        {/* Expanded Social Icons */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 flex flex-col space-y-3 animate-in slide-in-from-bottom-2 duration-300">
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.href}
                target={social.name !== "Email" && social.name !== "Call" ? "_blank" : "_self"}
                rel={social.name !== "Email" && social.name !== "Call" ? "noopener noreferrer" : ""}
                className={`${social.bgColor} text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl`}
                style={{ animationDelay: `${index * 50}ms` }}
                aria-label={social.label}
                onClick={() => setIsExpanded(false)}
              >
                {social.icon}
              </a>
            ))}
          </div>
        )}

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`${
            isExpanded ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
          } text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl`}
          aria-label={isExpanded ? "Close social menu" : "Open social menu"}
        >
          {isExpanded ? <X size={24} /> : <Share2 size={24} />}
        </button>
      </div>
    </>
  )
}

export default FloatingSocialIcons
