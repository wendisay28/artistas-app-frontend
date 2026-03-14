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
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Spacing } from '../../../../theme/spacing';
import { Artist } from '../types';
import { useThemeStore } from '../../../../store/themeStore';

// ── Constantes ────────────────────────────────────────────────────────────────

const AVATAR_SZ      = 84;
const AVATAR_OVERLAP = 42;

// ── Helpers ───────────────────────────────────────────────────────────────────

const truncateBio = (bio: string, maxLength = 130): string => {
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
  onShare,
  onViewAsClient,
}) => {
  const { isDark } = useThemeStore();
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
    ? artist.name.split(' ').filter((w: string) => w).map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : undefined;
  const isAvatarUrl = typeof artist.avatar === 'string'
    && (artist.avatar.startsWith('http') || artist.avatar.startsWith('file://'));
  const isOwner     = artist.isOwner ?? false;

  // Bio corta para el header (máx ~130 chars)
  const shortBio = artist.bio ? truncateBio(artist.bio.trim(), 130) : null;
  const tags     = artist.tags?.slice(0, 3) ?? [];

  // Horario de hoy: busca la entrada del día actual en el formato "Lun 9am-6pm, Dom 7am-5pm"
  const SCHEDULE_DAY_SHORTS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const todayShort   = SCHEDULE_DAY_SHORTS[new Date().getDay()];
  const scheduleRaw  = ((artist as any).schedule as string | undefined)?.trim() || null;
  const dayEntry = scheduleRaw
    ?.split(',')
    .map(s => s.trim())
    .find(s => s.startsWith(todayShort + ' '));
  // Si hay horario para hoy, muéstralo; si no hay días pero hay texto (ej: "No disponible"), muéstralo directo
  const hasDayEntries = scheduleRaw?.split(',').some(s => SCHEDULE_DAY_SHORTS.some(d => s.trim().startsWith(d + ' ')));
  const todaySchedule = dayEntry
    ? `${todayShort} · ${dayEntry.slice(todayShort.length).trim()}`
    : (!hasDayEntries && scheduleRaw)
    ? scheduleRaw
    : null;

  // Stats
  const followers = Array.isArray(artist.stats) && artist.stats[2] ? artist.stats[2].value ?? '0' : '0'; // Seguidores
  const views     = Array.isArray(artist.stats) && artist.stats[3] ? artist.stats[3].value ?? '0' : '0'; // Visitas
  const rating    = Array.isArray(artist.stats) && artist.stats[1] ? artist.stats[1].value ?? '5.0' : '5.0'; // Rating

  return (
    <View style={[styles.root, isDark && styles.rootDark]}>

      {/* ══ AVATAR + ACCIÓN ══════════════════════════════════════════════ */}
      <View style={styles.avatarZone}>

        {/* Avatar con anillo gradiente */}
        <View style={styles.avatarRingOuter}>
          <LinearGradient
            colors={['#7c3aed', '#2563eb', '#a78bfa']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={[styles.avatarInner, isDark && styles.avatarInnerDark]}>
              {isAvatarUrl
                ? <Image source={{ uri: artist.avatar as string }} style={styles.avatar} contentFit="cover" />
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

        </View>

        {/* Botones derecha */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.btnMore} onPress={onMore} activeOpacity={0.8}>
            <Ionicons name="ellipsis-horizontal" size={16} color="#6d28d9" />
          </TouchableOpacity>

          {isOwner ? (
            <TouchableOpacity style={styles.btnEdit} onPress={onEditProfile} activeOpacity={0.85}>
              <Ionicons name="create-outline" size={14} color="#7c3aed" />
              <Text style={styles.btnEditText}>Editar</Text>
            </TouchableOpacity>
          ) : (
            <Animated.View style={{ transform: [{ scale: followScale }] }}>
              <TouchableOpacity
                style={followed ? styles.btnFollowSmallActive : styles.btnFollowSmall}
                onPress={handleFollow}
                activeOpacity={0.85}
              >
                <Ionicons name={followed ? 'checkmark-circle' : 'person-add-outline'} size={13} color="rgba(30,27,75,0.65)" />
                <Text style={followed ? styles.btnFollowSmallTextActive : styles.btnFollowSmallText}>
                  {followed ? 'Siguiendo' : 'Seguir'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>

      {/* ══ NOMBRE + ROL ═════════════════════════════════════════════════ */}
      <View style={styles.nameBlock}>

        {/* Nombre grande + badge verificado */}
        <View style={styles.nameRow}>
          <Text style={[styles.artistName, isDark && styles.artistNameDark]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82}>
            {artist.name}
          </Text>
        </View>

        {/* Rol / disciplina */}
        {artist.role ? (
          <View style={styles.roleRow}>
            <Ionicons name="sparkles-outline" size={12} color="#7c3aed" />
            <Text style={styles.roleText}>{artist.role}</Text>
          </View>
        ) : null}

      </View>

      {/* ══ META ROW: ubicación ═════════════════════════════════════════════════ */}
      <View style={styles.metaRow}>

        {/* Ubicación con barrio */}
        {artist.location ? (
          <View style={styles.cityRow}>
            <Ionicons name="location-outline" size={13} color="#7c3aed" />
            <Text style={styles.cityText}>{artist.location}</Text>
          </View>
        ) : null}

        {artist?.userType === 'company' && (
          <View style={styles.companyBadge}>
            <Ionicons name="business-outline" size={10} color="#1E40AF" />
            <Text style={styles.companyText}>Empresa</Text>
          </View>
        )}
      </View>

      {/* ══ BIO CORTA ════════════════════════════════════════════════════ */}
      {shortBio ? (
        <Text style={[styles.bio, isDark && styles.bioDark]}>{shortBio}</Text>
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
            <View key={i} style={[styles.tag, isDark && styles.tagDark]}>
              <Ionicons name={getTagIcon(tag.label) as any} size={9} color={isDark ? '#a78bfa' : '#666'} />
              <Text style={[styles.tagText, isDark && styles.tagTextDark]}>{tag.label}</Text>
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

      {/* Botón Contratar — solo visitante, full-width protagonista */}
      {/* ⚠️ NO cambiar a morado — diseño intencional:
          · Oscuro → glassmorphism transparente
          · Claro  → gradiente primario */}
      {!isOwner && (
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(); onHire?.(); }}
          activeOpacity={0.85}
          style={styles.btnHireWrap}
        >
          {isDark ? (
            <View style={styles.btnHireFullDark}>
              <Ionicons name="briefcase-outline" size={16} color="#fff" />
              <Text style={styles.btnHireFullText}>Contratar ahora</Text>
              <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.75)" />
            </View>
          ) : (
            <LinearGradient
              colors={['#7c3aed', '#6d28d9']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.btnHireFull}
            >
              <Ionicons name="briefcase-outline" size={16} color="#fff" />
              <Text style={styles.btnHireFullText}>Contratar ahora</Text>
              <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          )}
        </TouchableOpacity>
      )}

      {/* ══ STATS ════════════════════════════════════════════════════════ */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDark && styles.statValueDark]}>{followers}</Text>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>seguidores</Text>
        </View>
        <View style={styles.statSep} />
        <View style={styles.statItem}>
          <View style={styles.statValueRow}>
            <Text style={[styles.statValue, isDark && styles.statValueDark]}>{rating}</Text>
            <Ionicons name="star" size={9} color="#f59e0b" />
          </View>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>valoración</Text>
        </View>
        <View style={styles.statSep} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDark && styles.statValueDark]}>{views}</Text>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>visitas</Text>
        </View>
      </View>

      {/* ══ STRIP OWNER ══════════════════════════════════════════════════ */}
      {isOwner && (
        <View style={[styles.ownerStrip, isDark && styles.ownerStripDark]}>
          <TouchableOpacity style={styles.stripBtn} onPress={onShare} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={14} color="#7c3aed" />
            <Text style={[styles.stripBtnText, isDark && styles.stripBtnTextDark]}>Compartir perfil</Text>
          </TouchableOpacity>
          <View style={styles.stripDivider} />
          <TouchableOpacity style={styles.stripBtn} onPress={onViewAsClient} activeOpacity={0.7}>
            <Ionicons name="eye-outline" size={14} color="#7c3aed" />
            <Text style={[styles.stripBtnText, isDark && styles.stripBtnTextDark]}>Ver como cliente</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ══ BANNER: no verificado ════════════════════════════════════════ */}
      {isOwner && !artist.isVerified && (
        <TouchableOpacity
          style={[styles.verifyBanner, isDark && styles.verifyBannerDark]}
          onPress={onEditProfile}
          activeOpacity={0.85}
        >
          <View style={styles.verifyBannerIcon}>
            <Ionicons name="alert-circle" size={18} color="#d97706" />
          </View>
          <View style={styles.verifyBannerText}>
            <Text style={[styles.verifyBannerTitle, isDark && styles.verifyBannerTitleDark]}>
              Perfil no visible públicamente
            </Text>
            <Text style={[styles.verifyBannerSub, isDark && styles.verifyBannerSubDark]}>
              Completa el 100% del Portal del Autor para ser verificado y aparecer en explorar.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color="#d97706" />
        </TouchableOpacity>
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
  avatarInnerDark: {
    borderColor: '#fff',
    borderWidth: 2.5,
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
  btnMoreDark: {
    backgroundColor: 'rgba(167,139,250,0.12)',
    borderColor: 'rgba(167,139,250,0.25)',
  },
  btnEdit: {
    height: 36, paddingHorizontal: 14, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.2)',
  },
  btnEditDark: {
    backgroundColor: 'rgba(167,139,250,0.12)',
    borderColor: 'rgba(167,139,250,0.25)',
  },
  btnEditText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },
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
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b',
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  artistNameDark: {
    color: '#ffffff',
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
    marginBottom: 4, // Reducido de 8 a 4
  },
  bioDark: {
    color: '#9ca3af',
  },
  bioPlaceholder: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginHorizontal: Spacing.lg, marginBottom: 6, // Reducido de 12 a 6
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
    marginBottom: 5,
  },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: 16, paddingHorizontal: 8, paddingVertical: 3,
  },
  tagDark: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderColor: 'rgba(255,255,255,0.18)',
  },
  tagText: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#666' },
  tagTextDark: {
    color: '#d1d5db',
  },

  tagsSkeletonRow: { flexDirection: 'row', gap: 6, paddingHorizontal: Spacing.lg, marginBottom: 16 },
  tagSkeleton: {
    height: 28, width: 76, borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.05)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.08)',
  },

  // ── Contratar (visitante) — botón protagonista full-width ────────
  btnHireWrap: {
    marginHorizontal: Spacing.lg,
    marginTop: 4,
    marginBottom: 12,
  },
  btnFollowWrap: {
    marginHorizontal: Spacing.lg,
    marginTop: 4,
    marginBottom: 12,
  },
  btnHireFull: {
    height: 44, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  btnHireFullDark: {
    height: 44, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)',
  },
  btnFollowFullDark: {
    height: 44, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)',
  },
  btnHireFullText: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff', letterSpacing: 0.1 },

  // ── Seguir (visitante) — botón secundario pequeño en actionRow ───
  // ⚠️ DISEÑO INTENCIONAL: color = bio description (NO morado, NO verde)
  // No cambiar estos valores — ver decisión de diseño en memoria del proyecto
  btnFollowSmall: {
    height: 36, paddingHorizontal: 14, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(30,27,75,0.05)',
    borderWidth: 1.5, borderColor: 'rgba(30,27,75,0.18)',
  },
  btnFollowSmallActive: {
    height: 36, paddingHorizontal: 14, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(30,27,75,0.08)',
    borderWidth: 1.5, borderColor: 'rgba(30,27,75,0.35)',
  },
  btnFollowSmallText:       { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(30,27,75,0.65)' },
  btnFollowSmallTextActive: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: 'rgba(30,27,75,0.65)' },

  // ── (legacy — ya no se usan pero se conservan por si acaso) ──────
  btnFollow:           { marginHorizontal: Spacing.lg, height: 38, borderRadius: 14, backgroundColor: '#7c3aed', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 },
  btnFollowActive:     { marginHorizontal: Spacing.lg, height: 38, borderRadius: 14, backgroundColor: 'rgba(124,58,237,0.07)', borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.22)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 },
  btnFollowText:       { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  btnFollowTextActive: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
  btnFollroleText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
    opacity: 0.85,
  },
  roleTextDark: { color: '#a78bfa' },

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
  statValueDark: {
    color: 'rgba(255,255,255,0.65)',
  },
  statLabel: {
    fontSize: 9.5, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(30,27,75,0.65)', marginTop: 1,
  },
  statLabelDark: {
    color: '#9ca3af',
  },
  statSep: {
    width: 1, height: 22, backgroundColor: 'rgba(167,139,250,0.2)',
  },
  statSepDark: {
    backgroundColor: 'rgba(167,139,250,0.4)',
  },

  // ── Owner strip ──────────────────────────────────────────────────
  ownerStrip: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(167,139,250,0.1)',
  },
  ownerStripDark: {
    borderTopColor: 'rgba(167,139,250,0.15)',
    backgroundColor: 'rgba(255,255,255,0.03)',
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
  stripBtnTextDark: { color: '#a78bfa' },
  stripDivider: { width: 1, backgroundColor: 'rgba(167,139,250,0.15)', marginVertical: 8 },

  // ── Banner no verificado ─────────────────────────────────────────
  verifyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(217,119,6,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(217,119,6,0.25)',
    borderRadius: 14,
  },
  verifyBannerDark: {
    backgroundColor: 'rgba(217,119,6,0.10)',
    borderColor: 'rgba(217,119,6,0.30)',
  },
  verifyBannerIcon: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(217,119,6,0.12)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  verifyBannerText: { flex: 1, gap: 2 },
  verifyBannerTitle: {
    fontSize: 12.5,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#92400e',
  },
  verifyBannerTitleDark: { color: '#fbbf24' },
  verifyBannerSub: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#b45309',
    lineHeight: 15,
  },
  verifyBannerSubDark: { color: '#f59e0b' },

  // ── Dark mode ─────────────────────────────────────────────────────
  rootDark: {
    backgroundColor: '#0a0618', // mismo que el card
  },
});