// ─────────────────────────────────────────────────────────────────────────────
// InspirationCard.tsx — Tarjeta de post inspiracional estilo Pinterest
// Si un post está en el store ya está guardado → bookmark siempre activo.
// Presionar bookmark = eliminar de Inspiración.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../../../../store/themeStore';
import type { InspirationPost } from './Inspirationstore';

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

// Altura variable basada en el índice del post para efecto masonry
const HEIGHTS = [180, 220, 200, 240, 190, 210];
const getHeight = (id: string) => {
  const idx = id.charCodeAt(id.length - 1) % HEIGHTS.length;
  return HEIGHTS[idx];
};

export const InspirationCard: React.FC<Props> = ({ post, onPress, onBookmarkToggle }) => {
  const { isDark } = useThemeStore();
  const categoryColors = CATEGORY_COLORS[post.category] ?? ['#7c3aed', '#2563eb'];

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isDark && styles.cardDark,
        { height: getHeight(post.id) },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Imagen de fondo o gradiente */}
      {post.image ? (
        <Image source={{ uri: post.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : (
        <LinearGradient
          colors={categoryColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Overlay para mejor legibilidad */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      />

      {/* Categoría top-left */}
      <LinearGradient
        colors={categoryColors}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
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

      {/* Bookmark top-right — siempre activo (todas las tarjetas están guardadas) */}
      <TouchableOpacity
        style={styles.bookmarkBtn}
        onPress={onBookmarkToggle}
        hitSlop={8}
      >
        <Ionicons name="bookmark" size={18} color="#fff" />
      </TouchableOpacity>

      {/* Título y autor abajo */}
      <View style={styles.contentOverlay}>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.author}>
          {post.source === 'own' ? 'Mi referencia' : `por ${post.author}`}
        </Text>
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
    flex: 1,
    margin: 4,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.15)',
    overflow: 'hidden',
    shadowColor: '#5b21b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#130d2a',
    borderColor: 'rgba(139,92,246,0.15)',
  },
  overlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '60%',
  },
  categoryChip: {
    position: 'absolute',
    top: 8, left: 8,
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  ownBadge: {
    position: 'absolute',
    top: 8, left: 8,
    marginLeft: 70,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center', justifyContent: 'center',
  },
  ownBadgeDark: {
    backgroundColor: 'rgba(19,13,42,0.85)',
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 8, right: 8,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#7c3aed',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 12, gap: 2,
  },
  title: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    lineHeight: 18,
  },
  author: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.75)',
  },
  projectsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 4,
  },
  projectsBadgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.7)',
  },
});
