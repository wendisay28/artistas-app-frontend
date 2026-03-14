import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, Modal, StyleSheet, ScrollView, Pressable,
  TextInput, KeyboardAvoidingView, Platform, TouchableOpacity,
  ActivityIndicator, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { FeedPost as FeedPostType } from '../data/feedData';
import { FeedPost } from './FeedPost';
import { commentsService, type Comment } from '../../../services/api/posts';
import { useAuthStore } from '../../../store/authStore';

// ── Helpers ───────────────────────────────────────────────────────────────────

const CAT_COLORS: Record<string, [string, string]> = {
  'artes-visuales':  ['#db2777', '#7c3aed'],
  'artes-escenicas': ['#7c3aed', '#2563eb'],
  'musica':          ['#0891b2', '#7c3aed'],
  'audiovisual':     ['#1e40af', '#0891b2'],
  'diseno':          ['#7c3aed', '#db2777'],
  'comunicacion':    ['#059669', '#0891b2'],
  'cultura-turismo': ['#f59e0b', '#ef4444'],
};

const MOCK_COMMENTS: Comment[] = [
  { id: 'c1', author: { id: 'u1', name: 'María G.', username: 'mariag', avatar: null, initials: 'MG' }, content: 'Qué brutal. Me encanta el color y la composición.', createdAt: '1h', likes: 5 },
  { id: 'c2', author: { id: 'u2', name: 'Sebas R.', username: 'sebasr', avatar: null, initials: 'SR' }, content: '¿Dónde fue tomada esa foto? El estilo es increíble.', createdAt: '45m', likes: 2 },
  { id: 'c3', author: { id: 'u3', name: 'Ana L.', username: 'anla', avatar: null, initials: 'AL' }, content: '@sebasr Yo también quiero saber, ese estilo es único!', createdAt: '30m', replyTo: 'sebasr', likes: 1 },
  { id: 'c4', author: { id: 'u4', name: 'Carlos M.', username: 'carm', avatar: null, initials: 'CM' }, content: 'Increíble trabajo, definitivamente inspirador.', createdAt: '15m', likes: 8 },
];

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  visible: boolean;
  post: FeedPostType | null;
  isDark: boolean;
  focusComments?: boolean;
  onClose: () => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function PostDetailModal({ visible, post, isDark, focusComments = false, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading]   = useState(false);
  const [sending, setSending]   = useState(false);
  const [draft, setDraft]       = useState('');
  const [activeTab, setActiveTab] = useState<'recientes' | 'populares'>('recientes');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [replyText, setReplyText]   = useState('');
  const [likedIds, setLikedIds]     = useState<Set<string>>(new Set());

  // ── Cargar comentarios ────────────────────────────────────────────────────

  const loadComments = useCallback(async () => {
    if (!post) return;
    setLoading(true);
    try {
      const data = await commentsService.getByPost(post.id);
      setComments(data.length > 0 ? data : MOCK_COMMENTS);
    } catch {
      setComments(MOCK_COMMENTS);
    } finally {
      setLoading(false);
    }
  }, [post?.id]);

  useEffect(() => {
    if (visible && post) loadComments();
    if (!visible) { setDraft(''); setReplyingTo(null); setReplyText(''); }
  }, [visible, post?.id]);

  // ── Ordenar tabs ──────────────────────────────────────────────────────────

  const displayedComments = activeTab === 'populares'
    ? [...comments].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
    : comments;

  // ── Enviar comentario principal ───────────────────────────────────────────

  const handleSend = async () => {
    if (!draft.trim() || !post) return;
    setSending(true);
    try {
      const newComment = await commentsService.create(post.id, draft.trim());
      setComments(prev => [newComment, ...prev]);
    } catch {
      // Optimistic local update si el backend no responde
      const optimistic: Comment = {
        id: `local-${Date.now()}`,
        author: {
          id: user?.id ?? 'me',
          name: user?.displayName ?? 'Tú',
          username: user?.username ?? 'tu_usuario',
          avatar: user?.photoURL ?? null,
          initials: (user?.displayName ?? 'T').charAt(0).toUpperCase(),
        },
        content: draft.trim(),
        createdAt: 'ahora',
        likes: 0,
      };
      setComments(prev => [optimistic, ...prev]);
    } finally {
      setDraft('');
      setSending(false);
    }
  };

  // ── Responder a comentario ────────────────────────────────────────────────

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    setReplyText(`@${comment.author.username} `);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !post || !replyingTo) return;
    setSending(true);
    try {
      const newComment = await commentsService.create(post.id, replyText.trim(), replyingTo.id);
      setComments(prev => [...prev, newComment]);
    } catch {
      const optimistic: Comment = {
        id: `local-${Date.now()}`,
        author: {
          id: user?.id ?? 'me',
          name: user?.displayName ?? 'Tú',
          username: user?.username ?? 'tu_usuario',
          avatar: user?.photoURL ?? null,
          initials: (user?.displayName ?? 'T').charAt(0).toUpperCase(),
        },
        content: replyText.trim(),
        createdAt: 'ahora',
        replyTo: replyingTo.author.username,
        likes: 0,
      };
      setComments(prev => [...prev, optimistic]);
    } finally {
      handleCancelReply();
      setSending(false);
    }
  };

  // ── Like comentario ───────────────────────────────────────────────────────

  const handleLikeComment = async (comment: Comment) => {
    const alreadyLiked = likedIds.has(comment.id);
    setLikedIds(prev => {
      const next = new Set(prev);
      alreadyLiked ? next.delete(comment.id) : next.add(comment.id);
      return next;
    });
    setComments(prev => prev.map(c =>
      c.id === comment.id
        ? { ...c, likes: (c.likes ?? 0) + (alreadyLiked ? -1 : 1) }
        : c
    ));
    try {
      await commentsService.toggleLike(comment.id);
    } catch {
      // revert on error
      setLikedIds(prev => {
        const next = new Set(prev);
        alreadyLiked ? next.add(comment.id) : next.delete(comment.id);
        return next;
      });
    }
  };

  const catColors = post ? (CAT_COLORS[post.author.category] ?? ['#7c3aed', '#4f46e5']) : ['#7c3aed', '#4f46e5'];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      {/* ← Status bar visible dentro del modal */}
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={[st.root, isDark && st.rootDark]}>

        {/* Header */}
        <View style={[st.header, isDark && st.headerDark, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={onClose} style={st.iconBtn}>
            <Ionicons name="chevron-down" size={26} color={isDark ? '#fff' : '#111'} />
          </Pressable>
          <Text style={[st.headerTitle, isDark && st.headerTitleDark]}>Hilo</Text>
          <View style={st.headerSpacer} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            style={st.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
            keyboardShouldPersistTaps="handled"
          >
            {post && (
              <View>
                {/* Post principal */}
                <FeedPost post={post} isDark={isDark} isLast={false} />

                {/* Separador + tabs */}
                <View style={[st.divider, isDark && st.dividerDark]} />

                <View style={st.tabBar}>
                  {(['recientes', 'populares'] as const).map(tab => (
                    <TouchableOpacity
                      key={tab}
                      activeOpacity={0.7}
                      style={[st.tabItem, activeTab === tab && (isDark ? st.tabItemActiveDark : st.tabItemActive)]}
                      onPress={() => setActiveTab(tab)}
                    >
                      <Text style={[
                        st.tabText,
                        isDark && st.tabTextDark,
                        activeTab === tab && (isDark ? st.tabTextActiveDark : st.tabTextActive),
                      ]}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={[st.divider, isDark && st.dividerDark]} />

                {/* Comentarios */}
                {loading ? (
                  <View style={st.loadingWrap}>
                    <ActivityIndicator color="#7c3aed" />
                  </View>
                ) : (
                  <View style={st.commentsSection}>
                    {displayedComments.length === 0 && (
                      <Text style={[st.emptyText, isDark && st.emptyTextDark]}>
                        Sé el primero en comentar ✨
                      </Text>
                    )}
                    {displayedComments.map((c, idx) => {
                      const isLast  = idx === displayedComments.length - 1;
                      const liked   = likedIds.has(c.id);
                      return (
                        <View
                          key={c.id}
                          style={[st.threadRow, isDark && st.threadRowDark, isLast && { borderBottomWidth: 0 }]}
                        >
                          {/* Avatar + línea */}
                          <View style={st.threadLeft}>
                            {c.author.avatar ? (
                              <Image source={{ uri: c.author.avatar }} style={st.avatarMini} />
                            ) : (
                              <LinearGradient colors={catColors} style={st.avatarMini}>
                                <Text style={st.initials}>{c.author.initials}</Text>
                              </LinearGradient>
                            )}
                            {!isLast && <View style={[st.connectorLine, isDark && st.connectorLineDark]} />}
                          </View>

                          {/* Contenido */}
                          <View style={st.threadRight}>
                            <View style={st.commentHeader}>
                              <Text style={[st.commentName, isDark && st.commentNameDark]} numberOfLines={1}>
                                {c.author.name}
                              </Text>
                              <Text style={[st.commentMeta, isDark && st.commentMetaDark]}>
                                @{c.author.username} · {c.createdAt}
                              </Text>
                            </View>

                            {c.replyTo && (
                              <Text style={[st.replyIndicator, isDark && st.replyIndicatorDark]}>
                                ↩ respondiendo a @{c.replyTo}
                              </Text>
                            )}

                            <Text style={[st.commentBody, isDark && st.commentBodyDark]}>
                              {c.content}
                            </Text>

                            <View style={st.commentActions}>
                              <Pressable style={st.actionBtn} onPress={() => handleLikeComment(c)}>
                                <Ionicons
                                  name={liked ? 'heart' : 'heart-outline'}
                                  size={15}
                                  color={liked ? '#ef4444' : (isDark ? '#555' : '#999')}
                                />
                                {(c.likes ?? 0) > 0 && (
                                  <Text style={[st.actionCount, isDark && st.actionCountDark, liked && { color: '#ef4444' }]}>
                                    {c.likes}
                                  </Text>
                                )}
                              </Pressable>

                              <Pressable style={st.actionBtn} onPress={() => handleReply(c)}>
                                <Ionicons name="chatbubble-outline" size={14} color={isDark ? '#555' : '#999'} />
                                <Text style={[st.actionCount, isDark && st.actionCountDark]}>Responder</Text>
                              </Pressable>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* Composer */}
          <View style={[st.composerWrapper, isDark && st.composerWrapperDark, { paddingBottom: insets.bottom + 8 }]}>
            <View style={[st.inputContainer, isDark && st.inputContainerDark]}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Publica tu respuesta..."
                placeholderTextColor={isDark ? '#555' : '#aaa'}
                style={[st.input, isDark && st.inputDark]}
                multiline
                autoFocus={focusComments}
                editable={!sending}
              />
              <Pressable
                onPress={handleSend}
                disabled={!draft.trim() || sending}
                style={[st.sendBtn, (!draft.trim() || sending) && { backgroundColor: isDark ? '#333' : '#e2e2e2' }]}
              >
                {sending
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Text style={[st.sendBtnText, (!draft.trim()) && { color: isDark ? '#555' : '#999' }]}>Responder</Text>
                }
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* ── Sub-modal: responder a un comentario específico ── */}
      <Modal
        visible={!!replyingTo}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCancelReply}
      >
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={[st.root, isDark && st.rootDark]}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {replyingTo && (
              <>
                <View style={[st.replyHeader, isDark && st.replyHeaderDark, { paddingTop: insets.top + 4 }]}>
                  <Pressable onPress={handleCancelReply} style={st.replyCancelBtn}>
                    <Text style={[st.replyCancelText, isDark && st.replyCancelTextDark]}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSendReply}
                    disabled={!replyText.trim() || sending}
                    style={[st.replySendBtn, (!replyText.trim() || sending) && { backgroundColor: isDark ? '#333' : '#e2e2e2' }]}
                  >
                    {sending
                      ? <ActivityIndicator size="small" color="#fff" />
                      : <Text style={[st.replySendBtnText, !replyText.trim() && { color: isDark ? '#555' : '#999' }]}>Responder</Text>
                    }
                  </Pressable>
                </View>

                <ScrollView
                  style={{ flex: 1 }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {/* Contexto: comentario original */}
                  <View style={st.replyContext}>
                    <View style={st.threadLeft}>
                      <LinearGradient colors={catColors} style={st.avatarMini}>
                        <Text style={st.initials}>{replyingTo.author.initials}</Text>
                      </LinearGradient>
                      <View style={[st.connectorLine, isDark && st.connectorLineDark, { minHeight: 40 }]} />
                    </View>
                    <View style={st.threadRight}>
                      <Text style={[st.commentName, isDark && st.commentNameDark]}>{replyingTo.author.name}</Text>
                      <Text style={[st.commentMeta, isDark && st.commentMetaDark]}>@{replyingTo.author.username}</Text>
                      <Text style={[st.commentBody, isDark && st.commentBodyDark]} numberOfLines={3}>
                        {replyingTo.content}
                      </Text>
                    </View>
                  </View>

                  {/* Input del usuario */}
                  <View style={st.replyContext}>
                    <View style={st.threadLeft}>
                      <LinearGradient colors={['#7c3aed', '#4f46e5']} style={st.avatarMini}>
                        <Text style={st.initials}>{(user?.displayName ?? 'T').charAt(0)}</Text>
                      </LinearGradient>
                    </View>
                    <View style={[st.threadRight, { paddingTop: 6 }]}>
                      <TextInput
                        value={replyText}
                        onChangeText={setReplyText}
                        placeholder="Escribe tu respuesta..."
                        placeholderTextColor={isDark ? '#555' : '#999'}
                        style={[st.replyInput, isDark && st.replyInputDark]}
                        multiline
                        autoFocus
                        editable={!sending}
                      />
                    </View>
                  </View>
                </ScrollView>
              </>
            )}
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const st = StyleSheet.create({
  root:     { flex: 1, backgroundColor: '#fff' },
  rootDark: { backgroundColor: '#000' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  headerDark: { borderBottomColor: 'rgba(255,255,255,0.08)' },
  headerTitle:     { flex: 1, textAlign: 'center', fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#111' },
  headerTitleDark: { color: '#fff' },
  headerSpacer:    { width: 40 },
  iconBtn:         { width: 40, height: 40, justifyContent: 'center' },

  scroll: { flex: 1 },

  divider:     { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(0,0,0,0.08)', marginVertical: 10 },
  dividerDark: { backgroundColor: 'rgba(255,255,255,0.08)' },

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  tabItem:          { paddingVertical: 6, paddingHorizontal: 16, marginHorizontal: 4, borderRadius: 16 },
  tabItemActive:    { backgroundColor: '#f3f4f6' },
  tabItemActiveDark:{ backgroundColor: '#1a1a1a' },
  tabText:          { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#666' },
  tabTextDark:      { color: '#888' },
  tabTextActive:    { color: '#111' },
  tabTextActiveDark:{ color: '#fff' },

  loadingWrap:    { paddingVertical: 32, alignItems: 'center' },
  emptyText:      { textAlign: 'center', color: '#999', fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, paddingVertical: 24 },
  emptyTextDark:  { color: '#555' },

  commentsSection: { paddingHorizontal: 16, paddingTop: 4 },
  threadRow: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  threadRowDark: { borderBottomColor: 'rgba(255,255,255,0.06)' },

  threadLeft:    { width: 44, alignItems: 'center', marginRight: 12 },
  avatarMini: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  initials: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },

  connectorLine:     { flex: 1, width: 2, backgroundColor: 'rgba(124,58,237,0.15)', marginTop: 4 },
  connectorLineDark: { backgroundColor: 'rgba(167,139,250,0.15)' },

  threadRight: { flex: 1, paddingTop: 2 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' },
  commentName:     { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  commentNameDark: { color: '#fff' },
  commentMeta:     { fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(0,0,0,0.4)', flex: 1 },
  commentMetaDark: { color: 'rgba(255,255,255,0.4)' },
  replyIndicator:     { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: '#7c3aed', marginBottom: 3, fontStyle: 'italic' },
  replyIndicatorDark: { color: '#a78bfa' },
  commentBody:     { fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#111', lineHeight: 21, marginTop: 2 },
  commentBodyDark: { color: 'rgba(255,255,255,0.85)' },

  commentActions: { flexDirection: 'row', gap: 20, marginTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionCount:     { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(0,0,0,0.4)' },
  actionCountDark: { color: 'rgba(255,255,255,0.4)' },

  composerWrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
    padding: 12,
    backgroundColor: '#fff',
  },
  composerWrapperDark: { backgroundColor: '#000', borderTopColor: '#222' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  inputContainerDark: { backgroundColor: '#111' },
  input:     { flex: 1, fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: '#111', maxHeight: 80, paddingVertical: 4 },
  inputDark: { color: '#fff' },
  sendBtn:     { backgroundColor: '#7c3aed', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, minWidth: 90, alignItems: 'center' },
  sendBtnText: { color: '#fff', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13 },

  // Sub-modal respuesta
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  replyHeaderDark: { borderBottomColor: 'rgba(255,255,255,0.08)' },
  replyCancelBtn:  { paddingVertical: 8, paddingRight: 8 },
  replyCancelText:     { fontSize: 16, fontFamily: 'PlusJakartaSans_500Medium', color: '#111' },
  replyCancelTextDark: { color: '#fff' },
  replySendBtn:     { backgroundColor: '#7c3aed', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, minWidth: 90, alignItems: 'center' },
  replySendBtnText: { color: '#fff', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14 },

  replyContext: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16 },
  replyInput:     { flex: 1, fontSize: 16, fontFamily: 'PlusJakartaSans_400Regular', color: '#111', minHeight: 100, textAlignVertical: 'top' },
  replyInputDark: { color: '#fff' },
});
