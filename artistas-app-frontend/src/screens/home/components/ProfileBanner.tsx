// src/screens/home/components/ProfileBanner.tsx

import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Animated, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  pct:      number;
  onPress:  () => void;
  completed?: Record<string, boolean>;
};

export const ProfileBanner: React.FC<Props> = ({ pct, onPress }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: pct,
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 100], outputRange: ['0%', '100%'],
  });

  const getMessage = () => {
    if (pct < 30) return 'Agrega foto, bio y ciudad para empezar';
    if (pct < 60) return 'Añade tus disciplinas y redes sociales';
    if (pct < 90) return 'Ya casi — un paso más y listo';
    return '¡Perfil casi completo, sigue así!';
  };

  // Color de la barra según avance
  const barColors: [string, string] =
    pct < 40 ? ['#f59e0b', '#f97316'] :
    pct < 75 ? ['#7c3aed', '#2563eb'] :
               ['#059669', '#0891b2'];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={s.container}>
      <BlurView intensity={65} tint="light" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(255,255,255,0.85)', 'rgba(237,233,255,0.5)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={s.inner}>

        {/* Ícono */}
        <LinearGradient colors={['#7c3aed', '#4f46e5']} style={s.icon}>
          <Ionicons name="person" size={16} color="#fff" />
        </LinearGradient>

        {/* Centro */}
        <View style={s.center}>
          <View style={s.topRow}>
            <Text style={s.title}>Completa tu perfil</Text>
            <Text style={s.pct}>{pct}%</Text>
          </View>

          {/* Barra */}
          <View style={s.track}>
            <Animated.View style={[s.fill, { width: barWidth }]}>
              <LinearGradient
                colors={barColors}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>

          <Text style={s.hint}>{getMessage()}</Text>
        </View>

        {/* Flecha */}
        <Ionicons name="chevron-forward" size={15} color="rgba(124,58,237,0.5)" />

      </View>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 11,   // ← más angosto que antes (era 14)
    gap: 11,
  },

  // Ícono
  icon: {
    width: 36, height: 36,
    borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
  },

  // Centro
  center: { flex: 1, gap: 5 },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 12.5,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
    letterSpacing: -0.1,
  },
  pct: {
    fontSize: 12.5,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#7c3aed',
  },

  // Barra
  track: {
    height: 4,
    backgroundColor: 'rgba(124,58,237,0.1)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 10,
  },

  // Hint
  hint: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.55)',
  },
});