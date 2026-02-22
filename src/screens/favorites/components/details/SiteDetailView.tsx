import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// --- COMPONENTES AUXILIARES ---

const AmenityBadge = ({ label }: { label: string }) => (
  <View style={styles.amenityBadge}>
    <Ionicons name="checkmark-circle-outline" size={14} color="#7c3aed" />
    <Text style={styles.amenityText}>{label}</Text>
  </View>
);

const RuleIcon = ({ iconName, label, active }: any) => (
  <View style={[styles.ruleItem, !active && styles.ruleDisabled]}>
    <Ionicons name={iconName} size={18} color={active ? "#7c3aed" : "#9ca3af"} />
    <Text style={[styles.ruleText, !active && styles.ruleDisabledText]}>{label}</Text>
  </View>
);

export default function SiteDetailViewNative({ 
  site, 
  onClose, 
  onToggleFavorite, 
  isFavorite 
}: any) {
  if (!site) return null;

  const handleCall = () => {
    if (site.contactPhone) Linking.openURL(`tel:${site.contactPhone}`);
  };

  return (
    <View style={styles.masterContainer}>
      <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
        
        {/* HERO IMAGE CON OVERLAY */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: site.image }} style={styles.heroImage} />
          <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.7)']} style={styles.overlay} />
          
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.circleBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn} onPress={() => onToggleFavorite(site.id)}>
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#ef4444" : "#FFF"} />
            </TouchableOpacity>
          </View>

          <View style={styles.heroBottomContent}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{site.type}</Text>
            </View>
            <Text style={styles.siteName}>{site.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="#FFF" />
              <Text style={styles.locationText}>{site.city}, {site.state || site.country}</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentCard}>
          {/* QUICK STATS BAR */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={18} color="#f59e0b" />
              <Text style={styles.statValue}>{site.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={18} color="#7c3aed" />
              <Text style={styles.statValue}>{site.capacity}</Text>
              <Text style={styles.statLabel}>Personas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#10b981" />
              <Text style={styles.statValue}>{site.verified ? 'Sí' : 'No'}</Text>
              <Text style={styles.statLabel}>Verificado</Text>
            </View>
          </View>

          {/* REGLAS DE LA CASA */}
          <View style={styles.rulesContainer}>
            <RuleIcon iconName="ban-outline" label="Libre de Humo" active={site.smokeFree} />
            <RuleIcon iconName="paw-outline" label="Mascotas" active={site.petFriendly} />
          </View>

          {/* DESCRIPCIÓN */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre el espacio</Text>
            <Text style={styles.descriptionText}>{site.description}</Text>
          </View>

          {/* AMENIDADES */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lo que ofrece este lugar</Text>
            <View style={styles.amenitiesGrid}>
              {site.amenities.map((item: string, index: number) => (
                <AmenityBadge key={index} label={item} />
              ))}
            </View>
          </View>

          {/* CONTACTO RÁPIDO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contacto</Text>
            <View style={styles.contactCard}>
              <TouchableOpacity style={styles.contactRow} onPress={handleCall}>
                <View style={styles.contactIcon}><Ionicons name="call-outline" size={18} color="#7c3aed" /></View>
                <Text style={styles.contactValue}>{site.contactPhone || 'No disponible'}</Text>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.contactDivider} />
              <TouchableOpacity style={styles.contactRow} onPress={() => site.contactEmail && Linking.openURL(`mailto:${site.contactEmail}`)}>
                <View style={styles.contactIcon}><Ionicons name="mail-outline" size={18} color="#7c3aed" /></View>
                <Text style={styles.contactValue}>{site.contactEmail || 'No disponible'}</Text>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ESPACIADOR FINAL PARA EL FOOTER */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* STICKY FOOTER PRECIO/RESERVA */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>
            {site.price.value ? `$${site.price.value.toLocaleString()}` : 'Consultar'}
            <Text style={styles.footerPriceUnit}> /hora</Text>
          </Text>
          <Text style={styles.footerSub}>Sujeto a disponibilidad</Text>
        </View>
        <TouchableOpacity style={styles.reserveBtn}>
          <Ionicons name="calendar-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.reserveBtnText}>Reservar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },
  heroContainer: { height: 350, width: '100%' },
  heroImage: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject },
  topActions: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    paddingTop: 50, paddingHorizontal: 20 
  },
  circleBtn: { 
    width: 42, height: 42, borderRadius: 21, 
    backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' 
  },
  heroBottomContent: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  typeBadge: { 
    backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 8 
  },
  typeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  siteName: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { color: '#e5e7eb', fontSize: 14 },
  contentCard: { 
    marginTop: -25, backgroundColor: '#FFF', 
    borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 
  },
  statsBar: { 
    flexDirection: 'row', backgroundColor: '#f9fafb', 
    paddingVertical: 15, borderRadius: 20, marginBottom: 25,
    borderWidth: 1, borderColor: '#f3f4f6'
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginTop: 4 },
  statLabel: { fontSize: 11, color: '#6b7280' },
  statDivider: { width: 1, height: '60%', backgroundColor: '#e5e7eb', alignSelf: 'center' },
  rulesContainer: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  ruleItem: { 
    flexDirection: 'row', alignItems: 'center', gap: 8, 
    backgroundColor: '#f5f3ff', paddingHorizontal: 12, 
    paddingVertical: 8, borderRadius: 12, flex: 1
  },
  ruleDisabled: { backgroundColor: '#f3f4f6' },
  ruleText: { fontSize: 12, fontWeight: '600', color: '#7c3aed' },
  ruleDisabledText: { color: '#9ca3af' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  descriptionText: { fontSize: 15, color: '#4b5563', lineHeight: 22 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  amenityBadge: { 
    flexDirection: 'row', alignItems: 'center', gap: 6, 
    backgroundColor: '#f3e8ff', paddingHorizontal: 12, 
    paddingVertical: 8, borderRadius: 12 
  },
  amenityText: { fontSize: 13, color: '#6d28d9', fontWeight: '500' },
  contactCard: { backgroundColor: '#f9fafb', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#f3f4f6' },
  contactRow: { flexDirection: 'row', alignItems: 'center', padding: 15, gap: 12 },
  contactIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  contactValue: { flex: 1, fontSize: 14, color: '#1f2937', fontWeight: '500' },
  contactDivider: { height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 15 },
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: '#FFF', paddingHorizontal: 20, 
    paddingTop: 15, paddingBottom: Platform.OS === 'ios' ? 35 : 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 20
  },
  footerPrice: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  footerPriceUnit: { fontSize: 14, fontWeight: 'normal', color: '#6b7280' },
  footerSub: { fontSize: 12, color: '#10b981', fontWeight: '600' },
  reserveBtn: { 
    backgroundColor: '#7c3aed', paddingHorizontal: 25, 
    height: 50, borderRadius: 14, flexDirection: 'row', 
    justifyContent: 'center', alignItems: 'center' 
  },
  reserveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});