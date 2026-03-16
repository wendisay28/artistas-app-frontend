// src/screens/home/components/SaveToCollectionModal.tsx
// Guardar un FeedPost en un proyecto del usuario.
// Flujo: muestra proyectos reales → selecciona → guarda en InspirationStore + ListsStore.
// Si no hay proyectos → mensaje para crear uno en Favoritos > Proyectos.

import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, Pressable,
  ScrollView, Alert, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '../../../store/themeStore';
import { useListsStore } from '../../../store/listsStore';
import { useInspirationStore, type InspirationCategory } from '../../../store/inspirationStore';
import { CreateProjectModal } from '../../favorites/components/projects/CreateProjectModal';
import type { FeedPost } from '../data/feedData';

const CAT_MAP: Record<string, InspirationCategory> = {
  'artes-visuales':  'arte',
  'artes-escenicas': 'teatro',
  'musica':          'musica',
  'audiovisual':     'arte',
  'diseno':          'arte',
  'comunicacion':    'arte',
  'cultura-turismo': 'arte',
};

type Props = {
  visible: boolean;
  post: FeedPost | null;
  onClose: () => void;
};

export default function SaveToCollectionModal({ visible, post, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeStore();
  const { projects, addInspirationToProject, createProject } = useListsStore();
  const { addFromHome, addToProjectId } = useInspirationStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);

  if (!post) return null;

  const haptic = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = () => {
    if (!selected) return;
    haptic();

    // 1. Guardar en InspirationStore (dedup si ya existe)
    const inspirationId = addFromHome({
      feedPostId:  post.id,
      image:       post.images?.[0] ?? post.author.avatar ?? '',
      title:       post.content.slice(0, 80) || post.author.name,
      author:      post.author.name,
      artistId:    post.author.id,
      category:    CAT_MAP[post.author.category] ?? 'arte',
      tags:        [],
      description: post.content,
    });

    // 2. Asociar al proyecto (bidireccional)
    addInspirationToProject(selected, inspirationId);
    addToProjectId(inspirationId, selected);

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSelected(null);
      onClose();
    }, 900);
  };

  const selectedProject = projects.find(p => p.id === selected);

  return (
    <>
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => { setSelected(null); onClose(); }}
    >
      <CreateProjectModal
        visible={showCreateProject}
        mode="create"
        onConfirm={(name, icon) => {
          createProject(name, icon);
          setShowCreateProject(false);
        }}
        onClose={() => setShowCreateProject(false)}
      />
      <Pressable
        style={st.backdrop}
        onPress={() => { setSelected(null); onClose(); }}
      >
        <Pressable
          style={[
            st.sheet,
            isDark && st.sheetDark,
            { paddingBottom: insets.bottom + 16 },
          ]}
          onPress={() => {}}  // evita cerrar al tocar dentro
        >
          {/* Handle */}
          <View style={[st.handle, isDark && st.handleDark]} />

          {/* Header */}
          <View style={st.header}>
            <Text style={[st.title, isDark && st.titleDark]}>Guardar en proyecto</Text>
            <Pressable onPress={() => { setSelected(null); onClose(); }} hitSlop={12}>
              <Ionicons name="close" size={22} color={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'} />
            </Pressable>
          </View>

          {/* Preview del post */}
          <View style={[st.preview, isDark && st.previewDark]}>
            {post.images?.[0] ? (
              <Image source={{ uri: post.images[0] }} style={st.previewImg} contentFit="cover" />
            ) : post.author.avatar ? (
              <Image source={{ uri: post.author.avatar }} style={st.previewImg} contentFit="cover" />
            ) : (
              <View style={[st.previewImg, st.previewImgFallback]}>
                <Ionicons name="image-outline" size={18} color="#7c3aed" />
              </View>
            )}
            <View style={st.previewInfo}>
              <Text style={[st.previewAuthor, isDark && st.previewAuthorDark]} numberOfLines={1}>
                {post.author.name}
              </Text>
              <Text style={[st.previewContent, isDark && st.previewContentDark]} numberOfLines={2}>
                {post.content}
              </Text>
            </View>
          </View>

          {/* Sin proyectos */}
          {projects.length === 0 ? (
            <View style={[st.empty, isDark && st.emptyDark]}>
              <Ionicons name="folder-open-outline" size={32} color={isDark ? '#a78bfa' : '#7c3aed'} />
              <Text style={[st.emptyTitle, isDark && st.emptyTitleDark]}>
                Aún no tienes proyectos
              </Text>
              <Pressable
                onPress={() => setShowCreateProject(true)}
                style={({ pressed }) => [st.createBtn, pressed && { opacity: 0.85 }]}
              >
                <LinearGradient
                  colors={['#7c3aed', '#2563eb']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={st.createBtnGradient}
                >
                  <Ionicons name="add-circle-outline" size={16} color="#fff" />
                  <Text style={st.createBtnText}>Crear mi primer proyecto</Text>
                </LinearGradient>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={[st.label, isDark && st.labelDark]}>ELIGE UN PROYECTO</Text>
              <ScrollView
                style={st.list}
                showsVerticalScrollIndicator={false}
              >
                {projects.map(proj => {
                  const isSelected = selected === proj.id;
                  const cover = proj.cards.find(c => c.image)?.image;
                  const total = proj.cards.length + proj.inspirations.length;
                  return (
                    <Pressable
                      key={proj.id}
                      onPress={() => { haptic(); setSelected(isSelected ? null : proj.id); }}
                      style={({ pressed }) => [
                        st.row,
                        isDark && st.rowDark,
                        isSelected && st.rowSelected,
                        pressed && { opacity: 0.8 },
                      ]}
                    >
                      {/* Miniatura */}
                      <View style={[st.rowCover, isDark && st.rowCoverDark]}>
                        {cover ? (
                          <Image source={{ uri: cover }} style={StyleSheet.absoluteFill} contentFit="cover" />
                        ) : (
                          <LinearGradient
                            colors={isDark ? ['#1a0f35', '#0d0820'] : ['#ede8ff', '#e4eeff']}
                            style={StyleSheet.absoluteFill}
                          />
                        )}
                        <Ionicons name={proj.icon as any} size={18} color="#7c3aed" />
                      </View>

                      {/* Info */}
                      <View style={st.rowInfo}>
                        <Text style={[st.rowName, isDark && st.rowNameDark]}>{proj.name}</Text>
                        <Text style={[st.rowCount, isDark && st.rowCountDark]}>
                          {total} {total === 1 ? 'ítem' : 'ítems'}
                        </Text>
                      </View>

                      {/* Check */}
                      <View style={[st.check, isSelected && st.checkActive]}>
                        {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Botón guardar */}
              <Pressable
                onPress={handleSave}
                disabled={!selected || saved}
                style={({ pressed }) => [
                  st.saveBtn,
                  isDark && selected && !saved && st.saveBtnDark,
                  !selected && st.saveBtnDisabled,
                  pressed && { opacity: 0.85 },
                ]}
              >
                {saved ? (
                  <>
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                    <Text style={st.saveBtnText}>¡Guardado!</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="bookmark" size={16} color="#fff" />
                    <Text style={st.saveBtnText}>
                      {selected
                        ? `Guardar en "${selectedProject?.name}"`
                        : 'Selecciona un proyecto'}
                    </Text>
                  </>
                )}
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
    </>
  );
}

const st = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingTop: 12,
    maxHeight: '85%',
  },
  sheetDark: {
    backgroundColor: '#0a0618',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(139,92,246,0.22)',
  },
  handle: {
    alignSelf: 'center',
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(124,58,237,0.2)',
    marginBottom: 16,
  },
  handleDark: { backgroundColor: 'rgba(167,139,250,0.25)' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  titleDark: { color: '#f5f3ff' },

  // Preview
  preview: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(124,58,237,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.12)',
    marginBottom: 16,
  },
  previewDark: {
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderColor: 'rgba(139,92,246,0.18)',
  },
  previewImg: {
    width: 52, height: 52, borderRadius: 10, backgroundColor: '#e5e7eb', overflow: 'hidden',
  },
  previewImgFallback: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(124,58,237,0.08)',
  },
  previewInfo: { flex: 1, gap: 3 },
  previewAuthor: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  previewAuthorDark: { color: '#f5f3ff' },
  previewContent: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(0,0,0,0.5)', lineHeight: 17,
  },
  previewContentDark: { color: 'rgba(255,255,255,0.45)' },

  // Sin proyectos
  empty: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
    backgroundColor: 'rgba(124,58,237,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(124,58,237,0.2)',
    marginBottom: 16,
  },
  emptyDark: {
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderColor: 'rgba(139,92,246,0.25)',
  },
  emptyTitle: {
    fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  emptyTitleDark: { color: '#f5f3ff' },
  createBtn: { marginTop: 4, borderRadius: 14, overflow: 'hidden' },
  createBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, paddingHorizontal: 20,
  },
  createBtnText: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },

  label: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.5)', letterSpacing: 0.8,
    marginBottom: 10,
  },
  labelDark: { color: 'rgba(167,139,250,0.55)' },

  list: { maxHeight: 280, marginBottom: 12 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 6,
    backgroundColor: 'rgba(124,58,237,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.15)',
  },
  rowDark: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(167,139,250,0.12)',
  },
  rowSelected: {
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderColor: 'rgba(124,58,237,0.35)',
  },
  rowCover: {
    width: 44, height: 44, borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#ede8ff',
  },
  rowCoverDark: { backgroundColor: '#1a0f35' },
  rowInfo: { flex: 1 },
  rowName: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b', marginBottom: 2,
  },
  rowNameDark: { color: '#f5f3ff' },
  rowCount: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.45)',
  },
  rowCountDark: { color: 'rgba(167,139,250,0.5)' },
  check: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  checkActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#7c3aed',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnDisabled: { backgroundColor: '#d1d5db', shadowOpacity: 0 },
  saveBtnDark: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnText: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff',
  },
});
