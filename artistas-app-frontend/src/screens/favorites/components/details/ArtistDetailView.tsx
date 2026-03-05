import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../constants/colors';
import type { Artist } from '../../../../types/explore';

const { width } = Dimensions.get('window');

interface ArtistDetailViewProps {
  artist: Artist | null;
  open: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  isFavorite?: boolean;
}

export const ArtistDetailView: React.FC<ArtistDetailViewProps> = ({
  artist,
  open,
  onClose,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [fullData, setFullData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && artist) {
      setLoading(true);
      const loadDetails = async () => {
        try {
          const apiClient = (await import('../../../../services/api/config')).default;
          const { API_ENDPOINTS } = await import('../../../../services/api/endpoints');
          const { data } = await apiClient.get(API_ENDPOINTS.ARTISTS.DETAIL(Number(artist.id)));
          setFullData(data);
        } catch (err) {
          console.log('Error fetch (usando datos base):', err);
        } finally {
          setLoading(false);
        }
      };
      loadDetails();
    }
  }, [open, artist]);

  if (!artist) return null;

  // Merge de datos (prioriza el fetch, fallback al prop artist)
  const displayData = {
    ...artist,
    ...fullData,
    // Aseguramos que existan arrays para evitar crash
    services: fullData?.details?.services || artist.services || ['Murales', 'Retratos'],
    gallery: fullData?.details?.gallery || artist.gallery || [artist.image], // Mock gallery
  };

  const renderBadge = (icon: React.ReactNode, text: string, colorClass: 'purple' | 'blue' | 'green' | 'gray') => {
    let bg, textCol, border;
    
    switch(colorClass) {
        case 'purple': bg='#f3e8ff'; textCol='#7e22ce'; border='#d8b4fe'; break;
        case 'blue': bg='#dbeafe'; textCol='#1d4ed8'; border='#93c5fd'; break;
        case 'green': bg='#dcfce7'; textCol='#15803d'; border='#86efac'; break;
        default: bg='#f3f4f6'; textCol='#4b5563'; border='#e5e7eb'; break;
    }

    return (
        <View style={[styles.badge, { backgroundColor: bg, borderColor: border }]}>
            {icon}
            <Text style={[styles.badgeText, { color: textCol }]}>{text}</Text>
        </View>
    );
  };

  return (
    <Modal visible={open} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          {/* --- HERO IMAGE --- */}
          <View style={styles.heroContainer}>
            <Image source={{ uri: displayData.image }} style={styles.heroImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
              style={styles.heroGradient}
            />
            
            {/* Botón Cerrar */}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" color="#fff" size={24} />
            </TouchableOpacity>

            {/* Botones Flotantes Superiores */}
            <View style={styles.topActions}>
               <TouchableOpacity style={styles.iconButtonBlur} onPress={() => onToggleFavorite(artist.id)}>
                 <Ionicons
                    name={isFavorite ? "heart" : "heart-outline"}
                    color={isFavorite ? "#ef4444" : "#fff"}
                    size={20}
                 />
               </TouchableOpacity>
               <TouchableOpacity style={styles.iconButtonBlur}>
                 <Ionicons name="share-outline" color="#fff" size={20} />
               </TouchableOpacity>
            </View>

            {/* Info Overlay */}
            <View style={styles.heroContent}>
              <View style={styles.tagRow}>
                <LinearGradient colors={['#9333ea', '#2563eb']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{displayData.category}</Text>
                </LinearGradient>
                {displayData.verified && (
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle-outline" size={12} color="#fff" />
                        <Text style={styles.verifiedText}>Verificado</Text>
                    </View>
                )}
              </View>
              
              <Text style={styles.heroName}>{displayData.name}</Text>
              <Text style={styles.heroType}>{displayData.type}</Text>

              <View style={styles.ratingContainer}>
                 <Ionicons name="star" color="#ffd700" size={16} />
                 <Text style={styles.ratingNumber}>{displayData.rating}</Text>
                 <Text style={styles.ratingLabel}>Rating</Text>
              </View>
            </View>
          </View>

          {/* --- CONTENIDO PRINCIPAL --- */}
          <View style={styles.contentContainer}>
            
            {/* Quick Stats Grid */}
            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: '#7e22ce' }]}>
                        <Ionicons name="star-outline" size={16} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.statLabel}>Rating</Text>
                        <Text style={styles.statValue}>{displayData.rating}</Text>
                    </View>
                </View>
                <View style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: '#2563eb' }]}>
                        <Ionicons name="location-outline" size={16} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.statLabel}>Ubicación</Text>
                        <Text style={styles.statValue} numberOfLines={1}>{displayData.location || 'Ciudad'}</Text>
                    </View>
                </View>
                <View style={[styles.statCard, { width: '100%', marginTop: 8, flexDirection: 'row', alignItems: 'center' }]}>
                    <View style={[styles.statIcon, { backgroundColor: '#16a34a' }]}>
                        <Ionicons name="cash-outline" size={16} color="#fff" />
                    </View>
                    <View style={{ marginLeft: 8 }}>
                        <Text style={styles.statLabel}>Desde</Text>
                        <Text style={styles.statValue}>
                            ${(displayData.price / 1000).toFixed(0)}k <Text style={{fontSize:12, fontWeight:'normal'}}>/hora</Text>
                        </Text>
                    </View>
                </View>
            </View>

            {/* About Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="ribbon-outline" color="#7e22ce" size={20} />
                    <Text style={styles.sectionTitle}>Sobre {displayData.name}</Text>
                </View>
                <Text style={styles.descriptionText}>{displayData.description}</Text>
                
                <View style={styles.featuresRow}>
                    <View style={styles.featureItem}>
                        <Ionicons name="trending-up-outline" size={16} color="#7e22ce" />
                        <View>
                            <Text style={styles.featureLabel}>Popularidad</Text>
                            <Text style={styles.featureValue}>En ascenso</Text>
                        </View>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="shield-checkmark-outline" size={16} color="#7e22ce" />
                        <View>
                            <Text style={styles.featureLabel}>Confiabilidad</Text>
                            <Text style={styles.featureValue}>100% Seguro</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Gallery (Scroll Horizontal) */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="image-outline" color="#7e22ce" size={20} />
                    <Text style={styles.sectionTitle}>Galería</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
                    {displayData.gallery?.map((img: any, index: number) => {
                         const uri = typeof img === 'string' ? img : img.url;
                         return (
                            <Image key={index} source={{ uri }} style={styles.galleryImage} />
                         );
                    })}
                </ScrollView>
            </View>

            {/* Servicios Incluidos */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="checkmark-circle-outline" color="#7e22ce" size={20} />
                    <Text style={styles.sectionTitle}>Servicios Incluidos</Text>
                </View>
                <View style={styles.listContainer}>
                    {['Sonido Profesional', 'Iluminación Básica', 'Transporte incluido', 'Repertorio a medida'].map((item, i) => (
                        <View key={i} style={styles.listItem}>
                            <View style={styles.checkDot}><Ionicons name="checkmark-circle-outline" size={10} color="#fff" /></View>
                            <Text style={styles.listText}>{item}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Info Técnica */}
            <View style={styles.section}>
                 <View style={styles.sectionHeader}>
                    <Ionicons name="briefcase-outline" color="#7e22ce" size={20} />
                    <Text style={styles.sectionTitle}>Información del Artista</Text>
                </View>
                <View style={styles.techGrid}>
                    <View style={styles.techItem}>
                        <Text style={styles.techLabel}>Experiencia</Text>
                        <Text style={styles.techValue}>{displayData.experience || '5 años'}</Text>
                    </View>
                    <View style={styles.techItem}>
                        <Text style={styles.techLabel}>Estilo</Text>
                        <Text style={styles.techValue}>{displayData.style || 'Contemporáneo'}</Text>
                    </View>
                    <View style={styles.techItemFull}>
                        <Text style={styles.techLabel}>Servicios</Text>
                        <Text style={styles.techValue}>{displayData.services?.join(', ') || 'Servicios varios'}</Text>
                    </View>
                </View>
            </View>

          </View>
        </ScrollView>

        {/* --- FIXED BOTTOM BAR --- */}
        <SafeAreaView style={styles.bottomBar}>
            <View style={styles.bottomBarInner}>
                <TouchableOpacity style={styles.chatButton}>
                    <Ionicons name="chatbubble-outline" color="#7e22ce" size={20} />
                    <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quoteButton}>
                    <LinearGradient
                        colors={['#9333ea', '#2563eb']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        <Ionicons name="document-text-outline" color="#fff" size={20} />
                        <Text style={styles.quoteButtonText}>Cotizar Ahora</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // HERO
  heroContainer: {
    height: 400,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0, top: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 50, right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8, borderRadius: 20,
  },
  topActions: {
    position: 'absolute',
    top: 50, left: 20,
    flexDirection: 'row', gap: 10,
  },
  iconButtonBlur: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8, borderRadius: 20,
  },
  heroContent: {
    position: 'absolute',
    bottom: 30, left: 20, right: 20,
  },
  tagRow: {
    flexDirection: 'row', gap: 8, marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
  },
  categoryText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  verifiedText: { color: '#fff', fontSize: 12 },
  heroName: {
    color: '#fff', fontSize: 32, fontWeight: 'bold',
  },
  heroType: {
    color: '#e5e7eb', fontSize: 18, marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12,
  },
  ratingNumber: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  ratingLabel: { color: '#e5e7eb', fontSize: 12 },

  // CONTENT
  contentContainer: {
    padding: 20,
    gap: 24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -24, // Efecto de solapamiento
  },
  
  // STATS
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    padding: 12, borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: '#f3f4f6',
  },
  statIcon: {
    width: 32, height: 32, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  statLabel: { fontSize: 10, color: '#6b7280', textTransform: 'uppercase' },
  statValue: { fontSize: 14, fontWeight: 'bold', color: '#1f2937' },

  // SECTION GENERIC
  section: {
    backgroundColor: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#111827',
  },
  descriptionText: {
    fontSize: 15, lineHeight: 24, color: '#4b5563',
  },
  featuresRow: {
    flexDirection: 'row', marginTop: 16, gap: 20, paddingTop: 16,
    borderTopWidth: 1, borderTopColor: '#f3f4f6',
  },
  featureItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  featureLabel: { fontSize: 12, color: '#6b7280' },
  featureValue: { fontSize: 14, fontWeight: '600', color: '#1f2937' },

  // GALLERY
  galleryImage: {
    width: 140, height: 140, borderRadius: 12, marginRight: 10,
  },

  // LISTS
  listContainer: {
    backgroundColor: '#f5f3ff', padding: 16, borderRadius: 16,
  },
  listItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10,
  },
  checkDot: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: '#10b981',
    justifyContent: 'center', alignItems: 'center',
  },
  listText: { fontSize: 14, color: '#374151' },

  // BADGES
  badge: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10,
    paddingVertical: 5, borderRadius: 8, borderWidth: 1, marginRight: 8, marginBottom: 8
  },
  badgeText: { fontSize: 12, fontWeight: '600', marginLeft: 6 },

  // TECH INFO
  techGrid: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 16, padding: 16,
    flexDirection: 'row', flexWrap: 'wrap',
  },
  techItem: { width: '50%', marginBottom: 12 },
  techItemFull: { width: '100%' },
  techLabel: { fontSize: 12, color: '#6b7280', marginBottom: 2 },
  techValue: { fontSize: 15, fontWeight: '600', color: '#1f2937' },

  // BOTTOM BAR
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#f3f4f6',
    elevation: 10, shadowColor: '#000', shadowOffset: {width:0, height:-2}, shadowOpacity:0.1, shadowRadius:4,
  },
  bottomBarInner: {
    flexDirection: 'row', padding: 16, gap: 12, alignItems: 'center',
  },
  chatButton: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center', alignItems: 'center',
  },
  chatButtonText: { fontSize: 9, color: '#7e22ce', fontWeight: 'bold' },
  quoteButton: {
    flex: 1,
  },
  gradientButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 14, gap: 8,
  },
  quoteButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});