"use client"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Offline Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <WifiOff className="w-24 h-24 text-slate-400" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">You are Offline</h1>
          <p className="text-slate-600 text-lg">
            It looks like you have lost your internet connection.
          </p>
        </div>

        {/* Description */}
        <div className="space-y-4 text-slate-500">
          <p>
            Dont worry! You can still browse some parts of the Eurotel Hotel website 
            that have been saved to your device.
          </p>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-2">Available offline:</h3>
            <ul className="text-sm space-y-1 text-left">
              <li>• Hotel information and amenities</li>
              <li>• Room galleries and descriptions</li>
              <li>• Contact details</li>
              <li>• Previously viewed content</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleRetry}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            size="lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          
          <Link href="/" className="block">
            <Button 
              variant="outline" 
              className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Button>
          </Link>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Connection Tips:</h3>
          <ul className="text-sm text-blue-700 space-y-1 text-left">
            <li>• Check your Wi-Fi or mobile data</li>
            <li>• Move to an area with better signal</li>
            <li>• Restart your router if using Wi-Fi</li>
            <li>• Contact your internet service provider</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-400">
          <p>Eurotel Hotel • Premium Hospitality Services</p>
        </div>
      </div>
    </div>
  )
}
