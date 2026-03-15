// ─────────────────────────────────────────────────────────────────────────────
// EventCardList.tsx — Card de lista para eventos en Favoritos
// Dark mode completo + botón + Proyecto + diseño mejorado
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '../../../../store/themeStore';
import type { Event } from '../../../../types/explore';
import { listCardStyles, formatPrice } from './listCardStyles';

// ── Props ─────────────────────────────────────────────────────────────────────
interface EventCardListProps {
  event: Event;
  isSaved?: boolean;
  onPress?: () => void;
  onToggleFavorite?: (id: string) => void;
  onAddToProject?: (event: Event) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export const EventCardList: React.FC<EventCardListProps> = ({
  event,
  isSaved = true,
  onPress,
  onToggleFavorite,
  onAddToProject,
}) => {
  const { isDark } = useThemeStore();
  const [saved, setSaved] = useState(isSaved);
  const isAvail = event.availability === 'Disponible';

  const handleToggleFavorite = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaved(p => !p);
    onToggleFavorite?.(event.id);
  };

  const handleAddToProject = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddToProject?.(event);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        listCardStyles.card,
        isDark && listCardStyles.cardDark,
        pressed && listCardStyles.cardPressed,
      ]}
    >
      {/* ── IMAGEN ── */}
      <View style={listCardStyles.imageContainer}>
        <Image
          source={{ uri: event.image }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />

        <LinearGradient
          colors={['transparent', 'rgba(10,6,24,0.75)']}
          style={listCardStyles.imageGradient}
        />

        {/* Rating top-left */}
        <View style={listCardStyles.ratingBadge}>
          <Ionicons name="star" size={10} color="#fbbf24" />
          <Text style={listCardStyles.ratingText}>{event.rating}</Text>
        </View>

        {/* Guardado top-right */}
        <Pressable
          onPress={handleToggleFavorite}
          hitSlop={8}
          style={({ pressed }) => [
            listCardStyles.heartBtn,
            pressed && { opacity: 0.6 },
          ]}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={14}
            color={saved ? '#a78bfa' : 'rgba(255,255,255,0.75)'}
          />
        </Pressable>

        {/* Disponibilidad bottom-left — siempre efecto espejo blanco */}
        <View style={[listCardStyles.availBadge, listCardStyles.availBadgeMirror]}>
          <View style={[listCardStyles.availDot, { backgroundColor: 'rgba(255,255,255,0.9)' }]} />
          <Text style={[listCardStyles.availText, { color: 'rgba(255,255,255,0.95)' }]}>
            {isAvail ? 'Disponible' : 'Agotado'}
          </Text>
        </View>
      </View>

      {/* ── CONTENIDO ── */}
      <View style={[listCardStyles.info, isDark && listCardStyles.infoDark]}>

        {/* Top: nombre + meta */}
        <View style={listCardStyles.nameRow}>
          <Text style={[listCardStyles.name, isDark && listCardStyles.nameDark]} numberOfLines={1}>
            {event.name}
          </Text>
        </View>

        {/* Fecha · hora */}
        <View style={listCardStyles.metaRow}>
          <Ionicons name="calendar-outline" size={11} color={isDark ? '#a78bfa' : '#7c3aed'} />
          <Text style={[listCardStyles.subtitle, isDark && listCardStyles.subtitleDark]} numberOfLines={1}>
            {event.date}{event.time ? ` · ${event.time}` : ''}
          </Text>
        </View>

        {/* Ubicación */}
        <View style={listCardStyles.metaRow}>
          <Ionicons name="location-outline" size={11} color={isDark ? '#6b7280' : '#9ca3af'} />
          <Text style={[listCardStyles.metaText, isDark && listCardStyles.metaTextDark]} numberOfLines={1}>
            {event.location || '—'}
          </Text>
        </View>

        {/* Venue */}
        <View style={listCardStyles.metaRow}>
          <Ionicons name="business-outline" size={11} color={isDark ? '#6b7280' : '#9ca3af'} />
          <Text style={[listCardStyles.metaText, isDark && listCardStyles.metaTextDark]} numberOfLines={1}>
            {event.venue || '—'}
          </Text>
        </View>

        {/* Divider */}
        <View style={[listCardStyles.divider, isDark && listCardStyles.dividerDark]} />

        {/* Bottom: precio + acciones */}
        <View style={listCardStyles.infoBottom}>
          <View>
            <Text style={[listCardStyles.priceLabel, isDark && listCardStyles.priceLabelDark]}>Entrada</Text>
            <Text style={[listCardStyles.price, isDark && listCardStyles.priceDark]}>
              {formatPrice(event.price)}
            </Text>
          </View>

          <View style={listCardStyles.actions}>
            {/* + Proyecto */}
            <Pressable
              onPress={handleAddToProject}
              hitSlop={4}
              style={({ pressed }) => [
                listCardStyles.projectBtn,
                isDark && listCardStyles.projectBtnDark,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons
                name="folder-outline"
                size={12}
                color={isDark ? '#fff' : '#7c3aed'}
              />
              <Text style={[listCardStyles.projectBtnText, isDark && listCardStyles.projectBtnTextDark]}>
                + Proyecto
              </Text>
            </Pressable>
          </View>
        </View>

      </View>
    </Pressable>
  );
};