// src/pages/profile/index.tsx — Pantalla de perfil del artista
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { auth } from '../../services/firebase/config';
import { signOutUser } from '../../services/firebase/auth';
import { useAuthStore } from '../../store/authStore';

// ── Shared
import TopBar from '../../components/shared/TopBar';

// ── Profile components
import CoverHeader from '../../components/profile/header/CoverHeader';
import ProfileInfo from '../../components/profile/header/ProfileInfo';
import GallerySection from '../../components/profile/sections/GallerySection';
import CatalogSection from '../../components/profile/sections/CatalogSection';
import AboutSection from '../../components/profile/sections/AboutSection';
import PortalSection from '../../components/profile/sections/PortalSection';
import BottomActions from '../../components/profile/shared/BottomActions';
import GalleryModal from '../../components/profile/shared/GalleryModal';

// ── Types
import type { SectionType, CatalogItem, Event, Offer, PortalStats } from '../../types/profile';

// ── Tabs config
const SECTION_TABS: { id: SectionType; label: string }[] = [
  { id: 'gallery', label: 'Galería' },
  { id: 'catalog', label: 'Catálogo' },
  { id: 'about', label: 'Acerca de' },
  { id: 'portal', label: 'Portal' },
];

// ── Mock data (temporal hasta conectar con backend)
const MOCK_GALLERY_IMAGES = [
  'https://picsum.photos/400/400?random=1',
  'https://picsum.photos/400/400?random=2',
  'https://picsum.photos/400/400?random=3',
  'https://picsum.photos/400/400?random=4',
  'https://picsum.photos/400/400?random=5',
  'https://picsum.photos/400/400?random=6',
];

const MOCK_CATALOG: CatalogItem[] = [
  { id: '1', title: 'Retrato personalizado', price: '$120', image: 'https://picsum.photos/300/300?random=10', tag: 'Popular' },
  { id: '2', title: 'Mural artístico', price: '$450', image: 'https://picsum.photos/300/300?random=11' },
  { id: '3', title: 'Ilustración digital', price: '$80', image: 'https://picsum.photos/300/300?random=12', tag: 'Nuevo' },
  { id: '4', title: 'Diseño de logo', price: '$200', image: 'https://picsum.photos/300/300?random=13' },
];

const MOCK_DETAILS = [
  { icon: 'briefcase-outline', value: '10 años de experiencia' },
  { icon: 'school-outline', value: 'Bellas Artes, Universidad Complutense' },
  { icon: 'globe-outline', value: 'www.artistaejemplo.com' },
  { icon: 'mail-outline', value: 'contacto@artistaejemplo.com' },
];

const MOCK_SKILLS = ['Óleo', 'Acuarela', 'Mural', 'Retrato', 'Ilustración', 'Diseño'];

const MOCK_PORTAL_STATS: PortalStats = {
  earnings: { value: '$2,450', sub: 'Este mes' },
  clients: { value: '18', sub: 'Activos' },
  views: { value: '1.2k', sub: 'Última semana' },
};

const MOCK_EVENTS: Event[] = [
  { id: '1', title: 'Expo Arte Contemporáneo', date: '15 Mar', location: 'Galería Central', status: 'confirmed' },
  { id: '2', title: 'Taller de Acuarela', date: '22 Mar', location: 'Centro Cultural', status: 'pending' },
];

const MOCK_OFFERS: Offer[] = [
  { id: '1', client: 'María López', type: 'Retrato', amount: '$150', time: 'Hace 2h' },
  { id: '2', client: 'Carlos Ruiz', type: 'Mural', amount: '$500', time: 'Hace 1d' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const logout = useAuthStore((s) => s.logout);
  const user = auth.currentUser;

  const [activeSection, setActiveSection] = useState<SectionType>('gallery');
  const [galleryModalVisible, setGalleryModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // ── Datos del usuario
  const userName = user?.displayName ?? 'Artista';
  const avatarLetter = userName.charAt(0).toUpperCase();

  // ── Handlers
  const handleImagePress = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setGalleryModalVisible(true);
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          await signOutUser();
          logout();
        },
      },
    ]);
  }, [logout]);

  // ── Render de la sección activa
  const renderSection = () => {
    switch (activeSection) {
      case 'gallery':
        return (
          <GallerySection
            images={MOCK_GALLERY_IMAGES}
            onImagePress={handleImagePress}
          />
        );
      case 'catalog':
        return <CatalogSection items={MOCK_CATALOG} />;
      case 'about':
        return (
          <AboutSection
            bio="Artista visual especializada en arte contemporáneo y murales. Apasionada por crear experiencias visuales únicas que conectan con las emociones."
            details={MOCK_DETAILS}
            skills={MOCK_SKILLS}
          />
        );
      case 'portal':
        return (
          <PortalSection
            stats={MOCK_PORTAL_STATS}
            events={MOCK_EVENTS}
            offers={MOCK_OFFERS}
          />
        );
    }
  };

  return (
    <View style={styles.root}>
      <TopBar title="Mi Perfil" topInset={insets.top} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Cover + avatar + stats + quick actions */}
        <CoverHeader
          coverImage="https://picsum.photos/800/300?random=cover"
          topInset={0}
        />
        <ProfileInfo
          userName={userName}
          userCategory="Artista Visual"
          userLocation="Madrid, España"
          avatarLetter={avatarLetter}
          stats={{ works: 47, rating: 4.8, followers: 1200, visits: '2.3k' }}
        />

        {/* Section tabs */}
        <View style={styles.tabsContainer}>
          {SECTION_TABS.map((tab) => (
            <Pressable
              key={tab.id}
              style={[
                styles.tab,
                activeSection === tab.id && styles.tabActive,
              ]}
              onPress={() => setActiveSection(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeSection === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Active section content */}
        {renderSection()}

        {/* Bottom actions (settings, privacy, help, logout) */}
        <BottomActions onLogoutPress={handleLogout} />

        <View style={{ height: 96 }} />
      </ScrollView>

      {/* Gallery fullscreen modal */}
      <GalleryModal
        visible={galleryModalVisible}
        images={MOCK_GALLERY_IMAGES}
        selectedIndex={selectedImageIndex}
        topInset={insets.top}
        onClose={() => setGalleryModalVisible(false)}
        onPrevious={() =>
          setSelectedImageIndex((i) =>
            i > 0 ? i - 1 : MOCK_GALLERY_IMAGES.length - 1
          )
        }
        onNext={() =>
          setSelectedImageIndex((i) =>
            i < MOCK_GALLERY_IMAGES.length - 1 ? i + 1 : 0
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
