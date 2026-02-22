import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Pressable, Linking, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Artist, Review, InnerTab } from '../types';
import { Service as APIService } from '../../../../services/api/services';
import { GalleryItem, FeaturedItem } from '../../../../services/api/portfolio';
import ReviewCard from '../../../../components/explore/shared/ReviewCard';
import { Colors } from '../../../../theme/colors';
import InfoPair from '../../../../components/explore/shared/InfoPair';
import GalleryModal from '../../../../components/explore/shared/GalleryModal';
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

// ── CONSTANTES Y TIPOS ────────────────────────────────────────────────────────
const INNER_TABS: Array<{ key: InnerTab; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }> = [
  { key: 'servicios' as InnerTab, label: 'Servicios', icon: 'briefcase-outline' },
  { key: 'portafolio' as InnerTab, label: 'Portafolio', icon: 'grid-outline' },
  { key: 'resenas' as InnerTab, label: 'Reseñas', icon: 'star-outline' },
];

type SocialItem = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  url?: string;
};

// ── COMPONENTES AUXILIARES ────────────────────────────────────────────────────

const EmptyItem = ({ label1, label2, label3, icon }: { label1: string, label2: string, label3: string, icon: any }) => (
  <View style={vs.emptyItemRow}>
    <View style={vs.iconCircle}>
      <Ionicons name={icon} size={20} color={Colors.text ?? '#aaa'} />
    </View>
    <View style={vs.emptyTextColumn}>
      <Text style={vs.placeholderMain}>{label1}</Text>
      <View style={vs.rowCenter}>
        <Text style={vs.placeholderSub}>{label2}</Text>
        <Text style={vs.placeholderDot}>•</Text>
        <Text style={vs.placeholderSub}>{label3}</Text>
      </View>
    </View>
  </View>
);

function buildSocials(artist: Artist): SocialItem[] {
  const get = (label: string) =>
    artist.info?.find((i) => i.label.toLowerCase() === label.toLowerCase())?.value;
  return [
    { label: 'Instagram', icon: 'logo-instagram', color: '#E1306C', url: get('instagram') ? `https://instagram.com/${get('instagram')}` : undefined },
    { label: 'X', icon: 'logo-x', color: '#000000', url: get('twitter') || get('x') ? `https://twitter.com/${get('twitter') || get('x')}` : undefined },
    { label: 'YouTube', icon: 'logo-youtube', color: '#FF0000', url: get('youtube') ? `https://youtube.com/@${get('youtube')}` : undefined },
    { label: 'Spotify', icon: 'musical-notes', color: '#1DB954', url: get('spotify') ? `https://open.spotify.com/artist/${get('spotify')}` : undefined },
  ];
}

const SocialRow: React.FC<{ artist: Artist; onEditSocialLinks?: () => void }> = ({ artist, onEditSocialLinks }) => {
  const socials = buildSocials(artist);
  return (
    <View style={sr.card}>
      <Text style={sr.title}>Redes sociales</Text>
      <View style={sr.row}>
        {socials.map((item) => {
          const active = Boolean(item.url);
          return (
            <TouchableOpacity
              key={item.label}
              activeOpacity={active ? 0.7 : 1}
              style={[sr.iconWrap, active ? { backgroundColor: item.color } : sr.iconInactive]}
              onPress={async () => {
                if (active && item.url) {
                  // Si hay URL, abrir la red social
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Linking.openURL(item.url);
                } else {
                  // Si no hay URL, abrir el modal para agregar redes sociales
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onEditSocialLinks?.();
                }
              }}
            >
              <Ionicons name={item.icon} size={22} color={active ? '#fff' : (Colors.text ?? '#aaa')} />
              <Text style={[sr.label, !active && sr.labelInactive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export const SobreMiSection: React.FC<Props> = ({
  artist, services, portfolio, videos, reviews,
  onEditBio, onEditProInfo, onEditExperience, onEditStudies, onEditCategory, onEditSocialLinks, onServicesUpdated, onPortfolioUpdated,
}) => {
  const [inner, setInner] = useState<InnerTab>('servicios' as InnerTab);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);

  const experienceValue = artist.info?.find((i) => i.label === 'Experiencia')?.value ?? 'No especificado';
  const artStyle = artist.info?.find((i) => i.label === 'Estilo')?.value ?? 'No especificado';
  const availability = artist.info?.find((i) => i.label === 'Disponibilidad')?.value ?? 'No especificado';
  const responseTime = artist.info?.find((i) => i.label === 'Tiempo de resp.')?.value ?? 'No especificado';
  const isAvailable = availability === 'Disponible';

  const galleryImages = portfolio.map(item => item.imageUrl ?? '');

  return (
    <View style={styles.container}>
      {galleryOpen && (
        <GalleryModal images={galleryImages} initialIndex={galleryIdx} onClose={() => setGalleryOpen(false)} />
      )}

      {/* 1. ACERCA DE MÍ */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Acerca de mí</Text>
          {artist.isOwner && <EditButton onPress={onEditBio || (() => {})} />}
        </View>
        <Text style={styles.bioText} numberOfLines={bioExpanded ? undefined : 3}>
          {artist.description || artist.bio}
        </Text>
        <Pressable onPress={() => setBioExpanded(p => !p)} style={styles.readMoreBtn}>
          <Text style={styles.readMoreText}>{bioExpanded ? 'Ver menos' : 'Ver más'}</Text>
          <Ionicons name={bioExpanded ? 'chevron-up' : 'chevron-down'} size={14} color={Colors.primary} />
        </Pressable>
      </View>

      {/* 2. CATEGORÍA ARTÍSTICA */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categoría artística</Text>
          {artist.isOwner && <EditButton onPress={onEditCategory || (() => {})} />}
        </View>
        <View style={styles.infoPairs}>
          <InfoPair label="Especialidad" value={artist.specialty || 'No especificado'} />
          <View style={styles.divider} />
          <InfoPair label="Nicho" value={artist.niche || 'No especificado'} />
        </View>
      </View>

      {/* 3. INFORMACIÓN PROFESIONAL */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Información profesional</Text>
          {artist.isOwner && <EditButton onPress={onEditProInfo || (() => {})} />}
        </View>
        <View style={styles.infoPairs}>
          <InfoPair label="Experiencia" value={experienceValue} />
          <View style={styles.divider} />
          <InfoPair label="Estilo" value={artStyle} />
          <View style={styles.divider} />
          <InfoPair label="Disponibilidad" value={availability} valueColor={isAvailable ? Colors.success : '#f59e0b'} />
          <View style={styles.divider} />
          <InfoPair label="Tiempo de resp." value={responseTime} />
        </View>
      </View>

      {/* 4. EXPERIENCIA LABORAL */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Experiencia laboral</Text>
          {artist.isOwner && <EditButton onPress={onEditExperience || (() => {})} />}
        </View>
        {artist.workExperience && artist.workExperience.length > 0 ? (
          artist.workExperience.map((work, index) => (
            <View key={index} style={styles.experienceItem}>
              <View style={styles.experienceHeader}>
                <Text style={styles.positionText}>{work.position}</Text>
                <Text style={styles.periodText}>{work.period}</Text>
              </View>
              <Text style={styles.companyText}>{work.company}</Text>
              {work.description && <Text style={styles.descriptionText}>{work.description}</Text>}
            </View>
          ))
        ) : (
          <EmptyItem 
            label1="Nombre del puesto o cargo" 
            label2="Empresa / Cliente" 
            label3="Periodo (Ej: 2022 - Act.)"
            icon="briefcase-outline"
          />
        )}
      </View>

      {/* 5. ESTUDIOS Y FORMACIÓN */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Estudios y formación</Text>
          {artist.isOwner && <EditButton onPress={onEditStudies || (() => {})} />}
        </View>
        {artist.studies && artist.studies.length > 0 ? (
          artist.studies.map((study, index) => (
            <View key={index} style={styles.studyItem}>
              <View style={styles.studyHeader}>
                <Text style={styles.degreeText}>{study.degree}</Text>
                <Text style={styles.yearText}>{study.year}</Text>
              </View>
              <Text style={styles.institutionText}>{study.institution}</Text>
              {study.details && <Text style={styles.detailsText}>{study.details}</Text>}
            </View>
          ))
        ) : (
          <EmptyItem 
            label1="Título o Certificación" 
            label2="Institución académica" 
            label3="Año de graduación"
            icon="school-outline"
          />
        )}
      </View>

      {/* 6. REDES SOCIALES */}
      <SocialRow artist={artist} onEditSocialLinks={onEditSocialLinks} />

      {/* 7. TABS */}
      <View style={styles.tabsCard}>
        <View style={styles.tabBar}>
          {INNER_TABS.map((t) => (
            <Pressable
              key={t.key}
              style={[styles.tabItem, inner === t.key && styles.tabItemActive]}
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.selectionAsync();
                setInner(t.key);
              }}
            >
              <Ionicons name={t.icon} size={15} color={inner === t.key ? Colors.primary : Colors.textSecondary} />
              <Text style={[styles.tabLabel, inner === t.key && styles.tabLabelActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.tabContent}>
          {inner === 'servicios' && (
            <ServicesSection services={services} isOwner={!!artist.isOwner} onServicesUpdated={onServicesUpdated} />
          )}
          {inner === 'portafolio' && (
            <PortfolioSection portfolio={portfolio} videos={videos} isOwner={!!artist.isOwner} onPortfolioUpdated={onPortfolioUpdated} />
          )}
          {inner === 'resenas' && (
            reviews.length > 0 ? (
              <View style={styles.reviewsContainer}>
                {reviews.map((r) => (
                  <ReviewCard key={r.id} review={{ id: r.id, authorName: r.reviewerName, rating: r.stars, text: r.text, date: r.date }} />
                ))}
              </View>
            ) : (
              <View style={vs.emptyStateSimple}><Text style={{ color: '#aaa', textAlign: 'center' }}>No hay reseñas todavía.</Text></View>
            )
          )}
        </View>
      </View>
    </View>
  );
};

// ── ESTILOS ───────────────────────────────────────────────────────────────────

const vs = StyleSheet.create({
  emptyItemRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 8 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8F9FA', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F2F4' },
  emptyTextColumn: { flex: 1, gap: 2 },
  placeholderMain: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#D1D5DB' },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  placeholderSub: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#E5E7EB' },
  placeholderDot: { fontSize: 12, color: '#E5E7EB' },
  emptyStateSimple: { paddingVertical: 20, alignItems: 'center' }
});

const sr = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 18, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  title: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.text, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  iconWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 16 },
  iconInactive: { backgroundColor: '#F4F4F5', borderWidth: 1, borderColor: '#E5E7EB' },
  label: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#fff' },
  labelInactive: { color: '#aaa' },
});

const styles = StyleSheet.create({
  container: { paddingTop: 16, gap: 12, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 18, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.text },
  bioText: { fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.textSecondary, lineHeight: 22 },
  readMoreBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, alignSelf: 'flex-start' },
  readMoreText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: Colors.primary },
  infoPairs: { gap: 2 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 },
  tabsCard: { backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden', elevation: 2 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tabItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 13, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabItemActive: { borderBottomColor: Colors.primary },
  tabLabel: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: Colors.textSecondary },
  tabLabelActive: { fontFamily: 'PlusJakartaSans_700Bold', color: Colors.primary },
  tabContent: { padding: 14 },
  reviewsContainer: { gap: 4 },
  
  // Estilos para experiencia laboral
  experienceItem: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  experienceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  positionText: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.text, flex: 1 },
  periodText: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: Colors.primary },
  companyText: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: Colors.textSecondary, marginBottom: 4 },
  descriptionText: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.textSecondary, lineHeight: 18 },
  
  // Estilos para estudios
  studyItem: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  studyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  degreeText: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.text, flex: 1 },
  yearText: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: Colors.primary },
  institutionText: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: Colors.textSecondary, marginBottom: 4 },
  detailsText: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.textSecondary, lineHeight: 18, fontStyle: 'italic' },
});