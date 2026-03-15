// ─────────────────────────────────────────────────────────────────────────────
// useAddToProjectModal.ts — Lógica del modal "Guardar en proyecto"
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Alert } from 'react-native';
import { useListsStore, type Project } from '../../../../store/listsStore';
import type { ExploreCard } from '../../../../types/explore';

export const TYPE_LABEL: Record<string, string> = {
  artist: 'Artista',
  event: 'Evento',
  venue: 'Sala',
  gallery: 'Galería',
};

export function useAddToProjectModal(item: ExploreCard | null) {
  const { projects, createProject, addToProject, removeFromProject, isInProject } = useListsStore();
  const [showCreate, setShowCreate] = useState(false);

  const handleToggle = (project: Project) => {
    if (!item) return;
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
    if (!item) return;
    const id = createProject(name, emoji);
    addToProject(id, item);
    setShowCreate(false);
  };

  return {
    projects,
    isInProject,
    showCreate,
    setShowCreate,
    handleToggle,
    handleCreateAndAdd,
  };
}
