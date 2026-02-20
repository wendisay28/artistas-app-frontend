// src/screens/onboarding/WelcomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../constants/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleClientPress = () => {
    navigation.navigate('Location', { userType: 'client' });
  };

  const handleArtistPress = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>¿Cómo quieres usar Buscart?</Text>
          <Text style={styles.subtitle}>Elige tu experiencia personalizada</Text>
        </View>

        <View style={styles.cards}>
          <TouchableOpacity 
            style={styles.card} 
            onPress={handleClientPress}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="search" size={32} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Soy Cliente</Text>
            <Text style={styles.cardDescription}>
              Encuentra y contrata talento cerca de ti
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={handleArtistPress}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="color-palette-outline" size={32} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Soy Artista</Text>
            <Text style={styles.cardDescription}>
              Muestra tu trabajo y consigue clientes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  cards: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
