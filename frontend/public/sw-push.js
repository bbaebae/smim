// Custom service worker additions for push notifications
// This file is loaded via importScripts from the workbox-generated sw.js

self.addEventListener('push', (event) => {
  if (!event.data) return
  let data = {}
  try { data = event.data.json() } catch { data = { title: '스밈', body: event.data.text() } }

  const title = data.title || '스밈'
  const options = {
    body: data.body || '복습할 콘텐츠가 있어요.',
    icon: '/icon-192x192.png',
    badge: '/favicon.png',
    data: { url: data.url || '/review' },
    vibrate: [100, 50, 100],
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/review'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
