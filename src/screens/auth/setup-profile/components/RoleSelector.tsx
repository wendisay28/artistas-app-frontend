// src/screens/auth/setup-profile/components/RoleSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserRole } from '../../../../types/User';

interface Props {
  selectedRole: UserRole | null;
  onSelect: (role: UserRole) => void;
}

const ROLES = [
  {
    id: 'artist' as UserRole,
    emoji: '🎨',
    title: 'Soy Artista',
    description: 'Músico, actor, fotógrafo, bailarín o cualquier creativo. Muestra tu talento y recibe ofertas.',
  },
  {
    id: 'client' as UserRole,
    emoji: '🎤',
    title: 'Busco Artistas',
    description: 'Organiza eventos, contrata talento creativo y gestiona tus proyectos culturales.',
  },
];

export const RoleSelector = ({ selectedRole, onSelect }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>¿Cómo usarás BuscartPro?</Text>
    <Text style={styles.subtitle}>Podrás cambiar esto más adelante desde tu perfil</Text>
    <View style={styles.cards}>
      {ROLES.map((r) => (
        <TouchableOpacity
          key={r.id}
          style={[styles.card, selectedRole === r.id && styles.cardSelected]}
          onPress={() => onSelect(r.id)}
          activeOpacity={0.85}
          accessibilityRole="radio"
          accessibilityState={{ selected: selectedRole === r.id }}
        >
          <Text style={styles.emoji}>{r.emoji}</Text>
          <Text style={[styles.roleTitle, selectedRole === r.id && styles.roleTitleSelected]}>
            {r.title}
          </Text>
          <Text style={styles.roleDesc}>{r.description}</Text>
          {selectedRole === r.id && <View style={styles.checkDot} />}
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: '800', color: '#1A1A2E', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#B2BEC3', marginBottom: 24 },
  cards: { gap: 14 },
  card: {
    padding: 20, borderRadius: 16, borderWidth: 2,
    borderColor: '#E8ECEF', backgroundColor: '#FFF', position: 'relative',
  },
  cardSelected: { borderColor: '#6C5CE7', backgroundColor: '#F5F3FF' },
  emoji: { fontSize: 32, marginBottom: 8 },
  roleTitle: { fontSize: 18, fontWeight: '700', color: '#2D3436' },
  roleTitleSelected: { color: '#6C5CE7' },
  roleDesc: { fontSize: 13, color: '#636E72', marginTop: 4, lineHeight: 18 },
  checkDot: {
    position: 'absolute', top: 16, right: 16,
    width: 20, height: 20, borderRadius: 10, backgroundColor: '#6C5CE7',
  },
});