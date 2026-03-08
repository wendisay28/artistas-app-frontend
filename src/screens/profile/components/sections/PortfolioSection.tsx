// src/components/profile/sections/PortfolioSection.tsx
// EnhancedGalleryGrid con botón de editar en GalleryModal
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, Pressable, Modal, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useModalStore } from '../../../../store/modalStore';
import * as Haptics from 'expo-haptics';
import { portfolioService, GalleryItem, FeaturedItem } from '../../../../services/api/portfolio';
import { storageService } from '../../../../services/api/storage';
import * as ImagePicker from 'expo-image-picker';
import { compressImage } from '../../../../hooks/useProfileImageUpload';
import GalleryModal from '../../../../components/explore/shared/GalleryModal';
import { EnhancedGalleryGrid } from '../../../../components/shared/profile/GalleryGrid';

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

  const handleEditImage = (index: number) => {
    const item = portfolio[index];
    if (!item) return;
    
    // Mostrar opciones de edición para la imagen
    Alert.alert(
      'Opciones de imagen',
      '¿Qué deseas hacer con esta imagen?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: item.isFeatured ? 'Quitar destacado' : 'Marcar como destacado',
          onPress: () => handleToggleFeatured(item),
        },
        {
          text: 'Eliminar imagen',
          style: 'destructive',
          onPress: () => handleDeletePhoto(item),
        },
      ]
    );
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

  return (
    <View style={styles.container}>
      {galleryOpen && galleryImages.length > 0 && (
        <GalleryModal
          images={galleryImages}
          initialIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
          isOwner={isOwner}
          onEdit={handleEditImage}
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

      {/* Content — sin flex:1, altura natural */}
      <View style={styles.content}>
        {activeTab === 'photos' && (
          hasPortfolio
            ? <EnhancedGalleryGrid
                items={portfolio}
                onItemPress={handleItemPress}
                showEdit={false} // No mostrar botón de editar en el grid
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
            ? <View style={{ padding: 16 }}>
                <Text style={{ textAlign: 'center', color: '#999' }}>Videos no disponibles temporalmente</Text>
              </View>
            : <EmptyState
                icon="videocam-outline"
                title="Sin videos todavía"
                subtitle="Comparte clips de tus presentaciones. Los clientes lo adorarán."
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
});
