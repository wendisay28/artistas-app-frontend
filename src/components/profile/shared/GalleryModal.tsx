// components/profile/shared/GalleryModal.tsx

import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GalleryModalProps {
  visible: boolean;
  images: string[];
  selectedIndex: number;
  topInset: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function GalleryModal({
  visible,
  images,
  selectedIndex,
  topInset,
  onClose,
  onPrevious,
  onNext,
}: GalleryModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBg}>
        {/* Close Button */}
        <Pressable
          style={[styles.modalCloseBtn, { top: topInset + 12 }]}
          onPress={onClose}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </Pressable>

        {/* Main Image */}
        <Image
          source={{ uri: images[selectedIndex] }}
          style={styles.modalImage}
          contentFit="contain"
          transition={200}
        />

        {/* Navigation */}
        <View style={styles.modalNav}>
          <Pressable onPress={onPrevious} style={styles.modalArrow}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </Pressable>

          <Text style={styles.modalCounter}>
            {selectedIndex + 1} / {images.length}
          </Text>

          <Pressable onPress={onNext} style={styles.modalArrow}>
            <Ionicons name="chevron-forward" size={28} color="#fff" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtn: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  modalImage: {
    width: SCREEN_WIDTH * 0.92,
    height: SCREEN_WIDTH * 0.92,
  },
  modalNav: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  modalArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCounter: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.7)',
  },
});