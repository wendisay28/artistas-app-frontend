// components/hiring/hub/MyContractionsHub.tsx
//
// Capa 2 de la pestaña Contratar. Gestión completa de todas las
// solicitudes activas y pasadas, ordenadas por urgencia de acción.

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../theme/colors';

// ── Tipos ────────────────────────────────────────────────────────────────────

export type HubFilter = 'urgent' | 'received' | 'sent' | 'collaborations' | 'history';

export type ContractStatus =
  | 'pending_me'       // Pendiente de MI respuesta — prioridad máxima
  | 'pending_other'    // Esperando respuesta del otro
  | 'active'           // En curso, confirmada
  | 'closed';          // Finalizada

export interface ContractItem {
  id: string;
  title: string;
  counterpart_name: string;  // cliente o artista según el rol
  counterpart_avatar?: string;
  status: ContractStatus;
  offer_type: 'hiring' | 'gig' | 'event' | 'collaboration';
  date?: string;
  budget_max?: number;
  is_sent: boolean;          // true = yo la envié, false = me la enviaron
  is_collaboration: boolean;
  parent_event_title?: string; // si es colaboración, evento padre
  updated_at: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ContractStatus, {
  label: string;
  color: string;
  bg: string;
  icon: string;
  priority: number;
}> = {
  pending_me: {
    label: 'Requiere tu respuesta',
    color: '#EF4444',
    bg: '#EF444415',
    icon: 'alert-circle',
    priority: 0,
  },
  pending_other: {
    label: 'Esperando respuesta',
    color: '#F59E0B',
    bg: '#F59E0B15',
    icon: 'time',
    priority: 1,
  },
  active: {
    label: 'En curso',
    color: '#10B981',
    bg: '#10B98115',
    icon: 'checkmark-circle',
    priority: 2,
  },
  closed: {
    label: 'Finalizada',
    color: Colors.textLight,
    bg: Colors.surfaceAlt ?? '#F4F6FA',
    icon: 'close-circle',
    priority: 3,
  },
};

const FILTERS: { key: HubFilter; label: string; icon: string }[] = [
  { key: 'urgent', label: 'Pendientes', icon: 'alert-circle-outline' },
  { key: 'received', label: 'Recibidas', icon: 'arrow-down-circle-outline' },
  { key: 'sent', label: 'Enviadas', icon: 'arrow-up-circle-outline' },
  { key: 'collaborations', label: 'Colaboraciones', icon: 'people-outline' },
  { key: 'history', label: 'Historial', icon: 'time-outline' },
];

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

const AVATAR_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];
function avatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

// ── ContractRow ───────────────────────────────────────────────────────────────

function ContractRow({
  item,
  onPress,
}: {
  item: ContractItem;
  onPress: () => void;
}) {
  const config = STATUS_CONFIG[item.status];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.75 }]}
    >
      {/* Avatar */}
      <View style={[styles.rowAvatar, { backgroundColor: avatarColor(item.counterpart_name) }]}>
        <Text style={styles.rowAvatarText}>{getInitials(item.counterpart_name)}</Text>
      </View>

      {/* Contenido */}
      <View style={styles.rowContent}>
        {/* Contexto colaboración */}
        {item.is_collaboration && item.parent_event_title && (
          <View style={styles.parentEventRow}>
            <Ionicons name="link" size={10} color={Colors.textLight} />
            <Text style={styles.parentEventText} numberOfLines={1}>
              {item.parent_event_title}
            </Text>
          </View>
        )}

        <Text style={styles.rowTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.rowCounterpart} numberOfLines={1}>
          {item.is_sent ? 'Para' : 'De'} {item.counterpart_name}
        </Text>
      </View>

      {/* Derecha: estado + tiempo */}
      <View style={styles.rowRight}>
        <Text style={styles.rowTime}>{timeAgo(item.updated_at)}</Text>
        <View style={[styles.statusPill, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon as any} size={10} color={config.color} />
          <Text style={[styles.statusPillText, { color: config.color }]}>
            {config.label}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

// ── MyContractionsHub ─────────────────────────────────────────────────────────

interface MyContractionsHubProps {
  contracts: ContractItem[];
  onContractPress: (contractId: string) => void;
  pendingCount?: number;
}

export default function MyContractionsHub({
  contracts,
  onContractPress,
  pendingCount = 0,
}: MyContractionsHubProps) {
  const [activeFilter, setActiveFilter] = useState<HubFilter>('urgent');

  // Filtrar según tab activo
  const filtered = contracts
    .filter((c) => {
      switch (activeFilter) {
        case 'urgent':
          return c.status === 'pending_me' || c.status === 'pending_other';
        case 'received':
          return !c.is_sent;
        case 'sent':
          return c.is_sent;
        case 'collaborations':
          return c.is_collaboration;
        case 'history':
          return c.status === 'closed';
        default:
          return true;
      }
    })
    // Ordenar por prioridad de acción requerida
    .sort((a, b) => STATUS_CONFIG[a.status].priority - STATUS_CONFIG[b.status].priority);

  const isEmpty = filtered.length === 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Contrataciones</Text>
        {pendingCount > 0 && (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>{pendingCount}</Text>
          </View>
        )}
      </View>

      {/* Filtros horizontales */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersScroll}
      >
        {FILTERS.map((filter) => {
          const isActive = filter.key === activeFilter;
          const isUrgent = filter.key === 'urgent' && pendingCount > 0;

          return (
            <Pressable
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              style={({ pressed }) => [
                styles.filterChip,
                isActive && styles.filterChipActive,
                isUrgent && !isActive && styles.filterChipUrgent,
                pressed && { opacity: 0.75 },
              ]}
            >
              <Ionicons
                name={filter.icon as any}
                size={14}
                color={
                  isActive
                    ? '#FFFFFF'
                    : isUrgent
                    ? '#EF4444'
                    : Colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.filterChipText,
                  isActive && styles.filterChipTextActive,
                  isUrgent && !isActive && { color: '#EF4444' },
                ]}
              >
                {filter.label}
              </Text>
              {isUrgent && !isActive && (
                <View style={styles.urgentDot} />
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Lista */}
      {isEmpty ? (
        <View style={styles.emptyState}>
          <Ionicons name="file-tray-outline" size={36} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>
            {activeFilter === 'urgent'
              ? 'Todo al día'
              : 'Sin elementos aquí'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeFilter === 'urgent'
              ? 'No tienes solicitudes pendientes'
              : 'Cambia el filtro para ver otras contrataciones'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContractRow
              item={item}
              onPress={() => onContractPress(item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          scrollEnabled={false} // El scroll lo maneja el contenedor padre
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
  },
  pendingBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },

  // Filtros
  filtersScroll: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt ?? '#F4F6FA',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipUrgent: {
    borderColor: '#EF444440',
    backgroundColor: '#EF444408',
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  urgentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginLeft: 2,
  },

  // Lista
  listContent: {
    paddingBottom: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  rowAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAvatarText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },
  rowContent: {
    flex: 1,
  },
  parentEventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  parentEventText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textLight,
  },
  rowTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    marginBottom: 2,
  },
  rowCounterpart: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rowTime: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textLight,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusPillText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },

  // Empty
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});