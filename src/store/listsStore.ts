// ─────────────────────────────────────────────────────────────────────────────
// listsStore.ts — Proyectos / Colecciones (estilo Pinterest)
// Independiente de favoritesStore. Cada proyecto es una carpeta con
// ítems mezclados: artistas, salas, galería, eventos.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import type { ExploreCard } from '../types/explore';

export type Project = {
  id: string;
  name: string;
  emoji: string;
  createdAt: number;
  items: ExploreCard[];
};

type ListsStore = {
  projects: Project[];
  createProject: (name: string, emoji: string) => string;
  deleteProject: (id: string) => void;
  renameProject: (id: string, name: string, emoji: string) => void;
  addToProject: (projectId: string, item: ExploreCard) => void;
  removeFromProject: (projectId: string, itemId: string) => void;
  isInProject: (projectId: string, itemId: string) => boolean;
};

export const useListsStore = create<ListsStore>((set, get) => ({
  projects: [],

  createProject: (name, emoji) => {
    const id = `proj_${Date.now()}`;
    set(s => ({
      projects: [{ id, name, emoji, createdAt: Date.now(), items: [] }, ...s.projects],
    }));
    return id;
  },

  deleteProject: (id) =>
    set(s => ({ projects: s.projects.filter(p => p.id !== id) })),

  renameProject: (id, name, emoji) =>
    set(s => ({
      projects: s.projects.map(p => p.id === id ? { ...p, name, emoji } : p),
    })),

  addToProject: (projectId, item) =>
    set(s => ({
      projects: s.projects.map(p => {
        if (p.id !== projectId) return p;
        if (p.items.some(i => i.id === item.id)) return p; // no duplicar
        return { ...p, items: [item, ...p.items] };
      }),
    })),

  removeFromProject: (projectId, itemId) =>
    set(s => ({
      projects: s.projects.map(p =>
        p.id === projectId
          ? { ...p, items: p.items.filter(i => i.id !== itemId) }
          : p
      ),
    })),

  isInProject: (projectId, itemId) => {
    const p = get().projects.find(p => p.id === projectId);
    return p ? p.items.some(i => i.id === itemId) : false;
  },
}));
