// ─────────────────────────────────────────────────────────────────────────────
// SwipeCard.tsx — All-in-One card (Bumble/Tinder style)
// Contiene imagen + detalles en un ScrollView interno.
// PanResponder horizontal coexiste con scroll vertical interno.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useCallback } from 'react';
import {
  StyleSheet,
  Animated as RNAnimated,
  PanResponder,
  Dimensions,
  Platform,
  Text,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import type { ExploreCard, SwipeDirection } from '../../../types/explore';
import { useThemeStore } from '../../../store/themeStore';

// ── Constants ─────────────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CARD_WIDTH        = Math.min(SCREEN_WIDTH - 16, 480);
// Altura total de la tarjeta: imagen + panel + detalles scrollables
// Fallback estático — se sobreescribe con el prop `height` desde ExploreScreen
export const CARD_HEIGHT = SCREEN_HEIGHT * 0.72;

const SWIPE_THRESHOLD = 80;

// ── Props ─────────────────────────────────────────────────────────────────────

interface SwipeCardProps {
  card: ExploreCard;
  zIndex: number;
  onDismiss: (id: string, direction: SwipeDirection) => void;
  children: React.ReactNode;
  scrollRef?: React.RefObject<ScrollView>;
  /** Altura calculada dinámicamente con useSafeAreaInsets en el padre */
  height?: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SwipeCard({
  card,
  zIndex,
  onDismiss,
  children,
  scrollRef,
  height = CARD_HEIGHT,
}: SwipeCardProps) {
  const { isDark } = useThemeStore();
  const swipeX      = useRef(new RNAnimated.Value(0)).current;
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const flyOffRef   = useRef<(direction: SwipeDirection) => void>(undefined);
  const snapBackRef = useRef<() => void>(undefined);

  // ── Derived animated values ──────────────────────────────────────────────

  const cardRotation = swipeX.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const cardOpacity = swipeX.interpolate({
    inputRange: [-SCREEN_WIDTH * 0.5, 0, SCREEN_WIDTH * 0.5],
    outputRange: [0.5, 1, 0.5],
  });

  const likeOpacity = swipeX.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = swipeX.interpolate({
    inputRange: [-80, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // ── Dismiss helpers ──────────────────────────────────────────────────────

  const flyOff = useCallback(
    (direction: SwipeDirection) => {
      const toValue = direction === 'like' ? SCREEN_WIDTH * 1.3 : -SCREEN_WIDTH * 1.3;

      if (Platform.OS !== 'web') {
        Haptics.impactAsync(
          direction === 'like'
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Light,
        );
      }

      RNAnimated.timing(swipeX, {
        toValue,
        duration: 250,
        useNativeDriver: true,
      }).start(() => onDismiss(card.id, direction));
    },
    [card.id, onDismiss, swipeX],
  );

  const snapBack = useCallback(() => {
    RNAnimated.spring(swipeX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
  }, [swipeX]);

  flyOffRef.current   = flyOff;
  snapBackRef.current = snapBack;

  // ── PanResponder ─────────────────────────────────────────────────────────
  // Regla: el swipe horizontal toma control solo si |dx| > |dy|
  // Esto permite que el ScrollView interno maneje el scroll vertical sin conflicto.

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, _gs) => {
        touchStartX.current = evt.nativeEvent.locationX;
        touchStartY.current = evt.nativeEvent.locationY;
        return false; // No tomar control al inicio — esperar al movimiento
      },
      onMoveShouldSetPanResponder: (_evt, gs) => {
        const inButtonZone = touchStartX.current > CARD_WIDTH * 0.80;
        // Solo reclamar si el movimiento es claramente horizontal (|dx| > |dy|)
        // y supera el umbral mínimo de 10px para evitar micro-twitches
        const isHorizontal = Math.abs(gs.dx) > Math.abs(gs.dy) && Math.abs(gs.dx) > 10;
        return !inButtonZone && isHorizontal;
      },
      onPanResponderMove: (_, gs) => {
        swipeX.setValue(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > SWIPE_THRESHOLD) {
          flyOffRef.current?.('like');
        } else if (gs.dx < -SWIPE_THRESHOLD) {
          flyOffRef.current?.('nope');
        } else {
          snapBackRef.current?.();
        }
      },
      onPanResponderTerminate: () => {
        snapBackRef.current?.();
      },
      // No ceder el gesto una vez que el swipe horizontal fue reclamado
      onPanResponderTerminationRequest: () => false,
    }),
  ).current;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <RNAnimated.View
      style={[
        styles.card,
        isDark ? styles.cardDark : styles.cardLight,
        {
          height, // altura dinámica desde el padre
          zIndex,
          transform: [
            { translateX: swipeX },
            { rotate: cardRotation },
          ],
          opacity: cardOpacity,
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* ScrollView interno — maneja scroll vertical, no interfiere con swipe horizontal */}
      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {children}
      </ScrollView>

      {/* GUARDAR badge — swipe derecha (flota sobre el ScrollView) */}
      <RNAnimated.View style={[styles.badge, styles.saveBadge, { opacity: likeOpacity }]}>
        <Ionicons name="bookmark" size={20} color="#10B981" />
        <Text style={styles.saveText}>Guardar</Text>
      </RNAnimated.View>

      {/* SIGUIENTE badge — swipe izquierda */}
      <RNAnimated.View style={[styles.badge, styles.nextBadge, { opacity: nopeOpacity }]}>
        <Text style={styles.nextText}>Siguiente</Text>
        <Ionicons name="arrow-forward" size={20} color="#7c3aed" />
      </RNAnimated.View>
    </RNAnimated.View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    // Sin sombra — el contenido (ArtistCardContent) define su propio diseño visual
    shadowOpacity: 0,
    elevation: 0,
  },

  cardLight: {
    backgroundColor: '#F8F9FA',
    borderWidth: 0,
  },
  cardDark: {
    // Fondo oscuro base — las tarjetas de detalle blancas destacan sobre él
    backgroundColor: '#0a0618',
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: 'column',
    paddingBottom: 32,
  },

  // Badges flotan absolutamente sobre el ScrollView — zIndex 20
  badge: {
    position: 'absolute',
    top: '22%',
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 2,
  },
  saveBadge: {
    left: 16,
    borderColor: '#10B981',
    backgroundColor: 'rgba(16,185,129,0.12)',
  },
  saveText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#10B981',
  },
  nextBadge: {
    right: 16,
    borderColor: '#7c3aed',
    backgroundColor: 'rgba(124,58,237,0.10)',
  },
  nextText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#7c3aed',
  },
});
