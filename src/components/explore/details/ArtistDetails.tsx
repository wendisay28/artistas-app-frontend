// ─────────────────────────────────────────────────────────────────────────────
// ArtistDetails.tsx — Full scrollable detail view for an Artist
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../constants/colors';
import { Colors } from '../../../theme';
import {
  getLocalizedCategoryName,
  getLocalizedDisciplineName,
  getLocalizedRoleName,
} from '../../../constants/artistCategories';
import InfoPair from '../shared/InfoPair';
import ReviewCard from '../shared/ReviewCard';
import GalleryModal from '../shared/GalleryModal';
import { ServicesSection } from '../../../screens/profile/components/sections/ServicesSection';
import type { Artist, Review } from '../../../types/explore';
import { CARD_WIDTH } from '../cards/SwipeCard';

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', authorName: 'Laura P.',   rating: 5, text: 'Increíble trabajo, muy profesional y puntual. Superó todas mis expectativas.', date: 'Hace 2 semanas' },
  { id: 'r2', authorName: 'Miguel R.',  rating: 4, text: 'Excelente artista, muy creativo y comprometido con el proyecto.',              date: 'Hace 1 mes'     },
  { id: 'r3', authorName: 'Carmen V.',  rating: 5, text: 'Repeat customer. Always delivers stunning results on time.',                   date: 'Hace 2 meses'   },
];

interface ArtistDetailsProps {
  artist: Artist;
  onHire?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    spotify?: string;
  };
}

const formatCOP = (price: number) =>
  `$${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

const TODAY_SHORT = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][new Date().getDay()];
const getTodaySchedule = (scheduleStr?: string): string => {
  if (!scheduleStr?.trim()) return 'No especificado';
  const parts = scheduleStr.split(',').map(p => p.trim());
  const todayPart = parts.find(p => p.startsWith(TODAY_SHORT));
  if (!todayPart) return 'No disponible hoy';
  const match = todayPart.match(/^\S+\s+(.+)-(.+)$/);
  return match ? `Hoy: ${match[1]} – ${match[2]}` : todayPart;
};

// ── Meta de categorías (copiado de ServicesSection) ─────────────────────────────
const getCategoryMeta = (category?: string, name?: string) => {
  const CATEGORY_META: Record<string, { icon: any; color: string }> = {
    musica:     { icon: 'musical-notes-outline', color: '#7c3aed' },
    fotografia: { icon: 'camera-outline',        color: '#0369a1' },
    video:      { icon: 'videocam-outline',       color: '#dc2626' },
    diseno:     { icon: 'color-palette-outline',  color: '#d97706' },
    danza:      { icon: 'body-outline',           color: '#db2777' },
    teatro:     { icon: 'mic-outline',            color: '#7c3aed' },
    escritura:  { icon: 'create-outline',         color: '#059669' },
    clases:     { icon: 'school-outline',         color: '#2563eb' },
    produccion: { icon: 'headset-outline',        color: '#374151' },
  };
  
  const key = category?.toLowerCase() || 'fotografia';
  return CATEGORY_META[key] || CATEGORY_META.fotografia;
};

// ── CardHeader con acento lateral ─────────────────────────────────────────

const CardHeader: React.FC<{
  title: string;
  isOwner?: boolean;
  onEdit?: () => void;
}> = ({ title }) => (
  <View style={ch.row}>
    <Text style={ch.title}>{title}</Text>
  </View>
);

const ch = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 14,
  },
  title: {
    flex: 1,
    fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
});

// ── Glass Card base ───────────────────────────────────────────────────────────

const GlassCard: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <View style={[gc.card, style]}>
    {children}
  </View>
);

const gc = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(167,139,250,0.2)',
    shadowColor: '#6d28d9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
});

// ── SectionEmpty — empty state con preview punteado morado ───────────────────

const SectionEmpty: React.FC<{
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  preview: React.ReactNode;
}> = ({ icon, title, subtitle, preview }) => (
  <View style={ep.container}>
    <View style={ep.iconWrap}>
      <Ionicons name={icon} size={28} color="rgba(124,58,237,0.3)" />
    </View>
    <Text style={ep.title}>{title}</Text>
    <Text style={ep.subtitle}>{subtitle}</Text>
    <View style={ep.sep}>
      <View style={ep.sepLine} />
      <Text style={ep.sepText}>Así se verá</Text>
      <View style={ep.sepLine} />
    </View>
    <View style={{ width: '100%', opacity: 0.45 }}>{preview}</View>
  </View>
);

const ep = StyleSheet.create({
  container: {
    alignItems: 'center', paddingVertical: 22, paddingHorizontal: 14, gap: 7,
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.18)',
    borderRadius: 14, borderStyle: 'dashed',
    backgroundColor: 'rgba(245,243,255,0.4)',
  },
  iconWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: 'rgba(124,58,237,0.07)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 2,
  },
  title: { fontSize: 13.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  subtitle: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(124,58,237,0.4)', textAlign: 'center', lineHeight: 17,
  },
  sep: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%', marginTop: 4 },
  sepLine: { flex: 1, height: 1, backgroundColor: 'rgba(124,58,237,0.1)' },
  sepText: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(124,58,237,0.3)',
  },
});

// ── SocialRow ─────────────────────────────────────────────────────────────────

const so = StyleSheet.create({
  row:  { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  itemWrap: { flex: 1, alignItems: 'center', gap: 6 },
  iconActive: {
    width: 52, height: 52, borderRadius: 52 * 0.28,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 3,
  },
  iconInactive: {
    width: 52, height: 52, borderRadius: 52 * 0.28,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.2)',
  },
  label:        { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#1e1b4b' },
  labelInactive:{ color: 'rgba(124,58,237,0.3)' },
});

// ── Estilos principales ───────────────────────────────────────────────────────

const s = StyleSheet.create({
  // Bio
  bioText: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(30,27,75,0.7)', lineHeight: 22,
  },
  readMoreBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 10, alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 12.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed',
  },

  // Info pairs
  infoPairs: { gap: 2 },
  divider:   { height: 1, backgroundColor: 'rgba(167,139,250,0.12)', marginVertical: 8 },

  // Tabs card
  tabsCard: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(167,139,250,0.2)',
    shadowColor: '#6d28d9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 3,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167,139,250,0.12)',
  },
  tabItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 5,
    paddingVertical: 14,
    position: 'relative',
  },
  tabItemActive: {},
  tabLabel: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(109,40,217,0.35)',
  },
  tabLabelActive: {
    fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed',
  },
  // Línea indicadora en gradiente abajo del tab activo
  tabIndicator: {
    position: 'absolute', bottom: 0, left: 8, right: 8,
    height: 2.5, borderRadius: 2,
  },
  tabContent: { padding: 16 },
});

// ── Experience Item ───────────────────────────────────────────────────────────

const ExperienceItem: React.FC<{
  position: string;
  company: string;
  period: string;
  description?: string;
  last?: boolean;
}> = ({ position, company, period, description, last }) => (
  <View style={[exp.item, !last && exp.itemBorder]}>
    {/* Dot de timeline */}
    <View style={exp.dotWrap}>
      <LinearGradient colors={['#7c3aed', '#2563eb']} style={exp.dot} />
    </View>
    <View style={exp.content}>
      <View style={exp.headerRow}>
        <Text style={exp.position}>{position}</Text>
        <View style={exp.periodPill}>
          <Text style={exp.period}>{period}</Text>
        </View>
      </View>
      <Text style={exp.company}>{company}</Text>
      {description && <Text style={exp.desc}>{description}</Text>}
    </View>
  </View>
);

const exp = StyleSheet.create({
  item:       { flexDirection: 'row', gap: 12, paddingBottom: 16 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(167,139,250,0.1)', marginBottom: 16 },
  dotWrap:    { paddingTop: 4 },
  dot:        { width: 10, height: 10, borderRadius: 5 },
  content:    { flex: 1 },
  headerRow:  { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 3 },
  position: {
    flex: 1, fontSize: 14.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  periodPill: {
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2,
    marginLeft: 8,
  },
  period: { fontSize: 10.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },
  company: {
    fontSize: 12.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(109,40,217,0.55)', marginBottom: 4,
  },
  desc: {
    fontSize: 12.5, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(30,27,75,0.55)', lineHeight: 18,
  },
});

// ── Study Item ────────────────────────────────────────────────────────────────

const StudyItem: React.FC<{
  degree: string;
  institution: string;
  year: string;
  details?: string;
  last?: boolean;
}> = ({ degree, institution, year, details, last }) => (
  <View style={[st.item, !last && st.itemBorder]}>
    <View style={st.dotWrap}>
      <LinearGradient colors={['#7c3aed', '#2563eb']} style={st.dot} />
    </View>
    <View style={st.content}>
      <View style={st.headerRow}>
        <Text style={st.degree}>{degree}</Text>
        <View style={st.yearPill}>
          <Text style={st.year}>{year}</Text>
        </View>
      </View>
      <Text style={st.institution}>{institution}</Text>
      {details && <Text style={st.details}>{details}</Text>}
    </View>
  </View>
);

const st = StyleSheet.create({
  item:       { flexDirection: 'row', gap: 12, paddingBottom: 16 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(167,139,250,0.1)', marginBottom: 16 },
  dotWrap:    { paddingTop: 4 },
  dot:        { width: 10, height: 10, borderRadius: 5 },
  content:    { flex: 1 },
  headerRow:  { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 3 },
  degree: {
    flex: 1, fontSize: 14.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  yearPill: {
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8,
  },
  year:        { fontSize: 10.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },
  institution: {
    fontSize: 12.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(109,40,217,0.55)', marginBottom: 4,
  },
  details: {
    fontSize: 12.5, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(30,27,75,0.5)', lineHeight: 18, fontStyle: 'italic',
  },
});

export default function ArtistDetails({ artist, onHire, onMessage, onShare, socialLinks }: ArtistDetailsProps) {
  
  const [activeTab,   setActiveTab]   = useState<'services' | 'portfolio' | 'reviews'>('services');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIdx,  setGalleryIdx]  = useState(0);
  const [bioExpanded, setBioExpanded] = useState(false);

  const isAvailable = artist.availability?.trim().toLowerCase() === 'disponible';
  const basePrice   = artist.price ?? null;
  const ctaLabel    = basePrice ? `Contratar · desde ${formatCOP(basePrice)}` : 'Contratar ahora';

  const openGallery = (i: number) => { setGalleryIdx(i); setGalleryOpen(true); };

  const handleTab = (tab: typeof activeTab) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setActiveTab(tab);
  };

  return (
    <>
      {galleryOpen && (
        <GalleryModal images={artist.gallery} initialIndex={galleryIdx} onClose={() => setGalleryOpen(false)} />
      )}

      <View style={styles.container}>

        {/* ══ MINI HEADER ══ */}
        <View style={styles.miniHeader}>
          {(artist as any).avatar || artist.image ? (
            <Image source={{ uri: (artist as any).avatar || artist.image }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Ionicons name="person" size={22} color={colors.primary} />
            </View>
          )}

          <View style={styles.headerMeta}>
            <View style={styles.nameRow}>
              <Text style={styles.artistName} numberOfLines={1}>{artist.name}</Text>
              {artist.verified && <Ionicons name="checkmark-circle" size={15} color="#818cf8" />}
            </View>
            <Text style={styles.artistCategory} numberOfLines={1}>
              {typeof artist.category === 'string' ? artist.category : 'Artista'}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={11} color={colors.textSecondary} />
              <Text style={styles.locationText} numberOfLines={1}>{artist.location}</Text>
            </View>
          </View>

          <View style={[styles.availPill, { backgroundColor: isAvailable ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)' }]}>
            <View style={[styles.availDot, { backgroundColor: isAvailable ? colors.success : '#f59e0b' }]} />
            <Text style={[styles.availText, { color: isAvailable ? colors.success : '#f59e0b' }]}>
              {isAvailable ? 'Disponible' : 'Ocupado'}
            </Text>
          </View>
        </View>

        {/* ══ ABOUT ══ */}
        <GlassCard>
          <CardHeader title="Acerca de mí" />
          {artist.description ? (
            <>
              <Text style={s.bioText} numberOfLines={bioExpanded ? undefined : 3}>
                {artist.description}
              </Text>
              <Pressable onPress={() => setBioExpanded(p => !p)} style={s.readMoreBtn}>
                <Text style={s.readMoreText}>{bioExpanded ? 'Ver menos' : 'Ver más'}</Text>
                <Ionicons name={bioExpanded ? 'chevron-up' : 'chevron-down'} size={13} color="#7c3aed" />
              </Pressable>
            </>
          ) : (
            <SectionEmpty
              icon="person-outline"
              title="Sin descripción todavía"
              subtitle="Cuéntale a los clientes quién eres, qué haces y qué te hace único."
              preview={
                <View style={{ gap: 8 }}>
                  <View style={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(30,27,75,0.12)', width: '100%' }} />
                  <View style={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(30,27,75,0.09)', width: '88%' }} />
                  <View style={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(30,27,75,0.07)', width: '72%' }} />
                  <View style={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(124,58,237,0.08)', width: '55%' }} />
                </View>
              }
            />
          )}
        </GlassCard>

        {/* 2. CATEGORÍA ARTÍSTICA */}
        <GlassCard>
          <CardHeader title="Categoría artística" />
          {typeof artist.category === 'object' && artist.category?.categoryId ? (
            <View style={s.infoPairs}>
              <InfoPair
                label="Categoría"
                value={getLocalizedCategoryName(artist.category.categoryId)}
              />
              {artist.category?.disciplineId ? (
                <>
                  <View style={s.divider} />
                  <InfoPair
                    label="Disciplina"
                    value={getLocalizedDisciplineName(artist.category.categoryId, artist.category.disciplineId)}
                  />
                </>
              ) : null}
              {artist.category?.roleId ? (
                <>
                  <View style={s.divider} />
                  <InfoPair
                    label="Rol"
                    value={getLocalizedRoleName(artist.category.categoryId, artist.category.disciplineId, artist.category.roleId)}
                  />
                </>
              ) : null}
              <View style={s.divider} />
              <InfoPair label="Especialidad" value={artist.specialty || 'No especificado'} />
              <View style={s.divider} />
              <InfoPair label="Nicho" value={artist.niche || 'No especificado'} />
            </View>
          ) : typeof artist.category === 'string' ? (
            <View style={s.infoPairs}>
              <InfoPair label="Categoría" value={artist.category} />
              <View style={s.divider} />
              <InfoPair label="Especialidad" value={artist.specialty || 'No especificado'} />
              <View style={s.divider} />
              <InfoPair label="Nicho" value={artist.niche || 'No especificado'} />
            </View>
          ) : (
            <View style={s.infoPairs}>
              <InfoPair label="Categoría" value="No especificada" />
              <View style={s.divider} />
              <InfoPair label="Especialidad" value={artist.specialty || 'No especificado'} />
              <View style={s.divider} />
              <InfoPair label="Nicho" value={artist.niche || 'No especificado'} />
            </View>
          )}
        </GlassCard>

        {/* ══ PRO INFO ══ */}
        <GlassCard>
          <CardHeader title="Información profesional" />
          <View style={s.infoPairs}>
            <InfoPair label="Experiencia" value={artist.experience} />
            <View style={s.divider} />
            <InfoPair label="Estilo" value={artist.style} />
            <View style={s.divider} />
            <InfoPair label="Disponibilidad" value={artist.availability} valueColor={isAvailable ? '#16a34a' : '#d97706'} />
            <View style={s.divider} />
            <InfoPair
              label="Horario"
              value={getTodaySchedule(artist.schedule)}
            />
          </View>
        </GlassCard>

        {/* 4. EXPERIENCIA LABORAL */}
        <GlassCard>
          <CardHeader title="Experiencia laboral" />
          {artist.workExperience && artist.workExperience.length > 0 ? (
            artist.workExperience.map((work, i) => (
              <ExperienceItem
                key={i}
                position={work.position}
                company={work.company}
                period={work.period}
                description={work.description}
                last={i === artist.workExperience!.length - 1}
              />
            ))
          ) : (
            <SectionEmpty
              icon="briefcase-outline"
              title="Sin experiencia laboral"
              subtitle="Agrega tus trabajos anteriores para mostrar tu trayectoria profesional."
              preview={
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(124,58,237,0.25)', marginTop: 4 }} />
                  <View style={{ flex: 1, gap: 7 }}>
                    <View style={{ height: 11, borderRadius: 5, backgroundColor: 'rgba(30,27,75,0.14)', width: '65%' }} />
                    <View style={{ height: 9, borderRadius: 4, backgroundColor: 'rgba(124,58,237,0.12)', width: '45%' }} />
                    <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(30,27,75,0.08)', width: '80%' }} />
                  </View>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 3, backgroundColor: 'rgba(124,58,237,0.08)', borderRadius: 8 }}>
                    <View style={{ height: 8, borderRadius: 3, backgroundColor: 'rgba(124,58,237,0.2)', width: 44 }} />
                  </View>
                </View>
              }
            />
          )}
        </GlassCard>

        {/* 5. ESTUDIOS Y FORMACIÓN */}
        <GlassCard>
          <CardHeader title="Estudios y formación" />
          {artist.education && artist.education.length > 0 ? (
            artist.education.map((study, i) => (
              <StudyItem
                key={i}
                degree={study.degree}
                institution={study.institution}
                year={study.year}
                details={study.details}
                last={i === artist.education!.length - 1}
              />
            ))
          ) : (
            <SectionEmpty
              icon="school-outline"
              title="Sin formación registrada"
              subtitle="Agrega tus títulos y certificaciones para demostrar tu preparación."
              preview={
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(124,58,237,0.25)', marginTop: 4 }} />
                  <View style={{ flex: 1, gap: 7 }}>
                    <View style={{ height: 11, borderRadius: 5, backgroundColor: 'rgba(30,27,75,0.14)', width: '60%' }} />
                    <View style={{ height: 9, borderRadius: 4, backgroundColor: 'rgba(124,58,237,0.12)', width: '48%' }} />
                    <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(30,27,75,0.07)', width: '35%' }} />
                  </View>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 3, backgroundColor: 'rgba(124,58,237,0.08)', borderRadius: 8 }}>
                    <View style={{ height: 8, borderRadius: 3, backgroundColor: 'rgba(124,58,237,0.2)', width: 32 }} />
                  </View>
                </View>
              }
            />
          )}
        </GlassCard>

        {/* 6. REDES SOCIALES */}
        <GlassCard>
          <CardHeader title="Redes sociales" />
          <View style={so.row}>
            {[
              { label: 'Instagram', icon: 'logo-instagram', color: '#E1306C', hasData: !!socialLinks?.instagram },
              { label: 'TikTok', icon: 'logo-tiktok', color: '#000000', hasData: !!socialLinks?.tiktok },
              { label: 'YouTube', icon: 'logo-youtube', color: '#FF0000', hasData: !!socialLinks?.youtube },
              { label: 'Spotify', icon: 'musical-notes', color: '#1DB954', hasData: !!socialLinks?.spotify },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                style={so.itemWrap}
                onPress={async () => {
                  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (item.hasData) {
                    let url = '';
                    if (item.label === 'Instagram' && socialLinks?.instagram) {
                      url = `https://instagram.com/${socialLinks.instagram}`;
                    } else if (item.label === 'TikTok' && socialLinks?.tiktok) {
                      url = `https://tiktok.com/@${socialLinks.tiktok}`;
                    } else if (item.label === 'YouTube' && socialLinks?.youtube) {
                      url = `https://youtube.com/@${socialLinks.youtube}`;
                    } else if (item.label === 'Spotify' && socialLinks?.spotify) {
                      url = `https://open.spotify.com/artist/${socialLinks.spotify}`;
                    }
                    if (url) {
                      Linking.openURL(url);
                    }
                  }
                }}
              >
                {item.hasData ? (
                  <View style={[so.iconActive, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon as any} size={20} color="#fff" />
                  </View>
                ) : (
                  <View style={so.iconInactive}>
                    <Ionicons name={item.icon as any} size={20} color="rgba(124,58,237,0.3)" />
                  </View>
                )}
                <Text style={[so.label, !item.hasData && so.labelInactive]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* ══ TABS ══ */}
        <View style={s.tabsCard}>
          <View style={s.tabBar}>
            {([
              { id: 'services',  label: 'Servicios',  icon: 'briefcase-outline'   },
              { id: 'portfolio', label: 'Portafolio', icon: 'grid-outline'        },
              { id: 'reviews',   label: 'Reseñas',    icon: 'star-outline' },
            ] as const).map(t => (
              <Pressable
                key={t.id}
                style={[s.tabItem, activeTab === t.id && s.tabItemActive]}
                onPress={() => handleTab(t.id)}
              >
                <Ionicons name={t.icon as any} size={14} color={activeTab === t.id ? '#7c3aed' : 'rgba(109,40,217,0.35)'} />
                <Text style={[s.tabLabel, activeTab === t.id && s.tabLabelActive]}>{t.label}</Text>
                {/* Indicador activo en gradiente */}
                {activeTab === t.id && (
                  <LinearGradient
                    colors={['#7c3aed', '#2563eb']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={s.tabIndicator}
                  />
                )}
              </Pressable>
            ))}
          </View>

          {/* Servicios con precio */}
          {activeTab === 'services' && (
            <View style={s.tabContent}>
              <ServicesSection
                services={artist.servicesData || []}
                isOwner={false}
                artistCategoryId={typeof artist.category === 'object' ? artist.category?.categoryId : undefined}
                artistRoleId={typeof artist.category === 'object' ? artist.category?.roleId : undefined}
                onHireService={() => onHire?.()}
              />
            </View>
          )}

          {/* Portafolio — overlay fix */}
          {activeTab === 'portfolio' && (
            <View style={s.tabContent}>
              <View style={styles.galleryGrid}>
                {artist.gallery.map((img: string, i: number) => {
                  const sz = (CARD_WIDTH - 56) / 2;
                  return (
                    <Pressable
                      key={i}
                      onPress={() => openGallery(i)}
                      style={({ pressed }) => [
                        styles.galleryThumb,
                        { width: sz, height: sz },
                        pressed && { opacity: 0.75 },
                      ]}
                    >
                      <Image source={{ uri: img }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
                      <View style={styles.galleryOverlay}>
                        <Ionicons name="expand-outline" size={20} color="#fff" />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Reseñas */}
          {activeTab === 'reviews' && (
            <View style={s.tabContent}>
              {MOCK_REVIEWS.map(r => <ReviewCard key={r.id} review={r} />)}
            </View>
          )}
        </View>

        {/* ══ CTA ══ */}
        <View style={styles.ctaRow}>
          <Pressable onPress={onMessage} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.text} />
          </Pressable>
          <Pressable onPress={onShare} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}>
            <Ionicons name="share-social-outline" size={20} color={colors.text} />
          </Pressable>
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onHire?.();
            }}
            style={({ pressed }) => [styles.hireBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
          >
            <Ionicons name="briefcase-outline" size={16} color="#fff" />
            <Text style={styles.hireBtnText}>{ctaLabel}</Text>
          </Pressable>
        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { width: CARD_WIDTH, gap: 12, paddingBottom: 8 },

  // mini header
  miniHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 18, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.background },
  avatarFallback: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headerMeta: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  artistName: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: colors.text, flex: 1 },
  artistCategory: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.textSecondary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 1 },
  locationText: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: colors.textSecondary },
  availPill: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  availDot: { width: 7, height: 7, borderRadius: 4 },
  availText: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold' },

  // card
  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: colors.text, marginBottom: 12 },
  bioText: { fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: colors.textSecondary, lineHeight: 22 },
  readMoreBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, alignSelf: 'flex-start' },
  readMoreText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.primary },
  infoPairs: { gap: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },

  
  // social media
  socialRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  socialIcon: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 16,
  },
  socialInactive: { backgroundColor: '#F4F4F5', borderWidth: 1, borderColor: '#E5E7EB' },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#fff' },
  labelInactive: { color: '#aaa' },

  // tabs
  tabsCard: {
    backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tabItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 13, borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabItemActive: { borderBottomColor: colors.primary },
  tabLabel: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.textSecondary },
  tabLabelActive: { fontFamily: 'PlusJakartaSans_700Bold', color: colors.primary },
  tabContent: { padding: 14, gap: 8 },

  // services
  serviceRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, paddingHorizontal: 12,
    backgroundColor: colors.background, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  serviceLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  serviceIconCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(16,185,129,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  serviceText: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: colors.text, flex: 1 },
  serviceDescription: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: colors.textSecondary, marginTop: 2 },
  servicePrice: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: colors.primary },
  servicePriceAsk: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.textSecondary },

  // gallery
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  galleryThumb: { borderRadius: 14, overflow: 'hidden', backgroundColor: colors.background },
  galleryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // cta
  ctaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 4 },
  iconBtn: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  hireBtn: {
    flex: 1, height: 48, borderRadius: 14, backgroundColor: colors.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  hireBtnText: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
});