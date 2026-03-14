// src/components/shared/AppFooter.tsx
// Pie de página global — NO es sticky.
// Se coloca como último elemento en el contenido de cada ScrollView/FlatList,
// por lo que solo aparece cuando el usuario llega al fondo de la pantalla.

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';

// ── Dot decorativo animado ─────────────────────────────────────────────────────

const PulseDot: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.5,
          duration: 900,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[s.pulseDot, { transform: [{ scale }] }]}
    />
  );
};

// ── AppFooter ──────────────────────────────────────────────────────────────────

export const AppFooter: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeStore();
  return (
  <View style={s.container}>
    {/* Separador superior con gradiente */}
    <LinearGradient
      colors={['transparent', isDark ? 'rgba(139,92,246,0.25)' : 'rgba(167,139,250,0.18)', 'transparent']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={s.divider}
    />

    {/* Fondo */}
    <LinearGradient
      colors={isDark ? ['#0a0618', '#080412', '#060310'] : ['#f8f6ff', '#f0edff', '#eef2ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[s.bg, { paddingBottom: insets.bottom + 28 }]}
    >
      {/* Mancha decorativa — igual que en onboarding */}
      <View style={s.blotch} />

      {/* Logo */}
      <View style={s.logoRow}>
        <Text style={[s.logoBusc, isDark && s.logoBuscDark]}>Busc</Text>
        <LinearGradient
          colors={['#7c3aed', '#2563eb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.logoArtBg}
        >
          <Text style={s.logoArt}>Art</Text>
        </LinearGradient>
      </View>

      {/* Tagline */}
      <Text style={[s.tagline, isDark && s.taglineDark]}>Conectando artistas con el mundo</Text>

      {/* Estado — indicador de actividad */}
      <View style={[s.statusRow, isDark && s.statusRowDark]}>
        <PulseDot delay={0} />
        <Text style={[s.statusText, isDark && s.statusTextDark]}>Plataforma activa</Text>
        <View style={[s.statusDivider, isDark && s.statusDividerDark]} />
        <Ionicons name="shield-checkmark-outline" size={11} color={isDark ? 'rgba(167,139,250,0.6)' : 'rgba(124,58,237,0.5)'} />
        <Text style={[s.statusText, isDark && s.statusTextDark]}>Datos seguros</Text>
      </View>

      {/* Links */}
      <View style={s.linksRow}>
        {(['Términos', 'Privacidad', 'Ayuda', 'Contacto'] as const).map((label, i, arr) => (
          <React.Fragment key={label}>
            <Pressable style={({ pressed }) => [s.linkBtn, pressed && s.linkBtnPressed]}>
              <Text style={[s.link, isDark && s.linkDark]}>{label}</Text>
            </Pressable>
            {i < arr.length - 1 && <View style={[s.dot, isDark && s.dotDark]} />}
          </React.Fragment>
        ))}
      </View>

      {/* Copyright */}
      <Text style={[s.copyright, isDark && s.copyrightDark]}>© 2026 BuscArt · Todos los derechos reservados</Text>
    </LinearGradient>
  </View>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  divider: {
    height: 1,
  },

  bg: {
    paddingHorizontal: 24,
    paddingTop: 28,
    alignItems: 'center',
    overflow: 'hidden',
  },

  blotch: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(167,139,250,0.09)',
    top: -80,
    right: -60,
  },

  // Logo
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoBusc: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b',
    letterSpacing: -0.5,
  },
  logoBuscDark: {
    color: '#ffffff',
  },
  logoArtBg: {
    borderRadius: 7,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 1,
  },
  logoArt: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#fff',
    letterSpacing: -0.5,
  },

  // Tagline
  tagline: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.55)',
    marginBottom: 14,
    letterSpacing: 0.1,
  },
  taglineDark: {
    color: 'rgba(167,139,250,0.55)',
  },

  // Estado
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 18,
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusRowDark: {
    backgroundColor: 'rgba(139,92,246,0.1)',
    borderColor: 'rgba(139,92,246,0.22)',
  },
  pulseDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#7c3aed',
    opacity: 0.7,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(109,40,217,0.55)',
    letterSpacing: 0.2,
  },
  statusTextDark: {
    color: 'rgba(167,139,250,0.7)',
  },
  statusDivider: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(124,58,237,0.18)',
    marginHorizontal: 2,
  },
  statusDividerDark: {
    backgroundColor: 'rgba(139,92,246,0.3)',
  },

  // Links
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(124,58,237,0.25)',
  },
  dotDark: {
    backgroundColor: 'rgba(167,139,250,0.35)',
  },
  linkBtn: {
    paddingVertical: 2,
    paddingHorizontal: 1,
  },
  linkBtnPressed: {
    opacity: 0.5,
  },
  link: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
    letterSpacing: 0.1,
  },
  linkDark: {
    color: '#a78bfa',
  },

  // Copyright
  copyright: {
    fontSize: 10.5,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.32)',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  copyrightDark: {
    color: 'rgba(167,139,250,0.3)',
  },
});
