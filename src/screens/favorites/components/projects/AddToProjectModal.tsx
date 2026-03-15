// ─────────────────────────────────────────────────────────────────────────────
// AddToProjectModal.tsx — UI del modal "Guardar en proyecto"
// Lógica en: useAddToProjectModal.ts
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  StyleSheet, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useThemeStore } from '../../../../store/themeStore';
import { CreateProjectModal } from './CreateProjectModal';
import type { ExploreCard } from '../../../../types/explore';
import { useAddToProjectModal, TYPE_LABEL } from './useAddToProjectModal';

// Fondo de página: dark #0a0618 · light #F9FAFB
const BG_DARK  = '#0a0618';
const BG_LIGHT = '#F9FAFB';

type Props = {
  visible: boolean;
  item: ExploreCard | null;
  onClose: () => void;
};

export const AddToProjectModal: React.FC<Props> = ({ visible, item, onClose }) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeStore();
  const {
    projects, isInProject,
    showCreate, setShowCreate,
    handleToggle, handleCreateAndAdd,
  } = useAddToProjectModal(item);

  if (!item) return null;

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={[
            styles.sheet,
            { backgroundColor: isDark ? BG_DARK : BG_LIGHT },
            isDark && styles.sheetDarkBorder,
            { paddingBottom: insets.bottom + 16 },
          ]}>

            {/* Handle */}
            <View style={[styles.handle, isDark && styles.handleDark]} />

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.itemPreview}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.itemThumb} contentFit="cover" />
                ) : (
                  <View style={[styles.itemThumb, styles.itemThumbFallback, isDark && styles.itemThumbFallbackDark]}>
                    <Text style={styles.itemEmoji}>🎨</Text>
                  </View>
                )}
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemType, isDark && styles.itemTypeDark]}>
                    {TYPE_LABEL[item.type] ?? item.type}
                  </Text>
                  <Text style={[styles.itemName, isDark && styles.itemNameDark]} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} hitSlop={12}>
                <Ionicons name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionLabel, isDark && styles.sectionLabelDark]}>
              Guardar en proyecto
            </Text>

            {/* Lista de proyectos */}
            {projects.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                  Aún no tienes proyectos.
                </Text>
                <Text style={[styles.emptySubtext, isDark && styles.emptySubtextDark]}>
                  Crea uno para organizar tus favoritos.
                </Text>
              </View>
            ) : (
              <FlatList
                data={projects}
                keyExtractor={p => p.id}
                style={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: project }) => {
                  const saved = isInProject(project.id, item.id);
                  const cover = project.cards.find(i => i.image)?.image;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.projectRow,
                        isDark && styles.projectRowDark,
                        saved && styles.projectRowActive,
                        saved && isDark && styles.projectRowActiveDark,
                      ]}
                      onPress={() => handleToggle(project)}
                      activeOpacity={0.75}
                    >
                      <View style={[styles.projectCover, isDark && styles.projectCoverDark]}>
                        {cover ? (
                          <Image source={{ uri: cover }} style={StyleSheet.absoluteFill} contentFit="cover" />
                        ) : (
                          <LinearGradient
                            colors={isDark ? ['#1a0f35', '#0d0820'] : ['#ede8ff', '#e4eeff']}
                            style={StyleSheet.absoluteFill}
                          />
                        )}
                        <Ionicons name={project.icon as any} size={20} color="#7c3aed" />
                      </View>

                      <View style={styles.projectInfo}>
                        <Text style={[styles.projectName, isDark && styles.projectNameDark]}>
                          {project.name}
                        </Text>
                        <Text style={[styles.projectCount, isDark && styles.projectCountDark]}>
                          {project.cards.length} {project.cards.length === 1 ? 'ítem' : 'ítems'}
                        </Text>
                      </View>

                      <View style={[styles.checkCircle, saved && styles.checkCircleActive]}>
                        {saved && <Ionicons name="checkmark" size={14} color="#fff" />}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            )}

            {/* Crear nuevo proyecto */}
            <TouchableOpacity
              style={[styles.createBtn, isDark && styles.createBtnDark]}
              onPress={() => setShowCreate(true)}
              activeOpacity={0.8}
            >
              <View style={[styles.createIcon, isDark && styles.createIconDark]}>
                <Ionicons name="add" size={18} color="#7c3aed" />
              </View>
              <Text style={[styles.createText, isDark && styles.createTextDark]}>
                Crear nuevo proyecto
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      <CreateProjectModal
        visible={showCreate}
        mode="create"
        onConfirm={handleCreateAndAdd}
        onClose={() => setShowCreate(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingTop: 12,
    maxHeight: '80%',
  },
  sheetDarkBorder: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(139,92,246,0.22)',
  },
  handle: {
    alignSelf: 'center',
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(124,58,237,0.2)',
    marginBottom: 16,
  },
  handleDark: { backgroundColor: 'rgba(167,139,250,0.25)' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 20,
  },
  itemPreview: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  itemThumb: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#e5e7eb', overflow: 'hidden' },
  itemThumbFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(124,58,237,0.08)' },
  itemThumbFallbackDark: { backgroundColor: 'rgba(124,58,237,0.15)' },
  itemEmoji: { fontSize: 22 },
  itemInfo: { flex: 1 },
  itemType: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.5)', textTransform: 'uppercase',
    letterSpacing: 0.6, marginBottom: 2,
  },
  itemTypeDark: { color: 'rgba(167,139,250,0.6)' },
  itemName: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  itemNameDark: { color: '#f5f3ff' },
  sectionLabel: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.5)', textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: 12,
  },
  sectionLabelDark: { color: 'rgba(167,139,250,0.55)' },
  list: { maxHeight: 300, marginBottom: 4 },
  emptyState: { paddingVertical: 24, alignItems: 'center', gap: 4, marginBottom: 8 },
  emptyText: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#6b7280' },
  emptyTextDark: { color: '#9ca3af' },
  emptySubtext: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#9ca3af' },
  emptySubtextDark: { color: '#6b7280' },
  projectRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 14, marginBottom: 6,
    backgroundColor: 'rgba(124,58,237,0.03)',
    borderWidth: 1, borderColor: 'rgba(167,139,250,0.15)',
  },
  projectRowDark: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(167,139,250,0.12)',
  },
  projectRowActive: { backgroundColor: 'rgba(124,58,237,0.07)', borderColor: 'rgba(124,58,237,0.3)' },
  projectRowActiveDark: { backgroundColor: 'rgba(124,58,237,0.15)', borderColor: 'rgba(124,58,237,0.4)' },
  projectCover: {
    width: 44, height: 44, borderRadius: 10,
    overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#ede8ff',
  },
  projectCoverDark: { backgroundColor: '#1a0f35' },
  projectInfo: { flex: 1 },
  projectName: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b', marginBottom: 2 },
  projectNameDark: { color: '#f5f3ff' },
  projectCount: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.45)' },
  projectCountDark: { color: 'rgba(167,139,250,0.5)' },
  checkCircle: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  checkCircleActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  createBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 13, paddingHorizontal: 12,
    borderRadius: 14, marginTop: 8,
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.25)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(124,58,237,0.04)',
  },
  createBtnDark: {
    borderColor: 'rgba(139,92,246,0.3)',
    backgroundColor: 'rgba(124,58,237,0.08)',
  },
  createIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(124,58,237,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  createIconDark: { backgroundColor: 'rgba(124,58,237,0.2)' },
  createText: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },
  createTextDark: { color: '#a78bfa' },
});
