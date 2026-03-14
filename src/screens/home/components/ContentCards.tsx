// src/screens/home/components/ContentCards.tsx
// Glassmorphism real · imágenes Unsplash · sin emojis · sistema BuscaArt

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ImageBackground, Image as RNImage,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../../store/themeStore';
import type { Event, Venue, GalleryItem } from '../../../types/explore';

// ── Tipos exportados ──────────────────────────────────────────────────────────

export interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  venue: string;
  price: string;
  gradients: [string, string];
  imageUri?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
}

export interface ArtistItem {
  id: string;
  name: string;
  discipline: string;
  rating: number;
  works: number;
  avatarUri?: string | null;
  gradients: [string, string];
  initials: string;
  available?: boolean;
  latitude?: number;
  longitude?: number;
  city?: string;
}

export interface VenueItem {
  id: string;
  name: string;
  type: string;
  capacity: string;
  city: string;
  gradients: [string, string];
  icon: string;
  imageUri?: string;
  latitude?: number;
  longitude?: number;
}

// ── Imágenes por categoría (Unsplash) ─────────────────────────────────────────

const CATEGORY_IMAGES: Record<string, string> = {
  'Música':        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop',
  'Arte':          'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&auto=format&fit=crop',
  'Fotografía':    'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&auto=format&fit=crop',
  'Danza':         'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&auto=format&fit=crop',
  'Teatro':        'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&auto=format&fit=crop',
  'Diseño':        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&auto=format&fit=crop',
  'Audiovisual':   'https://images.unsplash.com/photo-1536240478700-b869ad10e2a5?w=400&auto=format&fit=crop',
  'Ilustración':   'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&auto=format&fit=crop',
  'default':       'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&auto=format&fit=crop',
};

const VENUE_IMAGES: Record<string, string> = {
  'default': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&auto=format&fit=crop',
  'Galería': 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=120&auto=format&fit=crop',
  'Teatro':  'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=120&auto=format&fit=crop',
  'Estudio': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=120&auto=format&fit=crop',
};

const ARTIST_PHOTOS = [
  'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=120&auto=format&fit=crop&face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&face',
];

const getEventImage = (item: EventItem) =>
  item.imageUri ?? CATEGORY_IMAGES[item.category] ?? CATEGORY_IMAGES['default'];

const getVenueImage = (item: VenueItem) =>
  item.imageUri ?? VENUE_IMAGES[item.type] ?? VENUE_IMAGES['default'];

// ── Glass highlight helper ────────────────────────────────────────────────────
// Línea de 1px en la parte superior — clave del efecto glass premium

const GlassHighlight = () => (
  <View style={{
    position:'absolute', top:0, left:1, right:1, height:1,
    backgroundColor:'rgba(255,255,255,0.95)', zIndex:2,
  }} />
);

// ── EventGridCard — mismo estilo glass que ArtistCard ────────────────────────

export const EventGridCard: React.FC<{ item: Event; onPress?: () => void }> = ({ item, onPress }) => {
  const isAvail = item.availability?.toLowerCase() === 'disponible';
  return (
    <TouchableOpacity activeOpacity={0.86} style={ar.card} onPress={onPress}>
      <GlassHighlight />
      <View style={grid.imageWrap}>
        <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <LinearGradient colors={['transparent', 'rgba(30,27,75,0.5)']} style={StyleSheet.absoluteFill} />
        <View style={[ar.dot, { backgroundColor: isAvail ? '#16a34a' : '#d97706', position: 'absolute', bottom: 6, right: 6 }]} />
      </View>
      <Text style={ar.name} numberOfLines={1}>{item.name}</Text>
      <Text style={[ar.discipline, { marginBottom: 2 }]} numberOfLines={1}>
        {item.date ?? 'Próximamente'}
      </Text>
      <View style={ar.divider} />
      <View style={ar.statsRow}>
        <View style={ar.stat}>
          <Ionicons name="star" size={10} color="#f59e0b" />
          <Text style={ar.statVal}>{item.rating ?? '—'}</Text>
        </View>
        <View style={ar.statDot} />
        <Text style={ar.works}>{item.location}</Text>
      </View>
      <View style={[ar.availBadge, { backgroundColor: isAvail ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)' }]}>
        <View style={[ar.availDot, { backgroundColor: isAvail ? '#16a34a' : '#d97706' }]} />
        <Text style={[ar.availText, { color: isAvail ? '#15803d' : '#b45309' }]}>
          {isAvail ? 'Disponible' : 'Agotado'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ── VenueGridCard — mismo estilo glass que ArtistCard ────────────────────────

export const VenueGridCard: React.FC<{ item: Venue; onPress?: () => void }> = ({ item, onPress }) => {
  const isAvail = item.availability?.toLowerCase() === 'disponible';
  return (
    <TouchableOpacity activeOpacity={0.86} style={ar.card} onPress={onPress}>
      <GlassHighlight />
      <View style={grid.imageWrap}>
        <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <LinearGradient colors={['transparent', 'rgba(30,27,75,0.5)']} style={StyleSheet.absoluteFill} />
        <View style={[ar.dot, { backgroundColor: isAvail ? '#16a34a' : '#d97706', position: 'absolute', bottom: 6, right: 6 }]} />
      </View>
      <Text style={ar.name} numberOfLines={1}>{item.name}</Text>
      <Text style={[ar.discipline, { marginBottom: 2 }]} numberOfLines={1}>
        {typeof item.category === 'string' ? item.category : 'Sala'}
      </Text>
      <View style={ar.divider} />
      <View style={ar.statsRow}>
        <View style={ar.stat}>
          <Ionicons name="star" size={10} color="#f59e0b" />
          <Text style={ar.statVal}>{item.rating ?? '—'}</Text>
        </View>
        <View style={ar.statDot} />
        <Text style={ar.works}>{item.location}</Text>
      </View>
      <View style={[ar.availBadge, { backgroundColor: isAvail ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)' }]}>
        <View style={[ar.availDot, { backgroundColor: isAvail ? '#16a34a' : '#d97706' }]} />
        <Text style={[ar.availText, { color: isAvail ? '#15803d' : '#b45309' }]}>
          {isAvail ? 'Disponible' : 'Ocupada'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ── GalleryGridCard — mismo estilo glass que ArtistCard ──────────────────────

export const GalleryGridCard: React.FC<{ item: GalleryItem; onPress?: () => void }> = ({ item, onPress }) => {
  const isAvail = item.forSale !== false;
  return (
    <TouchableOpacity activeOpacity={0.86} style={ar.card} onPress={onPress}>
      <GlassHighlight />
      <View style={grid.imageWrap}>
        <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <LinearGradient colors={['transparent', 'rgba(30,27,75,0.5)']} style={StyleSheet.absoluteFill} />
      </View>
      <Text style={ar.name} numberOfLines={1}>{item.name}</Text>
      <Text style={[ar.discipline, { marginBottom: 2 }]} numberOfLines={1}>
        {(item as any).artistName ?? 'Artista'}
      </Text>
      <View style={ar.divider} />
      <View style={ar.statsRow}>
        <View style={ar.stat}>
          <Ionicons name="star" size={10} color="#f59e0b" />
          <Text style={ar.statVal}>{item.rating ?? '—'}</Text>
        </View>
        <View style={ar.statDot} />
        <Text style={ar.works}>{(item as any).medium ?? 'Obra'}</Text>
      </View>
      <View style={[ar.availBadge, { backgroundColor: isAvail ? 'rgba(22,163,74,0.1)' : 'rgba(109,40,217,0.1)' }]}>
        <View style={[ar.availDot, { backgroundColor: isAvail ? '#16a34a' : '#7c3aed' }]} />
        <Text style={[ar.availText, { color: isAvail ? '#15803d' : '#6d28d9' }]}>
          {isAvail ? 'En venta' : 'Vendida'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const grid = StyleSheet.create({
  imageWrap: {
    width: 64, height: 64, borderRadius: 32,
    overflow: 'hidden', marginBottom: 10,
    backgroundColor: '#e5e7eb',
  },
});

// ── EventCard — Glassmorphism con imagen real ─────────────────────────────────

export const EventCard: React.FC<{ item: EventItem; onPress?: () => void }> = ({ item, onPress }) => {
  const { colors, isDark } = useThemeStore();
  const styles = getEventStyles(colors, isDark);
  
  return (
    <TouchableOpacity activeOpacity={0.86} style={styles.card} onPress={onPress}>
      <GlassHighlight />

      {/* Imagen real con overlay */}
      <View style={styles.imgWrap}>
        <ImageBackground
          source={{ uri: getEventImage(item) }}
          style={styles.img}
          imageStyle={{ borderTopLeftRadius:18, borderTopRightRadius:18 }}
          resizeMode="cover"
        >
          {/* Overlay gradiente suave */}
          <LinearGradient
            colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)']}
            start={{ x:0, y:0 }} end={{ x:0, y:1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Badge de categoría — glass pill */}
          <View style={styles.catBadge}>
            <BlurView intensity={30} tint="dark" style={styles.catBlur}>
              <View style={styles.catDot} />
              <Text style={styles.catText}>{item.category.toUpperCase()}</Text>
            </BlurView>
          </View>
        </ImageBackground>
      </View>

      {/* Info inferior — glass */}
      <BlurView intensity={isDark ? 30 : 55} tint={isDark ? 'dark' : 'light'} style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={10} color={colors.primary} />
          <Text style={styles.meta}>{item.date}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={10} color={colors.primary} />
          <Text style={styles.meta} numberOfLines={1}>{item.venue}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{item.price}</Text>
          <LinearGradient colors={['#7c3aed','#2563eb']} style={styles.arrowBtn}>
            <Ionicons name="arrow-forward" size={10} color="#fff" />
          </LinearGradient>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

const getEventStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  card: {
    width:185, marginRight:12, borderRadius:20,
    backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.62)',
    borderWidth:1, borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.92)',
    overflow:'hidden',
    shadowColor: isDark ? '#8b5cf6' : '#6d28d9', 
    shadowOffset:{width:0, height:8},
    shadowOpacity:0.16, shadowRadius:20, elevation:6,
  },
  imgWrap: { height:140 },
  img:     { flex:1 },

  // Badge categoría
  catBadge: {
    position:'absolute', bottom:10, left:10,
    borderRadius:20, overflow:'hidden',
    borderWidth:1, borderColor:'rgba(255,255,255,0.3)',
  },
  catBlur: {
    flexDirection:'row', alignItems:'center', gap:5,
    paddingHorizontal:9, paddingVertical:4,
  },
  catDot:  { width:5, height:5, borderRadius:3, backgroundColor:'#a78bfa' },
  catText: { fontSize:9, fontFamily:'PlusJakartaSans_700Bold', color:'#fff', letterSpacing:0.8 },

  // Info
  info:  { padding:12, gap:4 },
  title: { fontSize:13, fontFamily:'PlusJakartaSans_700Bold', color:colors.text, lineHeight:18, marginBottom:3 },
  metaRow: { flexDirection:'row', alignItems:'center', gap:4 },
  meta:    { fontSize:10.5, fontFamily:'PlusJakartaSans_500Medium', color:isDark ? 'rgba(167,139,250,0.7)' : 'rgba(109,40,217,0.6)', flex:1 },
  priceRow:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:6 },
  price:   { fontSize:14, fontFamily:'PlusJakartaSans_800ExtraBold', color:colors.text },
  arrowBtn:{ width:28, height:28, borderRadius:14, alignItems:'center', justifyContent:'center' },
});

// ── ArtistCard — Glassmorphism con foto real ──────────────────────────────────

export const ArtistCard: React.FC<{ item: ArtistItem; onPress?: () => void; photoIndex?: number }> = ({
  item, onPress, photoIndex = 0,
}) => {
  const { colors, isDark } = useThemeStore();
  const styles = getArtistStyles(colors, isDark);
  const photoUri = item.avatarUri ?? ARTIST_PHOTOS[photoIndex % ARTIST_PHOTOS.length];

  return (
    <TouchableOpacity activeOpacity={0.86} style={styles.card} onPress={onPress}>
      <GlassHighlight />

      {/* Avatar con foto */}
      <View style={styles.avatarWrap}>
        {photoUri ? (
          <RNImage
            source={{ uri: photoUri }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient colors={item.gradients} style={styles.avatar}>
            <Text style={styles.initials}>{item.initials}</Text>
          </LinearGradient>
        )}

        {/* Anillo de disponibilidad */}
        <View style={[styles.ring, { borderColor: item.available ? '#16a34a' : '#d97706' }]} />

        {/* Dot de estado */}
        <View style={[styles.dot, { backgroundColor: item.available ? '#16a34a' : '#d97706' }]} />
      </View>

      {/* Nombre y disciplina */}
      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.discipline} numberOfLines={1}>{item.discipline}</Text>

      {/* Separador glass */}
      <View style={styles.divider} />

      {/* Rating + obras */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons name="star" size={10} color="#f59e0b" />
          <Text style={styles.statVal}>{item.rating}</Text>
        </View>
        <View style={styles.statDot} />
        <Text style={styles.works}>{item.works} obras</Text>
      </View>

      {/* Badge de disponibilidad */}
      <View style={[styles.availBadge, { backgroundColor: item.available ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)' }]}>
        <View style={[styles.availDot, { backgroundColor: item.available ? '#16a34a' : '#d97706' }]} />
        <Text style={[styles.availText, { color: item.available ? '#15803d' : '#b45309' }]}>
          {item.available ? 'Disponible' : 'Ocupado'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const getArtistStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  card: {
    width:148, marginRight:12, borderRadius:20,
    backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.62)',
    borderWidth:1, borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.92)',
    overflow:'hidden',
    shadowColor: isDark ? '#8b5cf6' : '#6d28d9', 
    shadowOffset:{width:0, height:8},
    shadowOpacity:0.16, shadowRadius:20, elevation:6,
  },
  avatarWrap: {
    alignSelf:'center', marginTop:8,
    width:64, height:64, borderRadius:32,
    position:'relative',
  },
  avatar: {
    width:64, height:64, borderRadius:32,
    alignItems:'center', justifyContent:'center',
  },
  initials: {
    fontSize:22, fontFamily:'PlusJakartaSans_800ExtraBold',
    color:'#fff', textTransform:'uppercase',
  },
  ring: {
    position:'absolute', top:-2, left:-2, right:-2, bottom:-2,
    borderRadius:34, borderWidth:2,
  },
  dot: {
    position:'absolute', bottom:2, right:2,
    width:12, height:12, borderRadius:6,
    borderWidth:2, borderColor:'#fff',
  },
  name: {
    fontSize:13, fontFamily:'PlusJakartaSans_700Bold',
    color:colors.text, textAlign:'center', marginTop:8,
  },
  discipline: {
    fontSize:11, fontFamily:'PlusJakartaSans_500Medium',
    color:isDark ? 'rgba(167,139,250,0.7)' : 'rgba(109,40,217,0.6)', 
    textAlign:'center', marginTop:2,
  },
  divider: {
    height:1, backgroundColor:'rgba(124,58,237,0.08)',
    marginHorizontal:12, marginVertical:8,
  },
  statsRow: {
    flexDirection:'row', alignItems:'center', justifyContent:'center',
    gap:8, paddingHorizontal:12,
  },
  stat: { flexDirection:'row', alignItems:'center', gap:3 },
  statVal: {
    fontSize:11, fontFamily:'PlusJakartaSans_600SemiBold',
    color:colors.text,
  },
  statDot: {
    width:3, height:3, borderRadius:2,
    backgroundColor:'rgba(124,58,237,0.3)',
  },
  works: {
    fontSize:10, fontFamily:'PlusJakartaSans_500Medium',
    color:isDark ? 'rgba(167,139,250,0.6)' : 'rgba(109,40,217,0.5)',
  },
  availBadge: {
    flexDirection:'row', alignItems:'center', gap:4,
    paddingHorizontal:8, paddingVertical:4,
    borderRadius:12, marginTop:8, alignSelf:'center',
  },
  availDot: { width:4, height:4, borderRadius:2 },
  availText: {
    fontSize:9, fontFamily:'PlusJakartaSans_600SemiBold',
    textTransform:'uppercase', letterSpacing:0.3,
  },
});

// ── VenueCard — Glassmorphism con miniatura de imagen ────────────────────────

export const VenueCard: React.FC<{ item: VenueItem; onPress?: () => void }> = ({ item, onPress }) => {
  const { colors, isDark } = useThemeStore();
  const styles = getVenueStyles(colors, isDark);
  
  return (
    <TouchableOpacity activeOpacity={0.86} style={styles.card} onPress={onPress}>
      <GlassHighlight />

      {/* Icono + nombre */}
      <View style={styles.iconWrap}>
        <LinearGradient colors={item.gradients} style={styles.icon}>
          <Ionicons name={item.icon} size={20} color="#fff" />
        </LinearGradient>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.type} numberOfLines={1}>{item.type}</Text>

        <View style={styles.sep} />
        <View style={styles.meta}>
          <Ionicons name="people-outline" size={10} color={colors.primary} />
          <Text style={styles.cap}>{item.capacity}</Text>
        </View>
        <View style={styles.meta}>
          <Ionicons name="location-outline" size={10} color={colors.primary} />
          <Text style={styles.cap}>{item.city}</Text>
        </View>
      </View>

      {/* Miniatura de imagen circular */}
      <Image
        source={{ uri: getVenueImage(item) }}
        style={styles.thumb}
        resizeMode="cover"
      />

      {/* CTA badge — reemplaza el chevron */}
      <View style={styles.ctaBadge}>
        <Text style={styles.ctaText}>Ver</Text>
        <Ionicons name="arrow-forward" size={10} color="#7c3aed" />
      </View>
    </TouchableOpacity>
  );
};

const getVenueStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  card: {
    width:140, height:100, marginRight:12, borderRadius:16,
    backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.62)',
    borderWidth:1, borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.92)',
    overflow:'hidden',
    shadowColor: isDark ? '#8b5cf6' : '#6d28d9', 
    shadowOffset:{width:0, height:8},
    shadowOpacity:0.16, shadowRadius:20, elevation:6,
  },
  iconWrap: {
    position:'absolute', top:12, left:12,
    width:36, height:36, borderRadius:18,
    zIndex:2,
  },
  icon: {
    width:36, height:36, borderRadius:18,
    alignItems:'center', justifyContent:'center',
  },
  info: { flex:1, paddingTop:12, paddingLeft:54, paddingRight:12, gap:2 },
  name: {
    fontSize:13, fontFamily:'PlusJakartaSans_700Bold',
    color:colors.text,
  },
  type: {
    fontSize:10, fontFamily:'PlusJakartaSans_500Medium',
    color:isDark ? 'rgba(167,139,250,0.7)' : 'rgba(109,40,217,0.6)',
  },
  sep: {
    height:1, backgroundColor:'rgba(124,58,237,0.08)',
    marginVertical:4,
  },
  meta: { flexDirection:'row', alignItems:'center', gap:4 },
  cap: {
    fontSize:9, fontFamily:'PlusJakartaSans_500Medium',
    color:isDark ? 'rgba(167,139,250,0.6)' : 'rgba(109,40,217,0.5)',
  },
  thumb: {
    position:'absolute', bottom:8, right:8,
    width:32, height:32, borderRadius:16,
    borderWidth:2, borderColor:isDark ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.8)',
  },
  ctaBadge: {
    position:'absolute', bottom:6, right:6,
    backgroundColor: isDark ? 'rgba(139,92,246,0.2)' : 'rgba(124,58,237,0.1)',
    borderRadius:8, paddingHorizontal:6, paddingVertical:3,
    flexDirection:'row', alignItems:'center', gap:3,
  },
  ctaText: {
    fontSize:8, fontFamily:'PlusJakartaSans_600SemiBold',
    color:colors.primary,
  },
});

// Estilos compartidos para componentes Grid
const ar = StyleSheet.create({
  card: {
    width:130, alignItems:'center', marginRight:12, borderRadius:22,
    paddingTop:16, paddingBottom:14, paddingHorizontal:10,
    backgroundColor:'rgba(255,255,255,0.62)',
    borderWidth:1, borderColor:'rgba(255,255,255,0.92)',
    shadowColor:'#6d28d9', shadowOffset:{width:0, height:8},
    shadowOpacity:0.14, shadowRadius:18, elevation:5,
    overflow:'hidden',
  },
  dot: {
    position:'absolute', bottom:1, right:1,
    width:12, height:12, borderRadius:6,
    borderWidth:2, borderColor:'#fff',
  },
  name: {
    fontSize:12, fontFamily:'PlusJakartaSans_700Bold',
    color:'#1e1b4b', textAlign:'center', marginBottom:2,
  },
  discipline: {
    fontSize:10.5, fontFamily:'PlusJakartaSans_400Regular',
    color:'rgba(109,40,217,0.5)', textAlign:'center', marginBottom:2,
  },
  divider: {
    width:'80%', height:1, marginVertical:8,
    backgroundColor:'rgba(124,58,237,0.1)',
  },
  statsRow: { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8 },
  stat: { flexDirection:'row', alignItems:'center', gap:3 },
  statVal: {
    fontSize:11, fontFamily:'PlusJakartaSans_600SemiBold',
    color:'#1e1b4b',
  },
  statDot: {
    width:3, height:3, borderRadius:2,
    backgroundColor:'rgba(124,58,237,0.3)',
  },
  works: {
    fontSize:10, fontFamily:'PlusJakartaSans_400Regular',
    color:'rgba(109,40,217,0.4)',
  },
  availBadge: {
    flexDirection:'row', alignItems:'center', gap:4,
    paddingHorizontal:8, paddingVertical:4,
    borderRadius:12, marginTop:8, alignSelf:'center',
  },
  availDot: { width:4, height:4, borderRadius:2 },
  availText: {
    fontSize:9, fontFamily:'PlusJakartaSans_600SemiBold',
    textTransform:'uppercase', letterSpacing:0.3,
  },
});

export default EventCard;