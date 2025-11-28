self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || '/icon.png',
      badge: '/icon.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.')
  event.notification.close()

  const targetUrl = 'https://f4e.io/account/notifications'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        const url = new URL(client.url)

        if (url.origin === self.location.origin) {
          if (url.pathname !== '/account/notifications') {
            client.navigate(targetUrl)
          }
          return client.focus()
        }
      }

      return clients.openWindow(targetUrl)
    })
  )
})