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
  const [localExpanded, setLocalExpanded] = useState(false);
  const isExpanded = expanded || localExpanded;

  const images = project.cards
    .map(i => i.image)
    .filter(Boolean)
    .slice(0, 4) as string[];

  const investmentEstimate = project.cards.reduce((total, item) => {
    const price = typeof (item as any).price === 'number' ? (item as any).price : 0;
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
    <TouchableOpacity
      style={[styles.card, isDark && styles.cardDark, isExpanded && styles.cardExpanded]}
      onPress={onPress}
      activeOpacity={0.88}
    >
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
          {project.cards.length} {project.cards.length === 1 ? 'ítem' : 'ítems'} guardados
        </Text>

        {/* Barra de progreso */}
        <View style={[styles.progressBar, isDark && styles.progressBarDark]}>
          <View style={[
            styles.progressFill,
            { width: `${Math.min((project.cards.length / 10) * 100, 100)}%` },
            isDark && styles.progressFillDark,
          ]} />
        </View>

        {/* Botón ver ítems */}
        <TouchableOpacity
          style={[styles.expandBtn, isDark && styles.expandBtnDark]}
          onPress={handleToggleExpand}
        >
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={13}
            color={isDark ? '#a78bfa' : '#7c3aed'}
          />
          <Text style={[styles.expandBtnText, isDark && styles.expandBtnTextDark]}>
            {isExpanded ? 'Ocultar ítems' : 'Ver ítems'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista expandible — vertical, no grid */}
      {isExpanded && (
        <View style={[styles.expandedContent, isDark && styles.expandedContentDark]}>
          <Text style={[styles.expandedTitle, isDark && styles.expandedTitleDark]}>
            Ítems ({project.cards.length})
          </Text>
          {project.cards.length === 0 ? (
            <Text style={[styles.expandedEmpty, isDark && styles.expandedEmptyDark]}>
              No hay ítems en este proyecto
            </Text>
          ) : (
            project.cards.map((item) => (
              <View key={item.id} style={[styles.itemRow, isDark && styles.itemRowDark]}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.itemThumb} contentFit="cover" />
                ) : (
                  <View style={[styles.itemThumb, styles.itemThumbPlaceholder, isDark && styles.itemThumbPlaceholderDark]}>
                    <Ionicons name="image-outline" size={16} color={isDark ? '#a78bfa' : '#7c3aed'} />
                  </View>
                )}
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, isDark && styles.itemNameDark]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {(item as any).price ? (
                    <Text style={[styles.itemPrice, isDark && styles.itemPriceDark]}>
                      ${((item as any).price as number).toLocaleString('es-CO')}
                    </Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={styles.removeItemBtn}
                  onPress={() =>
                    Alert.alert('Quitar ítem', `¿Quitar "${item.name}"?`, [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Quitar', style: 'destructive', onPress: () => removeFromProject(project.id, item.id) },
                    ])
                  }
                >
                  <Ionicons name="remove-circle-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}
    </TouchableOpacity>
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
    backgroundColor: 'rgba(124,58,237,0.05)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.12)',
  },
  expandBtnDark: {
    backgroundColor: 'rgba(139,92,246,0.08)',
    borderColor: 'rgba(139,92,246,0.2)',
  },
  expandBtnText: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },
  expandBtnTextDark: { color: '#a78bfa' },

  expandedContent: {
    borderTopWidth: 1, borderTopColor: 'rgba(167,139,250,0.12)',
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: 'rgba(249,250,251,0.5)',
  },
  expandedContentDark: {
    borderTopColor: 'rgba(139,92,246,0.15)',
    backgroundColor: 'rgba(10,6,24,0.5)',
  },
  expandedTitle: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(109,40,217,0.6)', marginBottom: 8,
  },
  expandedTitleDark: { color: 'rgba(167,139,250,0.7)' },
  expandedEmpty: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.4)', textAlign: 'center', paddingVertical: 12,
  },
  expandedEmptyDark: { color: 'rgba(167,139,250,0.4)' },
  itemRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 7,
    borderBottomWidth: 1, borderBottomColor: 'rgba(167,139,250,0.06)',
  },
  itemRowDark: { borderBottomColor: 'rgba(139,92,246,0.10)' },
  itemThumb: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#e5e7eb' },
  itemThumbPlaceholder: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(124,58,237,0.05)',
  },
  itemThumbPlaceholderDark: { backgroundColor: 'rgba(139,92,246,0.08)' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#1e1b4b', marginBottom: 2 },
  itemNameDark: { color: '#f5f3ff' },
  itemPrice: { fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(109,40,217,0.6)' },
  itemPriceDark: { color: 'rgba(167,139,250,0.7)' },
  removeItemBtn: { padding: 4 },
});