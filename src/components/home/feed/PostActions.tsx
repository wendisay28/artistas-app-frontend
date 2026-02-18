// src/components/feed/PostActions.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PostActionsProps {
  post: any;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  post,
  onLike,
  onComment,
  onShare,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isInspired, setIsInspired] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  const handleInspiration = () => {
    setIsInspired(!isInspired);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftActions}>
        {/* Like */}
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={18}
            color={isLiked ? '#ec4899' : '#6b7280'}
          />
          {post.likeCount > 0 && (
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {post.likeCount}
            </Text>
          )}
        </TouchableOpacity>

        {/* Comment */}
        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <Ionicons name="chatbubble-outline" size={18} color="#6b7280" />
          {post.commentCount > 0 && (
            <Text style={styles.actionText}>{post.commentCount}</Text>
          )}
        </TouchableOpacity>

        {/* Inspiration */}
        <TouchableOpacity style={styles.actionButton} onPress={handleInspiration}>
          <Ionicons
            name={isInspired ? 'sparkles' : 'sparkles-outline'}
            size={18}
            color={isInspired ? '#8b5cf6' : '#6b7280'}
          />
          {post.inspirationCount > 0 && (
            <Text style={[styles.actionText, isInspired && styles.inspiredText]}>
              {post.inspirationCount}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.rightActions}>
        {/* Bookmark */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bookmark-outline" size={18} color="#6b7280" />
          {post.saveCount > 0 && (
            <Text style={styles.actionText}>{post.saveCount}</Text>
          )}
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Ionicons name="share-outline" size={18} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 60,
    paddingTop: 4,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 8,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  likedText: {
    color: '#ec4899',
  },
  inspiredText: {
    color: '#8b5cf6',
  },
});