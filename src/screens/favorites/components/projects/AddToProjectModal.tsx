// ─────────────────────────────────────────────────────────────────────────────
// AddToProjectModal.tsx — Bottom sheet para añadir un ítem a un proyecto
// Muestra proyectos existentes y permite crear uno nuevo al vuelo
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  StyleSheet, FlatList, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useListsStore, type Project } from '../../../../store/listsStore';
import { CreateProjectModal } from './CreateProjectModal';
import type { ExploreCard } from '../../../../types/explore';

type Props = {
  visible: boolean;
  item: ExploreCard | null;
  onClose: () => void;
};

export const AddToProjectModal: React.FC<Props> = ({ visible, item, onClose }) => {
  const insets  = useSafeAreaInsets();
  const { projects, createProject, addToProject, removeFromProject, isInProject } = useListsStore();
  const [showCreate, setShowCreate] = useState(false);

  if (!item) return null;

  const handleToggle = (project: Project) => {
    if (isInProject(project.id, item.id)) {
      Alert.alert(
        'Quitar del proyecto',
        `¿Quitar "${item.name}" de "${project.name}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Quitar', style: 'destructive', onPress: () => removeFromProject(project.id, item.id) },
        ]
      );
    } else {
      addToProject(project.id, item);
    }
  };

  const handleCreateAndAdd = (name: string, emoji: string) => {
    const id = createProject(name, emoji);
    addToProject(id, item);
  };

  const typeLabel: Record<string, string> = {
    artist: 'Artista', event: 'Evento', venue: 'Sala', gallery: 'Galería',
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>

            {/* Handle */}
            <View style={styles.handle} />

            {/* Header con info del ítem */}
            <View style={styles.header}>
              <View style={styles.itemPreview}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.itemThumb} contentFit="cover" />
                ) : (
                  <View style={[styles.itemThumb, styles.itemThumbFallback]}>
                    <Text style={styles.itemEmoji}>🎨</Text>
                  </View>
                )}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemType}>{typeLabel[item.type] ?? item.type}</Text>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} hitSlop={12}>
                <Ionicons name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>Guardar en proyecto</Text>

            {/* Lista de proyectos */}
            {projects.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Aún no tienes proyectos.</Text>
                <Text style={styles.emptySubtext}>Crea uno para organizar tus favoritos.</Text>
              </View>
            ) : (
              <FlatList
                data={projects}
                keyExtractor={p => p.id}
                style={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: project }) => {
                  const saved = isInProject(project.id, item.id);
                  const cover = project.items.find(i => i.image)?.image;
                  return (
                    <TouchableOpacity
                      style={[styles.projectRow, saved && styles.projectRowActive]}
                      onPress={() => handleToggle(project)}
                      activeOpacity={0.75}
                    >
                      {/* Cover */}
                      <View style={styles.projectCover}>
                        {cover ? (
                          <Image source={{ uri: cover }} style={StyleSheet.absoluteFill} contentFit="cover" />
                        ) : (
                          <LinearGradient colors={['#ede8ff','#e4eeff']} style={StyleSheet.absoluteFill} />
                        )}
                        <Text style={styles.projectEmoji}>{project.emoji}</Text>
                      </View>

                      {/* Info */}
                      <View style={styles.projectInfo}>
                        <Text style={styles.projectName}>{project.name}</Text>
                        <Text style={styles.projectCount}>
                          {project.items.length} {project.items.length === 1 ? 'ítem' : 'ítems'}
                        </Text>
                      </View>

                      {/* Check */}
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
              style={styles.createBtn}
              onPress={() => setShowCreate(true)}
              activeOpacity={0.8}
            >
              <View style={styles.createIcon}>
                <Ionicons name="add" size={18} color="#7c3aed" />
              </View>
              <Text style={styles.createText}>Crear nuevo proyecto</Text>
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
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingTop: 12,
    maxHeight: '80%',
  },
  handle: {
    alignSelf: 'center',
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(124,58,237,0.2)',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemPreview: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  itemThumb: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#e5e7eb', overflow: 'hidden',
  },
  itemThumbFallback: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(124,58,237,0.08)',
  },
  itemEmoji: { fontSize: 22 },
  itemInfo: { flex: 1 },
  itemType: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.5)', textTransform: 'uppercase', letterSpacing: 0.6,
    marginBottom: 2,
  },
  itemName: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  sectionLabel: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.5)', textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: 12,
  },
  list: { maxHeight: 300, marginBottom: 4 },
  emptyState: { paddingVertical: 24, alignItems: 'center', gap: 4, marginBottom: 8 },
  emptyText: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#6b7280',
  },
  emptySubtext: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#9ca3af',
  },
  projectRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 14, marginBottom: 6,
    backgroundColor: 'rgba(124,58,237,0.03)',
    borderWidth: 1, borderColor: 'rgba(167,139,250,0.15)',
  },
  projectRowActive: {
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderColor: 'rgba(124,58,237,0.3)',
  },
  projectCover: {
    width: 44, height: 44, borderRadius: 10,
    overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#ede8ff',
  },
  projectEmoji: { fontSize: 20, zIndex: 1 },
  projectInfo: { flex: 1 },
  projectName: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
    marginBottom: 2,
  },
  projectCount: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.45)',
  },
  checkCircle: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#7c3aed', borderColor: '#7c3aed',
  },
  createBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 13, paddingHorizontal: 12,
    borderRadius: 14, marginTop: 8,
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.25)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(124,58,237,0.04)',
  },
  createIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(124,58,237,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  createText: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed',
  },
});
