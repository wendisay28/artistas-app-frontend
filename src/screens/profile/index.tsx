// src/screens/profile/index.tsx — Pantalla de perfil moderna
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth } from '../../services/firebase/config';
import { signOutUser } from '../../services/firebase/auth';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import TopBar from '../../components/shared/TopBar';
import { Ionicons } from '@expo/vector-icons';

// ── Profile components modernos
import { ProfileHero } from '../../components/profile/header/Profilehero';
import { ProfileIdentity } from '../../components/profile/header/Profileidentity';
import { TabBar } from '../../components/profile/shared/TabBar';
import { BioModal } from '../../components/profile/modals/BioModal';
import { PortfolioSection } from '../../components/profile/sections/PortfolioSection';
import { ServicesSection } from '../../components/profile/sections/ServicesSection';
import { SobreMiSection } from '../../components/profile/sections/SobremiSection';
import { EventosSection } from '../../components/profile/sections/Eventossection';
import { AgendaSection } from '../../components/profile/sections/Agendasection';
import { TiendaSection } from '../../components/profile/sections/TiendaSection';

// ── Profile modals
import {
  EditHeaderModal,
  EditServiceModal,
  EditProductModal,
  EditEventModal,
  SocialLinksModal,
} from '../../components/profile/modals';
import { InfoProfesionalModal } from '../../components/profile/modals/InfoProfesionalModal';
import { ExperienceModal } from '../../components/profile/modals/ExperienceModal';
import { StudiesModal } from '../../components/profile/modals/StudiesModal';
import { CategoryModal } from '../../components/profile/modals/CategoryModal';
import { CompanyModal } from '../../components/profile/modals/CompanyModal';

// ── Types
import { Artist, TabItem, LiveRequest, Review } from '../../components/profile/types';
import { GalleryItem, FeaturedItem } from '../../services/api/portfolio';
import { Service as APIService } from '../../services/api/services';
import { Colors } from '../../theme';

// ── Mock Data
const mockReviews: Review[] = [
  {
    id: '1',
    reviewerName: 'María González',
    reviewerEmoji: '👩‍🎨',
    reviewerAvatarGradient: ['#FF6B6B', '#4ECDC4'],
    serviceName: 'Sesión de Retratos',
    stars: 5,
    text: 'Increíble experiencia! María capturó momentos perfectos con una sensibilidad artística única.',
    date: 'Hace 2 días'
  },
  {
    id: '2',
    reviewerName: 'Carlos Rodríguez',
    reviewerEmoji: '👨‍💼',
    reviewerAvatarGradient: ['#45B7D1', '#96CEB4'],
    serviceName: 'Fotografía de Producto',
    stars: 4,
    text: 'Muy profesional y creativa. Las fotos de mis productos quedaron espectaculares.',
    date: 'Hace 1 semana'
  },
];

// ── Configuración de tabs
const MAIN_TABS: TabItem[] = [
  { key: 'sobre', label: 'Sobre mí', icon: 'person-outline' },
  { key: 'tienda', label: 'Tienda', icon: 'storefront-outline' },
  { key: 'eventos', label: 'Eventos', icon: 'calendar-outline' },
  { key: 'agenda', label: 'Agenda', icon: 'time-outline' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const logout = useAuthStore((s) => s.logout);
  const firebaseUser = auth.currentUser;

  // ── Profile store (datos persistidos + backend)
  const {
    artistData,
    isLoading,
    isSaving,
    loadProfile,
    saveHeader,
    saveBio,
    saveProInfo,
    saveStudies,
    saveExperience,
    saveSocialLinks,
    saveAvatar,
  } = useProfileStore();

  const [activeMainTab, setActiveMainTab] = useState<string>('sobre');

  // ── Modals state
  const [editHeaderModalVisible,    setEditHeaderModalVisible]    = useState(false);
  const [bioModalVisible,           setBioModalVisible]           = useState(false);
  const [editServiceModalVisible,   setEditServiceModalVisible]   = useState(false);
  const [editProductModalVisible,   setEditProductModalVisible]   = useState(false);
  const [editEventModalVisible,     setEditEventModalVisible]     = useState(false);
  const [infoProfesionalModalVisible, setInfoProfesionalModalVisible] = useState(false);
  const [experienceModalVisible,    setExperienceModalVisible]    = useState(false);
  const [studiesModalVisible,       setStudiesModalVisible]       = useState(false);
  const [categoryModalVisible,      setCategoryModalVisible]      = useState(false);
  const [socialLinksModalVisible,   setSocialLinksModalVisible]   = useState(false);
  const [companyModalVisible,       setCompanyModalVisible]       = useState(false);

  // ── Cargar perfil desde el backend al montar
  useEffect(() => {
    loadProfile(
      firebaseUser?.uid,
      firebaseUser?.photoURL,
      firebaseUser?.displayName,
    ).catch((e) => {
      console.warn('[ProfileScreen] No se pudo cargar el perfil del backend:', e?.message);
    });
  }, []);

  // ── Fallback: si no hay datos en el store, construir desde Firebase
  const effectiveArtist: Artist = artistData ?? {
    id: firebaseUser?.uid ?? '1',
    name: firebaseUser?.displayName ?? 'Artista',
    handle: `@${(firebaseUser?.displayName ?? 'artista').toLowerCase().replace(/\s+/g, '_')}`,
    location: '',
    avatar: firebaseUser?.photoURL ?? '',
    isVerified: false,
    isOnline: true,
    schedule: '',
    bio: '',
    description: '',
    tags: [],
    stats: [
      { value: '0', label: 'Obras' },
      { value: '5.0', label: 'Rating' },
      { value: '0', label: 'Seguidores' },
      { value: '0', label: 'Visitas' },
    ],
    socialLinks: [],
    info: [],
    isOwner: true,
    role: '',
    userType: 'artist',
  };

  // ── Memoized initial data para modales
  const infoProfesionalInitialData = React.useMemo(() => ({
    yearsExperience: effectiveArtist.info?.find(i => i.label === 'Experiencia')?.value || '',
    style:           effectiveArtist.info?.find(i => i.label === 'Estilo')?.value || '',
    availability:    effectiveArtist.info?.find(i => i.label === 'Disponibilidad')?.value || '',
    responseTime:    effectiveArtist.info?.find(i => i.label === 'Tiempo de resp.')?.value || '',
  }), [effectiveArtist.info]);

  const categoryInitialData = React.useMemo(() => ({
    category:  effectiveArtist.category,
    specialty: effectiveArtist.specialty || '',
    niche:     effectiveArtist.niche || '',
  }), [effectiveArtist.category, effectiveArtist.specialty, effectiveArtist.niche]);

  const experienceInitialData = React.useMemo(() =>
    effectiveArtist.workExperience || [],
    [effectiveArtist.workExperience]
  );

  const studiesInitialData = React.useMemo(() =>
    effectiveArtist.studies || [],
    [effectiveArtist.studies]
  );

  const socialLinksInitialData = React.useMemo(() => {
    const getUrl = (label: string) =>
      effectiveArtist.info?.find(i => i.label.toLowerCase() === label.toLowerCase())?.value ?? '';

    const extractHandle = (url: string, domain: string) => {
      if (!url) return '';
      if (url.includes(`${domain}/`)) return url.split(`${domain}/`)[1].replace('@', '');
      return url.replace('@', '');
    };

    const ig  = getUrl('Instagram');
    const tw  = getUrl('Twitter') || getUrl('x');
    const yt  = getUrl('YouTube');
    const sp  = getUrl('Spotify');

    return {
      instagram: extractHandle(ig, 'instagram.com'),
      x:         extractHandle(tw, 'twitter.com'),
      youtube:   extractHandle(yt, 'youtube.com/@'),
      spotify:   extractHandle(sp, 'open.spotify.com/artist'),
    };
  }, [effectiveArtist.info]);

  // ── Mock data (temporal hasta conectar servicios/portafolio)
  const mockServices: APIService[] = [];
  const mockPortfolio: GalleryItem[] = [];
  const mockVideos: FeaturedItem[] = [];
  const mockLiveRequest: LiveRequest = {
    id: '1',
    title: 'Solicitud de sesión',
    description: 'Cliente interesado en sesión de fotos',
    offerAmount: '$150',
    currency: 'COP',
    secondsRemaining: 3600,
  };

  // ── Handlers
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

  // ── Modal handlers
  const handleEditProfile   = useCallback(() => setEditHeaderModalVisible(true), []);
  const handleEditAvatar    = useCallback(async () => {
    // TODO: abrir image picker y llamar saveAvatar(url)
    console.log('Edit avatar');
  }, []);
  const handleEditProInfo   = useCallback(() => setInfoProfesionalModalVisible(true), []);
  const handleEditExperience = useCallback(() => setExperienceModalVisible(true), []);
  const handleEditStudies   = useCallback(() => setStudiesModalVisible(true), []);
  const handleEditCategory  = useCallback(() => setCategoryModalVisible(true), []);
  const handleEditSocialLinks = useCallback(() => setSocialLinksModalVisible(true), []);
  const handleEditSobreMi   = useCallback(() => setBioModalVisible(true), []);
  const handleAddService    = useCallback(() => setEditServiceModalVisible(true), []);
  const handleAddProduct    = useCallback(() => setEditProductModalVisible(true), []);
  const handleAddEvent      = useCallback(() => setEditEventModalVisible(true), []);

  // ── Modal save handlers — conectados al backend vía profileStore

  const handleSaveHeader = useCallback(async (data: any) => {
    try {
      await saveHeader({
        name:     data.name,
        handle:   data.handle.replace(/^@/, ''),
        role:     data.role,
        location: data.location,
        schedule: data.schedule,
        bio:      data.bio,
        tags:     data.tags as [string, string, string],
      });
      setEditHeaderModalVisible(false);
    } catch {
      Alert.alert('Error', 'No se pudo guardar el encabezado. Revisa tu conexión.');
    }
  }, [saveHeader]);

  const handleSaveBio = useCallback(async (bio: string) => {
    try {
      await saveBio(bio);
      setBioModalVisible(false);
    } catch {
      Alert.alert('Error', 'No se pudo guardar la descripción. Revisa tu conexión.');
    }
  }, [saveBio]);

  const handleSaveProInfo = useCallback(async (data: any) => {
    try {
      await saveProInfo({
        yearsExperience: data.yearsExperience,
        style:           data.style,
        availability:    data.availability,
        responseTime:    data.responseTime,
      });
      setInfoProfesionalModalVisible(false);
    } catch {
      Alert.alert('Error', 'No se pudo guardar la información profesional.');
    }
  }, [saveProInfo]);

  const handleSaveExperience = useCallback(async (experience: any[]) => {
    try {
      await saveExperience(experience);
      setExperienceModalVisible(false);
    } catch {
      Alert.alert('Error', 'No se pudo guardar la experiencia laboral.');
    }
  }, [saveExperience]);

  const handleSaveStudies = useCallback(async (studies: any[]) => {
    try {
      await saveStudies(studies);
      setStudiesModalVisible(false);
    } catch {
      Alert.alert('Error', 'No se pudo guardar los estudios.');
    }
  }, [saveStudies]);

  const handleSaveCategory = useCallback((data: any) => {
    // Categoría: por ahora solo actualiza local (requiere endpoint específico)
    useProfileStore.getState().setArtistData({
      category:  data.category,
      specialty: data.specialty,
      niche:     data.niche,
    });
    setCategoryModalVisible(false);
  }, []);

  const handleSaveSocialLinks = useCallback((data: any) => {
    saveSocialLinks(data);
    setSocialLinksModalVisible(false);
  }, [saveSocialLinks]);

  const handleConvertToCompany = useCallback(async (data: { companyName: string; companyDescription: string; taxId: string }) => {
    try {
      await useProfileStore.getState().convertToCompany({
        companyName: data.companyName,
        companyDescription: data.companyDescription,
        taxId: data.taxId,
      });
      setCompanyModalVisible(false);
    } catch {
      Alert.alert('Error', 'No se pudo convertir el perfil a empresa. Revisa tu conexión.');
    }
  }, []);

  // ── Render de contenido según tab activa
  const renderContent = () => {
    switch (activeMainTab) {
      case 'sobre':
        return (
          <>
            <SobreMiSection
              artist={effectiveArtist}
              services={mockServices}
              portfolio={mockPortfolio}
              videos={mockVideos}
              reviews={mockReviews}
              onEditBio={handleEditSobreMi}
              onEditProInfo={handleEditProInfo}
              onEditExperience={handleEditExperience}
              onEditStudies={handleEditStudies}
              onEditCategory={handleEditCategory}
              onEditSocialLinks={handleEditSocialLinks}
            />
            {/* Opción de convertir a empresa */}
            {effectiveArtist.isOwner && (
              <TouchableOpacity
                style={styles.companyConvertBtn}
                onPress={() => setCompanyModalVisible(true)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={effectiveArtist.userType === 'company' ? 'business' : 'business-outline'}
                  size={18}
                  color={effectiveArtist.userType === 'company' ? '#1E40AF' : Colors.text2}
                />
                <Text style={styles.companyConvertText}>
                  {effectiveArtist.userType === 'company' ? 'Gestionar perfil de empresa' : 'Convertir a perfil de empresa'}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.text3} />
              </TouchableOpacity>
            )}
          </>
        );
      case 'tienda':
        return <TiendaSection products={[]} isOwner={true} />;
      case 'eventos':
        return <EventosSection events={[]} isOwner={true} />;
      case 'agenda':
        return (
          <AgendaSection
            liveRequest={mockLiveRequest}
            calendarDays={[]}
            schedule={[]}
            isOwner={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.root}>
      <TopBar
        title={effectiveArtist.handle}
        topInset={insets.top}
        usernameMode
      />

      {/* Indicador de guardado */}
      {isSaving && (
        <View style={styles.savingBanner}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.savingText}>Guardando...</Text>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Loading overlay mientras carga el perfil por primera vez */}
        {isLoading && !artistData && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}

        <ProfileHero
          coverImage={effectiveArtist.coverImage ?? 'https://picsum.photos/800/300?random=cover'}
          isOwner={true}
        />

        <ProfileIdentity
          artist={effectiveArtist}
          onEditProfile={handleEditProfile}
          onEditAvatar={handleEditAvatar}
        />

        <View style={styles.mainTabsContainer}>
          <TabBar
            tabs={MAIN_TABS}
            active={activeMainTab}
            onSelect={setActiveMainTab}
          />
        </View>

        <View style={styles.content}>
          {renderContent()}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── Modals ── */}
      <EditHeaderModal
        visible={editHeaderModalVisible}
        artist={effectiveArtist}
        onClose={() => setEditHeaderModalVisible(false)}
        onSave={handleSaveHeader}
      />

      <BioModal
        visible={bioModalVisible}
        initialValue={effectiveArtist.description ?? effectiveArtist.bio ?? ''}
        onClose={() => setBioModalVisible(false)}
        onSave={handleSaveBio}
      />

      <EditServiceModal
        visible={editServiceModalVisible}
        onClose={() => setEditServiceModalVisible(false)}
        onSave={handleAddService}
      />

      <EditProductModal
        visible={editProductModalVisible}
        onClose={() => setEditProductModalVisible(false)}
        onSave={handleAddProduct}
      />

      <EditEventModal
        visible={editEventModalVisible}
        onClose={() => setEditEventModalVisible(false)}
        onSave={handleAddEvent}
      />

      <InfoProfesionalModal
        visible={infoProfesionalModalVisible}
        initialData={infoProfesionalInitialData}
        onClose={() => setInfoProfesionalModalVisible(false)}
        onSave={handleSaveProInfo}
      />

      <ExperienceModal
        visible={experienceModalVisible}
        initialExperience={experienceInitialData}
        onClose={() => setExperienceModalVisible(false)}
        onSave={handleSaveExperience}
      />

      <StudiesModal
        visible={studiesModalVisible}
        initialStudies={studiesInitialData}
        onClose={() => setStudiesModalVisible(false)}
        onSave={handleSaveStudies}
      />

      <CategoryModal
        visible={categoryModalVisible}
        initialData={categoryInitialData}
        onClose={() => setCategoryModalVisible(false)}
        onSave={handleSaveCategory}
      />

      <SocialLinksModal
        visible={socialLinksModalVisible}
        initialData={socialLinksInitialData}
        onClose={() => setSocialLinksModalVisible(false)}
        onSave={handleSaveSocialLinks}
      />

      <CompanyModal
        visible={companyModalVisible}
        artist={effectiveArtist}
        onClose={() => setCompanyModalVisible(false)}
        onSave={handleConvertToCompany}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scroll: {
    flex: 1,
  },
  loadingContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#EEF2FF',
    borderBottomWidth: 1,
    borderBottomColor: '#C7D2FE',
  },
  savingText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.primary,
  },
  mainTabsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bottomSpacer: {
    height: 100,
  },
  companyConvertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  companyConvertText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.text2,
  },
});
