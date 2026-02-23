// ─────────────────────────────────────────────────────────────────────────────
// ScheduleSelector.tsx — Selector de horarios disponible
// días de la semana · horas de inicio y fin · formato estructurado
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../../../../theme';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type ScheduleData = {
  monday: { enabled: boolean; start: string; end: string };
  tuesday: { enabled: boolean; start: string; end: string };
  wednesday: { enabled: boolean; start: string; end: string };
  thursday: { enabled: boolean; start: string; end: string };
  friday: { enabled: boolean; start: string; end: string };
  saturday: { enabled: boolean; start: string; end: string };
  sunday: { enabled: boolean; start: string; end: string };
};

type Props = {
  value: string; // Formato actual: "Lun a Vie 6-10pm"
  onChange: (schedule: string) => void;
};

// ── Constantes ────────────────────────────────────────────────────────────────────

const DAYS = [
  { key: 'monday', label: 'Lunes', short: 'Lun' },
  { key: 'tuesday', label: 'Martes', short: 'Mar' },
  { key: 'wednesday', label: 'Miércoles', short: 'Mié' },
  { key: 'thursday', label: 'Jueves', short: 'Jue' },
  { key: 'friday', label: 'Viernes', short: 'Vie' },
  { key: 'saturday', label: 'Sábado', short: 'Sáb' },
  { key: 'sunday', label: 'Domingo', short: 'Dom' },
];

const TIME_OPTIONS = [
  '6:00am', '7:00am', '8:00am', '9:00am', '10:00am', '11:00am',
  '12:00pm', '1:00pm', '2:00pm', '3:00pm', '4:00pm', '5:00pm',
  '6:00pm', '7:00pm', '8:00pm', '9:00pm', '10:00pm', '11:00pm'
];

// ── Componente principal ───────────────────────────────────────────────────────

export const ScheduleSelector: React.FC<Props> = ({ value, onChange }) => {
  // Parsear valor actual a estado interno
  const parseSchedule = (scheduleStr: string): ScheduleData => {
    const defaultSchedule: ScheduleData = {
      monday: { enabled: false, start: '9:00am', end: '6:00pm' },
      tuesday: { enabled: false, start: '9:00am', end: '6:00pm' },
      wednesday: { enabled: false, start: '9:00am', end: '6:00pm' },
      thursday: { enabled: false, start: '9:00am', end: '6:00pm' },
      friday: { enabled: false, start: '9:00am', end: '6:00pm' },
      saturday: { enabled: false, start: '9:00am', end: '6:00pm' },
      sunday: { enabled: false, start: '9:00am', end: '6:00pm' },
    };

    if (!scheduleStr) return defaultSchedule;

    // Parsear formato como "Lun a Vie 6-10pm"
    if (scheduleStr.includes('a')) {
      const [daysPart, timePart] = scheduleStr.split(' ');
      const [startDay, , endDay] = daysPart.split(' ');
      const [startTime, endTime] = timePart.split('-');

      const dayMap: { [key: string]: string } = {
        'Lun': 'monday', 'Mar': 'tuesday', 'Mié': 'wednesday',
        'Jue': 'thursday', 'Vie': 'friday', 'Sáb': 'saturday', 'Dom': 'sunday'
      };

      const startIndex = DAYS.findIndex(d => d.short === startDay);
      const endIndex = DAYS.findIndex(d => d.short === endDay);

      for (let i = startIndex; i <= endIndex && i < DAYS.length; i++) {
        const dayKey = DAYS[i].key as keyof ScheduleData;
        defaultSchedule[dayKey] = {
          enabled: true,
          start: startTime.includes('am') || startTime.includes('pm') ? startTime : `${startTime}am`,
          end: endTime.includes('am') || endTime.includes('pm') ? endTime : `${endTime}pm`
        };
      }
    }

    return defaultSchedule;
  };

  const [schedule, setSchedule] = useState<ScheduleData>(parseSchedule(value));
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Formatear schedule a string
  const formatSchedule = (sched: ScheduleData): string => {
    const enabledDays = DAYS.filter(day => sched[day.key as keyof ScheduleData].enabled);
    
    if (enabledDays.length === 0) return 'No disponible';
    
    if (enabledDays.length === 7) {
      const firstDaySchedule = sched[enabledDays[0].key as keyof ScheduleData];
      return `Todos los días ${firstDaySchedule.start}-${firstDaySchedule.end}`;
    }
    
    if (enabledDays.length === 5 && 
        enabledDays[0].key === 'monday' && 
        enabledDays[4].key === 'friday') {
      const firstDaySchedule = sched[enabledDays[0].key as keyof ScheduleData];
      return `Lun a Vie ${firstDaySchedule.start}-${firstDaySchedule.end}`;
    }
    
    if (enabledDays.length === 2 && 
        enabledDays[0].key === 'saturday' && 
        enabledDays[1].key === 'sunday') {
      const firstDaySchedule = sched[enabledDays[0].key as keyof ScheduleData];
      return `Fin de semana ${firstDaySchedule.start}-${firstDaySchedule.end}`;
    }
    
    // Para combinaciones personalizadas
    const firstDaySchedule = sched[enabledDays[0].key as keyof ScheduleData];
    const dayLabels = enabledDays.map(d => d.short).join(', ');
    return `${dayLabels} ${firstDaySchedule.start}-${firstDaySchedule.end}`;
  };

  const toggleDay = (dayKey: string) => {
    setSchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey as keyof ScheduleData],
        enabled: !prev[dayKey as keyof ScheduleData].enabled
      }
    }));
  };

  const updateTime = (dayKey: string, type: 'start' | 'end', time: string) => {
    setSchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey as keyof ScheduleData],
        [type]: time
      }
    }));
  };

  const applyToAllDays = () => {
    const firstEnabledDay = DAYS.find(day => schedule[day.key as keyof ScheduleData].enabled);
    if (!firstEnabledDay) return;

    const referenceSchedule = schedule[firstEnabledDay.key as keyof ScheduleData];
    
    setSchedule(prev => {
      const newSchedule = { ...prev };
      DAYS.forEach(day => {
        newSchedule[day.key as keyof ScheduleData] = {
          ...referenceSchedule,
          enabled: true
        };
      });
      return newSchedule;
    });
  };

  // Actualizar el valor cuando cambia el schedule
  React.useEffect(() => {
    onChange(formatSchedule(schedule));
  }, [schedule]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Horario disponible</Text>
      
      {/* Resumen actual */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>{formatSchedule(schedule)}</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setExpandedDay(expandedDay ? null : 'monday')}
        >
          <Ionicons name="time-outline" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Selector detallado */}
      {expandedDay && (
        <View style={styles.selector}>
          <View style={styles.selectorHeader}>
            <Text style={styles.selectorTitle}>Configurar horario</Text>
            <TouchableOpacity 
              style={styles.applyAllButton}
              onPress={applyToAllDays}
            >
              <Text style={styles.applyAllText}>Aplicar a todos</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.daysList} showsVerticalScrollIndicator={false}>
            {DAYS.map((day) => {
              const daySchedule = schedule[day.key as keyof ScheduleData];
              const isExpanded = expandedDay === day.key;
              
              return (
                <View key={day.key} style={styles.dayItem}>
                  <TouchableOpacity
                    style={styles.dayHeader}
                    onPress={() => setExpandedDay(isExpanded ? null : day.key)}
                  >
                    <View style={styles.dayInfo}>
                      <Ionicons 
                        name={daySchedule.enabled ? 'checkmark-circle' : 'ellipse-outline'} 
                        size={20} 
                        color={daySchedule.enabled ? Colors.primary : Colors.textSecondary} 
                      />
                      <Text style={[
                        styles.dayLabel,
                        daySchedule.enabled && styles.dayLabelEnabled
                      ]}>
                        {day.label}
                      </Text>
                    </View>
                    <Ionicons 
                      name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                      size={16} 
                      color={Colors.textSecondary} 
                    />
                  </TouchableOpacity>

                  {daySchedule.enabled && (
                    <View style={styles.timeSelector}>
                      <View style={styles.timeRow}>
                        <Text style={styles.timeLabel}>De:</Text>
                        <ScrollView 
                          horizontal 
                          showsHorizontalScrollIndicator={false}
                          style={styles.timeScroll}
                        >
                          {TIME_OPTIONS.map((time) => (
                            <TouchableOpacity
                              key={time}
                              style={[
                                styles.timeOption,
                                daySchedule.start === time && styles.timeOptionSelected
                              ]}
                              onPress={() => updateTime(day.key, 'start', time)}
                            >
                              <Text style={[
                                styles.timeText,
                                daySchedule.start === time && styles.timeTextSelected
                              ]}>
                                {time}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>

                      <View style={styles.timeRow}>
                        <Text style={styles.timeLabel}>Hasta:</Text>
                        <ScrollView 
                          horizontal 
                          showsHorizontalScrollIndicator={false}
                          style={styles.timeScroll}
                        >
                          {TIME_OPTIONS.map((time) => (
                            <TouchableOpacity
                              key={time}
                              style={[
                                styles.timeOption,
                                daySchedule.end === time && styles.timeOptionSelected
                              ]}
                              onPress={() => updateTime(day.key, 'end', time)}
                            >
                              <Text style={[
                                styles.timeText,
                                daySchedule.end === time && styles.timeTextSelected
                              ]}>
                                {time}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text,
  },
  editButton: {
    padding: 4,
  },
  selector: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 8,
    maxHeight: 300,
  },
  selectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectorTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  applyAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
  },
  applyAllText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.white,
  },
  daysList: {
    paddingHorizontal: 12,
  },
  dayItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },
  dayLabelEnabled: {
    color: Colors.text,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  timeSelector: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
    width: 30,
  },
  timeScroll: {
    flex: 1,
  },
  timeOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    backgroundColor: Colors.bg,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  timeTextSelected: {
    color: Colors.white,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
