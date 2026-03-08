import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CalendarView } from '../../components/availability/CalendarView';
import { TimeSlots } from '../../components/availability/TimeSlots';
import { BookingModal } from '../../components/availability/BookingModal';
import { TopBar } from '../../components/shared/TopBar';
import { Colors, Radius, Spacing } from '../../theme';

type RouteParams = {
  artistId: string;
  artistName: string;
};

type ArtistAvailabilityRouteProp = RouteProp<
  { ArtistAvailability: RouteParams },
  'ArtistAvailability'
>;

export const ArtistAvailabilityScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<ArtistAvailabilityRouteProp>();
  const navigation = useNavigation();
  const { artistId, artistName } = route.params;

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleDateSelect = (date: string, slots: string[]) => {
    setSelectedDate(date);
    setAvailableSlots(slots);
    setSelectedTime(''); // Reset selected time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookingRequest = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Información', 'Por favor selecciona una fecha y hora');
      return;
    }
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    // Reset selections
    setSelectedDate('');
    setAvailableSlots([]);
    setSelectedTime('');
  };

  const canRequestBooking = selectedDate && selectedTime;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TopBar
        title={`Disponibilidad - ${artistName}`}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Instructions */}
        <View style={styles.instructions}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
          <Text style={styles.instructionsText}>
            Selecciona una fecha disponible en el calendario, luego elige tu horario preferido.
          </Text>
        </View>

        {/* Calendar */}
        <CalendarView
          artistId={artistId}
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />

        {/* Time Slots */}
        <TimeSlots
          selectedDate={selectedDate}
          availableSlots={availableSlots}
          selectedTime={selectedTime}
          onTimeSelect={handleTimeSelect}
        />

        {/* Booking Button */}
        {canRequestBooking && (
          <View style={styles.bookingSection}>
            <TouchableOpacity
              style={styles.bookingButton}
              onPress={handleBookingRequest}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar-check-outline" size={20} color={Colors.white} />
              <Text style={styles.bookingButtonText}>
                Solicitar Reserva
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Booking Modal */}
      <BookingModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        artistId={parseInt(artistId)}
        artistName={artistName}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onSuccess={handleBookingSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  bookingSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  bookingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});
