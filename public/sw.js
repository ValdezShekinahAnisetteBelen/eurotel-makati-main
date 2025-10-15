// Service Worker for Eurotel Hotel PWA
const CACHE_NAME = 'eurotel-hotel-v1'
const OFFLINE_URL = '/offline'

// URLs to cache immediately
const ESSENTIAL_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/images/eurotel-logo.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching essential resources')
        return cache.addAll(ESSENTIAL_URLS)
      })
      .then(() => {
        // Skip waiting and immediately activate
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Failed to cache essential resources:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        // Take control of all open pages
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return
  }

  const { request } = event
  const url = new URL(request.url)

  // Skip non-HTTP(S) requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  event.respondWith(
    handleRequest(request)
  )
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  try {
    // Try network first for API calls and dynamic content
    if (url.pathname.startsWith('/api/')) {
      return await networkFirst(request)
    }
    
    // Try cache first for static assets
    if (url.pathname.startsWith('/icons/') || 
        url.pathname.startsWith('/images/') ||
        url.pathname.startsWith('/_next/static/')) {
      return await cacheFirst(request)
    }
    
    // For pages, try network first, then cache
    return await networkFirst(request)
    
  } catch (error) {
    console.error('Request failed:', error)
    
    // If it's a navigation request and we're offline, show offline page
    if (request.mode === 'navigate') {
      const cache = await caches.open(CACHE_NAME)
      return await cache.match(OFFLINE_URL) || new Response('Offline')
    }
    
    return new Response('Network error', { 
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

// Network first strategy - try network, fall back to cache
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  
  try {
    const networkResponse = await fetch(request)
    
    // If successful, update cache
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Cache first strategy - try cache, fall back to network
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  // Not in cache, fetch from network
  const networkResponse = await fetch(request)
  
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone())
  }
  
  return networkResponse
}

// Handle background sync
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform background sync tasks here
      doBackgroundSync()
    )
  }
})

async function doBackgroundSync() {
  // Implement background sync logic here
  // For example, sync offline form submissions, cache updates, etc.
  console.log('Performing background sync...')
}

// Handle push notifications (if implemented later)
self.addEventListener('push', (event) => {
  console.log('Push notification received')
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from Eurotel Hotel',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-72x72.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Eurotel Hotel', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action)
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})