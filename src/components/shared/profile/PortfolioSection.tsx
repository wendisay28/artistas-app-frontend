// src/components/profile/sections/PortfolioSection.tsx
// FlatList → .map() para evitar VirtualizedList anidado en ScrollView padre
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, Pressable, Modal, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useModalStore } from '../../../store/modalStore';
import * as Haptics from 'expo-haptics';
import { portfolioService, GalleryItem, FeaturedItem } from '../../../services/api/portfolio';
import { storageService } from '../../../services/api/storage';
import * as ImagePicker from 'expo-image-picker';
import { compressImage } from '../../../hooks/useProfileImageUpload';
import GalleryModal from '../../explore/shared/GalleryModal';
import { Linking } from 'react-native';
import { EnhancedGalleryGrid } from './GalleryGrid';

const { width: WINDOW_W, height: WINDOW_H } = Dimensions.get('window');

// ── Constantes ────────────────────────────────────────────────────────────────

const MAX_FEATURED = 5;

interface PortfolioSectionProps {
  portfolio: GalleryItem[];
  videos: FeaturedItem[];
  isOwner: boolean;
  onPortfolioUpdated?: () => void;
}

// ── Empty State ───────────────────────────────────────────────────────────────

const EmptyState: React.FC<{
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  preview?: React.ReactNode;
}> = ({ icon, title, subtitle, preview }) => (
  <View style={es.container}>
    <View style={es.iconWrap}>
      <Ionicons name={icon} size={32} color="rgba(124,58,237,0.3)" />
    </View>
    <Text style={es.title}>{title}</Text>
    <Text style={es.subtitle}>{subtitle}</Text>
    {preview && (
      <>
        <View style={es.sep}>
          <View style={es.sepLine} />
          <Text style={es.sepText}>Así se verá</Text>
          <View style={es.sepLine} />
        </View>
        {preview}
      </>
    )}
  </View>
);

const es = StyleSheet.create({
  container: {
    alignItems: 'center', paddingVertical: 28, paddingHorizontal: 16, gap: 8,
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.18)',
    borderRadius: 16, borderStyle: 'dashed',
    backgroundColor: 'rgba(245,243,255,0.4)',
  },
  iconWrap: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: 'rgba(124,58,237,0.07)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 2,
  },
  title: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  subtitle: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(124,58,237,0.4)', textAlign: 'center',
    lineHeight: 18, paddingHorizontal: 8,
  },
  sep: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    width: '100%', marginTop: 4,
  },
  sepLine: { flex: 1, height: 1, backgroundColor: 'rgba(124,58,237,0.1)' },
  sepText: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(124,58,237,0.3)',
  },
});

// ── Gallery Grid ──────────────────────────────────────────────────────────────
// Eliminado - ahora usamos EnhancedGalleryGrid importado

// ── Video Grid (estilo reels 2 columnas) ──────────────────────────────────────

const VideoGrid: React.FC<{
  videos: FeaturedItem[];
  isOwner: boolean;
  onPlay: (video: FeaturedItem) => void;
  onEdit: (video: FeaturedItem) => void;
}> = ({ videos, isOwner, onPlay, onEdit }) => {
  const rows: FeaturedItem[][] = [];
  for (let i = 0; i < videos.length; i += 2) {
    rows.push(videos.slice(i, i + 2));
  }
  return (
    <View style={vg.grid}>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={vg.row}>
          {row.map((item, colIdx) => (
            <Pressable
              key={item.id?.toString() || String(rowIdx * 2 + colIdx)}
              style={({ pressed }) => [vg.cell, pressed && { opacity: 0.75 }]}
              onPress={() => onPlay(item)}
            >
              {item.thumbnailUrl ? (
                <Image
                  source={{ uri: item.thumbnailUrl }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
              ) : (
                <LinearGradient
                  colors={['#1e1b4b', '#4c1d95']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <View style={vg.playOverlay}>
                <View style={vg.playBtn}>
                  <Ionicons name="play" size={18} color="#fff" />
                </View>
              </View>
              <View style={vg.titleBar}>
                <Text style={vg.titleText} numberOfLines={1}>{item.title}</Text>
              </View>
              {isOwner && (
                <TouchableOpacity
                  style={vg.editBtn}
                  onPress={(e) => { e.stopPropagation(); onEdit(item); }}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="pencil" size={12} color="#fff" />
                </TouchableOpacity>
              )}
            </Pressable>
          ))}
          {row.length === 1 && (
            <View style={[vg.cell, { opacity: 0 }]} pointerEvents="none" />
          )}
        </View>
      ))}
    </View>
  );
};

const vg = StyleSheet.create({
  grid: { gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  cell: {
    flex: 1, aspectRatio: 1,
    borderRadius: 14, overflow: 'hidden',
    backgroundColor: '#1e1b4b',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  playBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center', justifyContent: 'center',
    paddingLeft: 3,
  },
  titleBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 10, paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  titleText: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#fff' },
  editBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
});

// ── Video Player Modal (reel full screen) ─────────────────────────────────────

// Se monta solo cuando hay video

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  portfolio, videos, isOwner, onPortfolioUpdated,
}) => {
  const { openVideoModal, closeVideoModal } = useModalStore();
  const [activeTab, setActiveTab]           = useState<'photos' | 'videos'>('photos');
  const [editingVideo, setEditingVideo]     = useState<FeaturedItem | null>(null);
  const [isSavingVideo, setIsSavingVideo]   = useState(false);
  const [isUploadingImage, setIsUploading]  = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [galleryOpen, setGalleryOpen]       = useState(false);
  const [galleryIndex, setGalleryIndex]     = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);

  const galleryImages = portfolio.map(p => p.imageUrl).filter(Boolean) as string[];

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const handleItemPress = (item: GalleryItem, index: number) => {
    openGallery(index);
  };

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isUploadingVideo) {
      progressAnim.setValue(0);
      Animated.loop(
        Animated.timing(progressAnim, { toValue: 1, duration: 1400, useNativeDriver: true })
      ).start();
    } else {
      progressAnim.stopAnimation();
      progressAnim.setValue(0);
    }
  }, [isUploadingVideo]);

  const handleDeletePhoto = (item: GalleryItem) => {
    Alert.alert(
      'Eliminar foto',
      '¿Estás segura de que quieres eliminar esta foto de tu portafolio? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await portfolioService.deletePhoto(Number(item.id));
              if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onPortfolioUpdated?.();
            } catch {
              Alert.alert('Error', 'No se pudo eliminar la foto. Inténtalo de nuevo.');
            }
          },
        },
      ]
    );
  };

  const handleToggleFeatured = async (item: GalleryItem) => {
    if (!item.id) return;
    try {
      await portfolioService.toggleFeatured(Number(item.id), !item.isFeatured);
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPortfolioUpdated?.();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la foto. Inténtalo de nuevo.');
    }
  };

  const hasPortfolio = portfolio && portfolio.length > 0;
  const hasVideos    = videos    && videos.length    > 0;

  const handleAddImage = async () => {
    try {
      setIsUploading(true);
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tu galería');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true, aspect: [4, 3], quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        const response = await storageService.uploadImage(asset, 'portfolio');
        await portfolioService.addPhoto({
          imageUrl: response.imageUrl, title: 'Nueva foto',
          description: '', tags: [], isPublic: true,
        });
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Éxito', 'Imagen agregada a tu portafolio');
        onPortfolioUpdated?.();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'No se pudo subir la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadVideo = async () => {
    try {
      setIsUploadingVideo(true);
      setUploadProgress(0);
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tu galería');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'videos',
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        const response = await storageService.uploadVideo(asset, (p) => setUploadProgress(p));
        await portfolioService.addVideo({
          url: response.imageUrl,
          title: asset.fileName?.replace(/\.[^.]+$/, '') || 'Mi video',
          description: '',
          type: 'other',
        });
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Éxito', 'Video agregado a tu portafolio');
        onPortfolioUpdated?.();
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      Alert.alert('Error', 'No se pudo subir el video. Inténtalo de nuevo.');
    } finally {
      setIsUploadingVideo(false);
      setUploadProgress(0);
    }
  };

  const handleSaveVideo = async (videoData: Partial<FeaturedItem>) => {
    setIsSavingVideo(true);
    try {
      if (editingVideo?.id) {
        await portfolioService.updateVideo(Number(editingVideo.id), videoData);
      } else {
        await portfolioService.addVideo({
          url: videoData.url || '', title: videoData.title || '',
          description: videoData.description, type: videoData.type || 'youtube',
        });
      }
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onPortfolioUpdated?.();
      closeVideoModal();
    } catch (error) {
      console.error('Error saving video:', error);
      Alert.alert('Error', 'No se pudo guardar el video. Inténtalo de nuevo.');
      throw error;
    } finally {
      setIsSavingVideo(false);
    }
  };

  return (
    <View style={styles.container}>
      {galleryOpen && galleryImages.length > 0 && (
        <GalleryModal
          images={galleryImages}
          initialIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.hint}>
          {hasPortfolio ? 'Toca una imagen para verla en detalle' : 'Comparte tus mejores trabajos'}
        </Text>
        {isOwner && (
          <View style={styles.buttons}>
            {activeTab === 'photos' && (
              <TouchableOpacity style={styles.button} onPress={handleAddImage} disabled={isUploadingImage}>
                <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonGrad}>
                  <Ionicons name="image-outline" size={13} color="#fff" />
                  <Text style={styles.buttonText}>{isUploadingImage ? 'Subiendo...' : 'Foto'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            {activeTab === 'videos' && (
              <>
                <TouchableOpacity style={styles.button} onPress={handleUploadVideo} disabled={isUploadingVideo}>
                  <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonGrad}>
                    <Ionicons name="cloud-upload-outline" size={13} color="#fff" />
                    <Text style={styles.buttonText}>
                    {isUploadingVideo ? (uploadProgress > 0 ? `${uploadProgress}%` : 'Preparando...') : 'Subir'}
                  </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => { setEditingVideo(null); openVideoModal(null); }}>
                  <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonGrad}>
                    <Ionicons name="link-outline" size={13} color="#fff" />
                    <Text style={styles.buttonText}>URL</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>

      {/* Sub-tabs Fotos / Videos */}
      <View style={styles.tabs}>
        {(['photos', 'videos'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Ionicons
              name={tab === 'photos' ? 'images-outline' : 'videocam-outline'}
              size={14}
              color={activeTab === tab ? '#7c3aed' : 'rgba(124,58,237,0.35)'}
            />
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'photos' ? 'Fotos' : 'Videos'}
            </Text>
            {activeTab === tab && (
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.tabIndicator}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'videos' && isUploadingVideo && (
        <View style={styles.progressWrap}>
          <Animated.View
            style={[styles.progressFill, {
              transform: [{
                translateX: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-WINDOW_W * 0.6, WINDOW_W],
                }),
              }],
            }]}
          />
        </View>
      )}

      {/* Content — sin flex:1, altura natural */}
      <View style={styles.content}>
        {activeTab === 'photos' && (
          hasPortfolio
            ? <EnhancedGalleryGrid
                items={portfolio}
                onItemPress={handleItemPress}
                showEdit={isOwner}
                onDelete={handleDeletePhoto}
                onToggleFeatured={handleToggleFeatured}
                compactMode={false} // Modo grande para fácil uso
              />
            : <EmptyState
                icon="images-outline"
                title="Sin fotos todavía"
                subtitle="Sube tus mejores trabajos y muéstrale al mundo tu talento."
                preview={
                  <View style={{ flexDirection: 'row', gap: 8, width: '100%', opacity: 0.45 }}>
                    <View style={{ flex: 1, aspectRatio: 1, borderRadius: 12, backgroundColor: 'rgba(124,58,237,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="image-outline" size={28} color="rgba(124,58,237,0.25)" />
                    </View>
                    <View style={{ flex: 1, aspectRatio: 1, borderRadius: 12, backgroundColor: 'rgba(124,58,237,0.06)', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="image-outline" size={28} color="rgba(124,58,237,0.18)" />
                    </View>
                  </View>
                }
              />
        )}
        {activeTab === 'videos' && (
          hasVideos
            ? <VideoGrid
                videos={videos}
                isOwner={isOwner}
                onPlay={(v) => { if (v.url) Linking.openURL(v.url); }}
                onEdit={(v) => { setEditingVideo(v); openVideoModal(v); }}
              />
            : <EmptyState
                icon="videocam-outline"
                title="Sin videos todavía"
                subtitle="Comparte clips de tus presentaciones. Los clientes lo adorarán."
                preview={
                  <View style={{ flexDirection: 'row', gap: 8, width: '100%', opacity: 0.45 }}>
                    {[0, 1].map(i => (
                      <View key={i} style={{ flex: 1, aspectRatio: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: 'rgba(30,27,75,0.14)' }}>
                        <View style={{ ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="play" size={13} color="rgba(255,255,255,0.4)" />
                          </View>
                        </View>
                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, backgroundColor: 'rgba(0,0,0,0.25)' }}>
                          <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)', width: '60%' }} />
                        </View>
                      </View>
                    ))}
                  </View>
                }
              />
        )}
      </View>

      </View>
  );
};

const styles = StyleSheet.create({
  // Sin flex:1 — altura natural dentro del ScrollView padre
  container: {},
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  hint: {
    fontSize: 10.5, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(124,58,237,0.35)', fontStyle: 'italic', flex: 1,
  },
  buttons: { flexDirection: 'row', gap: 8 },
  button: {},
  buttonGrad: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
  },
  buttonText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },

  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1, borderBottomColor: 'rgba(167,139,250,0.15)',
    marginBottom: 16,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 5, paddingVertical: 12,
    position: 'relative',
  },
  tabActive: {},
  tabText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(124,58,237,0.35)',
  },
  tabTextActive: { fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
  tabIndicator: {
    position: 'absolute', bottom: 0, left: 12, right: 12,
    height: 2.5, borderRadius: 2,
  },
  content: {}, // Sin flex:1 — crítico para evitar scroll infinito
  progressWrap: {
    height: 4, borderRadius: 2,
    backgroundColor: 'rgba(124,58,237,0.1)',
    marginBottom: 12, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: 2,
    backgroundColor: '#7c3aed',
    width: WINDOW_W * 0.6,
  },
});