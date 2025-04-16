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

  console.log('Notification shown:', title, options);
  try {
    // Get the service worker registration
    const registration = await navigator.serviceWorker.ready;

    if (!registration) {
      throw new Error('Service worker registration not found');
    }

    // Use the registration to show the notification
    await registration.showNotification(title, options);

    return true;
  } catch (error) {
    console.error('Error showing notification:', error);
    return false;
  }
};
