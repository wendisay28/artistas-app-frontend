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
}> = ({ title, isOwner, onEdit }) => (
  <View style={ch.row}>
    <Text style={ch.title}>{title}</Text>
    {isOwner && onEdit && <EditButton onPress={onEdit} />}
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

// ── EmptyItem ─────────────────────────────────────────────────────────────────

const EmptyItem = ({
  label1, label2, label3, icon,
}: {
  label1: string; label2: string; label3: string; icon: any;
}) => (
  <View style={ei.row}>
    <View style={ei.iconCircle}>
      <Ionicons name={icon} size={18} color="rgba(124,58,237,0.35)" />
    </View>
    <View style={ei.textCol}>
      <Text style={ei.main}>{label1}</Text>
      <View style={ei.subRow}>
        <Text style={ei.sub}>{label2}</Text>
        <Text style={ei.dot}>·</Text>
        <Text style={ei.sub}>{label3}</Text>
      </View>
    </View>
  </View>
);

const ei = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  iconCircle: {
    width: 42, height: 42, borderRadius: 42 * 0.28,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1, borderColor: 'rgba(167,139,250,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  textCol:  { flex: 1, gap: 3 },
  main:     { fontSize: 13.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(109,40,217,0.25)' },
  subRow:   { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sub:      { fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.2)' },
  dot:      { fontSize: 11, color: 'rgba(109,40,217,0.2)' },
});

// ── SocialRow ─────────────────────────────────────────────────────────────────

const SocialRow: React.FC<{
  artist: Artist;
  onEditSocialLinks?: () => void;
}> = ({ artist, onEditSocialLinks }) => {
  const socials = buildSocials(artist);
  return (
    <GlassCard>
      <CardHeader title="Redes sociales" />
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
                } else {
                  onEditSocialLinks?.();
                }
              }}
            >
              {active ? (
                <View style={[so.iconActive, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={20} color="#fff" />
                </View>
              ) : (
                <View style={so.iconInactive}>
                  <Ionicons name={item.icon} size={20} color="rgba(124,58,237,0.3)" />
                </View>
              )}
              <Text style={[so.label, !active && so.labelInactive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </GlassCard>
  );
};

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

// ── SobreMiSection (principal) ────────────────────────────────────────────────

export const SobreMiSection: React.FC<Props> = ({
  artist, services, portfolio, videos, reviews,
  onEditBio, onEditProInfo, onEditExperience,
  onEditStudies, onEditCategory, onEditSocialLinks,
  onServicesUpdated, onPortfolioUpdated,
}) => {
  const [inner, setInner]             = useState<InnerTab>('servicios' as InnerTab);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIdx, setGalleryIdx]   = useState(0);

  const experienceValue = artist.info?.find((i) => i.label === 'Experiencia')?.value ?? 'No especificado';
  const artStyle        = artist.info?.find((i) => i.label === 'Estilo')?.value ?? 'No especificado';
  const availability    = artist.info?.find((i) => i.label === 'Disponibilidad')?.value ?? 'No especificado';
  const responseTime    = artist.info?.find((i) => i.label === 'Tiempo de resp.')?.value ?? 'No especificado';
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
        <Text style={s.bioText} numberOfLines={bioExpanded ? undefined : 3}>
          {artist.description || artist.bio}
        </Text>
        <Pressable onPress={() => setBioExpanded(p => !p)} style={s.readMoreBtn}>
          <Text style={s.readMoreText}>{bioExpanded ? 'Ver menos' : 'Ver más'}</Text>
          <Ionicons name={bioExpanded ? 'chevron-up' : 'chevron-down'} size={13} color="#7c3aed" />
        </Pressable>
      </GlassCard>

      {/* 2. CATEGORÍA ARTÍSTICA */}
      <GlassCard>
        <CardHeader title="Categoría artística" isOwner={artist.isOwner} onEdit={onEditCategory} />
        <View style={s.infoPairs}>
          <InfoPair
            label="Categoría"
            value={
              artist.category?.categoryId
                ? getLocalizedCategoryName(artist.category.categoryId)
                : 'No especificado'
            }
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
      </GlassCard>

      {/* 3. INFORMACIÓN PROFESIONAL */}
      <GlassCard>
        <CardHeader title="Información profesional" isOwner={artist.isOwner} onEdit={onEditProInfo} />
        <View style={s.infoPairs}>
          <InfoPair label="Experiencia" value={experienceValue} />
          <View style={s.divider} />
          <InfoPair label="Estilo" value={artStyle} />
          <View style={s.divider} />
          <InfoPair
            label="Disponibilidad"
            value={availability}
            valueColor={isAvailable ? '#16a34a' : '#d97706'}
          />
          <View style={s.divider} />
          <InfoPair label="Tiempo de resp." value={responseTime} />
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
          <EmptyItem
            label1="Nombre del puesto o cargo"
            label2="Empresa / Cliente"
            label3="Periodo (Ej: 2022 - Act.)"
            icon="briefcase-outline"
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
          <EmptyItem
            label1="Título o Certificación"
            label2="Institución académica"
            label3="Año de graduación"
            icon="school-outline"
          />
        )}
      </GlassCard>

      {/* 6. REDES SOCIALES */}
      <SocialRow artist={artist} onEditSocialLinks={onEditSocialLinks} />

      {/* 7. TABS — Servicios / Portafolio / Reseñas */}
      <View style={s.tabsCard}>
        <View style={s.tabBar}>
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
              <Text style={[s.tabLabel, inner === t.key && s.tabLabelActive]}>
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
                <Text style={s.emptyReviewsText}>No hay reseñas todavía.</Text>
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

  // Reviews empty
  emptyReviews: { paddingVertical: 28, alignItems: 'center', gap: 8 },
  emptyReviewsText: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(124,58,237,0.35)',
  },
  reviewsContainer: { gap: 8 },
});