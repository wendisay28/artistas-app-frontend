// src/components/modals/CreatePostModal.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onPost?: (content: string, images: any[], metadata: PostMetadata) => void;
  userAvatar?: string;
  userName?: string;
}

interface PostMetadata {
  visibility: 'public' | 'friends' | 'private';
  category?: string;
  feeling?: string;
  location?: string;
}

const VISIBILITY_OPTIONS = [
  {
    id: 'public',
    icon: 'globe-outline' as const,
    label: 'Público',
    description: 'Cualquiera puede ver esta publicación',
  },
  {
    id: 'friends',
    icon: 'people-outline' as const,
    label: 'Seguidores',
    description: 'Solo tus seguidores pueden ver',
  },
  {
    id: 'private',
    icon: 'lock-closed-outline' as const,
    label: 'Solo yo',
    description: 'Solo tú puedes ver esta publicación',
  },
];

const CATEGORIES = [
  { id: 'music', label: 'Música', icon: 'musical-notes-outline' as const, colors: ['#a855f7', '#ec4899'] },
  { id: 'art', label: 'Arte Visual', icon: 'color-palette-outline' as const, colors: ['#f97316', '#ef4444'] },
  { id: 'photography', label: 'Fotografía', icon: 'camera-outline' as const, colors: ['#3b82f6', '#06b6d4'] },
  { id: 'writing', label: 'Escritura', icon: 'pencil-outline' as const, colors: ['#10b981', '#059669'] },
  { id: 'performance', label: 'Performance', icon: 'sparkles-outline' as const, colors: ['#f59e0b', '#f97316'] },
];

const FEELINGS = [
  '😊 feliz', '😍 enamorado/a', '😎 genial', '🤗 agradecido/a',
  '😢 triste', '😴 cansado/a', '🎉 celebrando', '💪 motivado/a',
  '😌 inspirado/a', '🤩 emocionado/a', '🎨 creativo/a', '🎵 musical'
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onClose,
  onPost,
  userAvatar,
  userName = 'Usuario',
}) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [feeling, setFeeling] = useState('');
  const [location, setLocation] = useState('');
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);

  const selectedVisibility = VISIBILITY_OPTIONS.find(v => v.id === visibility);
  const selectedCategory = CATEGORIES.find(c => c.id === category);
  const visibilityIconName = selectedVisibility?.icon || 'globe-outline';

  const handleSubmit = () => {
    if (!content.trim() && images.length === 0) return;

    const metadata: PostMetadata = {
      visibility,
      category,
      feeling,
      location,
    };

    onPost?.(content, images, metadata);
    handleClose();
  };

  const handleClose = () => {
    setContent('');
    setImages([]);
    setVisibility('public');
    setCategory(undefined);
    setFeeling('');
    setLocation('');
    setShowFeelingPicker(false);
    setShowLocationInput(false);
    onClose();
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const canPost = content.trim().length > 0 || images.length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Crear publicación</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Body */}
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {userAvatar ? (
                  <Image source={{ uri: userAvatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>
                      {userName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              {selectedCategory && (
                <View style={[styles.categoryBadge, { backgroundColor: selectedCategory.colors[0] }]}>
                  <Ionicons name={selectedCategory.icon} size={12} color="#fff" />
                </View>
              )}
            </View>

            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userName}</Text>
              <View style={styles.metaRow}>
                {/* Visibility Selector */}
                <TouchableOpacity
                  style={styles.selector}
                  onPress={() => {
                    setShowVisibilityMenu(!showVisibilityMenu);
                    setShowCategoryMenu(false);
                  }}
                >
                  <Ionicons name={visibilityIconName} size={14} color="#374151" />
                  <Text style={styles.selectorText}>{selectedVisibility?.label}</Text>
                  <Ionicons name="chevron-down" size={12} color="#6b7280" />
                </TouchableOpacity>

                {/* Category Selector */}
                <TouchableOpacity
                  style={styles.selector}
                  onPress={() => {
                    setShowCategoryMenu(!showCategoryMenu);
                    setShowVisibilityMenu(false);
                  }}
                >
                  {selectedCategory ? (
                    <Ionicons name={selectedCategory.icon} size={14} color="#374151" />
                  ) : (
                    <Ionicons name="sparkles-outline" size={14} color="#374151" />
                  )}
                  <Text style={styles.selectorText}>
                    {selectedCategory?.label || 'Categoría'}
                  </Text>
                  <Ionicons name="chevron-down" size={12} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Visibility Menu */}
          {showVisibilityMenu && (
            <View style={styles.dropdown}>
              <Text style={styles.dropdownTitle}>¿Quién puede ver esto?</Text>
              {VISIBILITY_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.dropdownItem,
                      visibility === option.id && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setVisibility(option.id as any);
                      setShowVisibilityMenu(false);
                    }}
                  >
                    <View style={styles.dropdownIcon}>
                      <Ionicons name={option.icon} size={20} color="#374151" />
                    </View>
                    <View style={styles.dropdownContent}>
                      <Text style={styles.dropdownLabel}>{option.label}</Text>
                      <Text style={styles.dropdownDescription}>{option.description}</Text>
                    </View>
                    {visibility === option.id && (
                      <View style={styles.checkmark}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Category Menu */}
          {showCategoryMenu && (
            <View style={styles.dropdown}>
              <Text style={styles.dropdownTitle}>Tipo de contenido</Text>
              {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.dropdownItem,
                      category === cat.id && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setCategory(cat.id);
                      setShowCategoryMenu(false);
                    }}
                  >
                    <View style={[styles.dropdownIcon, { backgroundColor: cat.colors[0] }]}>
                      <Ionicons name={cat.icon} size={20} color="#fff" />
                    </View>
                    <Text style={styles.dropdownLabel}>{cat.label}</Text>
                    {category === cat.id && (
                      <View style={styles.checkmark}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Tags Display */}
          {(feeling || location) && (
            <View style={styles.tagsContainer}>
              {feeling && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{feeling}</Text>
                  <TouchableOpacity onPress={() => setFeeling('')}>
                    <Ionicons name="close" size={14} color="#d97706" />
                  </TouchableOpacity>
                </View>
              )}
              {location && (
                <View style={[styles.tag, styles.locationTag]}>
                  <Ionicons name="location-outline" size={14} color="#dc2626" />
                  <Text style={[styles.tagText, styles.locationTagText]}>{location}</Text>
                  <TouchableOpacity onPress={() => setLocation('')}>
                    <Ionicons name="close" size={14} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Text Input */}
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder={`¿Qué estás pensando, ${userName}?`}
            placeholderTextColor="#9ca3af"
            multiline
            style={styles.textInput}
            maxLength={500}
          />

          {/* Image Previews */}
          {images.length > 0 && (
            <View style={styles.imagesContainer}>
              {images.map((img, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image source={{ uri: img.uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Feeling Picker */}
          {showFeelingPicker && (
            <View style={styles.feelingPicker}>
              <View style={styles.feelingHeader}>
                <Text style={styles.feelingTitle}>¿Cómo te sientes?</Text>
                <TouchableOpacity onPress={() => setShowFeelingPicker(false)}>
                  <Ionicons name="close" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <View style={styles.feelingGrid}>
                {FEELINGS.map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[
                      styles.feelingButton,
                      feeling === f && styles.feelingButtonActive,
                    ]}
                    onPress={() => {
                      setFeeling(f);
                      setShowFeelingPicker(false);
                    }}
                  >
                    <Text style={styles.feelingText}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Location Input */}
          {showLocationInput && (
            <View style={styles.locationInput}>
              <View style={styles.locationHeader}>
                <Text style={styles.locationTitle}>Agregar ubicación</Text>
                <TouchableOpacity onPress={() => setShowLocationInput(false)}>
                  <Ionicons name="close" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <View style={styles.locationRow}>
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="¿Dónde estás?"
                  placeholderTextColor="#9ca3af"
                  style={styles.locationTextInput}
                  maxLength={100}
                />
                <TouchableOpacity
                  style={[
                    styles.addLocationButton,
                    !location.trim() && styles.addLocationButtonDisabled,
                  ]}
                  onPress={() => {
                    if (location.trim()) {
                      setShowLocationInput(false);
                    }
                  }}
                  disabled={!location.trim()}
                >
                  <Text style={styles.addLocationText}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="image-outline" size={24} color="#10b981" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setShowFeelingPicker(!showFeelingPicker);
                setShowLocationInput(false);
              }}
            >
              <Ionicons name="happy-outline" size={24} color="#f59e0b" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setShowLocationInput(!showLocationInput);
                setShowFeelingPicker(false);
              }}
            >
              <Ionicons name="location-outline" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.charCount,
              content.length > 450 && styles.charCountWarning,
              content.length > 480 && styles.charCountDanger,
            ]}
          >
            {content.length}/500
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.postButton, !canPost && styles.postButtonDisabled]}
          onPress={handleSubmit}
          disabled={!canPost}
        >
          <Text style={styles.postButtonText}>Publicar</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
    borderRadius: 20,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userInfo: {
    flexDirection: 'row',
    paddingVertical: 16,
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e9d5ff',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  selectorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  dropdown: {
    marginVertical: 8,
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dropdownTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
  },
  dropdownItemActive: {
    backgroundColor: '#f3f4f6',
  },
  dropdownIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContent: {
    flex: 1,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  dropdownDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  tagText: {
    fontSize: 13,
    color: '#92400e',
  },
  locationTag: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
  },
  locationTagText: {
    color: '#991b1b',
  },
  textInput: {
    fontSize: 17,
    color: '#111',
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  imagePreview: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feelingPicker: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  feelingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  feelingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  feelingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  feelingButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'transparent',
    width: '48%',
  },
  feelingButtonActive: {
    backgroundColor: '#fef3c7',
    borderColor: '#fbbf24',
  },
  feelingText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  locationInput: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  locationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  locationTextInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 14,
    color: '#111',
  },
  addLocationButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#ef4444',
  },
  addLocationButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  addLocationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    padding: 12,
    borderRadius: 12,
  },
  charCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  charCountWarning: {
    color: '#f59e0b',
  },
  charCountDanger: {
    color: '#ef4444',
  },
  postButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});