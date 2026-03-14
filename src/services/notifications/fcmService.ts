// src/services/notifications/fcmService.ts
// Registro de token FCM y manejo de notificaciones push.
// Las notificaciones remotas requieren un development build (no funcionan en Expo Go desde SDK 53).

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { saveFcmToken } from '../supabase/chat';

// Expo Go no soporta push notifications remotas desde SDK 53
const isExpoGo = Constants.appOwnership === 'expo';

// Solo configurar el handler si NO estamos en Expo Go
if (!isExpoGo) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/** Solicita permisos y registra el token FCM del usuario */
export async function registerForPushNotifications(userId: string): Promise<string | null> {
  if (Platform.OS === 'web' || isExpoGo) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Permisos de notificación denegados');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('chat', {
      name: 'Chat',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7c3aed',
    });
  }

  try {
    const token = await Notifications.getDevicePushTokenAsync();
    const fcmToken = token.data as string;
    await saveFcmToken(userId, fcmToken);
    return fcmToken;
  } catch (error) {
    console.warn('No se pudo obtener token FCM:', error);
    return null;
  }
}

/** Configura listeners para cuando llega una notificación */
export function setupNotificationListeners(
  onNotification?: (notification: Notifications.Notification) => void,
  onResponse?: (response: Notifications.NotificationResponse) => void
) {
  if (isExpoGo) return () => {};

  const notifSub = Notifications.addNotificationReceivedListener((notification) => {
    onNotification?.(notification);
  });

  const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
    onResponse?.(response);
  });

  return () => {
    notifSub.remove();
    responseSub.remove();
  };
}
