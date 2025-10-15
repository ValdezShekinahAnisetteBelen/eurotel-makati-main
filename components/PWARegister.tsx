"use client"

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          console.log('Registering service worker...')
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          })

          // Check for service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is available
                  console.log('New service worker available')
                  
                  // You can show a notification to the user here
                  if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Eurotel Hotel', {
                      body: 'App updated! Refresh to get the latest version.',
                      icon: '/icons/icon-192x192.png',
                      tag: 'app-update'
                    })
                  }
                }
              })
            }
          })

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            console.log('Message from service worker:', event.data)
          })

          console.log('Service worker registered successfully:', registration)

          // Request notification permission
          if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission()
          }

        } catch (error) {
          console.error('Service worker registration failed:', error)
        }
      }

      registerSW()

      // Listen for online/offline events
      const handleOnline = () => {
        console.log('App is online')
        // You can sync offline data here
      }

      const handleOffline = () => {
        console.log('App is offline')
      }

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])

  return null // This component doesn't render anything
}