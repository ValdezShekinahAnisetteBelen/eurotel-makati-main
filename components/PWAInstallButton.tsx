"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Check } from "lucide-react"
import { usePWAInstall } from "@/hooks/use-pwa-install"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface PWAInstallButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  className?: string
}

export default function PWAInstallButton({ 
  variant = "outline", 
  size = "sm", 
  className = ""
}: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isInstalling, installApp } = usePWAInstall()

  if (isInstalled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={size}
              className={`text-green-600 hover:text-green-700 ${className}`}
              disabled
            >
              <Check className="w-4 h-4 mr-2" />
              App Installed
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>App is already installed</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (!isInstallable) {
    return null
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={installApp}
            disabled={isInstalling}
            className={`flex items-center ${className}`}
          >
            {isInstalling ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Installing...
              </>
            ) : (
              "Install App"
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Install Eurotel Hotel app for quick access</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
