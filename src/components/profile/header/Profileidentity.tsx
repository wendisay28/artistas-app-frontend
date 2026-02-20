// ─────────────────────────────────────────────────────────────────────────────
// ProfileIdentity.tsx — Identidad del artista · Rediseño refinado
// Stats compactos · tags estilo LinkedIn · botones con jerarquía clara
// Stack: expo-image · expo-haptics · @expo/vector-icons · ../theme
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Radius, Spacing, Shadow } from '../../../theme';
import { Artist } from '../types';
import { Badge } from '../../shared';
import { EditButton } from '../shared/EditButton';

// ── Constantes ────────────────────────────────────────────────────────────────

const AVATAR_SZ = 82;
const PULL_UP   = 44;

// ── Helpers ───────────────────────────────────────────────────────────────────

const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
  if (Platform.OS !== 'web') Haptics.impactAsync(style);
};

const fmtStat = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

// Formatear horario para mostrar versión resumida
const formatSchedule = (schedule?: string): string => {
  if (!schedule) return 'No disponible';
  
  // Obtener el día actual
  const today = new Date().getDay(); // 0 = Domingo, 1 = Lunes, etc.
  const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const currentDay = dayNames[today];
  const currentDayLabel = dayLabels[today];
  
  // Si el horario es del formato simple (ej: "Lun-Vie 6pm-10pm")
  if (schedule.includes('-')) {
    // Verificar si hoy está en el rango de días
    if (schedule.includes('Lun-Vie') && today >= 1 && today <= 5) {
      const timeMatch = schedule.match(/(\d{1,2}:?\d{0,2}(?:am|pm))-(\d{1,2}:?\d{0,2}(?:am|pm))/);
      if (timeMatch) {
        return `${currentDayLabel} ${timeMatch[1]}-${timeMatch[2]}`;
      }
    }
    
    // Verificar otros rangos comunes
    const ranges = [
      { pattern: 'Lun-Sáb', days: [1,2,3,4,5,6] },
      { pattern: 'Lun-Dom', days: [1,2,3,4,5,6,0] },
      { pattern: 'Mar-Sáb', days: [2,3,4,5,6] },
      { pattern: 'Mar-Dom', days: [2,3,4,5,6,0] },
      { pattern: 'Sáb-Dom', days: [6,0] },
    ];
    
    for (const range of ranges) {
      if (schedule.includes(range.pattern) && range.days.includes(today)) {
        const timeMatch = schedule.match(/(\d{1,2}:?\d{0,2}(?:am|pm))-(\d{1,2}:?\d{0,2}(?:am|pm))/);
        if (timeMatch) {
          return `${currentDayLabel} ${timeMatch[1]}-${timeMatch[2]}`;
        }
      }
    }
  }
  
  // Si es formato individual (ej: "Lun 6pm-10pm, Mar 8am-2pm")
  const individualDays = schedule.split(',').map(day => day.trim());
  for (const daySchedule of individualDays) {
    const dayMatch = daySchedule.match(/^(Lun|Mar|Mié|Jue|Vie|Sáb|Dom)\s+(\d{1,2}:?\d{0,2}(?:am|pm))-(\d{1,2}:?\d{0,2}(?:am|pm))$/);
    if (dayMatch) {
      const [, dayLabel, startTime, endTime] = dayMatch;
      const dayIndex = dayLabels.indexOf(dayLabel);
      if (dayIndex === today) {
        return `${dayLabel} ${startTime}-${endTime}`;
      }
    }
  }
  
  // Si no se encuentra el día actual, verificar si está disponible hoy
  const isTodayAvailable = individualDays.some(daySchedule => {
    const dayMatch = daySchedule.match(/^(Lun|Mar|Mié|Jue|Vie|Sáb|Dom)/);
    return dayMatch && dayLabels.indexOf(dayMatch[1]) === today;
  });
  
  if (!isTodayAvailable) {
    return `${currentDayLabel} No disponible`;
  }
  
  return schedule; // fallback al formato original
};

// Función para obtener icono de etiqueta (igual que en ArtistCardContent)
const getTagIcon = (tag: string): any => {
  const t = tag.toLowerCase();
  if (t.includes('retratos') || t.includes('foto')) return 'camera-outline';
  if (t.includes('música') || t.includes('concierto')) return 'musical-notes-outline';
  if (t.includes('arte') || t.includes('pintura')) return 'color-palette-outline';
  if (t.includes('diseño')) return 'brush-outline';
  return 'pricetag-outline';
};

// ── Avatar Placeholder ────────────────────────────────────────────────────────

const AvatarPlaceholder: React.FC<{ initials?: string }> = ({ initials }) => (
  <View style={ap.wrap}>
    {initials ? (
      <Text style={ap.initials}>{initials}</Text>
    ) : (
      <Ionicons name="person-outline" size={30} color={Colors.text3} />
    )}
  </View>
);

const ap = StyleSheet.create({
  wrap: {
    width: AVATAR_SZ,
    height: AVATAR_SZ,
    borderRadius: 16, // Cuadrado con bordes redondeados modernos
    backgroundColor: Colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(124, 58, 237, 0.1)', // Borde sutil púrpura
  },
  initials: {
    fontSize: 26,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text2,
    letterSpacing: -0.5,
  },
});

// ── Main Component ────────────────────────────────────────────────────────────

export type ProfileIdentityProps = {
  artist:        Artist;
  onFollow?:     () => void;
  onHire?:       () => void;
  onMessage?:    () => void;
  onMore?:       () => void;
  onEditAvatar?: () => void;
  onEditProfile?: () => void;
};

export const ProfileIdentity: React.FC<ProfileIdentityProps> = ({
  artist,
  onFollow,
  onHire,
  onMessage,
  onMore,
  onEditAvatar,
  onEditProfile,
}) => {
  const [followed, setFollowed]   = useState(false);
  const followScale = useRef(new Animated.Value(1)).current;

  const handleFollow = () => {
    triggerHaptic();
    Animated.sequence([
      Animated.spring(followScale, { toValue: 0.92, useNativeDriver: true, speed: 60, bounciness: 4 }),
      Animated.spring(followScale, { toValue: 1,    useNativeDriver: true, speed: 30, bounciness: 12 }),
    ]).start();
    setFollowed(p => !p);
    onFollow?.();
  };

  const initials = artist.name
    ? artist.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : undefined;

  const isAvatarUrl = typeof artist.avatar === 'string' && artist.avatar.startsWith('http');

  return (
    <View style={styles.container}>

      {/* ── Fila avatar + acciones ───────────────────────────────────────────── */}
      <View style={styles.avatarRow}>

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          {isAvatarUrl ? (
            <Image
              source={{ uri: artist.avatar as string }}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <AvatarPlaceholder initials={initials} />
          )}

          {/* Badge verificado — círculo pequeño */}
          {artist.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={9} color="#fff" />
            </View>
          )}

          {/* Editar avatar */}
          {artist.isOwner && (
            <TouchableOpacity
              style={styles.editAvatarBtn}
              onPress={onEditAvatar}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={9} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Botones de acción ───────────────────────────────────────────────── */}
        <View style={styles.actionRow}>

          {/* Seguir — CTA primario */}
          <Animated.View style={{ transform: [{ scale: followScale }] }}>
            <TouchableOpacity
              style={followed ? styles.btnFollowActive : styles.btnFollow}
              onPress={handleFollow}
              activeOpacity={0.85}
            >
              <Ionicons
                name={followed ? 'checkmark' : 'person-add-outline'}
                size={13}
                color={followed ? Colors.accent : Colors.white}
              />
              <Text style={followed ? styles.btnFollowTextActive : styles.btnFollowText}>
                {followed ? 'Siguiendo' : 'Seguir'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Contratar — CTA secundario */}
          <TouchableOpacity
            style={styles.btnHire}
            onPress={() => { triggerHaptic(Haptics.ImpactFeedbackStyle.Medium); onHire?.(); }}
            activeOpacity={0.85}
          >
            <Ionicons name="briefcase-outline" size={13} color={Colors.accent} />
            <Text style={styles.btnHireText}>Contratar</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* ── 1. Primera línea: Nombre + Badge empresa + Editar ── */}
      <View style={styles.firstLine}>
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>{artist.name}</Text>
          {artist.userType === 'company' && (
            <View style={styles.companyBadge}>
              <Ionicons name="business-outline" size={10} color="#1E40AF" />
              <Text style={styles.companyBadgeText}>Empresa</Text>
            </View>
          )}
        </View>
        {artist.isOwner && (
          <EditButton
            onPress={onEditProfile || (() => {})}
            style={styles.editProfileBtn}
          />
        )}
      </View>

      {/* ── 2. Segunda línea: Horarios + Ciudad ── */}
      <View style={styles.secondLine}>
        <Text style={styles.schedule}>
          <Ionicons name="time-outline" size={12} color={Colors.text2} />
          {' '}{formatSchedule(artist.schedule)}
        </Text>
        {artist.location && (
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={12} color={Colors.text2} />
            {' '}{artist.location}
          </Text>
        )}
      </View>

      {/* ── 3. Tercera línea: Descripción (máx 2 líneas) ── */}
      {artist.bio ? (
        <Text style={styles.description} numberOfLines={2}>
          {artist.bio}
        </Text>
      ) : null}

      {/* ── 4. Cuarta línea: 3 etiquetas sobre su arte ── */}
      <View style={styles.tagsLine}>
        {artist.tags && artist.tags.length > 0 ? (
          artist.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.exploreTag}>
              <Ionicons 
                name={getTagIcon(tag.label)} 
                size={10} 
                color={Colors.primary} 
              />
              <Text style={styles.exploreTagText}>{tag.label}</Text>
            </View>
          ))
        ) : (
          <>
            <View style={styles.exploreTag}>
              <Ionicons name="color-palette-outline" size={10} color={Colors.primary} />
              <Text style={styles.exploreTagText}>Arte Digital</Text>
            </View>
            <View style={styles.exploreTag}>
              <Ionicons name="camera-outline" size={10} color={Colors.primary} />
              <Text style={styles.exploreTagText}>Pintura</Text>
            </View>
            <View style={styles.exploreTag}>
              <Ionicons name="brush-outline" size={10} color={Colors.primary} />
              <Text style={styles.exploreTagText}>Ilustración</Text>
            </View>
          </>
        )}
      </View>

      {/* ── Línea divisoria gris clara ── */}
      <View style={styles.divider} />

      {/* ── 5. Quinta línea: Seguidores/Rating/Reseñas ── */}
      <TouchableOpacity 
        style={styles.statsLine}
        onPress={() => console.log('Ver estadísticas completas')}
        activeOpacity={0.8}
      >
        <View style={styles.statItem}>
          <Text style={styles.statText}>2.4K Seguidores</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statText}>4.9 Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statText}>127 Reseñas</Text>
        </View>
      </TouchableOpacity>

    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },

  // ── Avatar row ──────────────────────────────────────────────────────────────
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: -PULL_UP + 8, // Bajado 8px para no estar sobre el borde
    marginBottom: 4, // Reducido significativamente
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: AVATAR_SZ,
    height: AVATAR_SZ,
    borderRadius: 16, // Cuadrado con bordes redondeados modernos
    borderWidth: 3,
    borderColor: Colors.bg,
    // Sombra más pronunciada para destacar el avatar cuadrado
    ...Shadow.md,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10, // Badge circular pero un poco más grande
    backgroundColor: Colors.accent,
    borderWidth: 2.5,
    borderColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra para el badge
    ...Shadow.sm,
  },
  editAvatarBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo más oscuro para mejor contraste
    borderWidth: 2,
    borderColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra para el botón
    ...Shadow.sm,
  },

  // ── Acciones ───────────────────────────────────────────────────────────────────
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Más espacio entre botones
    paddingBottom: 8, // Más padding inferior
    alignSelf: 'flex-end', // Alineados a la derecha
  },

  // CTA primario — Seguir
  btnFollow: {
    height: 36, // Un poco más alto
    paddingHorizontal: 18, // Más padding horizontal
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // Más espacio entre icono y texto
    ...Shadow.sm, // Sombra suave
  },
  btnFollowActive: {
    height: 36,
    paddingHorizontal: 18,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.accentMid,
  },
  btnFollowText: { 
    fontSize: 13, 
    fontFamily: 'PlusJakartaSans_700Bold', 
    color: Colors.white 
  },
  btnFollowTextActive: { 
    fontSize: 13, 
    fontFamily: 'PlusJakartaSans_700Bold', 
    color: Colors.accent 
  },

  // CTA secundario — Contratar
  btnHire: {
    height: 36, // Más alto
    paddingHorizontal: 16, // Más padding
    backgroundColor: 'transparent',
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // Más espacio entre icono y texto
    borderWidth: 1.5, // Borde más grueso
    borderColor: Colors.accent,
  },
  btnHireText: { 
    fontSize: 13, 
    fontFamily: 'PlusJakartaSans_600SemiBold', 
    color: Colors.accent 
  },

  // ── Texto identidad ─────────────────────────────────────────────────────────
  name: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    letterSpacing: -0.4,
    lineHeight: 26,
  },

  // ── Divisor ─────────────────────────────────────────────────────────────────
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginVertical: 4, // Reducido de Spacing.md a 4px
  },

  // ── Nuevo diseño organizado del header ──────────────────────────────────────────
  
  // 1. Primera línea: Nombre + Usuario + Editar
  firstLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 2,
  },
  nameContainer: {
    flex: 1,
    gap: 4,
  },
  editProfileBtn: {
    marginLeft: 8,
  },
  companyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  companyBadgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E40AF',
    letterSpacing: 0.3,
  },
  username: {
    fontSize: 14,
    color: Colors.text2,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  handle: {
    fontSize: 12,
    color: Colors.text3, // Más claro que username
    fontFamily: 'PlusJakartaSans_400Regular', // Más ligero
    marginTop: 2,
  },

  // 2. Segunda línea: Horarios + Ciudad
  secondLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  schedule: {
    fontSize: 12,
    color: Colors.text2,
    fontFamily: 'PlusJakartaSans_400Regular',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    color: Colors.text2,
    fontFamily: 'PlusJakartaSans_400Regular',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // 3. Tercera línea: Descripción
  description: {
    fontSize: 13,
    color: Colors.text2,
    fontFamily: 'PlusJakartaSans_400Regular',
    lineHeight: 18,
    marginTop: 6,
  },

  // 4. Cuarta línea: Etiquetas sobre su arte (estilo explorador)
  tagsLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  exploreTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '12', // Igual que en ArtistCardContent
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  exploreTagText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.primary,
  },
  artTag: {
    fontSize: 11,
    color: Colors.accent,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },

  // 5. Quinta línea: Estadísticas
  statsLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 2, // Reducido de Spacing.sm a 2px
    paddingTop: 8, // Añadido padding superior
    paddingBottom: 8, // Añadido padding inferior
    backgroundColor: Colors.surface2, // Fondo más suave
    borderRadius: 8, // Bordes redondeados
    // Sin sombreado
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium', // Cambiado de SemiBold a Medium
    color: Colors.text2, // Cambiado de text a text2 para tono más suave
  },
});