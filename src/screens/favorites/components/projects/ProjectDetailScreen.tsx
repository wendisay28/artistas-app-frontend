// ─────────────────────────────────────────────────────────────────────────────
// ProjectDetailScreen.tsx — Vista de un proyecto con todos sus ítems mezclados
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, Modal, Dimensions, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useListsStore, type Project } from '../../../../store/listsStore';
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

type Props = {
  project: Project;
  visible: boolean;
  onClose: () => void;
};

const ItemCard: React.FC<{
  item: ExploreCard;
  onRemove: () => void;
}> = ({ item, onRemove }) => {
  const colors = TYPE_COLORS[item.type] ?? ['#7c3aed', '#2563eb'];

  const confirmRemove = () =>
    Alert.alert('Quitar del proyecto', `¿Quitar "${item.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Quitar', style: 'destructive', onPress: onRemove },
    ]);

  return (
    <View style={[itemStyles.card, { width: CARD_W }]}>
      {/* Imagen */}
      <View style={itemStyles.imgWrap}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <LinearGradient colors={['#ede8ff', '#e4eeff']} style={StyleSheet.absoluteFill} />
        )}
        <LinearGradient
          colors={['transparent', 'rgba(30,27,75,0.6)']}
          style={itemStyles.imgGradient}
        />
        {/* Type badge */}
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={itemStyles.typePill}
        >
          <Text style={itemStyles.typeText}>{TYPE_LABELS[item.type] ?? item.type}</Text>
        </LinearGradient>
        {/* Remove btn */}
        <TouchableOpacity style={itemStyles.removeBtn} onPress={confirmRemove} hitSlop={8}>
          <Ionicons name="close" size={12} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={itemStyles.info}>
        <Text style={itemStyles.name} numberOfLines={1}>{item.name}</Text>
        {item.location ? (
          <View style={itemStyles.loc}>
            <Ionicons name="location-outline" size={10} color="rgba(109,40,217,0.5)" />
            <Text style={itemStyles.locText} numberOfLines={1}>{item.location}</Text>
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
  info: { padding: 10, gap: 3 },
  name: {
    fontSize: 12.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  loc: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  locText: {
    fontSize: 10.5, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.5)', flex: 1,
  },
});

// ── Main component ─────────────────────────────────────────────────────────

export const ProjectDetailScreen: React.FC<Props> = ({ project, visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const { removeFromProject } = useListsStore();

  const renderItem = ({ item, index }: { item: ExploreCard; index: number }) => {
    const isLeft = index % 2 === 0;
    return (
      <View style={[detailStyles.itemWrapper, isLeft ? { marginRight: 8 } : { marginLeft: 8 }]}>
        <ItemCard
          item={item}
          onRemove={() => removeFromProject(project.id, item.id)}
        />
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[detailStyles.root, { paddingTop: insets.top }]}>

        {/* Header */}
        <View style={detailStyles.header}>
          <TouchableOpacity onPress={onClose} style={detailStyles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#1e1b4b" />
          </TouchableOpacity>
          <View style={detailStyles.headerCenter}>
            <Text style={detailStyles.emoji}>{project.emoji}</Text>
            <Text style={detailStyles.title} numberOfLines={1}>{project.name}</Text>
          </View>
          <View style={detailStyles.backBtn} />
        </View>

        {/* Counter */}
        <Text style={detailStyles.counter}>
          {project.items.length} {project.items.length === 1 ? 'ítem guardado' : 'ítems guardados'}
        </Text>

        {/* Grid */}
        {project.items.length === 0 ? (
          <View style={detailStyles.empty}>
            <Text style={detailStyles.emptyEmoji}>📂</Text>
            <Text style={detailStyles.emptyTitle}>Proyecto vacío</Text>
            <Text style={detailStyles.emptySub}>
              Agrega artistas, salas, eventos o galerías desde tus favoritos.
            </Text>
          </View>
        ) : (
          <FlatList
            data={project.items}
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
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(167,139,250,0.12)',
    backgroundColor: '#fff',
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(124,58,237,0.06)',
  },
  headerCenter: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
  },
  emoji: { fontSize: 22 },
  title: {
    fontSize: 17, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
    flexShrink: 1,
  },
  counter: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(109,40,217,0.5)',
    marginHorizontal: 16, marginTop: 14, marginBottom: 6,
  },
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
  emptySub: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)', textAlign: 'center', lineHeight: 19,
  },
});
