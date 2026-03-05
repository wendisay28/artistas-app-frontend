import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Tipos e Interfaces (Sincronizado con backend services.ts) ---
interface Service {
  id?: number;
  userId?: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  duration?: string;
  category?: string;
  icon?: string;
  deliveryTag?: string;
  packageType?: 'single' | 'weekly' | 'monthly';
  includedCount?: number;
  deliveryDays?: number;
  weeklyFrequency?: number;
  images?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ServicesListProps {
  services: (Service | string)[];
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

// --- Helpers de Formato e Iconos (Sincronizados con ServicesSection) ---

const formatPrice = (price: any): string | null => {
  const n = typeof price === 'string' ? parseFloat(price) : price;
  if (!n || isNaN(n) || n <= 0) return null;
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(n);
};

const CATEGORY_META: Record<string, { icon: IoniconsName; color: string }> = {
  musica: { icon: 'musical-notes-outline', color: '#7c3aed' },
  fotografia: { icon: 'camera-outline', color: '#0369a1' },
  video: { icon: 'videocam-outline', color: '#dc2626' },
  diseno: { icon: 'color-palette-outline', color: '#d97706' },
  danza: { icon: 'body-outline', color: '#db2777' },
  teatro: { icon: 'mic-outline', color: '#7c3aed' },
  escritura: { icon: 'create-outline', color: '#059669' },
  clases: { icon: 'school-outline', color: '#2563eb' },
  produccion: { icon: 'headset-outline', color: '#374151' },
  arte: { icon: 'brush-outline', color: '#ec4899' },
  evento: { icon: 'calendar-outline', color: '#dc2626' },
  default: { icon: 'briefcase-outline', color: '#7c3aed' },
};

function getCatMeta(category?: string, serviceName?: string) {
  if (serviceName) {
    const nameKey = serviceName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (nameKey.includes('fot') || nameKey.includes('foto')) return CATEGORY_META.fotografia;
    if (nameKey.includes('músic') || nameKey.includes('music') || nameKey.includes('show')) return CATEGORY_META.musica;
    if (nameKey.includes('sesión') || nameKey.includes('sesion')) return CATEGORY_META.fotografia;
    if (nameKey.includes('evento')) return CATEGORY_META.evento;
  }
  if (category) {
    const key = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const found = Object.entries(CATEGORY_META).find(([k]) => key.includes(k))?.[1];
    if (found) return found;
  }
  return CATEGORY_META.default;
}

// --- Subcomponentes ---

const DetailChip: React.FC<{ icon: IoniconsName; label: string }> = ({ icon, label }) => (
  <View style={ch.wrap}>
    <Ionicons name={icon} size={11} color="#64748b" />
    <Text style={ch.text}>{label}</Text>
  </View>
);

const ServiceCardItem: React.FC<{ service: Service }> = ({ service }) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(p => !p);
  };

  const { name, price, description, duration, category, includedCount, deliveryDays, packageType } = service;
  
  const priceStr = formatPrice(price);
  const catMeta = getCatMeta(category, name);
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
        </View>

        <View style={sc.divider} />

        <View style={sc.chips}>
          {!!(includedCount && includedCount > 0) && <DetailChip icon="layers-outline" label={`${includedCount} und`} />}
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
            <TouchableOpacity onPress={toggle} activeOpacity={0.7} style={sc.toggleBtn}>
              <Text style={sc.toggleLabel}>{expanded ? 'Ver menos' : 'Detalles'}</Text>
              <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={13} color="#6B7280" />
            </TouchableOpacity>
          ) : <View />}

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

// --- Componente Principal ---

export const ServicesList: React.FC<ServicesListProps> = ({ services }) => {
  return (
    <View style={st.container}>
      {services.map((item, i) => {
        // Normalizar entrada si es string o Service
        const serviceObj: Service = typeof item === 'string' 
          ? { name: item } 
          : item;

        return <ServiceCardItem key={serviceObj.id || i} service={serviceObj} />;
      })}
    </View>
  );
};

// --- Estilos unificados ---

const st = StyleSheet.create({
  container: { width: '100%', paddingHorizontal: 14, paddingVertical: 8 },
});

const ch = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#f1f5f9', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  text: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#475569' },
});

const sc = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, overflow: 'hidden', flexDirection: 'row' },
  cardExpanded: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 },
  accent: { width: 4 },
  body: { flex: 1, padding: 16 },
  mainRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  centerBlock: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  iconBox: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  name: { flex: 1, fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#0f172a', lineHeight: 20 },
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
});

export default ServicesList;