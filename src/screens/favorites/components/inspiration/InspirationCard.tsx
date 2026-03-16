// ─────────────────────────────────────────────────────────────────────────────
// InspirationCard.tsx — Tarjeta estilo Pinterest
// FIX: importa desde inspirationStore (no Inspirationstore con S mayúscula)
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../../../../store/themeStore';
import type { InspirationPost } from '../../../../store/inspirationStore';

type Props = {
  post: InspirationPost;
  onPress: () => void;
  onBookmarkToggle: () => void;
};

const CATEGORY_LABELS: Record<string, string> = {
  arte:   'Arte',
  foto:   'Foto',
  musica: 'Música',
  bodas:  'Bodas',
  teatro: 'Teatro',
};

const CATEGORY_COLORS: Record<string, [string, string]> = {
  arte:   ['#7c3aed', '#2563eb'],
  foto:   ['#059669', '#0ea5e9'],
  musica: ['#db2777', '#f59e0b'],
  bodas:  ['#ec4899', '#f43f5e'],
  teatro: ['#dc2626', '#ea580c'],
};

// Alturas variables para efecto masonry real
const HEIGHTS = [180, 230, 200, 260, 195, 215, 175, 245];
const getHeight = (id: string) => {
  const idx = id.charCodeAt(id.length - 1) % HEIGHTS.length;
  return HEIGHTS[idx];
};

export const InspirationCard: React.FC<Props> = ({ post, onPress, onBookmarkToggle }) => {
  const { isDark } = useThemeStore();
  const categoryColors = CATEGORY_COLORS[post.category] ?? ['#7c3aed', '#2563eb'];

  return (
    <TouchableOpacity
      style={[styles.card, isDark && styles.cardDark, { height: getHeight(post.id) }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Imagen o gradiente de fallback */}
      {post.image ? (
        <Image
          source={{ uri: post.image }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
        />
      ) : (
        <LinearGradient
          colors={categoryColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Overlay oscuro abajo */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.72)']}
        style={styles.overlay}
      />

      {/* Chip de categoría — arriba izquierda */}
      <LinearGradient
        colors={categoryColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.categoryChip}
      >
        <Text style={styles.categoryText}>
          {CATEGORY_LABELS[post.category] ?? post.category}
        </Text>
      </LinearGradient>

      {/* Badge "propio" si source === 'own' */}
      {post.source === 'own' && (
        <View style={[styles.ownBadge, isDark && styles.ownBadgeDark]}>
          <Ionicons name="person" size={9} color={isDark ? '#a78bfa' : '#7c3aed'} />
        </View>
      )}

      {/* Indicador multi-foto — arriba derecha si hay más de 1 imagen */}
      {post.images && post.images.length > 1 && (
        <View style={styles.multiPhotoBadge}>
          <Ionicons name="copy-outline" size={11} color="#fff" />
        </View>
      )}

      {/* Bookmark — arriba derecha, siempre activo */}
      <TouchableOpacity
        style={styles.bookmarkBtn}
        onPress={onBookmarkToggle}
        hitSlop={8}
      >
        <Ionicons name="bookmark" size={16} color="#fff" />
      </TouchableOpacity>

      {/* Autor abajo */}
      <View style={styles.contentOverlay}>
        {post.title ? (
          <Text style={styles.title} numberOfLines={2}>
            {post.title}
          </Text>
        ) : null}
        <View style={styles.authorRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {(post.source === 'own' ? 'Y' : (post.author || 'A')[0].toUpperCase())}
            </Text>
          </View>
          <Text style={styles.authorText} numberOfLines={1}>
            {post.source === 'own' ? 'Mi referencia' : post.author || 'Artista'}
          </Text>
        </View>
        {post.projectIds.length > 0 && (
          <View style={styles.projectsBadge}>
            <Ionicons name="folder" size={9} color="rgba(255,255,255,0.7)" />
            <Text style={styles.projectsBadgeText}>
              {post.projectIds.length} {post.projectIds.length === 1 ? 'proyecto' : 'proyectos'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    marginBottom: 0, // el gap lo maneja el padre
  },
  cardDark: {
    backgroundColor: '#130d2a',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
  },
  categoryChip: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    letterSpacing: 0.3,
  },
  ownBadge: {
    position: 'absolute',
    top: 8,
    left: 74,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownBadgeDark: {
    backgroundColor: 'rgba(19,13,42,0.85)',
  },
  multiPhotoBadge: {
    position: 'absolute',
    top: 8,
    right: 46,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    gap: 4,
  },
  title: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
    lineHeight: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  avatarCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(124,58,237,0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 9,
    color: '#fff',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  authorText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.88)',
    fontFamily: 'PlusJakartaSans_500Medium',
    flex: 1,
  },
  projectsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  projectsBadgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.65)',
  },
});