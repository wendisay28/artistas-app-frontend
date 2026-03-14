// src/services/notifications/hiringNotifications.ts
// Servicio de notificaciones push para el flujo de contratación urgente.

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ── Configurar comportamiento de notificaciones ───────────────────────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ── Solicitar permisos ────────────────────────────────────────────────────────

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// ── Helpers internos ──────────────────────────────────────────────────────────

async function schedule(
  title: string,
  body: string,
  trigger: Notifications.NotificationTriggerInput,
  data?: Record<string, any>
) {
  try {
    const granted = await requestNotificationPermissions();
    if (!granted) return;

    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: data ?? {}, sound: true },
      trigger,
    });
  } catch (e) {
    console.warn('[HiringNotifications] Error scheduling notification:', e);
  }
}

async function sendNow(title: string, body: string, data?: Record<string, any>) {
  await schedule(title, body, null, data);
}

// ── 1. Nueva oferta que coincide con el perfil ────────────────────────────────

export async function notifyNewOffer(offerTitle: string, category: string, location: string) {
  await sendNow(
    `¡Nueva oferta de ${category}! ⚡`,
    `Alguien necesita un ${category} en ${location}. Revisa los detalles y acéptala antes de que alguien más lo haga.`,
    { screen: 'urgent', tab: 'pending' }
  );
}

// ── 2. Recordatorio 30min antes del servicio presencial/híbrido ───────────────

export async function schedulePreServiceReminder(
  serviceDateISO: string,
  clientName: string,
  location: string
) {
  const serviceDate = new Date(serviceDateISO);
  const reminderDate = new Date(serviceDate.getTime() - 30 * 60 * 1000); // -30min

  if (reminderDate <= new Date()) return; // ya pasó

  await schedule(
    '⏰ ¡Es hora de salir!',
    `Tu servicio con ${clientName} en ${location} inicia pronto. No olvides escanear el primer código QR al llegar.`,
    { date: reminderDate },
    { screen: 'urgent', tab: 'in_progress' }
  );
}

// ── 3. Recordatorio de cierre — cuando se acerca el fin del servicio ──────────

export async function scheduleEndOfServiceReminder(
  serviceDateISO: string,
  durationHours: number,
  clientName: string
) {
  const serviceDate = new Date(serviceDateISO);
  const endDate = new Date(serviceDate.getTime() + durationHours * 60 * 60 * 1000);

  if (endDate <= new Date()) return;

  await schedule(
    '¿Terminaste tu labor? ✅',
    `Asegúrate de pedirle a ${clientName} el segundo código QR para finalizar el servicio y procesar tu pago.`,
    { date: endDate },
    { screen: 'urgent', tab: 'in_progress' }
  );
}

// ── 4. Recordatorio de entrega digital — 24h después de visita ───────────────

export async function scheduleDeliveryReminder(
  visitEndISO: string,
  clientName: string
) {
  const reminderDate = new Date(new Date(visitEndISO).getTime() + 24 * 60 * 60 * 1000);

  if (reminderDate <= new Date()) return;

  await schedule(
    '🎨 ¡Va quedando genial!',
    `Recuerda subir tu entregable digital para que ${clientName} pueda revisarlo y liberar el saldo restante.`,
    { date: reminderDate },
    { screen: 'urgent', tab: 'in_progress' }
  );
}

// ── 5. Solicitud de cambio del cliente ───────────────────────────────────────

export async function notifyChangeRequest(clientName: string) {
  await sendNow(
    '🔧 Solicitud de ajuste',
    `${clientName} solicitó un ajuste en tu entrega. Recuerda que es la última corrección permitida. ¡Haz que brille!`,
    { screen: 'urgent', tab: 'in_progress' }
  );
}

// ── 6. Pago liberado ─────────────────────────────────────────────────────────

export async function notifyPaymentReleased(clientName: string, amount: string) {
  await sendNow(
    '¡Trabajo completado con éxito! 💰',
    `Tu pago de ${amount} por el servicio con ${clientName} ha sido enviado a tu cuenta. No olvides calificar tu experiencia.`,
    { screen: 'urgent', tab: 'completed' }
  );
}

// ── 7. Alerta suave — llegó al lugar pero no ha escaneado (GPS nudge) ─────────

export async function scheduleArrivalNudge(
  scheduledArrivalISO: string,
  delayMinutes = 5
) {
  const nudgeDate = new Date(
    new Date(scheduledArrivalISO).getTime() + delayMinutes * 60 * 1000
  );

  if (nudgeDate <= new Date()) return;

  await schedule(
    '¿Ya estás en el sitio?',
    'No olvides marcar tu llegada para que el sistema empiece a contar tu tiempo.',
    { date: nudgeDate },
    { screen: 'urgent', tab: 'in_progress' }
  );
}

// ── Cancelar todas las notificaciones de hiring ───────────────────────────────

export async function cancelAllHiringNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
