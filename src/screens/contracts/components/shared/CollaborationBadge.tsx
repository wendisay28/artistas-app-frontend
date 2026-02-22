// components/hiring/badges/CollaborationBadge.tsx
//
// Se renderiza dentro de una contratación confirmada para mostrar
// las colaboraciones asociadas a ese evento. Puede estar en estado
// buscando, confirmada o sin colaboraciones (con opción de añadir).

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../../../theme/colors';

export type CollaborationStatus = 'searching' | 'confirmed' | 'pending';

export interface Collaboration {
  id: string;
  role: string; // ej: "Guitarrista", "Fotógrafo"
  status: CollaborationStatus;
  artist_name?: string;   // si ya está confirmado
  artist_avatar?: string;
  expires_at?: string;    // si está buscando en tiempo real
}

interface CollaborationBadgeProps {
  collaborations: Collaboration[];
  /** Si el artista puede añadir más colaboraciones a este evento */
  canAddMore?: boolean;
  onAddCollaboration?: () => void;
  onCollaborationPress?: (collaborationId: string) => void;
}

const STATUS_CONFIG: Record<CollaborationStatus, {
  color: string;
  bg: string;
  label: string;
  icon: string;
}> = {
  searching: {
    color: '#F59E0B',
    bg: '#F59E0B15',
    label: 'Buscando',
    icon: 'search',
  },
  confirmed: {
    color: '#10B981',
    bg: '#10B98115',
    label: 'Confirmado',
    icon: 'checkmark-circle',
  },
  pending: {
    color: '#3B82F6',
    bg: '#3B82F615',
    label: 'Pendiente',
    icon: 'time',
  },
};

function getInitials(name?: string): string {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function CollaborationRow({
  collab,
  onPress,
}: {
  collab: Collaboration;
  onPress: () => void;
}) {
  const config = STATUS_CONFIG[collab.status];

  const handlePress = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.collabRow, pressed && { opacity: 0.75 }]}
    >
      {/* Avatar o placeholder */}
      <View style={[styles.avatar, !collab.artist_name && styles.avatarEmpty]}>
        {collab.artist_name ? (
          <Text style={styles.avatarText}>{getInitials(collab.artist_name)}</Text>
        ) : (
          <Ionicons name="person-outline" size={14} color={Colors.textLight} />
        )}
      </View>

      {/* Info */}
      <View style={styles.collabInfo}>
        <Text style={styles.collabRole}>{collab.role}</Text>
        <Text style={styles.collabArtist} numberOfLines={1}>
          {collab.artist_name ?? 'Sin asignar'}
        </Text>
      </View>

      {/* Estado */}
      <View style={[styles.statusPill, { backgroundColor: config.bg }]}>
        <Ionicons name={config.icon as any} size={11} color={config.color} />
        <Text style={[styles.statusText, { color: config.color }]}>
          {config.label}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={14} color={Colors.textLight} />
    </Pressable>
  );
}

export default function CollaborationBadge({
  collaborations,
  canAddMore = true,
  onAddCollaboration,
  onCollaborationPress,
}: CollaborationBadgeProps) {
  const isEmpty = collaborations.length === 0;

  return (
    <View style={styles.container}>
      {/* Header de sección */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <MaterialCommunityIcons
            name="account-group-outline"
            size={16}
            color={Colors.textSecondary}
          />
          <Text style={styles.sectionTitle}>
            Colaboraciones
            {collaborations.length > 0 && (
              <Text style={styles.sectionCount}> ({collaborations.length})</Text>
            )}
          </Text>
        </View>

        {canAddMore && (
          <Pressable
            onPress={onAddCollaboration}
            hitSlop={8}
            style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="add" size={15} color={Colors.primary} />
            <Text style={styles.addBtnText}>Añadir</Text>
          </Pressable>
        )}
      </View>

      {/* Lista de colaboraciones */}
      {isEmpty ? (
        <View style={styles.emptyRow}>
          <Ionicons name="people-outline" size={16} color={Colors.textLight} />
          <Text style={styles.emptyText}>
            Sin colaboraciones para este evento
          </Text>
        </View>
      ) : (
        <View style={styles.collabList}>
          {collaborations.map((collab, index) => (
            <React.Fragment key={collab.id}>
              <CollaborationRow
                collab={collab}
                onPress={() => onCollaborationPress?.(collab.id)}
              />
              {index < collaborations.length - 1 && (
                <View style={styles.rowDivider} />
              )}
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceAlt ?? '#F4F6FA',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.textSecondary,
  },
  sectionCount: {
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textLight,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: Colors.primary + '12',
  },
  addBtnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.primary,
  },

  // Fila de colaboración
  collabList: {
    paddingVertical: 4,
  },
  collabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginHorizontal: 14,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmpty: {
    backgroundColor: Colors.border,
  },
  avatarText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.primary,
  },
  collabInfo: {
    flex: 1,
  },
  collabRole: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  collabArtist: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },

  // Estado vacío
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textLight,
  },
});