// ─────────────────────────────────────────────────────────────────────────────
// ProfileHero.tsx — Portada · Minimalista premium · BuscArt
//
// Portada: gradiente oscuro limpio + línea diagonal sutil + overlay elegante
// Sin blobs — sobriedad total para que el avatar sea el protagonista
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Line, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

export type ProfileHeroProps = {
  coverImage?:  string;
  isOnline?:    boolean;
  isOwner?:     boolean;
  onBack?:      () => void;
  onMore?:      () => void;
  onEditCover?: () => void;
};

// ── Líneas diagonales decorativas (SVG) ──────────────────────────────────────

const DiagonalAccent = () => (
  <Svg
    width={width}
    height={110}
    style={StyleSheet.absoluteFill}
    pointerEvents="none"
  >
    <Defs>
      <SvgGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0"   stopColor="#a78bfa" stopOpacity="0" />
        <Stop offset="0.4" stopColor="#a78bfa" stopOpacity="0.35" />
        <Stop offset="1"   stopColor="#60a5fa" stopOpacity="0" />
      </SvgGradient>
      <SvgGradient id="lineGrad2" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0"   stopColor="#c4b5fd" stopOpacity="0" />
        <Stop offset="0.5" stopColor="#c4b5fd" stopOpacity="0.18" />
        <Stop offset="1"   stopColor="#c4b5fd" stopOpacity="0" />
      </SvgGradient>
    </Defs>
    {/* Línea diagonal principal */}
    <Line x1="-20" y1="110" x2={width * 0.75} y2="-5"
      stroke="url(#lineGrad)" strokeWidth="1" />
    {/* Línea diagonal secundaria offset */}
    <Line x1="0" y1="110" x2={width * 0.9} y2="5"
      stroke="url(#lineGrad2)" strokeWidth="0.6" />
    {/* Línea sutil en el tercio derecho */}
    <Line x1={width * 0.5} y1="110" x2={width + 10} y2="20"
      stroke="url(#lineGrad2)" strokeWidth="0.5" />
  </Svg>
);

// ── Component ─────────────────────────────────────────────────────────────────

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  coverImage,
  isOnline,
  isOwner,
  onBack,
  onMore,
  onEditCover,
}) => {
  return (
    <View style={styles.hero}>

      {/* Fondo */}
      {coverImage ? (
        <>
          <Image
            source={{ uri: coverImage }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={300}
          />
          {/* Overlay premium sobre foto */}
          <LinearGradient
            colors={['rgba(10,5,30,0.15)', 'rgba(10,5,30,0.55)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        </>
      ) : (
        <>
          {/* Gradiente limpio, sin blobs — premium minimalista */}
          <LinearGradient
            colors={['#1a0a2e', '#0f172a', '#1e1b4b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Acento de color muy sutil en esquina superior */}
          <LinearGradient
            colors={['rgba(124,58,237,0.22)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          {/* Líneas diagonales decorativas */}
          <DiagonalAccent />
        </>
      )}

      {/* Overlay degradado inferior — da profundidad al avatar */}
      <LinearGradient
        colors={['transparent', 'rgba(8,4,20,0.45)']}
        start={{ x: 0, y: 0.4 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Online indicator */}
      {isOnline && (
        <View style={styles.onlineIndicator}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Activo ahora</Text>
        </View>
      )}

      {/* Editar portada */}
      {isOwner && (
        <TouchableOpacity
          style={styles.editCoverBtn}
          onPress={onEditCover}
          activeOpacity={0.8}
        >
          <Ionicons name="camera-outline" size={13} color="rgba(255,255,255,0.85)" />
        </TouchableOpacity>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  hero: {
    height: 118,
    width: '100%',
    backgroundColor: '#0f0a1e',
    overflow: 'hidden',
  },

  // Online
  onlineIndicator: {
    position: 'absolute',
    top: 12, left: 14,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    paddingHorizontal: 9, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.28)',
  },
  onlineDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 10.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#34D399', letterSpacing: 0.2,
  },

  // Editar portada
  editCoverBtn: {
    position: 'absolute',
    top: 10, right: 12,
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
});