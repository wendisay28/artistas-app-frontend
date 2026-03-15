// src/screens/home/components/ProfileBanner.tsx
// Optimizado para rendimiento máximo

import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Animated, Easing, Platform
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
      duration: 1000, // Un poco más rápido para dar sensación de agilidad
      easing: Easing.out(Easing.quad),
      useNativeDriver: false, // width no soporta native driver
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

  const barColors: [string, string] =
    pct < 40 ? ['#f59e0b', '#f97316'] :
    pct < 75 ? ['#7c3aed', '#2563eb'] :
               ['#059669', '#0891b2'];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={s.container}>
      
      {/* OPTIMIZACIÓN: Solo renderiza BlurView si no es Android o si es un Android potente */}
      <BlurView 
        intensity={Platform.OS === 'ios' ? 65 : 40} 
        tint="light" 
        experimentalBlurMethod="none" // Cambiar a 'dips' si ves que en Android se ve mal
        style={StyleSheet.absoluteFill} 
      />
      
      <LinearGradient
        colors={['rgba(255,255,255,0.88)', 'rgba(245,243,255,0.6)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={s.inner}>
        <LinearGradient colors={['#7c3aed', '#4f46e5']} style={s.icon}>
          <Ionicons name="person" size={16} color="#fff" />
        </LinearGradient>

        <View style={s.center}>
          <View style={s.topRow}>
            <Text style={s.title}>Completa tu perfil</Text>
            <Text style={s.pct}>{pct}%</Text>
          </View>

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

        <Ionicons name="chevron-forward" size={15} color="rgba(124,58,237,0.4)" />
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
    borderColor: 'rgba(255,255,255,0.8)',
    // Quitamos sombras pesadas si hay lag en el scroll
    elevation: 3,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 11,
    gap: 11,
  },
  icon: {
    width: 36, height: 36,
    borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
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
  },
  pct: {
    fontSize: 12.5,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#7c3aed',
  },
  track: {
    height: 4,
    backgroundColor: 'rgba(124,58,237,0.1)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 10 },
  hint: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.6)',
  },
});

export default ProfileBanner;