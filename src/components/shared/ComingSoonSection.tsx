import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ComingSoonSectionProps {
  title: string;
  subtitle?: string;
}

export const ComingSoonSection: React.FC<ComingSoonSectionProps> = ({ 
  title, 
  subtitle = "Estamos construyendo algo nuevo para ti" 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="construct-outline" size={32} color="#9333ea" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.comingSoon}>Próximamente</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(124,58,237,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.1)',
    borderStyle: 'dashed',
    marginHorizontal: 16,
    minHeight: 120,
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#9333ea',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(124,58,237,0.7)',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  comingSoon: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.5)',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
