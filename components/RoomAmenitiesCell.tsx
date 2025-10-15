"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface RoomAmenitiesCellProps {
  amenities: string[]
}

export function RoomAmenitiesCell({ amenities }: RoomAmenitiesCellProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!amenities || amenities.length === 0) return <span className="text-gray-400">No amenities</span>

  // Show only first 3 amenities in the table
  const previewAmenities = amenities.slice(0, 3)
  const extraCount = amenities.length - previewAmenities.length

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="flex flex-wrap gap-1 cursor-pointer">
            {previewAmenities.map((a, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                {a}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded">
                +{extraCount}
              </span>
            )}
          </div>
        </DialogTrigger>

        {/* Modal */}
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Amenities</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-2">
            {amenities.map((a, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded">
                {a}
              </span>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
