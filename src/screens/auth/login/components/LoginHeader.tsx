// src/screens/auth/login/components/LoginHeader.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export const LoginHeader = () => (
  <View style={styles.container}>
    <Text style={styles.emoji}>🎭</Text>
    <Text style={styles.title}>BuscartPro</Text>
    <Text style={styles.subtitle}>Conecta con el talento creativo</Text>
    <Text style={styles.description}>
      Descubre artistas, publica ofertas y construye tu red cultural
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 48,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C5CE7',
    marginTop: 6,
  },
  description: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});