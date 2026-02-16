import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  Share,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// --- COMPONENTES ATÓMICOS ---

const ActionButton = ({ iconName, label, onPress, variant = 'outline', active = false }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.actionBtn,
      variant === 'primary' ? styles.actionBtnPrimary : styles.actionBtnOutline,
      active && styles.actionBtnActive
    ]}
  >
    <Ionicons name={iconName} size={20} color={variant === 'primary' ? '#FFF' : (active ? '#10b981' : '#7c3aed')} />
    <Text style={[
      styles.actionBtnText,
      variant === 'primary' ? styles.textWhite : (active ? styles.textSuccess : styles.textPurple)
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const SectionHeader = ({ iconName, title }: any) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionIcon}>
      <Ionicons name={iconName} size={18} color="#FFF" />
    </View>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// --- VISTA PRINCIPAL ---

export default function EventDetailViewNative({ event, onToggleFavorite, isFavorite }: any) {
  const [fullEventData, setFullEventData] = useState<any>(null);
  const [isReminderSet, setIsReminderSet] = useState(false);

  useEffect(() => {
    if (event?.id) fetchEventDetails();
  }, [event]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/events/${event.id}`);
      if (response.ok) setFullEventData(await response.json());
    } catch (e) { console.error(e); }
  };

  const displayData = fullEventData || event;
  if (!displayData) return null;

  // Handlers
  const handleShare = async () => {
    try {
      await Share.share({ message: `¡Mira este evento!: ${displayData.title}`, url: 'https://tuapp.com' });
    } catch (e) { console.log(e); }
  };

  const handleOpenMap = () => {
    const lat = displayData.coordinates?.lat;
    const lng = displayData.coordinates?.lng;
    const label = displayData.venue;
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${label})`
    });
    if (url) Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* HEADER HERO */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: displayData.image || displayData.featuredImage }} style={styles.heroImage} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.overlay} />
        
        {/* Floating Actions */}
        <View style={styles.headerTopActions}>
          <TouchableOpacity style={styles.circleBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleBtn} onPress={() => onToggleFavorite(displayData.id)}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#ef4444" : "#FFF"} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroContent}>
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{displayData.category || 'Evento'}</Text>
            </View>
            {displayData.viewCount > 100 && (
              <View style={styles.trendingBadge}>
                <Ionicons name="trending-up-outline" size={12} color="#FFF" />
                <Text style={styles.trendingText}>Popular</Text>
              </View>
            )}
          </View>
          <Text style={styles.title}>{displayData.title}</Text>
          <Text style={styles.subtitle}>{displayData.venue} • {displayData.city}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* INFO GRID */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <View style={styles.infoIconBox}><Ionicons name="calendar-outline" size={18} color="#7c3aed" /></View>
            <Text style={styles.infoLabel}>Fecha</Text>
            <Text style={styles.infoValue}>{displayData.date}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIconBox}><Ionicons name="time-outline" size={18} color="#7c3aed" /></View>
            <Text style={styles.infoLabel}>Hora</Text>
            <Text style={styles.infoValue}>{displayData.time || '20:00'}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIconBox}><Ionicons name="ticket-outline" size={18} color="#7c3aed" /></View>
            <Text style={styles.infoLabel}>Precio</Text>
            <Text style={styles.infoValue}>{displayData.isFree ? 'Gratis' : `$${displayData.price?.value || '0'}`}</Text>
          </View>
        </View>

        {/* UBICACIÓN & MAPA */}
        <SectionHeader iconName="location-outline" title="Ubicación" />
        <View style={styles.card}>
          <Text style={styles.venueName}>{displayData.venue}</Text>
          <Text style={styles.addressText}>{displayData.address}</Text>
          
          <TouchableOpacity onPress={handleOpenMap} style={styles.mapContainer}>
            <Image 
              source={{ uri: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+7c3aed(${displayData.coordinates?.lng || 0},${displayData.coordinates?.lat || 0})/${displayData.coordinates?.lng || 0},${displayData.coordinates?.lat || 0},14/400x200?access_token=TU_TOKEN` }} 
              style={styles.staticMap}
            />
            <View style={styles.mapOverlay}>
              <Ionicons name="navigate-outline" size={20} color="#7c3aed" />
              <Text style={styles.mapOverlayText}>Cómo llegar</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ORGANIZADOR */}
        <SectionHeader iconName="star" title="Organizador" />
        <View style={styles.organizerCard}>
          <View style={styles.organizerInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{displayData.organizer?.displayName?.[0] || 'E'}</Text>
            </View>
            <View>
              <Text style={styles.organizerName}>{displayData.organizer?.displayName || 'EventPro'}</Text>
              <View style={styles.verifiedRow}>
                <Ionicons name="checkmark-circle-outline" size={12} color="#10b981" />
                <Text style={styles.verifiedText}>Verificado</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.contactBtn}>
            <Ionicons name="chatbubble-outline" size={18} color="#7c3aed" />
            <Text style={styles.contactBtnText}>Chatear</Text>
          </TouchableOpacity>
        </View>

        {/* BOTONES DE ACCIÓN FINAL */}
        <View style={styles.actionsFooter}>
          <TouchableOpacity 
            style={[styles.mainCta, !displayData.available && styles.disabledBtn]}
            disabled={!displayData.available}
          >
            <Ionicons name="ticket-outline" size={22} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.mainCtaText}>
              {displayData.available ? 'Comprar Entradas' : 'Agotado'}
            </Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <ActionButton
              iconName="notifications-outline"
              label={isReminderSet ? "Activado" : "Recordatorio"}
              onPress={() => setIsReminderSet(!isReminderSet)}
              active={isReminderSet}
            />
            <ActionButton
              iconName="calendar-outline"
              label="Calendario"
              onPress={() => Alert.alert("Calendario", "Evento añadido")}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfbff' },
  heroContainer: { height: 400, width: '100%' },
  heroImage: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject },
  headerTopActions: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    paddingTop: 50, 
    paddingHorizontal: 20, 
    gap: 12 
  },
  circleBtn: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', alignItems: 'center' 
  },
  heroContent: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  categoryBadge: { 
    backgroundColor: '#7c3aed', paddingHorizontal: 12, 
    paddingVertical: 4, borderRadius: 20 
  },
  categoryBadgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  trendingBadge: { 
    flexDirection: 'row', alignItems: 'center', gap: 4, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingHorizontal: 10, borderRadius: 20 
  },
  trendingText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { color: '#e5e7eb', fontSize: 16 },
  content: { padding: 20, marginTop: -20, backgroundColor: '#fdfbff', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  infoItem: { alignItems: 'center', flex: 1 },
  infoIconBox: { 
    width: 45, height: 45, borderRadius: 12, 
    backgroundColor: '#f3e8ff', justifyContent: 'center', 
    alignItems: 'center', marginBottom: 8 
  },
  infoLabel: { fontSize: 12, color: '#6b7280', marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: 'bold', color: '#1f2937' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15, marginTop: 10 },
  sectionIcon: { 
    width: 32, height: 32, borderRadius: 8, 
    backgroundColor: '#7c3aed', justifyContent: 'center', alignItems: 'center' 
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  card: { 
    backgroundColor: '#FFF', borderRadius: 20, padding: 15, 
    marginBottom: 25, borderWidth: 1, borderColor: '#f3e8ff' 
  },
  venueName: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  addressText: { fontSize: 14, color: '#6b7280', marginTop: 4, marginBottom: 15 },
  mapContainer: { height: 160, borderRadius: 15, overflow: 'hidden' },
  staticMap: { width: '100%', height: '100%' },
  mapOverlay: { 
    position: 'absolute', bottom: 10, right: 10, 
    backgroundColor: '#FFF', flexDirection: 'row', 
    alignItems: 'center', padding: 8, borderRadius: 12, gap: 5 
  },
  mapOverlayText: { fontSize: 12, fontWeight: 'bold', color: '#7c3aed' },
  organizerCard: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', backgroundColor: '#f9f5ff', 
    padding: 15, borderRadius: 20, marginBottom: 30 
  },
  organizerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { 
    width: 50, height: 50, borderRadius: 25, 
    backgroundColor: '#7c3aed', justifyContent: 'center', alignItems: 'center' 
  },
  avatarText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  organizerName: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  verifiedText: { fontSize: 12, color: '#10b981' },
  contactBtn: { 
    flexDirection: 'row', alignItems: 'center', gap: 6, 
    backgroundColor: '#FFF', paddingVertical: 8, 
    paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#ddd' 
  },
  contactBtnText: { fontSize: 13, fontWeight: '600', color: '#7c3aed' },
  actionsFooter: { gap: 12, marginBottom: 40 },
  mainCta: { 
    backgroundColor: '#7c3aed', height: 60, borderRadius: 18, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', 
    shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 
  },
  mainCtaText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  disabledBtn: { backgroundColor: '#9ca3af', shadowOpacity: 0 },
  secondaryActions: { flexDirection: 'row', gap: 10 },
  actionBtn: { 
    flex: 1, height: 50, borderRadius: 15, 
    flexDirection: 'row', justifyContent: 'center', 
    alignItems: 'center', gap: 8, borderWidth: 1.5 
  },
  actionBtnPrimary: { 
    backgroundColor: '#7c3aed', height: 60, borderRadius: 18, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', 
    shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 
  },
  actionBtnOutline: { borderColor: '#f3e8ff', backgroundColor: '#FFF' },
  actionBtnActive: { borderColor: '#10b981', backgroundColor: '#ecfdf5' },
  actionBtnText: { fontSize: 14, fontWeight: '600' },
  textWhite: { color: '#FFF' },
  textPurple: { color: '#7c3aed' },
  textSuccess: { color: '#059669' },
});