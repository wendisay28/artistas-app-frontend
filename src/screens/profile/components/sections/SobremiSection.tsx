// src/screens/artist/profile/sections/SobreMiSection.tsx
// Rediseño sistema BuscArt · colores morado/azul · glass cards · acento lateral

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Pressable, Linking, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Artist, Review, InnerTab } from '../types';
import { Service as APIService } from '../../../../services/api/services';
import { GalleryItem, FeaturedItem } from '../../../../services/api/portfolio';
import ReviewCard from '../../../../components/explore/shared/ReviewCard';
import InfoPair from '../../../../components/explore/shared/InfoPair';
import GalleryModal from '../../../../components/explore/shared/GalleryModal';
import { useThemeStore } from '../../../../store/themeStore';
// Mapeo JS día semana → prefijo del horario guardado
const TODAY_SHORT = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][new Date().getDay()];
const getTodaySchedule = (scheduleStr: string): string => {
  if (!scheduleStr || scheduleStr === 'No especificado') return 'No especificado';
  const parts = scheduleStr.split(',').map(p => p.trim());
  const todayPart = parts.find(p => p.startsWith(TODAY_SHORT));
  if (!todayPart) return 'No disponible hoy';
  const match = todayPart.match(/^\S+\s+(.+)-(.+)$/);
  if (!match) return todayPart;
  return `Hoy: ${match[1]} – ${match[2]}`;
};

import {
  getLocalizedCategoryName,
  getLocalizedDisciplineName,
  getLocalizedRoleName,
} from '../../../../constants/artistCategories';
import { EditButton } from '../shared/EditButton';
import { ServicesSection } from './ServicesSection';
import { PortfolioSection } from './PortfolioSection';

type Props = {
  artist: Artist;
  services: APIService[];
  portfolio: GalleryItem[];
  videos: FeaturedItem[];
  reviews: Review[];
  onEditBio?: () => void;
  onEditProInfo?: () => void;
  onEditExperience?: () => void;
  onEditStudies?: () => void;
  onEditCategory?: () => void;
  onEditSocialLinks?: () => void;
  onServicesUpdated?: () => void;
  onPortfolioUpdated?: () => void;
};

// ── Tabs ──────────────────────────────────────────────────────────────────────

const INNER_TABS: Array<{
  key: InnerTab;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}> = [
  { key: 'servicios'  as InnerTab, label: 'Servicios',  icon: 'briefcase-outline' },
  { key: 'portafolio' as InnerTab, label: 'Portafolio', icon: 'grid-outline' },
  { key: 'resenas'    as InnerTab, label: 'Reseñas',    icon: 'star-outline' },
];

type SocialItem = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  url?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildSocials(artist: Artist): SocialItem[] {
  const get = (label: string) =>
    artist.info?.find((i) => i.label.toLowerCase() === label.toLowerCase())?.value;
  return [
    { label: 'Instagram', icon: 'logo-instagram', color: '#E1306C', url: get('Instagram') },
    { label: 'TikTok',    icon: 'logo-tiktok',    color: '#fe2c55', url: get('TikTok') },
    { label: 'YouTube',   icon: 'logo-youtube',   color: '#FF0000', url: get('YouTube') },
    { label: 'Spotify',   icon: 'musical-notes',  color: '#1DB954', url: get('Spotify') },
  ];
}

// ── SectionHeader con acento lateral ─────────────────────────────────────────

const CardHeader: React.FC<{
  title: string;
  isOwner?: boolean;
  onEdit?: () => void;
}> = ({ title, isOwner, onEdit }) => {
  const { isDark } = useThemeStore();
  return (
    <View style={ch.row}>
      <Text style={[ch.title, isDark && ch.titleDark]}>{title}</Text>
      {isOwner && onEdit && <EditButton onPress={onEdit} />}
    </View>
  );
};

const ch = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 14,
  },
  title: {
    flex: 1,
    fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  titleDark: { color: '#f5f3ff' },
});

// ── Glass Card base ───────────────────────────────────────────────────────────

const GlassCard: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => {
  const { isDark } = useThemeStore();
  return (
    <View style={[gc.card, isDark && gc.cardDark, style]}>
      {children}
    </View>
  );
};

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
  cardDark: {
    backgroundColor: 'rgba(10,6,24,0.95)',
    borderColor: 'rgba(167,139,250,0.3)',
  },
});

// ── SectionEmpty — empty state con preview punteado morado ───────────────────

const SectionEmpty: React.FC<{
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  preview: React.ReactNode;
}> = ({ icon, title, subtitle, preview }) => {
  const { isDark } = useThemeStore();
  return (
    <View style={[ep.container, isDark && ep.containerDark]}>
      <View style={ep.iconWrap}>
        <Ionicons name={icon} size={28} color="rgba(124,58,237,0.3)" />
      </View>
      <Text style={[ep.title, isDark && ep.titleDark]}>{title}</Text>
      <Text style={[ep.subtitle, isDark && ep.subtitleDark]}>{subtitle}</Text>
      <View style={ep.sep}>
        <View style={ep.sepLine} />
        <Text style={ep.sepText}>vista previa</Text>
        <View style={ep.sepLine} />
      </View>
      {preview}
    </View>
  );
};

const ep = StyleSheet.create({
  container: {
    alignItems: 'center', paddingVertical: 22, paddingHorizontal: 14, gap: 7,
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.18)',
    borderRadius: 14, borderStyle: 'dashed',
    backgroundColor: 'rgba(245,243,255,0.4)',
  },
  containerDark: {
    backgroundColor: 'rgba(167,139,250,0.05)',
    borderColor: 'rgba(167,139,250,0.15)',
  },
  iconWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: 'rgba(124,58,237,0.07)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 2,
  },
  title: { fontSize: 13.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  titleDark: { color: '#e5e7eb' },
  subtitle: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(124,58,237,0.4)', textAlign: 'center', lineHeight: 17,
  },
  subtitleDark: { color: 'rgba(167,139,250,0.6)' },
  sep: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%', marginTop: 4 },
  sepLine: { flex: 1, height: 1, backgroundColor: 'rgba(124,58,237,0.1)' },
  sepText: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(124,58,237,0.3)',
  },
});

// ── SocialRow ─────────────────────────────────────────────────────────────────

const SocialRow: React.FC<{
  artist: Artist;
  onEditSocialLinks?: () => void;
}> = ({ artist, onEditSocialLinks }) => {
  const { isDark } = useThemeStore();
  const socials = buildSocials(artist);
  return (
    <GlassCard>
      <View style={so.headerRow}>
        <CardHeader title="Redes sociales" />
        {onEditSocialLinks && (
          <TouchableOpacity 
            style={so.editBtn} 
            onPress={onEditSocialLinks}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={14} color="#6d28d9" />
          </TouchableOpacity>
        )}
      </View>
      <View style={so.row}>
        {socials.map((item) => {
          const active = Boolean(item.url);
          return (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.8}
              style={so.itemWrap}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (active && item.url) {
                  Linking.openURL(item.url);
                }
              }}
            >
              {active ? (
                <View style={[so.iconActive, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={20} color="#fff" />
                </View>
              ) : (
                <View style={[so.iconInactive, isDark && so.iconInactiveDark]}>
                  <Ionicons name={item.icon} size={20} color="rgba(124,58,237,0.3)" />
                </View>
              )}
              <Text style={[so.label, !active && so.labelInactive, isDark && so.labelDark]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </GlassCard>
  );
};

const so = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  editBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(124,58,237,0.08)',
  },
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
  iconInactiveDark: {
    backgroundColor: 'rgba(167,139,250,0.10)',
    borderColor: 'rgba(167,139,250,0.20)',
  },
  label:        { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#1e1b4b' },
  labelDark: { color: '#e5e7eb' },
  labelInactive:{ color: 'rgba(124,58,237,0.3)' },
});

// ── Experience Item ───────────────────────────────────────────────────────────

const ExperienceItem: React.FC<{
  position: string;
  company: string;
  period: string;
  description?: string;
  last?: boolean;
}> = ({ position, company, period, description, last }) => {
  const { isDark } = useThemeStore();
  return (
    <View style={[exp.item, !last && exp.itemBorder]}>
      <View style={exp.dotWrap}>
        <View style={[exp.dot, { backgroundColor: '#7c3aed' }]} />
      </View>
      <View style={exp.content}>
        <View style={exp.headerRow}>
          <Text style={[exp.position, isDark && exp.positionDark]}>{position}</Text>
          <View style={[exp.periodPill, isDark && exp.periodPillDark]}>
            <Text style={exp.period}>{period}</Text>
          </View>
        </View>
        <Text style={[exp.company, isDark && exp.companyDark]}>{company}</Text>
        {description && <Text style={[exp.desc, isDark && exp.descDark]}>{description}</Text>}
      </View>
    </View>
  );
};

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
  positionDark: { color: '#f5f3ff' },
  periodPill: {
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2,
    marginLeft: 8,
  },
  periodPillDark: { backgroundColor: 'rgba(167,139,250,0.15)' },
  period: { fontSize: 10.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },
  company: {
    fontSize: 12.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(109,40,217,0.55)', marginBottom: 4,
  },
  companyDark: { color: '#a78bfa' },
  desc: {
    fontSize: 12.5, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(30,27,75,0.55)', lineHeight: 18,
  },
  descDark: { color: '#9ca3af' },
});

// ── Study Item ────────────────────────────────────────────────────────────────

const StudyItem: React.FC<{
  degree: string;
  institution: string;
  year: string;
  details?: string;
  last?: boolean;
}> = ({ degree, institution, year, details, last }) => {
  const { isDark } = useThemeStore();
  return (
    <View style={[st.item, !last && st.itemBorder]}>
      <View style={st.dotWrap}>
        <View style={[st.dot, { backgroundColor: '#2563eb' }]} />
      </View>
      <View style={st.content}>
        <View style={st.headerRow}>
          <Text style={[st.degree, isDark && st.degreeDark]}>{degree}</Text>
          <View style={[st.yearPill, isDark && st.yearPillDark]}>
            <Text style={st.year}>{year}</Text>
          </View>
        </View>
        <Text style={[st.institution, isDark && st.institutionDark]}>{institution}</Text>
        {details && <Text style={[st.details, isDark && st.detailsDark]}>{details}</Text>}
      </View>
    </View>
  );
};

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
  degreeDark: { color: '#f5f3ff' },
  yearPill: {
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8,
  },
  yearPillDark: { backgroundColor: 'rgba(167,139,250,0.15)' },
  year:        { fontSize: 10.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },
  institution: {
    fontSize: 12.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(109,40,217,0.55)', marginBottom: 4,
  },
  institutionDark: { color: '#a78bfa' },
  details: {
    fontSize: 12.5, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(30,27,75,0.5)', lineHeight: 18, fontStyle: 'italic',
  },
  detailsDark: { color: '#9ca3af' },
});

// ── SobreMiSection (principal) ────────────────────────────────────────────────

export const SobreMiSection: React.FC<Props> = ({
  artist, services, portfolio, videos, reviews,
  onEditBio, onEditProInfo, onEditExperience,
  onEditStudies, onEditCategory, onEditSocialLinks,
  onServicesUpdated, onPortfolioUpdated,
}) => {
  const { isDark } = useThemeStore();
  const [inner, setInner]             = useState<InnerTab>('servicios' as InnerTab);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIdx, setGalleryIdx]   = useState(0);

  const experienceValue = artist.info?.find((i) => i.label === 'Experiencia')?.value ?? 'No especificado';
  const artStyle        = artist.info?.find((i) => i.label === 'Estilo')?.value ?? 'No especificado';
  const availability    = artist.info?.find((i) => i.label === 'Disponibilidad')?.value ?? 'No especificado';
  const responseTime    = artist.info?.find((i) => i.label === 'Horario')?.value ?? 'No especificado';
  const isAvailable     = availability === 'Disponible';
  const galleryImages   = portfolio.map(item => item.imageUrl ?? '');

  return (
    <View style={s.container}>
      {galleryOpen && (
        <GalleryModal
          images={galleryImages}
          initialIndex={galleryIdx}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      {/* 1. ACERCA DE MÍ */}
      <GlassCard>
        <CardHeader title="Acerca de mí" isOwner={artist.isOwner} onEdit={onEditBio} />
        {artist.description ? (
          <>
            <Text style={[s.bioText, isDark && s.bioTextDark, { marginTop: -1 }]} numberOfLines={bioExpanded ? undefined : 3}>
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
        <CardHeader title="Categoría artística" isOwner={artist.isOwner} onEdit={onEditCategory} />
        {artist.category?.categoryId ? (
          <View style={s.infoPairs}>
            <InfoPair
              label="Categoría"
              value={getLocalizedCategoryName(artist.category.categoryId)}
            />
            {artist.category?.disciplineId ? (
              <>
                <View style={[s.divider, isDark && s.dividerDark]} />
                <InfoPair
                  label="Disciplina"
                  value={getLocalizedDisciplineName(artist.category.categoryId, artist.category.disciplineId)}
                />
              </>
            ) : null}
            {artist.category?.roleId ? (
              <>
                <View style={[s.divider, isDark && s.dividerDark]} />
                <InfoPair
                  label="Rol"
                  value={getLocalizedRoleName(artist.category.categoryId, artist.category.disciplineId, artist.category.roleId)}
                />
              </>
            ) : null}
            <View style={[s.divider, isDark && s.dividerDark]} />
            <InfoPair label="Especialidad" value={artist.specialty || 'No especificado'} />
            <View style={[s.divider, isDark && s.dividerDark]} />
            <InfoPair label="Nicho" value={artist.niche || 'No especificado'} />
          </View>
        ) : (
          <SectionEmpty
            icon="color-palette-outline"
            title="Sin categoría definida"
            subtitle="Selecciona tu disciplina artística para aparecer en las búsquedas correctas."
            preview={
              <View style={{ gap: 10 }}>
                {[['Categoría', '70%'], ['Disciplina', '55%'], ['Especialidad', '45%']].map(([lbl, w]) => (
                  <View key={lbl} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ height: 9, borderRadius: 4, backgroundColor: 'rgba(124,58,237,0.12)', width: '30%' }} />
                    <View style={{ height: 9, borderRadius: 4, backgroundColor: 'rgba(30,27,75,0.1)', width: w as any }} />
                  </View>
                ))}
              </View>
            }
          />
        )}
      </GlassCard>

      {/* 3. INFORMACIÓN PROFESIONAL */}
      <GlassCard>
        <CardHeader title="Información profesional" isOwner={artist.isOwner} onEdit={onEditProInfo} />
        <View style={s.infoPairs}>
          <InfoPair label="Experiencia" value={experienceValue} />
          <View style={[s.divider, isDark && s.dividerDark]} />
          <InfoPair label="Estilo" value={artStyle} />
          <View style={[s.divider, isDark && s.dividerDark]} />
          <InfoPair
            label="Disponibilidad"
            value={availability}
            valueColor={isAvailable ? '#16a34a' : '#d97706'}
          />
          <View style={[s.divider, isDark && s.dividerDark]} />
          <InfoPair label="Horario" value={getTodaySchedule(responseTime)} />
        </View>
      </GlassCard>

      {/* 4. EXPERIENCIA LABORAL */}
      <GlassCard>
        <CardHeader title="Experiencia laboral" isOwner={artist.isOwner} onEdit={onEditExperience} />
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
        <CardHeader title="Estudios y formación" isOwner={artist.isOwner} onEdit={onEditStudies} />
        {artist.studies && artist.studies.length > 0 ? (
          artist.studies.map((study, i) => (
            <StudyItem
              key={i}
              degree={study.degree}
              institution={study.institution}
              year={study.year}
              details={study.details}
              last={i === artist.studies!.length - 1}
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
      <SocialRow artist={artist} onEditSocialLinks={onEditSocialLinks} />

      {/* 7. TABS — Servicios / Portafolio / Reseñas */}
      <View style={[s.tabsCard, isDark && s.tabsCardDark]}>
        <View style={[s.tabBar, isDark && s.tabBarDark]}>
          {INNER_TABS.map((t) => (
            <Pressable
              key={t.key}
              style={[s.tabItem, inner === t.key && s.tabItemActive]}
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.selectionAsync();
                setInner(t.key);
              }}
            >
              <Ionicons
                name={t.icon}
                size={14}
                color={inner === t.key ? '#7c3aed' : 'rgba(109,40,217,0.35)'}
              />
              <Text style={[s.tabLabel, inner === t.key && s.tabLabelActive, isDark && s.tabLabelDark]}>
                {t.label}
              </Text>
              {/* Indicador activo en gradiente */}
              {inner === t.key && (
                <LinearGradient
                  colors={['#7c3aed', '#2563eb']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={s.tabIndicator}
                />
              )}
            </Pressable>
          ))}
        </View>

        <View style={s.tabContent}>
          {inner === 'servicios' && (
            <ServicesSection
              services={services}
              isOwner={!!artist.isOwner}
              artistCategoryId={artist.category?.categoryId}
              artistRoleId={artist.category?.roleId}
              onServicesUpdated={onServicesUpdated}
            />
          )}
          {inner === 'portafolio' && (
            <PortfolioSection
              portfolio={portfolio}
              videos={videos}
              isOwner={!!artist.isOwner}
              onPortfolioUpdated={onPortfolioUpdated}
            />
          )}
          {inner === 'resenas' && (
            reviews.length > 0 ? (
              <View style={s.reviewsContainer}>
                {reviews.map((r) => (
                  <ReviewCard
                    key={r.id}
                    review={{
                      id: r.id,
                      authorName: r.reviewerName,
                      rating: r.stars,
                      text: r.text,
                      date: r.date,
                    }}
                  />
                ))}
              </View>
            ) : (
              <View style={s.emptyReviews}>
                <Ionicons name="star-outline" size={32} color="rgba(124,58,237,0.2)" />
                <Text style={[s.emptyReviewsText, isDark && s.emptyReviewsTextDark]}>No hay reseñas todavía.</Text>
              </View>
            )
          )}
        </View>
      </View>

    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { paddingTop: 16, gap: 12, paddingBottom: 40 },

  // Bio
  bioText: {
    fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(30,27,75,0.7)', lineHeight: 22,
  },
  bioTextDark: { color: '#9ca3af' },
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
  dividerDark: { backgroundColor: 'rgba(167,139,250,0.10)' },

  // Tabs card
  tabsCard: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(167,139,250,0.2)',
    shadowColor: '#6d28d9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    marginTop: 16,
  },
  tabsCardDark: {
    backgroundColor: 'rgba(10,6,24,0.95)',
    borderColor: 'rgba(167,139,250,0.3)',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167,139,250,0.12)',
  },
  tabBarDark: { borderBottomColor: 'rgba(167,139,250,0.15)' },
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
  tabLabelDark: { color: 'rgba(167,139,250,0.45)' },
  tabLabelActive: {
    fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed',
  },
  // Línea indicadora en gradiente abajo del tab activo
  tabIndicator: {
    position: 'absolute', bottom: 0, left: 8, right: 8,
    height: 2.5, borderRadius: 2,
  },
  tabContent: { padding: 16 },

  // Reviews empty
  emptyReviews: { paddingVertical: 28, alignItems: 'center', gap: 8 },
  emptyReviewsText: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(124,58,237,0.35)',
  },
  emptyReviewsTextDark: { color: 'rgba(167,139,250,0.45)' },
  reviewsContainer: { gap: 8 },
});