// components/profile/shared/BottomActions.tsx

import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../constants/colors';

interface BottomActionsProps {
  onSettingsPress?: () => void;
  onPrivacyPress?: () => void;
  onHelpPress?: () => void;
  onLogoutPress?: () => void;
}

export default function BottomActions({
  onSettingsPress,
  onPrivacyPress,
  onHelpPress,
  onLogoutPress,
}: BottomActionsProps) {
  
  const handleLogout = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onLogoutPress?.();
  };

  return (
    <View style={styles.bottomActions}>
      <Pressable
        style={({ pressed }) => [
          styles.actionRow,
          pressed && styles.actionRowPressed,
        ]}
        onPress={onSettingsPress}
      >
        <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
        <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.actionRow,
          pressed && styles.actionRowPressed,
        ]}
        onPress={onPrivacyPress}
      >
        <Ionicons name="shield-outline" size={20} color={colors.textSecondary} />
        <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.actionRow,
          pressed && styles.actionRowPressed,
        ]}
        onPress={onHelpPress}
      >
        <Ionicons name="help-circle-outline" size={20} color={colors.textSecondary} />
        <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.actionRow,
          styles.logoutRow,
          pressed && styles.logoutPressed,
        ]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomActions: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  actionRowPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  logoutRow: {
    borderBottomWidth: 0,
    justifyContent: 'center',
  },
  logoutPressed: {
    opacity: 0.8,
  },
});