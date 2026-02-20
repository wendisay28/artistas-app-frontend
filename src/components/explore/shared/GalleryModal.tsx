// GalleryModal.tsx — Fullscreen image viewer with nav arrows + thumbnails

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: W, height: H } = Dimensions.get('window');

interface GalleryModalProps {
  images:       string[];
  initialIndex: number;
  onClose:      () => void;
}

export default function GalleryModal({ images, initialIndex, onClose }: GalleryModalProps) {
  const [index, setIndex] = useState(initialIndex);
  const insets = useSafeAreaInsets();

  const prev = () => setIndex(i => Math.max(0, i - 1));
  const next = () => setIndex(i => Math.min(images.length - 1, i + 1));

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.bg}>

        {/* close */}
        <Pressable
          onPress={onClose}
          style={[styles.closeBtn, { top: insets.top + 12 }]}
        >
          <Ionicons name="close" size={22} color="#fff" />
        </Pressable>

        {/* counter */}
        <View style={[styles.counter, { top: insets.top + 16 }]}>
          <Text style={styles.counterText}>{index + 1} / {images.length}</Text>
        </View>

        {/* main image */}
        <Image
          source={{ uri: images[index] }}
          style={styles.image}
          contentFit="contain"
          transition={200}
        />

        {/* arrows */}
        {index > 0 && (
          <Pressable onPress={prev} style={[styles.arrow, styles.arrowLeft]}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </Pressable>
        )}
        {index < images.length - 1 && (
          <Pressable onPress={next} style={[styles.arrow, styles.arrowRight]}>
            <Ionicons name="chevron-forward" size={28} color="#fff" />
          </Pressable>
        )}

        {/* thumbnails */}
        <View style={[styles.thumbsRow, { paddingBottom: insets.bottom + 16 }]}>
          {images.map((img, i) => (
            <Pressable
              key={i}
              onPress={() => setIndex(i)}
              style={[styles.thumb, i === index && styles.thumbActive]}
            >
              <Image source={{ uri: img }} style={styles.thumbImg} contentFit="cover" />
            </Pressable>
          ))}
        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bg:          { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  closeBtn:    { position: 'absolute', right: 16, zIndex: 10, backgroundColor: 'rgba(255,255,255,.15)', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  counter:     { position: 'absolute', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,.5)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, zIndex: 10 },
  counterText: { fontSize: 13, color: '#fff', fontFamily: 'PlusJakartaSans_500Medium' },
  image:       { width: W * 0.92, height: H * 0.62 },
  arrow:       { position: 'absolute', top: '45%', backgroundColor: 'rgba(255,255,255,.15)', borderRadius: 24, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  arrowLeft:   { left: 12 },
  arrowRight:  { right: 12 },
  thumbsRow:   { position: 'absolute', bottom: 0, flexDirection: 'row', gap: 8, paddingHorizontal: 16 },
  thumb:       { width: 54, height: 54, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  thumbActive: { borderColor: '#E63946', transform: [{ scale: 1.08 }] },
  thumbImg:    { width: '100%', height: '100%' },
});