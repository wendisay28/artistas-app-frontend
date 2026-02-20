// ─────────────────────────────────────────────────────────────────────────────
// ProfileHero.tsx — Portada del perfil · Rediseño elegante
// Gradiente sutil multicapa · overlay refinado · pills compactos
// Stack: expo-image · expo-linear-gradient · @expo/vector-icons · ../theme
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '../../../theme';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type ProfileHeroProps = {
  coverImage?:  string;
  isOnline?:    boolean;
  isOwner?:     boolean;
  onBack?:      () => void;
  onMore?:      () => void;
  onEditCover?: () => void;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDist = (km?: number): string | null => {
  if (km === undefined || km === null) return null;
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
};

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

      {/* ── Fondo: foto real o gradiente refinado ── */}
      {coverImage ? (
        <Image
          source={{ uri: coverImage }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={300}
        />
      ) : (
        // Gradiente elegante con curvas fluidas - diseño moderno
        <LinearGradient
          colors={['#6B46C1', '#9333EA', '#A855F7', '#C084FC', '#E9D5FF']}
          locations={[0, 0.2, 0.5, 0.8, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.7 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Overlay de profundidad — adaptado a las esquinas curvas */}
      <LinearGradient
        colors={[
          'rgba(107,70,193,0.25)',
          'rgba(147,51,234,0.15)',
          'rgba(168,85,247,0.10)',
          'rgba(192,132,252,0.20)',
          'rgba(233,213,255,0.30)',
        ]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Ruido/textura muy sutil para foto (solo si hay imagen) */}
      {coverImage && (
        <View style={styles.imageVignette} pointerEvents="none" />
      )}

      {/* ── Online indicator ── */}
      {isOnline && (
        <View style={styles.onlineIndicator}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Activo ahora</Text>
        </View>
      )}

      {/* ── Edit cover button ── */}
      {isOwner && (
        <TouchableOpacity style={styles.editCoverBtn} onPress={onEditCover} activeOpacity={0.8}>
          <Ionicons name="camera-outline" size={18} color="#fff" />
        </TouchableOpacity>
      )}

      {/* ── Fila inferior ── */}
      <View style={styles.bottomRow}>
        <View style={{ flex: 1 }} />
      </View>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  hero: {
    height: 120,
    width: '100%',
    backgroundColor: '#1a1025',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  // Viñeta sutil para fotos
  imageVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // Emulamos una viñeta suave; en RN no hay box-shadow inset,
    // pero el overlay LinearGradient ya cumple esta función.
  },

  // ── Online indicator ───────────────────────────────────────────────────────
  onlineIndicator: {
    position: 'absolute',
    top: 16,
    left: 16, // Movido a la izquierda
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.35)',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#34D399',
    letterSpacing: 0.2,
  },

  // ── Edit cover button ───────────────────────────────────────────────────────
  editCoverBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  // ── Bottom row ──────────────────────────────────────────────────────────────
  bottomRow: {
    position: 'absolute',
    bottom: 16,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
});