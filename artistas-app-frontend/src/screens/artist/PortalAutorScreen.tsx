// src/screens/artist/PortalAutorScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Switch, Alert, TextInput, KeyboardAvoidingView,
  Platform, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { useProfileCompletion } from '../home/hooks/Useprofilecompletion';
import { ARTIST_CATEGORIES } from '../../constants/artistCategories';

type DeliveryMode = 'presencial' | 'digital' | 'hibrido' | null;

// ─── Contenido de políticas ────────────────────────────────────────────────────

const POLICIES = {
  terms: {
    title: 'Términos y condiciones',
    icon: 'document-text',
    content: `BuscArt es una plataforma de conexión entre artistas y clientes. Al usar la plataforma como artista, aceptas las siguientes condiciones:

1. REGISTRO Y PERFIL
Debes proporcionar información veraz y actualizada sobre tu trabajo artístico. Eres responsable de mantener tu perfil al día.

2. SERVICIOS Y CONTRATACIONES
Las contrataciones se realizan directamente entre artista y cliente. BuscArt facilita el encuentro pero no interviene en los acuerdos económicos.

3. PAGOS Y COMISIONES
BuscArt puede aplicar una comisión del servicio sobre las contrataciones gestionadas a través de la plataforma, según lo indicado en tu plan.

4. CONTENIDO
Eres el único responsable del contenido que publicas (fotos, descripciones, precios). No se permite contenido falso, ofensivo o que infrinja derechos de terceros.

5. CANCELACIONES
Cada artista establece su propia política de cancelación. Se recomienda definirla claramente en tu perfil.

6. SUSPENSIÓN
BuscArt se reserva el derecho de suspender cuentas que infrinjan estos términos o que reciban quejas reiteradas de clientes.

7. MODIFICACIONES
Estos términos pueden actualizarse. Te notificaremos por correo electrónico ante cambios importantes.

Fecha de última actualización: Febrero 2026`,
  },
  privacy: {
    title: 'Política de privacidad',
    icon: 'shield',
    content: `En BuscArt tratamos tus datos con respeto y responsabilidad. Esta política explica cómo recopilamos y usamos tu información.

1. DATOS QUE RECOPILAMOS
• Información de perfil: nombre, foto, categoría artística, ubicación, bio.
• Datos de contacto: correo electrónico, redes sociales que compartes voluntariamente.
• Datos de uso: actividad en la plataforma, eventos creados, servicios publicados.

2. USO DE TUS DATOS
• Mostrar tu perfil a clientes potenciales en tu área.
• Enviarte notificaciones de contrataciones e interacciones.
• Mejorar la experiencia de la plataforma.
• Cumplir con obligaciones legales.

3. COMPARTIR INFORMACIÓN
No vendemos tus datos a terceros. Tu información de perfil es visible para otros usuarios de la plataforma según tu configuración de privacidad.

4. UBICACIÓN
Usamos tu ciudad para conectarte con clientes cercanos. No rastreamos tu ubicación en tiempo real sin tu consentimiento explícito.

5. SEGURIDAD
Implementamos medidas técnicas para proteger tu información. Sin embargo, ningún sistema es 100% seguro.

6. TUS DERECHOS
Puedes solicitar acceso, rectificación o eliminación de tus datos contactando a privacidad@buscard.co

7. COOKIES Y ANALYTICS
Usamos herramientas de análisis para entender el uso de la plataforma y mejorarla.

Fecha de última actualización: Febrero 2026`,
  },
  age: {
    title: 'Verificación de mayoría de edad',
    icon: 'person-circle',
    content: `Para usar BuscArt como artista registrado debes ser mayor de 18 años.

¿POR QUÉ LO REQUERIMOS?

1. CAPACIDAD LEGAL
Los contratos y acuerdos de servicio en Colombia requieren que las partes sean mayores de edad para tener plena capacidad jurídica.

2. PROTECCIÓN DE MENORES
Para garantizar un entorno seguro, los perfiles de artistas activos deben corresponder a personas adultas.

3. PAGOS Y FACTURACIÓN
Los procesos de pago, comisiones y facturación requieren que el titular sea mayor de edad.

¿QUÉ PASA SI SOY MENOR?

Si eres menor de 18 años puedes explorar la plataforma como cliente, pero no podrás activar un perfil de artista hasta cumplir la mayoría de edad.

VERIFICACIÓN
Al aceptar esta declaración, confirmas bajo tu responsabilidad que tienes 18 años o más. BuscArt puede solicitar verificación documental en caso de dudas.

Fecha de última actualización: Febrero 2026`,
  },
};

// ─── Policy Modal ─────────────────────────────────────────────────────────────

const PolicyModal: React.FC<{
  policy: keyof typeof POLICIES | null;
  onClose: () => void;
  onAccept: () => void;
  alreadyAccepted: boolean;
}> = ({ policy, onClose, onAccept, alreadyAccepted }) => {
  if (!policy) return null;
  const data = POLICIES[policy];

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={pm.safe}>
        <View style={pm.header}>
          <TouchableOpacity onPress={onClose} style={pm.closeBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={20} color="#4c1d95" />
          </TouchableOpacity>
          <View style={pm.headerCenter}>
            <Ionicons name={data.icon as any} size={18} color="#7c3aed" />
            <Text style={pm.title}>{data.title}</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={pm.content} showsVerticalScrollIndicator={false}>
          <Text style={pm.body}>{data.content}</Text>
        </ScrollView>

        <View style={pm.footer}>
          {alreadyAccepted ? (
            <View style={pm.acceptedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={pm.acceptedText}>Ya aceptaste esta política</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={() => { onAccept(); onClose(); }} activeOpacity={0.88} style={pm.acceptBtn}>
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={pm.acceptBtnInner}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                <Text style={pm.acceptBtnText}>Leer y aceptar</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const pm = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3e8ff', gap: 8 },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#faf5ff', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95' },
  content: { padding: 20, paddingBottom: 40 },
  body: { fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#374151', lineHeight: 24 },
  footer: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#f3e8ff' },
  acceptBtn: { borderRadius: 14, overflow: 'hidden' },
  acceptBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  acceptBtnText: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  acceptedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, backgroundColor: '#f0fdf4', borderRadius: 14, borderWidth: 1, borderColor: '#bbf7d0' },
  acceptedText: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#166534' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

interface PortalAutorScreenProps {
  onClose: () => void;
}

export const PortalAutorScreen: React.FC<PortalAutorScreenProps> = ({ onClose }) => {
  const navigation = useNavigation();
  const { user, isProfileComplete } = useAuthStore();
  const { artistData, saveAvatar, saveBio } = useProfileStore();

  const [isAvailable, setIsAvailable] = useState(
    artistData?.info?.find(i => i.label === 'Disponibilidad')?.value === 'Disponible'
  );
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(null);
  const [acceptedTerms,   setAcceptedTerms]   = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedAge,     setAcceptedAge]     = useState(false);
  const [profileActivated, setProfileActivated] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState(artistData?.bio ?? artistData?.description ?? '');
  const [bioSaving, setBioSaving] = useState(false);
  const [openPolicy, setOpenPolicy] = useState<keyof typeof POLICIES | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    (artistData?.tags ?? []).map((t: any) => t.label).slice(0, 3)
  );
  const [tagsSaving, setTagsSaving]   = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');

  const hasSocialLinks = artistData?.info?.some(i =>
    ['Instagram', 'Twitter', 'YouTube', 'Spotify'].includes(i.label)
  );

  // ── Navegar a pestaña Perfil y cerrar portal ──────────────────────────────

  const goToProfileTab = () => {
    onClose();
    setTimeout(() => {
      (navigation as any).navigate('Profile');
    }, 320);
  };

  // ── Acciones de pasos ─────────────────────────────────────────────────────

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitas dar permiso para acceder a tus fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      try {
        await saveAvatar(result.assets[0].uri);
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

  const hasBio = !!(artistData?.bio?.trim() || artistData?.description?.trim() || bioText.trim());

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) return prev.filter(t => t !== tag);
      if (prev.length >= 3) return prev; // máximo 3
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
          role: current.role ?? '',
          location: current.location ?? '',
          schedule: '',
          bio: current.bio ?? '',
          tags: [selectedTags[0] ?? '', selectedTags[1] ?? '', selectedTags[2] ?? ''],
        });
      }
    } catch {
      // silenciar error — los tags se guardan localmente igual
    } finally {
      setTagsSaving(false);
    }
  };

  const handleAddCustomTag = () => {
    const tag = customTagInput.trim();
    if (!tag) return;
    // Capitalizar primera letra
    const formatted = tag.charAt(0).toUpperCase() + tag.slice(1);
    toggleTag(formatted);
    setCustomTagInput('');
  };

  // ── Steps ──────────────────────────────────────────────────────────────────

  const completionSteps = [
    {
      id: 'photo', label: 'Foto de perfil',
      description: 'Añade una foto para que los clientes te reconozcan',
      icon: 'camera-outline', points: 15,
      done: !!(user?.photoURL || artistData?.avatar),
      actionLabel: 'Subir foto ahora',
      actionIcon: 'camera',
      onAction: handlePickPhoto,
    },
    {
      id: 'bio', label: 'Descripción / Bio',
      description: 'Cuéntales a los clientes quién eres y qué haces',
      icon: 'document-text-outline', points: 15,
      done: hasBio,
      actionLabel: 'Escribir bio',
      actionIcon: 'create',
      onAction: () => setEditingBio(true),
    },
    {
      id: 'category', label: 'Categoría artística',
      description: 'Completada durante tu registro',
      icon: 'sparkles-outline', points: 15,
      done: isProfileComplete,
      actionLabel: 'Editar en Perfil',
      actionIcon: 'pencil',
      onAction: goToProfileTab,
    },
    {
      id: 'delivery', label: '¿Cómo entregas tu arte?',
      description: 'Selecciona tu modo de entrega justo abajo',
      icon: 'cube-outline', points: 10,
      done: deliveryMode !== null,
      actionLabel: 'Seleccionar modo',
      actionIcon: 'arrow-down',
      onAction: () => {}, // El selector está visible abajo en el scroll
    },
    {
      id: 'location', label: 'Ubicación',
      description: 'Configurada en tu registro — editable en Perfil',
      icon: 'location-outline', points: 10,
      done: isProfileComplete || !!(user?.city || artistData?.location),
      actionLabel: 'Actualizar en Perfil',
      actionIcon: 'location',
      onAction: goToProfileTab,
    },
    {
      id: 'social', label: 'Redes sociales',
      description: 'Conecta tus cuentas desde la sección Sobre mí',
      icon: 'share-social-outline', points: 10,
      done: !!hasSocialLinks,
      actionLabel: 'Ir a mi Perfil',
      actionIcon: 'arrow-forward-circle',
      onAction: goToProfileTab,
    },
    {
      id: 'services', label: 'Servicios ofrecidos',
      description: 'Publica al menos un servicio con precio en tu perfil',
      icon: 'briefcase-outline', points: 15,
      done: false,
      actionLabel: 'Ir a mi Perfil',
      actionIcon: 'arrow-forward-circle',
      onAction: goToProfileTab,
    },
    {
      id: 'portfolio', label: 'Portafolio de fotos',
      description: 'Sube ejemplos de tu trabajo desde tu perfil',
      icon: 'images-outline', points: 10,
      done: false,
      actionLabel: 'Ir a mi Perfil',
      actionIcon: 'arrow-forward-circle',
      onAction: goToProfileTab,
    },
    {
      id: 'legal', label: 'Validación y Legal',
      description: 'Acepta los 3 términos para activar tu perfil',
      icon: 'shield-checkmark-outline', points: 10,
      done: acceptedTerms && acceptedPrivacy && acceptedAge,
      actionLabel: 'Revisar términos',
      actionIcon: 'document',
      onAction: () => setOpenPolicy('terms'),
    },
  ];

  // Mismo cálculo que el banner del home — fuente única de verdad
  const { percentage: completionPct } = useProfileCompletion({
    delivery: deliveryMode !== null,
    legal:    acceptedTerms && acceptedPrivacy && acceptedAge,
  });

  const totalPoints     = completionSteps.reduce((a, s) => a + s.points, 0);
  const completedPoints = completionSteps.filter(s => s.done).reduce((a, s) => a + s.points, 0);
  const pendingSteps    = completionSteps.filter(s => !s.done);
  const doneSteps       = completionSteps.filter(s => s.done);
  const canActivate     = completionPct >= 100;

  // Sugerencias de etiquetas según la categoría/disciplina del artista
  const getTagSuggestions = (): string[] => {
    const role  = (artistData?.role ?? '').toLowerCase().replace(/\s+/g, '-');
    const genre = (artistData?.tags?.[0]?.label ?? '').toLowerCase();
    for (const cat of ARTIST_CATEGORIES) {
      for (const disc of cat.disciplines) {
        const matches =
          disc.roles.some(r => r.id === role || role.includes(r.id) || genre.includes(r.id)) ||
          disc.id.includes(genre) || genre.includes(disc.id);
        if (matches && disc.suggestedTags?.length) {
          return disc.suggestedTags.map(t => t.charAt(0).toUpperCase() + t.slice(1));
        }
      }
    }
    // Fallback genérico
    return ['Retrato', 'Digital', 'Abstracto', 'Mural', 'Contemporáneo', 'Experimental', 'Acuarela'];
  };

  const getColors = (): [string, string] => {
    if (completionPct >= 80) return ['#10b981', '#059669'];
    if (completionPct >= 50) return ['#9333ea', '#2563eb'];
    return ['#ec4899', '#be185d']; // fucsia
  };

  const getMessage = () => {
    if (completionPct === 100) return '¡Perfil completo! Recibirás 3× más clientes.';
    if (completionPct >= 80)   return 'Casi listo. ¡Completa los últimos pasos!';
    if (completionPct >= 50)   return 'Buen avance. Sigue completando tu perfil.';
    return 'Completa tu perfil para atraer más clientes.';
  };

  const DELIVERY_OPTIONS: { id: DeliveryMode; label: string; sub: string; icon: string }[] = [
    { id: 'presencial', label: 'Presencial', sub: 'Trabajo en persona en tu ubicación o la del cliente', icon: 'walk' },
    { id: 'digital',    label: 'Digital',    sub: 'Entrego archivos, grabaciones o contenido online',   icon: 'cloud-upload' },
    { id: 'hibrido',    label: 'Híbrido',    sub: 'Combino trabajo presencial y entrega digital',        icon: 'git-merge' },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={22} color="#4c1d95" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Portal del Autor</Text>
        <View style={s.availRow}>
          <Text style={[s.availLabel, isAvailable && s.availOn]}>
            {isAvailable ? 'Disponible' : 'Ocupado'}
          </Text>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: '#d1d5db', true: '#a78bfa' }}
            thumbColor={isAvailable ? '#7c3aed' : '#9ca3af'}
          />
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

          {/* Hero */}
          <LinearGradient
            colors={profileActivated ? ['#10b981', '#059669'] : getColors()}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={s.hero}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.heroSup}>{profileActivated ? '¡Perfil activo!' : 'Tu perfil está al'}</Text>
              <Text style={s.heroPct}>{completionPct}%</Text>
              <Text style={s.heroMsg}>{profileActivated ? 'Ya eres visible para clientes' : getMessage()}</Text>
            </View>
            <View style={s.heroCircle}>
              {profileActivated
                ? <Ionicons name="checkmark" size={32} color="#fff" />
                : <>
                    <Text style={s.heroCirclePct}>{doneSteps.length}/{completionSteps.length}</Text>
                    <Text style={s.heroCircleLbl}>pasos</Text>
                  </>
              }
            </View>
          </LinearGradient>

          {/* Progress bar */}
          <View style={s.progressWrap}>
            <View style={s.progressRow}>
              <Text style={s.progressLbl}>Progreso total</Text>
              <Text style={s.progressPts}>{completedPoints}/{totalPoints} pts</Text>
            </View>
            <View style={s.progressBg}>
              <LinearGradient colors={getColors()} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[s.progressBar, { width: `${completionPct}%` as any }]} />
            </View>
          </View>

          {/* Inline bio editor */}
          {editingBio && (
            <View style={s.bioEditor}>
              <Text style={s.bioEditorTitle}>Tu descripción</Text>
              <TextInput
                style={s.bioInput}
                value={bioText}
                onChangeText={setBioText}
                multiline autoFocus
                placeholder="Cuéntales quién eres, qué arte haces, cuál es tu estilo..."
                placeholderTextColor="rgba(109,40,217,0.3)"
              />
              <View style={s.bioActions}>
                <TouchableOpacity onPress={() => setEditingBio(false)} style={s.bioCancel}>
                  <Text style={s.bioCancelTxt}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveBio} disabled={bioSaving} style={s.bioSave}>
                  <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.bioSaveGrad}>
                    <Text style={s.bioSaveTxt}>{bioSaving ? 'Guardando...' : 'Guardar'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── Pending steps ── */}
          {pendingSteps.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionLbl}>Pendiente ({pendingSteps.length})</Text>
              {pendingSteps
                .filter(step => step.id !== 'delivery' && step.id !== 'legal')
                .map((step) => (
                  <TouchableOpacity key={step.id} onPress={step.onAction} activeOpacity={0.82} style={s.stepCard}>
                    <View style={s.stepIcon}>
                      <Ionicons name={step.icon as any} size={20} color="#9333ea" />
                    </View>
                    <View style={s.stepBody}>
                      <Text style={s.stepLbl}>{step.label}</Text>
                      <Text style={s.stepDesc}>{step.description}</Text>
                    </View>
                    <View style={s.stepAction}>
                      <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.stepActionBtn}>
                        <Ionicons name={step.actionIcon as any} size={12} color="#fff" />
                        <Text style={s.stepActionTxt}>{step.actionLabel}</Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          )}

          {/* ── Done steps ── */}
          {doneSteps.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionLbl}>Completado ({doneSteps.length})</Text>
              {doneSteps.map((step) => (
                <View key={step.id} style={[s.stepCard, s.stepDone]}>
                  <View style={[s.stepIcon, s.stepIconDone]}>
                    <Ionicons name="checkmark" size={18} color="#10b981" />
                  </View>
                  <View style={s.stepBody}>
                    <Text style={[s.stepLbl, s.stepLblDone]}>{step.label}</Text>
                    <Text style={s.stepDesc}>{step.description}</Text>
                  </View>
                  <View style={s.pts}>
                    <Text style={[s.ptsTxt, s.ptsTxtDone]}>{step.points} pts</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ── Etiquetas ── */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Ionicons name="pricetags-outline" size={18} color="#7c3aed" />
              <Text style={s.sectionTitle}>Tus etiquetas</Text>
              <View style={s.tagCounter}>
                <Text style={s.tagCounterTxt}>{selectedTags.length}/3</Text>
              </View>
            </View>
            <Text style={s.sectionSub}>Máximo 3 etiquetas para que los clientes te encuentren</Text>

            {/* Seleccionadas */}
            <View style={s.tagsSelectedRow}>
              {selectedTags.length === 0 ? (
                <Text style={s.tagsEmptyHint}>Toca una sugerencia para agregar</Text>
              ) : selectedTags.map(tag => (
                <TouchableOpacity key={tag} onPress={() => toggleTag(tag)} style={s.tagSelected} activeOpacity={0.75}>
                  <Text style={s.tagSelectedTxt}>{tag}</Text>
                  <Ionicons name="close-circle" size={14} color="rgba(255,255,255,0.85)" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Sugerencias según categoría */}
            {selectedTags.length < 3 && (
              <View style={s.tagsSuggestBox}>
                <Text style={s.tagsSuggestLbl}>Sugeridas para tu categoría:</Text>
                <View style={s.tagsSuggestRow}>
                  {getTagSuggestions()
                    .filter(t => !selectedTags.includes(t))
                    .slice(0, 7)
                    .map(tag => (
                      <TouchableOpacity key={tag} onPress={() => toggleTag(tag)} style={s.tagSuggest} activeOpacity={0.75}>
                        <Text style={s.tagSuggestTxt}>+ {tag}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            )}

            {/* Input etiqueta personalizada */}
            {selectedTags.length < 3 && (
              <View style={s.tagInputRow}>
                <TextInput
                  style={s.tagInput}
                  value={customTagInput}
                  onChangeText={setCustomTagInput}
                  placeholder="Escribe una etiqueta..."
                  placeholderTextColor="rgba(109,40,217,0.35)"
                  onSubmitEditing={handleAddCustomTag}
                  returnKeyType="done"
                  maxLength={25}
                />
                <TouchableOpacity
                  onPress={handleAddCustomTag}
                  disabled={!customTagInput.trim()}
                  style={[s.tagInputBtn, !customTagInput.trim() && s.tagInputBtnDisabled]}
                  activeOpacity={0.75}
                >
                  <Ionicons name="add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            {selectedTags.length > 0 && (
              <TouchableOpacity onPress={handleSaveTags} disabled={tagsSaving} style={s.tagSaveBtn} activeOpacity={0.8}>
                <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.tagSaveBtnInner}>
                  <Text style={s.tagSaveTxt}>{tagsSaving ? 'Guardando...' : 'Guardar etiquetas'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* ── Modo de entrega ── */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Ionicons name="cube-outline" size={18} color="#7c3aed" />
              <Text style={s.sectionTitle}>¿Cómo entregas tu arte?</Text>
            </View>
            <Text style={s.sectionSub}>Selecciona el modo en que trabajas con tus clientes</Text>
            <View style={s.deliveryGrid}>
              {DELIVERY_OPTIONS.map((opt) => {
                const active = deliveryMode === opt.id;
                return (
                  <TouchableOpacity key={opt.id} onPress={() => setDeliveryMode(opt.id)} activeOpacity={0.82} style={s.delivCard}>
                    {active ? (
                      <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.delivInner}>
                        <Ionicons name={opt.icon as any} size={24} color="#fff" />
                        <Text style={[s.delivLbl, s.delivLblActive]}>{opt.label}</Text>
                        <Text style={s.delivSubActive} numberOfLines={2}>{opt.sub}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={s.delivInactive}>
                        <Ionicons name={opt.icon as any} size={24} color="rgba(124,58,237,0.5)" />
                        <Text style={s.delivLbl}>{opt.label}</Text>
                        <Text style={s.delivSub} numberOfLines={2}>{opt.sub}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Legal ── */}
          <View style={s.legalCard}>
            <View style={s.legalTop}>
              <LinearGradient colors={['#1e1b4b', '#4c1d95']} style={s.legalIcon}>
                <Ionicons name="shield-checkmark" size={20} color="#fff" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={s.legalTitle}>Validación y Legal</Text>
                <Text style={s.legalSub}>Lee y acepta cada política para activar tu perfil</Text>
              </View>
            </View>

            {([
              { key: 'terms'   as const, value: acceptedTerms,   set: setAcceptedTerms,   label: 'Términos y condiciones' },
              { key: 'privacy' as const, value: acceptedPrivacy, set: setAcceptedPrivacy, label: 'Política de privacidad' },
              { key: 'age'     as const, value: acceptedAge,     set: setAcceptedAge,     label: 'Soy mayor de 18 años' },
            ]).map((item) => (
              <View key={item.key} style={s.checkRow}>
                <TouchableOpacity onPress={() => item.set(!item.value)} style={[s.checkbox, item.value && s.checkboxOn]}>
                  {item.value && <Ionicons name="checkmark" size={14} color="#fff" />}
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={[s.checkLbl, item.value && s.checkLblOn]}>{item.label}</Text>
                </View>
                <TouchableOpacity onPress={() => setOpenPolicy(item.key)} style={s.readBtn} activeOpacity={0.75}>
                  <Text style={s.readBtnTxt}>Leer</Text>
                  <Ionicons name="chevron-forward" size={12} color="#7c3aed" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* ── Activar ── */}
          <TouchableOpacity onPress={() => {
            if (!canActivate) {
              Alert.alert(
                'Perfil incompleto',
                `Completa el 100% de tu perfil para activarlo.\nActualmente llevas ${completionPct}%.`
              );
              return;
            }
            setProfileActivated(true);
            Alert.alert('¡Perfil activado!', 'Ya eres visible para clientes en Medellín. ¡Bienvenido!');
          }} disabled={profileActivated} activeOpacity={canActivate ? 0.88 : 1} style={s.activateWrap}>
            <LinearGradient
              colors={
                profileActivated ? ['#10b981', '#059669']
                : canActivate    ? ['#7c3aed', '#2563eb']
                :                  ['rgba(124,58,237,0.3)', 'rgba(37,99,235,0.3)']
              }
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={s.activateBtn}
            >
              <Ionicons name={profileActivated ? 'checkmark-circle' : 'rocket'} size={20} color="#fff" />
              <Text style={s.activateTxt}>
                {profileActivated ? 'Perfil activo' : 'Activar perfil de artista'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {!canActivate && !profileActivated && (
            <Text style={s.activateHint}>
              Necesitas el 100% para activar — te faltan {100 - completionPct} puntos
            </Text>
          )}

          <View style={s.tip}>
            <Ionicons name="bulb-outline" size={20} color="#f59e0b" />
            <Text style={s.tipTxt}>
              Un perfil completo recibe hasta <Text style={s.tipBold}>3× más solicitudes</Text> de clientes en tu zona.
            </Text>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Policy modal */}
      <PolicyModal
        policy={openPolicy}
        onClose={() => setOpenPolicy(null)}
        alreadyAccepted={
          openPolicy === 'terms'   ? acceptedTerms   :
          openPolicy === 'privacy' ? acceptedPrivacy :
          openPolicy === 'age'     ? acceptedAge     : false
        }
        onAccept={() => {
          if (openPolicy === 'terms')   setAcceptedTerms(true);
          if (openPolicy === 'privacy') setAcceptedPrivacy(true);
          if (openPolicy === 'age')     setAcceptedAge(true);
        }}
      />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3e8ff', gap: 10 },
  closeBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#faf5ff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95' },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  availLabel: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#9ca3af' },
  availOn: { color: '#7c3aed' },

  content: { paddingBottom: 24 },

  hero: { marginHorizontal: 16, marginTop: 16, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center' },
  heroSup: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(255,255,255,0.85)', marginBottom: 4 },
  heroPct: { fontSize: 48, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff', lineHeight: 52 },
  heroMsg: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(255,255,255,0.85)', marginTop: 6 },
  heroCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  heroCirclePct: { fontSize: 20, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff' },
  heroCircleLbl: { fontSize: 9, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(255,255,255,0.85)' },

  progressWrap: { marginHorizontal: 16, marginTop: 16 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLbl: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#4c1d95' },
  progressPts: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#9333ea' },
  progressBg: { height: 8, backgroundColor: '#e9d5ff', borderRadius: 4, overflow: 'hidden' },
  progressBar: { height: 8, borderRadius: 4 },

  bioEditor: { marginHorizontal: 16, marginTop: 16, backgroundColor: '#faf5ff', borderRadius: 16, padding: 16, borderWidth: 1.5, borderColor: '#e9d5ff' },
  bioEditorTitle: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95', marginBottom: 10 },
  bioInput: { backgroundColor: '#fff', borderRadius: 12, padding: 12, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#1e1b4b', minHeight: 100, borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)', textAlignVertical: 'top' },
  bioActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  bioCancel: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.2)', alignItems: 'center' },
  bioCancelTxt: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },
  bioSave: { flex: 2, borderRadius: 12, overflow: 'hidden' },
  bioSaveGrad: { paddingVertical: 12, alignItems: 'center' },
  bioSaveTxt: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },

  section: { marginHorizontal: 16, marginTop: 20 },
  sectionLbl: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95', marginBottom: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  sectionSub: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.5)', marginBottom: 14 },

  stepCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#faf5ff', borderRadius: 14, padding: 12, marginBottom: 8, borderWidth: 1.5, borderColor: '#e9d5ff', gap: 10 },
  stepDone: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  stepIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f3e8ff', alignItems: 'center', justifyContent: 'center' },
  stepIconDone: { backgroundColor: '#dcfce7' },
  stepBody: { flex: 1 },
  stepLbl: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95', marginBottom: 2 },
  stepLblDone: { color: '#166534' },
  stepDesc: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: '#6b7280', lineHeight: 15 },
  stepAction: { borderRadius: 20, overflow: 'hidden' },
  stepActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  stepActionTxt: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  pts: { backgroundColor: '#dcfce7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  ptsTxt: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#9333ea' },
  ptsTxtDone: { color: '#16a34a' },

  deliveryGrid: { flexDirection: 'row', gap: 8 },
  delivCard: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  delivInner: { padding: 14, gap: 6, alignItems: 'center', minHeight: 120, justifyContent: 'center' },
  delivInactive: { padding: 14, gap: 6, alignItems: 'center', minHeight: 120, justifyContent: 'center', backgroundColor: '#faf5ff', borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.15)', borderRadius: 16 },
  delivLbl: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95', textAlign: 'center' },
  delivLblActive: { color: '#fff' },
  delivSub: { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.5)', textAlign: 'center', lineHeight: 14 },
  delivSubActive: { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 14 },

  legalCard: { marginHorizontal: 16, marginTop: 20, backgroundColor: '#faf5ff', borderRadius: 18, padding: 18, borderWidth: 1.5, borderColor: '#e9d5ff' },
  legalTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  legalIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  legalTitle: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  legalSub: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.5)', marginTop: 2 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: 'rgba(124,58,237,0.3)', alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  checkLbl: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#4c1d95' },
  checkLblOn: { color: '#166534' },
  readBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: 'rgba(124,58,237,0.08)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(124,58,237,0.15)' },
  readBtnTxt: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },

  activateWrap: { marginHorizontal: 16, marginTop: 20, borderRadius: 16, overflow: 'hidden' },
  activateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  activateTxt: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  activateHint: { textAlign: 'center', marginTop: 10, marginHorizontal: 16, fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.5)' },

  tip: { marginHorizontal: 16, marginTop: 20, backgroundColor: '#fffbeb', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderWidth: 1, borderColor: '#fde68a' },
  tipTxt: { flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#78350f', lineHeight: 18 },
  tipBold: { fontFamily: 'PlusJakartaSans_700Bold', color: '#92400e' },

  // Tags
  tagCounter: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(124,58,237,0.1)',
    borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  tagCounterTxt: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
  tagsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
  },
  tagChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 13, paddingVertical: 7,
    borderRadius: 50,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.18)',
  },
  tagChipActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  tagChipDisabled: {
    borderColor: 'rgba(124,58,237,0.08)',
  },
  tagChipTxt: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#4c1d95',
  },
  tagChipTxtActive: {
    color: '#fff',
  },
  // Tags — compact redesign
  tagsSelectedRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12, minHeight: 32,
  },
  tagSelected: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#7c3aed', borderRadius: 50,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  tagSelectedTxt: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#fff',
  },
  tagsEmptyHint: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.4)', fontStyle: 'italic',
    paddingVertical: 4,
  },
  tagsSuggestBox: {
    backgroundColor: 'rgba(124,58,237,0.05)', borderRadius: 14,
    padding: 12, borderWidth: 1, borderColor: 'rgba(124,58,237,0.1)',
  },
  tagsSuggestLbl: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(109,40,217,0.5)', marginBottom: 10, letterSpacing: 0.3,
  },
  tagsSuggestRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
  },
  tagSuggest: {
    backgroundColor: 'rgba(124,58,237,0.08)', borderRadius: 50,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.18)',
  },
  tagSuggestTxt: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed',
  },
  tagInputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#1e1b4b',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.2)',
  },
  tagInputBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#7c3aed',
    alignItems: 'center', justifyContent: 'center',
  },
  tagInputBtnDisabled: {
    backgroundColor: 'rgba(124,58,237,0.25)',
  },
  tagSaveBtn: {
    marginTop: 14, borderRadius: 14, overflow: 'hidden',
  },
  tagSaveBtnInner: {
    paddingVertical: 13, paddingHorizontal: 20, alignItems: 'center',
  },
  tagSaveTxt: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff',
  },
});
