// src/components/feed/CreatePostBox.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CreatePostBoxProps {
  onPress?: () => void;
  userAvatar?: string;
  userName?: string;
}

export const CreatePostBox: React.FC<CreatePostBoxProps> = ({
  onPress,
  userAvatar,
  userName = 'Usuario',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatar}>
          {userAvatar ? (
            <Image source={{ uri: userAvatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Input Button */}
        <TouchableOpacity style={styles.inputButton} onPress={onPress}>
          <Text style={styles.inputText}>¿Qué estás pensando?</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="image-outline" size={20} color="#10b981" />
          <Text style={styles.actionLabel}>Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="chatbox-ellipses-outline" size={20} color="#f59e0b" />
          <Text style={styles.actionLabel}>Cita</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
          <Text style={styles.actionLabel}>Blog</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="help-circle-outline" size={20} color="#8b5cf6" />
          <Text style={styles.actionLabel}>Ayuda</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 8,
    borderBottomColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e9d5ff',
    overflow: 'hidden',
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
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  inputButton: {
    flex: 1,
    height: 44,
    backgroundColor: '#f3f4f6',
    borderRadius: 22,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 15,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
});