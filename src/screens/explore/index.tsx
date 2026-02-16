// ─────────────────────────────────────────────────────────────────────────────
// pages/explore/index.tsx — Orquestador principal de la pantalla Explore
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Image, Pressable, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../constants/colors';
import { auth } from '../../services/firebase/config';

import SwipeCard, { CARD_WIDTH, CARD_HEIGHT } from '../../components/explore/cards/SwipeCard';
import ArtistCardContent  from '../../components/explore/cards/ArtistCardContent';
import EventCardContent   from '../../components/explore/cards/EventCardContent';
import GalleryCardContent from '../../components/explore/cards/GalleryCardContent';
import VenueCardContent   from '../../components/explore/cards/VenueCardContent';

import ArtistDetails  from '../../components/explore/details/ArtistDetails';
import EventDetails   from '../../components/explore/details/EventDetails';
import GalleryDetails from '../../components/explore/details/GalleryDetails';
import VenueDetails   from '../../components/explore/details/VenueDetails';

import CategorySelector from '../../components/explore/CategorySelector';

import type {
  Artist, Event, GalleryItem, Venue,
  ExploreCard, CategoryId, SwipeDirection, SwipeResult,
} from '../../types/explore';
import { MOCK_ARTISTS, MOCK_EVENTS, MOCK_VENUES, MOCK_GALLERY } from '../../data/explore';

const CATEGORY_LABELS: Record<CategoryId, string> = {
  artists: 'Artistas',
  events:  'Eventos',
  venues:  'Salas',
  gallery: 'Galería',
};

const CATEGORY_ICONS: Record<CategoryId, string> = {
  artists: 'brush-outline',
  events:  'calendar-outline',
  venues:  'business-outline',
  gallery: 'images-outline',
};

const CARD_STACK_DATA: Record<CategoryId, ExploreCard[]> = {
  artists: MOCK_ARTISTS,
  events:  MOCK_EVENTS,
  venues:  MOCK_VENUES,
  gallery: MOCK_GALLERY,
};

// Componente para el icono animado del swipe hint
const AnimatedSwipeHintIcon = ({ animValue }: { animValue: Animated.Value }) => (
  <Animated.View style={{
    transform: [{
      translateY: animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 8],
        extrapolate: 'clamp',
      })
    }],
  }}>
    <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
  </Animated.View>
);

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('artists');
  const [stack,            setStack]            = useState<ExploreCard[]>(MOCK_ARTISTS);
  const [swipeHistory,     setSwipeHistory]     = useState<SwipeResult[]>([]);
  const [menuOpen,         setMenuOpen]         = useState(false);
  const [showFilters,      setShowFilters]      = useState(false);

  // Animación para el swipe hint
  const swipeHintAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación sutil del swipe hint
    const animateSwipeHint = () => {
      Animated.sequence([
        Animated.timing(swipeHintAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(swipeHintAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // Iniciar animación después de 1s y repetir cada 4s
    const timer = setTimeout(() => {
      animateSwipeHint();
      const interval = setInterval(animateSwipeHint, 4000);
      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerBg = scrollY.interpolate({
    inputRange:  [0, 80],
    outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.97)'],
    extrapolate: 'clamp',
  });
  const headerShadow = scrollY.interpolate({
    inputRange:  [0, 80],
    outputRange: [0, 0.08],
    extrapolate: 'clamp',
  });
  const cardScale = scrollY.interpolate({
    inputRange:  [0, 260],
    outputRange: [1, 0.6],
    extrapolate: 'clamp',
  });
  const cardOpacity = scrollY.interpolate({
    inputRange:  [200, 300],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleCategoryChange = useCallback((cat: CategoryId) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setSelectedCategory(cat);
    setStack([...CARD_STACK_DATA[cat]]);
    setSwipeHistory([]);
    setMenuOpen(false);
  }, []);

  const handleDismiss = useCallback((id: string, direction: SwipeDirection) => {
    setStack(prev => prev.filter(c => c.id !== id));
    setSwipeHistory(prev => [...prev, { cardId: id, direction, timestamp: Date.now() }]);
  }, []);

  const handleReset = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStack([...CARD_STACK_DATA[selectedCategory]]);
    setSwipeHistory([]);
  }, [selectedCategory]);

  const renderCardContent = (card: ExploreCard) => {
    switch (card.type) {
      case 'artist':  return <ArtistCardContent  artist={card as Artist} />;
      case 'event':   return <EventCardContent   event={card as Event}   />;
      case 'gallery': return <GalleryCardContent item={card as GalleryItem} />;
      case 'venue':   return <VenueCardContent   venue={card as Venue}   />;
    }
  };

  const renderDetails = (card: ExploreCard) => {
    switch (card.type) {
      case 'artist': {
        const c = card as Artist;
        return <ArtistDetails artist={c} onHire={() => {}} onMessage={() => {}} onShare={() => {}} />;
      }
      case 'event': {
        const c = card as Event;
        return <EventDetails event={c} onBuyTicket={() => {}} onShare={() => {}} onViewDetails={() => {}} />;
      }
      case 'gallery': {
        const c = card as GalleryItem;
        return <GalleryDetails item={c} onBuy={() => {}} onContact={() => {}} onShare={() => {}} />;
      }
      case 'venue': {
        const c = card as Venue;
        return <VenueDetails venue={c} onReserve={() => {}} onContact={() => {}} onShare={() => {}} />;
      }
    }
  };

  const topCard = stack[stack.length - 1] ?? null;
  const webTopInset    = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  return (
    <View style={styles.root}>

      {/* ══ HEADER ══ */}
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop:      (insets.top || webTopInset) + 8,
            backgroundColor: headerBg,
            shadowOpacity:   headerShadow,
          },
        ]}
      >
        {/* avatar */}
        {auth.currentUser?.photoURL ? (
          <Image source={{ uri: auth.currentUser.photoURL }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Ionicons name="person" size={16} color={colors.textSecondary} />
          </View>
        )}

        {/* botón categoría (reemplaza "Explorar") */}
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            setMenuOpen(p => !p);
            setShowFilters(false);
          }}
          style={({ pressed }) => [
            styles.categoryBtn,
            menuOpen && styles.categoryBtnActive,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ionicons
            name={CATEGORY_ICONS[selectedCategory] as any}
            size={15}
            color={menuOpen ? colors.primary : colors.text}
          />
          <Text style={[styles.categoryLabel, menuOpen && { color: colors.primary }]}>
            {CATEGORY_LABELS[selectedCategory]}
          </Text>
          <Ionicons
            name={menuOpen ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={menuOpen ? colors.primary : colors.textSecondary}
          />
        </Pressable>

        {/* filtros — misma posición que antes */}
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            setShowFilters(p => !p);
            setMenuOpen(false);
          }}
          style={({ pressed }) => [
            styles.iconBtn,
            showFilters && styles.iconBtnActive,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={showFilters ? colors.primary : colors.text}
          />
        </Pressable>
      </Animated.View>

      {/* ══ CATEGORY DROPDOWN ══ */}
      {menuOpen && (
        <CategorySelector
          selected={selectedCategory}
          onChange={handleCategoryChange}
          topOffset={(insets.top || webTopInset) + 56}
          onClose={() => setMenuOpen(false)}
        />
      )}

      {/* ══ FILTER PANEL ══ */}
      {showFilters && (
        <View style={[styles.filterPanel, { top: (insets.top || webTopInset) + 56 }]}>
          <Text style={styles.filterTitle}>Filtros</Text>
          <View style={styles.filterChips}>
            {['Cerca de mí', 'Mejor rating', 'Disponible hoy', 'Precio bajo'].map(f => (
              <Pressable key={f} style={({ pressed }) => [styles.filterChip, pressed && { opacity: 0.7 }]}>
                <Text style={styles.filterChipText}>{f}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* ══ SCROLL ══ */}
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: (insets.bottom || webBottomInset) + 96 }]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        snapToOffsets={[0, CARD_HEIGHT + 80]}
        decelerationRate="fast"
      >
        <View style={{ height: (insets.top || webTopInset) + 60 }} />

        {/* stack */}
        <View style={styles.stackWrapper}>
          {stack.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="albums-outline" size={52} color={colors.border} />
              <Text style={styles.emptyTitle}>Has visto todo</Text>
              <Text style={styles.emptySub}>Vuelve pronto o cambia de categoría</Text>
              <Pressable onPress={handleReset} style={({ pressed }) => [styles.resetBtn, pressed && { opacity: 0.85 }]}>
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={styles.resetText}>Ver de nuevo</Text>
              </Pressable>
            </View>
          ) : (
            <Animated.View style={{ transform: [{ scale: cardScale }], opacity: cardOpacity }}>
              {[...stack].reverse().map((card, i) => (
                <SwipeCard key={card.id} card={card} zIndex={stack.length - i} onDismiss={handleDismiss}>
                  {renderCardContent(card)}
                </SwipeCard>
              ))}
            </Animated.View>
          )}
        </View>

        {stack.length > 0 && (
          <View style={styles.swipeHint}>
            <AnimatedSwipeHintIcon animValue={swipeHintAnim} />
            <Text style={styles.swipeHintText}>Desliza para ver más</Text>
          </View>
        )}

        {topCard && <View style={styles.detailsWrapper}>{renderDetails(topCard)}</View>}

      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingBottom: 10,
    zIndex: 50,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 4,
  },

  avatar: { width: 32, height: 32, borderRadius: 16 },
  avatarFallback: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },

  // botón categoría — pill que reemplaza "Explorar"
  categoryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  categoryBtnActive: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary + '40',
  },
  categoryLabel: {
    flex: 1, fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },

  // botón filtros
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  iconBtnActive: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary + '40',
  },

  // filter panel
  filterPanel: {
    position: 'absolute', right: 16, width: 220,
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    zIndex: 45,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 8,
  },
  filterTitle: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text, marginBottom: 10,
  },
  filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  filterChip: {
    backgroundColor: colors.background, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  filterChipText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
  },

  scroll: { flex: 1 },
  scrollContent: { alignItems: 'center' },

  stackWrapper: {
    width: CARD_WIDTH, height: CARD_HEIGHT,
    position: 'relative', marginBottom: 8,
  },

  emptyState: {
    width: CARD_WIDTH, height: CARD_HEIGHT,
    alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: colors.background,
    borderRadius: 24, borderWidth: 1, borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold', color: colors.text,
  },
  emptySub: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 32,
  },
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 8,
    backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 14,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  resetText: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff',
  },

  swipeHint: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginTop: -5, marginBottom: 12,
  },
  swipeHintText: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: colors.textSecondary,
  },
  swipeHintIcon: {
    transform: [{
      translateY: 8, // Valor fijo, la animación se manejará en el componente
    }],
  },

  detailsWrapper: { width: CARD_WIDTH, paddingBottom: 16 },
});