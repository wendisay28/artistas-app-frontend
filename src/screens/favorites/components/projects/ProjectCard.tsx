// ─────────────────────────────────────────────────────────────────────────────
// ProjectCard.tsx — Tarjeta de proyecto estilo Pinterest
// Collage de hasta 4 imágenes + nombre + contador
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { Project } from '../../../../store/listsStore';

type Props = {
  project: Project;
  onPress: () => void;
  onDelete: () => void;
  onRename: () => void;
};

export const ProjectCard: React.FC<Props> = ({ project, onPress, onDelete, onRename }) => {
  const images = project.items
    .map(i => i.image)
    .filter(Boolean)
    .slice(0, 4) as string[];

  const handleLongPress = () => {
    Alert.alert(project.emoji + ' ' + project.name, undefined, [
      { text: 'Renombrar', onPress: onRename },
      { text: 'Eliminar', style: 'destructive', onPress: onDelete },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={handleLongPress}
      activeOpacity={0.88}
    >
      {/* Collage */}
      <View style={styles.collage}>
        {images.length === 0 && (
          <LinearGradient colors={['#ede8ff', '#e4eeff']} style={StyleSheet.absoluteFill}>
            <View style={styles.emptyCollage}>
              <Text style={styles.emptyEmoji}>{project.emoji}</Text>
            </View>
          </LinearGradient>
        )}

        {images.length === 1 && (
          <Image source={{ uri: images[0] }} style={StyleSheet.absoluteFill} contentFit="cover" />
        )}

        {images.length === 2 && (
          <View style={styles.collage2}>
            {images.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.col2Img} contentFit="cover" />
            ))}
          </View>
        )}

        {images.length === 3 && (
          <View style={styles.collage3}>
            <Image source={{ uri: images[0] }} style={styles.col3Left} contentFit="cover" />
            <View style={styles.col3Right}>
              {[images[1], images[2]].map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.col3SmallImg} contentFit="cover" />
              ))}
            </View>
          </View>
        )}

        {images.length >= 4 && (
          <View style={styles.collage4}>
            {images.slice(0, 4).map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.col4Img} contentFit="cover" />
            ))}
          </View>
        )}

        {/* Gradiente bottom */}
        <LinearGradient
          colors={['transparent', 'rgba(30,27,75,0.55)']}
          style={styles.gradient}
        />

        {/* Emoji top-left */}
        <View style={styles.emojiPill}>
          <Text style={styles.emojiPillText}>{project.emoji}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{project.name}</Text>
        <View style={styles.meta}>
          <Ionicons name="layers-outline" size={11} color="rgba(109,40,217,0.5)" />
          <Text style={styles.count}>
            {project.items.length} {project.items.length === 1 ? 'ítem' : 'ítems'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.18)',
    overflow: 'hidden',
    shadowColor: '#5b21b6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },

  // Collage
  collage: { height: 150, backgroundColor: '#e5e7eb' },
  emptyCollage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 42 },
  gradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
  },
  emojiPill: {
    position: 'absolute', top: 8, left: 8,
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  emojiPillText: { fontSize: 16 },

  // 2 imágenes
  collage2: { flex: 1, flexDirection: 'row', gap: 1 },
  col2Img: { flex: 1 },

  // 3 imágenes
  collage3: { flex: 1, flexDirection: 'row', gap: 1 },
  col3Left: { flex: 1.2 },
  col3Right: { flex: 0.8, gap: 1 },
  col3SmallImg: { flex: 1 },

  // 4 imágenes
  collage4: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 1 },
  col4Img: { width: '49.7%', height: '49.7%' },

  // Info
  info: { paddingHorizontal: 12, paddingVertical: 10, gap: 3 },
  name: {
    fontSize: 13.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  count: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.5)',
  },
});
