// ─────────────────────────────────────────────────────────────────────────────
// listsStore.ts — Proyectos / Colecciones (FUENTE ÚNICA DE VERDAD)
// Persiste en AsyncStorage con clave 'buscart-lists'
// Cada proyecto tiene:
//   cards:        artistas, eventos, salas, galería (ExploreCard)
//   inspirations: IDs de InspirationPost guardados en este proyecto
//   customPrices: precios manuales por ítem
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ExploreCard } from '../types/explore';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface Project {
  id:           string;
  name:         string;
  icon:         string;
  emoji?:       string;
  createdAt:    number;
  cards:        ExploreCard[];
  inspirations: string[];         // IDs de InspirationPost
  customPrices: Record<string, number>; // itemId → precio manual
}

interface ListsState {
  projects: Project[];

  // ── Proyectos ──────────────────────────────────────────────────────────────
  createProject:  (name: string, icon: string) => string;
  deleteProject:  (id: string) => void;
  renameProject:  (id: string, name: string, icon: string) => void;

  // ── Tarjetas ExploreCard ───────────────────────────────────────────────────
  addToProject:        (projectId: string, item: ExploreCard) => void;
  removeFromProject:   (projectId: string, itemId: string) => void;
  isInProject:         (projectId: string, itemId: string) => boolean;

  // ── Posts de Inspiración (por ID) ─────────────────────────────────────────
  addInspirationToProject:      (projectId: string, inspirationId: string) => void;
  removeInspirationFromProject: (projectId: string, inspirationId: string) => void;
  isInspirationInProject:       (projectId: string, inspirationId: string) => boolean;

  // ── Precios manuales ──────────────────────────────────────────────────────
  setCustomPrice:     (projectId: string, itemId: string, price: number) => void;
  getCustomPrice:     (projectId: string, itemId: string) => number | undefined;
  getItemPrice:       (projectId: string, itemId: string) => number;
  getProjectTotal:    (projectId: string) => number;
  getItemsWithPrice:  (projectId: string) => number;
}

// ── Helper ────────────────────────────────────────────────────────────────────

const generateId = () =>
  `proj_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ── Store ─────────────────────────────────────────────────────────────────────

export const useListsStore = create<ListsState>()(
  persist(
    (set, get) => ({
      projects: [],

      // ── Crear ─────────────────────────────────────────────────
      createProject: (name, icon) => {
        const id = generateId();
        set(s => ({
          projects: [
            { id, name, icon, createdAt: Date.now(), cards: [], inspirations: [], customPrices: {} },
            ...s.projects,
          ],
        }));
        return id;
      },

      // ── Eliminar ──────────────────────────────────────────────
      deleteProject: (id) =>
        set(s => ({ projects: s.projects.filter(p => p.id !== id) })),

      // ── Renombrar ─────────────────────────────────────────────
      renameProject: (id, name, icon) =>
        set(s => ({
          projects: s.projects.map(p => p.id === id ? { ...p, name, icon } : p),
        })),

      // ── Agregar tarjeta ───────────────────────────────────────
      addToProject: (projectId, item) =>
        set(s => ({
          projects: s.projects.map(p => {
            if (p.id !== projectId) return p;
            if (p.cards.some(c => c.id === item.id)) return p;
            return { ...p, cards: [...p.cards, item] };
          }),
        })),

      // ── Quitar tarjeta ────────────────────────────────────────
      removeFromProject: (projectId, itemId) =>
        set(s => ({
          projects: s.projects.map(p =>
            p.id === projectId
              ? { ...p, cards: p.cards.filter(c => c.id !== itemId) }
              : p
          ),
        })),

      // ── Verificar tarjeta ─────────────────────────────────────
      isInProject: (projectId, itemId) => {
        const p = get().projects.find(p => p.id === projectId);
        return p ? p.cards.some(c => c.id === itemId) : false;
      },

      // ── Agregar inspiración ───────────────────────────────────
      addInspirationToProject: (projectId, inspirationId) =>
        set(s => ({
          projects: s.projects.map(p => {
            if (p.id !== projectId) return p;
            if (p.inspirations.includes(inspirationId)) return p;
            return { ...p, inspirations: [inspirationId, ...p.inspirations] };
          }),
        })),

      // ── Quitar inspiración ────────────────────────────────────
      removeInspirationFromProject: (projectId, inspirationId) =>
        set(s => ({
          projects: s.projects.map(p =>
            p.id === projectId
              ? { ...p, inspirations: p.inspirations.filter(id => id !== inspirationId) }
              : p
          ),
        })),

      // ── Verificar inspiración ─────────────────────────────────
      isInspirationInProject: (projectId, inspirationId) => {
        const p = get().projects.find(p => p.id === projectId);
        return p ? p.inspirations.includes(inspirationId) : false;
      },

      // ── Precio manual ─────────────────────────────────────────
      setCustomPrice: (projectId, itemId, price) =>
        set(s => ({
          projects: s.projects.map(p =>
            p.id !== projectId ? p
              : { ...p, customPrices: { ...p.customPrices, [itemId]: price } }
          ),
        })),

      getCustomPrice: (projectId, itemId) => {
        const p = get().projects.find(p => p.id === projectId);
        return p?.customPrices[itemId];
      },

      getItemPrice: (projectId, itemId) => {
        const p = get().projects.find(p => p.id === projectId);
        const item = p?.cards.find(c => c.id === itemId);
        if (!item) return 0;
        // 1. Precio manual del usuario (siempre gana)
        const custom = p?.customPrices[itemId];
        if (typeof custom === 'number' && custom > 0) return custom;
        // 2. Precio base del card
        if (typeof item.price === 'number' && item.price > 0) return item.price;
        // 3. Fallback para artistas: mínimo de servicesData
        if (item.type === 'artist') {
          const servicesData = (item as any).servicesData as any[] | undefined;
          if (servicesData?.length) {
            const prices = servicesData
              .map((s: any) => parseFloat(
                s.price ?? s.pricePerHour ?? s.price_per_hour ??
                s.pricePerSession ?? s.price_per_session ??
                s.basePrice ?? s.base_price ?? 0
              ))
              .filter((n: number) => !isNaN(n) && n > 0);
            if (prices.length > 0) return Math.min(...prices);
          }
        }
        return 0;
      },

      getProjectTotal: (projectId) => {
        const { getItemPrice } = get();
        const p = get().projects.find(p => p.id === projectId);
        if (!p) return 0;
        // Suma tarjetas (cards)
        const cardsTotal = p.cards.reduce((sum, item) => sum + getItemPrice(projectId, item.id), 0);
        // Suma inspiraciones (solo tienen precio si el usuario lo asignó manualmente)
        const inspTotal = (p.inspirations ?? []).reduce((sum, id) => {
          const custom = p.customPrices[id];
          return sum + (typeof custom === 'number' && custom > 0 ? custom : 0);
        }, 0);
        return cardsTotal + inspTotal;
      },

      getItemsWithPrice: (projectId) => {
        const { getItemPrice } = get();
        const p = get().projects.find(p => p.id === projectId);
        if (!p) return 0;
        const cardsWithPrice = p.cards.filter(item => getItemPrice(projectId, item.id) > 0).length;
        const inspWithPrice  = (p.inspirations ?? []).filter(id => {
          const custom = p.customPrices[id];
          return typeof custom === 'number' && custom > 0;
        }).length;
        return cardsWithPrice + inspWithPrice;
      },
    }),
    {
      name:    'buscart-lists',   // misma clave que Listsstore.ts para no perder datos
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
