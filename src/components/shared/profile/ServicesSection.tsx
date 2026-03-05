import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, Alert,
  LayoutAnimation, UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Service as APIService } from '../../../../services/api/services';
import { EditServiceModal, ServiceFormData } from '../modals/EditServiceModal';
import { servicesService } from '../../../../services/api/services';

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ServicesSectionProps {
  services: APIService[];
  isOwner: boolean;
  artistCategoryId?: string;
  artistRoleId?: string;
  onServicesUpdated?: () => void;
}

// ── Formateador de precio optimizado ─────────────────────────────────────────

const formatPrice = (price: any): string | null => {
  const n = typeof price === 'string' ? parseFloat(price) : price;
  if (!n || isNaN(n) || n <= 0) return null;
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(n);
};

// ── Mapa de iconos por categoría ─────────────────────────────────────────────

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const CATEGORY_META: Record<string, { icon: IoniconsName; color: string }> = {
  musica:     { icon: 'musical-notes-outline', color: '#7c3aed' },
  fotografia: { icon: 'camera-outline',        color: '#0369a1' },
  video:      { icon: 'videocam-outline',       color: '#dc2626' },
  diseno:     { icon: 'color-palette-outline',  color: '#d97706' },
  danza:      { icon: 'body-outline',           color: '#db2777' },
  teatro:     { icon: 'mic-outline',            color: '#7c3aed' },
  escritura:  { icon: 'create-outline',         color: '#059669' },
  clases:     { icon: 'school-outline',         color: '#2563eb' },
  produccion: { icon: 'headset-outline',        color: '#374151' },
  // Categorías adicionales comunes
  general:    { icon: 'briefcase-outline',      color: '#7c3aed' },
  creative:   { icon: 'sparkles-outline',       color: '#8b5cf6' },
  arte:       { icon: 'brush-outline',          color: '#ec4899' },
  marketing:  { icon: 'trending-up-outline',    color: '#10b981' },
  tecnologia: { icon: 'laptop-outline',         color: '#3b82f6' },
  consultoria:{ icon: 'business-outline',       color: '#f59e0b' },
  salud:      { icon: 'heart-outline',          color: '#ef4444' },
  deporte:    { icon: 'fitness-outline',        color: '#06b6d4' },
  comida:     { icon: 'restaurant-outline',     color: '#f97316' },
  viajes:     { icon: 'airplane-outline',        color: '#0ea5e9' },
  // Categorías específicas de tus servicios
  sesion:     { icon: 'camera-outline',        color: '#0369a1' },
  evento:     { icon: 'calendar-outline',      color: '#dc2626' },
  show:       { icon: 'musical-notes-outline', color: '#7c3aed' },
  fotos:      { icon: 'camera-outline',        color: '#0369a1' },
  default:    { icon: 'briefcase-outline',      color: '#7c3aed' },
};

function getCatMeta(category?: string, serviceName?: string) {
  // Primero analizar el nombre del servicio (prioridad máxima)
  if (serviceName) {
    const nameKey = serviceName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Buscar palabras clave en el nombre del servicio
    if (nameKey.includes('fot') || nameKey.includes('foto')) return CATEGORY_META.fotografia;
    if (nameKey.includes('músic') || nameKey.includes('music') || nameKey.includes('show')) return CATEGORY_META.musica;
    if (nameKey.includes('sesión') || nameKey.includes('sesion')) return CATEGORY_META.fotografia;
    if (nameKey.includes('evento')) return CATEGORY_META.evento;
    if (nameKey.includes('arte')) return CATEGORY_META.arte;
  }
  
  // Si no hay coincidencia en el nombre, usar la categoría asignada
  if (category) {
    const key = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const found = Object.entries(CATEGORY_META).find(([k]) => key.includes(k))?.[1];
    if (found) return found;
  }
  
  return CATEGORY_META.default;
}

// ── DetailChip ───────────────────────────────────────────────────────────────

const DetailChip: React.FC<{ icon: IoniconsName; label: string }> = ({ icon, label }) => (
  <View style={ch.wrap}>
    <Ionicons name={icon} size={11} color="#64748b" />
    <Text style={ch.text}>{label}</Text>
  </View>
);

const ch = StyleSheet.create({
  wrap: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 5,
    backgroundColor: '#f1f5f9',
    borderRadius: 8, 
    paddingHorizontal: 8, 
    paddingVertical: 4,
  },
  text: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#475569' },
});

// ── ServiceCard ───────────────────────────────────────────────────────────────

const ServiceCard: React.FC<{
  service: APIService;
  index: number;
  showEdit?: boolean;
  onEdit?: (s: APIService) => void;
  onDelete?: (s: APIService) => void;
  loading?: boolean;
}> = ({ service, index, showEdit, onEdit, onDelete, loading }) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(p => !p);
  };

  const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

  const {
    name, price, description, duration, category,
    packageType, includedCount, deliveryDays,
  } = service;

  const unit        = (service as any).unit || 'unidades';
  const priceStr    = formatPrice(price);
  const catMeta     = getCatMeta(category, name);
  const periodLabel = packageType === 'weekly' ? '/sem' : packageType === 'monthly' ? '/mes' : null;

  return (
    <View style={[sc.card, expanded && sc.cardExpanded]}>
      <LinearGradient
        colors={['#6B7280', '#374151']}
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
        style={sc.accent}
      />

      <View style={sc.body}>
        <View style={sc.mainRow}>
          <View style={sc.centerBlock}>
            <View style={sc.nameRow}>
              <View style={[sc.iconBox, { backgroundColor: catMeta.color + '12', borderColor: catMeta.color + '22' }]}>
                <Ionicons name={catMeta.icon} size={14} color={catMeta.color} />
              </View>
              <Text style={sc.name} numberOfLines={2}>{name || 'Servicio'}</Text>
            </View>
        </View>

          {/* Botones de editar y eliminar */}
          {showEdit && (
            <View style={sc.editRow}>
              <TouchableOpacity 
                onPress={() => onEdit?.(service)} 
                style={[sc.editBtn, loading && sc.editBtnDisabled]} 
                hitSlop={HIT_SLOP} 
                accessibilityLabel="Editar servicio"
                disabled={loading}
                activeOpacity={0.7}
              >
                {loading ? (
                  <Ionicons name="load-circle-outline" size={14} color="#6B7280" />
                ) : (
                  <Ionicons name="pencil-outline" size={14} color="#6B7280" />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => onDelete?.(service)} 
                style={[sc.editBtn, sc.delBtn, loading && sc.editBtnDisabled]} 
                hitSlop={HIT_SLOP} 
                accessibilityLabel="Eliminar servicio"
                disabled={loading}
                activeOpacity={0.7}
              >
                {loading ? (
                  <Ionicons name="load-circle-outline" size={14} color="#ef4444" />
                ) : (
                  <Ionicons name="trash-outline" size={14} color="#ef4444" />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={sc.divider} />

        <View style={sc.chips}>
          {!!(includedCount && includedCount > 0) && <DetailChip icon="layers-outline" label={`${includedCount} ${unit}`} />}
          {!!duration && <DetailChip icon="time-outline" label={duration} />}
          {!!(deliveryDays && deliveryDays > 0) && <DetailChip icon="rocket-outline" label={`${deliveryDays}d entrega`} />}
        </View>

        {expanded && !!description && (
          <View style={sc.descBox}>
            <LinearGradient colors={['#6B7280', '#374151']} style={sc.descBar} />
            <Text style={sc.descText}>{description}</Text>
          </View>
        )}

        <View style={sc.footer}>
          {!!description ? (
            <TouchableOpacity onPress={toggle} activeOpacity={0.7} style={sc.toggleBtn} hitSlop={HIT_SLOP}>
              <Text style={sc.toggleLabel}>{expanded ? 'Ver menos' : 'Detalles'}</Text>
              <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={13} color="#6B7280" />
            </TouchableOpacity>
          ) : <View />}

          {/* Precio con jerarquía visual clara */}
          <View style={sc.priceCol}>
            {priceStr ? (
              <View style={{ alignItems: 'flex-end' }}>
                <View style={sc.priceValueRow}>
                  <Text style={sc.priceNum}>{priceStr}</Text>
                  <Text style={sc.priceCop}>COP</Text>
                </View>
                {periodLabel && <Text style={sc.pricePer}>{periodLabel}</Text>}
              </View>
            ) : (
              <View style={sc.askBadge}>
                <Text style={sc.priceAsk}>A CONVENIR</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

// ── Estilos Actualizados ──────────────────────────────────────────────────────

const sc = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cardExpanded: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  accent: { width: 4 },
  body: { flex: 1, padding: 16 },
  mainRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  num: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_300Light',
    color: 'rgba(124,58,237,0.15)',
    marginTop: -2,
    minWidth: 28,
  },
  centerBlock: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  iconBox: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  name: { flex: 1, fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#0f172a', lineHeight: 20 },
  catPill: { alignSelf: 'flex-start', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 },
  catText: { fontSize: 9, fontFamily: 'PlusJakartaSans_800ExtraBold', textTransform: 'uppercase', letterSpacing: 0.5 },
  
  // Precio mejorado
  priceCol: { alignItems: 'flex-end', justifyContent: 'flex-start' },
  priceValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  priceNum: { fontSize: 22, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', letterSpacing: -0.5 },
  priceCop: { fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold', color: '#6B7280' },
  pricePer: { fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium', color: '#94a3b8' },
  askBadge: { backgroundColor: '#f8fafc', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, borderWidth: 1, borderColor: '#e2e8f0' },
  priceAsk: { fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold', color: '#64748b' },

  divider: { height: 1, backgroundColor: '#f8fafc', marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  descBox: { flexDirection: 'row', gap: 12, backgroundColor: '#fdfbff', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#f5f3ff' },
  descBar: { width: 3, borderRadius: 2 },
  descText: { flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#475569', lineHeight: 20 },
  
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f5f3ff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  toggleLabel: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#6B7280' },
  editRow: { flexDirection: 'row', gap: 8 },
  editBtn: { 
    width: 32, 
    height: 32, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  delBtn: { 
    backgroundColor: 'rgba(239, 68, 68, 0.04)',
    borderColor: 'rgba(239, 68, 68, 0.12)',
  },
  editBtnDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
});

// ── Componente Principal (ServicesSection) ────────────────────────────────────
// (Se mantiene la lógica funcional pero con estilos de contenedor pulidos)

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services = [],
  isOwner,
  artistCategoryId,
  artistRoleId,
  onServicesUpdated,
}) => {
  const [localServices, setLocalServices]   = useState<APIService[]>(services);
  const [modalVisible, setModalVisible]     = useState(false);
  const [editingService, setEditingService] = useState<APIService | null>(null);
  const [loading, setLoading]               = useState<string | null>(null);

  // Sincronizar cuando el padre actualiza la lista (ej. al montar o recargar)
  useEffect(() => { setLocalServices(services); }, [services]);

  const handleAdd  = () => { setEditingService(null); setModalVisible(true); };
  const handleEdit = (s: APIService) => { setEditingService(s); setModalVisible(true); };

  const handleDelete = (s: APIService) => {
    if (!s.id) return;
    Alert.alert('Eliminar servicio', `¿Borrar "${s.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => {
        // Eliminar de la lista local de inmediato
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setLocalServices(prev => prev.filter(x => x.id !== s.id));
        servicesService.deleteService(s.id!).catch(() => {
          Alert.alert('Error', 'No se pudo eliminar');
          setLocalServices(services); // revertir
        });
      }},
    ]);
  };

  const handleSave = (formData: ServiceFormData) => {
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      includedCount: parseInt(formData.includedCount) || 1,
      deliveryDays: parseInt(formData.deliveryDays) || 0,
      weeklyFrequency: parseInt(formData.weeklyFrequency) || 1,
      packageType: formData.packageType === 'simple' ? 'single' : formData.packageType as any,
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setModalVisible(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    if (editingService?.id) {
      // Actualizar tarjeta en local al instante
      const updated: APIService = { ...editingService, ...payload };
      setLocalServices(prev => prev.map(s => s.id === editingService.id ? updated : s));
      // Enviar al backend en background
      servicesService.updateService(editingService.id, payload).catch(() => {
        Alert.alert('Error', 'No se pudo guardar el cambio');
        setLocalServices(services); // revertir si falla
      });
    } else {
      // Crear: mostrar con id temporal y reemplazar con el real
      const tempId = Date.now();
      const tempService: APIService = { ...payload, id: tempId } as any;
      setLocalServices(prev => [...prev, tempService]);
      servicesService.createService(payload)
        .then(created => setLocalServices(prev => prev.map(s => s.id === tempId ? created : s)))
        .catch(() => {
          Alert.alert('Error', 'No se pudo crear el servicio');
          setLocalServices(prev => prev.filter(s => s.id !== tempId));
        });
    }
  };

  return (
    <View style={st.container}>
      <View style={st.header}>
        <View style={st.titleWrap}>
          <View style={st.dot} />
          <Text style={st.title}>Servicios</Text>
          {localServices.length > 0 && (
            <View style={st.badge}><Text style={st.badgeText}>{localServices.length}</Text></View>
          )}
        </View>
        {isOwner && (
          <TouchableOpacity onPress={handleAdd} activeOpacity={0.8}>
            <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={st.addBtn}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={st.addBtnText}>Nuevo</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {localServices.length === 0 ? (
        <View style={st.emptyWrap}>
          <View style={st.emptyInner}>
            <View style={st.emptyIconWrap}>
              <Ionicons name="sparkles-outline" size={32} color="rgba(124,58,237,0.3)" />
            </View>
            <Text style={st.emptyTitle}>Sin servicios aún</Text>
            <Text style={st.emptySub}>{isOwner ? 'Define tus tarifas para empezar a recibir contrataciones.' : 'Este artista no ha publicado servicios.'}</Text>
          </View>
        </View>
      ) : (
        localServices.map((s, i) => (
          <ServiceCard
            key={s.id || i}
            service={s}
            index={i}
            showEdit={isOwner}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading === s.id?.toString()}
          />
        ))
      )}

      <EditServiceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        artistCategoryId={artistCategoryId}
        artistRoleId={artistRoleId}
        service={editingService ? { ...editingService, price: editingService.price?.toString() } as any : undefined}
      />
    </View>
  );
};

const st = StyleSheet.create({
  container: { width: '100%', paddingVertical: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#7c3aed' },
  title: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b', letterSpacing: 1 },
  badge: { backgroundColor: 'rgba(124,58,237,0.1)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#7c3aed' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  addBtnText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  emptyWrap: { borderRadius: 16, overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.18)', borderStyle: 'dashed', backgroundColor: 'rgba(245,243,255,0.4)' },
  emptyInner: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 30, gap: 8 },
  emptyIconWrap: { width: 64, height: 64, borderRadius: 18, backgroundColor: 'rgba(124,58,237,0.07)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  emptySub: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(124,58,237,0.4)', textAlign: 'center', lineHeight: 18, paddingHorizontal: 20 },
});