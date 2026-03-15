// ArtistCardList.tsx — Card de lista para artistas en Favoritos
// Dark mode + botón + Proyecto + sin botón Ver (toda la card es clickeable)

import React, { useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '../../../../store/themeStore';
import type { Artist } from '../../../../types/explore';
import { listCardStyles, formatPrice } from './listCardStyles';
import { servicesService, type Service } from '../../../../services/api/services';

const getCategoryMeta = (category?: string): { icon: any; label: string } => {
  if (!category) return { icon: 'person-outline', label: 'Artista' };
  const cat = category.toLowerCase();
  if (cat.includes('fotógrafo') || cat.includes('fotografia')) return { icon: 'camera-outline', label: 'Fotógrafo' };
  if (cat.includes('músico') || cat.includes('música')) return { icon: 'musical-notes-outline', label: 'Música' };
  if (cat.includes('artista') || cat.includes('arte')) return { icon: 'color-palette-outline', label: 'Arte' };
  if (cat.includes('diseñador')) return { icon: 'brush-outline', label: 'Diseño' };
  if (cat.includes('video') || cat.includes('audiovisual')) return { icon: 'videocam-outline', label: 'Video' };
  return { icon: 'person-outline', label: category };
};

const getArtistSpecialty = (artist: Artist): string => {
  // Prioridad: specialty > style > services[0] > categoría
  if (artist.specialty) return artist.specialty;
  if (artist.style) return artist.style;
  if (artist.services && artist.services.length > 0) return artist.services[0];
  
  // Fallback a la categoría
  const cat = getCategoryMeta(
    typeof artist.category === 'string' ? artist.category : artist.category?.disciplineId
  );
  return cat.label;
};

interface ArtistCardListProps {
  artist: Artist;
  isSaved?: boolean;
  onPress?: () => void;
  onToggleFavorite?: (id: string) => void;
  onAddToProject?: (artist: Artist) => void;
}

// Función para obtener el precio más bajo de los servicios
const getLowestPrice = (services: Service[]): number | null => {
  if (!services?.length) return null;
  const prices = services
    .map((s: any) => {
      const raw = s.price ?? s.pricePerHour ?? s.price_per_hour ??
        s.pricePerSession ?? s.price_per_session ?? s.basePrice ?? s.base_price;
      const n = typeof raw === 'string' ? parseFloat(raw) : Number(raw);
      return isNaN(n) || n <= 0 ? null : n;
    })
    .filter((p): p is number => p !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
};

export const ArtistCardList: React.FC<ArtistCardListProps> = ({
  artist,
  isSaved = true,
  onPress,
  onToggleFavorite,
  onAddToProject,
}) => {
  const { isDark } = useThemeStore();
  const [saved, setSaved] = useState(isSaved);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const isAvail = artist.availability === 'Disponible';

  // Cargar servicios del artista
  React.useEffect(() => {
    const loadServices = async () => {
      try {
        const artistServices = await servicesService.getUserServices(artist.id);
        setServices(artistServices);
      } catch (error) {
        console.error('Error loading artist services:', error);
      } finally {
        setServicesLoaded(true);
      }
    };
    loadServices();
  }, [artist.id]);
  const cat = getCategoryMeta(
    typeof artist.category === 'string' ? artist.category : artist.category?.disciplineId
  );

  const handleToggleFavorite = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaved(p => !p);
    onToggleFavorite?.(artist.id);
  };

  const handleAddToProject = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddToProject?.(artist);
  };

  // Calcular el precio más bajo de los servicios
  const lowestPrice = getLowestPrice(services);

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
          source={{ uri: artist.image }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />

        <LinearGradient
          colors={['transparent', 'rgba(30,27,75,0.72)']}
          style={listCardStyles.imageGradient}
        />

        {/* Rating top-left */}
        <View style={listCardStyles.ratingBadge}>
          <Ionicons name="star" size={9} color="#fbbf24" />
          <Text style={listCardStyles.ratingText}>{artist.rating}</Text>
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
            size={15}
            color={saved ? '#a78bfa' : 'rgba(255,255,255,0.75)'}
          />
        </Pressable>

        {/* Disponibilidad bottom-left — siempre efecto espejo blanco */}
        <View style={[listCardStyles.availBadge, listCardStyles.availBadgeMirror]}>
          <View style={[listCardStyles.availDot, { backgroundColor: 'rgba(255,255,255,0.9)' }]} />
          <Text style={[listCardStyles.availText, { color: 'rgba(255,255,255,0.95)' }]}>
            {isAvail ? 'Disponible' : 'Ocupado'}
          </Text>
        </View>
      </View>

      {/* ── INFO ── */}
      <View style={[listCardStyles.info, isDark && listCardStyles.infoDark]}>

        {/* Nombre + verificado */}
        <View style={listCardStyles.nameRow}>
          <Text style={[listCardStyles.name, isDark && listCardStyles.nameDark]} numberOfLines={1}>
            {artist.name}
          </Text>
          {artist.verified && (
            <LinearGradient
              colors={['#7c3aed', '#2563eb']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={listCardStyles.verifiedBadge}>
              <Ionicons name="checkmark" size={8} color="#fff" />
            </LinearGradient>
          )}
        </View>

        {/* Categoría */}
        <View style={listCardStyles.metaRow}>
          <Ionicons name={cat.icon} size={10} color={isDark ? '#a78bfa' : '#7c3aed'} />
          <Text style={[listCardStyles.subtitle, isDark && listCardStyles.subtitleDark]} numberOfLines={1}>
            {cat.label}
          </Text>
        </View>

        {/* Ubicación */}
        <View style={listCardStyles.metaRow}>
          <Ionicons name="location-outline" size={11} color={isDark ? '#6b7280' : '#9ca3af'} />
          <Text style={[listCardStyles.metaText, isDark && listCardStyles.metaTextDark]} numberOfLines={1}>
            {artist.location}{artist.distance ? ` · ${artist.distance}` : ''}
          </Text>
        </View>

        {/* Especialidad */}
        <View style={listCardStyles.metaRow}>
          <Ionicons name="star-outline" size={11} color={isDark ? '#6b7280' : '#9ca3af'} />
          <Text style={[listCardStyles.metaText, isDark && listCardStyles.metaTextDark]} numberOfLines={1}>
            {getArtistSpecialty(artist)}
          </Text>
        </View>

        <View style={[listCardStyles.divider, isDark && listCardStyles.dividerDark]} />

        {/* Footer: precio + botón proyecto */}
        <View style={listCardStyles.infoBottom}>
          <View style={{ flexShrink: 1, marginRight: 8 }}>
            <Text style={[listCardStyles.priceLabel, isDark && listCardStyles.priceLabelDark]}>Desde</Text>
            <View style={listCardStyles.priceRow}>
              <Text style={[listCardStyles.price, isDark && listCardStyles.priceDark]}>
                {servicesLoaded && lowestPrice ? formatPrice(lowestPrice) : '---'}
              </Text>
              <Text style={[listCardStyles.priceUnit, isDark && listCardStyles.priceUnitDark]}>
                {servicesLoaded && lowestPrice ? '/h' : ''}
              </Text>
            </View>
          </View>

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
    </Pressable>
  );
};