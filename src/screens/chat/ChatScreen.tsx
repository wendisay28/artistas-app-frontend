import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import {
  getOrCreateConversation,
  getMessages,
  sendMessage,
  subscribeToMessages,
  markMessagesRead,
  type Message,
  type Conversation,
} from '../../services/supabase/chat';
import { apiClient } from '../../services/api/config';
import { Colors } from '../../theme/colors';
import type { RootStackParams } from '../../navigation/RootStack';

// ── Types ──────────────────────────────────────────────────────────────────────

type ChatRouteProp = RouteProp<RootStackParams, 'Chat'>;

// ── Componente de burbuja de mensaje ──────────────────────────────────────────

function MessageBubble({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) {
  const time = new Date(message.created_at).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[bubble.wrapper, isOwn ? bubble.wrapperOwn : bubble.wrapperOther]}>
      <View style={[bubble.container, isOwn ? bubble.containerOwn : bubble.containerOther]}>
        <Text style={[bubble.text, isOwn ? bubble.textOwn : bubble.textOther]}>
          {message.content}
        </Text>
        <View style={bubble.footer}>
          <Text style={[bubble.time, isOwn ? bubble.timeOwn : bubble.timeOther]}>{time}</Text>
          {isOwn && (
            <View style={{ marginLeft: 3 }}>
              <Ionicons
                name={message.read_at ? 'checkmark-done' : 'checkmark'}
                size={12}
                color={message.read_at ? '#93c5fd' : 'rgba(255,255,255,0.6)'}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

// ── Pantalla principal ─────────────────────────────────────────────────────────

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute() as ChatRouteProp;
  const { contractId, contractTitle, otherUserId, otherUserName } = route.params;

  const user = useAuthStore((s) => s.user);
  const flatListRef = useRef<FlatList>(null);

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // ── Cargar/crear conversación y mensajes ───────────────────────────────────
  useEffect(() => {
    if (!user?.firebaseUid) return;

    let channel: ReturnType<typeof subscribeToMessages> | null = null;

    async function init() {
      try {
        setLoading(true);
        // Necesitamos determinar quién es el cliente y quién es el artista
        // Para esto, necesitamos obtener los datos del contrato
        const { data: contract } = await apiClient.get(`/contracts/${contractId}`);
        
        const conv = await getOrCreateConversation(
          contractId, 
          contract.client_id, 
          contract.artist_id
        );
        setConversation(conv);

        const msgs = await getMessages(conv.id);
        setMessages(msgs);
        await markMessagesRead(conv.id, user.firebaseUid);

        // Suscripción en tiempo real
        channel = subscribeToMessages(conv.id, (newMsg) => {
          setMessages((prev) => {
            // evitar duplicados
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          if (newMsg.sender_id !== user.firebaseUid) {
            markMessagesRead(conv.id, user.firebaseUid);
          }
        });
      } catch (err) {
        console.error('Error iniciando chat:', err);
      } finally {
        setLoading(false);
      }
    }

    init();

    return () => {
      channel?.unsubscribe();
    };
  }, [contractId, user?.firebaseUid]);

  // ── Auto-scroll al último mensaje ─────────────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  // ── Enviar mensaje ─────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || !conversation || !user?.firebaseUid || sending) return;

    setInputText('');
    setSending(true);

    try {
      await sendMessage(conversation.id, user.firebaseUid, text);
      // El mensaje llegará vía la suscripción Realtime

      // Notificar al destinatario si tiene la app cerrada
      apiClient
        .post('/api/v1/chat/notify', {
          recipientId: otherUserId,
          senderName: user.displayName || 'Nuevo mensaje',
          messagePreview: text,
          contractId,
          contractTitle,
        })
        .catch(() => {}); // silencioso — no bloquear el chat si falla
    } catch (err) {
      console.error('Error enviando mensaje:', err);
      setInputText(text); // restaurar si falla
    } finally {
      setSending(false);
    }
  }, [inputText, conversation, user?.firebaseUid, otherUserId, contractId, contractTitle]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>{otherUserName}</Text>
          <Text style={styles.headerSub} numberOfLines={1}>{contractTitle}</Text>
        </View>
      </View>

      {/* Mensajes */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble message={item} isOwn={item.sender_id === user?.id} />
            )}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={48} color="#d1d5db" />
                <Text style={styles.emptyText}>Sé el primero en escribir</Text>
              </View>
            }
          />
        )}

        {/* Input */}
        <View style={[styles.inputRow, { paddingBottom: insets.bottom + 8 }]}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={500}
            returnKeyType="default"
          />
          <Pressable
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
            style={({ pressed }) => [
              styles.sendBtn,
              (!inputText.trim() || sending) && styles.sendBtnDisabled,
              pressed && { opacity: 0.75 },
            ]}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ── Estilos ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#111827',
  },
  headerSub: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
    marginTop: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  input: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#111827',
    maxHeight: 120,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#d1d5db',
  },
});

// ── Bubble styles ──────────────────────────────────────────────────────────────

const bubble = StyleSheet.create({
  wrapper: {
    marginVertical: 3,
    maxWidth: '80%',
  },
  wrapperOwn: {
    alignSelf: 'flex-end',
  },
  wrapperOther: {
    alignSelf: 'flex-start',
  },
  container: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  containerOwn: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  containerOther: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  textOwn: {
    color: '#fff',
  },
  textOther: {
    color: '#111827',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 3,
    gap: 2,
  },
  time: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  timeOwn: {
    color: 'rgba(255,255,255,0.65)',
  },
  timeOther: {
    color: '#9ca3af',
  },
});
