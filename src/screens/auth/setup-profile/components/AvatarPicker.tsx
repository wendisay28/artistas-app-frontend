// src/screens/auth/setup-profile/components/AvatarPicker.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface Props {
  photoURI: string | null;
  displayName: string;
  onPickPhoto: () => void;
  onChangeName: (name: string) => void;
}

import { TextInput } from 'react-native';

export const AvatarPicker = ({ photoURI, displayName, onPickPhoto, onChangeName }: Props) => {
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu perfil</Text>
      <Text style={styles.subtitle}>Añade una foto y tu nombre artístico o real</Text>

      <TouchableOpacity style={styles.avatarWrap} onPress={onPickPhoto} activeOpacity={0.8}>
        {photoURI ? (
          <Image source={{ uri: photoURI }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.initials}>{initials || '?'}</Text>
          </View>
        )}
        <View style={styles.editBadge}>
          <Text style={styles.editIcon}>✏️</Text>
        </View>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={onChangeName}
        placeholder="Tu nombre"
        placeholderTextColor="#B2BEC3"
        maxLength={50}
        returnKeyType="done"
        autoCapitalize="words"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#1A1A2E', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#B2BEC3', marginBottom: 32, textAlign: 'center' },
  avatarWrap: { marginBottom: 24, position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarFallback: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#6C5CE7', justifyContent: 'center', alignItems: 'center',
  },
  initials: { fontSize: 32, fontWeight: '700', color: '#FFF' },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#FFF', borderRadius: 14, padding: 4,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  editIcon: { fontSize: 14 },
  input: {
    width: '100%', height: 52, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E8ECEF',
    paddingHorizontal: 16, fontSize: 16, color: '#2D3436',
    backgroundColor: '#FFF',
  },
});