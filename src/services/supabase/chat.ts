// src/services/supabase/chat.ts
// Chat en tiempo real con Supabase Realtime.
// Las tablas requeridas en Supabase:
//   conversations (id, contract_id, client_id, artist_id, created_at)
//   messages      (id, conversation_id, sender_id, content, read_at, created_at)
//   user_fcm_tokens (user_id, token, updated_at)

import { supabase } from './storage';

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
};

export type Conversation = {
  id: string;
  contract_id: string;
  client_id: string;
  artist_id: string;
  created_at: string;
};

/** Obtiene o crea una conversación para un contrato dado */
export async function getOrCreateConversation(
  contractId: string,
  clientId: string,
  artistId: string
): Promise<Conversation> {
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('contract_id', contractId)
    .maybeSingle();

  if (existing) return existing as Conversation;

  const { data, error } = await supabase
    .from('conversations')
    .insert({ contract_id: contractId, client_id: clientId, artist_id: artistId })
    .select()
    .single();

  if (error) throw error;
  return data as Conversation;
}

/** Carga el historial de mensajes de una conversación */
export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as Message[];
}

/** Envía un mensaje */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, content })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

/** Marca mensajes como leídos */
export async function markMessagesRead(conversationId: string, userId: string) {
  await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .is('read_at', null);
}

/** Suscripción en tiempo real a nuevos mensajes */
export function subscribeToMessages(
  conversationId: string,
  onNewMessage: (message: Message) => void
) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => onNewMessage(payload.new as Message)
    )
    .subscribe();
}

/** Guarda o actualiza el token FCM del usuario */
export async function saveFcmToken(userId: string, token: string) {
  await supabase
    .from('user_fcm_tokens')
    .upsert({ user_id: userId, token, updated_at: new Date().toISOString() });
}

/** Obtiene el token FCM de un usuario (para enviar notificación desde backend) */
export async function getFcmToken(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('user_fcm_tokens')
    .select('token')
    .eq('user_id', userId)
    .maybeSingle();
  return data?.token ?? null;
}
