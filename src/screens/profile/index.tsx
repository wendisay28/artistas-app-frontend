// src/screens/profile/index.tsx — Pantalla de perfil moderna
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../../services/firebase/config';
import { signOutUser } from '../../services/firebase/auth';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import TopBar from '../../components/shared/TopBar';
import { Ionicons } from '@expo/vector-icons';

// ── Profile components modernos
import { ProfileHero } from './components/header/Profilehero';
import { ProfileIdentity } from './components/header/Profileidentity';
import { ProfileSkeleton } from './components/header/ProfileSkeleton';
import { TabBar } from './components/shared/TabBar';
import { BioModal } from './components/modals/BioModal';
import { PortfolioSection } from './components/sections/PortfolioSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { SobreMiSection } from './components/sections/SobremiSection';
import { EventosSection } from './components/sections/Eventossection';
import { AgendaSection } from './components/sections/Agendasection';
import { TiendaSection } from './components/sections/TiendaSection';

// ── Profile modals
import {
  EditHeaderModal,
  EditServiceModal,
  EditProductModal,
  EditEventModal,
  SocialLinksModal,
} from './components/modals';
import { InfoProfesionalModal } from './components/modals/InfoProfesionalModal';
import { ExperienceModal } from './components/modals/ExperienceModal';
import { StudiesModal } from './components/modals/StudiesModal';
import { CategoryModal } from './components/modals/CategoryModal';
import { CompanyModal } from './components/modals/CompanyModal';

// ── Types
import { Artist, TabItem, LiveRequest } from './components/types';
import { GalleryItem, FeaturedItem } from '../../services/api/portfolio';
import { Service as APIService } from '../../services/api/services';
import { Review as BackendReview } from '../../services/api/reviews';
import { Colors } from '../../theme/colors';
import { servicesService } from '../../services/api/services';
import { portfolioService } from '../../services/api/portfolio';
import { reviewsService } from '../../services/api/reviews';
import { eventsService } from '../../services/api/events';
import { productsService } from '../../services/api/products';

// Tipo combinado para reseñas (compatible con componente y backend)
type Review = {
  id: string;
  reviewerName: string;
  reviewerEmoji: string;
  reviewerAvatarGradient: [string, string];
  serviceName: string;
  stars: number;
  text: string;
  date: string;
};

// ── Helper para mapear reseñas del backend al formato del componente
const mapBackendReviewToComponent = (backendReview: BackendReview): Review => ({
  id: backendReview.id?.toString() || '',
  reviewerName: backendReview.reviewerName || 'Anónimo',
  reviewerEmoji: '👤',
  reviewerAvatarGradient: ['#FF6B6B', '#4ECDC4'],
  serviceName: backendReview.serviceName || 'Servicio',
  stars: backendReview.rating || 5,
  text: backendReview.text || '',
  date: backendReview.createdAt ? new Date(backendReview.createdAt).toLocaleDateString('es', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }) : 'Reciente',
});

// ── Mock Data (temporal hasta conectar reseñas)
// NOTA: Las reseñas ya se cargan desde backend, esto se puede eliminar

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
    saveCoverImage,
    setArtistData,
  } = useProfileStore();

  const [activeMainTab,    setActiveMainTab]    = useState<string>('sobre');
  const [viewingAsClient,  setViewingAsClient]  = useState(false);

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

  // Forzar recarga cada 30 segundos para actualizar datos
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('[ProfileScreen] Forzando recarga de perfil...');
      loadProfile(
        firebaseUser?.uid,
        firebaseUser?.photoURL,
        firebaseUser?.displayName,
      ).catch((e) => {
        console.warn('[ProfileScreen] Error en recarga:', e?.message);
      });
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  // ── Fallback: si no hay datos en el store, construir desde Firebase
  const effectiveArtist: Artist = artistData ?? {
    id: firebaseUser?.uid ?? '1',
    name: artistData?.name ?? firebaseUser?.displayName ?? firebaseUser?.email?.split('@')[0] ?? 'Artista',
    handle: artistData?.handle ?? `@${(firebaseUser?.displayName ?? firebaseUser?.email?.split('@')[0] ?? 'artista').toLowerCase().replace(/\s+/g, '_')}`,
    location: artistData?.location ?? '',
    avatar: artistData?.avatar ?? firebaseUser?.photoURL ?? '',
    isVerified: artistData?.isVerified ?? false,
    isOnline: artistData?.isOnline ?? true,
    schedule: artistData?.schedule ?? '',
    bio: artistData?.bio ?? '',
    description: artistData?.description ?? '',
    tags: artistData?.tags ?? [],
    stats: artistData?.stats ?? [
      { value: '0', label: 'Obras' },
      { value: '5.0', label: 'Rating' },
      { value: '0', label: 'Seguidores' },
      { value: '0', label: 'Visitas' },
    ],
    socialLinks: artistData?.socialLinks ?? [],
    info: artistData?.info ?? [],
    isOwner: artistData?.isOwner ?? true,
    role: artistData?.role ?? '',
    userType: artistData?.userType ?? 'artist',
  };

  // Debug: verificar qué nombre se está usando (se ejecuta en cada render)
  React.useEffect(() => {
    console.log('[ProfileScreen] Nombre a mostrar:', effectiveArtist.name);
    console.log('[ProfileScreen] ArtistData completo:', artistData);
    console.log('[ProfileScreen] Firebase user:', firebaseUser?.displayName);
  }, [effectiveArtist.name, artistData]);

  // Debug adicional para forzar re-render si hay cambios
  React.useEffect(() => {
    console.log('[ProfileScreen] Render de ProfileScreen - nombre:', effectiveArtist.name);
  });

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

  // ── Cargar datos reales desde backend
  const [services, setServices] = useState<APIService[]>([]);
  const [portfolio, setPortfolio] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<FeaturedItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [calendarDays, setCalendarDays] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);

  // Cargar servicios, portafolio y reseñas al montar
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Cargar servicios
        const servicesData = await servicesService.getMyServices();
        setServices(servicesData);

        // Cargar portafolio
        const portfolioData = await portfolioService.getMyPortfolio();
        setPortfolio(portfolioData.photos);
        setVideos(portfolioData.videos);

        // Cargar reseñas
        const reviewsData = await reviewsService.getMyReviews();
        const mappedReviews = reviewsData.reviews.map(mapBackendReviewToComponent);
        setReviews(mappedReviews);

        // Cargar productos
        const productsData = await productsService.getMyProducts();
        setProducts(productsData);

        // Cargar eventos
        const eventsData = await eventsService.getMyEvents();
        setEvents(eventsData);

        // TODO: Cargar calendarDays y schedule cuando estén listos los servicios
      } catch (error: any) {
        // 401/404 = backend no tiene el perfil aún (usuario nuevo) — silenciar
        const status = error?.response?.status;
        if (status !== 401 && status !== 404) {
          console.warn('Error loading profile data:', error);
        }
      }
    };

    loadProfileData();
  }, []);

  // ── Mock data (temporal hasta conectar reseñas)
// NOTA: Las reseñas ya se cargan desde backend, esto se puede eliminar

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

  // ── Share handler
  const handleShare = useCallback(async () => {
    const handle = effectiveArtist.handle?.replace('@', '') ?? '';
    const name   = effectiveArtist.name ?? '';
    try {
      await Share.share({
        title:   `Perfil de ${name} en BuscArt`,
        message: `Mira el perfil de ${name} en BuscArt 🎨\n@${handle}`,
      });
    } catch {
      // el usuario canceló
    }
  }, [effectiveArtist.handle, effectiveArtist.name]);

  // ── Ver como cliente
  const handleViewAsClient  = useCallback(() => setViewingAsClient(true),  []);
  const handleExitClientView = useCallback(() => setViewingAsClient(false), []);

  // ── Modal handlers
  const handleEditProfile   = useCallback(() => setEditHeaderModalVisible(true), []);
  
  const handleEditAvatar = useCallback(async () => {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permiso requerido', 'Necesitas dar permiso para acceder a tus fotos.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await saveAvatar(result.assets[0].uri);
        Alert.alert('Éxito', 'Foto de perfil actualizada correctamente.');
      }
    } catch (error) {
      console.error('Error al actualizar avatar:', error);
      Alert.alert('Error', 'No se pudo actualizar tu foto de perfil.');
    }
  }, [saveAvatar]);

  const handleEditCover = useCallback(async () => {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permiso requerido', 'Necesitas dar permiso para acceder a tus fotos.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await saveCoverImage(result.assets[0].uri);
        Alert.alert('Éxito', 'Imagen de portada actualizada correctamente.');
      }
    } catch (error) {
      console.error('Error al actualizar cover:', error);
      Alert.alert('Error', 'No se pudo actualizar tu imagen de portada.');
    }
  }, []);

  const handleEditProInfo   = useCallback(() => setInfoProfesionalModalVisible(true), []);
  const handleEditExperience = useCallback(() => setExperienceModalVisible(true), []);
  const handleEditStudies   = useCallback(() => setStudiesModalVisible(true), []);
  const handleEditCategory  = useCallback(() => setCategoryModalVisible(true), []);
  const handleEditSocialLinks = useCallback(() => setSocialLinksModalVisible(true), []);
  const handleEditSobreMi   = useCallback(() => setBioModalVisible(true), []);
  const handleAddService    = useCallback(async (serviceData: any) => {
    try {
      const newService = await servicesService.createService(serviceData);
      setServices(prev => [...prev, newService]);
      setEditServiceModalVisible(false);
      Alert.alert('Éxito', 'Servicio creado correctamente.');
    } catch (error) {
      console.error('Error creating service:', error);
      Alert.alert('Error', 'No se pudo crear el servicio.');
    }
  }, []);

  const handleAddProduct    = useCallback(async (productData: any) => {
    try {
      const newProduct = await productsService.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      setEditProductModalVisible(false);
      Alert.alert('Éxito', 'Producto creado correctamente.');
    } catch (error) {
      console.error('Error creating product:', error);
      Alert.alert('Error', 'No se pudo crear el producto.');
    }
  }, []);

  const handleAddEvent      = useCallback(async (eventData: any) => {
    try {
      const newEvent = await eventsService.createEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      setEditEventModalVisible(false);
      Alert.alert('Éxito', 'Evento creado correctamente.');
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'No se pudo crear el evento.');
    }
  }, []);

  // ── Modal save handlers — conectados al backend vía profileStore

  const handleSaveHeader = useCallback(async (data: any) => {
    console.log('[ProfileScreen] Guardando header:', data);
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
      Alert.alert('Éxito', 'Perfil actualizado correctamente.');
      console.log('[ProfileScreen] Header guardado exitosamente');
    } catch (error) {
      console.error('[ProfileScreen] Error guardando header:', error);
      Alert.alert('Error', 'No se pudo guardar el perfil. Revisa tu conexión.');
    }
  }, [saveHeader]);

  const handleSaveBio = useCallback(async (description: string) => {
    // "Acerca de mí" guarda en `description` (texto largo), no en `bio` (resumen corto del header)
    setArtistData({ description });
    setBioModalVisible(false);
  }, [setArtistData]);

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
              services={services}
              portfolio={portfolio}
              videos={videos}
              reviews={reviews}
              onEditBio={handleEditSobreMi}
              onEditProInfo={handleEditProInfo}
              onEditExperience={handleEditExperience}
              onEditStudies={handleEditStudies}
              onEditCategory={handleEditCategory}
              onEditSocialLinks={handleEditSocialLinks}
              onServicesUpdated={() => {
                // Recargar servicios cuando se actualicen
                servicesService.getMyServices().then(setServices);
              }}
              onPortfolioUpdated={() => {
                // Recargar portafolio cuando se actualice
                portfolioService.getMyPortfolio().then(data => {
                  setPortfolio(data.photos);
                  setVideos(data.videos);
                });
              }}
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
                  color={effectiveArtist.userType === 'company' ? '#1E40AF' : Colors.textMuted}
                />
                <Text style={styles.companyConvertText}>
                  {effectiveArtist.userType === 'company' ? 'Gestionar perfil de empresa' : 'Convertir a perfil de empresa'}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </>
        );
      case 'tienda':
        return <TiendaSection products={products} isOwner={true} />;
      case 'eventos':
        return <EventosSection events={events} isOwner={true} />;
      case 'agenda':
        return (
          <AgendaSection
            liveRequest={undefined} // Sin live requests por ahora
            calendarDays={calendarDays}
            schedule={schedule}
            isOwner={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.root}>
      <TopBar title={effectiveArtist.handle?.replace('@', '') ?? effectiveArtist.name} topInset={insets.top} usernameMode={true} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Loading skeleton mientras carga el perfil por primera vez */}
        {isLoading && !artistData ? (
          <ProfileSkeleton />
        ) : (
          <>
            {/* Indicador de guardado */}
            {isSaving && (
              <View style={styles.savingBanner}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.savingText}>Guardando...</Text>
              </View>
            )}

            <ProfileHero
              coverImage={effectiveArtist.coverImage ?? 'https://picsum.photos/800/300?random=cover'}
              isOwner={true}
              onEditCover={handleEditCover}
            />

            {/* Banner "vista de cliente" */}
            {viewingAsClient && (
              <View style={styles.clientViewBanner}>
                <Ionicons name="eye-outline" size={14} color="#7c3aed" />
                <Text style={styles.clientViewText}>Vista de cliente</Text>
                <TouchableOpacity onPress={handleExitClientView} style={styles.clientViewClose}>
                  <Ionicons name="close" size={14} color="#7c3aed" />
                  <Text style={styles.clientViewCloseText}>Salir</Text>
                </TouchableOpacity>
              </View>
            )}

            <ProfileIdentity
              artist={viewingAsClient ? { ...effectiveArtist, isOwner: false } : effectiveArtist}
              onEditProfile={viewingAsClient ? undefined : handleEditProfile}
              onEditAvatar={viewingAsClient ? undefined : handleEditAvatar}
              onShare={handleShare}
              onViewAsClient={handleViewAsClient}
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
          </>
        )}

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
    color: Colors.textMuted,
  },
  clientViewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(124,58,237,0.12)',
  },
  clientViewText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
  },
  clientViewClose: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.1)',
  },
  clientViewCloseText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
  },
});
