// src/components/comments/CommentInput.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CommentInputProps {
  postId: number;
  replyingTo?: { id: number; name: string } | null;
  onCancelReply?: () => void;
  onSubmit: (data: CommentData) => Promise<void>;
  userAvatar?: string;
  userName?: string;
}

export interface CommentData {
  content: string;
  parentId?: number;
  images?: any[];
  mentions?: string[];
}

export const CommentInput: React.FC<CommentInputProps> = ({
  postId,
  replyingTo,
  onCancelReply,
  onSubmit,
  userAvatar,
  userName = 'Usuario',
}) => {
  const [commentText, setCommentText] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    if (!commentText.trim() && images.length === 0) return;
    if (submitting) return;

    try {
      setSubmitting(true);

      const data: CommentData = {
        content: commentText.trim(),
        parentId: replyingTo?.id,
        images: images.length > 0 ? images : undefined,
      };

      await onSubmit(data);

      // Reset form
      setCommentText('');
      setImages([]);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        {/* Reply indicator */}
        {replyingTo && (
          <View style={styles.replyIndicator}>
            <Text style={styles.replyText}>
              Respondiendo a <Text style={styles.replyName}>@{replyingTo.name}</Text>
            </Text>
            <TouchableOpacity onPress={onCancelReply}>
              <Ionicons name="close" size={16} color="#8b5cf6" />
            </TouchableOpacity>
          </View>
        )}

        {/* Image Previews */}
        {images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imagesPreview}
            contentContainerStyle={styles.imagesContent}
          >
            {images.map((image, index) => (
              <View key={index} style={styles.imagePreview}>
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Input Row */}
        <View style={styles.inputRow}>
          {/* Avatar */}
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

          {/* Input Container */}
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              value={commentText}
              onChangeText={setCommentText}
              placeholder={replyingTo ? 'Escribe tu respuesta...' : 'Agregar un comentario...'}
              placeholderTextColor="#9ca3af"
              multiline
              style={styles.input}
              maxLength={500}
            />

            {/* Actions */}
            <View style={styles.actions}>
              <View style={styles.leftActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="image-outline" size={20} color="#8b5cf6" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="at" size={20} color="#8b5cf6" />
                </TouchableOpacity>
                {commentText.length > 0 && (
                  <Text style={styles.charCount}>{commentText.length}/500</Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!commentText.trim() && images.length === 0) && styles.sendButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={(!commentText.trim() && images.length === 0) || submitting}
              >
                {submitting ? (
                  <Text style={styles.sendButtonText}>...</Text>
                ) : (
                  <Ionicons name="send" size={18} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  replyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f3ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9d5ff',
  },
  replyText: {
    fontSize: 13,
    color: '#6b7280',
  },
  replyName: {
    fontWeight: '600',
    color: '#8b5cf6',
  },
  imagesPreview: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  imagesContent: {
    gap: 8,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9d5ff',
    overflow: 'hidden',
    marginTop: 4,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    fontSize: 15,
    color: '#111',
    lineHeight: 22,
    minHeight: 44,
    maxHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
  },
  charCount: {
    fontSize: 11,
    color: '#9ca3af',
    marginLeft: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});