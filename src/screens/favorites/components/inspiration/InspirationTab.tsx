// ─────────────────────────────────────────────────────────────────────────────
// InspirationTab.tsx — Vista Inspiración Estilo Pinterest
// FIXES:
// 1. Filtros de categoría funcionales (chips horizontales)
// 2. InspirationDetailSheet fuera del ScrollView
// 3. Masonry con alturas variables (usa InspirationCard, no renderCard inline)
// 4. Modal upload limpio
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Modal, TextInput,
  Alert, ActivityIndicator, Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../../../store/themeStore';
import {
  useInspirationStore,
  type InspirationPost,
  type InspirationCategory,
} from '../../../../store/inspirationStore';
import { InspirationCard } from './InspirationCard';
import { InspirationDetailSheet } from './InspirationDetailSheet';

const GAP = 8;
const PADDING = 14;

const FILTERS: { key: InspirationCategory; label: string }[] = [
  { key: 'todos',  label: 'Todos' },
  { key: 'arte',   label: 'Arte' },
  { key: 'foto',   label: 'Foto' },
  { key: 'musica', label: 'Música' },
  { key: 'bodas',  label: 'Bodas' },
  { key: 'teatro', label: 'Teatro' },
];

export const InspirationTab: React.FC = () => {
  const { isDark } = useThemeStore();
  const insets = useSafeAreaInsets();
  const { posts, addOwnUpload, removePost, activeFilter, setFilter } = useInspirationStore();

  const [selectedPost, setSelectedPost] = useState<InspirationPost | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  // Posts filtrados por categoría activa
  const filteredPosts = useMemo(() => {
    if (activeFilter === 'todos') return posts;
    return posts.filter(p => p.category === activeFilter);
  }, [posts, activeFilter]);

  // Split en dos columnas para masonry
  const { leftCol, rightCol } = useMemo(() => {
    const left: InspirationPost[] = [];
    const right: InspirationPost[] = [];
    filteredPosts.forEach((p, i) => {
      if (i % 2 === 0) left.push(p);
      else right.push(p);
    });
    return { leftCol: left, rightCol: right };
  }, [filteredPosts]);

  const openDetail = (post: InspirationPost) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPost(post);
    setDetailVisible(true);
  };

  const closeDetail = () => {
    setDetailVisible(false);
    // Limpiamos el post con delay para que la animación de cierre termine limpia
    setTimeout(() => setSelectedPost(null), 350);
  };

  // ── Image picker ──────────────────────────────────────────────
  const openImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as any,
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setUploadImage(result.assets[0].uri);
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleUploadConfirm = async () => {
    if (!uploadImage || !uploadTitle.trim()) {
      Alert.alert('Faltan datos', 'Elige una imagen y escribe un título.');
      return;
    }
    setUploading(true);
    try {
      addOwnUpload({
        image: uploadImage,
        title: uploadTitle.trim(),
        category: 'arte',
        tags: [],
      });
      setUploadVisible(false);
      setUploadImage(null);
      setUploadTitle('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={[styles.root, isDark && styles.rootDark]}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, isDark && styles.textDark]}>Inspiración</Text>
            <Text style={styles.countText}>{filteredPosts.length} referencias</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setUploadVisible(true);
            }}
            activeOpacity={0.82}
            style={styles.addBtnOuter}
          >
            <LinearGradient
              colors={['#7c3aed', '#2563eb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addBtn}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.addBtnText}>Subir</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── Filtros de categoría ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          style={styles.filtersScroll}
        >
          {FILTERS.map(f => {
            const active = activeFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.75}
                style={[
                  styles.filterChip,
                  isDark && styles.filterChipDark,
                  active && styles.filterChipActive,
                ]}
              >
                <Text style={[
                  styles.filterChipText,
                  isDark && styles.filterChipTextDark,
                  active && styles.filterChipTextActive,
                ]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Grid Masonry ── */}
        {filteredPosts.length > 0 ? (
          <View style={styles.masonryGrid}>
            <View style={styles.column}>
              {leftCol.map(post => (
                <View key={post.id} style={{ marginBottom: GAP }}>
                  <InspirationCard
                    post={post}
                    onPress={() => openDetail(post)}
                    onBookmarkToggle={() => removePost(post.id)}
                  />
                </View>
              ))}
            </View>
            <View style={styles.column}>
              {rightCol.map(post => (
                <View key={post.id} style={{ marginBottom: GAP }}>
                  <InspirationCard
                    post={post}
                    onPress={() => openDetail(post)}
                    onBookmarkToggle={() => removePost(post.id)}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={48} color="rgba(124,58,237,0.35)" />
            <Text style={[styles.emptyTitle, isDark && styles.textDark]}>
              {activeFilter === 'todos' ? 'Tu moodboard está vacío' : `Sin posts de ${activeFilter}`}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'todos'
                ? 'Sube tu primera referencia visual'
                : 'Prueba con otro filtro o sube una referencia'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ── Modal Subir ──
          IMPORTANTE: fuera del ScrollView pero dentro del root View */}
      <Modal visible={uploadVisible} animationType="slide" statusBarTranslucent>
        <View style={[styles.uploadRoot, isDark && styles.uploadRootDark]}>
          <View style={[styles.uploadHeader, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity
              onPress={() => setUploadVisible(false)}
              style={[styles.closeBtn, isDark && styles.closeBtnDark]}
            >
              <Ionicons name="close" size={20} color={isDark ? '#f5f3ff' : '#1e1b4b'} />
            </TouchableOpacity>
            <Text style={[styles.uploadTitleText, isDark && styles.textDark]}>
              Nueva Referencia
            </Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView contentContainerStyle={styles.uploadContent}>
            <TouchableOpacity
              style={[styles.pickerBox, isDark && styles.pickerBoxDark]}
              onPress={openImagePicker}
              activeOpacity={0.85}
            >
              {uploadImage ? (
                <>
                  <Image
                    source={{ uri: uploadImage }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                  />
                  <View style={styles.pickerChangeBadge}>
                    <Ionicons name="pencil" size={13} color="#fff" />
                    <Text style={styles.pickerChangeText}>Cambiar</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.pickerIconWrap}>
                    <Ionicons name="camera-outline" size={32} color="#7c3aed" />
                  </View>
                  <Text style={[styles.pickerHint, isDark && { color: '#6b6b7a' }]}>
                    Toca para elegir imagen
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Título de la inspiración"
              placeholderTextColor="#9ca3af"
              value={uploadTitle}
              onChangeText={setUploadTitle}
            />

            <TouchableOpacity
              onPress={handleUploadConfirm}
              disabled={uploading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveBtn}
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                    <Text style={styles.saveBtnText}>Publicar</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* ── Detail sheet — FUERA del ScrollView, al nivel del root ── */}
      <InspirationDetailSheet
        post={selectedPost}
        visible={detailVisible}
        onClose={closeDetail}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  rootDark: { backgroundColor: '#0a0618' },
  textDark: { color: '#f5f3ff' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING,
    paddingTop: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
  },
  countText: {
    fontSize: 12,
    color: '#7c3aed',
    opacity: 0.8,
    marginTop: 2,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  addBtnOuter: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },

  // ── Filtros ──
  filtersScroll: {
    marginBottom: 14,
  },
  filtersContainer: {
    paddingHorizontal: PADDING,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.15)',
  },
  filterChipDark: {
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderColor: 'rgba(124,58,237,0.25)',
  },
  filterChipActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#7c3aed',
  },
  filterChipTextDark: {
    color: '#a78bfa',
  },
  filterChipTextActive: {
    color: '#fff',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },

  // ── Masonry ──
  masonryGrid: {
    flexDirection: 'row',
    paddingHorizontal: PADDING,
    gap: GAP,
    alignItems: 'flex-start',
  },
  column: {
    flex: 1,
  },

  // ── Empty state ──
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans_400Regular',
  },

  // ── Modal Upload ──
  uploadRoot: { flex: 1, backgroundColor: '#fff' },
  uploadRootDark: { backgroundColor: '#0a0618' },
  uploadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(124,58,237,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnDark: { backgroundColor: 'rgba(255,255,255,0.07)' },
  uploadTitleText: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
  },
  uploadContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  pickerBox: {
    height: 260,
    backgroundColor: 'rgba(124,58,237,0.05)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(124,58,237,0.25)',
    borderStyle: 'dashed',
    gap: 10,
  },
  pickerBoxDark: {
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderColor: 'rgba(124,58,237,0.4)',
  },
  pickerIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(124,58,237,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerHint: {
    fontSize: 13,
    color: '#9ca3af',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  pickerChangeBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pickerChangeText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  input: {
    height: 55,
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1e1b4b',
    fontFamily: 'PlusJakartaSans_400Regular',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.12)',
  },
  inputDark: {
    backgroundColor: '#1a1625',
    color: '#f5f3ff',
    borderColor: 'rgba(124,58,237,0.25)',
  },
  saveBtn: {
    height: 55,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});