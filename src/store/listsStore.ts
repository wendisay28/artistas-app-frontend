// ─────────────────────────────────────────────────────────────────────────────
// listsStore.ts — Proyectos / Colecciones (estilo Pinterest)
// Persiste en AsyncStorage. Cada proyecto tiene:
//   cards:        artistas, eventos, salas, galería (ExploreCard)
//   inspirations: IDs de InspirationPost guardados en este proyecto
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ExploreCard } from '../types/explore';

export type Project = {
  id: string;
  name: string;
  icon: string;
  emoji?: string;
  createdAt: number;
  cards: ExploreCard[];      // artistas, eventos, sitios, galería
  inspirations: string[];    // IDs de InspirationPost guardados
};

type ListsStore = {
  projects: Project[];
  createProject:  (name: string, icon: string) => string;
  deleteProject:  (id: string) => void;
  renameProject:  (id: string, name: string, icon: string) => void;

  // ── Tarjetas ExploreCard ──────────────────────────────────────
  addToProject:         (projectId: string, item: ExploreCard) => void;
  removeFromProject:    (projectId: string, itemId: string) => void;
  isInProject:          (projectId: string, itemId: string) => boolean;

  // ── Posts de Inspiración (por ID) ────────────────────────────
  addInspirationToProject:      (projectId: string, inspirationId: string) => void;
  removeInspirationFromProject: (projectId: string, inspirationId: string) => void;
  isInspirationInProject:       (projectId: string, inspirationId: string) => boolean;
};

export const useListsStore = create<ListsStore>()(
  persist(
    (set, get) => ({
      projects: [],

      createProject: (name, icon) => {
        const id = `proj_${Date.now()}`;
        set(s => ({
          projects: [{
            id, name, icon,
            createdAt:    Date.now(),
            cards:        [],
            inspirations: [],
          }, ...s.projects],
        }));
        return id;
      },

      deleteProject: (id) =>
        set(s => ({ projects: s.projects.filter(p => p.id !== id) })),

      renameProject: (id, name, icon) =>
        set(s => ({
          projects: s.projects.map(p => p.id === id ? { ...p, name, icon } : p),
        })),

      // ── Cards ──────────────────────────────────────────────────
      addToProject: (projectId, item) =>
        set(s => ({
          projects: s.projects.map(p => {
            if (p.id !== projectId) return p;
            if (p.cards.some(c => c.id === item.id)) return p;
            return { ...p, cards: [item, ...p.cards] };
          }),
        })),

      removeFromProject: (projectId, itemId) =>
        set(s => ({
          projects: s.projects.map(p =>
            p.id === projectId
              ? { ...p, cards: p.cards.filter(c => c.id !== itemId) }
              : p
          ),
        })),

      isInProject: (projectId, itemId) => {
        const p = get().projects.find(p => p.id === projectId);
        return p ? p.cards.some(c => c.id === itemId) : false;
      },

      // ── Inspirations ────────────────────────────────────────────
      addInspirationToProject: (projectId, inspirationId) =>
        set(s => ({
          projects: s.projects.map(p => {
            if (p.id !== projectId) return p;
            if (p.inspirations.includes(inspirationId)) return p;
            return { ...p, inspirations: [inspirationId, ...p.inspirations] };
          }),
        })),

      removeInspirationFromProject: (projectId, inspirationId) =>
        set(s => ({
          projects: s.projects.map(p =>
            p.id === projectId
              ? { ...p, inspirations: p.inspirations.filter(id => id !== inspirationId) }
              : p
          ),
        })),

      isInspirationInProject: (projectId, inspirationId) => {
        const p = get().projects.find(p => p.id === projectId);
        return p ? p.inspirations.includes(inspirationId) : false;
      },
    }),
    {
      name:    'buscart-projects',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
