// components/hiring/cards/OfferCard.tsx

import React, { useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../../../theme/colors';

interface OfferCardProps {
  offer: {
    id: string;
    title: string;
    description: string;
    budget_min?: number;
    budget_max?: number;
    location?: string;
    date?: string;
    offer_type: 'collaboration' | 'hiring' | 'gig' | 'event';
    is_urgent?: boolean;
    poster_name?: string;
    poster_avatar?: string;
    created_date: string;
    category?: string;
  };
  isSaved?: boolean;
  onPress?: () => void;
  onChatPress?: () => void;
  onApplyPress?: () => void;
  onSavePress?: () => void;
}

const TYPE_CONFIG = {
  collaboration: {
    color: '#8B5CF6',
    bg: '#8B5CF615',
    label: 'Colaboración',
    icon: 'people' as const,
  },
  hiring: {
    color: '#10B981',
    bg: '#10B98115',
    label: 'Contratación',
    icon: 'briefcase' as const,
  },
  gig: {
    color: '#F59E0B',
    bg: '#F59E0B15',
    label: 'Gig',
    icon: 'flash' as const,
  },
  event: {
    color: '#3B82F6',
    bg: '#3B82F615',
    label: 'Evento',
    icon: 'calendar' as const,
  },
};

function timeAgo(date: string): string {
  const now = new Date();
  const created = new Date(date);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
}

function formatBudget(min?: number, max?: number): string | null {
  if (!min && !max) return null;
  if (min && max) return `$${min} – $${max}`;
  if (max) return `Hasta $${max}`;
  return `Desde $${min}`;
}

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

// Colores de avatar deterministas por inicial
const AVATAR_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];
function avatarColor(name?: string): string {
  if (!name) return AVATAR_COLORS[0];
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

export default function OfferCard({
  offer,
  isSaved = false,
  onPress,
  onChatPress,
  onApplyPress,
  onSavePress,
}: OfferCardProps) {
  const config = TYPE_CONFIG[offer.offer_type] ?? TYPE_CONFIG.hiring;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const budget = formatBudget(offer.budget_min, offer.budget_max);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.975,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    onPress?.();
  };

  const handleChatPress = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChatPress?.();
  };

  const handleApplyPress = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onApplyPress?.();
  };

  const handleSavePress = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSavePress?.();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        {/* Franja de color izquierda según tipo */}
        <View style={[styles.typeAccent, { backgroundColor: config.color }]} />

        <View style={styles.inner}>
          {/* ── Header ── */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.typePill, { backgroundColor: config.bg }]}>
                <Ionicons name={config.icon} size={12} color={config.color} />
                <Text style={[styles.typeLabel, { color: config.color }]}>
                  {config.label}
                </Text>
              </View>

              {offer.is_urgent && (
                <View style={styles.urgentPill}>
                  <Ionicons name="flame" size={11} color="#EF4444" />
                  <Text style={styles.urgentText}>Urgente</Text>
                </View>
              )}
            </View>

            <View style={styles.headerRight}>
              <Text style={styles.timeText}>{timeAgo(offer.created_date)}</Text>
              <Pressable
                hitSlop={8}
                onPress={handleSavePress}
                style={({ pressed }) => [
                  styles.saveBtn,
                  pressed && styles.btnPressed,
                ]}
              >
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={17}
                  color={isSaved ? Colors.primary : Colors.textLight}
                />
              </Pressable>
            </View>
          </View>

          {/* ── Título y descripción ── */}
          <Text style={styles.title} numberOfLines={2}>
            {offer.title}
          </Text>
          {offer.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {offer.description}
            </Text>
          ) : null}

          {/* ── Meta chips ── */}
          <View style={styles.metaRow}>
            {budget && (
              <View style={[styles.chip, styles.chipBudget]}>
                <Ionicons name="cash-outline" size={12} color="#10B981" />
                <Text style={[styles.chipText, { color: '#10B981' }]}>{budget}</Text>
              </View>
            )}
            {offer.location && (
              <View style={styles.chip}>
                <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
                <Text style={styles.chipText}>{offer.location}</Text>
              </View>
            )}
            {offer.date && (
              <View style={styles.chip}>
                <Ionicons name="calendar-outline" size={12} color={Colors.textSecondary} />
                <Text style={styles.chipText}>{offer.date}</Text>
              </View>
            )}
          </View>

          {/* ── Footer ── */}
          <View style={styles.footer}>
            {/* Poster */}
            <View style={styles.posterRow}>
              <View style={[styles.avatar, { backgroundColor: avatarColor(offer.poster_name) }]}>
                <Text style={styles.avatarText}>{getInitials(offer.poster_name)}</Text>
              </View>
              <View>
                <Text style={styles.posterName} numberOfLines={1}>
                  {offer.poster_name ?? 'Anónimo'}
                </Text>
                {offer.category && (
                  <Text style={styles.posterCategory}>{offer.category}</Text>
                )}
              </View>
            </View>

            {/* Acciones */}
            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [styles.chatBtn, pressed && styles.btnPressed]}
                onPress={handleChatPress}
                hitSlop={4}
              >
                <MaterialCommunityIcons name="chat-outline" size={15} color={Colors.textSecondary} />
                <Text style={styles.chatBtnText}>Chat</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.applyBtn, pressed && styles.btnPressed]}
                onPress={handleApplyPress}
              >
                <LinearGradient
                  // FIX: antes era Colors.primary + '20' que concatenaba string literal
                  colors={[Colors.primary, Colors.accent ?? Colors.primary]}
                  style={styles.applyGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.applyText}>Aplicar</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  // Franja izquierda de color — identidad visual del tipo
  typeAccent: {
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  inner: {
    flex: 1,
    padding: 14,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    letterSpacing: 0.2,
  },
  urgentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EF444418',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  urgentText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#EF4444',
  },
  timeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textLight,
  },
  saveBtn: {
    padding: 2,
  },

  // Contenido
  title: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    lineHeight: 21,
    marginBottom: 5,
  },
  description: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },

  // Meta chips
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceAlt ?? '#F4F6FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chipBudget: {
    backgroundColor: '#10B98112',
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  posterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  // FIX: avatar circular, no cuadrado
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },
  posterName: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    maxWidth: 110,
  },
  posterCategory: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textLight,
  },

  // Botones
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt ?? '#F4F6FA',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chatBtnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.textSecondary,
  },
  applyBtn: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  applyGradient: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  applyText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },
  btnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
});