// ─────────────────────────────────────────────────────────────────────────────
// EmptyProjectSkeleton.tsx — Estado vacío de proyectos
// Un solo esqueleto con borde dashed, estático, mismo lenguaje visual que la app
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../../../store/themeStore';

const { width: SCREEN_W } = Dimensions.get('window');
const H_PAD = 16;

type Props = {
  onCreateProject?: () => void;
};

export const EmptyProjectSkeleton: React.FC<Props> = ({ onCreateProject }) => {
  const { isDark } = useThemeStore();

  return (
    <TouchableOpacity
      style={[styles.container, isDark && styles.containerDark]}
      onPress={onCreateProject}
      activeOpacity={0.8}
    >

      {/* ── Esqueleto único con borde dashed ── */}
      <View style={[styles.skeletonCard, isDark && styles.skeletonCardDark]}>

        {/* Imagen placeholder */}
        <View style={[styles.imgArea, isDark && styles.imgAreaDark]}>
          {/* Icon pill top-left */}
          <View style={[styles.iconPill, isDark && styles.iconPillDark]} />

          {/* ··· top-right */}
          <View style={[styles.moreBtn, isDark && styles.moreBtnDark]}>
            <View style={styles.dotsRow}>
              {[0,1,2].map(i => (
                <View key={i} style={[styles.dot, isDark && styles.dotDark]} />
              ))}
            </View>
          </View>

          {/* Folder icon centrado */}
          <View style={[styles.folderBox, isDark && styles.folderBoxDark]}>
            <Ionicons name="folder-open-outline" size={28} color={isDark ? 'rgba(167,139,250,0.5)' : 'rgba(124,58,237,0.4)'} />
          </View>
          <Text style={[styles.imgText, isDark && styles.imgTextDark]}>
            Crea tu primer proyecto
          </Text>
        </View>

        {/* Body placeholder */}
        <View style={styles.body}>
          {/* Fila nombre + fecha */}
          <View style={styles.rowSpaced}>
            <View style={[styles.line, { width: '55%' }, isDark && styles.lineDark]} />
            <View style={[styles.lineShort, { width: '22%' }, isDark && styles.lineDark]} />
          </View>

          {/* Estimado */}
          <View style={[styles.lineShort, { width: '38%' }, isDark && styles.lineDark]} />

          {/* Barra de progreso */}
          <View style={[styles.progressBar, isDark && styles.progressBarDark]} />

          {/* Thumbnails */}
          <View style={styles.thumbsRow}>
            {[0,1,2].map(i => (
              <View
                key={i}
                style={[
                  styles.thumb,
                  i > 0 && styles.thumbOverlap,
                  isDark && styles.thumbDark,
                ]}
              >
                <Ionicons name="add" size={10} color={isDark ? 'rgba(167,139,250,0.35)' : 'rgba(124,58,237,0.3)'} />
              </View>
            ))}
          </View>

          {/* Botones */}
          <View style={styles.btnsRow}>
            <View style={[styles.skBtn, isDark && styles.skBtnDark]}>
              <Ionicons name="chevron-down" size={11} color={isDark ? 'rgba(167,139,250,0.4)' : 'rgba(124,58,237,0.35)'} />
              <Text style={[styles.skBtnText, isDark && styles.skBtnTextDark]}>Ver ítems</Text>
            </View>
            <View style={[styles.skBtn, isDark && styles.skBtnDark]}>
              <Ionicons name="settings-outline" size={11} color={isDark ? 'rgba(167,139,250,0.4)' : 'rgba(124,58,237,0.35)'} />
              <Text style={[styles.skBtnText, isDark && styles.skBtnTextDark]}>Gestionar</Text>
            </View>
          </View>
        </View>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: H_PAD,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 14,
  },
  containerDark: {
    backgroundColor: '#0a0618',
  },

  // ── Skeleton card ──────────────────────────────────────────────
  skeletonCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(124,58,237,0.3)',
    backgroundColor: 'rgba(124,58,237,0.03)',
    overflow: 'hidden',
  },
  skeletonCardDark: {
    borderColor: 'rgba(139,92,246,0.35)',
    backgroundColor: 'rgba(124,58,237,0.04)',
  },

  // Imagen
  imgArea: {
    height: 160,
    backgroundColor: 'rgba(124,58,237,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    position: 'relative',
  },
  imgAreaDark: {
    backgroundColor: 'rgba(124,58,237,0.08)',
  },
  iconPill: {
    position: 'absolute', top: 10, left: 10,
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(124,58,237,0.2)',
  },
  iconPillDark: {
    backgroundColor: 'rgba(167,139,250,0.07)',
    borderColor: 'rgba(167,139,250,0.22)',
  },
  moreBtn: {
    position: 'absolute', top: 10, right: 10,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(124,58,237,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  moreBtnDark: {
    backgroundColor: 'rgba(167,139,250,0.06)',
    borderColor: 'rgba(167,139,250,0.2)',
  },
  dotsRow: { flexDirection: 'row', gap: 2 },
  dot: {
    width: 3, height: 3, borderRadius: 2,
    backgroundColor: 'rgba(124,58,237,0.3)',
  },
  dotDark: { backgroundColor: 'rgba(167,139,250,0.3)' },
  folderBox: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(124,58,237,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  folderBoxDark: {
    backgroundColor: 'rgba(139,92,246,0.10)',
    borderColor: 'rgba(139,92,246,0.35)',
  },
  imgText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.45)',
  },
  imgTextDark: { color: 'rgba(167,139,250,0.5)' },

  // Body
  body: {
    padding: 12,
    gap: 8,
  },
  rowSpaced: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  line: {
    height: 11, borderRadius: 6,
    backgroundColor: 'rgba(124,58,237,0.09)',
  },
  lineShort: {
    height: 8, borderRadius: 6,
    backgroundColor: 'rgba(124,58,237,0.07)',
  },
  lineDark: {
    backgroundColor: 'rgba(167,139,250,0.10)',
  },
  progressBar: {
    height: 4, borderRadius: 2,
    backgroundColor: 'rgba(124,58,237,0.07)',
  },
  progressBarDark: {
    backgroundColor: 'rgba(167,139,250,0.08)',
  },
  thumbsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  thumb: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(124,58,237,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  thumbOverlap: { marginLeft: -8 },
  thumbDark: {
    backgroundColor: 'rgba(167,139,250,0.07)',
    borderColor: 'rgba(167,139,250,0.22)',
  },
  btnsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  skBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(124,58,237,0.04)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(124,58,237,0.18)',
  },
  skBtnDark: {
    backgroundColor: 'rgba(139,92,246,0.05)',
    borderColor: 'rgba(139,92,246,0.2)',
  },
  skBtnText: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.4)',
  },
  skBtnTextDark: { color: 'rgba(167,139,250,0.45)' },

});