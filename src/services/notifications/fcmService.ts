// src/services/notifications/fcmService.ts
// Registro de token FCM y manejo de notificaciones push.
// Requiere configurar google-services.json (Android) y APNs (iOS) en producción.

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { saveFcmToken } from '../supabase/chat';

// Configuración de cómo se muestran las notificaciones cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** Solicita permisos y registra el token FCM del usuario */
export async function registerForPushNotifications(userId: string): Promise<string | null> {
  if (Platform.OS === 'web') return null;

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

  // Canal de Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('chat', {
      name: 'Chat',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7c3aed',
    });
  }

  try {
    // Obtener token nativo del dispositivo (FCM en Android, APNs en iOS)
    const token = await Notifications.getDevicePushTokenAsync();
    const fcmToken = token.data as string;

    // Guardar en Supabase para que el backend pueda notificar a este usuario
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
  const notifSub = Notifications.addNotificationReceivedListener((notification) => {
    onNotification?.(notification);
  });

  // Cuando el usuario toca la notificación
  const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
    onResponse?.(response);
  });

  return () => {
    notifSub.remove();
    responseSub.remove();
  };
}
