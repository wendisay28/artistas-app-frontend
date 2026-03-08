import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CalendarView } from '../../../../../components/availability/CalendarView';
import { availabilityApi, ArtistBooking } from '../../../../../services/api/availability';
import { useAuthStore } from '../../../../../store/authStore';
import { auth } from '../../../../../services/firebase/config';
import { Colors, Radius, Spacing } from '../../../../../theme';

interface Props {
  isOwner?: boolean;
  artistId?: number;
  onEditSection?: () => void;
}

interface BookingCardProps {
  booking: ArtistBooking;
  isOwner: boolean;
  onUpdateStatus: (bookingId: string, status: 'accepted' | 'rejected' | 'cancelled') => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, isOwner, onUpdateStatus }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return Colors.warning;
      case 'accepted': return Colors.success;
      case 'rejected': return Colors.error;
      case 'cancelled': return Colors.textMuted;
      case 'completed': return Colors.primary;
      default: return Colors.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'accepted': return 'Confirmado';
      case 'rejected': return 'Rechazado';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Completado';
      default: return status;
    }
  };

  const canUpdateStatus = isOwner && booking.status === 'pending';

  return (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingTitle}>{booking.title}</Text>
          <Text style={styles.bookingMeta}>
            {formatDate(booking.eventDate)} · {booking.startTime} - {booking.endTime}
          </Text>
          {booking.location && (
            <Text style={styles.bookingLocation}>{booking.location}</Text>
          )}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
        </View>
      </View>

      {booking.clientNotes && (
        <Text style={styles.clientNotes} numberOfLines={2}>
          Notas: {booking.clientNotes}
        </Text>
      )}

      {booking.price && (
        <Text style={styles.bookingPrice}>
          Presupuesto: ${booking.price} {booking.currency}
        </Text>
      )}

      {canUpdateStatus && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => onUpdateStatus(booking.id, 'accepted')}
          >
            <Ionicons name="checkmark" size={16} color={Colors.white} />
            <Text style={styles.actionButtonText}>Aceptar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => onUpdateStatus(booking.id, 'rejected')}
          >
            <Ionicons name="close" size={16} color={Colors.white} />
            <Text style={styles.actionButtonText}>Rechazar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export const AgendaSectionFunctional: React.FC<Props> = ({ 
  isOwner, 
  artistId, 
  onEditSection 
}) => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<ArtistBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const data = await availabilityApi.getUserBookings(token, { 
        role: isOwner ? 'artist' : 'client' 
      });
      setBookings(data.bookings);
    } catch (error) {
      console.error('Error cargando reservas:', error);
      Alert.alert('Error', 'No se pudieron cargar las reservas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: 'accepted' | 'rejected' | 'cancelled') => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      await availabilityApi.updateBookingStatus(bookingId, { status }, token);
      
      // Actualizar lista local
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status, acceptedAt: status === 'accepted' ? new Date().toISOString() : undefined }
            : booking
        )
      );

      Alert.alert(
        'Éxito',
        `Reserva ${status === 'accepted' ? 'aceptada' : status === 'rejected' ? 'rechazada' : 'cancelada'} correctamente`
      );
    } catch (error) {
      console.error('Error actualizando reserva:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado de la reserva');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const handleViewAvailability = () => {
    if (!artistId) return;
    
    navigation.navigate('ArtistAvailability' as never, {
      artistId: artistId.toString(),
      artistName: 'Mi Perfil' // Esto debería venir del perfil del artista
    } as never);
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'accepted');
  const otherBookings = bookings.filter(b => !['pending', 'accepted'].includes(b.status));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando agenda...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mi Agenda</Text>
        {isOwner && (
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.viewAvailabilityButton} onPress={handleViewAvailability}>
              <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
              <Text style={styles.viewAvailabilityText}>Ver disponibilidad</Text>
            </TouchableOpacity>
            {onEditSection && (
              <TouchableOpacity style={styles.editButton} onPress={onEditSection}>
                <Ionicons name="create-outline" size={16} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pendingBookings.length}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{confirmedBookings.length}</Text>
          <Text style={styles.statLabel}>Confirmadas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{bookings.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Pending Bookings */}
      {pendingBookings.length > 0 && (
        <View style={styles.bookingsSection}>
          <Text style={styles.subsectionTitle}>Reservas Pendientes</Text>
          {pendingBookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isOwner={isOwner}
              onUpdateStatus={handleUpdateBookingStatus}
            />
          ))}
        </View>
      )}

      {/* Confirmed Bookings */}
      {confirmedBookings.length > 0 && (
        <View style={styles.bookingsSection}>
          <Text style={styles.subsectionTitle}>Reservas Confirmadas</Text>
          {confirmedBookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isOwner={isOwner}
              onUpdateStatus={handleUpdateBookingStatus}
            />
          ))}
        </View>
      )}

      {/* Other Bookings */}
      {otherBookings.length > 0 && (
        <View style={styles.bookingsSection}>
          <Text style={styles.subsectionTitle}>Otras Reservas</Text>
          {otherBookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isOwner={isOwner}
              onUpdateStatus={handleUpdateBookingStatus}
            />
          ))}
        </View>
      )}

      {/* Empty State */}
      {bookings.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No tienes reservas</Text>
          <Text style={styles.emptyText}>
            {isOwner 
              ? 'Cuando los clientes reserven tus servicios, aparecerán aquí'
              : 'Tus reservas aparecerán aquí'
            }
          </Text>
          {isOwner && (
            <TouchableOpacity style={styles.emptyButton} onPress={handleViewAvailability}>
              <Text style={styles.emptyButtonText}>Configurar disponibilidad</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  viewAvailabilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  viewAvailabilityText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  editButton: {
    padding: Spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  bookingsSection: {
    marginBottom: Spacing.xl,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  bookingCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  bookingMeta: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  bookingLocation: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
  },
  clientNotes: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  bookingPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  acceptButton: {
    backgroundColor: Colors.success,
  },
  rejectButton: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  emptyButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
});
