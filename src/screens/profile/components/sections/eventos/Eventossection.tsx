import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ArtistEvent, EventSubTab } from '../../types';
import { TabBar } from '../../shared';
import { ManageEventCard } from '../../cards';
import { Colors, Radius, Spacing } from '../../../../../theme';
import { EditButton } from '../../shared/EditButton';
import { useThemeStore } from '../../../../../store/themeStore';

type Props = {
  events: ArtistEvent[];
  isOwner?: boolean;
  onEditSection?: () => void;
};

const SUB_TABS: Array<{
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}> = [
  { key: 'gestionar', label: 'Gestionar', icon: 'settings-outline' as const },
  { key: 'publicados', label: 'Publicados', icon: 'megaphone-outline' as const },
];

export const EventosSection: React.FC<Props> = ({ events, isOwner, onEditSection }) => {
  const [sub, setSub] = useState<EventSubTab>('gestionar');
  const { isDark } = useThemeStore();

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#0a0618' }]}>
      <View style={styles.sectionHeader}>
        <TabBar
          tabs={SUB_TABS}
          active={sub}
          onSelect={k => setSub(k as EventSubTab)}
          variant="pill"
        />
        {isOwner && (
          <EditButton onPress={onEditSection || (() => {})} />
        )}
      </View>

      {sub === 'gestionar' && (
        <>
          {/* Create button */}
          <TouchableOpacity
            style={[styles.createBtn, isDark && { backgroundColor: 'rgba(212,168,83,0.05)', borderColor: 'rgba(212,168,83,0.2)' }]}
            activeOpacity={0.8}
          >
            <View style={styles.plusIcon}>
              <Text style={styles.plusText}>+</Text>
            </View>
            <Text style={styles.createLabel}>Crear nuevo evento</Text>
          </TouchableOpacity>

          <Text style={[styles.sectionLabel, isDark && { color: 'rgba(255,255,255,0.35)' }]}>MIS EVENTOS</Text>

          {events.map(event => (
            <ManageEventCard
              key={event.id}
              event={event}
              onEdit={() => {}}
              onPublish={() => {}}
              onCancel={() => {}}
              onCheckin={() => {}}
              onSendLink={() => {}}
            />
          ))}
        </>
      )}

      {sub === 'publicados' && events.map(event => (
        <View key={event.id} style={[styles.eventCard, isDark && { backgroundColor: '#130d2a', borderColor: 'rgba(139,92,246,0.2)' }]}>
          <Text style={[styles.eventTitle, isDark && { color: '#f5f3ff' }]}>{event.title}</Text>
          <Text style={[styles.eventDate, isDark && { color: '#71717A' }]}>{event.dateLabel}</Text>
          <Text style={[styles.eventLocation, isDark && { color: '#71717A' }]}>{event.location}</Text>
          <View style={[styles.statusBadge, event.status === 'live' && styles.statusLive]}>
            <Text style={[styles.statusText, isDark && { color: '#9ca3af' }]}>{event.status}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  createBtn: {
    width: '100%',
    padding: Spacing.md,
    backgroundColor: 'rgba(212,168,83,0.07)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.3)',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: Spacing.md,
  },
  plusIcon: {
    width: 32, height: 32,
    backgroundColor: 'rgba(212,168,83,0.15)',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: { fontSize: 18, fontWeight: '700', color: Colors.accent },
  createLabel: { fontSize: 13, fontWeight: '600', color: Colors.accent },
  sectionLabel: {
    fontSize: 10.5, fontWeight: '700', textTransform: 'uppercase',
    color: Colors.text, marginBottom: Spacing.md,
  },
  eventCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface2,
    alignSelf: 'flex-start',
  },
  statusLive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
});
