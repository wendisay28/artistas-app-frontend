// src/components/common/Avatar.tsx
import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvatarProps {
  uri?: string;
  name: string;
  size?: number;
  verified?: boolean;
  categoryIcon?: React.ReactNode;
  style?: ViewStyle;
  showBorder?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 48,
  verified = false,
  categoryIcon,
  style,
  showBorder = true,
}) => {
  const avatarSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const getInitials = (name: string): string => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.avatar,
          avatarSize,
          showBorder && styles.avatarBorder,
        ]}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={styles.avatarImage}
            defaultSource={require('../../../assets/default-avatar.png')} // Add a default avatar
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text
              style={[
                styles.avatarText,
                { fontSize: size * 0.4 },
              ]}
            >
              {getInitials(name)}
            </Text>
          </View>
        )}
      </View>

      {/* Category Badge */}
      {categoryIcon && (
        <View
          style={[
            styles.categoryBadge,
            {
              width: size * 0.42,
              height: size * 0.42,
              borderRadius: size * 0.21,
              bottom: -size * 0.04,
              right: -size * 0.04,
              borderWidth: size * 0.04,
            },
          ]}
        >
          {categoryIcon}
        </View>
      )}

      {/* Verified Badge */}
      {verified && (
        <View
          style={[
            styles.verifiedBadge,
            {
              width: size * 0.35,
              height: size * 0.35,
              borderRadius: size * 0.175,
              top: -size * 0.02,
              right: -size * 0.02,
              padding: size * 0.02,
            },
          ]}
        >
          <View style={styles.verifiedIcon}>
            <Ionicons name="checkmark" size={size * 0.2} color="#3b82f6" />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#e9d5ff',
    overflow: 'hidden',
  },
  avatarBorder: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9d5ff',
  },
  avatarText: {
    fontWeight: '700',
    color: '#8b5cf6',
    letterSpacing: -0.5,
  },
  categoryBadge: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    // backgroundColor will be set by parent
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  verifiedIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});