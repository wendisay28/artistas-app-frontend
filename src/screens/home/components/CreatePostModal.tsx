// src/screens/home/components/CreatePostModal.tsx
// Modal crear post — combina el estilo de X (header limpio, acciones bottom)
// con Threads (input abierto, sin bordes, hilo visual)

import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, Pressable, Image, ScrollView, KeyboardAvoidingView,
  Platform, Dimensions, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../../store/themeStore';
import { useAuthStore } from '../../../store/authStore';
import { useProfileStore } from '../../../store/profileStore';

const { width, height } = Dimensions.get('window');

// Categorías disponibles para el post
const POST_CATEGORIES = [
  { id: 'artes-visuales',  label: 'Visuales',    icon: 'color-palette',  colors: ['#db2777', '#7c3aed'] as [string,string] },
  { id: 'artes-escenicas', label: 'Escénicas',   icon: 'body',           colors: ['#7c3aed', '#2563eb'] as [string,string] },
  { id: 'musica',          label: 'Música',      icon: 'musical-notes',  colors: ['#0891b2', '#7c3aed'] as [string,string] },
  { id: 'audiovisual',     label: 'Audiovisual', icon: 'film',           colors: ['#1e40af', '#0891b2'] as [string,string] },
  { id: 'diseno',          label: 'Diseño',      icon: 'brush',          colors: ['#7c3aed', '#db2777'] as [string,string] },
  { id: 'comunicacion',    label: 'Comunicación',icon: 'megaphone',      colors: ['#059669', '#0891b2'] as [string,string] },
  { id: 'cultura-turismo', label: 'Cultura',     icon: 'earth',          colors: ['#f59e0b', '#ef4444'] as [string,string] },
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<Props> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const { artistData } = useProfileStore();

  const [text, setText]             = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [audience, setAudience]     = useState<'todos' | 'seguidores'>('todos');
  const inputRef = useRef<TextInput>(null);

  const displayName = artistData?.name || user?.displayName || 'Tú';
  const initials    = displayName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
  const avatar      = artistData?.profileImage || user?.photoURL || null;
  const catData     = POST_CATEGORIES.find(c => c.id === selectedCat);

  const canPost = text.trim().length > 0;

  const handlePost = () => {
    if (!canPost) return;
    console.log('Post:', { text, category: selectedCat, audience });
    setText('');
    setSelectedCat(null);
    onClose();
  };

  const bg  = isDark ? '#0a0a0a' : '#fff';
  const fg  = isDark ? '#fff'    : '#111';
  const sub = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.38)';
  const border = isDark ? '#222' : '#f0f0f0';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[st.root, { backgroundColor: bg }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── Header ──────────────────────────────────────────────── */}
        <View style={[st.header, { borderBottomColor: border, paddingTop: insets.top + 4 }]}>
          <TouchableOpacity onPress={onClose} style={st.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={22} color={fg} />
          </TouchableOpacity>

          <Text style={[st.headerTitle, { color: fg }]}>Nuevo post</Text>

          {/* Audiencia */}
          <TouchableOpacity
            style={[st.audienceBtn, { borderColor: isDark ? '#333' : '#e5e7eb' }]}
            onPress={() => setAudience(a => a === 'todos' ? 'seguidores' : 'todos')}
          >
            <Ionicons
              name={audience === 'todos' ? 'earth-outline' : 'people-outline'}
              size={13}
              color="#7c3aed"
            />
            <Text style={st.audienceText}>
              {audience === 'todos' ? 'Todos' : 'Seguidores'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Área de escritura estilo Threads ────────────────── */}
          <View style={st.compose}>
            {/* Avatar + línea hilo */}
            <View style={st.avatarCol}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={st.avatar} />
              ) : (
                <LinearGradient colors={catData?.colors ?? ['#7c3aed', '#4f46e5']} style={st.avatar}>
                  <Text style={st.initials}>{initials}</Text>
                </LinearGradient>
              )}
              {text.length > 0 && <View style={[st.threadLine, { backgroundColor: border }]} />}
            </View>

            {/* Input */}
            <View style={st.inputCol}>
              <Text style={[st.authorName, { color: fg }]}>{displayName}</Text>
              <TextInput
                ref={inputRef}
                style={[st.input, { color: fg }]}
                placeholder="¿Qué quieres compartir?"
                placeholderTextColor={sub}
                multiline
                autoFocus
                value={text}
                onChangeText={setText}
                maxLength={500}
              />
              {text.length > 0 && (
                <Text style={[st.charCount, { color: sub }]}>{500 - text.length}</Text>
              )}
            </View>
          </View>

          {/* ── Selector de categoría ──────────────────────────── */}
          <View style={[st.catSection, { borderTopColor: border, borderBottomColor: border }]}>
            <Text style={[st.catLabel, { color: sub }]}>Disciplina</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={st.catScroll}
            >
              {POST_CATEGORIES.map(cat => {
                const active = selectedCat === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCat(active ? null : cat.id)}
                    activeOpacity={0.8}
                  >
                    {active ? (
                      <LinearGradient
                        colors={cat.colors}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={st.catPillActive}
                      >
                        <Ionicons name={cat.icon as any} size={13} color="#fff" />
                        <Text style={st.catLabelActive}>{cat.label}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={[st.catPill, { borderColor: isDark ? '#333' : '#e5e7eb' }]}>
                        <Ionicons name={cat.icon as any} size={13} color={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'} />
                        <Text style={[st.catLabelInactive, { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)' }]}>
                          {cat.label}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>

        {/* ── Toolbar inferior + Publicar ─────────────────────── */}
        <View style={[st.toolbar, { borderTopColor: border, paddingBottom: insets.bottom + 8 }]}>
          <View style={st.toolbarActions}>
            <TouchableOpacity style={st.toolBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Ionicons name="image-outline" size={24} color="#7c3aed" />
            </TouchableOpacity>
            <TouchableOpacity style={st.toolBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Ionicons name="videocam-outline" size={24} color="#7c3aed" />
            </TouchableOpacity>
            <TouchableOpacity style={st.toolBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Ionicons name="location-outline" size={24} color="#7c3aed" />
            </TouchableOpacity>
            <TouchableOpacity style={st.toolBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Ionicons name="at-outline" size={24} color="#7c3aed" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handlePost}
            activeOpacity={canPost ? 0.85 : 1}
          >
            {canPost ? (
              <LinearGradient
                colors={catData?.colors ?? ['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={st.postBtn}
              >
                <Text style={st.postBtnText}>Publicar</Text>
              </LinearGradient>
            ) : (
              <View style={[st.postBtn, st.postBtnDisabled]}>
                <Text style={[st.postBtnText, { opacity: 0.5 }]}>Publicar</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const AVATAR_SIZE = 42;

const st = StyleSheet.create({
  root: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  audienceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  audienceText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
  },

  // Área de escritura
  compose: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    gap: 12,
  },
  avatarCol: {
    alignItems: 'center',
    width: AVATAR_SIZE,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  threadLine: {
    flex: 1,
    width: 2,
    marginTop: 6,
    borderRadius: 1,
    minHeight: 20,
  },
  inputCol: {
    flex: 1,
    paddingTop: 4,
  },
  authorName: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    marginBottom: 6,
  },
  input: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    lineHeight: 24,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    marginTop: 4,
    textAlign: 'right',
  },

  // Categorías
  catSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  catLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  catScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  catPillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  catLabelActive: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },
  catLabelInactive: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
  },

  // Toolbar
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    justifyContent: 'space-between',
  },
  toolbarActions: {
    flexDirection: 'row',
    gap: 4,
  },
  toolBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postBtn: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
  },
  postBtnDisabled: {
    backgroundColor: 'rgba(124,58,237,0.25)',
  },
  postBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});
