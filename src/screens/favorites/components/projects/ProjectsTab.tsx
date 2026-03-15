// ─────────────────────────────────────────────────────────────────────────────
// ProjectsTab.tsx — Tab "Proyectos" dentro de Favoritos
// Mejora: proyectos expandidos se muestran en lista vertical, no grid roto
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, Dimensions, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useListsStore, type Project } from '../../../../store/listsStore';
import { useThemeStore } from '../../../../store/themeStore';
import { ProjectCard } from './ProjectCard';
import { CreateProjectModal } from './CreateProjectModal';
import { ProjectDetailScreen } from './ProjectDetailScreen';
import { EmptyProjectSkeleton } from './EmptyProjectSkeleton';

const { width: SCREEN_W } = Dimensions.get('window');
const COLUMN_GAP = 12;
const H_PAD = 16;
const CARD_W = (SCREEN_W - H_PAD * 2 - COLUMN_GAP) / 2;

export const ProjectsTab: React.FC = () => {
  const { projects, createProject, deleteProject, renameProject, removeFromProject } = useListsStore();
  const { isDark } = useThemeStore();

  const [showCreate, setShowCreate]       = useState(false);
  const [renameTarget, setRenameTarget]   = useState<Project | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [expandedIds, setExpandedIds]     = useState<Set<string>>(new Set());

  const handleCreate = (name: string, icon: string) => createProject(name, icon);
  const handleRename = (name: string, icon: string) => {
    if (renameTarget) renameProject(renameTarget.id, name, icon);
    setRenameTarget(null);
  };
  const handleToggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Separamos los expandidos (lista vertical) de los colapsados (grid 2 col)
  const collapsed = projects.filter(p => !expandedIds.has(p.id));
  const expanded  = projects.filter(p => expandedIds.has(p.id));

  // Render de un proyecto colapsado en el grid
  const renderCollapsed = ({ item, index }: { item: Project; index: number }) => {
    const isLeft = index % 2 === 0;
    return (
      <View style={[
        styles.cardWrapper,
        isLeft ? { marginRight: COLUMN_GAP / 2 } : { marginLeft: COLUMN_GAP / 2 },
      ]}>
        <ProjectCard
          project={item}
          expanded={false}
          onPress={() => setDetailProject(item)}
          onDelete={() => deleteProject(item.id)}
          onRename={() => setRenameTarget(item)}
          onToggleExpand={() => handleToggleExpand(item.id)}
        />
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.root, isDark && styles.rootDark]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.heading, isDark && styles.headingDark]}>Mis proyectos</Text>
          <Text style={[styles.subheading, isDark && styles.subheadingDark]}>
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
        <EmptyProjectSkeleton />
      ) : (
        <>
          {/* Proyectos expandidos — lista vertical de 1 columna */}
          {expanded.length > 0 && (
            <View style={styles.expandedSection}>
              {expanded.map(item => (
                <View key={item.id} style={styles.expandedCard}>
                  <ProjectCard
                    project={item}
                    expanded={true}
                    onPress={() => setDetailProject(item)}
                    onDelete={() => deleteProject(item.id)}
                    onRename={() => setRenameTarget(item)}
                    onToggleExpand={() => handleToggleExpand(item.id)}
                  />
                </View>
              ))}
            </View>
          )}

          {/* Proyectos colapsados — grid 2 columnas */}
          {collapsed.length > 0 && (
            <FlatList
              data={collapsed}
              keyExtractor={p => p.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.grid}
              columnWrapperStyle={styles.row}
              renderItem={renderCollapsed}
            />
          )}
        </>
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
        initialIcon={renameTarget?.icon}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  rootDark: { backgroundColor: '#0a0618' },
  scrollContent: { paddingBottom: 40 },

  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: H_PAD, paddingTop: 16, paddingBottom: 12,
  },
  heading: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  headingDark: { color: '#f5f3ff' },
  subheading: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)', marginTop: 2,
  },
  subheadingDark: { color: 'rgba(167,139,250,0.6)' },
  newBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12,
    shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  newBtnText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },

  // Expandidos — lista vertical
  expandedSection: { paddingHorizontal: H_PAD, gap: COLUMN_GAP, marginBottom: COLUMN_GAP },
  expandedCard: { width: '100%' },

  // Colapsados — grid 2 col
  grid: { paddingHorizontal: H_PAD, paddingBottom: 8 },
  row: { marginBottom: COLUMN_GAP },
  cardWrapper: { width: CARD_W },
});