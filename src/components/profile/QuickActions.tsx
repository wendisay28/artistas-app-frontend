// components/profile/shared/QuickActions.tsx

import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../constants/colors';

interface QuickActionsProps {
  onActionPress?: (action: 'add' | 'camera' | 'link' | 'qr') => void;
}

export default function QuickActions({ onActionPress }: QuickActionsProps) {
  
  const handlePress = (action: 'add' | 'camera' | 'link' | 'qr') => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onActionPress?.(action);
  };

  return (
    <View style={styles.quickActions}>
      <Pressable
        style={({ pressed }) => [
          styles.quickActionBtn,
          styles.quickActionPrimary,
          pressed && styles.btnPressed,
        ]}
        onPress={() => handlePress('add')}
      >
        <Ionicons name="add" size={18} color="#fff" />
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.quickActionBtn,
          pressed && styles.btnPressed,
        ]}
        onPress={() => handlePress('camera')}
      >
        <Ionicons name="camera-outline" size={18} color={colors.text} />
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.quickActionBtn,
          pressed && styles.btnPressed,
        ]}
        onPress={() => handlePress('link')}
      >
        <Ionicons name="link-outline" size={18} color={colors.text} />
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.quickActionBtn,
          pressed && styles.btnPressed,
        ]}
        onPress={() => handlePress('qr')}
      >
        <Ionicons name="qr-code-outline" size={18} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 14,
    paddingHorizontal: 16,
  },
  quickActionBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  btnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
});