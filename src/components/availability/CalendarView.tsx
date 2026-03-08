import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { availabilityApi, AvailabilityResponse } from '../../services/api/availability';
import { Colors, Radius, Spacing } from '../../theme';

interface CalendarViewProps {
  artistId: string;
  onDateSelect: (date: string, availableSlots: string[]) => void;
  selectedDate?: string;
}

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const CalendarView: React.FC<CalendarViewProps> = ({
  artistId,
  onDateSelect,
  selectedDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar disponibilidad para el mes actual
  useEffect(() => {
    loadAvailability();
  }, [currentMonth, artistId]);

  const loadAvailability = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const monthStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
      const data = await availabilityApi.getArtistAvailability(artistId, monthStr);
      setAvailability(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Agregar días vacíos al principio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Agregar días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const formatDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const getDayState = (day: number | null) => {
    if (!day || !availability) return 'empty';
    
    const dateStr = formatDate(day);
    const availableSlots = availability.availability[dateStr] || [];
    
    if (availableSlots.length === 0) return 'unavailable';
    if (dateStr === selectedDate) return 'selected';
    return 'available';
  };

  const handleDatePress = (day: number | null) => {
    if (!day || !availability) return;
    
    const dateStr = formatDate(day);
    const availableSlots = availability.availability[dateStr] || [];
    
    if (availableSlots.length > 0) {
      onDateSelect(dateStr, availableSlots);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const days = getDaysInMonth(currentMonth);

  if (loading && !availability) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando disponibilidad...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={24} color={Colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadAvailability}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigateMonth('prev')}
        >
          <Ionicons name="chevron-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.monthText}>
          {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigateMonth('next')}
        >
          <Ionicons name="chevron-forward" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Day labels */}
      <View style={styles.dayLabels}>
        {DAY_LABELS.map(day => (
          <View key={day} style={styles.dayLabel}>
            <Text style={styles.dayLabelText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {days.map((day, index) => {
          const state = getDayState(day);
          const dateStr = day ? formatDate(day) : '';
          const availableSlots = day && availability ? availability.availability[dateStr] || [] : [];
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                state === 'selected' && styles.selectedDay,
                state === 'available' && styles.availableDay,
                state === 'unavailable' && styles.unavailableDay,
                state === 'empty' && styles.emptyDay,
              ]}
              onPress={() => handleDatePress(day)}
              disabled={state === 'empty' || state === 'unavailable'}
            >
              {day && (
                <>
                  <Text style={[
                    styles.dayText,
                    state === 'selected' && styles.selectedDayText,
                    state === 'available' && styles.availableDayText,
                    state === 'unavailable' && styles.unavailableDayText,
                  ]}>
                    {day}
                  </Text>
                  {availableSlots.length > 0 && (
                    <View style={styles.dotIndicator} />
                  )}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
          <Text style={styles.legendText}>Disponible</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.error }]} />
          <Text style={styles.legendText}>No disponible</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>Seleccionado</Text>
        </View>
      </View>

      {/* Loading overlay for month navigation */}
      {loading && availability && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={Colors.primary} />
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
    position: 'relative',
  },
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: Spacing.sm,
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  errorContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: Spacing.sm,
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
  },
  retryText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabels: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  dayLabel: {
    flex: 1,
    alignItems: 'center',
  },
  dayLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    position: 'relative',
    marginVertical: 1,
  },
  emptyDay: {
    backgroundColor: 'transparent',
  },
  availableDay: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  unavailableDay: {
    backgroundColor: 'rgba(244, 67, 54, 0.05)',
  },
  selectedDay: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  availableDayText: {
    color: Colors.success,
  },
  unavailableDayText: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  selectedDayText: {
    color: Colors.white,
    fontWeight: '700',
  },
  dotIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.success,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
  },
});
