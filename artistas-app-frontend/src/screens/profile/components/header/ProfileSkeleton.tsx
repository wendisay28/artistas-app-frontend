// ─────────────────────────────────────────────────────────────────────────────
// ProfileSkeleton.tsx — Carga del perfil · Sistema BuscArt · v2
//
// Refleja exactamente la nueva estructura de ProfileHero v2 + ProfileIdentity v2:
//   banner (128h) → avatar + botones → disponibilidad + horario + ciudad →
//   bio → 3 tags → botón seguir → stats inline → strip owner
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../../../../theme/colors';
import { Spacing } from '../../../../theme/spacing';

// ── Shimmer base ──────────────────────────────────────────────────────────────

const Shimmer: React.FC<{ style?: any }> = ({ style }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return <Animated.View style={[styles.shimmerBase, style, { opacity }]} />;
};

// ── Component ─────────────────────────────────────────────────────────────────

export const ProfileSkeleton: React.FC = () => (
  <View style={styles.root}>

    {/* ── Banner — 128h igual que ProfileHero v2 ────────────── */}
    <Shimmer style={styles.banner} />

    {/* ── Avatar + botones ──────────────────────────────────── */}
    <View style={styles.avatarZone}>
      {/* Avatar con anillo — 84x84 squircle */}
      <Shimmer style={styles.avatar} />

      {/* Botones: ··· + Editar (owner) o ··· + Contratar (visitor) */}
      <View style={styles.actionRow}>
        <Shimmer style={styles.btnSquare} />
        <Shimmer style={styles.btnEdit} />
      </View>
    </View>

    {/* ── Info block ────────────────────────────────────────── */}
    <View style={styles.infoBlock}>

      {/* Línea 1: disponibilidad + horario + ciudad (fila de pills) */}
      <View style={styles.row}>
        <Shimmer style={styles.skAvail} />
        <Shimmer style={styles.skSchedule} />
        <Shimmer style={styles.skCity} />
      </View>

      {/* Línea 2: bio (2 líneas) */}
      <Shimmer style={styles.skBioLine1} />
      <Shimmer style={styles.skBioLine2} />

      {/* Línea 3: 3 tags con emoji */}
      <View style={styles.row}>
        <Shimmer style={styles.skTag} />
        <Shimmer style={[styles.skTag, { width: 78 }]} />
        <Shimmer style={[styles.skTag, { width: 65 }]} />
      </View>

      {/* Botón seguir ancho completo */}
      <Shimmer style={styles.skFollowBtn} />
    </View>

    {/* ── Stats inline — nueva estructura discreta ───────────── */}
    <View style={styles.statsInline}>
      <View style={styles.statInlineItem}>
        <Shimmer style={styles.skStatValue} />
        <Shimmer style={styles.skStatLabel} />
      </View>
      <View style={styles.statInlineSep} />
      <View style={styles.statInlineItem}>
        <Shimmer style={styles.skStatValue} />
        <Shimmer style={styles.skStatLabel} />
      </View>
      <View style={styles.statInlineSep} />
      <View style={styles.statInlineItem}>
        <Shimmer style={styles.skStatValue} />
        <Shimmer style={styles.skStatLabel} />
      </View>
    </View>

    {/* ── Owner strip — Compartir · Ver como cliente ─────────── */}
    <View style={styles.ownerStrip}>
      <View style={styles.stripItem}>
        <Shimmer style={styles.skStripBtn} />
      </View>
      <View style={styles.stripDivider} />
      <View style={styles.stripItem}>
        <Shimmer style={styles.skStripBtnWide} />
      </View>
    </View>

  </View>
);

// ── Styles ────────────────────────────────────────────────────────────────────

const AVATAR_SZ      = 80;   // igual que ProfileIdentity v2
const AVATAR_OVERLAP = 40;
const HERO_HEIGHT    = 128;  // igual que ProfileHero v2

const styles = StyleSheet.create({

  root: { backgroundColor: Colors.bg },

  shimmerBase: {
    backgroundColor: '#e8e3f7', // tinte morado muy suave, coherente con la paleta
    borderRadius: 8,
    overflow: 'hidden',
  },

  // ── Banner ───────────────────────────────────────────────────
  banner: {
    height: HERO_HEIGHT,
    width: '100%',
    borderRadius: 0,
  },

  // ── Avatar zone ──────────────────────────────────────────────
  avatarZone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginTop: -AVATAR_OVERLAP + 8,
    marginBottom: 10,
  },
  avatar: {
    width: AVATAR_SZ + 4,
    height: AVATAR_SZ + 4,
    borderRadius: (AVATAR_SZ + 4) * 0.28, // squircle — igual que avatarRing
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 4,
  },
  btnSquare: { width: 32, height: 32, borderRadius: 10 },
  btnEdit:   { width: 82, height: 32, borderRadius: 10 },

  // ── Info block ───────────────────────────────────────────────
  infoBlock: {
    paddingHorizontal: Spacing.lg,
    gap: 8,
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },

  // Pills de meta row
  skAvail:    { height: 26, width: 90,  borderRadius: 8 },   // disponibilidad
  skSchedule: { height: 26, width: 110, borderRadius: 8 },   // horario — nuevo
  skCity:     { height: 26, width: 70,  borderRadius: 20 },  // ciudad pill

  // Bio
  skBioLine1: { height: 13, width: '90%', borderRadius: 4 },
  skBioLine2: { height: 13, width: '60%', borderRadius: 4 },

  // Tags
  skTag: { height: 26, width: 88, borderRadius: 20 },

  // Botón seguir
  skFollowBtn: { height: 36, width: '100%', borderRadius: 12, marginTop: 2 },

  // ── Stats inline ─────────────────────────────────────────────
  statsInline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 0,
  },
  statInlineItem: {
    gap: 4,
    paddingRight: 12,
  },
  statInlineSep: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(167,139,250,0.2)',
    marginRight: 12,
  },
  skStatValue: { height: 13, width: 32, borderRadius: 4 },
  skStatLabel: { height: 9,  width: 52, borderRadius: 4 },

  // ── Owner strip ──────────────────────────────────────────────
  ownerStrip: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(167,139,250,0.1)',
    marginTop: 10,
  },
  stripItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
  },
  stripDivider: {
    width: 1,
    backgroundColor: 'rgba(167,139,250,0.12)',
    marginVertical: 8,
  },
  skStripBtn:     { height: 14, width: 72,  borderRadius: 4 },
  skStripBtnWide: { height: 14, width: 110, borderRadius: 4 },
});