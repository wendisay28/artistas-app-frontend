// src/components/modals/SharePostModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SharePostModalProps {
  visible: boolean;
  onClose: () => void;
  post: any;
  onShare?: (postId: number, content?: string) => void;
  userAvatar?: string;
  userName?: string;
}

export const SharePostModal: React.FC<SharePostModalProps> = ({
  visible,
  onClose,
  post,
  onShare,
  userAvatar,
  userName = 'Usuario',
}) => {
  const [comment, setComment] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (isSharing) return;

    setIsSharing(true);
    try {
      await onShare?.(post?.id, comment.trim() || undefined);
      setComment('');
      onClose();
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  if (!post) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Compartir publicación</Text>
          <TouchableOpacity
            style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
            onPress={handleShare}
            disabled={isSharing}
          >
            <Text style={styles.shareButtonText}>
              {isSharing ? 'Compartiendo...' : 'Compartir'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {/* Your Comment */}
          <View style={styles.commentSection}>
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

            <View style={styles.commentInput}>
              <Text style={styles.userName}>{userName}</Text>
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Agrega un comentario (opcional)"
                placeholderTextColor="#9ca3af"
                multiline
                style={styles.textInput}
                maxLength={280}
              />
              {comment.length > 0 && (
                <Text
                  style={[
                    styles.charCount,
                    comment.length > 250 && styles.charCountWarning,
                  ]}
                >
                  {comment.length}/280
                </Text>
              )}
            </View>
          </View>

          {/* Original Post Preview */}
          <View style={styles.originalPost}>
            <View style={styles.originalPostHeader}>
              <View style={styles.originalAvatar}>
                {post.author?.avatar ? (
                  <Image
                    source={{ uri: post.author.avatar }}
                    style={styles.originalAvatarImage}
                  />
                ) : (
                  <View style={styles.originalAvatarPlaceholder}>
                    <Text style={styles.originalAvatarText}>
                      {post.author?.name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.originalPostInfo}>
                <Text style={styles.originalAuthorName}>
                  {post.author?.name || 'Usuario'}
                </Text>
                {post.author?.username && (
                  <Text style={styles.originalUsername}>
                    @{post.author.username}
                  </Text>
                )}
              </View>
            </View>

            {/* Content */}
            <Text style={styles.originalContent} numberOfLines={4}>
              {post.content}
            </Text>

            {/* Media Preview */}
            {post.media && post.media.length > 0 && (
              <Image
                source={{ uri: post.media[0].url }}
                style={styles.originalMedia}
                resizeMode="cover"
              />
            )}

            {/* Stats */}
            <View style={styles.originalStats}>
              <View style={styles.statItem}>
                <Ionicons name="heart-outline" size={14} color="#6b7280" />
                <Text style={styles.statText}>{post.likeCount || 0}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="chatbubble-outline" size={14} color="#6b7280" />
                <Text style={styles.statText}>{post.commentCount || 0}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="share-outline" size={14} color="#6b7280" />
                <Text style={styles.statText}>{post.shareCount || 0}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
  },
  shareButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#8b5cf6',
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  body: {
    flex: 1,
  },
  commentSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
  commentInput: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 15,
    color: '#111',
    lineHeight: 22,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 4,
  },
  charCountWarning: {
    color: '#f59e0b',
  },
  originalPost: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  originalPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  originalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9d5ff',
    overflow: 'hidden',
  },
  originalAvatarImage: {
    width: '100%',
    height: '100%',
  },
  originalAvatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  originalAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  originalPostInfo: {
    flex: 1,
  },
  originalAuthorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  originalUsername: {
    fontSize: 12,
    color: '#6b7280',
  },
  originalContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  originalMedia: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    marginBottom: 12,
  },
  originalStats: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
  },
});