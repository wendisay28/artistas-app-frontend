// ─────────────────────────────────────────────────────────────────────────────
// ProfileIdentity.tsx — Identity card del artista · Estilo onboarding BuscArt
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
import { Spacing } from '../../../../theme/spacing';
import { Artist } from '../types';

// ── Constantes ────────────────────────────────────────────────────────────────

const AVATAR_SZ      = 84;
const AVATAR_OVERLAP = 42;

// ── Helpers ───────────────────────────────────────────────────────────────────

const truncateBio = (bio: string, maxLength = 90): string => {
  if (bio.length <= maxLength) return bio;
  const truncated = bio.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > maxLength * 0.6 ? truncated.slice(0, lastSpace) + '…' : truncated + '…';
};

const getTagIcon = (tag: string): string => {
  const t = tag.toLowerCase();
  if (t.includes('foto') || t.includes('retrato'))                           return 'camera-outline';
  if (t.includes('música') || t.includes('musica') || t.includes('concierto')) return 'musical-notes-outline';
  if (t.includes('boda'))                                                    return 'heart-outline';
  if (t.includes('pintura') || t.includes('arte'))                           return 'color-palette-outline';
  if (t.includes('diseño'))                                                  return 'pencil-outline';
  if (t.includes('video') || t.includes('cine'))                             return 'videocam-outline';
  if (t.includes('event'))                                                   return 'calendar-outline';
  if (t.includes('digital'))                                                 return 'desktop-outline';
  if (t.includes('abstrac') || t.includes('ilustr'))                         return 'shapes-outline';
  if (t.includes('mural') || t.includes('graffiti'))                         return 'brush-outline';
  if (t.includes('baile') || t.includes('danza'))                            return 'body-outline';
  if (t.includes('teatro') || t.includes('actor'))                           return 'mic-outline';
  return 'pricetag-outline';
};


// ── Disponibilidad ────────────────────────────────────────────────────────────

const AVAILABILITY = {
  available: { label: 'Disponible', color: '#16a34a', bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.22)', dot: '#16a34a', pulse: true },
  busy:      { label: 'Ocupado',    color: '#d97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.22)', dot: '#d97706', pulse: false },
  unavailable: { label: 'No disponible', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.22)', dot: '#dc2626', pulse: false },
} as const;
type AvailabilityKey = keyof typeof AVAILABILITY;

// ── Dot con pulso ─────────────────────────────────────────────────────────────

const PulsingDot: React.FC<{ color: string; animate?: boolean }> = ({ color, animate = true }) => {
  const pulse   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    if (!animate) return;
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse,   { toValue: 2.2, duration: 950, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulse,   { toValue: 1,   duration: 950, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0,    duration: 950, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.55, duration: 950, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, [animate]);

  return (
    <View style={{ width: 6, height: 6, alignItems: 'center', justifyContent: 'center' }}>
      {animate && <Animated.View style={{ position: 'absolute', width: 6, height: 6, borderRadius: 3, backgroundColor: color, transform: [{ scale: pulse }], opacity }} />}
      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />
    </View>
  );
};

// ── Avatar Placeholder ────────────────────────────────────────────────────────

const AvatarPlaceholder: React.FC<{ initials?: string }> = ({ initials }) => (
  <LinearGradient
    colors={['#ede8ff', '#e4eeff']}
    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
  >
    {initials
      ? <Text style={{ fontSize: 28, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#7c3aed', letterSpacing: -0.5 }}>{initials}</Text>
      : <Ionicons name="person-outline" size={30} color="rgba(124,58,237,0.4)" />
    }
  </LinearGradient>
);

// ── Props ─────────────────────────────────────────────────────────────────────

export type ProfileIdentityProps = {
  artist:                Artist;
  onFollow?:             () => void;
  onHire?:               () => void;
  onMore?:               () => void;
  onEditAvatar?:         () => void;
  onEditProfile?:        () => void;
  onToggleAvailability?: () => void;
  onShare?:              () => void;
  onViewAsClient?:       () => void;
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
  onShare,
  onViewAsClient,
}) => {
  const [followed, setFollowed] = useState(false);
  const followScale = useRef(new Animated.Value(1)).current;

  const handleFollow = () => {
    Haptics.impactAsync();
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

  // Bio corta para el header (máx ~90 chars)
  const shortBio = artist.bio ? truncateBio(artist.bio, 105) : null;
  const tags     = artist.tags?.slice(0, 3) ?? [];

  // Horario de hoy: busca la entrada del día actual en el formato "Lun 9am-6pm, Dom 7am-5pm"
  const SCHEDULE_DAY_SHORTS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const todayShort   = SCHEDULE_DAY_SHORTS[new Date().getDay()];
  const scheduleRaw  = ((artist as any).schedule as string | undefined)?.trim() || null;
  const todaySchedule = scheduleRaw
    ?.split(',')
    .map(s => s.trim())
    .find(s => s.startsWith(todayShort + ' '))
    ?.slice(todayShort.length).trim()
    ?? null;

  // Stats
  const followers = artist.stats?.[2]?.value ?? '0'; // Seguidores
  const views     = artist.stats?.[3]?.value ?? '0'; // Visitas
  const rating    = artist.stats?.[1]?.value ?? '5.0'; // Rating

  return (
    <View style={styles.root}>

      {/* ══ AVATAR + ACCIÓN ══════════════════════════════════════════════ */}
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
              {/* Overlay estilo hover sobre toda la foto */}
              {isOwner && (
                <TouchableOpacity style={styles.avatarEditOverlay} onPress={onEditAvatar} activeOpacity={0.7}>
                  <Ionicons name="camera" size={22} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>

          {artist.isVerified && (
            <View style={styles.verifiedBadge}>
              <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.verifiedGrad}>
                <Ionicons name="checkmark" size={8} color="#fff" />
              </LinearGradient>
            </View>
          )}
        </View>

        {/* Botones derecha */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.btnMore} onPress={onMore} activeOpacity={0.8}>
            <Ionicons name="ellipsis-horizontal" size={16} color="#6d28d9" />
          </TouchableOpacity>

          {isOwner ? (
            <TouchableOpacity style={styles.btnEdit} onPress={onEditProfile} activeOpacity={0.85}>
              <Ionicons name="create-outline" size={14} color="#6d28d9" />
              <Text style={styles.btnEditText}>Editar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => { Haptics.impactAsync(); onHire?.(); }} activeOpacity={0.85}>
              <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnHire}>
                <Ionicons name="briefcase-outline" size={14} color="#fff" />
                <Text style={styles.btnHireText}>Contratar</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ══ NOMBRE + ROL ═════════════════════════════════════════════════ */}
      <View style={styles.nameBlock}>

        {/* Nombre grande + badge verificado */}
        <View style={styles.nameRow}>
          <Text style={styles.artistName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82}>
            {artist.name}
          </Text>
          <TouchableOpacity
            style={[styles.availPill, { backgroundColor: avail.bg, borderColor: avail.border }]}
            onPress={isOwner ? onToggleAvailability : undefined}
            activeOpacity={isOwner ? 0.75 : 1}
          >
            <PulsingDot color={avail.dot} animate={avail.pulse} />
            <Text style={[styles.availText, { color: avail.color }]}>{avail.label}</Text>
            {isOwner && <View style={{ opacity: 0.6 }}><Ionicons name="chevron-forward" size={7} color={avail.color} /></View>}
          </TouchableOpacity>
          {artist.isVerified && (
            <Ionicons name="checkmark-circle" size={17} color="#7c3aed" />
          )}
        </View>

        {/* Rol / disciplina */}
        {artist.role ? (
          <View style={styles.roleRow}>
            <Ionicons name="sparkles-outline" size={12} color="#7c3aed" />
            <Text style={styles.roleText}>{artist.role}</Text>
          </View>
        ) : null}

      </View>

      {/* ══ META ROW: horario · ciudad ════════════════════════════ */}
      <View style={styles.metaRow}>

        {/* Horario de hoy — sin contenedor, solo icono y texto */}
        {todaySchedule ? (
          <View style={styles.scheduleRow}>
            <Ionicons name="time-outline" size={13} color="#7c3aed" />
            <Text style={styles.scheduleText}>{todayShort} · {todaySchedule}</Text>
          </View>
        ) : null}

        {/* Ubicación — sin contenedor, solo icono y texto */}
        {artist.location ? (
          <View style={styles.cityRow}>
            <Ionicons name="location-outline" size={13} color="#7c3aed" />
            <Text style={styles.cityText}>{artist.location}</Text>
          </View>
        ) : null}

        {/* La insignia de Empresa la mantuve como caja por jerarquía, pero puedes cambiarla si deseas */}
        {artist.userType === 'company' && (
          <View style={styles.companyBadge}>
            <Ionicons name="business-outline" size={10} color="#1E40AF" />
            <Text style={styles.companyText}>Empresa</Text>
          </View>
        )}
      </View>

      {/* ══ BIO CORTA ════════════════════════════════════════════════════ */}
      {shortBio ? (
        <Text style={styles.bio}>{shortBio}</Text>
      ) : isOwner ? (
        <TouchableOpacity onPress={onEditProfile} activeOpacity={0.7} style={styles.bioPlaceholder}>
          <Ionicons name="add-circle-outline" size={13} color="rgba(124,58,237,0.4)" />
          <Text style={styles.bioPlaceholderText}>Agrega una bio corta a tu perfil</Text>
        </TouchableOpacity>
      ) : null}

      {/* ══ TAGS ═════════════════════════════════════════════════════════ */}
      {tags.length > 0 ? (
        <View style={styles.tagsRow}>
          {tags.map((tag: any, i: number) => (
            <View key={i} style={styles.tag}>
              <Ionicons name={getTagIcon(tag.label) as any} size={11} color="#7c3aed" />
              <Text style={styles.tagText}>{tag.label}</Text>
            </View>
          ))}
        </View>
      ) : isOwner ? (
        <View style={styles.tagsSkeletonRow}>
          <View style={styles.tagSkeleton} />
          <View style={[styles.tagSkeleton, { width: 60 }]} />
          <View style={[styles.tagSkeleton, { width: 52 }]} />
        </View>
      ) : null}

      {/* Botón Seguir — solo visitante */}
      {!isOwner && (
        <Animated.View style={{ transform: [{ scale: followScale }], marginTop: 4 }}>
          <TouchableOpacity
            style={followed ? styles.btnFollowActive : styles.btnFollow}
            onPress={handleFollow}
            activeOpacity={0.85}
          >
            <Ionicons name={followed ? 'checkmark-circle' : 'person-add-outline'} size={14} color={followed ? '#7c3aed' : '#fff'} />
            <Text style={followed ? styles.btnFollowTextActive : styles.btnFollowText}>
              {followed ? 'Siguiendo' : 'Seguir'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* ══ STATS ════════════════════════════════════════════════════════ */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{followers}</Text>
          <Text style={styles.statLabel}>seguidores</Text>
        </View>
        <View style={styles.statSep} />
        <View style={styles.statItem}>
          <View style={styles.statValueRow}>
            <Text style={styles.statValue}>{rating}</Text>
            <Ionicons name="star" size={9} color="#f59e0b" />
          </View>
          <Text style={styles.statLabel}>valoración</Text>
        </View>
        <View style={styles.statSep} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{views}</Text>
          <Text style={styles.statLabel}>visitas</Text>
        </View>
      </View>

      {/* ══ STRIP OWNER ══════════════════════════════════════════════════ */}
      {isOwner && (
        <View style={styles.ownerStrip}>
          <TouchableOpacity style={styles.stripBtn} onPress={onShare} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={14} color="#7c3aed" />
            <Text style={styles.stripBtnText}>Compartir perfil</Text>
          </TouchableOpacity>
          <View style={styles.stripDivider} />
          <TouchableOpacity style={styles.stripBtn} onPress={onViewAsClient} activeOpacity={0.7}>
            <Ionicons name="eye-outline" size={14} color="#7c3aed" />
            <Text style={styles.stripBtnText}>Ver como cliente</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    paddingBottom: 8,
  },

  // ── Avatar zone ──────────────────────────────────────────────────
  avatarZone: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: -AVATAR_OVERLAP,
    paddingHorizontal: Spacing.lg,
    marginBottom: 6,
  },
  avatarRingOuter: {
    position: 'relative',
    width: AVATAR_SZ + 8,
    height: AVATAR_SZ + 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {
    width: AVATAR_SZ + 4,
    height: AVATAR_SZ + 4,
    borderRadius: (AVATAR_SZ + 4) * 0.28,
    padding: 2.5,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  avatarInner: {
    flex: 1,
    borderRadius: AVATAR_SZ * 0.28,
    overflow: 'hidden',
    backgroundColor: '#ede8ff',
    borderWidth: 2.5,
    borderColor: '#fff',
  },
  avatar: { width: '100%', height: '100%' },
  verifiedBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2.5, borderColor: '#fff',
    overflow: 'hidden',
  },
  verifiedGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarEditOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Botones acción ───────────────────────────────────────────────
  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 8,
  },
  btnMore: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  btnEdit: {
    height: 36, paddingHorizontal: 14, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.2)',
  },
  btnEditText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#6d28d9' },
  btnHire: {
    height: 36, paddingHorizontal: 16, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  btnHireText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },

  // ── Nombre + handle ──────────────────────────────────────────────
  nameBlock: {
    paddingHorizontal: Spacing.lg,
    marginBottom: 4,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  artistName: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b',
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  availSmall: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#16a34a',
    opacity: 0.8,
    marginLeft: 6,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  roleText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
    opacity: 0.85,
  },

  // ── Meta row (Horario, ciudad, etc) ─────────────────────────────
  metaRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    marginBottom: 3,
  },
  availPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 16, paddingHorizontal: 7, paddingVertical: 3,
    borderWidth: 1,
  },
  availText: { fontSize: 9.5, fontFamily: 'PlusJakartaSans_600SemiBold' },

  // Nuevos estilos sin cajas (background/border)
  scheduleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  scheduleText: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: '#a78bfa' },

  cityRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  cityText: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: '#a78bfa' },

  companyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE',
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4,
  },
  companyText: { fontSize: 10.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#1E40AF' },

  // ── Bio corta ────────────────────────────────────────────────────
  bio: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(30,27,75,0.65)',
    lineHeight: 19,
    paddingHorizontal: Spacing.lg,
    marginBottom: 8,
  },
  bioPlaceholder: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginHorizontal: Spacing.lg, marginBottom: 12,
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(124,58,237,0.04)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.18)',
    borderStyle: 'dashed',
  },
  bioPlaceholderText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(124,58,237,0.38)', fontStyle: 'italic',
  },

  // ── Tags ─────────────────────────────────────────────────────────
  tagsRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6,
    paddingHorizontal: Spacing.lg,
    marginBottom: 10,
  },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.18)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  tagText: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },

  tagsSkeletonRow: { flexDirection: 'row', gap: 6, paddingHorizontal: Spacing.lg, marginBottom: 16 },
  tagSkeleton: {
    height: 28, width: 76, borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.05)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.08)',
  },

  // ── Seguir (visitante) ───────────────────────────────────────────
  btnFollow: {
    marginHorizontal: Spacing.lg, height: 38, borderRadius: 14,
    backgroundColor: '#7c3aed',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
    marginBottom: 12,
  },
  btnFollowActive: {
    marginHorizontal: Spacing.lg, height: 38, borderRadius: 14,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.22)',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    marginBottom: 12,
  },
  btnFollowText:       { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  btnFollowTextActive: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },

  // ── Stats ────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 5,
    paddingBottom: 2,
    borderTopWidth: 1,
    borderTopColor: 'rgba(167,139,250,0.12)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statValue: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b', letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 9.5, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)', marginTop: 1,
  },
  statSep: {
    width: 1, height: 22, backgroundColor: 'rgba(167,139,250,0.2)',
  },

  // ── Owner strip ──────────────────────────────────────────────────
  ownerStrip: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(167,139,250,0.1)',
  },
  stripBtn: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12,
  },
  stripBtnText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
  },
  stripDivider: { width: 1, backgroundColor: 'rgba(167,139,250,0.15)', marginVertical: 8 },
});