// components/hiring/controls/AvailabilitySwitch.tsx
//
// Switch que el artista activa para recibir ofertas en tiempo real.
// Aparece en la parte superior de la pestaña Contratar, solo para cuentas artista.

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../../../theme/colors';

interface AvailabilitySwitchProps {
  isAvailable: boolean;
  onToggle: (value: boolean) => void;
  /** Cuántas ofertas en tiempo real hay activas en su zona */
  nearbyOffersCount?: number;
}

export default function AvailabilitySwitch({
  isAvailable,
  onToggle,
  nearbyOffersCount = 0,
}: AvailabilitySwitchProps) {
  const slideAnim = useRef(new Animated.Value(isAvailable ? 1 : 0)).current;
  const bgAnim = useRef(new Animated.Value(isAvailable ? 1 : 0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: isAvailable ? 1 : 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }),
      Animated.timing(bgAnim, {
        toValue: isAvailable ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();

    if (isAvailable) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    } else {
      glowAnim.stopAnimation();
      glowAnim.setValue(0);
    }
  }, [isAvailable]);

  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(
        isAvailable ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
      );
    }
    onToggle(!isAvailable);
  };

  // Thumb del switch
  const thumbTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 26],
  });

  // Color de fondo del switch
  const switchBg = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, '#10B981'],
  });

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={
          isAvailable
            ? ['#10B98108', '#10B98114']
            : [Colors.background, Colors.background]
        }
        style={styles.container}
      >
        {/* Lado izquierdo: estado + info */}
        <View style={styles.left}>
          {/* Indicador de estado */}
          <View style={styles.statusIndicator}>
            {isAvailable ? (
              <Animated.View
                style={[styles.activeDot, { opacity: glowAnim }]}
              />
            ) : (
              <View style={styles.inactiveDot} />
            )}
          </View>

          <View>
            <Text style={styles.statusLabel}>
              {isAvailable ? 'Disponible ahora' : 'No disponible'}
            </Text>
            <Text style={styles.statusSubtitle}>
              {isAvailable
                ? nearbyOffersCount > 0
                  ? `${nearbyOffersCount} oferta${nearbyOffersCount !== 1 ? 's' : ''} cerca de ti`
                  : 'Esperando ofertas en tu zona...'
                : 'Actívate para recibir ofertas en tiempo real'}
            </Text>
          </View>
        </View>

        {/* Lado derecho: switch */}
        <View style={styles.right}>
          {/* Switch personalizado */}
          <Pressable onPress={handleToggle} hitSlop={8}>
            <Animated.View style={[styles.switchTrack, { backgroundColor: switchBg }]}>
              <Animated.View
                style={[
                  styles.switchThumb,
                  { transform: [{ translateX: thumbTranslate }] },
                ]}
              >
                <Ionicons
                  name={isAvailable ? 'flash' : 'moon-outline'}
                  size={10}
                  color={isAvailable ? '#10B981' : Colors.textLight}
                />
              </Animated.View>
            </Animated.View>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  inactiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Switch personalizado
  switchTrack: {
    width: 52,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },

});