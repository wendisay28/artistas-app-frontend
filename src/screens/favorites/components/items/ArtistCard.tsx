// ArtistCard.tsx — Card cuadrícula artistas · usa gridCardStyles compartido

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '../../../../store/themeStore';
import { gridCardStyles, GRID_IMAGE_HEIGHT, formatPrice } from './Gridcardstyles';
import type { Artist } from '../../../../types/explore';
import { getArtistRoleName } from '../../../../constants';
import { servicesService, type Service } from '../../../../services/api/services';

// Cache compartido — si Explorar ya cargó los servicios de este artista, se reutilizan
const _servicesCache = new Map<string, Service[]>();

interface ArtistCardProps {
  artist: Artist;
  isSaved?: boolean;
  onPress?: () => void;
  onToggleFavorite?: (id: string) => void;
  onAddToProject?: (artist: Artist) => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist, isSaved = true, onPress, onToggleFavorite, onAddToProject,
}) => {
  const { isDark } = useThemeStore();
  const [saved, setSaved] = useState(isSaved);
  const [liveServices, setLiveServices] = useState<Service[]>(
    () => _servicesCache.get(artist.id) ?? []
  );
  const isAvail = artist.availability === 'Disponible';
  const isOccupied = artist.availability === 'Ocupado';

  useEffect(() => {
    if (_servicesCache.has(artist.id)) return;
    servicesService.getUserServices(artist.id)
      .then(res => {
        if (Array.isArray(res) && res.length > 0) {
          _servicesCache.set(artist.id, res);
          setLiveServices(res);
        }
      })
      .catch(() => {});
  }, [artist.id]);

  const handleToggleFavorite = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaved(p => !p);
    onToggleFavorite?.(artist.id);
  };

  const handleAddToProject = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddToProject?.(artist);
  };

  const categoryLabel =
    typeof artist.category === 'string'
      ? artist.category
      : (artist.category as any)?.categoryId ?? 'Artista';

  // Obtener el rol real del artista
  let roleLabel = 'Artista'; // fallback
  
  // Intentar obtener el rol desde artistCategory (estructura nueva)
  if (artist.artistCategory) {
    roleLabel = getArtistRoleName(
      artist.artistCategory.categoryId, 
      artist.artistCategory.disciplineId, 
      artist.artistCategory.roleId
    );
  }
  // Si no hay artistCategory, intentar desde category (estructura vieja como objeto)
  else if (artist.category && typeof artist.category === 'object') {
    roleLabel = getArtistRoleName(
      artist.category.categoryId,
      artist.category.disciplineId, 
      artist.category.roleId
    );
  }
  // Si category es string
  else if (artist.category && typeof artist.category === 'string') {
    roleLabel = artist.category;
  }
  // Último recurso: usar specialty
  else if (artist.specialty) {
    roleLabel = artist.specialty;
  }

  const getLowestPrice = (services: any[]): number | null => {
    if (!services?.length) return null;
    const prices = services
      .map((s: any) => {
        const raw = s.price ?? s.pricePerHour ?? s.price_per_hour ?? s.pricePerSession ?? s.price_per_session ?? s.basePrice ?? s.base_price;
        const n = typeof raw === 'string' ? parseFloat(raw) : Number(raw);
        return isNaN(n) || n <= 0 ? null : n;
      })
      .filter((p): p is number => p !== null);
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  // Prioridad: servicios en vivo (API) → servicesData del objeto → artist.price
  const artistPrice = getLowestPrice(liveServices) ?? getLowestPrice(artist.servicesData) ?? artist.price;
  const hasPrice = artistPrice && artistPrice > 0;

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
          source={{ uri: artist.image }}
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
          <View style={[gridCardStyles.availDot, { backgroundColor: 'rgba(210,210,210,0.9)' }]} />
          <Text style={[gridCardStyles.availText, { color: 'rgba(220,220,220,0.95)' }]}>
            {isAvail ? 'Disponible' : 'Ocupado'}
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

        {/* Rol bottom-left */}
        <LinearGradient
          colors={['rgba(124,58,237,0.85)', 'rgba(37,99,235,0.85)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={gridCardStyles.typePill}
        >
          <Text style={gridCardStyles.typeText} numberOfLines={1}>
            {roleLabel}
          </Text>
        </LinearGradient>

        {/* Rating bottom-right */}
        <View style={gridCardStyles.ratingBadge}>
          <Ionicons name="star" size={9} color="#fbbf24" />
          <Text style={gridCardStyles.ratingText}>{artist.rating}</Text>
        </View>
      </View>

      {/* ── CONTENIDO ── */}
      <View style={gridCardStyles.content}>

        {/* Nombre + verificado */}
        <View style={gridCardStyles.nameRow}>
          <Text style={[gridCardStyles.name, isDark && gridCardStyles.nameDark]} numberOfLines={1}>
            {artist.name}
          </Text>
          {artist.verified && (
            <LinearGradient
              colors={['#7c3aed', '#2563eb']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={gridCardStyles.verifiedBadge}
            >
              <Ionicons name="checkmark" size={8} color="#fff" />
            </LinearGradient>
          )}
        </View>

        {/* Especialidad */}
        <View style={gridCardStyles.meta}>
          <Ionicons name="briefcase-outline" size={10} color={isDark ? '#6b7280' : 'rgba(109,40,217,0.45)'} />
          <Text style={[gridCardStyles.metaText, isDark && gridCardStyles.metaTextDark]} numberOfLines={1}>
            {artist.specialty || categoryLabel}
          </Text>
        </View>

        {/* Ubicación */}
        <View style={gridCardStyles.meta}>
          <Ionicons name="location-outline" size={10} color={isDark ? '#6b7280' : 'rgba(109,40,217,0.45)'} />
          <Text style={[gridCardStyles.metaText, isDark && gridCardStyles.metaTextDark]} numberOfLines={1}>
            {artist.location}{artist.distance ? ` · ${artist.distance}` : ''}
          </Text>
        </View>

        <View style={[gridCardStyles.divider, isDark && gridCardStyles.dividerDark]} />

        {/* Precio pequeño */}
        <View style={gridCardStyles.footer}>
          <Text style={[gridCardStyles.priceLabel, isDark && gridCardStyles.priceLabelDark]}>
            Desde
          </Text>
          <View style={gridCardStyles.priceRow}>
            {hasPrice ? (
              <>
                <Text style={[gridCardStyles.price, isDark && gridCardStyles.priceDark]}>
                  {formatPrice(artistPrice)}
                </Text>
                <Text style={[gridCardStyles.priceUnit, isDark && gridCardStyles.priceUnitDark]}>/h</Text>
              </>
            ) : (
              <Text style={[gridCardStyles.price, isDark && gridCardStyles.priceDark]}>Consultar</Text>
            )}
          </View>
        </View>

        {/* Segunda línea divisora */}
        <View style={[gridCardStyles.divider, isDark && gridCardStyles.dividerDark, { marginTop: 8 }]} />

        {/* + Proyecto centrado y más grande */}
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