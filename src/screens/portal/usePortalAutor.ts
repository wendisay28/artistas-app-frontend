// src/screens/portal/usePortalAutor.ts
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { useProfileCompletion } from '../home/hooks/Useprofilecompletion';
import { ARTIST_CATEGORIES } from '../../constants/artistCategories';
import { servicesService } from '../../services/api/services';
import { portfolioService } from '../../services/api/portfolio';
import { legalService } from '../../services/api/legal.service';
import { stripeService } from '../../services/api/stripe.service';
import { compressImage } from '../../hooks/useProfileImageUpload';
import { POLICIES } from './PortalPolicyModal';

export type DeliveryMode = 'presencial' | 'digital' | 'hibrido' | null;
export type StripeStatus = 'disconnected' | 'pending' | 'connected' | 'restricted' | 'error';

export const DELIVERY_OPTIONS: { id: DeliveryMode; label: string; sub: string; icon: string }[] = [
  { id: 'presencial', label: 'Presencial', sub: 'Trabajo en persona en tu ubicación o la del cliente', icon: 'walk' },
  { id: 'digital',    label: 'Digital',    sub: 'Entrego archivos, grabaciones o contenido online',   icon: 'cloud-upload' },
  { id: 'hibrido',    label: 'Híbrido',    sub: 'Combino trabajo presencial y entrega digital',        icon: 'git-merge' },
];

export function usePortalAutor(onClose: () => void) {
  const navigation = useNavigation();
  const { user, isProfileComplete } = useAuthStore();
  const {
    artistData, saveAvatar, saveBio,
    hasServices, hasPortfolio, savedDeliveryMode, hasLegal, hasPayment, setContentFlags,
  } = useProfileStore();

  // ── Availability ─────────────────────────────────────────────────────────────
  const [isAvailable, setIsAvailable] = useState(
    artistData?.info?.find(i => i.label === 'Disponibilidad')?.value === 'Disponible'
  );

  // ── Stripe ───────────────────────────────────────────────────────────────────
  const [stripeStatus, setStripeStatus] = useState<StripeStatus>('disconnected');
  const [stripeConnecting, setStripeConnecting] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [stripeHolderName, setStripeHolderName] = useState('');
  const [stripeEmail, setStripeEmail] = useState('');

  // ── Delivery ─────────────────────────────────────────────────────────────────
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(savedDeliveryMode);

  // ── Legal ────────────────────────────────────────────────────────────────────
  const [acceptedTerms,       setAcceptedTerms]       = useState(hasLegal);
  const [acceptedPrivacy,     setAcceptedPrivacy]     = useState(hasLegal);
  const [acceptedAge,         setAcceptedAge]         = useState(hasLegal);
  const [acceptedExclusivity, setAcceptedExclusivity] = useState(hasLegal);
  const [worksWithAgency,     setWorksWithAgency]     = useState<'si' | 'no' | null>(null);
  const [openPolicy,          setOpenPolicy]          = useState<keyof typeof POLICIES | null>(null);
  const [profileActivated,    setProfileActivated]    = useState(false);

  // ── Bio / Tags ───────────────────────────────────────────────────────────────
  const [editingBio,     setEditingBio]     = useState(false);
  const [bioText,        setBioText]        = useState(artistData?.bio ?? artistData?.description ?? '');
  const [bioSaving,      setBioSaving]      = useState(false);
  const [selectedTags,   setSelectedTags]   = useState<string[]>(
    (artistData?.tags ?? []).map((t: any) => t.label).slice(0, 3)
  );
  const [tagsSaving,     setTagsSaving]     = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');

  // ── Effects ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    stripeService.getConnectionStatus()
      .then(status => {
        console.log('[Portal] Stripe status:', status);
        setStripeStatus(status.status);
        const isActive = status.status === 'connected' && status.chargesEnabled;
        if (isActive !== hasPayment) setContentFlags({ hasPayment: isActive });
      })
      .catch(() => setStripeStatus('disconnected'));
  }, []);

  useEffect(() => {
    if (hasLegal) {
      setAcceptedTerms(true);
      setAcceptedPrivacy(true);
      setAcceptedAge(true);
      setAcceptedExclusivity(true);
    }
  }, [hasLegal]);

  useEffect(() => {
    if (savedDeliveryMode && !deliveryMode) setDeliveryMode(savedDeliveryMode);
  }, [savedDeliveryMode]);

  useEffect(() => {
    if (deliveryMode) {
      setContentFlags({ savedDeliveryMode: deliveryMode });
      legalService.updateDeliveryMode(deliveryMode).catch(() => {});
    }
  }, [deliveryMode]);

  useEffect(() => {
    const allLegal = acceptedTerms && acceptedPrivacy && acceptedAge && acceptedExclusivity;
    if (allLegal && !hasLegal) setContentFlags({ hasLegal: true });
  }, [acceptedTerms, acceptedPrivacy, acceptedAge, acceptedExclusivity]);

  useEffect(() => {
    servicesService.getMyServices()
      .then(s => setContentFlags({ hasServices: s.length > 0 }))
      .catch(() => {});
    portfolioService.getMyPortfolio()
      .then(p => setContentFlags({ hasPortfolio: (p.photos?.length ?? 0) > 0 }))
      .catch(() => {});
    legalService.getLegalAcceptanceStatus()
      .then(status => {
        if (status.termsAccepted)   setAcceptedTerms(true);
        if (status.privacyAccepted) setAcceptedPrivacy(true);
        if (status.ageVerified)     setAcceptedAge(true);
      })
      .catch(() => {});
  }, []);

  // ── Stripe helpers ───────────────────────────────────────────────────────────

  const stripeStatusColors = (): [string, string] => {
    switch (stripeStatus) {
      case 'connected':  return ['#10b981', '#059669'];
      case 'pending':    return ['#f59e0b', '#d97706'];
      case 'restricted': return ['#ef4444', '#dc2626'];
      case 'error':      return ['#ef4444', '#dc2626'];
      default:           return ['#6b7280', '#4b5563'];
    }
  };

  const stripeStatusIcon = () => {
    switch (stripeStatus) {
      case 'connected':  return 'checkmark-circle';
      case 'pending':    return 'time';
      case 'restricted': return 'warning';
      case 'error':      return 'close-circle';
      default:           return 'card-outline';
    }
  };

  const stripeStatusTitle = () => {
    switch (stripeStatus) {
      case 'connected':  return 'Cuenta conectada';
      case 'pending':    return 'Verificación pendiente';
      case 'restricted': return 'Cuenta restringida';
      case 'error':      return 'Error de conexión';
      default:           return 'Conectar cuenta Stripe';
    }
  };

  const stripeStatusMessage = () => {
    switch (stripeStatus) {
      case 'connected':  return 'Listo para recibir pagos seguros';
      case 'pending':    return 'Estamos verificando tu información';
      case 'restricted': return 'Necesitas completar algunos requisitos';
      case 'error':      return 'Hubo un problema, intenta nuevamente';
      default:           return 'Conecta tu cuenta bancaria para recibir pagos';
    }
  };

  const handleStripeConnect = async () => {
    if (!stripeHolderName.trim() || !stripeEmail.trim()) {
      Alert.alert('Datos incompletos', 'Por favor completa el nombre y el correo.');
      return;
    }
    setStripeConnecting(true);
    try {
      const response = await stripeService.initiateConnect({
        holderName: stripeHolderName.trim(),
        email: stripeEmail.trim(),
        accountType: 'individual',
        acceptTerms: true,
      });
      if (response.connectUrl) {
        Alert.alert('Conexión iniciada', 'Redirigiendo a Stripe para completar la conexión...', [
          { text: 'OK', onPress: () => console.log('Redirigir a:', response.connectUrl) },
        ]);
      }
      setStripeStatus('pending');
      setShowStripeModal(false);
    } catch (error) {
      console.error('Error conectando Stripe:', error);
      Alert.alert('Error', 'No se pudo iniciar la conexión con Stripe.');
    } finally {
      setStripeConnecting(false);
    }
  };

  const canConnectStripe = !!(stripeHolderName.trim() && stripeEmail.trim() && !stripeConnecting);

  // ── Profile actions ───────────────────────────────────────────────────────────

  const goToProfileTab = () => {
    onClose();
    setTimeout(() => { (navigation as any).navigate('Profile'); }, 320);
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitas dar permiso para acceder a tus fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      try {
        const compressed = await compressImage(result.assets[0].uri, 500, 0.8);
        await saveAvatar(compressed);
        Alert.alert('Listo', 'Foto de perfil actualizada.');
      } catch {
        Alert.alert('Error', 'No se pudo guardar la foto.');
      }
    }
  };

  const handleSaveBio = async () => {
    if (!bioText.trim()) return;
    setBioSaving(true);
    try {
      await saveBio(bioText.trim());
      setEditingBio(false);
    } catch {
      Alert.alert('Error', 'No se pudo guardar la descripción.');
    } finally {
      setBioSaving(false);
    }
  };

  // ── Tags ─────────────────────────────────────────────────────────────────────

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) return prev.filter(t => t !== tag);
      if (prev.length >= 3) return prev;
      return [...prev, tag];
    });
  };

  const handleSaveTags = async () => {
    setTagsSaving(true);
    try {
      const { saveHeader } = useProfileStore.getState();
      const current = artistData;
      if (current) {
        await saveHeader({
          name: current.name,
          handle: (current.handle ?? '').replace('@', ''),
          location: current.location ?? '',
          schedule: '',
          bio: current.bio ?? '',
          tags: [selectedTags[0] ?? '', selectedTags[1] ?? '', selectedTags[2] ?? ''],
        });
      }
    } catch {
      // silenciar — los tags se guardan localmente igual
    } finally {
      setTagsSaving(false);
    }
  };

  const handleAddCustomTag = () => {
    const tag = customTagInput.trim();
    if (!tag) return;
    toggleTag(tag.charAt(0).toUpperCase() + tag.slice(1));
    setCustomTagInput('');
  };

  const getTagSuggestions = (): string[] => {
    const categoryId   = (artistData?.category?.categoryId   ?? '').toLowerCase();
    const disciplineId = (artistData?.category?.disciplineId ?? '').toLowerCase();
    const specialty    = (artistData?.specialty ?? '').toLowerCase();
    const genre        = (artistData?.tags?.[0]?.label ?? '').toLowerCase();

    const priorityOrder = ['artes-visuales', 'artes-escenicas', 'musica', 'audiovisual', 'diseno', 'comunicacion', 'cultura-turismo'];
    const sortedCats = [...ARTIST_CATEGORIES].sort((a, b) => {
      const ai = priorityOrder.indexOf(a.id), bi = priorityOrder.indexOf(b.id);
      if (ai === -1) return 1; if (bi === -1) return -1; return ai - bi;
    });

    let allFoundTags: string[] = [];
    let bestMatchTags: string[] = [];

    for (const cat of sortedCats) {
      if (categoryId && (cat.id.includes(categoryId) || categoryId.includes(cat.id))) {
        for (const disc of cat.disciplines) {
          if (disc.suggestedTags?.length) {
            bestMatchTags = disc.suggestedTags.map(t => t.charAt(0).toUpperCase() + t.slice(1));
            break;
          }
        }
      }
      for (const disc of cat.disciplines) {
        const matches =
          disc.id.includes(genre) || genre.includes(disc.id) ||
          disc.id.includes(specialty) || specialty.includes(disc.id) ||
          disc.id.includes(disciplineId) || disciplineId.includes(disc.id);
        if (matches && disc.suggestedTags?.length) {
          const tags = disc.suggestedTags.map(t => t.charAt(0).toUpperCase() + t.slice(1));
          allFoundTags.push(...tags);
          if (bestMatchTags.length === 0) bestMatchTags = tags;
        }
      }
    }

    const specificTags = bestMatchTags.length > 0 ? bestMatchTags : [...new Set(allFoundTags)];
    if (specificTags.length === 0) return ['Bodas', 'Productos', 'Eventos', 'Retrato', 'Digital', 'Abstracto', 'Mural'];

    const important = ['Bodas', 'Productos', 'Eventos'];
    const final: string[] = [...important];
    specificTags.forEach(tag => { if (!final.includes(tag)) final.push(tag); });
    return final.slice(0, 7);
  };

  // ── Policy accept handler ────────────────────────────────────────────────────

  const handleAcceptPolicy = () => {
    if (openPolicy === 'terms') {
      setAcceptedTerms(true);
      legalService.updateLegalAcceptance({ termsAccepted: true, privacyAccepted: acceptedPrivacy, ageVerified: acceptedAge }).catch(console.warn);
    }
    if (openPolicy === 'privacy') {
      setAcceptedPrivacy(true);
      legalService.updateLegalAcceptance({ termsAccepted: acceptedTerms, privacyAccepted: true, ageVerified: acceptedAge }).catch(console.warn);
    }
    if (openPolicy === 'exclusivity') {
      setAcceptedExclusivity(true);
    }
    if (openPolicy === 'age') {
      setAcceptedAge(true);
      legalService.updateLegalAcceptance({ termsAccepted: acceptedTerms, privacyAccepted: acceptedPrivacy, ageVerified: true }).catch(console.warn);
    }
  };

  // ── Completion ───────────────────────────────────────────────────────────────

  const { percentage: completionPct } = useProfileCompletion({
    delivery:  deliveryMode !== null,
    legal:     acceptedTerms && acceptedPrivacy && acceptedAge && acceptedExclusivity,
    services:  hasServices,
    portfolio: hasPortfolio,
    payment:   hasPayment,
  });

  const hasBio = !!(artistData?.bio?.trim() || artistData?.description?.trim() || bioText.trim());
  const hasSocialLinks = !!(artistData?.info?.some(i => ['Instagram', 'Twitter', 'YouTube', 'Spotify'].includes(i.label)));
  const canActivate = completionPct >= 100;

  // Función para recargar el estado de Stripe
  const loadStripeStatus = async () => {
    try {
      const status = await stripeService.getConnectionStatus();
      console.log('[Portal] Stripe status reloaded:', status);
      setStripeStatus(status.status);
      const isActive = status.status === 'connected' && status.chargesEnabled;
      if (isActive !== hasPayment) setContentFlags({ hasPayment: isActive });
    } catch (error) {
      console.error('[Portal] Error reloading Stripe status:', error);
      setStripeStatus('disconnected');
    }
  };

  const getColors = (): [string, string] => {
    if (completionPct >= 80) return ['#10b981', '#059669'];
    if (completionPct >= 50) return ['#9333ea', '#2563eb'];
    return ['#ec4899', '#be185d'];
  };

  const getMessage = () => {
    if (completionPct === 100) return '¡Perfil completo! Recibirás 3× más clientes.';
    if (completionPct >= 80)   return 'Casi listo. ¡Completa los últimos pasos!';
    if (completionPct >= 50)   return 'Buen avance. Sigue completando tu perfil.';
    return 'Completa tu perfil para atraer más clientes.';
  };

  const completionSteps = [
    { id: 'photo',    label: 'Foto de perfil',       description: 'Añade una foto para que los clientes te reconozcan',      icon: 'camera-outline',          points: 15, done: !!(user?.photoURL || artistData?.avatar),                                        actionLabel: 'Subir foto ahora',    actionIcon: 'camera',                onAction: handlePickPhoto },
    { id: 'bio',      label: 'Descripción / Bio',    description: 'Cuéntales a los clientes quién eres y qué haces',         icon: 'document-text-outline',   points: 15, done: hasBio,                                                                          actionLabel: 'Escribir bio',        actionIcon: 'create',                onAction: () => setEditingBio(true) },
    { id: 'category', label: 'Categoría artística',  description: 'Completada durante tu registro',                           icon: 'sparkles-outline',        points: 15, done: isProfileComplete,                                                                actionLabel: 'Editar en Perfil',    actionIcon: 'pencil',                onAction: goToProfileTab },
    { id: 'delivery', label: '¿Cómo entregas?',      description: 'Selecciona tu modo de entrega justo abajo',               icon: 'cube-outline',            points: 10, done: deliveryMode !== null,                                                            actionLabel: 'Seleccionar modo',    actionIcon: 'arrow-down',            onAction: () => {} },
    { id: 'location', label: 'Ubicación',             description: 'Configurada en tu registro — editable en Perfil',         icon: 'location-outline',        points: 10, done: isProfileComplete || !!(user?.city || artistData?.location),                     actionLabel: 'Actualizar en Perfil',actionIcon: 'location',              onAction: goToProfileTab },
    { id: 'social',   label: 'Redes sociales',        description: 'Conecta tus cuentas desde la sección Sobre mí',           icon: 'share-social-outline',    points: 10, done: hasSocialLinks,                                                                  actionLabel: 'Ir a mi Perfil',      actionIcon: 'arrow-forward-circle',  onAction: goToProfileTab },
    { id: 'services', label: 'Servicios ofrecidos',   description: 'Publica al menos un servicio con precio en tu perfil',   icon: 'briefcase-outline',       points: 15, done: hasServices,                                                                     actionLabel: 'Ir a mi Perfil',      actionIcon: 'arrow-forward-circle',  onAction: goToProfileTab },
    { id: 'portfolio',label: 'Portafolio de fotos',   description: 'Sube ejemplos de tu trabajo desde tu perfil',            icon: 'images-outline',          points: 10, done: hasPortfolio,                                                                    actionLabel: 'Ir a mi Perfil',      actionIcon: 'arrow-forward-circle',  onAction: goToProfileTab },
    { id: 'legal',    label: 'Validación y Legal',    description: 'Acepta los 4 términos para activar tu perfil',           icon: 'shield-checkmark-outline', points: 10, done: acceptedTerms && acceptedPrivacy && acceptedAge && acceptedExclusivity,          actionLabel: 'Revisar términos',    actionIcon: 'document',              onAction: () => setOpenPolicy('terms') },
    { id: 'payment',  label: 'Método de cobro',       description: 'Conecta tu cuenta bancaria con Stripe para recibir pagos',icon: 'card-outline',            points:  8, done: hasPayment,                                                                      actionLabel: 'Configurar Stripe',   actionIcon: 'card',                  onAction: () => setShowStripeModal(true) },
  ];

  const totalPoints     = completionSteps.reduce((a, st) => a + st.points, 0);
  const completedPoints = completionSteps.filter(st => st.done).reduce((a, st) => a + st.points, 0);
  const pendingSteps    = completionSteps.filter(st => !st.done);
  const doneSteps       = completionSteps.filter(st => st.done);

  return {
    // data
    user, artistData,
    // availability
    isAvailable, setIsAvailable,
    // stripe
    stripeStatus, stripeConnecting, showStripeModal, setShowStripeModal,
    stripeHolderName, setStripeHolderName,
    stripeEmail, setStripeEmail,
    canConnectStripe, handleStripeConnect,
    stripeStatusColors, stripeStatusIcon, stripeStatusTitle, stripeStatusMessage,
    loadStripeStatus,
    // delivery
    deliveryMode, setDeliveryMode, DELIVERY_OPTIONS,
    // legal
    acceptedTerms, setAcceptedTerms,
    acceptedPrivacy, setAcceptedPrivacy,
    acceptedAge, setAcceptedAge,
    acceptedExclusivity, setAcceptedExclusivity,
    worksWithAgency, setWorksWithAgency,
    openPolicy, setOpenPolicy, handleAcceptPolicy,
    profileActivated, setProfileActivated,
    // bio
    editingBio, setEditingBio, bioText, setBioText, bioSaving, handleSaveBio,
    // tags
    selectedTags, customTagInput, setCustomTagInput,
    toggleTag, handleSaveTags, handleAddCustomTag, tagsSaving, getTagSuggestions,
    // computed
    hasBio, completionPct, getColors, getMessage, canActivate,
    completionSteps, totalPoints, completedPoints, pendingSteps, doneSteps,
    // actions
    handlePickPhoto, goToProfileTab,
  };
}
