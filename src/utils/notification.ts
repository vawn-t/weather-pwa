/**
 * Request notification permission from the user
 * @returns Promise that resolves to the permission status
 */
export const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    // Check if permission is already granted
    if (Notification.permission === 'granted') {
      return 'granted';
    }

    // Request permission
    return (await Notification.permission) === 'default'
      ? await Notification.requestPermission()
      : Notification.permission;
  };

/**
 * Display a push notification with the weather forecast
 * @param title The notification title
 * @param options The notification options
 * @returns Promise that resolves when the notification is shown
 */
export const showWeatherNotification = async (
  title: string,
  options: NotificationOptions
): Promise<boolean> => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }

  try {
    // Get the service worker registration
    const registration = await navigator.serviceWorker.ready;

    if (!registration) {
      throw new Error('Service worker registration not found');
    }

    await registration.showNotification(title, options);

    return true;
  } catch (error) {
    console.error('Error showing notification:', error);
    return false;
  }
};

export const subscribe = async () => {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    // Replace with your own VAPID public key
    applicationServerKey:
      'BPcuGtGZoN_oo2y4Z76uFUgglGPbfiYFfp1-H6SQ4Xzv4UeVazHfF4cPf4JFyleJMv2PSJ9cQOHec2wALyZbYI4',
  });

  // Send the subscription to your server
  const response = await fetch('http://localhost:3000/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw new Error('Failed to send subscription to server');
  }
};

export const unsubscribe = async () => {
  try {
    const swRegistration = await navigator.serviceWorker.ready;
    const subscription = await swRegistration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
    }
  } catch (err) {
    console.error('Unsubscription error:', err);
  }
};
