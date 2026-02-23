// components/hiring/banners/RealTimeOfferBanner.tsx
//
// Banner que aparece en la parte superior del feed cuando hay ofertas
// en tiempo real activas. Solo visible si el artista está disponible
// O si el cliente tiene ofertas urgentes sin respuesta.

import React, { useEffect, useRef } from 'react';
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

interface RealTimeOffer {
  id: string;
  title: string;
  budget_max?: number;
  location?: string;
  expires_at: string; // ISO date — cuándo expira la oferta (máx 8h)
  category?: string;
}

interface RealTimeOfferBannerProps {
  offers: RealTimeOffer[];
  onOfferPress: (offerId: string) => void;
  onDismiss?: () => void;
}

function useCountdown(expiresAt: string) {
  const [remaining, setRemaining] = React.useState('');

  useEffect(() => {
    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining('Expirada');
        return;
      }
      const mins = Math.floor(diff / 60000);
      const hours = Math.floor(mins / 60);
      if (hours > 0) setRemaining(`${hours}h ${mins % 60}m`);
      else setRemaining(`${mins}m`);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return remaining;
}

function SingleOfferBanner({
  offer,
  onPress,
}: {
  offer: RealTimeOffer;
  onPress: () => void;
}) {
  const remaining = useCountdown(offer.expires_at);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [pressed && { opacity: 0.92 }]}
    >
      <LinearGradient
        colors={['#EF4444', '#DC2626']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.singleBanner}
      >
        {/* Punto pulsante */}
        <View style={styles.pulseWrapper}>
          <Animated.View
            style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]}
          />
          <View style={styles.pulseDot} />
        </View>

        <View style={styles.bannerContent}>
          <Text style={styles.bannerLabel}>OFERTA EN TIEMPO REAL</Text>
          <Text style={styles.bannerTitle} numberOfLines={1}>
            {offer.title}
          </Text>
          <View style={styles.bannerMeta}>
            {offer.category && (
              <Text style={styles.bannerMetaText}>{offer.category}</Text>
            )}
            {offer.location && (
              <>
                <Text style={styles.bannerDot}>·</Text>
                <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.bannerMetaText}>{offer.location}</Text>
              </>
            )}
            {offer.budget_max && (
              <>
                <Text style={styles.bannerDot}>·</Text>
                <Text style={styles.bannerBudget}>Hasta ${offer.budget_max}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.bannerRight}>
          <View style={styles.timerBadge}>
            <Ionicons name="time-outline" size={12} color="#EF4444" />
            <Text style={styles.timerText}>{remaining}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export default function RealTimeOfferBanner({
  offers,
  onOfferPress,
  onDismiss,
}: RealTimeOfferBannerProps) {
  const slideAnim = useRef(new Animated.Value(-80)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (offers.length === 0) return;
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 14,
        bounciness: 6,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [offers.length]);

  if (offers.length === 0) return null;

  // Si hay múltiples ofertas mostramos un resumen compacto
  if (offers.length > 1) {
    return (
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY: slideAnim }], opacity: opacityAnim },
        ]}
      >
        <Pressable
          onPress={() => onOfferPress(offers[0].id)}
          style={({ pressed }) => [pressed && { opacity: 0.92 }]}
        >
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.multiBanner}
          >
            <View style={styles.multiLeft}>
              <Ionicons name="flame" size={20} color="#FFFFFF" />
              <View>
                <Text style={styles.multiTitle}>
                  {offers.length} ofertas urgentes cerca de ti
                </Text>
                <Text style={styles.multiSubtitle}>
                  Expiran en menos de 8 horas · Toca para ver
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }], opacity: opacityAnim },
      ]}
    >
      <SingleOfferBanner
        offer={offers[0]}
        onPress={() => onOfferPress(offers[0].id)}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 2,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  // Banner oferta única
  singleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  pulseWrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  bannerContent: {
    flex: 1,
  },
  bannerLabel: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1,
    marginBottom: 2,
  },
  bannerTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bannerMetaText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  bannerDot: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  bannerBudget: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FDE68A',
  },
  bannerRight: {
    alignItems: 'center',
    gap: 6,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#EF4444',
  },

  // Banner múltiples ofertas
  multiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    gap: 12,
  },
  multiLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  multiTitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },
  multiSubtitle: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.75)',
    marginTop: 1,
  },
});