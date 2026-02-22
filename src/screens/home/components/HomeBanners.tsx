// src/screens/home/components/HomeBanners.tsx

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ImageBackground, Dimensions,
  Animated, Easing, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const CARD_W = width - 32;
const CARD_H = Math.round(width * 0.52);
const AUTOPLAY_MS = 4000;

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type BannerItem = {
  id: string; eyebrow: string; title: string;
  meta: string; cta: string; tag: string;
  image: string; accentColor: string; eventId?: string;
};

// ── Banners por defecto ───────────────────────────────────────────────────────

const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: '1', eyebrow: 'EVENTO DESTACADO',
    title: 'Festival Cultural\nMedellín 2026',
    meta: '15 artistas · 3 días · Parque Explora',
    cta: 'Ver evento', tag: 'GRATIS',
    image: 'https://images.unsplash.com/photo-1514525253344-ad81d60b2058?q=80&w=1000&auto=format&fit=crop',
    accentColor: '#a78bfa', eventId: 'evt-1',
  },
  {
    id: '2', eyebrow: 'TALLERES GRATUITOS',
    title: 'Arte y Fotografía\npara artistas',
    meta: 'Cupos limitados · Gratis con BuscArt',
    cta: 'Ver evento', tag: 'CUPOS LIBRES',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop',
    accentColor: '#93c5fd', eventId: 'evt-2',
  },
  {
    id: '3', eyebrow: 'CONVOCATORIA',
    title: 'Expón tu obra en\nGalería Centro',
    meta: 'Inscripciones hasta el 30 de marzo',
    cta: 'Ver evento', tag: 'NUEVA',
    image: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?q=80&w=1000&auto=format&fit=crop',
    accentColor: '#c4b5fd', eventId: 'evt-3',
  },
];

// ── FadeIn ────────────────────────────────────────────────────────────────────

const FadeIn: React.FC<{ delay?: number; children: React.ReactNode }> = ({ delay = 0, children }) => {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 500, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 500, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);
  return <Animated.View style={{ opacity, transform: [{ translateY }] }}>{children}</Animated.View>;
};

// ── ProfileBanner — angosto, sin cuadros de pasos ────────────────────────────

type ProfileBannerProps = { pct: number; onPress: () => void };

const ProfileBanner: React.FC<ProfileBannerProps> = ({ pct, onPress }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: pct, duration: 1400,
      easing: Easing.out(Easing.cubic), useNativeDriver: false,
    }).start();
  }, [pct]);

  const barWidth = progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  const getMessage = () => {
    if (pct < 30) return 'Agrega foto, bio y ciudad para empezar';
    if (pct < 60) return 'Añade disciplinas y redes sociales';
    if (pct < 90) return 'Ya casi — un paso más y listo';
    return '¡Perfil casi completo, sigue así!';
  };

  const barColors: [string, string] =
    pct < 40 ? ['#f59e0b', '#f97316'] :
    pct < 75 ? ['#7c3aed', '#2563eb'] :
               ['#059669', '#0891b2'];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={pb.container}>
      <BlurView intensity={65} tint="light" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(255,255,255,0.85)', 'rgba(237,233,255,0.5)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={pb.inner}>
        {/* Ícono */}
        <LinearGradient colors={['#7c3aed', '#4f46e5']} style={pb.icon}>
          <Ionicons name="person" size={16} color="#fff" />
        </LinearGradient>

        {/* Centro */}
        <View style={pb.center}>
          <View style={pb.topRow}>
            <Text style={pb.title}>Completa tu perfil</Text>
            <Text style={pb.pct}>{pct}%</Text>
          </View>
          <View style={pb.track}>
            <Animated.View style={[pb.fill, { width: barWidth }]}>
              <LinearGradient
                colors={barColors}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
          <Text style={pb.hint}>{getMessage()}</Text>
        </View>

        {/* Flecha */}
        <Ionicons name="chevron-forward" size={15} color="rgba(124,58,237,0.45)" />
      </View>
    </TouchableOpacity>
  );
};

// ── HeroCard ──────────────────────────────────────────────────────────────────

const FALLBACK_COLORS: Record<string, [string, string]> = {
  '#a78bfa': ['#4c1d95', '#1e40af'],
  '#93c5fd': ['#1e3a5f', '#1e40af'],
  '#c4b5fd': ['#3b0764', '#4c1d95'],
};

const CardContent: React.FC<{ item: BannerItem }> = ({ item }) => (
  <>
    <LinearGradient colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.78)']} style={StyleSheet.absoluteFill} />
    <View style={hc.topRow}>
      <View style={hc.tagPill}>
        <BlurView intensity={35} tint="light" style={hc.tagBlur}>
          <View style={[hc.tagDot, { backgroundColor: item.accentColor }]} />
          <Text style={hc.tagText}>{item.tag}</Text>
        </BlurView>
      </View>
    </View>
    <View style={hc.bottom}>
      <View style={hc.info}>
        <View style={hc.eyebrowRow}>
          <View style={[hc.dot, { backgroundColor: item.accentColor }]} />
          <Text style={hc.eyebrow}>{item.eyebrow}</Text>
        </View>
        <Text style={hc.title}>{item.title}</Text>
        <Text style={hc.meta}>{item.meta}</Text>
      </View>
      <View style={hc.ctaPill}>
        <BlurView intensity={35} tint="light" style={hc.cta}>
          <Text style={hc.ctaText}>{item.cta}</Text>
          <Ionicons name="arrow-forward" size={12} color="#fff" />
        </BlurView>
      </View>
    </View>
  </>
);

const HeroCard: React.FC<{ item: BannerItem; onPress: (item: BannerItem) => void }> = ({ item, onPress }) => {
  const [imgError, setImgError] = useState(false);
  const fallback = FALLBACK_COLORS[item.accentColor] ?? ['#1e1b4b', '#4c1d95'];

  return (
    <TouchableOpacity activeOpacity={0.92} style={hc.card} onPress={() => onPress(item)}>
      {!imgError ? (
        <ImageBackground
          source={{ uri: item.image }}
          style={hc.img} imageStyle={hc.imgStyle}
          onError={() => setImgError(true)}
        >
          <CardContent item={item} />
        </ImageBackground>
      ) : (
        <LinearGradient colors={fallback} style={hc.img}>
          <CardContent item={item} />
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

// ── HomeBanners ───────────────────────────────────────────────────────────────

type HomeBannersProps = {
  showProfileBanner?: boolean;
  profilePct?:        number;
  onProfilePress?:    () => void;
  categories?:        { id: string; label: string; icon: string }[];
  activeCategory?:    string;
  onCategoryPress?:   (id: string) => void;
  banners?:           BannerItem[];
  onBannerPress?:     (item: BannerItem) => void;
};

const HomeBanners: React.FC<HomeBannersProps> = ({
  showProfileBanner = true,
  profilePct        = 0,
  onProfilePress    = () => {},
  categories        = [],
  activeCategory    = '',
  onCategoryPress   = () => {},
  banners           = DEFAULT_BANNERS,
  onBannerPress     = () => {},
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef   = useRef<ScrollView>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPaused    = useRef(false);

  const scrollToIndex = useCallback((idx: number) => {
    scrollRef.current?.scrollTo({ x: idx * (CARD_W + 16), animated: true });
    setActiveIndex(idx);
  }, []);

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!isPaused.current) {
        setActiveIndex(prev => {
          const next = (prev + 1) % banners.length;
          scrollRef.current?.scrollTo({ x: next * (CARD_W + 16), animated: true });
          return next;
        });
      }
    }, AUTOPLAY_MS);
  }, [banners.length]);

  useEffect(() => {
    startAutoplay();
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [startAutoplay]);

  const handleScrollBegin = () => { isPaused.current = true; };
  const handleScrollEnd   = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (CARD_W + 16));
    setActiveIndex(idx);
    isPaused.current = false;
    startAutoplay();
  };

  return (
    <View style={s.container}>

      {showProfileBanner && (
        <FadeIn delay={0}>
          <ProfileBanner pct={profilePct} onPress={onProfilePress} />
        </FadeIn>
      )}

      <FadeIn delay={150}>
        <View>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_W + 16}
            decelerationRate="fast"
            onScrollBeginDrag={handleScrollBegin}
            onMomentumScrollEnd={handleScrollEnd}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
          >
            {banners.map(item => (
              <HeroCard key={item.id} item={item} onPress={onBannerPress} />
            ))}
          </ScrollView>
          <View style={cr.dots}>
            {banners.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => scrollToIndex(i)} activeOpacity={0.7}>
                <View style={[cr.dot, i === activeIndex && cr.dotActive]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </FadeIn>

      <FadeIn delay={300}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={cp.scroll}
        >
          {categories.map((cat: any) => (
            <TouchableOpacity key={cat.id} onPress={() => onCategoryPress(cat.id)} activeOpacity={0.8}>
              {activeCategory === cat.id ? (
                <LinearGradient
                  colors={['#7c3aed', '#2563eb']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={cp.pillActive}
                >
                  <Ionicons name={cat.icon} size={14} color="#fff" />
                  <Text style={cp.labelActive}>{cat.label}</Text>
                </LinearGradient>
              ) : (
                <BlurView intensity={50} tint="light" style={cp.pillInactive}>
                  <Ionicons name={cat.icon} size={14} color="#7c3aed" />
                  <Text style={cp.label}>{cat.label}</Text>
                </BlurView>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </FadeIn>

    </View>
  );
};

export default HomeBanners;

// ── Estilos ───────────────────────────────────────────────────────────────────

const pb = StyleSheet.create({
  container: {
    marginHorizontal: 16, marginBottom: 14,
    borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)',
  },
  inner: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 13, paddingVertical: 11, gap: 11,
  },
  icon: {
    width: 36, height: 36, borderRadius: 11, flexShrink: 0,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
  },
  center: { flex: 1, gap: 5 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 12.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b', letterSpacing: -0.1 },
  pct:   { fontSize: 12.5, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#7c3aed' },
  track: { height: 4, backgroundColor: 'rgba(124,58,237,0.1)', borderRadius: 10, overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 10 },
  hint:  { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.55)' },
});

const hc = StyleSheet.create({
  card: {
    width: CARD_W, height: CARD_H, borderRadius: 24, overflow: 'hidden',
    elevation: 8, shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 14,
  },
  img:      { flex: 1, justifyContent: 'space-between', padding: 18 },
  imgStyle: { borderRadius: 24 },
  topRow:   { alignSelf: 'flex-start' },
  tagPill:  { borderRadius: 50, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' },
  tagBlur:  { paddingHorizontal: 12, paddingVertical: 5, backgroundColor: 'rgba(255,255,255,0.15)', flexDirection: 'row', alignItems: 'center', gap: 5 },
  tagDot:   { width: 5, height: 5, borderRadius: 3 },
  tagText:  { fontSize: 9, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff', letterSpacing: 1.4 },
  bottom:   { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  info:     { flex: 1, marginRight: 10 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  dot:      { width: 6, height: 6, borderRadius: 3 },
  eyebrow:  { fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold', color: 'rgba(255,255,255,0.65)', letterSpacing: 1.2 },
  title:    { fontSize: 20, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff', lineHeight: 25, letterSpacing: -0.3, marginBottom: 6 },
  meta:     { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(255,255,255,0.58)' },
  ctaPill:  { borderRadius: 50, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' },
  cta:      { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: 'rgba(255,255,255,0.18)' },
  ctaText:  { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
});

const cp = StyleSheet.create({
  scroll:       { paddingHorizontal: 16, gap: 10, paddingVertical: 10 },
  pillActive:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 8, borderRadius: 50, elevation: 4, shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6 },
  pillInactive: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 8, borderRadius: 50, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)', backgroundColor: 'rgba(255,255,255,0.5)' },
  label:        { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(109,40,217,0.65)' },
  labelActive:  { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
});

const cr = StyleSheet.create({
  dots:     { flexDirection: 'row', gap: 5, justifyContent: 'center', marginTop: 10 },
  dot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(124,58,237,0.18)' },
  dotActive: { width: 22, borderRadius: 3, backgroundColor: '#7c3aed' },
});

const s = StyleSheet.create({ container: { paddingTop: 10 } });