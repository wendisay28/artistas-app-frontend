import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, Alert,
  LayoutAnimation, UIManager, Image
} from 'react-native';
import { uploadToServer } from '../../../../hooks/useProfileImageUpload';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

// Servicios y Tipos (Ajusta las rutas según tu proyecto)
import { Service as APIService, servicesService } from '../../../../services/api/services';
import { EditServiceModal, ServiceFormData } from '../modals/EditServiceModal';

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ServicesSectionProps {
  services: APIService[];
  isOwner: boolean;
  artistCategoryId?: string;
  artistRoleId?: string;
  coverImageUrl?: string;
  onServicesUpdated?: () => void;
  onHireService?: (service: APIService) => void;
}

// ── Formateador Pro ─────────────────────────────────────────
const formatPrice = (price: any) => {
  const n = typeof price === 'string' ? parseFloat(price) : price;
  if (!n || isNaN(n)) return null;
  if (n <= 0) return 'Gratis';
  return new Intl.NumberFormat('es-CO').format(n);
};

// ── ServiceCard: El corazón del diseño ───────────────────────
const ServiceCard = ({
  service,
  isOwner,
  onEdit,
  onDelete,
  onHire,
}: {
  service: APIService,
  isOwner: boolean,
  onEdit: (s: APIService) => void,
  onDelete: (s: APIService) => void,
  onHire?: (s: APIService) => void,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const priceStr = formatPrice(service.price);
  
  const toggle = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={[sc.card, expanded && sc.cardActive]}>
      <TouchableOpacity activeOpacity={0.9} onPress={toggle} style={sc.mainRow} accessibilityLabel={`Servicio: ${service.name}`} accessibilityHint="Presiona para ver más detalles">
        
        {/* IZQUIERDA: VISUAL ESTILO BOOKING */}
        <View style={sc.imageContainer}>
          {service.images?.[0] && !imageError ? (
            <Image
              source={{ uri: service.images[0] }}
              style={sc.imagePlaceholder}
              contentFit="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <LinearGradient
              colors={['#c4b5fd', '#a78bfa', '#818cf8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={sc.imagePlaceholder}
            >
              <View style={sc.placeholderDeco1} />
              <View style={sc.placeholderDeco2} />
            </LinearGradient>
          )}
          {!!service.deliveryDays && (
            <View style={sc.floatingBadge}>
              <Text style={sc.badgeText}>{service.deliveryDays}d</Text>
            </View>
          )}
        </View>

        {/* DERECHA: INFO REFINADA */}
        <View style={sc.content}>
          <View style={sc.topHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={sc.category}>{service.category || 'Servicio'}</Text>
              {!!service.packageType && service.packageType !== 'single' && (
                <View style={sc.packagePill}>
                  <Text style={sc.packagePillText}>
                    {service.packageType === 'weekly' ? 'Semanal' : 
                     service.packageType === 'monthly' ? 'Mensual' : 'Pack'}
                  </Text>
                </View>
              )}
            </View>
            <View style={sc.statusRow}>
              <View style={[sc.dotStatus, service.isActive === false && { backgroundColor: '#ef4444' }]} />
              <Text style={sc.statusText}>{service.isActive !== false ? 'Activo' : 'Inactivo'}</Text>
            </View>
          </View>

          <Text style={sc.name} numberOfLines={1}>{service.name}</Text>

          <View style={sc.featureRow}>
            <Ionicons name="time-outline" size={14} color="#64748b" />
            <Text style={sc.featureText}>{service.duration || 'Flexible'}</Text>
          </View>

          {!!(service.includedCount && service.unit) && (
            <View style={sc.featureRow}>
              <Ionicons name="layers-outline" size={14} color="#64748b" />
              <Text style={sc.featureText}>{service.includedCount} {service.unit}</Text>
            </View>
          )}

          <View style={sc.priceRow}>
            <View>
              <Text style={sc.priceLabel}>Precio base</Text>
              <View style={sc.priceFlex}>
                <Text style={sc.currency}>$</Text>
                <Text style={sc.amount}>{priceStr || '---'}</Text>
              </View>
            </View>
            
            <View style={[sc.cta, { backgroundColor: expanded ? '#7c3aed' : '#f5f3ff' }]}>
              <Ionicons 
                name={expanded ? "chevron-up" : "chevron-forward"} 
                size={16} 
                color={expanded ? "#fff" : "#7c3aed"} 
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* ÁREA EXPANDIBLE */}
      {expanded && (
        <View style={sc.expandedArea}>
          <View style={sc.separator} />
          <Text style={sc.descriptionTitle}>Detalles del servicio</Text>
          <Text style={sc.description}>{service.description || 'Sin descripción disponible.'}</Text>
          
          {isOwner ? (
            <View style={sc.ownerActions}>
              <TouchableOpacity onPress={() => onEdit(service)} style={sc.btnEdit} accessibilityLabel="Editar servicio" accessibilityHint="Abre el formulario para editar este servicio">
                <Ionicons name="pencil-outline" size={16} color="#1e293b" />
                <Text style={sc.btnEditText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(service)} style={[sc.btnEdit, sc.btnDelete]} accessibilityLabel="Eliminar servicio" accessibilityHint="Elimina este servicio permanentemente">
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
                <Text style={[sc.btnEditText, { color: '#ef4444' }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => onHire?.(service)} style={sc.hireBtn} accessibilityLabel="Contratar servicio">
              <LinearGradient colors={['#7c3aed', '#6d28d9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={sc.hireGradient}>
                <Ionicons name="briefcase-outline" size={16} color="#fff" />
                <Text style={sc.hireBtnText}>Contratar este servicio</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

// ── COMPONENTE PRINCIPAL ───────────────────────────────────────
export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services = [],
  isOwner,
  artistCategoryId,
  artistRoleId,
  coverImageUrl,
  onServicesUpdated,
  onHireService,
}) => {
  const [localServices, setLocalServices] = useState<APIService[]>(services);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<APIService | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { setLocalServices(services); }, [services]);

  const handleSave = async (formData: ServiceFormData) => {
    if (isSaving) return;
    setIsSaving(true);

    const tempId = -Date.now(); // ID temporal negativo para no colisionar
    const optimisticService: APIService = {
      id: tempId as any,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      currency: formData.currency || 'COP',
      duration: formData.duration,
      category: formData.category,
      icon: formData.icon,
      packageType: formData.packageType === 'simple' ? 'single' : formData.packageType as any,
      includedCount: parseInt(formData.includedCount) || 1,
      deliveryDays: parseInt(formData.deliveryDays) || 0,
      unit: formData.unit,
      images: formData.imageUrl ? [formData.imageUrl] : [], // URI local para mostrar ya
    };

    // Cierra modal y actualiza UI inmediatamente
    setModalVisible(false);
    if (editingService?.id) {
      setLocalServices(prev => prev.map(s =>
        s.id === editingService.id ? { ...s, ...optimisticService, id: editingService.id } : s
      ));
    } else {
      setLocalServices(prev => [...prev, optimisticService]);
    }

    try {
      let imageUrl = formData.imageUrl;
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = await uploadToServer(imageUrl, 'covers');
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        currency: formData.currency || 'COP',
        duration: formData.duration,
        category: formData.category,
        icon: formData.icon,
        packageType: formData.packageType === 'simple' ? 'single' : formData.packageType as any,
        includedCount: parseInt(formData.includedCount) || 1,
        deliveryDays: parseInt(formData.deliveryDays) || 0,
        unit: formData.unit,
        images: imageUrl ? [imageUrl] : [],
      };

      if (editingService?.id) {
        await servicesService.updateService(editingService.id, payload);
      } else {
        await servicesService.createService(payload);
      }

      onServicesUpdated?.(); // sincroniza IDs reales del servidor
    } catch (error) {
      // Revertir cambio optimista
      if (editingService?.id) {
        setLocalServices(services);
      } else {
        setLocalServices(prev => prev.filter(s => s.id !== (tempId as any)));
      }
      console.error('❌ Error al guardar servicio:', error);
      Alert.alert('Error', 'No se pudo guardar el servicio');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (s: APIService) => {
    Alert.alert("Eliminar", "¿Seguro que quieres borrar este servicio?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Borrar",
        style: "destructive",
        onPress: async () => {
          // Elimina de UI inmediatamente
          setLocalServices(prev => prev.filter(service => service.id !== s.id));

          try {
            if (s.id) await servicesService.deleteService(s.id);
            onServicesUpdated?.();
          } catch (error) {
            // Revertir si falla
            setLocalServices(prev => [...prev, s]);
            console.error('❌ Error al eliminar servicio:', error);
            Alert.alert('Error', 'No se pudo eliminar el servicio');
          }
        }
      },
    ]);
  };

  return (
    <View style={st.container}>
      <View style={st.header}>
        <View>
          <Text style={st.title}>Servicios Profesionales</Text>
          <Text style={st.subtitle}>{localServices.length} opciones para contratar</Text>
        </View>
        {isOwner && (
          <TouchableOpacity 
            onPress={() => { setEditingService(null); setModalVisible(true); }}
            style={st.addButton}
            accessibilityLabel="Agregar nuevo servicio"
            accessibilityHint="Abre el formulario para crear un nuevo servicio"
          >
            <LinearGradient colors={['#7c3aed', '#6d28d9']} style={st.addGradient}>
              <Ionicons name="add" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {localServices.map((s, i) => (
        <React.Fragment key={s.id || i}>
          {i > 0 && <View style={sc.cardDivider} />}
          <ServiceCard
            service={s}
            isOwner={isOwner}
            onEdit={(service) => { setEditingService(service); setModalVisible(true); }}
            onDelete={handleDelete}
            onHire={onHireService}
          />
        </React.Fragment>
      ))}

      <EditServiceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        artistCategoryId={artistCategoryId}
        artistRoleId={artistRoleId}
        coverImageUrl={coverImageUrl}
        loading={isSaving}
        service={editingService ? { ...editingService, price: editingService.price?.toString() } as any : undefined}
      />
    </View>
  );
};

// ── ESTILOS ────────────────────────────────────────────────────
const sc = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 4,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    width: '100%',
    alignSelf: 'stretch',
    ...Platform.select({
      ios: { shadowColor: '#64748b', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 4 }
    })
  },
  cardActive: { borderColor: '#7c3aed30', backgroundColor: '#fafaff' },
  cardDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  mainRow: { flexDirection: 'row', gap: 16 },
  imageContainer: { position: 'relative' },
  imagePlaceholder: { width: 110, height: 130, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  placeholderDeco1: { position: 'absolute', width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.08)', top: -20, right: -20 },
  placeholderDeco2: { position: 'absolute', width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.06)', bottom: -15, left: -10 },
floatingBadge: { position: 'absolute', top: -4, left: -4, backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 9, fontFamily: 'PlusJakartaSans_800ExtraBold' },
  content: { flex: 1, justifyContent: 'space-between', paddingVertical: 4 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  category: { fontSize: 9, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#7c3aed', textTransform: 'uppercase' },
  packagePill: { backgroundColor: '#f5f3ff', borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2, borderWidth: 1, borderColor: '#ddd6fe' },
  packagePillText: { fontSize: 8, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed', textTransform: 'uppercase' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dotStatus: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#10b981' },
  statusText: { fontSize: 9, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#64748b' },
  name: { fontSize: 16, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#0f172a', marginVertical: 2 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  featureText: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: '#64748b' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10 },
  priceLabel: { fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold', color: '#94a3b8' },
  priceFlex: { flexDirection: 'row', alignItems: 'baseline' },
  currency: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#0f172a' },
  amount: { fontSize: 20, fontFamily: 'PlusJakartaSans_900Black', color: '#0f172a', letterSpacing: -0.5 },
  cta: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  expandedArea: { marginTop: 16, paddingHorizontal: 4, paddingBottom: 4 },
  separator: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 12 },
  descriptionTitle: { fontSize: 12, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#0f172a', marginBottom: 6 },
  description: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#475569', lineHeight: 20 },
  ownerActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  btnEdit: { flex: 1, flexDirection: 'row', backgroundColor: '#f8fafc', padding: 12, borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  btnDelete: { borderColor: '#fee2e2', backgroundColor: '#fff5f5' },
  btnEditText: { color: '#1e293b', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 12 },
  hireBtn: { marginTop: 16, borderRadius: 16, overflow: 'hidden' },
  hireGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 20 },
  hireBtnText: { color: '#fff', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14 },
});

const st = StyleSheet.create({
  container: { padding: 4, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 16, fontFamily: 'PlusJakartaSans_900Black', color: '#0f172a' },
  subtitle: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: '#94a3b8' },
  addButton: { width: 44, height: 44, borderRadius: 15, overflow: 'hidden' },
  addGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});