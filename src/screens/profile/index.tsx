// src/screens/profile/index.tsx — Pantalla de perfil moderna
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Share, Modal, Animated, PanResponder, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { auth } from '../../services/firebase/config';
import { signOutUser } from '../../services/firebase/auth';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { uploadToServer } from '../../hooks/useProfileImageUpload';
import { ProfileMoreMenu } from './components/header/ProfileMoreMenu';
import { useThemeStore } from '../../store/themeStore';
import { useModalStore } from '../../store/modalStore';
import TopBar from '../../components/shared/TopBar';
import { AppFooter } from '../../components/shared/AppFooter';
import { ModalContainer } from '../../components/ModalContainer';
import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
// ── Profile components modernos
import { ProfileHero } from './components/header/ProfileHero';
import { ProfileIdentity } from './components/header/Profileidentity';
import { ProfileSkeleton } from './components/header/ProfileSkeleton';
import { TabBar } from './components/shared/TabBar';
// BioModal ahora está en ModalContainer
import { SobreMiSection } from './components/sections/SobremiSection';
import { EventosSection } from './components/sections/eventos/Eventossection';
import { AgendaSectionFunctional } from './components/sections/agenda/AgendaSectionFunctional';
import { TiendaSectionRefactored as TiendaSection } from './components/sections/tienda/TiendaSectionRefactored';

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
import { updateArtistProfile } from '../../services/api/profile';

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
  const navigation = useNavigation();
  const logout = useAuthStore((s) => s.logout);
  const firebaseUser = auth.currentUser;

  // ── Profile store (datos persistidos + backend)
  const {
    artistData,
    isLoading,
    isSaving,
    loadProfile,
    saveHeader,
    saveProInfo,
    saveStudies,
    saveExperience,
    saveSocialLinks,
    saveAvatar,
    saveCoverImage,
    saveDescription,
    setArtistData,
    setContentFlags,
  } = useProfileStore();

  // ModalStore para modales globales
  const { 
    openAcercaDeMiModal, closeAcercaDeMiModal, 
    openExperienceModal, closeExperienceModal, 
    openEditServiceModal, closeEditServiceModal,
    openSocialLinksModal, closeSocialLinksModal,
    openStudiesModal, closeStudiesModal,
    openCategoryModal, closeCategoryModal,
    openInfoProfesionalModal, closeInfoProfesionalModal,
    openEditHeaderModal, closeEditHeaderModal,
    openEditProductModal, closeEditProductModal,
    openEditEventModal, closeEditEventModal,
    openCompanyModal, closeCompanyModal,
    openVideoModal, closeVideoModal
  } = useModalStore();

  const [activeMainTab,       setActiveMainTab]       = useState<string>('sobre');
  const [viewingAsClient,     setViewingAsClient]     = useState(false);
  const [pendingCoverAsset,   setPendingCoverAsset]   = useState<{ uri: string; width: number; height: number } | null>(null);
  const [uploadingCover,      setUploadingCover]      = useState(false);
  const [showMoreMenu,        setShowMoreMenu]        = useState(false);
  const { toggleTheme, isDark } = useThemeStore();

  // ── Interactive cover crop ──────────────────────────────────────────
  const panAnim    = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const panRef     = useRef({ x: 0, y: 0 });
  const limitsRef  = useRef({ maxX: 0, maxY: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderMove: (_, g) => {
        const x = Math.max(-limitsRef.current.maxX, Math.min(limitsRef.current.maxX, panRef.current.x + g.dx));
        const y = Math.max(-limitsRef.current.maxY, Math.min(limitsRef.current.maxY, panRef.current.y + g.dy));
        panAnim.setValue({ x, y });
      },
      onPanResponderRelease: (_, g) => {
        const x = Math.max(-limitsRef.current.maxX, Math.min(limitsRef.current.maxX, panRef.current.x + g.dx));
        const y = Math.max(-limitsRef.current.maxY, Math.min(limitsRef.current.maxY, panRef.current.y + g.dy));
        panRef.current = { x, y };
        panAnim.setValue({ x, y });
      },
    })
  ).current;


  // ── Modals state (solo los que no están en modalStore)
  // bioModal, experienceModal, editServiceModal, socialLinksModal, studiesModal, categoryModal, infoProfesionalModal, editHeaderModal, editProductModal, editEventModal, companyModal y videoModal ahora se manejan con modalStore

  // ── Cargar perfil desde el backend al montar
  useEffect(() => {
    loadProfile(
      firebaseUser?.uid,
      firebaseUser?.photoURL,
      firebaseUser?.displayName,
    ).catch((e) => {
      // Silenciar error de carga de perfil
    });
  }, []);


  // Resetear pan y calcular límites cuando se selecciona una nueva imagen
  useEffect(() => {
    if (!pendingCoverAsset) return;
    const CROP_W = Dimensions.get('window').width - 48;
    const CROP_H = CROP_W * (5 / 16);
    const scale  = Math.max(CROP_W / pendingCoverAsset.width, CROP_H / pendingCoverAsset.height);
    limitsRef.current = {
      maxX: Math.max(0, (pendingCoverAsset.width  * scale - CROP_W) / 2),
      maxY: Math.max(0, (pendingCoverAsset.height * scale - CROP_H) / 2),
    };
    panRef.current = { x: 0, y: 0 };
    panAnim.setValue({ x: 0, y: 0 });
  }, [pendingCoverAsset]);

  // ── Fallback: si no hay datos en el store, construir desde Firebase
  const effectiveArtist: Artist = React.useMemo(() => {
    try {
      const baseArtist = artistData || {} as Partial<Artist>;
      return {
        id: baseArtist.id ?? firebaseUser?.uid ?? '1',
        name: baseArtist.name ?? firebaseUser?.displayName ?? firebaseUser?.email?.split('@')[0] ?? 'Artista',
        handle: baseArtist.handle ?? `@${(firebaseUser?.displayName ?? firebaseUser?.email?.split('@')[0] ?? 'artista').toLowerCase().replace(/\s+/g, '_')}`,
        location: baseArtist.location ?? '',
        avatar: baseArtist.avatar ?? firebaseUser?.photoURL ?? '',
        coverImage: baseArtist.coverImage,
        isVerified: baseArtist.isVerified ?? false,
        isOnline: baseArtist.isOnline ?? true,
        schedule: baseArtist.schedule ?? '',
        bio: baseArtist.bio ?? '',
        description: baseArtist.description ?? '',
        tags: Array.isArray(baseArtist.tags) ? baseArtist.tags : [],
        stats: Array.isArray(baseArtist.stats) ? baseArtist.stats : [
          { value: '0', label: 'Obras' },
          { value: '5.0', label: 'Rating' },
          { value: '0', label: 'Seguidores' },
          { value: '0', label: 'Visitas' },
        ],
        socialLinks: Array.isArray(baseArtist.socialLinks) ? baseArtist.socialLinks : [],
        info: Array.isArray(baseArtist.info) ? baseArtist.info : [],
        isOwner: baseArtist.isOwner ?? true,
        role: baseArtist.role ?? '',
        userType: baseArtist.userType ?? 'artist',
        category: baseArtist.category,
        specialty: baseArtist.specialty ?? '',
        niche: baseArtist.niche ?? '',
        workExperience: Array.isArray(baseArtist.workExperience) ? baseArtist.workExperience : [],
        studies: Array.isArray(baseArtist.studies) ? baseArtist.studies : [],
        certifications: Array.isArray(baseArtist.certifications) ? baseArtist.certifications : [],
        yearsOfExperience: baseArtist.yearsOfExperience ?? 0,
      };
    } catch (error) {
      console.error('Error creating effectiveArtist:', error);
      // Return safe fallback
      return {
        id: firebaseUser?.uid ?? '1',
        name: firebaseUser?.displayName ?? 'Artista',
        handle: '@artista',
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
        category: undefined,
        specialty: '',
        niche: '',
        workExperience: [],
        studies: [],
        certifications: [],
        yearsOfExperience: 0,
      };
    }
  }, [artistData, firebaseUser]);

  // Debug: verificar qué nombre se está usando (se ejecuta en cada render)
  React.useEffect(() => {
    // Debug silenciado
  }, [effectiveArtist.name, artistData]);


  // ── Memoized initial data para modales
  const infoProfesionalInitialData = React.useMemo(() => ({
    yearsExperience: effectiveArtist.info?.find(i => i.label === 'Experiencia')?.value || '',
    style:           effectiveArtist.info?.find(i => i.label === 'Estilo')?.value || '',
    availability:    effectiveArtist.info?.find(i => i.label === 'Disponibilidad')?.value || '',
    responseTime:    effectiveArtist.info?.find(i => i.label === 'Horario')?.value || '',
    schedule:        effectiveArtist.info?.find(i => i.label === 'Horario')?.value || '',
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
    const tt  = getUrl('TikTok');
    const yt  = getUrl('YouTube');
    const sp  = getUrl('Spotify');

    return {
      instagram: extractHandle(ig, 'instagram.com'),
      tiktok:   extractHandle(tt, 'tiktok.com'),
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

  const reloadPortfolio = useCallback(async () => {
    try {
      const portfolioData = await portfolioService.getMyPortfolio();
      setPortfolio(portfolioData?.photos ?? []);
      setVideos(portfolioData?.videos ?? []);
      setContentFlags({ hasPortfolio: (portfolioData?.photos?.length ?? 0) > 0 });
    } catch (e) {
      console.warn('Error reloading portfolio:', e);
    }
  }, []);

  const reloadServices = useCallback(async () => {
    // Verificar si el usuario está autenticado
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn('Usuario no autenticado, omitiendo recarga de servicios');
      setServices([]);
      return;
    }

    try {
      const servicesData = await servicesService.getMyServices();
      setServices(servicesData || []);
      setContentFlags({ hasServices: (servicesData?.length ?? 0) > 0 });
    } catch (e) {
      setServices([]);
    }
  }, []);

  // Cargar servicios, portafolio y reseñas al montar
  useEffect(() => {
    const loadProfileData = async () => {
      // Verificar si el usuario está autenticado antes de cargar datos
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setServices([]);
        setPortfolio([]);
        setVideos([]);
        setReviews([]);
        return;
      }

      try {
        // Cargar servicios con manejo de error
        try {
          const servicesData = await servicesService.getMyServices();
          setServices(servicesData || []);
          setContentFlags({ hasServices: (servicesData?.length ?? 0) > 0 });
        } catch (e) {
          console.warn('Error loading services:', e);
          setServices([]);
        }

        // Cargar portafolio con manejo de error
        try {
          const portfolioData = await portfolioService.getMyPortfolio();
          setPortfolio(portfolioData?.photos ?? []);
          setVideos(portfolioData?.videos ?? []);
          setContentFlags({ hasPortfolio: (portfolioData?.photos?.length ?? 0) > 0 });
        } catch (e) {
          console.warn('Error loading portfolio:', e);
          setPortfolio([]);
          setVideos([]);
        }

        // Cargar reseñas con manejo de error
        try {
          const reviewsData = await reviewsService.getMyReviews();
          const mappedReviews = (reviewsData?.reviews || []).map(mapBackendReviewToComponent);
          setReviews(mappedReviews);
        } catch (e) {
          console.warn('Error loading reviews:', e);
          setReviews([]);
        }

        // Cargar productos con manejo de error
        try {
          const productsData = await productsService.getMyProducts();
          setProducts(productsData || []);
        } catch (e) {
          console.warn('Error loading products:', e);
          setProducts([]);
        }

        // Cargar eventos con manejo de error
        try {
          const eventsData = await eventsService.getMyEvents();
          setEvents(eventsData || []);
        } catch (e) {
          console.warn('Error loading events:', e);
          setEvents([]);
        }

        // TODO: Cargar calendarDays y schedule cuando estén listos los servicios
      } catch (error: any) {
        // Error general - solo loggear para no causar crash
        console.warn('General error loading profile data:', error);
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

  // ── Opciones del menú desplegable
  const menuItems = [
    {
      id: 'theme',
      label: 'Cambiar tema',
      icon: 'contrast-outline',
      onPress: toggleTheme,
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: 'settings-outline',
      onPress: () => navigation.navigate('Settings' as never),
    },
    {
      id: 'help',
      label: 'Ayuda',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('Help' as never),
    },
    {
      id: 'logout',
      label: 'Cerrar sesión',
      icon: 'log-out-outline',
      onPress: handleLogout,
      destructive: true,
    },
  ];

  // ── Handlers para menú desplegable
  const handleMoreOptions = useCallback(() => {
    setShowMoreMenu(true);
  }, []);
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
  const handleEditProfile   = useCallback(() => openEditHeaderModal(effectiveArtist), [effectiveArtist]);
  
  const handleEditAvatar = useCallback(async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permiso requerido', 'Necesitas dar permiso para acceder a tus fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // Previsualización inmediata con URI local
        setArtistData({ avatar: asset.uri });
        // Subir al servidor y guardar URL pública
        const publicUrl = await uploadToServer(asset.uri, 'avatars', asset.mimeType);
        await saveAvatar(publicUrl);
        Alert.alert('Éxito', 'Foto de perfil actualizada correctamente.');
      }
    } catch (error) {
      console.error('Error al actualizar avatar:', error);
      Alert.alert('Error', 'No se pudo actualizar tu foto de perfil.');
    }
  }, [saveAvatar, setArtistData]);

  const pickCoverImage = useCallback(async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permiso requerido', `Necesitas acceso a tu ${useCamera ? 'cámara' : 'galería'}.`);
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });

      if (result.canceled || !result.assets?.[0]) return;

      const { uri, width, height } = result.assets[0];
      setPendingCoverAsset({ uri, width, height });
    } catch (error) {
      console.error('pickCoverImage error:', error);
      Alert.alert('Error', 'No se pudo cargar la imagen.');
    }
  }, []);

  const confirmCoverImage = useCallback(async () => {
    if (!pendingCoverAsset) return;
    try {
      setUploadingCover(true);
      const CROP_W = Dimensions.get('window').width - 48;
      const CROP_H = CROP_W * (5 / 16);
      const { uri, width: imgW, height: imgH } = pendingCoverAsset;
      const scale  = Math.max(CROP_W / imgW, CROP_H / imgH);
      const dispW  = imgW * scale;
      const dispH  = imgH * scale;
      const dx = panRef.current.x;
      const dy = panRef.current.y;
      // Translate pan offset into image-space crop origin
      const originX = Math.max(0, Math.round((dispW / 2 - CROP_W / 2 - dx) / scale));
      const originY = Math.max(0, Math.round((dispH / 2 - CROP_H / 2 - dy) / scale));
      const cropW   = Math.min(Math.round(CROP_W / scale), imgW - originX);
      const cropH   = Math.min(Math.round(CROP_H / scale), imgH - originY);

      const ctx   = ImageManipulator.manipulate(uri);
      ctx.crop({ originX, originY, width: cropW, height: cropH });
      const img   = await ctx.renderAsync();
      const saved = await img.saveAsync({ compress: 0.85, format: SaveFormat.JPEG });

      setArtistData({ coverImage: saved.uri });
      const publicUrl = await uploadToServer(saved.uri, 'covers', 'image/jpeg');
      await saveCoverImage(publicUrl);
      setPendingCoverAsset(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudo subir la imagen de portada.');
    } finally {
      setUploadingCover(false);
    }
  }, [pendingCoverAsset, saveCoverImage, setArtistData]);

  // Presionar el ícono de cámara en la portada → Alert nativo con opciones de fuente
  // (no hay Modal personalizado → cero conflictos de animaciones en iOS)
  const handleEditCover = useCallback(() => {
    pickCoverImage(false);
  }, [pickCoverImage]);

  const handleEditProInfo   = useCallback(() => {
    openInfoProfesionalModal(infoProfesionalInitialData);
  }, [infoProfesionalInitialData, openInfoProfesionalModal]);
  const handleEditExperience = useCallback(() => {
    openExperienceModal(effectiveArtist.workExperience || []);
  }, [effectiveArtist.workExperience, openExperienceModal]);
  const handleEditStudies   = useCallback(() => {
    openStudiesModal(effectiveArtist.studies || []);
  }, [effectiveArtist.studies, openStudiesModal]);
  const handleEditCategory  = useCallback(() => {
    openCategoryModal(categoryInitialData);
  }, [categoryInitialData, openCategoryModal]);
  const handleEditSocialLinks = useCallback(() => {
    const getInfoValue = (label: string) =>
      effectiveArtist.info?.find((i) => i.label === label)?.value || '';

    const instagramUrl = getInfoValue('Instagram');
    const tiktokUrl = getInfoValue('TikTok');
    const twitterUrl = getInfoValue('Twitter');
    const youtubeUrl = getInfoValue('YouTube');
    const spotifyUrl = getInfoValue('Spotify');

    const instagram = instagramUrl
      ? instagramUrl.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/^@/, '').replace(/\/$/, '')
      : '';

    const tiktok = tiktokUrl
      ? tiktokUrl.replace(/^https?:\/\/(www\.)?tiktok\.com\/@/, '').replace(/^@/, '').replace(/\/$/, '')
      : '';

    const x = twitterUrl
      ? twitterUrl.replace(/^https?:\/\/(www\.)?twitter\.com\//, '').replace(/^@/, '').replace(/\/$/, '')
      : '';

    const youtube = youtubeUrl
      ? youtubeUrl
          .replace(/^https?:\/\/(www\.)?youtube\.com\/@/, '')
          .replace(/^@/, '')
          .replace(/\/$/, '')
      : '';

    const spotify = spotifyUrl
      ? spotifyUrl.replace(/^https?:\/\/(www\.)?open\.spotify\.com\/artist\//, '').replace(/\?.*$/, '').replace(/\/$/, '')
      : '';

    openSocialLinksModal({ instagram, tiktok, youtube, spotify, x });
  }, [effectiveArtist.info, openSocialLinksModal]);
  const handleEditSobreMi = useCallback(() => {
    openAcercaDeMiModal(effectiveArtist.description || '');
  }, [effectiveArtist.description, openAcercaDeMiModal]);
  const handleAddService    = useCallback(async (serviceData: any) => {
    try {
      const payload = {
        ...serviceData,
        price: typeof serviceData?.price === 'string' ? (parseFloat(serviceData.price) || 0) : (serviceData?.price || 0),
        includedCount: typeof serviceData?.includedCount === 'string' ? (parseInt(serviceData.includedCount, 10) || 1) : (serviceData?.includedCount ?? 1),
        deliveryDays: typeof serviceData?.deliveryDays === 'string' ? (parseInt(serviceData.deliveryDays, 10) || 0) : (serviceData?.deliveryDays ?? 0),
        weeklyFrequency: typeof serviceData?.weeklyFrequency === 'string' ? (parseInt(serviceData.weeklyFrequency, 10) || 1) : (serviceData?.weeklyFrequency ?? 1),
        packageType: serviceData?.packageType === 'simple' ? 'single' : serviceData?.packageType,
      };

      const newService = await servicesService.createService(payload);
      setServices(prev => [...prev, newService]);
      closeEditServiceModal();
      Alert.alert('Éxito', 'Servicio creado correctamente.');
    } catch (error) {
      console.error('Error creating service:', error);
      Alert.alert('Error', 'No se pudo crear el servicio.');
    }
  }, [closeEditServiceModal]);

  const handleAddProduct    = useCallback(async (productData: any) => {
    try {
      const newProduct = await productsService.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      closeEditProductModal();
      Alert.alert('Éxito', 'Producto creado correctamente.');
    } catch (error) {
      console.error('Error creating product:', error);
      Alert.alert('Error', 'No se pudo crear el producto.');
    }
  }, [closeEditProductModal]);

  const handleAddEvent      = useCallback(async (eventData: any) => {
    try {
      const newEvent = await eventsService.createEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      closeEditEventModal();
      Alert.alert('Éxito', 'Evento creado correctamente.');
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'No se pudo crear el evento.');
    }
  }, [closeEditEventModal]);

  // ── Modal save handlers — conectados al backend vía profileStore

  const handleSaveHeader = useCallback(async (data: any) => {
    try {
      await saveHeader({
        name:     data.name,
        handle:   data.handle.replace(/^@/, ''),
        location: data.location,
        schedule: data.schedule,
        bio:      data.bio,
        tags:     data.tags as [string, string, string],
      });
      await loadProfile(
        auth.currentUser?.uid ?? '',
        auth.currentUser?.photoURL ?? '',
        auth.currentUser?.displayName ?? '',
      );
      closeEditHeaderModal();
      Alert.alert('Éxito', 'Perfil actualizado correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el perfil. Revisa tu conexión.');
    }
  }, [saveHeader, loadProfile]);

  const handleSaveDescription = useCallback(async (description: string) => {
    await saveDescription(description);
    closeAcercaDeMiModal();
    // Recargar perfil para asegurar que los datos estén actualizados
    await loadProfile(auth.currentUser?.uid || '', auth.currentUser?.photoURL || '', auth.currentUser?.displayName || '');
  }, [saveDescription, closeAcercaDeMiModal, loadProfile]);

  const handleSaveProInfo = useCallback(async (data: any) => {
    try {
      await saveProInfo({
        yearsExperience: data.yearsExperience,
        style: data.style,
        availability:    data.availability,
        responseTime:    data.schedule,
      });
      // Recargar perfil para asegurar que los datos estén actualizados
      await loadProfile(auth.currentUser?.uid || '', auth.currentUser?.photoURL || '', auth.currentUser?.displayName || '');
      closeInfoProfesionalModal();
      Alert.alert('Éxito', 'Información profesional actualizada correctamente.');
    } catch (error) {
      console.error('Error guardando información profesional:', error);
      Alert.alert('Error', 'No se pudo guardar la información profesional.');
    }
  }, [saveProInfo, closeInfoProfesionalModal, loadProfile]);

  const handleSaveExperience = useCallback(async (experience: any[]) => {
    try {
      await saveExperience(experience);
      closeExperienceModal();
    } catch {
      Alert.alert('Error', 'No se pudo guardar la experiencia laboral.');
    }
  }, [saveExperience, closeExperienceModal]);

  const handleSaveStudies = useCallback(async (studies: any[]) => {
    try {
      await saveStudies(studies);
      closeStudiesModal();
    } catch {
      Alert.alert('Error', 'No se pudo guardar los estudios.');
    }
  }, [saveStudies, closeStudiesModal]);

  const handleSaveCategory = useCallback(async (data: any) => {
    console.log('🔥 [handleSaveCategory] Guardando categoría:', data);
    // Actualizar local inmediatamente (optimistic update) - SIEMPRE se ejecuta
    useProfileStore.getState().setArtistData({
      category:  data.category,
      specialty: data.specialty,
      niche:     data.niche,
    });
    console.log('🔥 [handleSaveCategory] Actualizado localmente');
    closeCategoryModal();
    
    // Persistir al backend para que loadProfile lo recupere en futuras sesiones
    if (data.category?.categoryId) {
      try {
        await updateArtistProfile({
          categoryId:   data.category.categoryId,
          disciplineId: data.category.disciplineId || undefined,
          roleId:       data.category.roleId || undefined,
          specialty:    data.specialty || undefined,
          niche:        data.niche || undefined,
        });
        console.log('🔥 [handleSaveCategory] Guardado en backend correctamente');
      } catch (e) {
        console.warn('[handleSaveCategory] Error al guardar categoría en backend:', e);
      }
    } else {
      console.warn('[handleSaveCategory] No se guardó en backend: falta categoryId');
    }
  }, [closeCategoryModal]);

  const handleSaveSocialLinks = useCallback(async (data: any) => {
    try {
      console.log('🔗 Guardando social links:', data);
      await saveSocialLinks(data);
      // Refresco en background (no bloquear el cierre del modal)
      loadProfile(
        auth.currentUser?.uid || '',
        auth.currentUser?.photoURL || '',
        auth.currentUser?.displayName || ''
      ).catch(() => {});
      Alert.alert('Éxito', 'Redes sociales actualizadas correctamente.');
    } catch {
      Alert.alert('Error', 'No se pudieron guardar las redes sociales.');
      throw new Error('saveSocialLinks failed');
    }
  }, [saveSocialLinks, loadProfile]);

  const handleConvertToCompany = useCallback(async (data: any) => {
    try {
      // Por ahora solo actualizamos los datos locales hasta tener el endpoint real
      setArtistData({
        ...effectiveArtist,
        companyName: data.companyName,
        companyDescription: data.companyDescription,
      });
      closeCompanyModal();
      Alert.alert('Éxito', 'Perfil convertido a empresa correctamente.');
    } catch {
      Alert.alert('Error', 'No se pudo convertir el perfil a empresa. Revisa tu conexión.');
    }
  }, [closeCompanyModal, effectiveArtist, setArtistData]);

  // ── Render de contenido según tab activa
  const renderContent = () => {
    switch (activeMainTab) {
      case 'agenda':
        try {
          return (
            <AgendaSectionFunctional
              isOwner={true}
              artistId={Number(effectiveArtist?.id)}
              onEditSection={() => console.log('Edit agenda section')}
            />
          );
        } catch (error) {
          console.error('Error en AgendaSection:', error);
          return (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#666' }}>Error cargando agenda</Text>
            </View>
          );
        }
      case 'eventos':
        try {
          return (
            <EventosSection 
              events={events} 
              isOwner={true} 
            />
          );
        } catch (error) {
          console.error('Error en EventosSection:', error);
          return (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#666' }}>Error cargando eventos</Text>
            </View>
          );
        }
      case 'tienda':
        try {
          return (
            <TiendaSection 
              onEditProduct={() => openEditProductModal(null)} 
            />
          );
        } catch (error) {
          console.error('Error en TiendaSection:', error);
          return (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#666' }}>Error cargando tienda</Text>
            </View>
          );
        }
      case 'pagos':
        try {
          return (
            <View style={{ padding: 20 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#6D28D9',
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
                onPress={() => navigation.navigate('StripeSetup' as never)}
              >
                <Ionicons name="wallet-outline" size={24} color="#fff" />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff', marginBottom: 4 }}>
                    Configurar Pagos
                  </Text>
                  <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#e9d5ff' }}>
                    Conecta tu cuenta Stripe para recibir pagos
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1.5,
                  borderColor: '#e5e7eb',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
                onPress={() => navigation.navigate('Wallet' as never)}
              >
                <Ionicons name="card-outline" size={24} color="#6D28D9" />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b', marginBottom: 4 }}>
                    Mi Billetera
                  </Text>
                  <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#6b7280' }}>
                    Ver balance y transacciones
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          );
        } catch (error) {
          console.error('Error en sección pagos:', error);
          return (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#666' }}>Error cargando pagos</Text>
            </View>
          );
        }
      case 'sobre':
        try {
          return (
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
              onServicesUpdated={reloadServices}
            />
          );
        } catch (error) {
          console.error('Error en sección sobre mí:', error);
          console.error('Error details:', error.message);
          console.error('Error stack:', error.stack);
          return (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#666' }}>Error cargando sección sobre mí</Text>
              <Text style={{ fontSize: 12, color: '#999', marginTop: 5 }}>
                Revisa la consola para más detalles
              </Text>
            </View>
          );
        }
      default:
        return (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Sección no encontrada</Text>
          </View>
        );
    }
  };

  return (
    <View style={[styles.root, isDark && { backgroundColor: '#0a0618' }]}>
      <TopBar title={effectiveArtist.handle?.replace('@', '') ?? effectiveArtist.name} topInset={insets.top} usernameMode={true} />

      {/* Banner "vista de cliente" - ahora arriba de todo */}
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
      
      <ScrollView
        style={[styles.scroll, isDark && { backgroundColor: '#0a0618' }]}
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
              coverImage={effectiveArtist.coverImage}
              isOwner={true}
              onEditCover={handleEditCover}
            />

            <ProfileIdentity
              artist={viewingAsClient ? { ...effectiveArtist, isOwner: false } : effectiveArtist}
              onEditProfile={viewingAsClient ? undefined : handleEditProfile}
              onEditAvatar={viewingAsClient ? undefined : handleEditAvatar}
              onShare={handleShare}
              onViewAsClient={handleViewAsClient}
              onMore={viewingAsClient ? undefined : handleMoreOptions}
            />

            <View style={[styles.mainTabsContainer, isDark && { backgroundColor: '#0a0618' }]}>
              <TabBar
                tabs={MAIN_TABS}
                active={activeMainTab}
                onSelect={setActiveMainTab}
              />
            </View>

            <View style={[styles.content, isDark && { backgroundColor: '#0a0618' }]}>
              {renderContent()}
            </View>
          </>
        )}

        <AppFooter />
      </ScrollView>

      {/* ── Modals ── */}
      {/* ModalContainer con todos los modales de edición */}
      <ModalContainer
        onSaveSocialLinks={handleSaveSocialLinks}
        onSaveExperience={handleSaveExperience}
        onSaveStudies={handleSaveStudies}
        onSaveDescription={handleSaveDescription}
        onSaveService={handleAddService}
        onSaveCategory={handleSaveCategory}
        onSaveInfoProfesional={handleSaveProInfo}
        onSaveEditHeader={handleSaveHeader}
        onSaveEditProduct={handleAddProduct}
        onSaveEditEvent={handleAddEvent}
        onSaveCompany={handleConvertToCompany}
        onSaveVideo={async (data: any) => {
          // Esta función será manejada por el PortfolioSection
          // Por ahora dejamos una implementación vacía ya que el VideoModal
          // se maneja directamente desde PortfolioSection
          console.log('Video guardado:', data);
        }}
      />

      {/* ── Preview portada con recorte interactivo ── */}
      <Modal visible={!!pendingCoverAsset} transparent animationType="fade">
        <View style={styles.coverPreviewOverlay}>
          <Text style={styles.coverPreviewTitle}>Ajusta tu portada</Text>
          {pendingCoverAsset && (() => {
            const CROP_W  = Dimensions.get('window').width - 48;
            const CROP_H  = CROP_W * (5 / 16);
            const scale   = Math.max(CROP_W / pendingCoverAsset.width, CROP_H / pendingCoverAsset.height);
            const dispW   = pendingCoverAsset.width  * scale;
            const dispH   = pendingCoverAsset.height * scale;
            return (
              <View
                style={[styles.coverCropFrame, { width: CROP_W, height: CROP_H }]}
                {...panResponder.panHandlers}
              >
                <Animated.Image
                  source={{ uri: pendingCoverAsset.uri }}
                  style={{
                    width:  dispW,
                    height: dispH,
                    transform: [
                      { translateX: panAnim.x },
                      { translateY: panAnim.y },
                    ],
                  }}
                  resizeMode="cover"
                />
              </View>
            );
          })()}
          <Text style={styles.coverPreviewHint}>Arrastra para ajustar el encuadre</Text>
          <View style={styles.coverPreviewBtns}>
            <TouchableOpacity
              style={styles.coverPreviewBtnSecondary}
              onPress={() => { setPendingCoverAsset(null); pickCoverImage(false); }}
              activeOpacity={0.8}
            >
              <Text style={styles.coverPreviewBtnSecondaryText}>Elegir otra</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.coverPreviewBtnPrimary}
              onPress={confirmCoverImage}
              activeOpacity={0.8}
              disabled={uploadingCover}
            >
              {uploadingCover
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={styles.coverPreviewBtnPrimaryText}>Usar esta foto</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Menú desplegable de opciones ── */}
      <ProfileMoreMenu
        visible={showMoreMenu}
        onClose={() => setShowMoreMenu(false)}
        items={menuItems}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#fff', // Mismo color que el header
    marginHorizontal: 0,
    marginTop: -8,
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

  // ── Cover preview modal ───────────────────────────────────────────
  coverPreviewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  coverPreviewTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    marginBottom: 16,
  },
  coverCropFrame: {
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPreviewHint: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.5)',
    marginTop: 10,
    marginBottom: 24,
  },
  coverPreviewBtns: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  coverPreviewBtnSecondary: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPreviewBtnSecondaryText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },
  coverPreviewBtnPrimary: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPreviewBtnPrimaryText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});
