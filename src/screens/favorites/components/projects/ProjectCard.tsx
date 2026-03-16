// ─────────────────────────────────────────────────────────────────────────────
// ProjectCard.tsx — Tarjeta de proyecto con collage + dark mode completo
// Mejoras: botón ··· visible, grid expandido en lista vertical
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../../../../store/themeStore';
import { useListsStore } from '../../../../store/listsStore';
import { useInspirationStore } from '../../../../store/inspirationStore';
import type { Project } from '../../../../store/listsStore';
import type { ExploreCard } from '../../../../types/explore';

type Props = {
  project: Project;
  onPress: () => void;
  onDelete: () => void;
  onRename: () => void;
  onToggleExpand?: () => void;
  expanded?: boolean;
};

export const ProjectCard: React.FC<Props> = ({
  project, onPress, onDelete, onRename, onToggleExpand, expanded = false,
}) => {
  const { isDark } = useThemeStore();
  const { removeFromProject } = useListsStore();
  const { posts: inspirationPosts } = useInspirationStore();
  const [localExpanded, setLocalExpanded] = useState(false);
  const isExpanded = expanded || localExpanded;

  const images = [
    ...project.cards.map(c => c.image || (c.gallery && c.gallery[0]) || ''),
    ...project.inspirations.map(id => inspirationPosts.find(p => p.id === id)?.image || ''),
  ].filter(Boolean).slice(0, 4) as string[];

  const investmentEstimate = project.cards.reduce((total, card) => {
    const price = typeof card.price === 'number' ? card.price : 0;
    return total + price;
  }, 0);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} sem`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const handleToggleExpand = () => {
    if (onToggleExpand) onToggleExpand();
    else setLocalExpanded(!isExpanded);
  };

  const handleMoreOptions = () => {
    Alert.alert(`${project.emoji || ''} ${project.name}`, undefined, [
      { text: '✏️ Renombrar', onPress: onRename },
      { text: '🗑️ Eliminar', style: 'destructive', onPress: onDelete },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <View
      style={[styles.card, isDark && styles.cardDark, isExpanded && styles.cardExpanded]}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.88}>
      {/* Collage */}
      <View style={styles.collage}>
        {images.length === 0 && (
          <LinearGradient
            colors={isDark ? ['#1a0f35', '#0d0820'] : ['#ede8ff', '#e4eeff']}
            style={StyleSheet.absoluteFill}
          >
            <View style={styles.emptyCollage}>
              <Ionicons name={project.icon as any} size={42} color="#7c3aed" />
            </View>
          </LinearGradient>
        )}
        {images.length === 1 && (
          <Image source={{ uri: images[0] }} style={StyleSheet.absoluteFill} contentFit="cover" />
        )}
        {images.length === 2 && (
          <View style={styles.collage2}>
            {images.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.col2Img} contentFit="cover" />
            ))}
          </View>
        )}
        {images.length === 3 && (
          <View style={styles.collage3}>
            <Image source={{ uri: images[0] }} style={styles.col3Left} contentFit="cover" />
            <View style={styles.col3Right}>
              {[images[1], images[2]].map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.col3SmallImg} contentFit="cover" />
              ))}
            </View>
          </View>
        )}
        {images.length >= 4 && (
          <View style={styles.collage4}>
            {images.slice(0, 4).map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.col4Img} contentFit="cover" />
            ))}
          </View>
        )}

        <LinearGradient colors={['transparent', 'rgba(30,27,75,0.55)']} style={styles.gradient} />

        {/* Icon top-left */}
        <View style={[styles.iconPill, isDark && styles.iconPillDark]}>
          <Ionicons name={project.icon as any} size={16} color="#7c3aed" />
        </View>

        {/* ··· top-right — visible siempre */}
        <TouchableOpacity style={styles.moreBtn} onPress={handleMoreOptions} hitSlop={8}>
          <Ionicons name="ellipsis-horizontal" size={14} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.infoTop}>
          <Text style={[styles.name, isDark && styles.nameDark]} numberOfLines={1}>
            {project.name}
          </Text>
          <Text style={[styles.date, isDark && styles.dateDark]}>
            {formatDate(project.createdAt)}
          </Text>
        </View>

        {/* Estimado solo si > 0 */}
        {investmentEstimate > 0 && (
          <View style={styles.investmentRow}>
            <Ionicons name="cash-outline" size={12} color={isDark ? 'rgba(167,139,250,0.6)' : 'rgba(109,40,217,0.6)'} />
            <Text style={[styles.investment, isDark && styles.investmentDark]}>
              Est. ${investmentEstimate.toLocaleString('es-CO')}
            </Text>
          </View>
        )}

        {/* Contador de ítems simple */}
        <Text style={[styles.itemCount, isDark && styles.itemCountDark]}>
          {project.cards.length + project.inspirations.length} {project.cards.length + project.inspirations.length === 1 ? 'ítem' : 'ítems'} guardados
        </Text>

        {/* Barra de progreso */}
        <View style={[styles.progressBar, isDark && styles.progressBarDark]}>
          <View style={[
            styles.progressFill,
            { width: `${Math.min(((project.cards.length + project.inspirations.length) / 10) * 100, 100)}%` },
            isDark && styles.progressFillDark,
          ]} />
        </View>

        {/* Botón ver ítems */}
        <TouchableOpacity
          style={[styles.expandBtn, isDark && styles.expandBtnDark]}
          onPress={handleToggleExpand}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={13}
            color={isDark ? '#fff' : '#7c3aed'}
          />
          <Text style={[styles.expandBtnText, isDark && styles.expandBtnTextDark]}>
            {isExpanded ? 'Ocultar ítems' : 'Ver ítems'}
          </Text>
        </TouchableOpacity>
      </View>
      </TouchableOpacity>

      {/* Grid horizontal de imágenes */}
      {isExpanded && (
        <View style={[styles.expandedContent, isDark && styles.expandedContentDark]}>
          {project.cards.length === 0 && project.inspirations.length === 0 ? (
            <Text style={[styles.expandedEmpty, isDark && styles.expandedEmptyDark]}>
              No hay ítems en este proyecto
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbRow}>
              {project.cards.map((card) => {
                const uri = card.image || (card.gallery && card.gallery[0]) || '';
                return uri ? (
                  <Image key={card.id} source={{ uri }} style={styles.thumbImg} contentFit="cover" />
                ) : (
                  <View key={card.id} style={[styles.thumbImg, styles.thumbPlaceholder, isDark && styles.thumbPlaceholderDark]}>
                    <Ionicons name="image-outline" size={20} color={isDark ? '#a78bfa' : '#7c3aed'} />
                  </View>
                );
              })}
              {project.inspirations.map((id) => {
                const post = inspirationPosts.find(p => p.id === id);
                const uri = post?.image || '';
                return uri ? (
                  <Image key={id} source={{ uri }} style={styles.thumbImg} contentFit="cover" />
                ) : (
                  <View key={id} style={[styles.thumbImg, styles.thumbPlaceholder, isDark && styles.thumbPlaceholderDark]}>
                    <Ionicons name="images-outline" size={20} color={isDark ? '#a78bfa' : '#7c3aed'} />
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.18)',
    overflow: 'hidden',
    shadowColor: '#5b21b6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  cardDark: {
    backgroundColor: '#130d2a',
    borderColor: 'rgba(139,92,246,0.18)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
  },
  cardExpanded: { marginBottom: 8 },

  collage: { height: 150, backgroundColor: '#e5e7eb' },
  emptyCollage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%' },
  iconPill: {
    position: 'absolute', top: 8, left: 8,
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center', justifyContent: 'center',
  },
  iconPillDark: { backgroundColor: 'rgba(0,0,0,0.55)' },
  moreBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },

  collage2: { flex: 1, flexDirection: 'row', gap: 1 },
  col2Img: { flex: 1 },
  collage3: { flex: 1, flexDirection: 'row', gap: 1 },
  col3Left: { flex: 1.2 },
  col3Right: { flex: 0.8, gap: 1 },
  col3SmallImg: { flex: 1 },
  collage4: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 1 },
  col4Img: { width: '49.7%', height: '49.7%' },

  info: { paddingHorizontal: 12, paddingVertical: 10, gap: 6 },
  infoTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  name: { fontSize: 13.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b', flex: 1 },
  nameDark: { color: '#f5f3ff' },
  date: { fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(109,40,217,0.5)' },
  dateDark: { color: 'rgba(167,139,250,0.6)' },
  investmentRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  investment: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(109,40,217,0.7)' },
  investmentDark: { color: 'rgba(167,139,250,0.8)' },
  itemCount: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.5)' },
  itemCountDark: { color: 'rgba(167,139,250,0.55)' },
  progressBar: {
    height: 4, backgroundColor: 'rgba(124,58,237,0.1)', borderRadius: 2, overflow: 'hidden',
  },
  progressBarDark: { backgroundColor: 'rgba(139,92,246,0.15)' },
  progressFill: { height: '100%', backgroundColor: '#7c3aed', borderRadius: 2 },
  progressFillDark: { backgroundColor: '#a78bfa' },
  expandBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingVertical: 6, borderRadius: 8,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)',
  },
  expandBtnDark: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.28)',
  },
  expandBtnText: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },
  expandBtnTextDark: { color: '#fff' },

  expandedContent: {
    borderTopWidth: 1, borderTopColor: 'rgba(167,139,250,0.12)',
    paddingVertical: 10,
    backgroundColor: 'rgba(249,250,251,0.5)',
  },
  expandedContentDark: {
    borderTopColor: 'rgba(139,92,246,0.15)',
    backgroundColor: 'rgba(10,6,24,0.5)',
  },
  expandedEmpty: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.4)', textAlign: 'center', paddingVertical: 12,
  },
  expandedEmptyDark: { color: 'rgba(167,139,250,0.4)' },
  thumbRow: { flexDirection: 'row', gap: 6, paddingHorizontal: 12 },
  thumbImg: { width: 56, height: 56, borderRadius: 10 },
  thumbPlaceholder: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.15)',
  },
  thumbPlaceholderDark: { backgroundColor: 'rgba(139,92,246,0.1)', borderColor: 'rgba(139,92,246,0.2)' },
});