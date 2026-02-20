// src/components/feed/FeedPostContent.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeedPostContentProps {
  post: any;
}

const { width } = Dimensions.get('window');
const MAX_CONTENT_LENGTH = 280;

export const FeedPostContent: React.FC<FeedPostContentProps> = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsExpansion = post.content?.length > MAX_CONTENT_LENGTH;

  // Quote Post
  if (post.type === 'nota' && post.metadata?.postSubtype === 'quote') {
    return (
      <View style={styles.quoteContainer}>
        <View style={styles.quoteGradient}>
          {/* Decorative elements */}
          <Text style={styles.quoteMarkTop}>"</Text>
          <Text style={styles.quoteMarkBottom}>"</Text>

          {/* Content */}
          <View style={styles.quoteContent}>
            <Text style={styles.quoteText}>
              "{post.metadata.quoteText || post.content}"
            </Text>
            
            {post.metadata.quoteAuthor && (
              <View style={styles.quoteAuthorContainer}>
                <View style={styles.quoteDivider} />
                <Text style={styles.sparkle}>✨</Text>
                <View style={styles.quoteDivider} />
                <Text style={styles.quoteAuthor}>
                  — {post.metadata.quoteAuthor}
                </Text>
              </View>
            )}
          </View>

          {/* Badge */}
          <View style={styles.quoteBadge}>
            <Ionicons name="chatbox-ellipses-outline" size={14} color="#fff" />
            <Text style={styles.quoteBadgeText}>Cita Inspiradora</Text>
          </View>
        </View>
      </View>
    );
  }

  // Blog Post
  if (post.type === 'blog') {
    return (
      <View style={styles.blogContainer}>
        {/* Featured Image */}
        {post.featuredImage && (
          <Image
            source={{ uri: post.featuredImage }}
            style={styles.blogImage}
            resizeMode="cover"
          />
        )}

        {/* Content */}
        <View style={styles.blogContent}>
          <View style={styles.blogBadge}>
            <Ionicons name="document-text-outline" size={12} color="#fff" />
            <Text style={styles.blogBadgeText}>Blog</Text>
          </View>

          <Text style={styles.blogTitle} numberOfLines={2}>
            {post.title}
          </Text>

          {post.subtitle && (
            <Text style={styles.blogSubtitle} numberOfLines={1}>
              {post.subtitle}
            </Text>
          )}

          <Text style={styles.blogExcerpt} numberOfLines={3}>
            {post.excerpt || post.content}
          </Text>

          {/* Meta */}
          <View style={styles.blogMeta}>
            {post.readingTime && (
              <View style={styles.blogMetaItem}>
                <Ionicons name="time-outline" size={12} color="#6b7280" />
                <Text style={styles.blogMetaText}>
                  {post.readingTime} min lectura
                </Text>
              </View>
            )}
            {post.tags?.length > 0 && (
              <View style={styles.blogMetaItem}>
                <Ionicons name="pricetag-outline" size={12} color="#6b7280" />
                <Text style={styles.blogMetaText}>
                  {post.tags.slice(0, 2).join(', ')}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Leer más →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Regular Post
  return (
    <View style={styles.regularContainer}>
      {/* Text Content */}
      <Text style={styles.contentText}>
        {isExpanded || !needsExpansion
          ? post.content
          : `${post.content.slice(0, MAX_CONTENT_LENGTH)}...`}
      </Text>
      
      {needsExpansion && (
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={styles.expandButton}>
            {isExpanded ? 'Ver menos' : 'Ver más'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <View style={styles.mediaContainer}>
          {post.media.length === 1 ? (
            <View style={styles.singleMedia}>
              {post.media[0].type === 'video' ? (
                <View style={styles.videoContainer}>
                  <Image
                    source={{ uri: post.media[0].url }}
                    style={styles.mediaImage}
                  />
                  <View style={styles.playButton}>
                    <Ionicons name="play" size={32} color="#8b5cf6" />
                  </View>
                </View>
              ) : (
                <Image
                  source={{ uri: post.media[0].url }}
                  style={styles.mediaImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : post.media.length === 2 ? (
            <View style={styles.twoMediaGrid}>
              {post.media.map((media: any, index: number) => (
                <Image
                  key={index}
                  source={{ uri: media.url }}
                  style={styles.twoMediaImage}
                  resizeMode="cover"
                />
              ))}
            </View>
          ) : (
            <View style={styles.multiMediaGrid}>
              <Image
                source={{ uri: post.media[0].url }}
                style={styles.mainGridImage}
                resizeMode="cover"
              />
              <View style={styles.sideGridImages}>
                <Image
                  source={{ uri: post.media[1].url }}
                  style={styles.sideGridImage}
                  resizeMode="cover"
                />
                <View style={styles.lastGridImage}>
                  <Image
                    source={{ uri: post.media[2].url }}
                    style={styles.sideGridImage}
                    resizeMode="cover"
                  />
                  {post.media.length > 3 && (
                    <View style={styles.moreOverlay}>
                      <Text style={styles.moreText}>+{post.media.length - 3}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Quote Styles
  quoteContainer: {
    marginBottom: 12,
  },
  quoteGradient: {
    minHeight: 300,
    borderRadius: 24,
    backgroundColor: '#8b5cf6',
    overflow: 'hidden',
    position: 'relative',
    padding: 32,
    justifyContent: 'center',
  },
  quoteMarkTop: {
    position: 'absolute',
    top: 16,
    left: 16,
    fontSize: 60,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: 'bold',
  },
  quoteMarkBottom: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    fontSize: 60,
    color: 'rgba(255,255,255,0.2)',
    fontWeight: 'bold',
    transform: [{ rotate: '180deg' }],
  },
  quoteContent: {
    alignItems: 'center',
    gap: 24,
  },
  quoteText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
  },
  quoteAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quoteDivider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  sparkle: {
    fontSize: 16,
  },
  quoteAuthor: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  quoteBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  quoteBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Blog Styles
  blogContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
    overflow: 'hidden',
    marginBottom: 12,
  },
  blogImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f3f4f6',
  },
  blogContent: {
    padding: 16,
    backgroundColor: '#eff6ff',
  },
  blogBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  blogBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  blogSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  blogExcerpt: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  blogMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#dbeafe',
  },
  blogMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  blogMetaText: {
    fontSize: 11,
    color: '#6b7280',
  },
  readMoreButton: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#dbeafe',
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
  },

  // Regular Post Styles
  regularContainer: {
    marginBottom: 12,
  },
  contentText: {
    fontSize: 15,
    color: '#111',
    lineHeight: 22,
    marginBottom: 12,
  },
  expandButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8b5cf6',
    marginTop: 4,
  },
  mediaContainer: {
    marginTop: 12,
  },
  singleMedia: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  mediaImage: {
    width: '100%',
    height: 300,
  },
  videoContainer: {
    position: 'relative',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  twoMediaGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  twoMediaImage: {
    flex: 1,
    height: 240,
    borderRadius: 16,
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  multiMediaGrid: {
    flexDirection: 'row',
    gap: 8,
    height: 300,
  },
  mainGridImage: {
    flex: 2,
    borderRadius: 16,
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  sideGridImages: {
    flex: 1,
    gap: 8,
  },
  sideGridImage: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  lastGridImage: {
    flex: 1,
    position: 'relative',
  },
  moreOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
});