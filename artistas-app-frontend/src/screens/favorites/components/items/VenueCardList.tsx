// VenueCardList.tsx — Card de lista para salas/venues en Favoritos (v2)

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../../constants/colors';
import { listCardStyles, formatPrice } from './listCardStyles';
import type { Venue } from '../../../../types/explore';

interface VenueCardListProps {
  venue: Venue;
  onPress?: () => void;
  onToggleFavorite?: (id: string) => void;
}

export const VenueCardList: React.FC<VenueCardListProps> = ({
  venue,
  onPress,
  onToggleFavorite,
}) => {
  const [saved, setSaved] = useState(true);
  const isAvail = venue.availability === 'Disponible';

  const handleToggleFavorite = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaved(p => !p);
    onToggleFavorite?.(venue.id);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        listCardStyles.card,
        pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
      ]}
    >
      {/* ── IMAGEN ── */}
      <View style={listCardStyles.imageContainer}>
        <Image
          source={{ uri: venue.image }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />

        <LinearGradient
          colors={['transparent', 'rgba(30,27,75,0.65)']}
          style={listCardStyles.imageGradient}
        />

        {/* Rating */}
        <View style={listCardStyles.ratingBadge}>
          <Ionicons name="star" size={10} color="#fbbf24" />
          <Text style={listCardStyles.ratingText}>{venue.rating}</Text>
        </View>

        {/* Corazón */}
        <Pressable
          onPress={handleToggleFavorite}
          hitSlop={6}
          style={({ pressed }) => [
            listCardStyles.heartBtn,
            pressed && { opacity: 0.6 },
          ]}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={14}
            color={saved ? '#ef4444' : '#9ca3af'}
          />
        </Pressable>

        {/* Disponibilidad */}
        <View style={[
          listCardStyles.availBadge,
          { backgroundColor: isAvail ? 'rgba(16,185,129,0.18)' : 'rgba(245,158,11,0.18)' },
        ]}>
          <View style={[
            listCardStyles.availDot,
            { backgroundColor: isAvail ? '#10b981' : '#f59e0b' },
          ]} />
          <Text style={[
            listCardStyles.availText,
            { color: isAvail ? '#065f46' : '#92400e' },
          ]}>
            {isAvail ? 'Disponible' : 'Ocupada'}
          </Text>
        </View>
      </View>

      {/* ── CONTENIDO ── */}
      <View style={listCardStyles.info}>
        <View style={listCardStyles.infoTop}>

          <View style={listCardStyles.nameRow}>
            <Text style={listCardStyles.name} numberOfLines={1}>{venue.name}</Text>
          </View>

          {/* Categoría */}
          <Text style={listCardStyles.subtitle} numberOfLines={1}>{venue.category}</Text>

          {/* Ubicación */}
          <View style={listCardStyles.metaRow}>
            <Ionicons name="location-outline" size={11} color={colors.textSecondary} />
            <Text style={listCardStyles.metaText} numberOfLines={1}>{venue.location}</Text>
          </View>

          {/* Capacidad */}
          <View style={listCardStyles.metaRow}>
            <Ionicons name="people-outline" size={11} color={colors.textSecondary} />
            <Text style={listCardStyles.metaText} numberOfLines={1}>Cap. {venue.capacity}</Text>
          </View>
        </View>

        <View style={listCardStyles.divider} />

        <View style={listCardStyles.infoBottom}>
          <View>
            <Text style={listCardStyles.priceLabel}>Desde</Text>
            <View style={listCardStyles.priceRow}>
              <Text style={listCardStyles.price}>{formatPrice(venue.price)}</Text>
            </View>
          </View>

          <Pressable
            onPress={onPress}
            style={({ pressed }) => [
              listCardStyles.contactBtn,
              pressed && listCardStyles.contactBtnPressed,
            ]}
          >
            <LinearGradient
              colors={['#7c3aed', '#2563eb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={listCardStyles.contactGradient}
            >
              <Ionicons name="chevron-forward" size={12} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};
