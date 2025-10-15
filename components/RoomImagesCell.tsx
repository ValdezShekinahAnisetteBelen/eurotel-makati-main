"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface RoomImagesCellProps {
  images: string[]
}

export function RoomImagesCell({ images }: RoomImagesCellProps) {
  const [open, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images?.length) return <span>No images</span>

  return (
    <div className="flex items-center">
      {/* Thumbnails */}
      <div className="flex -space-x-2">
        {images.slice(0, 3).map((img, i) => (
          <img
            key={i}
            src={`http://localhost:8000/${img}`}
            alt="room"
            className="h-10 w-10 rounded-full border-2 border-white object-cover cursor-pointer"
            onClick={() => {
              setCurrentIndex(i)
              setOpen(true)
            }}
          />
        ))}

        {images.length > 3 && (
          <div
            className="h-10 w-10 rounded-full border-2 border-white bg-blue-100 text-blue-700 text-sm flex items-center justify-center font-medium cursor-pointer"
            onClick={() => {
              setCurrentIndex(0)
              setOpen(true)
            }}
          >
            +{images.length - 3}
          </div>
        )}
      </div>

      {/* Slider Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-full">
          {/* Accessibility: Hidden DialogTitle */}
          <DialogTitle className="sr-only">Room Images</DialogTitle>

          <div className="relative flex items-center justify-center">
            {/* Prev button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-md rounded-full"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Full image */}
            <img
              src={`http://localhost:8000/${images[currentIndex]}`}
              alt="room full"
              className="max-h-[70vh] w-auto rounded-lg object-contain"
            />

            {/* Next button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-md rounded-full"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Indicator */}
          <p className="text-center text-sm text-gray-500 mt-2">
            {currentIndex + 1} / {images.length}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
