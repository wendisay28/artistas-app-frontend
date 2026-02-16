// components/profile/header/CoverHeader.tsx

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../constants/colors';

interface CoverHeaderProps {
  coverImage: string;
  topInset: number;
  onSharePress?: () => void;
  onMenuPress?: () => void;
}

export default function CoverHeader({
  coverImage,
  topInset,
  onSharePress,
  onMenuPress,
}: CoverHeaderProps) {
  
  const handleSharePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSharePress?.();
  };

  const handleMenuPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onMenuPress?.();
  };

  return (
    <View style={styles.coverSection}>
      <Image
        source={{ uri: coverImage }}
        style={[styles.coverImage, { paddingTop: topInset }]}
        contentFit="cover"
        transition={200}
      />
      
      <LinearGradient
        colors={['rgba(26,26,46,0.3)', 'rgba(26,26,46,0.85)']}
        style={styles.coverGradient}
      />

      <View style={[styles.coverTopBar, { top: topInset + 8 }]}>
        <Text style={styles.coverLogo}>A</Text>
        
        <View style={styles.coverActions}>
          <Pressable
            style={({ pressed }) => [
              styles.coverIconBtn,
              pressed && styles.coverIconBtnPressed,
            ]}
            onPress={handleSharePress}
          >
            <Ionicons name="share-outline" size={18} color="#fff" />
          </Pressable>
          
          <Pressable
            style={({ pressed }) => [
              styles.coverIconBtn,
              pressed && styles.coverIconBtnPressed,
            ]}
            onPress={handleMenuPress}
          >
            <Ionicons name="ellipsis-horizontal" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  coverSection: {
    height: 180,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  coverTopBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coverLogo: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.primary,
  },
  coverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  coverIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverIconBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});