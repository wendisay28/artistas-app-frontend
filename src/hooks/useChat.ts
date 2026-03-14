import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatService, Message, Conversation } from '../services/chatService';
import { useAuthStore } from '../store/authStore';

interface UseChatOptions {
  contractId: string;
  recipientId?: string;
  recipientName?: string;
  contractTitle?: string;
}

export const useChat = ({ contractId, recipientId, recipientName, contractTitle }: UseChatOptions) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const subscriptionRef = useRef<any>(null);

  // Inicializar conversación
  useEffect(() => {
    const initializeConversation = async () => {
      if (!user?.firebaseUid) return;

      setLoading(true);
      try {
        const conv = await ChatService.getOrCreateConversation(contractId, user.firebaseUid);
        if (conv) {
          setConversation(conv);
          
          // Cargar mensajes existentes
          const msgs = await ChatService.getMessages(conv.id);
          setMessages(msgs);

          // Marcar mensajes como leídos
          await ChatService.markMessagesAsRead(conv.id, user.firebaseUid);
        }
      } catch (error) {
        console.error('Error inicializando conversación:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeConversation();
  }, [contractId, user?.firebaseUid]);

  // Suscribirse a mensajes en tiempo real
  useEffect(() => {
    if (!conversation?.id || !user?.firebaseUid) return;

    const subscription = ChatService.subscribeToMessages(
      conversation.id,
      (newMessage) => {
        // Si el mensaje no es del usuario actual, marcar como leído
        if (newMessage.sender_id !== user.firebaseUid) {
          ChatService.markMessagesAsRead(conversation.id, user.firebaseUid);
        }
        
        setMessages(prev => [...prev, newMessage]);
      }
    );

    subscriptionRef.current = subscription;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [conversation?.id, user?.firebaseUid]);

  // Enviar mensaje
  const sendMessage = useCallback(async (content: string) => {
    if (!conversation?.id || !user?.firebaseUid || !content.trim()) {
      return false;
    }

    setSending(true);
    try {
      const message = await ChatService.sendMessage(
        conversation.id,
        user.firebaseUid,
        content.trim()
      );

      if (message) {
        // Enviar notificación al destinatario si está offline
        if (recipientId && recipientName) {
          await ChatService.sendNotification(
            recipientId,
            recipientName,
            content.trim(),
            contractId,
            contractTitle
          );
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      return false;
    } finally {
      setSending(false);
    }
  }, [conversation?.id, user?.firebaseUid, recipientId, recipientName, contractId, contractTitle]);

  // Obtener mensajes no leídos
  const getUnreadCount = useCallback(() => {
    if (!user?.firebaseUid) return 0;
    return messages.filter(msg => msg.sender_id !== user.firebaseUid && !msg.read_at).length;
  }, [messages, user?.firebaseUid]);

  return {
    messages,
    conversation,
    loading,
    sending,
    sendMessage,
    getUnreadCount,
  };
};
