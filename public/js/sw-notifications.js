// Listen for push events
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    // Try to parse as JSON first
    let data;
    try {
      data = event.data.json();
    } catch (e) {
      // If not JSON, try to get as text
      const textData = event.data.text();
      data = {
        title: 'Weather Notification',
        body: textData,
        icon: '/weather-icons/default.svg',
        badge: '/pwa-192x192.png',
        tag: 'weather-forecast',
      };
    }

    console.log('Push event received:', data);

    // Show notification with data received from push service
    const notificationPromise = self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag,
      requireInteraction: data.requireInteraction || false,
      data: data.data || {},
    });

    event.waitUntil(notificationPromise);
  } catch (e) {
    console.error('Error showing notification:', e);
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // This opens the app when the notification is clicked
  const urlToOpen = new URL('/', self.location.origin).href;

  const promiseChain = clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      // Check if there is already a window open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window found, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    });

  event.waitUntil(promiseChain);
});
