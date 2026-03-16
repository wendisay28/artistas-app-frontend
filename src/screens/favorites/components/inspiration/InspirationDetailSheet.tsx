// InspirationDetailSheet — usa el mismo patrón que ImageViewerModal del feed

import React, { useEffect, useRef, useState } from 'react';
import {
  Modal, View, Text, Pressable, ScrollView,
  StyleSheet, Dimensions, Platform, Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type InspirationPost } from '../../../../store/inspirationStore';
import { useListsStore } from '../../../../store/listsStore';
import { useInspirationStore } from '../../../../store/inspirationStore';

const { width: W, height: H } = Dimensions.get('window');

type Props = {
  post: InspirationPost | null;
  visible: boolean;
  onClose: () => void;
  onViewArtist?: (artistId: string) => void;
};

export const InspirationDetailSheet: React.FC<Props> = ({ post, visible, onClose, onViewArtist }) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [savedProjectId, setSavedProjectId] = useState<string | null>(null);

  const { projects, addInspirationToProject } = useListsStore();
  const { addToProjectId } = useInspirationStore();

  const images: string[] = post
    ? (post.images && post.images.length > 1 ? post.images : [post.image])
    : [];

  useEffect(() => {
    if (!visible) { setIndex(0); setSavedProjectId(null); return; }
    setTimeout(() => scrollRef.current?.scrollTo({ x: 0, y: 0, animated: false }), 50);
  }, [visible, post?.id]);

  const openPicker = () => {
    scaleAnim.setValue(0.85);
    opacityAnim.setValue(0);
    setShowPicker(true);
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, bounciness: 6 }),
      Animated.timing(opacityAnim, { toValue: 1, useNativeDriver: true, duration: 180 }),
    ]).start();
  };

  const closePicker = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 0.85, useNativeDriver: true, duration: 160 }),
      Animated.timing(opacityAnim, { toValue: 0, useNativeDriver: true, duration: 160 }),
    ]).start(() => setShowPicker(false));
  };

  const handleSaveToProject = (projectId: string) => {
    if (!post) return;
    addInspirationToProject(projectId, post.id);
    addToProjectId(post.id, projectId);
    setSavedProjectId(projectId);
    closePicker();
  };

  if (!post) return null;

  const alreadySaved = (projectId: string) =>
    post.projectIds?.includes(projectId) || savedProjectId === projectId;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : 'fullScreen'}
      statusBarTranslucent
      onRequestClose={showPicker ? closePicker : onClose}
    >
      <View style={s.root}>

          {/* Barra superior */}
          <View style={[s.topBar, { paddingTop: insets.top + 8 }]}>
            <Pressable onPress={onClose} style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.6 }]}>
              <Ionicons name="close" size={22} color="#fff" />
            </Pressable>

            <View style={{ flex: 1 }} />

            {images.length > 1 && (
              <View style={[s.counterWrap, { marginRight: 8 }]}>
                <Text style={s.counterText}>{index + 1}/{images.length}</Text>
              </View>
            )}

            {/* Botón agregar a proyecto */}
            <Pressable
              onPress={openPicker}
              style={({ pressed }) => [s.addProjBtn, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="add" size={14} color={savedProjectId ? '#a78bfa' : '#fff'} />
              <Text style={[s.addProjText, savedProjectId && { color: '#a78bfa' }]}>
                {savedProjectId ? 'Guardado' : 'Proyecto'}
              </Text>
            </Pressable>
          </View>

          {/* Carrusel */}
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            onMomentumScrollEnd={e => {
              setIndex(Math.round(e.nativeEvent.contentOffset.x / W));
            }}
          >
            {images.map((uri, i) => (
              <View key={i} style={s.page}>
                <Image source={{ uri }} style={s.image} contentFit="contain" />
              </View>
            ))}
          </ScrollView>

          {/* Autor — barra inferior mínima */}
          <Pressable
            style={[s.authorBar, { paddingBottom: insets.bottom + 12 }]}
            onPress={() => post.artistId && onViewArtist?.(post.artistId)}
          >
            <View style={s.avatar}>
              <Text style={s.avatarLetter}>{(post.author || 'A')[0].toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.authorName}>{post.author || 'Artista'}</Text>
              {post.title ? <Text style={s.authorSub} numberOfLines={1}>{post.title}</Text> : null}
            </View>
            {post.artistId && (
              <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.4)" />
            )}
          </Pressable>

          {/* Project picker — bottom sheet absoluto dentro del mismo Modal */}
          {showPicker && (
            <Pressable style={s.pickerBackdrop} onPress={closePicker}>
              <Animated.View
                style={[
                  s.pickerSheet,
                  { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
                ]}
              >
                <Pressable onPress={() => {}}>
                  <Text style={s.pickerTitle}>Guardar en proyecto</Text>

                  {projects.length === 0 ? (
                    <View style={s.pickerEmpty}>
                      <Ionicons name="folder-open-outline" size={30} color="#7c3aed" />
                      <Text style={s.pickerEmptyText}>Aún no tienes proyectos</Text>
                      <Text style={s.pickerEmptySub}>Créalos desde Favoritos {'>'} Proyectos</Text>
                    </View>
                  ) : (
                    <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
                      {projects.map(proj => {
                        const saved = alreadySaved(proj.id);
                        const cover = proj.cards.find(c => c.image)?.image;
                        return (
                          <Pressable
                            key={proj.id}
                            onPress={() => !saved && handleSaveToProject(proj.id)}
                            style={({ pressed }) => [
                              s.projRow,
                              saved && s.projRowSaved,
                              pressed && !saved && { opacity: 0.75 },
                            ]}
                          >
                            <View style={s.projCover}>
                              {cover ? (
                                <Image source={{ uri: cover }} style={StyleSheet.absoluteFill} contentFit="cover" />
                              ) : (
                                <LinearGradient
                                  colors={['#1a0f35', '#0d0820']}
                                  style={StyleSheet.absoluteFill}
                                />
                              )}
                              <Ionicons name={proj.icon as any} size={16} color="#a78bfa" />
                            </View>

                            <View style={{ flex: 1 }}>
                              <Text style={s.projName}>{proj.name}</Text>
                              <Text style={s.projCount}>
                                {proj.cards.length + proj.inspirations.length} ítems
                              </Text>
                            </View>

                            {saved ? (
                              <View style={s.savedBadge}>
                                <Ionicons name="checkmark" size={13} color="#fff" />
                              </View>
                            ) : (
                              <View style={s.addCircle}>
                                <Ionicons name="add" size={16} color="#a78bfa" />
                              </View>
                            )}
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  )}
                </Pressable>
              </Animated.View>
            </Pressable>
          )}

        </View>
      </Modal>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 10,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  addProjBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  addProjText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },
  counterWrap: {
    minWidth: 52, height: 30, borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center',
  },
  counterText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },

  page: {
    width: W, height: H,
    alignItems: 'center', justifyContent: 'center',
    paddingTop: 54, paddingBottom: 80,
  },
  image: { width: W, height: H },

  authorBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#7c3aed',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLetter: { color: '#fff', fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold' },
  authorName: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#fff' },
  authorSub: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.55)',
  },

  // ── Project picker ──────────────────────────────────────────────
  pickerBackdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    zIndex: 20,
    paddingHorizontal: 24,
  },
  pickerSheet: {
    width: '100%',
    backgroundColor: '#0a0618',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.22)',
    padding: 20,
    paddingTop: 16,
    maxHeight: H * 0.65,
  },
  handle: {
    alignSelf: 'center',
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(167,139,250,0.3)',
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold',
    color: '#f5f3ff', marginBottom: 14,
  },
  pickerEmpty: {
    alignItems: 'center', paddingVertical: 28, gap: 8,
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(124,58,237,0.25)',
  },
  pickerEmptyText: {
    fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#f5f3ff',
  },
  pickerEmptySub: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(167,139,250,0.55)', textAlign: 'center',
  },

  projRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.12)',
  },
  projRowSaved: {
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderColor: 'rgba(124,58,237,0.35)',
  },
  projCover: {
    width: 44, height: 44, borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1a0f35',
  },
  projName: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold',
    color: '#f5f3ff', marginBottom: 2,
  },
  projCount: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(167,139,250,0.5)',
  },
  savedBadge: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#7c3aed',
    alignItems: 'center', justifyContent: 'center',
  },
  addCircle: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
});
