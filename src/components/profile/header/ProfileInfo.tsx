// components/profile/header/ProfileInfo.tsx

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../constants/colors';
import StatsBar from '../StatsBar';
import QuickActions from '../QuickActions';

interface ProfileInfoProps {
  userName: string;
  userCategory: string;
  userLocation: string;
  avatarLetter: string;
  stats: {
    works: number;
    rating: number;
    followers: number;
    visits: string;
  };
  onEditPress?: () => void;
  onQuickActionPress?: (action: 'add' | 'camera' | 'link' | 'qr') => void;
}

export default function ProfileInfo({
  userName,
  userCategory,
  userLocation,
  avatarLetter,
  stats,
  onEditPress,
  onQuickActionPress,
}: ProfileInfoProps) {
  
  return (
    <View style={styles.container}>
      {/* Avatar y info */}
      <View style={styles.profileRow}>
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            style={styles.avatarBorder}
          >
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.profileMeta}>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileTag}>{userCategory}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={12} color={colors.primary} />
            <Text style={styles.locationText}>{userLocation}</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.editBtn,
            pressed && styles.editBtnPressed,
          ]}
          onPress={onEditPress}
        >
          <Ionicons name="create-outline" size={18} color={colors.primary} />
        </Pressable>
      </View>

      {/* Stats Bar */}
      <StatsBar
        works={stats.works}
        rating={stats.rating}
        followers={stats.followers}
        visits={stats.visits}
      />

      {/* Quick Actions */}
      <QuickActions onActionPress={onQuickActionPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: -36,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  avatarSection: {},
  avatarBorder: {
    width: 78,
    height: 78,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 72,
    height: 72,
    borderRadius: 19,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  profileMeta: {
    flex: 1,
    marginLeft: 14,
    marginTop: 36,
  },
  profileName: {
    fontSize: 19,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  profileTag: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
    marginTop: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  locationText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
  },
  editBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});