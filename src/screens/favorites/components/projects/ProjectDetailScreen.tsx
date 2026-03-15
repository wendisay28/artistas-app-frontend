// ─────────────────────────────────────────────────────────────────────────────
// ProjectDetailScreen.tsx — Vista de un proyecto con todos sus ítems
// Con dark mode completo y filtros por tipo
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, Modal, Dimensions, Alert, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useListsStore, type Project } from '../../../../store/listsStore';
import { useThemeStore } from '../../../../store/themeStore';
import type { ExploreCard } from '../../../../types/explore';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - 48) / 2;

const TYPE_COLORS: Record<string, [string, string]> = {
  artist:  ['#7c3aed', '#2563eb'],
  event:   ['#db2777', '#f59e0b'],
  venue:   ['#059669', '#0ea5e9'],
  gallery: ['#d97706', '#ef4444'],
};
const TYPE_LABELS: Record<string, string> = {
  artist: 'Artista', event: 'Evento', venue: 'Sala', gallery: 'Galería',
};

const FILTER_OPTIONS = [
  { key: 'all', label: 'Todos' },
  { key: 'artist', label: '🎭 Artistas' },
  { key: 'event', label: '📅 Eventos' },
  { key: 'venue', label: '🏛 Salas' },
  { key: 'gallery', label: '🖼 Galería' },
];

type Props = {
  project: Project;
  visible: boolean;
  onClose: () => void;
};

const ItemCard: React.FC<{
  item: ExploreCard;
  onRemove: () => void;
  isDark: boolean;
}> = ({ item, onRemove, isDark }) => {
  const colors = TYPE_COLORS[item.type] ?? ['#7c3aed', '#2563eb'];

  const confirmRemove = () =>
    Alert.alert('Quitar del proyecto', `¿Quitar "${item.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Quitar', style: 'destructive', onPress: onRemove },
    ]);

  return (
    <View style={[itemStyles.card, isDark && itemStyles.cardDark, { width: CARD_W }]}>
      <View style={itemStyles.imgWrap}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <LinearGradient
            colors={isDark ? ['#1a0f35', '#0d0820'] : ['#ede8ff', '#e4eeff']}
            style={StyleSheet.absoluteFill}
          />
        )}
        <LinearGradient
          colors={['transparent', 'rgba(30,27,75,0.6)']}
          style={itemStyles.imgGradient}
        />
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={itemStyles.typePill}
        >
          <Text style={itemStyles.typeText}>{TYPE_LABELS[item.type] ?? item.type}</Text>
        </LinearGradient>
        <TouchableOpacity style={itemStyles.removeBtn} onPress={confirmRemove} hitSlop={8}>
          <Ionicons name="close" size={12} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={[itemStyles.info, isDark && itemStyles.infoDark]}>
        <Text style={[itemStyles.name, isDark && itemStyles.nameDark]} numberOfLines={1}>
          {item.name}
        </Text>
        {item.location ? (
          <View style={itemStyles.loc}>
            <Ionicons name="location-outline" size={10} color={isDark ? 'rgba(167,139,250,0.5)' : 'rgba(109,40,217,0.5)'} />
            <Text style={[itemStyles.locText, isDark && itemStyles.locTextDark]} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const itemStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.18)',
    overflow: 'hidden',
    shadowColor: '#5b21b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#130d2a',
    borderColor: 'rgba(139,92,246,0.18)',
    shadowColor: '#000',
  },
  imgWrap: { height: 130, backgroundColor: '#e5e7eb' },
  imgGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
  },
  typePill: {
    position: 'absolute', bottom: 8, left: 8,
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3,
  },
  typeText: {
    fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff', letterSpacing: 0.3,
  },
  removeBtn: {
    position: 'absolute', top: 6, right: 6,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  info: { padding: 10, gap: 3, backgroundColor: '#fff' },
  infoDark: { backgroundColor: '#130d2a' },
  name: {
    fontSize: 12.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  nameDark: { color: '#f5f3ff' },
  loc: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  locText: {
    fontSize: 10.5, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.5)', flex: 1,
  },
  locTextDark: { color: 'rgba(167,139,250,0.5)' },
});

export const ProjectDetailScreen: React.FC<Props> = ({ project, visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeStore();
  const { removeFromProject } = useListsStore();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredItems = activeFilter === 'all'
    ? project.cards
    : project.cards.filter(i => i.type === activeFilter);

  const renderItem = ({ item, index }: { item: ExploreCard; index: number }) => {
    const isLeft = index % 2 === 0;
    return (
      <View style={[detailStyles.itemWrapper, isLeft ? { marginRight: 8 } : { marginLeft: 8 }]}>
        <ItemCard
          item={item}
          isDark={isDark}
          onRemove={() => removeFromProject(project.id, item.id)}
        />
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[detailStyles.root, isDark && detailStyles.rootDark, { paddingTop: insets.top }]}>

        {/* Header */}
        <View style={[detailStyles.header, isDark && detailStyles.headerDark]}>
          <TouchableOpacity onPress={onClose} style={[detailStyles.backBtn, isDark && detailStyles.backBtnDark]}>
            <Ionicons name="chevron-back" size={22} color={isDark ? '#f5f3ff' : '#1e1b4b'} />
          </TouchableOpacity>
          <View style={detailStyles.headerCenter}>
            <Ionicons name={project.icon as any} size={22} color="#7c3aed" />
            <Text style={[detailStyles.title, isDark && detailStyles.titleDark]} numberOfLines={1}>
              {project.name}
            </Text>
          </View>
          <View style={detailStyles.backBtn} />
        </View>

        {/* Filtros */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={detailStyles.filtersContent}
          style={detailStyles.filtersRow}
        >
          {FILTER_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setActiveFilter(opt.key)}
              style={[
                detailStyles.filterPill,
                isDark && detailStyles.filterPillDark,
                activeFilter === opt.key && detailStyles.filterPillActive,
                activeFilter === opt.key && isDark && detailStyles.filterPillActiveDark,
              ]}
            >
              <Text style={[
                detailStyles.filterText,
                isDark && detailStyles.filterTextDark,
                activeFilter === opt.key && detailStyles.filterTextActive,
              ]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Counter */}
        <Text style={[detailStyles.counter, isDark && detailStyles.counterDark]}>
          {filteredItems.length} {filteredItems.length === 1 ? 'ítem' : 'ítems'}
          {activeFilter !== 'all' ? ` · ${TYPE_LABELS[activeFilter]}` : ' guardados'}
        </Text>

        {/* Grid */}
        {filteredItems.length === 0 ? (
          <View style={detailStyles.empty}>
            <Text style={detailStyles.emptyEmoji}>📂</Text>
            <Text style={[detailStyles.emptyTitle, isDark && detailStyles.emptyTitleDark]}>
              {activeFilter === 'all' ? 'Proyecto vacío' : `Sin ${TYPE_LABELS[activeFilter]?.toLowerCase()}s`}
            </Text>
            <Text style={[detailStyles.emptySub, isDark && detailStyles.emptySubDark]}>
              {activeFilter === 'all'
                ? 'Agrega artistas, salas, eventos o galerías desde tus favoritos.'
                : 'No hay ítems de este tipo en el proyecto.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={i => i.id}
            numColumns={2}
            contentContainerStyle={detailStyles.grid}
            columnWrapperStyle={detailStyles.row}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
          />
        )}
      </View>
    </Modal>
  );
};

const detailStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#faf9ff' },
  rootDark: { backgroundColor: '#0a0618' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(167,139,250,0.12)',
    backgroundColor: '#fff',
  },
  headerDark: {
    backgroundColor: '#0d0820',
    borderBottomColor: 'rgba(139,92,246,0.15)',
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(124,58,237,0.06)',
  },
  backBtnDark: {
    backgroundColor: 'rgba(124,58,237,0.12)',
  },
  headerCenter: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
  },
  title: {
    fontSize: 17, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
    flexShrink: 1,
  },
  titleDark: { color: '#f5f3ff' },

  // Filtros
  filtersRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167,139,250,0.08)',
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.15)',
  },
  filterPillDark: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.10)',
  },
  filterPillActive: {
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderColor: 'rgba(124,58,237,0.35)',
  },
  filterPillActiveDark: {
    backgroundColor: 'rgba(124,58,237,0.18)',
    borderColor: 'rgba(124,58,237,0.4)',
  },
  filterText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#6b7280',
  },
  filterTextDark: { color: '#6b7280' },
  filterTextActive: { color: '#7c3aed' },

  counter: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(109,40,217,0.5)',
    marginHorizontal: 16, marginTop: 14, marginBottom: 6,
  },
  counterDark: { color: 'rgba(167,139,250,0.5)' },

  grid: { paddingHorizontal: 16, paddingBottom: 32, paddingTop: 8 },
  row: { marginBottom: 12 },
  itemWrapper: { flex: 1 },

  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, gap: 10,
  },
  emptyEmoji: { fontSize: 52, marginBottom: 4 },
  emptyTitle: {
    fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  emptyTitleDark: { color: '#f5f3ff' },
  emptySub: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)', textAlign: 'center', lineHeight: 19,
  },
  emptySubDark: { color: 'rgba(167,139,250,0.5)' },
});