// components/profile/sections/GallerySection.tsx

import React from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GallerySectionProps {
  images: string[];
  onImagePress: (index: number) => void;
}

export default function GallerySection({
  images,
  onImagePress,
}: GallerySectionProps) {
  return (
    <View style={styles.galleryGrid}>
      {images.map((img, index) => (
        <Pressable
          key={index}
          onPress={() => onImagePress(index)}
          style={({ pressed }) => [
            styles.galleryItem,
            pressed && styles.galleryItemPressed,
          ]}
        >
          <Image
            source={{ uri: img }}
            style={styles.galleryImage}
            contentFit="cover"
            transition={200}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
  },
  galleryItem: {
    width: SCREEN_WIDTH / 3 - 2,
    height: SCREEN_WIDTH / 3 - 2,
    margin: 1,
  },
  galleryItemPressed: {
    opacity: 0.85,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
});