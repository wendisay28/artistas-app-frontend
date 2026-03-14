import { supabase } from '../services/supabase/storage';
import { API_BASE_URL } from '../services/api/config';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  contract_id: string;
  client_id: string;
  artist_id: string;
  created_at: string;
}

export class ChatService {
  // Obtener o crear conversación para un contrato
  static async getOrCreateConversation(contractId: string, userId: string): Promise<Conversation | null> {
    try {
      // Primero buscar si ya existe una conversación
      const { data: existing, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('contract_id', contractId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existing) {
        return existing;
      }

      // Si no existe, obtener información del contrato para crear la conversación
      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .select('client_id, artist_id')
        .eq('id', contractId)
        .single();

      if (contractError) {
        throw contractError;
      }

      // Crear nueva conversación
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          contract_id: contractId,
          client_id: contract.client_id,
          artist_id: contract.artist_id,
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      return newConversation;
    } catch (error) {
      console.error('Error en getOrCreateConversation:', error);
      return null;
    }
  }

  // Obtener mensajes de una conversación
  static async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error en getMessages:', error);
      return [];
    }
  }

  // Enviar mensaje
  static async sendMessage(conversationId: string, senderId: string, content: string): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content: content.trim(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en sendMessage:', error);
      return null;
    }
  }

  // Marcar mensajes como leídos
  static async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('sender_id', userId)
        .is('read_at', null);
    } catch (error) {
      console.error('Error en markMessagesAsRead:', error);
    }
  }

  // Suscribirse a nuevos mensajes en tiempo real
  static subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
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
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();
  }

  // Enviar notificación FCM al destinatario
  static async sendNotification(
    recipientId: string,
    senderName: string,
    messagePreview: string,
    contractId?: string,
    contractTitle?: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId,
          senderName,
          messagePreview,
          contractId,
          contractTitle,
        }),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error enviando notificación:', error);
      return false;
    }
  }

  // Guardar token FCM del usuario
  static async saveFCMToken(userId: string, token: string): Promise<void> {
    try {
      await supabase
        .from('user_fcm_tokens')
        .upsert({
          user_id: userId,
          token: token,
          updated_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Error guardando token FCM:', error);
    }
  }
}
