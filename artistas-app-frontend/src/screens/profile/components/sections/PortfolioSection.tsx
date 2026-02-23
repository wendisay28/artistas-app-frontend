// src/components/profile/sections/PortfolioSection.tsx
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, Platform, Alert, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Radius, Spacing } from '../../../../theme';
import { portfolioService, GalleryItem, FeaturedItem } from '../../../../services/api/portfolio';
import { storageService } from '../../../../services/api/storage';
import * as ImagePicker from 'expo-image-picker';

interface PortfolioSectionProps {
  portfolio: GalleryItem[];
  videos: FeaturedItem[];
  isOwner: boolean;
  onPortfolioUpdated?: () => void;
}

// ── Empty State ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle }) => (
  <View style={es.container}>
    <View style={[es.iconWrap, { opacity: 0.4 }]}>
      <Ionicons name={icon} size={32} color={Colors.primary} />
    </View>
    <Text style={es.title}>{title}</Text>
    <Text style={es.subtitle}>{subtitle}</Text>
  </View>
);

const es = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 36, gap: 8 },
  iconWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(99,102,241,0.06)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  title: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: Colors.text },
  subtitle: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary, textAlign: 'center', lineHeight: 18, paddingHorizontal: 16,
  },
});

// ── Gallery Grid ─────────────────────────────────────────────────────────────

interface GalleryGridProps {
  items: GalleryItem[];
  onItemPress?: (item: GalleryItem) => void;
  showEdit?: boolean;
  onEdit?: (item: GalleryItem) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ items, onItemPress, showEdit, onEdit }) => {
  const renderGalleryItem = ({ item }: { item: GalleryItem }) => (
    <TouchableOpacity
      style={g.gridItem}
      onPress={() => onItemPress?.(item)}
      activeOpacity={0.8}
    >
      {/* Edit button */}
      {showEdit && (
        <TouchableOpacity 
          style={g.editButton} 
          onPress={() => onEdit?.(item)}
        >
          <Ionicons name="pencil" size={12} color={Colors.primary} />
        </TouchableOpacity>
      )}
      
      {/* Image placeholder */}
      <View style={g.imagePlaceholder}>
        <Ionicons name="image" size={24} color={Colors.text} />
      </View>
      
      {/* Title */}
      {item.title && (
        <Text style={g.itemTitle} numberOfLines={1}>{item.title}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderGalleryItem}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      numColumns={2}
      style={g.grid}
      columnWrapperStyle={g.row}
      showsVerticalScrollIndicator={false}
    />
  );
};

const g = StyleSheet.create({
  grid: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(99,102,241,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
  },
  itemTitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.text,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

// ── Video Modal ───────────────────────────────────────────────────────────────

interface VideoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (video: Partial<FeaturedItem>) => Promise<void>;
  video?: FeaturedItem | null;
  isLoading?: boolean;
}

const VideoModal: React.FC<VideoModalProps> = ({
  visible,
  onClose,
  onSave,
  video,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    type: 'youtube' as 'youtube' | 'vimeo' | 'soundcloud' | 'other',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (video) {
      setFormData({
        url: video.url || '',
        title: video.title || '',
        description: video.description || '',
        type: (video.type as 'youtube' | 'vimeo' | 'soundcloud' | 'other') || 'youtube',
      });
    } else {
      setFormData({
        url: '',
        title: '',
        description: '',
        type: 'youtube',
      });
    }
    setErrors({});
  }, [video, visible]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.url.trim()) {
      newErrors.url = 'La URL es requerida';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onSave({
        url: formData.url.trim(),
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
      });
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el video. Inténtalo de nuevo.');
    }
  };

  return (
    <View style={[vm.overlay, visible && vm.overlayVisible]}>
      <View style={[vm.modal, visible && vm.modalVisible]}>
        {/* Header */}
        <View style={vm.header}>
          <TouchableOpacity onPress={onClose} style={vm.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={vm.title}>
            {video ? 'Editar video' : 'Agregar video'}
          </Text>
          <TouchableOpacity 
            onPress={handleSave} 
            style={[vm.saveButton, isLoading && vm.saveButtonDisabled]}
            disabled={isLoading}
          >
            <Text style={vm.saveButtonText}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={vm.content}>
          {/* URL */}
          <View style={vm.field}>
            <Text style={vm.label}>URL del video *</Text>
            <TextInput
              style={[vm.input, errors.url && vm.inputError]}
              value={formData.url}
              onChangeText={(text) => setFormData({ ...formData, url: text })}
              placeholder="https://youtube.com/watch?v=..."
              placeholderTextColor={Colors.text}
              autoCapitalize="none"
              keyboardType="url"
            />
            {errors.url && <Text style={vm.errorText}>{errors.url}</Text>}
          </View>

          {/* Título */}
          <View style={vm.field}>
            <Text style={vm.label}>Título *</Text>
            <TextInput
              style={[vm.input, errors.title && vm.inputError]}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Mi video destacado"
              placeholderTextColor={Colors.text}
            />
            {errors.title && <Text style={vm.errorText}>{errors.title}</Text>}
          </View>

          {/* Descripción */}
          <View style={vm.field}>
            <Text style={vm.label}>Descripción</Text>
            <TextInput
              style={[vm.input, vm.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Describe tu video..."
              placeholderTextColor={Colors.text}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Tipo */}
          <View style={vm.field}>
            <Text style={vm.label}>Tipo</Text>
            <View style={vm.typeButtons}>
              {(['youtube', 'vimeo', 'soundcloud', 'other'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    vm.typeButton,
                    formData.type === type && vm.typeButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, type })}
                >
                  <Text style={[
                    vm.typeButtonText,
                    formData.type === type && vm.typeButtonTextActive,
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const vm = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    opacity: 0,
    zIndex: 1000,
  },
  overlayVisible: {
    opacity: 1,
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    transform: [{ translateY: '100%' }],
  },
  modalVisible: {
    transform: [{ translateY: 0 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.text3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  field: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  textArea: {
    height: 100,
    paddingTop: Spacing.sm,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    fontFamily: 'PlusJakartaSans_400Regular',
    marginTop: Spacing.xs,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeButtonText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.text,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
});

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  portfolio,
  videos,
  isOwner,
  onPortfolioUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [editingVideo, setEditingVideo] = useState<FeaturedItem | null>(null);
  const [isSavingVideo, setIsSavingVideo] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const hasPortfolio = portfolio && portfolio.length > 0;
  const hasVideos = videos && videos.length > 0;

  const handleAddImage = async () => {
    try {
      setIsUploadingImage(true);
      
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tu galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        
        const response = await storageService.uploadImage(asset, 'portfolio');
        
        await portfolioService.addPhoto({
          imageUrl: response.imageUrl,
          title: 'Nueva foto',
          description: '',
          tags: [],
          isPublic: true,
        });

        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        Alert.alert('Éxito', 'Imagen agregada a tu portafolio');
        
        if (onPortfolioUpdated) {
          onPortfolioUpdated();
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'No se pudo subir la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddVideo = () => {
    setEditingVideo(null);
    setVideoModalVisible(true);
  };

  const handleEditVideo = (video: FeaturedItem) => {
    setEditingVideo(video);
    setVideoModalVisible(true);
  };

  const handleSaveVideo = async (videoData: Partial<FeaturedItem>) => {
    setIsSavingVideo(true);
    try {
      if (editingVideo && editingVideo.id) {
        await portfolioService.updateVideo(Number(editingVideo.id), videoData);
      } else {
        // Asegurarnos de que los campos requeridos estén presentes
        const createData = {
          url: videoData.url || '',
          title: videoData.title || '',
          description: videoData.description,
          type: videoData.type || 'youtube',
        };
        await portfolioService.addVideo(createData);
      }
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      if (onPortfolioUpdated) {
        onPortfolioUpdated();
      }
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.hint}>
          {hasPortfolio ? 'Toca una imagen para verla en detalle' : 'Comparte tus mejores trabajos'}
        </Text>
        {isOwner && (
          <View style={styles.buttons}>
            <TouchableOpacity 
              style={styles.button}
              onPress={handleAddImage}
              disabled={isUploadingImage}
            >
              <Ionicons name="image" size={14} color="#fff" />
              <Text style={styles.buttonText}>
                {isUploadingImage ? 'Subiendo...' : 'Imagen'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.button}
              onPress={handleAddVideo}
            >
              <Ionicons name="videocam" size={14} color="#fff" />
              <Text style={styles.buttonText}>Video</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'photos' && styles.tabActive]}
          onPress={() => setActiveTab('photos')}
        >
          <Ionicons
            name="images-outline"
            size={16}
            color={activeTab === 'photos' ? Colors.primary : Colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'photos' && styles.tabTextActive]}>
            Fotos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'videos' && styles.tabActive]}
          onPress={() => setActiveTab('videos')}
        >
          <Ionicons
            name="videocam-outline"
            size={16}
            color={activeTab === 'videos' ? Colors.primary : Colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'videos' && styles.tabTextActive]}>
            Videos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'photos' && (
          hasPortfolio ? (
            <GalleryGrid 
              items={portfolio} 
              showEdit={isOwner}
              onEdit={isOwner ? (item) => {
                // TODO: Implementar edición de foto
                console.log('Edit photo:', item);
              } : undefined}
            />
          ) : (
            <EmptyState
              icon="images-outline"
              title="Sin portafolio aún"
              subtitle="No has subido fotos todavía. Comparte tus mejores trabajos aquí."
            />
          )
        )}

        {activeTab === 'videos' && (
          hasVideos ? (
            <FlatList
              data={videos}
              renderItem={({ item }) => (
                <View style={styles.videoItem}>
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle}>{item.title}</Text>
                    <Text style={styles.videoUrl} numberOfLines={1}>{item.url}</Text>
                  </View>
                  {isOwner && (
                    <TouchableOpacity 
                      style={styles.videoEditButton}
                      onPress={() => handleEditVideo(item)}
                    >
                      <Ionicons name="pencil" size={14} color={Colors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              style={styles.videosList}
            />
          ) : (
            <EmptyState
              icon="videocam-outline"
              title="Sin videos aún"
              subtitle="No has agregado videos todavía. Comparte tu contenido audiovisual aquí."
            />
          )
        )}
      </View>

      {/* Video Modal */}
      <VideoModal
        visible={videoModalVisible}
        onClose={() => setVideoModalVisible(false)}
        onSave={handleSaveVideo}
        video={editingVideo}
        isLoading={isSavingVideo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  hint: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    fontStyle: 'italic',
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  buttonText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 13,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  videosList: {
    flex: 1,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  videoUrl: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  videoEditButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(99,102,241,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
