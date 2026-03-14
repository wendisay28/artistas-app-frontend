// src/screens/home/components/FeedPost.tsx
// Post de hilo adaptado del diseño web — thread line + avatar badge + acciones

import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, Dimensions,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FeedPost as FeedPostType } from '../data/feedData';
import { postsService } from '../../../services/api/posts';

const { width } = Dimensions.get('window');
const IMG_W = width - 32 - 48 - 12; // ancho disponible después del avatar+gap

// Colores por categoría — misma paleta que ARTIST_CATEGORIES
const CAT_COLORS: Record<string, [string, string]> = {
  'artes-visuales':  ['#db2777', '#7c3aed'],
  'artes-escenicas': ['#7c3aed', '#2563eb'],
  'musica':          ['#0891b2', '#7c3aed'],
  'audiovisual':     ['#1e40af', '#0891b2'],
  'diseno':          ['#7c3aed', '#db2777'],
  'comunicacion':    ['#059669', '#0891b2'],
  'cultura-turismo': ['#f59e0b', '#ef4444'],
};

const CAT_ICONS: Record<string, string> = {
  'artes-visuales':  'color-palette',
  'artes-escenicas': 'body',
  'musica':          'musical-notes',
  'audiovisual':     'film',
  'diseno':          'brush',
  'comunicacion':    'megaphone',
  'cultura-turismo': 'earth',
};

// ── Imagen(es) del post ───────────────────────────────────────────────────────

const PostImages: React.FC<{ images: string[] }> = ({ images }) => {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <Image
        source={{ uri: images[0] }}
        style={st.imgSingle}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={st.imgGrid}>
      {images.slice(0, 2).map((uri, i) => (
        <Image key={i} source={{ uri }} style={st.imgHalf} resizeMode="cover" />
      ))}
    </View>
  );
};

// ── FeedPost ──────────────────────────────────────────────────────────────────

interface Props {
  post: FeedPostType;
  isLast?: boolean;
  isDark?: boolean;
  onOpenDetail?: (post: FeedPostType) => void;
  onOpenImages?: (post: FeedPostType, initialIndex?: number) => void;
  onComment?: (post: FeedPostType) => void;
  onSave?: (post: FeedPostType) => void;
  onShare?: (post: FeedPostType) => void;
}

export const FeedPost: React.FC<Props> = ({
  post,
  isLast = false,
  isDark = false,
  onOpenDetail,
  onOpenImages,
  onComment,
  onSave,
  onShare,
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [inspired, setInspired] = useState(false);
  const [insCount, setInsCount] = useState(post.inspirations);
  const [expanded, setExpanded] = useState(false);

  const catColors = CAT_COLORS[post.author.category] ?? ['#7c3aed', '#4f46e5'];
  const catIcon   = CAT_ICONS[post.author.category]  ?? 'sparkles';

  const TRUNCATE = 120;
  const isLong   = post.content.length > TRUNCATE;
  const displayText = expanded || !isLong
    ? post.content
    : post.content.slice(0, TRUNCATE) + '…';

  const handleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikeCount(p => next ? p + 1 : p - 1);
    try { await postsService.toggleLike(post.id); } catch { /* optimistic — no revert */ }
  };

  const handleInspire = () => {
    setInspired(p => !p);
    setInsCount(p => inspired ? p - 1 : p + 1);
  };

  const handleShare = async () => {
    if (onShare) {
      onShare(post);
      return;
    }
    try {
      await Share.share({
        message: `${post.author.name} (@${post.author.username}): ${post.content}`,
      });
    } catch {
      // no-op
    }
  };

  return (
    <View style={[st.row, isDark && st.rowDark]}>

      {/* ── Columna izquierda: avatar + hilo ─── */}
      <View style={st.left}>
        {/* Avatar */}
        <View style={st.avatarWrap}>
          {post.author.avatar ? (
            <Image source={{ uri: post.author.avatar }} style={st.avatar} />
          ) : (
            <LinearGradient colors={catColors} style={st.avatar}>
              <Text style={st.initials}>{post.author.initials}</Text>
            </LinearGradient>
          )}

          {/* Badge de categoría */}
          <LinearGradient colors={catColors} style={st.badge}>
            <Ionicons name={catIcon as any} size={8} color="#fff" />
          </LinearGradient>

          {/* Verificado */}
          {post.author.verified && (
            <View style={[st.verifiedDot, isDark && st.verifiedDotDark]}>
              <Ionicons name="checkmark" size={7} color="#3b82f6" />
            </View>
          )}
        </View>

        {/* Línea del hilo — no aparece en el último post */}
        {!isLast && (
          <View style={st.threadLineWrap}>
            <LinearGradient
              colors={[catColors[0] + '55', 'transparent']}
              style={st.threadLine}
            />
          </View>
        )}
      </View>

      {/* ── Columna derecha: contenido ─── */}
      <View style={st.right}>

        {/* Header */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onOpenDetail?.(post)}
          style={st.header}
        >
          <Text style={[st.name, isDark && st.nameDark]} numberOfLines={1}>
            {post.author.name}
          </Text>
          <Text style={[st.meta, isDark && st.metaDark]}>@{post.author.username} · {post.createdAt}</Text>
        </TouchableOpacity>

        {/* Texto */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onOpenDetail?.(post)}
          onLongPress={() => isLong && setExpanded(p => !p)}
        >
          <Text style={[st.body, isDark && st.bodyDark]}>
            {displayText}
            {isLong && !expanded && (
              <Text style={st.more}> Ver más</Text>
            )}
          </Text>
        </TouchableOpacity>

        {/* Imágenes */}
        {post.images && post.images.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              if (onOpenImages) {
                onOpenImages(post, 0);
                return;
              }
              onOpenDetail?.(post);
            }}
            style={st.imagesWrap}
          >
            <PostImages images={post.images} />
          </TouchableOpacity>
        )}

        {/* Acciones */}
        <View style={st.actions}>
          <TouchableOpacity style={st.action} onPress={handleLike} activeOpacity={0.7}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={18}
              color={liked ? '#ef4444' : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)')}
            />
            {likeCount > 0 && (
              <Text style={[st.actionCount, isDark && st.actionCountDark, liked && st.actionCountLike]}>
                {likeCount}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={st.action} activeOpacity={0.7} onPress={() => onComment?.(post)}>
            <Ionicons
              name="chatbubble-outline"
              size={17}
              color={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'}
            />
            {post.comments > 0 && (
              <Text style={[st.actionCount, isDark && st.actionCountDark]}>
                {post.comments}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={st.action} onPress={handleInspire} activeOpacity={0.7}>
            <Ionicons
              name={inspired ? 'sparkles' : 'sparkles-outline'}
              size={17}
              color={inspired ? '#a78bfa' : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)')}
            />
            {insCount > 0 && (
              <Text style={[st.actionCount, isDark && st.actionCountDark, inspired && st.actionCountInspire]}>
                {insCount}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={st.action} activeOpacity={0.7} onPress={() => onSave?.(post)}>
            <Ionicons
              name="bookmark-outline"
              size={17}
              color={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={st.action} activeOpacity={0.7} onPress={handleShare}>
            <Ionicons
              name="share-social-outline"
              size={17}
              color={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ── Separador entre posts ─────────────────────────────────────────────────────
export const FeedDivider: React.FC<{ isDark?: boolean }> = ({ isDark }) => (
  <View style={[fd.line, isDark && fd.lineDark]} />
);

const fd = StyleSheet.create({
  line:     { marginLeft: 16 + 44 + 12, marginRight: 16, height: 1, backgroundColor: 'rgba(0,0,0,0.05)' },
  lineDark: { backgroundColor: 'rgba(255,255,255,0.05)' },
});

// ── Styles ────────────────────────────────────────────────────────────────────

const AVATAR_SIZE = 44;
const BADGE_SIZE  = 16;

const st = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 2,
    backgroundColor: 'transparent',
  },
  rowDark: {},

  // Columna izquierda
  left: {
    width: AVATAR_SIZE,
    alignItems: 'center',
    marginRight: 12,
  },
  avatarWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    position: 'relative',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  badge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedDotDark: {
    backgroundColor: '#111',
  },
  threadLineWrap: {
    flex: 1,
    width: 2,
    marginTop: 4,
    overflow: 'hidden',
    minHeight: 24,
  },
  threadLine: {
    flex: 1,
    width: 2,
    borderRadius: 1,
  },

  // Columna derecha
  right: {
    flex: 1,
    paddingBottom: 14,
  },
  header: {
    marginBottom: 5,
  },
  name: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
  },
  nameDark: {
    color: '#fff',
  },
  meta: {
    fontSize: 11.5,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(0,0,0,0.4)',
    marginTop: 1,
  },
  metaDark: {
    color: 'rgba(255,255,255,0.55)',
  },
  body: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#111',
    lineHeight: 21,
  },
  bodyDark: {
    color: 'rgba(255,255,255,0.85)',
  },
  more: {
    color: '#7c3aed',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
  },
  imagesWrap: {
    marginTop: 10,
    borderRadius: 14,
    overflow: 'hidden',
  },
  imgSingle: {
    width: '100%',
    height: 200,
    borderRadius: 14,
  },
  imgGrid: {
    flexDirection: 'row',
    gap: 3,
  },
  imgHalf: {
    flex: 1,
    height: 160,
    borderRadius: 10,
  },

  // Acciones
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 20,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(0,0,0,0.4)',
  },
  actionCountDark: {
    color: 'rgba(255,255,255,0.4)',
  },
  actionCountLike: {
    color: '#ef4444',
  },
  actionCountInspire: {
    color: '#a78bfa',
  },
});

