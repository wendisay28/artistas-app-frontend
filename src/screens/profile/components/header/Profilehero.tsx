// ─────────────────────────────────────────────────────────────────────────────
// ProfileHero.tsx — Portada del perfil · Estilo Dark Mode BuscArt
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
import { useThemeStore } from '../../../../store/themeStore';
import Svg, {
  Defs,
  RadialGradient as SvgRadialGradient,
  Stop,
  Rect,
} from 'react-native-svg';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = 100;

export type ProfileHeroProps = {
  coverImage?:  string;
  isOnline?:    boolean;
  isOwner?:     boolean;
  onBack?:      () => void;
  onMore?:      () => void;
  onEditCover?: () => void;
};

// ── Blobs estilo DARK (fondo sin cover) ─────────────────────────────────

const OnboardingBlobsBg: React.FC = () => (
  <>
    {/* Fondo base: Negro azulado profundo */}
    <LinearGradient
      colors={['#0f172a', '#020617', '#09090b']}
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
        {/* Blob violeta oscuro — superior derecha */}
        <SvgRadialGradient id="b1" cx="90%" cy="15%" r="60%" gradientUnits="userSpaceOnUse"
          fx={width * 0.9} fy={HERO_HEIGHT * 0.15}>
          <Stop offset="0"   stopColor="#7c3aed" stopOpacity="0.25" />
          <Stop offset="1"   stopColor="#7c3aed" stopOpacity="0" />
        </SvgRadialGradient>
        {/* Blob azul eléctrico — inferior izquierda */}
        <SvgRadialGradient id="b2" cx="8%" cy="85%" r="50%" gradientUnits="userSpaceOnUse"
          fx={width * 0.08} fy={HERO_HEIGHT * 0.85}>
          <Stop offset="0"   stopColor="#2563eb" stopOpacity="0.2" />
          <Stop offset="1"   stopColor="#2563eb" stopOpacity="0" />
        </SvgRadialGradient>
        {/* Blob fucsia/índigo — centro para dar vida */}
        <SvgRadialGradient id="b3" cx="50%" cy="50%" r="55%" gradientUnits="userSpaceOnUse"
          fx={width * 0.5} fy={HERO_HEIGHT * 0.5}>
          <Stop offset="0"   stopColor="#4f46e5" stopOpacity="0.12" />
          <Stop offset="1"   stopColor="#4f46e5" stopOpacity="0" />
        </SvgRadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={HERO_HEIGHT} fill="url(#b1)" />
      <Rect x={0} y={0} width={width} height={HERO_HEIGHT} fill="url(#b2)" />
      <Rect x={0} y={0} width={width} height={HERO_HEIGHT} fill="url(#b3)" />
    </Svg>
  </>
);

// ── GlowSweep para modo oscuro (luz violeta) ─────────────────────────────────

const GlowSweep: React.FC = () => {
  const translateX = useRef(new Animated.Value(-width * 0.5)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: width * 1.5,
      duration: 2000,
      delay: 500,
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
        colors={['transparent', 'rgba(124,58,237,0.18)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: width * 0.5, height: HERO_HEIGHT, transform: [{ skewX: '-25deg' }] }}
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
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', borderWidth: 1, borderColor: '#064e3b' }} />
    </View>
  );
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
  const { isDark, toggleTheme } = useThemeStore();
  const hasCover = !!coverImage
    && (coverImage.startsWith('http') || coverImage.startsWith('file://'))
    && !coverImage.includes('picsum.photos');

  return (
    <View style={styles.hero}>

      {/* ── Fondo ── */}
      {hasCover ? (
        <>
          <Image
            source={{ uri: coverImage }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={400}
          />
          {/* Overlay oscuro para legibilidad de botones */}
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
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
        <View style={styles.onlineBadge}>
          <OnlinePulse />
          <Text style={styles.onlineText}>Activo</Text>
        </View>
      )}

      {/* ── Botón editar portada ── */}
      {isOwner && (
        <TouchableOpacity style={styles.editCoverBtn} onPress={onEditCover} activeOpacity={0.8}>
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={styles.editCoverInner}
          >
            <Ionicons name="camera" size={16} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Botón para cambiar tema */}
      <TouchableOpacity 
        style={styles.themeToggleBtn}
        onPress={toggleTheme}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isDark 
            ? ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']
            : ['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.05)']
          }
          style={styles.themeToggleInner}
        >
          <Ionicons 
            name={isDark ? 'sunny-outline' : 'moon-outline'} 
            size={16} 
            color={isDark ? '#fff' : '#000'} 
          />
        </LinearGradient>
      </TouchableOpacity>

    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  hero: {
    height: HERO_HEIGHT,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#0a0618', // Fondo unificado dark
  },

  onlineBadge: {
    position: 'absolute', top: 14, left: 14,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.35)',
  },
  
  onlineText: { 
    fontSize: 10, 
    fontFamily: 'PlusJakartaSans_700Bold', 
    color: '#34D399', 
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },

  editCoverBtn: {
    position: 'absolute', top: 12, right: 14,
    borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  editCoverInner: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 18,
  },

  themeToggleBtn: {
    position: 'absolute', top: 12, right: 58,
    borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  themeToggleInner: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 18,
  },
});