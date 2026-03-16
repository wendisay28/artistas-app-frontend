import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { availabilityApi, ArtistBooking } from '../../../../../services/api/availability';
import { auth } from '../../../../../services/firebase/config';
import { useThemeStore } from '../../../../../store/themeStore';

interface Props {
  isOwner?: boolean;
  artistId?: number;
  onEditSection?: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pendiente',  color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  accepted:  { label: 'Confirmado', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  rejected:  { label: 'Rechazado', color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
  cancelled: { label: 'Cancelado',  color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  completed: { label: 'Completado', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
};

const BookingCard: React.FC<{
  booking: ArtistBooking;
  isOwner: boolean;
  isDark: boolean;
  onUpdateStatus: (id: string, status: 'accepted' | 'rejected' | 'cancelled') => void;
}> = ({ booking, isOwner, isDark, onUpdateStatus }) => {
  const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const canAct = isOwner && booking.status === 'pending';

  return (
    <View style={[s.card, isDark && s.cardDark]}>
      {/* Header */}
      <View style={s.cardHeader}>
        <View style={s.cardInfo}>
          <Text style={[s.cardTitle, isDark && s.textLight]} numberOfLines={1}>{booking.title}</Text>
          <View style={s.cardMeta}>
            <Ionicons name="calendar-outline" size={11} color="rgba(109,40,217,0.5)" />
            <Text style={[s.cardMetaText, isDark && s.textMuted]}>
              {formatDate(booking.eventDate)} · {booking.startTime} – {booking.endTime}
            </Text>
          </View>
          {booking.location ? (
            <View style={s.cardMeta}>
              <Ionicons name="location-outline" size={11} color="rgba(109,40,217,0.5)" />
              <Text style={[s.cardMetaText, isDark && s.textMuted]} numberOfLines={1}>{booking.location}</Text>
            </View>
          ) : null}
        </View>
        <View style={[s.statusPill, { backgroundColor: cfg.bg }]}>
          <Text style={[s.statusText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      {booking.clientNotes ? (
        <Text style={[s.notes, isDark && s.textMuted]} numberOfLines={2}>"{booking.clientNotes}"</Text>
      ) : null}

      {booking.price ? (
        <Text style={s.price}>${booking.price} {booking.currency}</Text>
      ) : null}

      {canAct && (
        <View style={s.actions}>
          <TouchableOpacity
            style={s.acceptBtn}
            onPress={() => onUpdateStatus(booking.id, 'accepted')}
            activeOpacity={0.85}
          >
            <LinearGradient colors={['#16a34a', '#15803d']} style={s.actionGrad}>
              <Ionicons name="checkmark" size={14} color="#fff" />
              <Text style={s.actionText}>Aceptar</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.rejectBtn, isDark && s.rejectBtnDark]}
            onPress={() => onUpdateStatus(booking.id, 'rejected')}
            activeOpacity={0.85}
          >
            <Ionicons name="close" size={14} color="#dc2626" />
            <Text style={[s.actionText, { color: '#dc2626' }]}>Rechazar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export const AgendaSectionFunctional: React.FC<Props> = ({ isOwner, onEditSection }) => {
  const { isDark } = useThemeStore();
  const [bookings, setBookings] = useState<ArtistBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;
      const data = await availabilityApi.getUserBookings(token, {
        role: isOwner ? 'artist' : 'client',
      });
      setBookings(data.bookings);
    } catch {
      // endpoint aún no disponible — mostrar empty state sin alert
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: 'accepted' | 'rejected' | 'cancelled') => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;
      await availabilityApi.updateBookingStatus(bookingId, { status }, token);
      setBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, status } : b)
      );
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la reserva');
    }
  };

  const pending   = bookings.filter(b => b.status === 'pending');
  const confirmed = bookings.filter(b => b.status === 'accepted');
  const others    = bookings.filter(b => !['pending', 'accepted'].includes(b.status));

  if (loading) {
    return (
      <View style={s.center}>
        <Text style={[s.loadingText, isDark && { color: 'rgba(167,139,250,0.5)' }]}>Cargando agenda…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[s.root, isDark && s.rootDark]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadBookings(); }} tintColor="#7c3aed" />}
    >
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={[s.heading, isDark && s.textLight]}>Mi Agenda</Text>
          <Text style={[s.subheading, isDark && { color: 'rgba(167,139,250,0.5)' }]}>
            {bookings.length === 0 ? 'Sin reservas activas' : `${bookings.length} reserva${bookings.length !== 1 ? 's' : ''}`}
          </Text>
        </View>
        {isOwner && onEditSection && (
          <TouchableOpacity style={[s.editBtn, isDark && s.editBtnDark]} onPress={onEditSection} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={16} color="#7c3aed" />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        {[
          { label: 'Pendientes', value: pending.length, color: '#d97706' },
          { label: 'Confirmadas', value: confirmed.length, color: '#16a34a' },
          { label: 'Total', value: bookings.length, color: '#7c3aed' },
        ].map(({ label, value, color }) => (
          <View key={label} style={[s.statCard, isDark && s.statCardDark]}>
            <Text style={[s.statNum, { color }]}>{value}</Text>
            <Text style={[s.statLabel, isDark && { color: 'rgba(167,139,250,0.5)' }]}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Grupos */}
      {pending.length > 0 && (
        <Section title="Pendientes" icon="time-outline" iconColor="#d97706" isDark={isDark}>
          {pending.map(b => (
            <BookingCard key={b.id} booking={b} isOwner={!!isOwner} isDark={isDark} onUpdateStatus={handleUpdateStatus} />
          ))}
        </Section>
      )}

      {confirmed.length > 0 && (
        <Section title="Confirmadas" icon="checkmark-circle-outline" iconColor="#16a34a" isDark={isDark}>
          {confirmed.map(b => (
            <BookingCard key={b.id} booking={b} isOwner={!!isOwner} isDark={isDark} onUpdateStatus={handleUpdateStatus} />
          ))}
        </Section>
      )}

      {others.length > 0 && (
        <Section title="Historial" icon="archive-outline" iconColor="#6b7280" isDark={isDark}>
          {others.map(b => (
            <BookingCard key={b.id} booking={b} isOwner={!!isOwner} isDark={isDark} onUpdateStatus={handleUpdateStatus} />
          ))}
        </Section>
      )}

      {/* Empty */}
      {bookings.length === 0 && (
        <View style={s.empty}>
          <View style={[s.emptyIcon, isDark && { backgroundColor: 'rgba(124,58,237,0.10)', borderColor: 'rgba(124,58,237,0.18)' }]}>
            <Ionicons name="calendar-outline" size={36} color="rgba(124,58,237,0.4)" />
          </View>
          <Text style={[s.emptyTitle, isDark && s.textLight]}>Sin reservas aún</Text>
          <Text style={[s.emptySub, isDark && { color: 'rgba(167,139,250,0.5)' }]}>
            {isOwner
              ? 'Cuando los clientes reserven tus servicios, aparecerán aquí.'
              : 'Tus reservas aparecerán aquí.'}
          </Text>
        </View>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const Section: React.FC<{ title: string; icon: string; iconColor: string; isDark: boolean; children: React.ReactNode }> = ({ title, icon, iconColor, isDark, children }) => (
  <View style={s.section}>
    <View style={s.sectionHeader}>
      <Ionicons name={icon as any} size={14} color={iconColor} />
      <Text style={[s.sectionTitle, isDark && s.textLight]}>{title}</Text>
    </View>
    {children}
  </View>
);

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#faf9ff' },
  rootDark: { backgroundColor: '#0a0618' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.5)' },

  // Helpers
  textLight: { color: '#f5f3ff' },
  textMuted: { color: '#71717A' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
  },
  heading: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  subheading: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.45)', marginTop: 2 },
  editBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(124,58,237,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  editBtnDark: {
    backgroundColor: 'rgba(167,139,250,0.12)',
  },

  statsRow: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: 16, marginBottom: 20,
  },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(167,139,250,0.18)',
    paddingVertical: 12, alignItems: 'center',
    shadowColor: '#5b21b6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  statCardDark: {
    backgroundColor: '#130d2a',
    borderColor: 'rgba(139,92,246,0.2)',
  },
  statNum: { fontSize: 22, fontFamily: 'PlusJakartaSans_700Bold' },
  statLabel: { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.5)', marginTop: 2 },

  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  sectionTitle: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },

  card: {
    backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(167,139,250,0.18)',
    padding: 14, marginBottom: 10,
    shadowColor: '#5b21b6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 2,
  },
  cardDark: {
    backgroundColor: '#130d2a',
    borderColor: 'rgba(139,92,246,0.2)',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  cardInfo: { flex: 1, gap: 3 },
  cardTitle: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.5)', flex: 1 },
  statusPill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold' },
  notes: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280', fontStyle: 'italic', marginTop: 8,
  },
  price: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold',
    color: '#7c3aed', marginTop: 6,
  },

  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  acceptBtn: { borderRadius: 10, overflow: 'hidden' },
  actionGrad: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8 },
  rejectBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 10, borderWidth: 1, borderColor: 'rgba(220,38,38,0.25)',
    backgroundColor: 'rgba(220,38,38,0.05)',
  },
  rejectBtnDark: {
    backgroundColor: 'rgba(220,38,38,0.08)',
    borderColor: 'rgba(220,38,38,0.22)',
  },
  actionText: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },

  empty: {
    alignItems: 'center', paddingHorizontal: 36, paddingTop: 32, gap: 10,
  },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.12)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  emptyTitle: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  emptySub: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)', textAlign: 'center', lineHeight: 19,
  },
});
