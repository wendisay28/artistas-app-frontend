// src/screens/client/ExploreHome.tsx
// Home del cliente SIN login — puede explorar libremente

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  StatusBar,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParams } from '../../navigation/AuthStack';
import { GradientButton } from '../../components/ui/GradientButton';

type Props = NativeStackScreenProps<AuthStackParams, 'ClientHome'>;

// ── Mock data ──────────────────────────────────────────────────────────────────
const MOCK_ARTISTS = [
  {
    id: '1',
    name: 'Valeria Ríos',
    category: 'Fotógrafa',
    rating: 4.9,
    reviews: 38,
    distance: 0.8,
    price: 'Desde $80k',
    available: true,
    avatar: null,
    initials: 'VR',
    color: '#9333ea',
    tags: ['Retratos', 'Eventos', 'Producto'],
  },
  {
    id: '2',
    name: 'Carlos Mendoza',
    category: 'Músico',
    rating: 4.7,
    reviews: 54,
    distance: 1.4,
    price: 'Desde $120k',
    available: true,
    avatar: null,
    initials: 'CM',
    color: '#2563eb',
    tags: ['Guitarra', 'Jazz', 'Eventos'],
  },
  {
    id: '3',
    name: 'Daniela Parra',
    category: 'Bailarina',
    rating: 5.0,
    reviews: 21,
    distance: 2.1,
    price: 'Desde $90k',
    available: false,
    avatar: null,
    initials: 'DP',
    color: '#7e22ce',
    tags: ['Salsa', 'Contemporáneo'],
  },
  {
    id: '4',
    name: 'Marco Silva',
    category: 'DJ',
    rating: 4.8,
    reviews: 67,
    distance: 3.5,
    price: 'Desde $200k',
    available: true,
    avatar: null,
    initials: 'MS',
    color: '#4c1d95',
    tags: ['Electrónica', 'Reggaeton', 'Bodas'],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: 'apps' },
  { id: 'foto', label: 'Fotografía', icon: 'camera' },
  { id: 'musica', label: 'Música', icon: 'musical-notes' },
  { id: 'baile', label: 'Baile', icon: 'body' },
  { id: 'arte', label: 'Arte', icon: 'color-palette' },
  { id: 'dj', label: 'DJ', icon: 'headset' },
];

export const ClientExploreHome: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const filtered = MOCK_ARTISTS.filter(a =>
    activeCategory === 'all' ||
    a.category.toLowerCase().includes(activeCategory) ||
    a.tags.some(t => t.toLowerCase().includes(activeCategory))
  );

  const handleBook = () => setShowLoginModal(true);
  const handleLogin = () => {
    setShowLoginModal(false);
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <Text style={styles.logoBusca}>Busc</Text>
          <LinearGradient colors={['#9333ea', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.logoArtBg}>
            <Text style={styles.logoArt}>rt</Text>
          </LinearGradient>
        </View>
        <TouchableOpacity style={styles.locationPill}>
          <Ionicons name="location" size={14} color="#9333ea" />
          <Text style={styles.locationText}>Medellín</Text>
          <Ionicons name="chevron-down" size={12} color="#9333ea" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginBtn}>
          <Text style={styles.loginBtnText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9333ea" />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar fotógrafo, músico, DJ…"
            placeholderTextColor="#9ca3af"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#d1d5db" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options" size={20} color="#9333ea" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                activeOpacity={0.8}
                style={styles.categoryItem}
              >
                {active ? (
                  <LinearGradient
                    colors={['#9333ea', '#2563eb']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.categoryPill}
                  >
                    <Ionicons name={cat.icon as any} size={14} color="#fff" />
                    <Text style={styles.categoryLabelActive}>{cat.label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.categoryPillInactive}>
                    <Ionicons name={cat.icon as any} size={14} color="#9333ea" />
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Map placeholder */}
        <View style={styles.mapSection}>
          <LinearGradient
            colors={['#f3e8ff', '#e9d5ff']}
            style={styles.mapPlaceholder}
          >
            <Ionicons name="map" size={40} color="#9333ea" />
            <Text style={styles.mapText}>Mapa de artistas cercanos</Text>
            <TouchableOpacity style={styles.mapBtn}>
              <Ionicons name="navigate" size={14} color="#9333ea" />
              <Text style={styles.mapBtnText}>Ver en mapa</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Artists list */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Artistas cerca de ti</Text>
            <Text style={styles.listCount}>{filtered.length} disponibles</Text>
          </View>

          {filtered.map(artist => (
            <ArtistCard key={artist.id} artist={artist} onBook={handleBook} />
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Login Modal */}
      <Modal
        visible={showLoginModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLoginModal(false)}
        >
          <View style={styles.modalSheet} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHandle} />
            <LinearGradient
              colors={['#f3e8ff', '#e9d5ff']}
              style={styles.modalIconWrap}
            >
              <Ionicons name="lock-open" size={32} color="#9333ea" />
            </LinearGradient>
            <Text style={styles.modalTitle}>Crea tu cuenta para reservar</Text>
            <Text style={styles.modalSubtitle}>
              Es gratis. Regístrate para contactar{'\n'}artistas y hacer reservaciones.
            </Text>
            <GradientButton
              label="Continuar con Google"
              onPress={handleLogin}
              icon={<GoogleIcon />}
            />
            <TouchableOpacity onPress={() => setShowLoginModal(false)} style={styles.modalSkip}>
              <Text style={styles.modalSkipText}>Seguir explorando</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

// ── Artist card component ──────────────────────────────────────────────────────
const ArtistCard = ({
  artist,
  onBook,
}: { artist: typeof MOCK_ARTISTS[0]; onBook: () => void }) => (
  <View style={cardStyles.card}>
    {/* Avatar */}
    <View style={[cardStyles.avatar, { backgroundColor: artist.color + '20' }]}>
      <Text style={[cardStyles.initials, { color: artist.color }]}>{artist.initials}</Text>
      {artist.available && <View style={cardStyles.availableDot} />}
    </View>

    {/* Info */}
    <View style={cardStyles.info}>
      <View style={cardStyles.nameRow}>
        <Text style={cardStyles.name}>{artist.name}</Text>
        <View style={cardStyles.distancePill}>
          <Ionicons name="location" size={10} color="#9333ea" />
          <Text style={cardStyles.distance}>{artist.distance} km</Text>
        </View>
      </View>
      <Text style={cardStyles.category}>{artist.category}</Text>

      {/* Tags */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={cardStyles.tagsRow}>
        {artist.tags.map(tag => (
          <View key={tag} style={cardStyles.tag}>
            <Text style={cardStyles.tagText}>{tag}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Price + rating + book */}
      <View style={cardStyles.footer}>
        <View style={cardStyles.ratingRow}>
          <Ionicons name="star" size={13} color="#fcd34d" />
          <Text style={cardStyles.rating}>{artist.rating}</Text>
          <Text style={cardStyles.reviews}>({artist.reviews})</Text>
        </View>
        <Text style={cardStyles.price}>{artist.price}</Text>
        <TouchableOpacity onPress={onBook} style={cardStyles.bookBtn}>
          <Text style={cardStyles.bookBtnText}>Reservar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const GoogleIcon = () => (
  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#9333ea' }}>G</Text>
  </View>
);

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  logoRow: { flexDirection: 'row', alignItems: 'baseline', flex: 1 },
  logoBusca: { fontSize: 22, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#4c1d95', letterSpacing: -0.5 },
  logoArtBg: { borderRadius: 5, paddingHorizontal: 3, paddingVertical: 0 },
  logoArt: { fontSize: 22, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff', letterSpacing: -0.5 },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationText: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#9333ea' },
  loginBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#9333ea',
  },
  loginBtnText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#9333ea' },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faf5ff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e9d5ff',
    paddingHorizontal: 14,
    gap: 8,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1f2937',
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Categories
  categoryScroll: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  categoryItem: {},
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryPillInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#faf5ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  categoryLabelActive: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#fff' },
  categoryLabel: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: '#7e22ce' },

  // Map
  mapSection: { paddingHorizontal: 20, marginTop: 16, marginBottom: 4 },
  mapPlaceholder: {
    borderRadius: 16,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapText: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: '#7e22ce' },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d8b4fe',
  },
  mapBtnText: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#9333ea' },

  // List
  listSection: { paddingHorizontal: 20, marginTop: 16 },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  listTitle: { fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95' },
  listCount: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#7e22ce' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(76,29,149,0.3)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    alignItems: 'center',
    gap: 16,
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#e9d5ff', marginBottom: 8 },
  modalIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#4c1d95',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#7e22ce',
    textAlign: 'center',
    lineHeight: 21,
  },
  modalSkip: { paddingVertical: 12 },
  modalSkipText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#9ca3af',
  },
});

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#f3e8ff',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  initials: { fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold' },
  availableDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  info: { flex: 1, gap: 3 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95' },
  distancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  distance: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#9333ea' },
  category: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: '#7e22ce' },
  tagsRow: { marginTop: 4, marginBottom: 4 },
  tag: {
    backgroundColor: '#f3e8ff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
  },
  tagText: { fontSize: 11, fontFamily: 'PlusJakartaSans_500Medium', color: '#7e22ce' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rating: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95' },
  reviews: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: '#9ca3af' },
  price: { flex: 1, fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7e22ce' },
  bookBtn: {
    backgroundColor: 'rgba(147,51,234,0.10)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  bookBtnText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#9333ea' },
});
