// ─────────────────────────────────────────────────────────────────────────────
// ProjectsTab.tsx — Tab "Proyectos" dentro de Favoritos
// Grid de tarjetas estilo Pinterest + botón crear
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useListsStore, type Project } from '../../../../store/listsStore';
import { ProjectCard } from './ProjectCard';
import { CreateProjectModal } from './CreateProjectModal';
import { ProjectDetailScreen } from './ProjectDetailScreen';

const { width: SCREEN_W } = Dimensions.get('window');
const COLUMN_GAP = 12;
const H_PAD = 16;
const CARD_W = (SCREEN_W - H_PAD * 2 - COLUMN_GAP) / 2;

export const ProjectsTab: React.FC = () => {
  const { projects, createProject, deleteProject, renameProject } = useListsStore();

  const [showCreate, setShowCreate]         = useState(false);
  const [renameTarget, setRenameTarget]     = useState<Project | null>(null);
  const [detailProject, setDetailProject]   = useState<Project | null>(null);

  const handleCreate = (name: string, emoji: string) => createProject(name, emoji);

  const handleRename = (name: string, emoji: string) => {
    if (renameTarget) renameProject(renameTarget.id, name, emoji);
    setRenameTarget(null);
  };

  const renderItem = ({ item, index }: { item: Project; index: number }) => {
    const isLeft = index % 2 === 0;
    return (
      <View style={[
        styles.cardWrapper,
        isLeft ? { marginRight: COLUMN_GAP / 2 } : { marginLeft: COLUMN_GAP / 2 },
      ]}>
        <ProjectCard
          project={item}
          onPress={() => setDetailProject(item)}
          onDelete={() => deleteProject(item.id)}
          onRename={() => setRenameTarget(item)}
        />
      </View>
    );
  };

  return (
    <View style={styles.root}>

      {/* Header row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.heading}>Mis proyectos</Text>
          <Text style={styles.subheading}>
            {projects.length === 0
              ? 'Crea tu primer proyecto'
              : `${projects.length} ${projects.length === 1 ? 'proyecto' : 'proyectos'}`}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowCreate(true)} activeOpacity={0.85}>
          <LinearGradient
            colors={['#7c3aed', '#2563eb']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.newBtn}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.newBtnText}>Nuevo</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Empty state */}
      {projects.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIllustration}>
            <Text style={styles.emptyIllustrationEmoji}>📌</Text>
          </View>
          <Text style={styles.emptyTitle}>Organiza tu inspiración</Text>
          <Text style={styles.emptySub}>
            Crea proyectos como "Banda para mi boda" o "Muralista para la oficina" y agrupa artistas, salas, fotos y eventos en un solo lugar.
          </Text>
          <TouchableOpacity onPress={() => setShowCreate(true)} activeOpacity={0.85}>
            <LinearGradient
              colors={['#7c3aed', '#2563eb']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.emptyBtn}
            >
              <Ionicons name="folder-open-outline" size={16} color="#fff" />
              <Text style={styles.emptyBtnText}>Crear primer proyecto</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={p => p.id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={renderItem}
        />
      )}

      {/* Modales */}
      <CreateProjectModal
        visible={showCreate}
        mode="create"
        onConfirm={handleCreate}
        onClose={() => setShowCreate(false)}
      />

      <CreateProjectModal
        visible={renameTarget !== null}
        mode="rename"
        initialName={renameTarget?.name}
        initialEmoji={renameTarget?.emoji}
        onConfirm={handleRename}
        onClose={() => setRenameTarget(null)}
      />

      {detailProject && (
        <ProjectDetailScreen
          project={projects.find(p => p.id === detailProject.id) ?? detailProject}
          visible={detailProject !== null}
          onClose={() => setDetailProject(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PAD,
    paddingTop: 16,
    paddingBottom: 12,
  },
  heading: {
    fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  subheading: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)', marginTop: 2,
  },
  newBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12,
  },
  newBtnText: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff',
  },

  grid: {
    paddingHorizontal: H_PAD,
    paddingBottom: 32,
  },
  row: { marginBottom: COLUMN_GAP },
  cardWrapper: { width: CARD_W },

  // Empty
  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 36, paddingTop: 40, gap: 12,
  },
  emptyIllustration: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  emptyIllustrationEmoji: { fontSize: 38 },
  emptyTitle: {
    fontSize: 17, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)', textAlign: 'center', lineHeight: 20,
  },
  emptyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 20, paddingVertical: 13, borderRadius: 14, marginTop: 4,
  },
  emptyBtnText: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff',
  },
});
