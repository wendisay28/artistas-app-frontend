// components/profile/cards/CatalogCard.tsx

import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

import type { CatalogCardProps } from '../../../types/ui';

export default function CatalogCard({
  title,
  price,
  image,
  tag,
  onPress,
}: CatalogCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.catalogCard,
        pressed && styles.catalogCardPressed,
      ]}
      onPress={onPress}
    >
      <Image
        source={{ uri: image }}
        style={styles.catalogImage}
        contentFit="cover"
        transition={200}
      />
      
      {!!tag && (
        <View style={styles.catalogTag}>
          <Text style={styles.catalogTagText}>{tag}</Text>
        </View>
      )}
      
      <View style={styles.catalogInfo}>
        <Text style={styles.catalogTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.catalogPrice}>{price}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  catalogCard: {
    width: (SCREEN_WIDTH - 34) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  catalogCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  catalogImage: {
    width: '100%',
    height: 130,
  },
  catalogTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  catalogTagText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },
  catalogInfo: {
    padding: 12,
  },
  catalogTitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
    marginBottom: 4,
  },
  catalogPrice: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.primary,
  },
});