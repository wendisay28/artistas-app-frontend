// ─────────────────────────────────────────────────────────────────────────────
// ProfileHero.tsx — Portada del perfil · Estilo onboarding BuscArt
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
import Svg, {
  Defs,
  RadialGradient as SvgRadialGradient,
  Stop,
  Rect,
} from 'react-native-svg';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = 100;

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type ProfileHeroProps = {
  coverImage?:  string;
  isOnline?:    boolean;
  isOwner?:     boolean;
  onBack?:      () => void;
  onMore?:      () => void;
  onEditCover?: () => void;
};

// ── Blobs estilo onboarding (fondo sin cover) ─────────────────────────────────

const OnboardingBlobsBg: React.FC = () => (
  <>
    <LinearGradient
      colors={['#ede8ff', '#e8eeff', '#f5f2ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    <Svg
      width={width}
      height={HERO_HEIGHT}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Defs>
        {/* Blob violeta — esquina superior derecha */}
        <SvgRadialGradient id="b1" cx="90%" cy="15%" r="50%" gradientUnits="userSpaceOnUse"
          fx={width * 0.9} fy={HERO_HEIGHT * 0.15}>
          <Stop offset="0"   stopColor="#a78bfa" stopOpacity="0.55" />
          <Stop offset="1"   stopColor="#a78bfa" stopOpacity="0" />
        </SvgRadialGradient>
        {/* Blob azul — esquina inferior izquierda */}
        <SvgRadialGradient id="b2" cx="8%" cy="85%" r="45%" gradientUnits="userSpaceOnUse"
          fx={width * 0.08} fy={HERO_HEIGHT * 0.85}>
          <Stop offset="0"   stopColor="#60a5fa" stopOpacity="0.45" />
          <Stop offset="1"   stopColor="#60a5fa" stopOpacity="0" />
        </SvgRadialGradient>
        {/* Blob lavanda — centro */}
        <SvgRadialGradient id="b3" cx="50%" cy="50%" r="55%" gradientUnits="userSpaceOnUse"
          fx={width * 0.5} fy={HERO_HEIGHT * 0.5}>
          <Stop offset="0"   stopColor="#c4b5fd" stopOpacity="0.22" />
          <Stop offset="1"   stopColor="#c4b5fd" stopOpacity="0" />
        </SvgRadialGradient>
        {/* Blob índigo — esquina superior izquierda */}
        <SvgRadialGradient id="b4" cx="0%" cy="0%" r="40%" gradientUnits="userSpaceOnUse"
          fx={0} fy={0}>
          <Stop offset="0"   stopColor="#818cf8" stopOpacity="0.3" />
          <Stop offset="1"   stopColor="#818cf8" stopOpacity="0" />
        </SvgRadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={HERO_HEIGHT} fill="url(#b1)" />
      <Rect x={0} y={0} width={width} height={HERO_HEIGHT} fill="url(#b2)" />
      <Rect x={0} y={0} width={width} height={HERO_HEIGHT} fill="url(#b3)" />
      <Rect x={0} y={0} width={width} height={HERO_HEIGHT} fill="url(#b4)" />
    </Svg>
  </>
);

// ── Sweep de luz animado (entra una sola vez) ─────────────────────────────────

const GlowSweep: React.FC = () => {
  const translateX = useRef(new Animated.Value(-width * 0.5)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: width * 1.2,
      duration: 1600,
      delay: 400,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}
    >
      <LinearGradient
        colors={['transparent', 'rgba(167,139,250,0.15)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: width * 0.4, height: HERO_HEIGHT, transform: [{ skewX: '-20deg' }] }}
      />
    </Animated.View>
  );
};

// ── Indicador online con pulso ────────────────────────────────────────────────

const OnlinePulse: React.FC = () => {
  const scale   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale,   { toValue: 2.2, duration: 900, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(scale,   { toValue: 1,   duration: 900, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0,   duration: 900, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: 900, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={{ width: 8, height: 8, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', transform: [{ scale }], opacity }} />
      <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#10B981' }} />
    </View>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  coverImage,
  isOnline,
  isOwner,
  onEditCover,
}) => {
  // Solo mostrar imagen de cover si es una URL externa real (no el placeholder genérico)
  const hasCover = !!coverImage && coverImage.startsWith('http') && !coverImage.includes('picsum.photos');

  return (
    <View style={styles.hero}>

      {/* ── Fondo ── */}
      {hasCover ? (
        <>
          <Image
            source={{ uri: coverImage }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={['rgba(10,5,30,0.08)', 'rgba(15,7,40,0.55)']}
            start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        </>
      ) : (
        <>
          <OnboardingBlobsBg />
          <GlowSweep />
        </>
      )}

      {/* ── Indicador online ── */}
      {isOnline && (
        <View style={hasCover ? styles.onlineDark : styles.onlineLight}>
          <OnlinePulse />
          <Text style={[styles.onlineText, !hasCover && styles.onlineTextLight]}>Activo ahora</Text>
        </View>
      )}

      {/* ── Botón editar portada — solo icono ── */}
      {isOwner && (
        <TouchableOpacity style={styles.editCoverBtn} onPress={onEditCover} activeOpacity={0.75}>
          {hasCover ? (
            <LinearGradient
              colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.12)']}
              style={styles.editCoverInner}
            >
              <Ionicons name="camera-outline" size={16} color="rgba(255,255,255,0.95)" />
            </LinearGradient>
          ) : (
            <View style={styles.editCoverLightInner}>
              <Ionicons name="camera-outline" size={16} color="#7c3aed" />
            </View>
          )}
        </TouchableOpacity>
      )}

    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  hero: {
    height: HERO_HEIGHT,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#ede8ff',
  },

  // Online badge — sobre cover oscuro
  onlineDark: {
    position: 'absolute', top: 12, left: 14,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)',
  },
  // Online badge — sobre fondo claro
  onlineLight: {
    position: 'absolute', top: 12, left: 14,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)',
  },
  onlineText:      { fontSize: 10.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#34D399', letterSpacing: 0.2 },
  onlineTextLight: { color: '#059669' },

  // Editar portada — solo icono
  editCoverBtn: {
    position: 'absolute', top: 12, right: 14,
    borderRadius: 20, overflow: 'hidden',
  },
  editCoverInner: {
    width: 34, height: 34,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', borderRadius: 20,
  },
  editCoverLightInner: {
    width: 34, height: 34,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)', borderRadius: 20,
  },
});
