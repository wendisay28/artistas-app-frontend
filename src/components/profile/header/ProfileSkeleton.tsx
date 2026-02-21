// ─────────────────────────────────────────────────────────────────────────────
// ProfileSkeleton.tsx — Carga del perfil · Sistema BuscArt
// Refleja exactamente la estructura de ProfileHero + ProfileIdentity:
//   banner → avatar + botones → nombre/ciudad → disponibilidad →
//   bio → 3 tags → botón seguir → 3 stats (Seguidores/Vistas/Reseñas)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Colors, Spacing } from '../../../theme';

// ── Shimmer base ──────────────────────────────────────────────────────────────

const Shimmer: React.FC<{ style?: any }> = ({ style }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900,  easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900,  easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });

  return (
    <Animated.View style={[styles.shimmerBase, style, { opacity }]} />
  );
};

// ── Component ─────────────────────────────────────────────────────────────────

export const ProfileSkeleton: React.FC = () => (
  <View style={styles.root}>

    {/* ── Banner ────────────────────────────────────────────── */}
    <Shimmer style={styles.banner} />

    {/* ── Avatar + botones ──────────────────────────────────── */}
    <View style={styles.avatarZone}>
      <Shimmer style={styles.avatar} />
      <View style={styles.actionRow}>
        <Shimmer style={styles.btnSquare} />
        <Shimmer style={styles.btnMedium} />
        <Shimmer style={styles.btnPrimary} />
      </View>
    </View>

    {/* ── Info ──────────────────────────────────────────────── */}
    <View style={styles.infoBlock}>

      {/* Línea 1: nombre + ciudad */}
      <View style={styles.row}>
        <Shimmer style={styles.skName} />
        <Shimmer style={styles.skCity} />
      </View>

      {/* Línea 2: disponibilidad */}
      <Shimmer style={styles.skAvail} />

      {/* Línea 3: bio (2 líneas) */}
      <Shimmer style={styles.skBioLine1} />
      <Shimmer style={styles.skBioLine2} />

      {/* Línea 4: 3 tags */}
      <View style={styles.row}>
        <Shimmer style={styles.skTag} />
        <Shimmer style={styles.skTag} />
        <Shimmer style={styles.skTag} />
      </View>

      {/* Botón seguir */}
      <Shimmer style={styles.skFollowBtn} />
    </View>

    {/* ── Stats card: Seguidores · Vistas · Reseñas ─────────── */}
    <View style={styles.statsCard}>
      <View style={styles.statItem}>
        <Shimmer style={styles.skStatValue} />
        <Shimmer style={styles.skStatLabel} />
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Shimmer style={styles.skStatValue} />
        <Shimmer style={styles.skStatLabel} />
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Shimmer style={styles.skStatValue} />
        <Shimmer style={styles.skStatLabel} />
      </View>
    </View>

  </View>
);

// ── Styles ────────────────────────────────────────────────────────────────────

const AVATAR_SZ      = 72;
const AVATAR_OVERLAP = 36;

const styles = StyleSheet.create({

  root: { backgroundColor: Colors.bg },

  shimmerBase: {
    backgroundColor: '#e8e3f7',   // tinte morado muy suave, coherente con la paleta
    borderRadius: 8,
    overflow: 'hidden',
  },

  // Banner
  banner: {
    height: 110,
    width: '100%',
    borderRadius: 0,
  },

  // Avatar zone
  avatarZone: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginTop: -AVATAR_OVERLAP,
    marginBottom: 10,
  },
  avatar: {
    width: AVATAR_SZ + 4,
    height: AVATAR_SZ + 4,
    borderRadius: 22,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 4,
  },
  btnSquare:  { width: 32,  height: 32, borderRadius: 10 },
  btnMedium:  { width: 80,  height: 32, borderRadius: 10 },
  btnPrimary: { width: 95,  height: 32, borderRadius: 10 },

  // Info
  infoBlock: {
    paddingHorizontal: Spacing.lg,
    gap: 7,
    paddingBottom: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  skName:      { height: 20, width: '42%', borderRadius: 6 },
  skCity:      { height: 20, width: 70,    borderRadius: 20 },
  skAvail:     { height: 22, width: 95,    borderRadius: 20 },
  skBioLine1:  { height: 13, width: '90%', borderRadius: 4 },
  skBioLine2:  { height: 13, width: '65%', borderRadius: 4 },
  skTag:       { height: 24, width: 72,    borderRadius: 20 },
  skFollowBtn: { height: 36, width: '100%', borderRadius: 12, marginTop: 2 },

  // Stats card
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: 12,
    marginBottom: 2,
    borderRadius: 14,
    backgroundColor: 'rgba(232,227,247,0.6)',
    borderWidth: 1.5,
    borderColor: 'rgba(167,139,250,0.18)',
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 5,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(167,139,250,0.2)',
    marginVertical: 10,
  },
  skStatValue: { height: 15, width: 36, borderRadius: 4 },
  skStatLabel: { height: 9,  width: 50, borderRadius: 4 },
});