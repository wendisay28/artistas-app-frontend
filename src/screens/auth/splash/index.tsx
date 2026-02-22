// src/screens/auth/splash/index.tsx
// Pantalla de splash — se muestra mientras Firebase resuelve el estado de auth

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SplashScreen = () => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 7, useNativeDriver: true }),
      ]),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#4c1d95', '#7e22ce', '#2563eb']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          {/* Logo */}
          <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
            <View style={styles.logoWrap}>
              <Text style={styles.logoBusca}>Busc</Text>
              <Text style={styles.logoArt}>rt</Text>
            </View>
          </Animated.View>

          {/* Tagline */}
          <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
            Encuentra el talento cerca de ti
          </Animated.Text>
        </View>

        {/* Footer */}
        <Animated.View style={[styles.footer, { opacity: taglineOpacity }]}>
          <View style={styles.dots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, justifyContent: 'space-between', paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  logoBusca: {
    fontSize: 52,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#ffffff',
    letterSpacing: -1,
  },
  logoArt: {
    fontSize: 52,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.80)',
    letterSpacing: 0.2,
  },
  footer: { alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 6 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: { backgroundColor: '#ffffff', width: 18 },
});
