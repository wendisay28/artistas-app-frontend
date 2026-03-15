// EventCard.tsx — Card cuadrícula eventos · usa gridCardStyles compartido

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '../../../../store/themeStore';
import { gridCardStyles, GRID_IMAGE_HEIGHT, formatPrice } from './Gridcardstyles';
import type { Event } from '../../../../types/explore';

interface EventCardProps {
  event: Event;
  isSaved?: boolean;
  onPress?: () => void;
  onToggleFavorite?: (id: string) => void;
  onAddToProject?: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event, isSaved = true, onPress, onToggleFavorite, onAddToProject,
}) => {
  const { isDark } = useThemeStore();
  const [saved, setSaved] = useState(isSaved);
  const isAvail = event.availability === 'Disponible';
  const isSoldOut = event.availability === 'Agotado';
  const isFree = event.price === 0;

  const handleToggleFavorite = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaved(p => !p);
    onToggleFavorite?.(event.id);
  };

  const handleAddToProject = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddToProject?.(event);
  };

  // Color del badge de disponibilidad
  const availStyle = isSoldOut
    ? gridCardStyles.availBadgeRed
    : isAvail
    ? gridCardStyles.availBadgeGreen
    : gridCardStyles.availBadgeAmber;

  const availDotColor = 'rgba(210,210,210,0.9)';
  const availTextColor = 'rgba(220,220,220,0.95)';
  const availLabel = isSoldOut ? 'Agotado' : isAvail ? 'Disponible' : 'Limitado';

  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={({ pressed }) => [
        gridCardStyles.card,
        isDark && gridCardStyles.cardDark,
        pressed && gridCardStyles.cardPressed,
      ]}
    >
      {/* ── IMAGEN ── */}
      <View style={gridCardStyles.imageWrapper}>
        <Image
          source={{ uri: event.image }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient
          colors={['transparent', 'rgba(10,6,24,0.82)']}
          style={gridCardStyles.imageGradient}
        />

        {/* Disponibilidad top-left */}
        <View style={[gridCardStyles.availBadge, gridCardStyles.availBadgeMirror]}>
          <View style={[gridCardStyles.availDot, { backgroundColor: availDotColor }]} />
          <Text style={[gridCardStyles.availText, { color: availTextColor }]}>
            {availLabel}
          </Text>
        </View>

        {/* Guardado top-right */}
        <Pressable
          onPress={handleToggleFavorite}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={({ pressed }) => [
            gridCardStyles.heartBtn,
            pressed && { opacity: 0.6 },
          ]}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={17}
            color={saved ? '#a78bfa' : 'rgba(255,255,255,0.75)'}
          />
        </Pressable>

        {/* Categoría bottom-left */}
        <LinearGradient
          colors={['rgba(124,58,237,0.85)', 'rgba(37,99,235,0.85)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={gridCardStyles.typePill}
        >
          <Text style={gridCardStyles.typeText} numberOfLines={1}>
            Evento
          </Text>
        </LinearGradient>

        {/* Rating bottom-right */}
        <View style={gridCardStyles.ratingBadge}>
          <Ionicons name="star" size={9} color="#fbbf24" />
          <Text style={gridCardStyles.ratingText}>{event.rating}</Text>
        </View>
      </View>

      {/* ── CONTENIDO ── */}
      <View style={gridCardStyles.content}>

        {/* Nombre */}
        <View style={gridCardStyles.nameRow}>
          <Text style={[gridCardStyles.name, isDark && gridCardStyles.nameDark]} numberOfLines={1}>
            {event.name}
          </Text>
        </View>

        {/* Fecha · hora */}
        <View style={gridCardStyles.meta}>
          <Ionicons name="calendar-outline" size={10} color={isDark ? '#6b7280' : 'rgba(109,40,217,0.45)'} />
          <Text style={[gridCardStyles.metaText, isDark && gridCardStyles.metaTextDark]} numberOfLines={1}>
            {event.date}{event.time ? ` · ${event.time}` : ''}
          </Text>
        </View>

        {/* Lugar */}
        <View style={gridCardStyles.meta}>
          <Ionicons name="location-outline" size={10} color={isDark ? '#6b7280' : 'rgba(109,40,217,0.45)'} />
          <Text style={[gridCardStyles.metaText, isDark && gridCardStyles.metaTextDark]} numberOfLines={1}>
            {event.venue}
          </Text>
        </View>

        <View style={[gridCardStyles.divider, isDark && gridCardStyles.dividerDark]} />

        {/* Precio pequeño */}
        <View style={gridCardStyles.footer}>
          <Text style={[gridCardStyles.priceLabel, isDark && gridCardStyles.priceLabelDark]}>Entrada</Text>
          {isFree ? (
            <Text style={gridCardStyles.priceFree}>Gratis</Text>
          ) : (
            <Text style={[gridCardStyles.price, isDark && gridCardStyles.priceDark]}>
              {formatPrice(event.price)}
            </Text>
          )}
        </View>

        {/* Segunda línea divisora */}
        <View style={[gridCardStyles.divider, isDark && gridCardStyles.dividerDark, { marginTop: 8 }]} />

        {/* + Proyecto centrado */}
        <Pressable
          onPress={handleAddToProject}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [
            gridCardStyles.projectBtn,
            isDark && gridCardStyles.projectBtnDark,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="folder-outline" size={13} color={isDark ? '#fff' : '#7c3aed'} />
          <Text style={[gridCardStyles.projectBtnText, isDark && gridCardStyles.projectBtnTextDark]}>
            + Proyecto
          </Text>
        </Pressable>

      </View>
    </Pressable>
  );
};