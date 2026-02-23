import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LiveRequest, ScheduleItem, CalendarDay } from '../types';
import { Colors, Radius, Spacing } from '../../../../theme';
import { EditButton } from '../shared/EditButton';

// ─── Calendar ───────────────────────────────────────────────────────────────

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const CalendarWidget: React.FC<{ days: CalendarDay[] }> = ({ days }) => (
  <View style={cal.container}>
    <View style={cal.header}>
      <Text style={cal.month}>Febrero 2026</Text>
      <View style={cal.nav}>
        <TouchableOpacity style={cal.navBtn}><Text style={cal.navTxt}>‹</Text></TouchableOpacity>
        <TouchableOpacity style={cal.navBtn}><Text style={cal.navTxt}>›</Text></TouchableOpacity>
      </View>
    </View>

    {/* Day labels */}
    <View style={cal.labelsRow}>
      {DAY_LABELS.map(d => (
        <View key={d} style={cal.labelCell}>
          <Text style={cal.labelTxt}>{d}</Text>
        </View>
      ))}
    </View>

    {/* Days grid */}
    <View style={cal.grid}>
      {days.map((d, i) => (
        <TouchableOpacity
          key={i}
          style={[
            cal.dayCell,
            d.state === 'today' && cal.dayToday,
            d.state === 'booked' && cal.dayBooked,
            d.state === 'unavailable' && cal.dayUnavail,
          ]}
          disabled={!d.day}
          activeOpacity={0.7}
        >
          {d.day && <Text style={[
            cal.dayTxt,
            d.state === 'today' && cal.dayTxtToday,
            d.state === 'booked' && cal.dayTxtBooked,
            d.state === 'unavailable' && cal.dayTxtUnavail,
          ]}>{d.day}</Text>}
          {d.hasEvent && d.day && <View style={cal.eventDot} />}
        </TouchableOpacity>
      ))}
    </View>

    {/* Legend */}
    <View style={cal.legend}>
      {[
        { color: 'rgba(212,168,83,0.12)', border: 'rgba(212,168,83,0.4)', label: 'Hoy' },
        { color: 'rgba(62,207,142,0.1)', border: 'rgba(62,207,142,0.3)', label: 'Confirmado' },
        { color: 'rgba(224,82,82,0.08)', border: 'rgba(224,82,82,0.25)', label: 'No disponible' },
      ].map((item, i) => (
        <View key={i} style={cal.legendItem}>
          <View style={[cal.legendDot, { backgroundColor: item.color, borderColor: item.border }]} />
          <Text style={cal.legendTxt}>{item.label}</Text>
        </View>
      ))}
    </View>
  </View>
);

const CELL_W = (393 - 32 - 28 - 6) / 7; // approx

const cal = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  month: { fontSize: 16, fontWeight: '700', color: Colors.text, fontFamily: 'PlusJakartaSans_700Bold' },
  nav: { flexDirection: 'row', gap: 6 },
  navBtn: {
    width: 28, height: 28, backgroundColor: Colors.surface2,
    borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  navTxt: { fontSize: 12, color: Colors.text2 },
  labelsRow: { flexDirection: 'row', marginBottom: 4 },
  labelCell: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  labelTxt: { fontSize: 10, fontWeight: '600', color: Colors.text3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    position: 'relative',
  },
  dayToday: { backgroundColor: 'rgba(212,168,83,0.12)' },
  dayBooked: { backgroundColor: 'rgba(62,207,142,0.1)' },
  dayUnavail: { backgroundColor: 'rgba(224,82,82,0.08)' },
  dayTxt: { fontSize: 12, fontWeight: '500', color: Colors.text2 },
  dayTxtToday: { color: Colors.accent, fontWeight: '700' },
  dayTxtBooked: { color: Colors.green },
  dayTxtUnavail: { color: 'rgba(224,82,82,0.5)', textDecorationLine: 'line-through' },
  eventDot: {
    position: 'absolute', bottom: 3,
    width: 4, height: 4, borderRadius: 99,
    backgroundColor: Colors.accent,
  },
  legend: { flexDirection: 'row', gap: 12, marginTop: 10, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 3, borderWidth: 1 },
  legendTxt: { fontSize: 10, color: Colors.text3 },
});

// ─── Schedule Item ───────────────────────────────────────────────────────────

const ScheduleRow: React.FC<{ item: ScheduleItem }> = ({ item }) => (
  <View style={sch.row}>
    <View style={sch.dateBox}>
      <Text style={sch.month}>{item.month}</Text>
      <Text style={sch.day}>{item.day}</Text>
    </View>
    <View style={sch.body}>
      <Text style={sch.title}>{item.title}</Text>
      <Text style={sch.meta}>{item.time} · {item.location}</Text>
    </View>
    <View style={[sch.status, item.status === 'confirmed' ? sch.statusConfirmed : sch.statusPending]}>
      <Text style={[sch.statusTxt, item.status === 'confirmed' ? sch.statusTxtConfirmed : sch.statusTxtPending]}>
        {item.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
      </Text>
    </View>
  </View>
);

const sch = StyleSheet.create({
  row: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, flexDirection: 'row', gap: Spacing.md,
    alignItems: 'center', marginBottom: Spacing.sm,
  },
  dateBox: {
    backgroundColor: Colors.surface2, borderRadius: Radius.sm,
    borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 7, paddingHorizontal: 10,
    alignItems: 'center', minWidth: 44,
  },
  month: { fontSize: 9, color: Colors.text3, textTransform: 'uppercase', fontWeight: '700' },
  day: { fontSize: 18, fontWeight: '700', color: Colors.text, fontFamily: 'PlusJakartaSans_700Bold', lineHeight: 22 },
  body: { flex: 1 },
  title: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 2 },
  meta: { fontSize: 11, color: Colors.text2 },
  status: {
    borderRadius: Radius.sm, borderWidth: 1,
    paddingHorizontal: 9, paddingVertical: 4,
  },
  statusConfirmed: { backgroundColor: 'rgba(62,207,142,0.12)', borderColor: 'rgba(62,207,142,0.25)' },
  statusPending: { backgroundColor: 'rgba(212,168,83,0.12)', borderColor: 'rgba(212,168,83,0.25)' },
  statusTxt: { fontSize: 10, fontWeight: '700' },
  statusTxtConfirmed: { color: Colors.green },
  statusTxtPending: { color: Colors.accent },
});

// ─── Main Section ─────────────────────────────────────────────────────────────

type Props = {
  liveRequest: LiveRequest;
  calendarDays: CalendarDay[];
  schedule: ScheduleItem[];
  isOwner?: boolean;
  onEditSection?: () => void;
};

export const AgendaSection: React.FC<Props> = ({ liveRequest, calendarDays, schedule, isOwner, onEditSection }) => (
  <View style={styles.container}>
    <View style={styles.sectionHeader}>
      <Text style={styles.label}>DISPONIBILIDAD — FEBRERO 2026</Text>
      {isOwner && (
        <EditButton onPress={onEditSection || (() => {})} />
      )}
    </View>
    <CalendarWidget days={calendarDays} />

    <View style={styles.sectionHeader}>
      <Text style={styles.label}>PRÓXIMOS COMPROMISOS</Text>
      {isOwner && (
        <EditButton onPress={onEditSection || (() => {})} />
      )}
    </View>
    {schedule.map(item => <ScheduleRow key={item.id} item={item} />)}
  </View>
);

const styles = StyleSheet.create({
  container: { padding: Spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 10.5, fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: 1.4, color: Colors.text3, marginBottom: Spacing.md,
  },
});