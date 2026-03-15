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
  /** Si false, el swipe a la izquierda hace snap back en lugar de volar */
  canGoBack?: boolean;
  /** Deshabilita gestos — para tarjetas pre-renderizadas detrás de la actual */
  disabled?: boolean;
  /** Escala visual para el efecto de stack (1.0 = frente, 0.96 = detrás) */
  cardScale?: number;
  /** Offset vertical para el efecto de stack */
  cardOffsetY?: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SwipeCard({
  card,
  zIndex,
  onDismiss,
  children,
  scrollRef,
  height = CARD_HEIGHT,
  canGoBack = false,
  disabled = false,
  cardScale = 1,
  cardOffsetY = 0,
}: SwipeCardProps) {
  const { isDark } = useThemeStore();
  const swipeX      = useRef(new RNAnimated.Value(0)).current;
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const flyOffRef    = useRef<(direction: SwipeDirection) => void>(undefined);
  const snapBackRef  = useRef<() => void>(undefined);
  const canGoBackRef = useRef(canGoBack);

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

  flyOffRef.current    = flyOff;
  snapBackRef.current  = snapBack;
  canGoBackRef.current = canGoBack;

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
        // Permite diagonal natural (arriba-derecha / abajo-izquierda):
        // solo se requiere que el componente horizontal sea suficiente
        // relativo al vertical (ratio 0.6 permite ~59° de inclinación).
        const isDiagonalOrHorizontal =
          Math.abs(gs.dx) > Math.abs(gs.dy) * 0.6 && Math.abs(gs.dx) > 10;
        return !inButtonZone && isDiagonalOrHorizontal;
      },
      onPanResponderMove: (_, gs) => {
        swipeX.setValue(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > SWIPE_THRESHOLD) {
          flyOffRef.current?.('like');
        } else if (gs.dx < -SWIPE_THRESHOLD) {
          // Solo volar si hay tarjeta anterior — si no, snap back
          if (canGoBackRef.current) {
            flyOffRef.current?.('nope');
          } else {
            snapBackRef.current?.();
          }
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
      // Background cards: render to hardware bitmap — zero GPU recalculation per frame.
      // shouldRasterizeIOS   → iOS composites the card as a flat texture
      // renderToHardwareTextureAndroid → Android equivalent
      shouldRasterizeIOS={Platform.OS === 'ios' && disabled}
      renderToHardwareTextureAndroid={Platform.OS === 'android' && disabled}
      style={[
        styles.card,
        isDark ? styles.cardDark : styles.cardLight,
        {
          height,
          zIndex,
          position: 'absolute',
          transform: disabled
            ? [{ scale: cardScale }, { translateY: cardOffsetY }]
            : [{ translateX: swipeX }, { rotate: cardRotation }, { scale: cardScale }, { translateY: cardOffsetY }],
          opacity: disabled ? 1 : cardOpacity,
          pointerEvents: disabled ? 'none' : 'auto',
        },
      ]}
      {...(disabled ? {} : panResponder.panHandlers)}
    >
      {/* ScrollView interno — maneja scroll vertical, no interfiere con swipe horizontal */}
      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled
        scrollEnabled={!disabled}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {children}
      </ScrollView>

      {/* SIGUIENTE badge — swipe derecha */}
      <RNAnimated.View style={[styles.badge, styles.nextFwdBadge, { opacity: likeOpacity }]}>
        <Text style={styles.nextFwdText}>Siguiente</Text>
        <Ionicons name="arrow-forward" size={18} color="#7c3aed" />
      </RNAnimated.View>

      {/* ANTERIOR badge — swipe izquierda */}
      <RNAnimated.View style={[styles.badge, styles.prevBadge, { opacity: nopeOpacity }]}>
        <Ionicons name="arrow-back" size={18} color="#6b7280" />
        <Text style={styles.prevText}>Anterior</Text>
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
  nextFwdBadge: {
    right: 16,
    borderColor: '#7c3aed',
    backgroundColor: 'rgba(124,58,237,0.10)',
  },
  nextFwdText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#7c3aed',
  },
  prevBadge: {
    left: 16,
    borderColor: '#6b7280',
    backgroundColor: 'rgba(107,114,128,0.10)',
  },
  prevText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#6b7280',
  },
});
