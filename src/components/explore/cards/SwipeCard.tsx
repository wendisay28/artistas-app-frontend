// ─────────────────────────────────────────────────────────────────────────────
// SwipeCard.tsx — Base swipeable card wrapper (PanResponder + Animated)
// Renders any CardContent as children; handles swipe physics & overlays.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useCallback } from 'react';
import {
  StyleSheet,
  Animated as RNAnimated,
  PanResponder,
  Dimensions,
  Platform,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../constants/colors';
import type { ExploreCard, SwipeDirection } from '../../../types/explore';

// ── Constants ─────────────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CARD_WIDTH  = Math.min(SCREEN_WIDTH - 32, 420);
export const CARD_HEIGHT = SCREEN_HEIGHT * 0.72;

const SWIPE_THRESHOLD = 80; // Reducido de 120px para swipe más sensible

// ── Props ─────────────────────────────────────────────────────────────────────

interface SwipeCardProps {
  card: ExploreCard;
  zIndex: number;
  /** Called when the card flies off screen */
  onDismiss: (id: string, direction: SwipeDirection) => void;
  /** Content to render inside the card (ArtistCardContent, EventCardContent…) */
  children: React.ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SwipeCard({
  card,
  zIndex,
  onDismiss,
  children,
}: SwipeCardProps) {
  const swipeX = useRef(new RNAnimated.Value(0)).current;
  
  // Refs to store functions and avoid stale closures
  const flyOffRef = useRef<(direction: SwipeDirection) => void>(undefined);
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
        duration: 250, // Reducido de 280ms para respuesta más rápida
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

  // Store functions in refs
  flyOffRef.current = flyOff;
  snapBackRef.current = snapBack;

  // ── PanResponder ─────────────────────────────────────────────────────────

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gs) => {
        console.log(`[Swipe] onStart — dx:${gs.dx.toFixed(1)} dy:${gs.dy.toFixed(1)}`);
        return false;
      },
      onMoveShouldSetPanResponder: (_, gs) => {
        // Solo captura si el gesto es claramente horizontal (2× más dx que dy)
        const claim = Math.abs(gs.dx) > 15 && Math.abs(gs.dx) > Math.abs(gs.dy) * 2;
        console.log(`[Swipe] onMove? dx:${gs.dx.toFixed(1)} dy:${gs.dy.toFixed(1)} → ${claim ? '✅ CLAIM' : '❌ skip'}`);
        return claim;
      },
      onPanResponderGrant: (_, gs) => {
        console.log(`[Swipe] GRANT — empezando swipe dx:${gs.dx.toFixed(1)}`);
      },
      onPanResponderMove: (_, gs) => {
        console.log(`[Swipe] MOVE dx:${gs.dx.toFixed(1)} dy:${gs.dy.toFixed(1)} vx:${gs.vx.toFixed(2)}`);
        swipeX.setValue(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        console.log(`[Swipe] RELEASE dx:${gs.dx.toFixed(1)} vx:${gs.vx.toFixed(2)} threshold:${SWIPE_THRESHOLD}`);
        if (gs.dx > SWIPE_THRESHOLD) {
          console.log('[Swipe] → LIKE 💚');
          flyOffRef.current?.('like');
        } else if (gs.dx < -SWIPE_THRESHOLD) {
          console.log('[Swipe] → NOPE ❌');
          flyOffRef.current?.('nope');
        } else {
          console.log('[Swipe] → SNAP BACK (no llegó al umbral)');
          snapBackRef.current?.();
        }
      },
      onPanResponderTerminate: (_, gs) => {
        console.log(`[Swipe] TERMINATE (otro gestor tomó el control) dx:${gs.dx.toFixed(1)}`);
        snapBackRef.current?.();
      },
      onPanResponderTerminationRequest: () => {
        // No ceder el gesto una vez que el swipe horizontal fue reclamado
        return false;
      },
    }),
  ).current;

  // Store flyOff and snapBack in refs to avoid stale closures
  // Note: Functions are already stored above

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <RNAnimated.View
      style={[
        styles.card,
        {
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
      {/* GUARDAR badge — swipe derecha */}
      <RNAnimated.View style={[styles.badge, styles.saveBadge, { opacity: likeOpacity }]}>
        <Ionicons name="bookmark" size={20} color="#10B981" />
        <Text style={styles.saveText}>Guardar</Text>
      </RNAnimated.View>

      {/* SIGUIENTE badge — swipe izquierda */}
      <RNAnimated.View style={[styles.badge, styles.nextBadge, { opacity: nopeOpacity }]}>
        <Text style={styles.nextText}>Siguiente</Text>
        <Ionicons name="arrow-forward" size={20} color="#7c3aed" />
      </RNAnimated.View>

      {/* Card content injected by parent */}
      {children}
    </RNAnimated.View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },

  badge: {
    position: 'absolute',
    top: '38%',
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