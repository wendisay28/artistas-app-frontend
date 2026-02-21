// ─────────────────────────────────────────────────────────────────────────────
// ProfileIdentity.tsx — Header perfil artista · BuscArt
// NOTA: La portada la maneja ProfileHero — renderizar ANTES que este.
//
// Estructura fija:
//   Avatar flotante + botones (... · Editar perfil · Seguir)  ← owner
//   Avatar flotante + botones (... · Contratar)               ← visitante
//   Línea 1: Nombre + @handle | Ciudad
//   Línea 2: Disponibilidad (compacta) + Ciudad pill
//   Línea 3: Bio máx 105 chars  /  placeholder + skeleton tags
//   Línea 4: 3 etiquetas
//   Strip: Compartir · Ver como cliente                       ← solo owner
//   Botón Seguir ancho completo                               ← solo visitante
//   Stats: Seguidores · Vistas · Reseñas  (delgado)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing } from '../../../theme';
import { Artist } from '../types';
import { EditButton } from '../shared/EditButton';

// ── Constantes ────────────────────────────────────────────────────────────────

const AVATAR_SZ      = 76;
const AVATAR_OVERLAP = 38;

// ── Helpers ───────────────────────────────────────────────────────────────────

const truncateBio = (bio: string, maxLength = 105): string => {
  if (bio.length <= maxLength) return bio;
  const truncated = bio.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > maxLength * 0.6 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
};

const getTagIcon = (tag: string): any => {
  const t = tag.toLowerCase();
  if (t.includes('retratos') || t.includes('foto'))     return 'camera-outline';
  if (t.includes('música')   || t.includes('concierto')) return 'musical-notes-outline';
  if (t.includes('arte')     || t.includes('pintura'))   return 'color-palette-outline';
  if (t.includes('diseño'))                              return 'brush-outline';
  return 'pricetag-outline';
};

// ── Disponibilidad ────────────────────────────────────────────────────────────

const AVAILABILITY = {
  available:   { label: 'Disponible',    color: '#16a34a', bg: 'rgba(22,163,74,0.08)',  border: 'rgba(22,163,74,0.2)',  dot: '#16a34a' },
  busy:        { label: 'Ocupado',       color: '#d97706', bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.2)',  dot: '#d97706' },
  unavailable: { label: 'No disponible', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.2)', dot: '#dc2626' },
} as const;
type AvailabilityKey = keyof typeof AVAILABILITY;

// ── Dot con pulso animado ─────────────────────────────────────────────────────

const PulsingDot: React.FC<{ color: string }> = ({ color }) => {
  const pulse   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse,   { toValue: 2,   duration: 950, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulse,   { toValue: 1,   duration: 950, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0,   duration: 950, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: 950, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={{ width: 10, height: 10, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{
        position: 'absolute',
        width: 10, height: 10, borderRadius: 5,
        backgroundColor: color,
        transform: [{ scale: pulse }],
        opacity,
      }} />
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
    </View>
  );
};

// ── Avatar Placeholder ────────────────────────────────────────────────────────

const AvatarPlaceholder: React.FC<{ initials?: string }> = ({ initials }) => (
  <View style={ap.wrap}>
    {initials
      ? <Text style={ap.initials}>{initials}</Text>
      : <Ionicons name="person-outline" size={28} color="rgba(124,58,237,0.45)" />
    }
  </View>
);

const ap = StyleSheet.create({
  wrap: {
    width: AVATAR_SZ, height: AVATAR_SZ,
    borderRadius: AVATAR_SZ * 0.28,
    backgroundColor: '#f0ebff',
    alignItems: 'center', justifyContent: 'center',
  },
  initials: {
    fontSize: 24, fontFamily: 'PlusJakartaSans_700Bold',
    color: '#7c3aed', letterSpacing: -0.5,
  },
});

// ── Props ─────────────────────────────────────────────────────────────────────

export type ProfileIdentityProps = {
  artist:                Artist;
  onFollow?:             () => void;
  onHire?:               () => void;
  onMore?:               () => void;
  onEditAvatar?:         () => void;
  onEditProfile?:        () => void;
  onToggleAvailability?: () => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export const ProfileIdentity: React.FC<ProfileIdentityProps> = ({
  artist,
  onFollow,
  onHire,
  onMore,
  onEditAvatar,
  onEditProfile,
  onToggleAvailability,
}) => {
  const [followed, setFollowed] = useState(false);
  const followScale = useRef(new Animated.Value(1)).current;

  const triggerHaptic = () => {
    Haptics.impactAsync();
  };

  const handleFollow = () => {
    triggerHaptic();
    Animated.sequence([
      Animated.spring(followScale, { toValue: 0.9, useNativeDriver: true, speed: 60, bounciness: 4 }),
      Animated.spring(followScale, { toValue: 1,   useNativeDriver: true, speed: 30, bounciness: 12 }),
    ]).start();
    setFollowed(p => !p);
    onFollow?.();
  };

  const initials    = artist.name
    ? artist.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : undefined;
  const isAvatarUrl = typeof artist.avatar === 'string' && artist.avatar.startsWith('http');
  const isOwner     = artist.isOwner ?? false;

  const availKey = (artist.availability as AvailabilityKey) ?? 'available';
  const avail    = AVAILABILITY[availKey] ?? AVAILABILITY.available;

  const bio  = artist.bio ? truncateBio(artist.bio) : null;
  const tags = artist.tags?.slice(0, 3) ?? [];

  const followers = artist.stats?.find((s: any) => s.key === 'followers')?.value ?? artist.stats?.[0]?.value ?? '0';
  const views     = artist.stats?.find((s: any) => s.key === 'views')?.value     ?? artist.stats?.[1]?.value ?? '0';
  const reviews   = artist.stats?.find((s: any) => s.key === 'reviews')?.value   ?? artist.stats?.[2]?.value ?? '0';

  return (
    <View style={styles.root}>

      {/* ══ AVATAR + BOTONES ══════════════════════════════════════════ */}
      <View style={styles.avatarZone}>

        {/* Avatar con anillo gradiente */}
        <View style={styles.avatarRingOuter}>
          <LinearGradient
            colors={['#7c3aed', '#2563eb', '#a78bfa']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={styles.avatarInner}>
              {isAvatarUrl
                ? <Image source={{ uri: artist.avatar as string }} style={styles.avatar} resizeMode="cover" />
                : <AvatarPlaceholder initials={initials} />
              }
            </View>
          </LinearGradient>

          {artist.isVerified && (
            <View style={styles.verifiedBadge}>
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.verifiedGrad}
              >
                <Ionicons name="checkmark" size={8} color="#fff" />
              </LinearGradient>
            </View>
          )}

          {isOwner && (
            <TouchableOpacity style={styles.editAvatarBtn} onPress={onEditAvatar} activeOpacity={0.8}>
              <Ionicons name="camera" size={9} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Botones derecha */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.btnMore} onPress={onMore} activeOpacity={0.8}>
            <Ionicons name="ellipsis-horizontal" size={15} color="#6d28d9" />
          </TouchableOpacity>

          {isOwner ? (
            <>
              {/* Editar perfil */}
              <TouchableOpacity style={styles.btnEdit} onPress={onEditProfile} activeOpacity={0.85}>
                <Ionicons name="create-outline" size={13} color="#6d28d9" />
                <Text style={styles.btnEditText}>Editar</Text>
              </TouchableOpacity>

              {/* Seguir (al lado de editar, para el owner) */}
              <Animated.View style={{ transform: [{ scale: followScale }] }}>
                <TouchableOpacity
                  style={followed ? styles.btnFollowSmActive : styles.btnFollowSm}
                  onPress={handleFollow}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={followed ? 'checkmark-circle' : 'person-add-outline'}
                    size={13}
                    color={followed ? '#7c3aed' : '#fff'}
                  />
                  <Text style={followed ? styles.btnFollowSmTextActive : styles.btnFollowSmText}>
                    {followed ? 'Siguiendo' : 'Seguir'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </>
          ) : (
            /* Contratar — solo visitante */
            <TouchableOpacity
              onPress={() => { triggerHaptic(); onHire?.(); }}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.btnHire}
              >
                <Ionicons name="briefcase-outline" size={13} color="#fff" />
                <Text style={styles.btnHireText}>Contratar</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ══ INFO ══════════════════════════════════════════════════════ */}
      <Animated.View style={[styles.infoBlock, { opacity: 1, transform: [{ translateY: 14 }] }]}>
        {/* LÍNEA 1: Nombre + @handle */}
        <View style={styles.nameGroup}>
          <Text style={styles.name} numberOfLines={1}>{artist.name}</Text>
          {artist.handle
            ? <Text style={styles.handle}>{artist.handle}</Text>
            : null
          }
        </View>

        {/* LÍNEA 2: Disponibilidad (compacta) + Ciudad */}
        <View style={styles.availCityRow}>
          <TouchableOpacity
            style={[styles.availPill, { backgroundColor: avail.bg, borderColor: avail.border }]}
            onPress={isOwner ? onToggleAvailability : undefined}
            activeOpacity={isOwner ? 0.75 : 1}
          >
            <PulsingDot color={avail.dot} />
            <Text style={[styles.availText, { color: avail.color }]}>{avail.label}</Text>
            {isOwner && (
              <View style={{ opacity: 0.6 }}>
                <Ionicons name="chevron-forward" size={10} color={avail.color} />
              </View>
            )}
          </TouchableOpacity>

          {artist.location ? (
            <View style={styles.cityPill}>
              <Ionicons name="location-outline" size={10} color="#7c3aed" />
              <Text style={styles.cityText}>{artist.location}</Text>
            </View>
          ) : null}

          {artist.userType === 'company' && (
            <View style={styles.companyBadge}>
              <Ionicons name="business-outline" size={9} color="#1E40AF" />
              <Text style={styles.companyText}>Empresa</Text>
            </View>
          )}
        </View>

        {/* LÍNEA 3: Bio o placeholder + skeleton tags */}
        {bio ? (
          <Text style={styles.bio}>{bio}</Text>
        ) : isOwner ? (
          <>
            <TouchableOpacity onPress={onEditProfile} activeOpacity={0.7} style={styles.bioPlaceholder}>
              <Ionicons name="add-circle-outline" size={13} color="rgba(124,58,237,0.45)" />
              <Text style={styles.bioPlaceholderText}>Agrega una descripción a tu perfil</Text>
            </TouchableOpacity>
            {/* Skeleton de tags vacíos */}
            <View style={styles.tagsSkeletonRow}>
              <View style={styles.tagSkeleton} />
              <View style={[styles.tagSkeleton, { width: 60 }]} />
              <View style={[styles.tagSkeleton, { width: 50 }]} />
            </View>
          </>
        ) : null}

        {/* LÍNEA 4: 3 etiquetas reales */}
        {tags.length > 0 ? (
          <View style={styles.tagsRow}>
            {tags.map((tag: any, i: number) => (
              <View key={i} style={styles.tag}>
                <Ionicons name={getTagIcon(tag.label)} size={10} color="#7c3aed" />
                <Text style={styles.tagText}>{tag.label}</Text>
              </View>
            ))}
          </View>
        ) : null}


        {/* Botón Seguir ancho completo — solo visitante */}
        {!isOwner && (
          <Animated.View style={{ transform: [{ scale: followScale }] }}>
            <TouchableOpacity
              style={followed ? styles.btnFollowActive : styles.btnFollow}
              onPress={handleFollow}
              activeOpacity={0.85}
            >
              <Ionicons
                name={followed ? 'checkmark-circle' : 'person-add-outline'}
                size={14}
                color={followed ? '#7c3aed' : '#fff'}
              />
              <Text style={followed ? styles.btnFollowTextActive : styles.btnFollowText}>
                {followed ? 'Siguiendo' : 'Seguir'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

      </Animated.View>

      {/* ══ STATS — delgado y discreto ════════════════════════════════ */}
      <Animated.View style={[styles.statsCard, { opacity: 1 }]}>

        <TouchableOpacity style={styles.statItem} activeOpacity={0.7}>
          <Text style={styles.statValue}>{followers}</Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </TouchableOpacity>

        <View style={styles.statDivider} />

        <TouchableOpacity style={styles.statItem} activeOpacity={0.7}>
          <View style={styles.statValueRow}>
            <Text style={styles.statValue}>{views}</Text>
            {Number(views) > 0 && (
              <Ionicons name="star" size={9} color="#f59e0b" />
            )}
          </View>
          <Text style={styles.statLabel}>Vistas</Text>
        </TouchableOpacity>

        <View style={styles.statDivider} />

        <TouchableOpacity style={styles.statItem} activeOpacity={0.7}>
          <View style={styles.statValueRow}>
            <Text style={styles.statValue}>{reviews}</Text>
            {Number(reviews) > 0 && (
              <Ionicons name="star" size={9} color="#f59e0b" />
            )}
          </View>
          <Text style={styles.statLabel}>Reseñas</Text>
        </TouchableOpacity>

      </Animated.View>

    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { backgroundColor: Colors.bg },

  // ── Avatar zone ──────────────────────────────────────────────────
  avatarZone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -AVATAR_OVERLAP + 9,
    marginBottom: 10,
    paddingHorizontal: Spacing.lg,
  },
  // Contenedor relativo para centrar el halo detrás del avatar
  avatarRingOuter: {
    position: 'relative',
    width: AVATAR_SZ + 20,
    height: AVATAR_SZ + 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Marco gradiente — squircle (borderRadius ~28% del tamaño)
  avatarRing: {
    width: AVATAR_SZ + 4,
    height: AVATAR_SZ + 4,
    borderRadius: (AVATAR_SZ + 4) * 0.28,
    padding: 2.5,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  // Inner blanco — squircle con mismo radio
  avatarInner: {
    flex: 1,
    borderRadius: (AVATAR_SZ) * 0.28,
    overflow: 'hidden',
    backgroundColor: '#f0ebff',
    borderWidth: 2,
    borderColor: Colors.bg,
  },
  avatar: { width: '100%', height: '100%' },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2, right: 2,
    width: 19, height: 19, borderRadius: 9,
    borderWidth: 2, borderColor: Colors.bg, overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
  },
  verifiedGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  editAvatarBtn: {
    position: 'absolute', bottom: 2, left: 2,
    width: 22, height: 22, borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1.5, borderColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Botones acción ───────────────────────────────────────────────
  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, paddingBottom: 4,
    marginLeft: 25,
  },
  btnMore: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  btnEdit: {
    height: 32, paddingHorizontal: 11, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.2)',
  },
  btnEditText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#6d28d9',
  },
  btnFollowSm: {
    height: 32, paddingHorizontal: 11, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#7c3aed',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22, shadowRadius: 6, elevation: 3,
  },
  btnFollowSmActive: {
    height: 32, paddingHorizontal: 11, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.22)',
  },
  btnFollowSmText:       { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  btnFollowSmTextActive: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
  btnHire: {
    height: 32, paddingHorizontal: 13, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22, shadowRadius: 6, elevation: 3,
  },
  btnHireText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff',
  },

  // ── Info block ───────────────────────────────────────────────────
  infoBlock: {
    paddingHorizontal: Spacing.lg,
    gap: 7, paddingBottom: 4,
  },

  // Nombre + handle
  nameGroup: { gap: 1 },
  name: {
    fontSize: 18, fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b', letterSpacing: -0.4,
  },
  handle: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(109,40,217,0.5)',
  },

  // Disponibilidad + ciudad en fila
  availCityRow: {
    flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap',
  },
  availPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 8,
    paddingHorizontal: 9, paddingVertical: 4,   // ← compacto y sombrío
    borderWidth: 1,
  },
  availText: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  cityPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.15)',
  },
  cityText: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium', color: '#6d28d9',
  },
  companyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE',
    borderRadius: 20, paddingHorizontal: 7, paddingVertical: 3,
  },
  companyText: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#1E40AF',
  },

  // Bio
  bio: {
    fontSize: 12.5, fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textMuted, lineHeight: 18,
  },
  bioPlaceholder: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 2,
  },
  bioPlaceholderText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(124,58,237,0.4)', fontStyle: 'italic',
  },

  // Tags
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.18)',
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3,
  },
  tagText: {
    fontSize: 10.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed',
  },

  // Skeleton tags vacíos
  tagsSkeletonRow: { flexDirection: 'row', gap: 6 },
  tagSkeleton: {
    height: 24, width: 72, borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.11)',
  },


  // Botón Seguir ancho completo (visitante)
  btnFollow: {
    height: 36, borderRadius: 12, backgroundColor: '#7c3aed',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: 2,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22, shadowRadius: 6, elevation: 3,
  },
  btnFollowActive: {
    height: 36, borderRadius: 12,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.22)',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: 2,
  },
  btnFollowText:       { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  btnFollowTextActive: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },

  // Stats — delgado y discreto
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: 10, marginBottom: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(245,243,255,0.9)',
    borderWidth: 1, borderColor: 'rgba(167,139,250,0.18)',
  },
  statItem: {
    flex: 1, alignItems: 'center',
    paddingVertical: 7, gap: 1,
  },
  statValueRow: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
  },
  statValue: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b', letterSpacing: -0.2,
  },
  statLabel: {
    fontSize: 9, fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9780d4', letterSpacing: 0.1,
  },
  statDivider: {
    width: 1, backgroundColor: 'rgba(167,139,250,0.2)',
    marginVertical: 8,
  },
});
