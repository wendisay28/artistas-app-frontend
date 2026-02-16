// src/screens/auth/login/index.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useAuthStore } from '../../../store/authStore';
import { useLogin } from './hooks/useLogin';
import { LoginHeader } from './components/LoginHeader';
import { SocialButton } from './components/SocialButton';

export const LoginScreen = () => {
  const { error } = useAuthStore();
  const { handleGoogleLogin, handleAppleLogin, handleTempLogin, isGoogleLoading, isAppleLoading } = useLogin();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <LoginHeader />

        <View style={styles.buttons}>
          <SocialButton
            provider="google"
            onPress={handleGoogleLogin}
            isLoading={isGoogleLoading}
          />
          {Platform.OS === 'ios' && (
            <SocialButton
              provider="apple"
              onPress={handleAppleLogin}
              isLoading={isAppleLoading}
            />
          )}
          
          {/* Botón temporal para desarrollo */}
          <SocialButton
            provider="temp"
            onPress={handleTempLogin}
            isLoading={isGoogleLoading}
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Text style={styles.terms}>
          Al continuar, aceptas nuestros{' '}
          <Text style={styles.link}>Términos de Servicio</Text> y{' '}
          <Text style={styles.link}>Política de Privacidad</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', paddingBottom: 32 },
  buttons: { gap: 4 },
  error: { color: '#E84393', textAlign: 'center', fontSize: 14, marginTop: 8 },
  terms: { textAlign: 'center', fontSize: 12, color: '#B2BEC3', lineHeight: 18 },
  link: { color: '#6C5CE7', fontWeight: '600' },
});