import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../../theme';

interface TimeSlotsProps {
  selectedDate: string;
  availableSlots: string[];
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
}

export const TimeSlots: React.FC<TimeSlotsProps> = ({
  selectedDate,
  availableSlots,
  selectedTime,
  onTimeSelect,
}) => {
  if (!selectedDate || availableSlots.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={32} color={Colors.textMuted} />
          <Text style={styles.emptyText}>
            {selectedDate 
              ? 'No hay horarios disponibles para esta fecha' 
              : 'Selecciona una fecha para ver horarios disponibles'
            }
          </Text>
        </View>
      </View>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dateTitle}>
        Horarios disponibles - {formatDate(selectedDate)}
      </Text>
      
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.slotsContainer}
      >
        {availableSlots.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeSlot,
              selectedTime === time && styles.selectedSlot,
            ]}
            onPress={() => onTimeSelect(time)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.timeText,
              selectedTime === time && styles.selectedTimeText,
            ]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedTime && (
        <View style={styles.selectedInfo}>
          <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
          <Text style={styles.selectedText}>
            Horario seleccionado: {selectedTime}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    marginTop: Spacing.sm,
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  slotsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  timeSlot: {
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: 70,
    alignItems: 'center',
  },
  selectedSlot: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedTimeText: {
    color: Colors.white,
    fontWeight: '600',
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  selectedText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500',
  },
});
