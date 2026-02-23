import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ArtistEvent, EventSubTab } from '../types';
import { TabBar } from '../shared';
import { EventCard, ManageEventCard } from '../cards';
import { Colors, Radius, Spacing } from '../../../../theme';
import { EditButton } from '../shared/EditButton';

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

  return (
    <View style={styles.container}>
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
          <TouchableOpacity style={styles.createBtn} activeOpacity={0.8}>
            <View style={styles.plusIcon}>
              <Text style={styles.plusText}>+</Text>
            </View>
            <Text style={styles.createLabel}>Crear nuevo evento</Text>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>MIS EVENTOS</Text>

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
        <EventCard 
          key={event.id} 
          title={event.title}
          date={event.dateLabel}
          location={event.location}
          status={event.status}
          onPress={() => {}}
        />
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
});