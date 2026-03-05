import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, Alert,
  LayoutAnimation, UIManager, ScrollView
} from 'react-native';
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
  onServicesUpdated?: () => void;
}

// ── Formateador Pro ─────────────────────────────────────────
const formatPrice = (price: any) => {
  const n = typeof price === 'string' ? parseFloat(price) : price;
  if (!n || isNaN(n) || n <= 0) return null;
  return new Intl.NumberFormat('es-CO').format(n);
};

// ── ServiceCard: El corazón del diseño ───────────────────────
const ServiceCard = ({ 
  service, 
  isOwner, 
  onEdit, 
  onDelete 
}: { 
  service: APIService, 
  isOwner: boolean, 
  onEdit: (s: APIService) => void, 
  onDelete: (s: APIService) => void 
}) => {
  const [expanded, setExpanded] = useState(false);
  const priceStr = formatPrice(service.price);
  
  const toggle = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={[sc.card, expanded && sc.cardActive]}>
      <TouchableOpacity activeOpacity={0.9} onPress={toggle} style={sc.mainRow}>
        
        {/* IZQUIERDA: VISUAL ESTILO BOOKING */}
        <View style={sc.imageContainer}>
          <LinearGradient colors={['#7c3aed20', '#7c3aed05']} style={sc.imagePlaceholder}>
            <Ionicons name="brush" size={32} color="#7c3aed" />
          </LinearGradient>
          {!!service.deliveryDays && (
            <View style={sc.floatingBadge}>
              <Text style={sc.badgeText}>{service.deliveryDays}d</Text>
            </View>
          )}
        </View>

        {/* DERECHA: INFO REFINADA */}
        <View style={sc.content}>
          <View style={sc.topHeader}>
            <Text style={sc.category}>{service.category || 'Servicio'}</Text>
            <View style={sc.statusRow}>
              <View style={sc.dotStatus} />
              <Text style={sc.statusText}>Activo</Text>
            </View>
          </View>

          <Text style={sc.name} numberOfLines={1}>{service.name}</Text>
          
          <View style={sc.featureRow}>
            <Ionicons name="time-outline" size={14} color="#64748b" />
            <Text style={sc.featureText}>{service.duration || 'Flexible'}</Text>
          </View>

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
          
          {isOwner && (
            <View style={sc.ownerActions}>
              <TouchableOpacity onPress={() => onEdit(service)} style={sc.btnEdit}>
                <Ionicons name="pencil-outline" size={16} color="#1e293b" />
                <Text style={sc.btnEditText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(service)} style={[sc.btnEdit, sc.btnDelete]}>
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
                <Text style={[sc.btnEditText, { color: '#ef4444' }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
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
  onServicesUpdated,
}) => {
  const [localServices, setLocalServices] = useState<APIService[]>(services);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<APIService | null>(null);

  useEffect(() => { setLocalServices(services); }, [services]);

  const handleSave = async (formData: ServiceFormData) => {
    // Aquí implementas tu lógica de guardado de BuscArt
    setModalVisible(false);
    onServicesUpdated?.();
  };

  const handleDelete = (s: APIService) => {
    Alert.alert("Eliminar", "¿Seguro que quieres borrar este servicio?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar", style: "destructive", onPress: () => {
        setLocalServices(prev => prev.filter(item => item.id !== s.id));
      }}
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
          >
            <LinearGradient colors={['#7c3aed', '#6d28d9']} style={st.addGradient}>
              <Ionicons name="add" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {localServices.map((s, i) => (
        <ServiceCard 
          key={s.id || i} 
          service={s} 
          isOwner={isOwner} 
          onEdit={(service) => { setEditingService(service); setModalVisible(true); }}
          onDelete={handleDelete}
        />
      ))}

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

// ── ESTILOS ────────────────────────────────────────────────────
const sc = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 8,
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
  mainRow: { flexDirection: 'row', gap: 16 },
  imageContainer: { position: 'relative' },
  imagePlaceholder: { width: 110, height: 130, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  floatingBadge: { position: 'absolute', top: -4, left: -4, backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 9, fontFamily: 'PlusJakartaSans_800ExtraBold' },
  content: { flex: 1, justifyContent: 'space-between', paddingVertical: 4 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  category: { fontSize: 9, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#7c3aed', textTransform: 'uppercase' },
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
});

const st = StyleSheet.create({
  container: { padding: 8, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 16, fontFamily: 'PlusJakartaSans_900Black', color: '#0f172a' },
  subtitle: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: '#94a3b8' },
  addButton: { width: 44, height: 44, borderRadius: 15, overflow: 'hidden' },
  addGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});