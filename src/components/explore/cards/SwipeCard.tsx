// ─────────────────────────────────────────────────────────────────────────────
// SwipeCard.tsx — Base swipeable card wrapper (PanResponder + Animated)
// Renders any CardContent as children; handles swipe physics & overlays.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated as RNAnimated,
  PanResponder,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../constants/colors';
import type { ExploreCard, SwipeDirection } from '../../../types/explore';

// ── Constants ─────────────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CARD_WIDTH  = Math.min(SCREEN_WIDTH - 32, 420);
export const CARD_HEIGHT = SCREEN_HEIGHT * 0.72;

const SWIPE_THRESHOLD = 120;

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
        duration: 280,
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
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 12 && Math.abs(gs.dy) < 30,
      onPanResponderMove: (_, gs) => {
        swipeX.setValue(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > SWIPE_THRESHOLD)       flyOffRef.current?.('like');
        else if (gs.dx < -SWIPE_THRESHOLD) flyOffRef.current?.('nope');
        else                               snapBackRef.current?.();
      },
      onPanResponderTerminate: () => snapBackRef.current?.(),
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
      {/* LIKE badge */}
      <RNAnimated.View style={[styles.badge, styles.likeBadge, { opacity: likeOpacity }]}>
        <Ionicons name="heart" size={26} color="#10B981" />
        <Text style={[styles.badgeText, { color: '#10B981' }]}>LIKE</Text>
      </RNAnimated.View>

      {/* NOPE badge */}
      <RNAnimated.View style={[styles.badge, styles.nopeBadge, { opacity: nopeOpacity }]}>
        <Ionicons name="close" size={26} color={colors.primary} />
        <Text style={[styles.badgeText, { color: colors.primary }]}>NOPE</Text>
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

  // swipe feedback badges
  badge: {
    position: 'absolute',
    top: 40,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 3,
  },
  likeBadge: {
    left: 18,
    borderColor: '#10B981',
    backgroundColor: 'rgba(16,185,129,0.1)',
  },
  nopeBadge: {
    right: 18,
    borderColor: colors.primary,
    backgroundColor: 'rgba(230,57,70,0.1)',
  },
  badgeText: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 1,
  },
});