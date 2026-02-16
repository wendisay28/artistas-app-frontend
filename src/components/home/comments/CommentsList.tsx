// src/components/comments/CommentsList.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { postService } from '../services/post.service';

interface Comment {
  id: number;
  content: string;
  author: {
    id: string;
    name: string;
    username?: string;
    avatar?: string;
  };
  likeCount: number;
  replyCount: number;
  isLiked?: boolean;
  createdAt: string;
  parentId?: number;
  replies?: Comment[];
}

interface CommentsListProps {
  postId: number;
  onReply?: (comment: Comment) => void;
  currentUserId?: string;
}

export const CommentsList: React.FC<CommentsListProps> = ({
  postId,
  onReply,
  currentUserId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async (pageNum: number = 1) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await postService.getComments(postId, pageNum, 20);
      
      if (pageNum === 1) {
        setComments(response.data || []);
      } else {
        setComments(prev => [...prev, ...(response.data || [])]);
      }

      setHasMore(response.pagination?.hasMore || false);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadComments(page + 1);
    }
  };

  const handleLike = async (commentId: number, isLiked: boolean) => {
    // Optimistic update
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !isLiked,
              likeCount: isLiked ? comment.likeCount - 1 : comment.likeCount + 1,
            }
          : comment
      )
    );

    try {
      // Call your API to like/unlike comment
      // await commentService.likeComment(commentId);
    } catch (error) {
      // Revert on error
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                isLiked: isLiked,
                likeCount: isLiked ? comment.likeCount + 1 : comment.likeCount - 1,
              }
            : comment
        )
      );
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await postService.deleteComment(postId, commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diff = now.getTime() - commentDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Ahora';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return commentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const renderComment = ({ item }: { item: Comment }) => {
    const isOwnComment = currentUserId === item.author.id;

    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentHeader}>
          {/* Avatar */}
          <View style={styles.avatar}>
            {item.author.avatar ? (
              <Image source={{ uri: item.author.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {item.author.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          {/* Content */}
          <View style={styles.commentContent}>
            <View style={styles.commentBubble}>
              <View style={styles.commentInfo}>
                <Text style={styles.authorName}>{item.author.name}</Text>
                <Text style={styles.timeAgo}>{getTimeAgo(item.createdAt)}</Text>
              </View>
              <Text style={styles.commentText}>{item.content}</Text>
            </View>

            {/* Actions */}
            <View style={styles.commentActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLike(item.id, !!item.isLiked)}
              >
                <Ionicons
                  name={item.isLiked ? 'heart' : 'heart-outline'}
                  size={14}
                  color={item.isLiked ? '#ec4899' : '#6b7280'}
                />
                {item.likeCount > 0 && (
                  <Text style={[styles.actionText, item.isLiked && styles.actionTextLiked]}>
                    {item.likeCount}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onReply?.(item)}
              >
                <Ionicons name="chatbubble-outline" size={14} color="#6b7280" />
                <Text style={styles.actionText}>Responder</Text>
              </TouchableOpacity>

              {isOwnComment && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Ionicons name="trash-outline" size={14} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>

            {/* Replies count */}
            {item.replyCount > 0 && (
              <TouchableOpacity style={styles.repliesButton}>
                <Text style={styles.repliesText}>
                  Ver {item.replyCount} {item.replyCount === 1 ? 'respuesta' : 'respuestas'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Nested replies */}
        {item.replies && item.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {item.replies.map(reply => (
              <View key={reply.id} style={styles.replyItem}>
                {renderComment({ item: reply })}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  if (comments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="chatbubble-outline" size={48} color="#d1d5db" />
        <Text style={styles.emptyTitle}>Sin comentarios aún</Text>
        <Text style={styles.emptyText}>Sé el primero en comentar</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={comments}
      renderItem={renderComment}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.loadingMore}>
            <ActivityIndicator size="small" color="#8b5cf6" />
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 8,
  },
  commentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 12,
  },
  commentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  timeAgo: {
    fontSize: 12,
    color: '#6b7280',
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
    marginLeft: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  actionTextLiked: {
    color: '#ec4899',
  },
  repliesButton: {
    marginTop: 8,
    marginLeft: 12,
  },
  repliesText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  repliesContainer: {
    marginLeft: 48,
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#e5e7eb',
    paddingLeft: 12,
  },
  replyItem: {
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});