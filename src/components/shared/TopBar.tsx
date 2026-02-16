import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { auth } from '../../services/firebase/config';

interface TopBarProps {
  title: string;
  topInset: number;
  rightActions?: React.ReactNode;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
}

export default function TopBar({
  title,
  topInset,
  rightActions,
  onNotificationPress,
  onSettingsPress,
}: TopBarProps) {
  const user = auth.currentUser;

  return (
    <View style={[styles.container, { paddingTop: topInset + 8 }]}>
      {/* Avatar */}
      {user?.photoURL ? (
        <Image source={{ uri: user.photoURL }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Ionicons name="person" size={16} color={colors.textSecondary} />
        </View>
      )}

      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Right actions */}
      <View style={styles.rightActions}>
        {rightActions ?? (
          <>
            <Pressable
              onPress={onNotificationPress}
              style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.text} />
            </Pressable>
            <Pressable
              onPress={onSettingsPress}
              style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
            >
              <Ionicons name="settings-outline" size={22} color={colors.text} />
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    zIndex: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    marginLeft: 12,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
