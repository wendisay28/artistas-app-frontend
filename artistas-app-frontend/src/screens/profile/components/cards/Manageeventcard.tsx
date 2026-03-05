import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ArtistEvent } from '../types';
import { Badge } from '../../../../components/shared';
import { Colors, Radius, Spacing } from '../../../../theme';

type Props = {
  event: ArtistEvent;
  onEdit?: () => void;
  onPublish?: () => void;
  onCancel?: () => void;
  onCheckin?: () => void;
  onSendLink?: () => void;
};

export const ManageEventCard: React.FC<Props> = ({
  event, onEdit, onPublish, onCancel, onCheckin, onSendLink,
}) => {
  const stats = [
    { num: String(event.attendees), label: event.status === 'draft' ? '—' : undefined, realLabel: 'Asistentes', color: event.status === 'live' ? Colors.green : Colors.text },
    { num: event.capacity >= 999 ? '∞' : String(event.capacity), realLabel: 'Capacidad', color: Colors.text },
    { num: event.revenue ?? (event.isFree ? 'Gratis' : '—'), realLabel: 'Recaudado', color: Colors.accent },
    { num: event.capacity >= 999 ? '—' : String(Math.max(0, event.capacity - event.attendees)), realLabel: 'Disponibles', color: Colors.red },
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.sub}>{event.dateLabel} · {event.location}</Text>
        </View>
        <Badge
          variant={event.status}
          label={event.status === 'live' ? 'En vivo' : event.status === 'upcoming' ? 'Próximo' : 'Borrador'}
        />
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {stats.map((s, i) => (
          <View key={i} style={[styles.statCell, i < 3 && styles.statCellBorder]}>
            <Text style={[styles.statNum, { color: s.color }]}>
              {event.status === 'draft' && (s.realLabel === 'Asistentes' || s.realLabel === 'Disponibles') ? '—' : s.num}
            </Text>
            <Text style={styles.statLabel}>{s.realLabel}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {event.status === 'live' && (
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onCheckin}>
            <Ionicons name="qr-code-outline" size={12} color={Colors.bg} />
            <Text style={styles.btnPrimaryText}>Ver check-in</Text>
          </TouchableOpacity>
        )}
        {event.status === 'upcoming' && (
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onSendLink}>
            <Ionicons name="link-outline" size={12} color={Colors.bg} />
            <Text style={styles.btnPrimaryText}>Enviar link</Text>
          </TouchableOpacity>
        )}
        {event.status === 'draft' && (
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onPublish}>
            <Ionicons name="rocket-outline" size={12} color={Colors.bg} />
            <Text style={styles.btnPrimaryText}>Publicar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={onEdit}>
          <Text style={styles.btnSecondaryText}>Editar</Text>
        </TouchableOpacity>

        {event.status !== 'live' && event.status !== 'draft' && (
          <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={onCancel}>
            <Text style={styles.btnDangerText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  headerLeft: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: 'PlusJakartaSans_700Bold',
    marginBottom: 3,
  },
  sub: { fontSize: 11.5, color: Colors.text },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statCell: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  statCellBorder: {
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  statNum: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  statLabel: {
    fontSize: 9.5,
    color: Colors.text,
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
    padding: Spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  btn: {
    flex: 1,
    height: 32,
    borderRadius: Radius.sm + 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  btnIcon: {
    marginRight: 2,
  },
  btnPrimary: { backgroundColor: Colors.accent },
  btnPrimaryText: { fontSize: 11.5, fontWeight: '700', color: Colors.bg },
  btnSecondary: { backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border },
  btnSecondaryText: { fontSize: 11.5, fontWeight: '600', color: Colors.text },
  btnDanger: { backgroundColor: 'rgba(224,82,82,0.12)', borderWidth: 1, borderColor: 'rgba(224,82,82,0.2)' },
  btnDangerText: { fontSize: 11.5, fontWeight: '600', color: Colors.red },
});