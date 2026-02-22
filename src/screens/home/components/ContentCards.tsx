// src/screens/home/components/ContentCards.tsx
// Glassmorphism real · imágenes Unsplash · sin emojis · sistema BuscaArt

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ImageBackground, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

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

// ── EventCard — Glassmorphism con imagen real ─────────────────────────────────

export const EventCard: React.FC<{ item: EventItem; onPress?: () => void }> = ({ item, onPress }) => (
  <TouchableOpacity activeOpacity={0.86} style={ev.card} onPress={onPress}>
    <GlassHighlight />

    {/* Imagen real con overlay */}
    <View style={ev.imgWrap}>
      <ImageBackground
        source={{ uri: getEventImage(item) }}
        style={ev.img}
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
        <View style={ev.catBadge}>
          <BlurView intensity={30} tint="dark" style={ev.catBlur}>
            <View style={ev.catDot} />
            <Text style={ev.catText}>{item.category.toUpperCase()}</Text>
          </BlurView>
        </View>
      </ImageBackground>
    </View>

    {/* Info inferior — glass */}
    <BlurView intensity={55} tint="light" style={ev.info}>
      <Text style={ev.title} numberOfLines={2}>{item.title}</Text>

      <View style={ev.metaRow}>
        <Ionicons name="calendar-outline" size={10} color="rgba(109,40,217,0.5)" />
        <Text style={ev.meta}>{item.date}</Text>
      </View>
      <View style={ev.metaRow}>
        <Ionicons name="location-outline" size={10} color="rgba(109,40,217,0.5)" />
        <Text style={ev.meta} numberOfLines={1}>{item.venue}</Text>
      </View>

      <View style={ev.priceRow}>
        <Text style={ev.price}>{item.price}</Text>
        <LinearGradient colors={['#7c3aed','#2563eb']} style={ev.arrowBtn}>
          <Ionicons name="arrow-forward" size={10} color="#fff" />
        </LinearGradient>
      </View>
    </BlurView>
  </TouchableOpacity>
);

const ev = StyleSheet.create({
  card: {
    width:185, marginRight:12, borderRadius:20,
    backgroundColor:'rgba(255,255,255,0.62)',
    borderWidth:1, borderColor:'rgba(255,255,255,0.92)',
    overflow:'hidden',
    shadowColor:'#6d28d9', shadowOffset:{width:0, height:8},
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
  title: { fontSize:13, fontFamily:'PlusJakartaSans_700Bold', color:'#1e1b4b', lineHeight:18, marginBottom:3 },
  metaRow: { flexDirection:'row', alignItems:'center', gap:4 },
  meta:    { fontSize:10.5, fontFamily:'PlusJakartaSans_400Regular', color:'rgba(109,40,217,0.5)', flex:1 },
  priceRow:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:6 },
  price:   { fontSize:12.5, fontFamily:'PlusJakartaSans_700Bold', color:'#7c3aed' },
  arrowBtn:{
    width:22, height:22, borderRadius:11,
    alignItems:'center', justifyContent:'center',
  },
});

// ── ArtistCard — Glassmorphism con foto real ──────────────────────────────────

export const ArtistCard: React.FC<{ item: ArtistItem; onPress?: () => void; photoIndex?: number }> = ({
  item, onPress, photoIndex = 0,
}) => {
  const photoUri = item.avatarUri ?? ARTIST_PHOTOS[photoIndex % ARTIST_PHOTOS.length];

  return (
    <TouchableOpacity activeOpacity={0.86} style={ar.card} onPress={onPress}>
      <GlassHighlight />

      {/* Avatar con foto */}
      <View style={ar.avatarWrap}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={ar.avatar}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient colors={item.gradients} style={ar.avatar}>
            <Text style={ar.initials}>{item.initials}</Text>
          </LinearGradient>
        )}

        {/* Anillo de disponibilidad */}
        <View style={[ar.ring, { borderColor: item.available ? '#16a34a' : '#d97706' }]} />

        {/* Dot de estado */}
        <View style={[ar.dot, { backgroundColor: item.available ? '#16a34a' : '#d97706' }]} />
      </View>

      {/* Nombre y disciplina */}
      <Text style={ar.name} numberOfLines={1}>{item.name}</Text>
      <Text style={ar.discipline} numberOfLines={1}>{item.discipline}</Text>

      {/* Separador glass */}
      <View style={ar.divider} />

      {/* Rating + obras */}
      <View style={ar.statsRow}>
        <View style={ar.stat}>
          <Ionicons name="star" size={10} color="#f59e0b" />
          <Text style={ar.statVal}>{item.rating}</Text>
        </View>
        <View style={ar.statDot} />
        <Text style={ar.works}>{item.works} obras</Text>
      </View>

      {/* Badge disponibilidad */}
      <View style={[ar.availBadge, { backgroundColor: item.available ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)' }]}>
        <View style={[ar.availDot, { backgroundColor: item.available ? '#16a34a' : '#d97706' }]} />
        <Text style={[ar.availText, { color: item.available ? '#15803d' : '#b45309' }]}>
          {item.available ? 'Disponible' : 'Ocupado'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

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

  // Avatar
  avatarWrap: { position:'relative', marginBottom:10 },
  avatar: {
    width:64, height:64, borderRadius:32,
    alignItems:'center', justifyContent:'center',
  },
  ring: {
    position:'absolute', top:-3, left:-3,
    width:70, height:70, borderRadius:35,
    borderWidth:2, borderColor:'#16a34a',
    opacity:0.6,
  },
  dot: {
    position:'absolute', bottom:1, right:1,
    width:12, height:12, borderRadius:6,
    borderWidth:2, borderColor:'#fff',
  },
  initials: { fontSize:20, fontFamily:'PlusJakartaSans_800ExtraBold', color:'#fff' },

  // Texto
  name:       { fontSize:12, fontFamily:'PlusJakartaSans_700Bold', color:'#1e1b4b', textAlign:'center', marginBottom:2 },
  discipline: { fontSize:10.5, fontFamily:'PlusJakartaSans_400Regular', color:'rgba(109,40,217,0.5)', textAlign:'center' },

  // Separador
  divider: {
    width:'80%', height:1, marginVertical:8,
    backgroundColor:'rgba(124,58,237,0.1)',
  },

  // Stats
  statsRow: { flexDirection:'row', alignItems:'center', gap:5, marginBottom:8 },
  stat:     { flexDirection:'row', alignItems:'center', gap:3 },
  statVal:  { fontSize:10.5, fontFamily:'PlusJakartaSans_700Bold', color:'#1e1b4b' },
  statDot:  { width:3, height:3, borderRadius:1.5, backgroundColor:'rgba(124,58,237,0.25)' },
  works:    { fontSize:10, fontFamily:'PlusJakartaSans_400Regular', color:'rgba(109,40,217,0.45)' },

  // Badge disponibilidad
  availBadge: {
    flexDirection:'row', alignItems:'center', gap:4,
    paddingHorizontal:9, paddingVertical:3, borderRadius:20,
  },
  availDot:  { width:5, height:5, borderRadius:3 },
  availText: { fontSize:10, fontFamily:'PlusJakartaSans_600SemiBold' },
});

// ── VenueCard — Glassmorphism con miniatura de imagen ────────────────────────

export const VenueCard: React.FC<{ item: VenueItem; onPress?: () => void }> = ({ item, onPress }) => (
  <TouchableOpacity activeOpacity={0.86} style={ve.card} onPress={onPress}>
    <GlassHighlight />

    {/* Acento izquierdo en gradiente */}
    <LinearGradient
      colors={['#7c3aed','#2563eb']}
      start={{x:0,y:0}} end={{x:0,y:1}}
      style={ve.accent}
    />

    {/* Ícono en gradiente */}
    <LinearGradient
      colors={item.gradients}
      start={{x:0,y:0}} end={{x:1,y:1}}
      style={ve.iconWrap}
    >
      <Ionicons name={item.icon as any} size={22} color="#fff" />
    </LinearGradient>

    {/* Info central */}
    <View style={ve.info}>
      <Text style={ve.name} numberOfLines={1}>{item.name}</Text>
      <Text style={ve.type}>{item.type}</Text>
      <View style={ve.metaRow}>
        <Ionicons name="people-outline" size={10} color="rgba(109,40,217,0.4)" />
        <Text style={ve.cap}>{item.capacity}</Text>
        <View style={ve.sep} />
        <Ionicons name="location-outline" size={10} color="rgba(109,40,217,0.4)" />
        <Text style={ve.cap}>{item.city}</Text>
      </View>
    </View>

    {/* Miniatura de imagen circular */}
    <Image
      source={{ uri: getVenueImage(item) }}
      style={ve.thumb}
      resizeMode="cover"
    />

    {/* CTA badge — reemplaza el chevron */}
    <View style={ve.ctaBadge}>
      <Text style={ve.ctaText}>Ver</Text>
      <Ionicons name="arrow-forward" size={10} color="#7c3aed" />
    </View>
  </TouchableOpacity>
);

const ve = StyleSheet.create({
  card: {
    flexDirection:'row', alignItems:'center', gap:12,
    marginBottom:10, marginHorizontal:16, borderRadius:20,
    padding:13, paddingLeft:10,
    backgroundColor:'rgba(255,255,255,0.62)',
    borderWidth:1, borderColor:'rgba(255,255,255,0.92)',
    overflow:'hidden',
    shadowColor:'#6d28d9', shadowOffset:{width:0, height:6},
    shadowOpacity:0.14, shadowRadius:16, elevation:4,
  },

  // Acento izquierdo
  accent: {
    position:'absolute', left:0, top:0, bottom:0, width:4,
    borderTopLeftRadius:20, borderBottomLeftRadius:20,
  },

  // Ícono
  iconWrap: {
    width:50, height:50, borderRadius:15,
    alignItems:'center', justifyContent:'center',
    marginLeft:6,
    shadowColor:'#6d28d9', shadowOffset:{width:0,height:3},
    shadowOpacity:0.2, shadowRadius:8, elevation:3,
  },

  // Info
  info:    { flex:1 },
  name:    { fontSize:13.5, fontFamily:'PlusJakartaSans_700Bold', color:'#1e1b4b', marginBottom:2 },
  type:    { fontSize:11, fontFamily:'PlusJakartaSans_400Regular', color:'rgba(109,40,217,0.45)', marginBottom:4 },
  metaRow: { flexDirection:'row', alignItems:'center', gap:4 },
  cap:     { fontSize:10.5, fontFamily:'PlusJakartaSans_400Regular', color:'rgba(109,40,217,0.4)' },
  sep:     { width:3, height:3, borderRadius:1.5, backgroundColor:'rgba(124,58,237,0.2)' },

  // Miniatura circular
  thumb: {
    width:44, height:44, borderRadius:22,
    borderWidth:2, borderColor:'rgba(255,255,255,0.9)',
  },

  // CTA badge
  ctaBadge: {
    flexDirection:'row', alignItems:'center', gap:3,
    paddingHorizontal:8, paddingVertical:4, borderRadius:20,
    borderWidth:1, borderColor:'rgba(124,58,237,0.2)',
    backgroundColor:'rgba(124,58,237,0.06)',
  },
  ctaText: { fontSize:10.5, fontFamily:'PlusJakartaSans_600SemiBold', color:'#7c3aed' },
});