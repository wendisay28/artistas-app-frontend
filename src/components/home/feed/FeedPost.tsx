// src/components/feed/FeedPost.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeedPostContent } from './FeedPostContent';
import { PostActions } from './PostActions';

interface FeedPostProps {
  post: any;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export const FeedPost: React.FC<FeedPostProps> = ({
  post,
  onLike,
  onComment,
  onShare,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now.getTime() - postDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Ahora';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return postDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const CategoryIcon = ({ category }: { category?: string }) => {
    if (!category) return null;
    return (
      <View style={[styles.categoryBadge, getCategoryColor(category)]}>
        <Text style={styles.categoryIcon}>✨</Text>
      </View>
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: any = {
      music: { backgroundColor: '#a855f7' },
      photography: { backgroundColor: '#3b82f6' },
      art: { backgroundColor: '#f97316' },
    };
    return colors[category] || { backgroundColor: '#8b5cf6' };
  };

  return (
    <View style={styles.container}>
      {/* Línea vertical del hilo */}
      <View style={styles.threadLine} />

      <View style={styles.postContainer}>
        {/* Header */}
        <View style={styles.header}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {post.author.avatar ? (
                <Image
                  source={{ uri: post.author.avatar }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {post.author.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <CategoryIcon category={post.author.category} />
          </View>

          {/* Info */}
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              {post.isPinned && (
                <View style={styles.pinnedBadge}>
                  <Ionicons name="pin" size={10} color="#fff" />
                  <Text style={styles.pinnedText}>Fijado</Text>
                </View>
              )}
            </View>
            <View style={styles.metaRow}>
              {post.author.username && (
                <Text style={styles.username}>@{post.author.username}</Text>
              )}
              <Text style={styles.dot}>·</Text>
              <Text style={styles.time}>{getTimeAgo(post.createdAt)}</Text>
            </View>
          </View>

          {/* Menu */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowMenu(!showMenu)}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#8b5cf6" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <FeedPostContent post={post} />
        </View>

        {/* Actions */}
        <PostActions
          post={post}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
        />
      </View>

      {/* Separador */}
      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  threadLine: {
    position: 'absolute',
    left: 34,
    top: 64,
    bottom: 0,
    width: 2,
    backgroundColor: '#e9d5ff',
  },
  postContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e9d5ff',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
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
  categoryIcon: {
    fontSize: 10,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
  },
  pinnedText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  username: {
    fontSize: 12,
    color: '#6b7280',
  },
  dot: {
    fontSize: 12,
    color: '#6b7280',
  },
  time: {
    fontSize: 12,
    color: '#6b7280',
  },
  menuButton: {
    padding: 6,
    borderRadius: 20,
  },
  content: {
    marginLeft: 60,
  },
  separator: {
    height: 1,
    backgroundColor: '#e9d5ff',
    marginHorizontal: 16,
  },
});