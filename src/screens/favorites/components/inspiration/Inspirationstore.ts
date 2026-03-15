// ─────────────────────────────────────────────────────────────────────────────
// Inspirationstore.ts — Store CANÓNICO de posts inspiracionales
// Zustand + persistencia AsyncStorage
// Fuentes: home feed (bookmarks) y uploads propios del usuario
// NOTA: src/store/inspirationStore.ts re-exporta desde aquí.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type InspirationCategory =
  | 'todos'
  | 'arte'
  | 'foto'
  | 'musica'
  | 'bodas'
  | 'teatro';

export type InspirationSource =
  | 'home'   // guardado desde el feed del home
  | 'own';   // subido por el usuario desde su galería

export interface InspirationPost {
  id:           string;
  image:        string;        // URI de la imagen (obligatoria)
  title:        string;
  description?: string;
  author:       string;        // Nombre del artista o "Yo"
  artistId?:    string;        // null/undefined si es propio
  feedPostId?:  string;        // ID del FeedPost original (source === 'home')
  category:     InspirationCategory;
  tags:         string[];
  source:       InspirationSource;
  projectIds:   string[];      // IDs de proyectos donde está guardado
  createdAt:    number;
}

// ── Estado ────────────────────────────────────────────────────────────────────

interface InspirationState {
  posts:        InspirationPost[];
  activeFilter: InspirationCategory;

  addPost:        (post: Omit<InspirationPost, 'id' | 'createdAt' | 'projectIds'>) => string;
  removePost:     (id: string) => void;
  /** @deprecated alias de removePost — quitar el bookmark = eliminar el post */
  toggleBookmark: (id: string) => void;
  updatePost:     (id: string, updates: Partial<InspirationPost>) => void;
  setFilter:      (category: InspirationCategory) => void;

  getFilteredPosts:    () => InspirationPost[];
  getById:             (id: string) => InspirationPost | undefined;
  isBookmarkedFeedPost:(feedPostId: string) => boolean;

  // Agregar desde el home (bookmark de un post del feed)
  addFromHome: (params: {
    feedPostId?: string;
    image:       string;
    title:       string;
    author:      string;
    artistId?:   string;
    category:    InspirationCategory;
    tags?:       string[];
    description?: string;
  }) => string;

  // Agregar upload propio del usuario
  addOwnUpload: (params: {
    image:        string;
    title:        string;
    description?: string;
    category:     InspirationCategory;
    tags?:        string[];
  }) => string;

  // Relación bidireccional con Proyectos
  addToProjectId:      (postId: string, projectId: string) => void;
  removeFromProjectId: (postId: string, projectId: string) => void;
  removeByFeedPostId:  (feedPostId: string) => void;
}

// ── Helper ────────────────────────────────────────────────────────────────────

const generateId = () =>
  `insp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ── Store ─────────────────────────────────────────────────────────────────────

export const useInspirationStore = create<InspirationState>()(
  persist(
    (set, get) => ({
      posts:        [],
      activeFilter: 'todos',

      // ── Agregar post genérico ──────────────────────────────────
      addPost: (postData) => {
        const id = generateId();
        const post: InspirationPost = {
          ...postData,
          id,
          projectIds: [],
          createdAt:  Date.now(),
        };
        set(state => ({ posts: [post, ...state.posts] }));
        return id;
      },

      // ── Eliminar post ─────────────────────────────────────────
      removePost: (id) =>
        set(state => ({ posts: state.posts.filter(p => p.id !== id) })),

      // ── Alias backward-compat: bookmark toggle = eliminar ─────
      toggleBookmark: (id) => get().removePost(id),

      // ── Actualizar post ───────────────────────────────────────
      updatePost: (id, updates) =>
        set(state => ({
          posts: state.posts.map(p => p.id === id ? { ...p, ...updates } : p),
        })),

      // ── Filtro activo ─────────────────────────────────────────
      setFilter: (category) => set({ activeFilter: category }),

      // ── Posts filtrados ───────────────────────────────────────
      getFilteredPosts: () => {
        const { posts, activeFilter } = get();
        if (activeFilter === 'todos') return posts;
        return posts.filter(p => p.category === activeFilter);
      },

      // ── Buscar por ID ─────────────────────────────────────────
      getById: (id) => get().posts.find(p => p.id === id),

      // ── Verificar si un FeedPost ya está en Inspiración ───────
      isBookmarkedFeedPost: (feedPostId) =>
        get().posts.some(p => p.feedPostId === feedPostId),

      // ── Agregar desde Home ────────────────────────────────────
      addFromHome: ({ feedPostId, image, title, author, artistId, category, tags, description }) => {
        const { posts } = get();

        // Dedup por feedPostId (más fiable, evita duplicados exactos)
        if (feedPostId) {
          const existing = posts.find(p => p.feedPostId === feedPostId);
          if (existing) return existing.id;
        }

        // Dedup fallback por artistId + imagen (solo cuando artistId existe)
        if (artistId && image) {
          const existing = posts.find(p => p.artistId === artistId && p.image === image);
          if (existing) return existing.id;
        }

        return get().addPost({
          image,
          title,
          description,
          author,
          artistId,
          feedPostId,
          category,
          tags:   tags ?? [],
          source: 'home',
        });
      },

      // ── Agregar upload propio ─────────────────────────────────
      addOwnUpload: ({ image, title, description, category, tags }) =>
        get().addPost({
          image,
          title,
          description,
          author:    'Yo',
          artistId:  undefined,
          feedPostId: undefined,
          category,
          tags:      tags ?? [],
          source:    'own',
        }),

      // ── Relación bidireccional con Proyectos ──────────────────
      addToProjectId: (postId, projectId) =>
        set(state => ({
          posts: state.posts.map(p =>
            p.id === postId && !p.projectIds.includes(projectId)
              ? { ...p, projectIds: [...p.projectIds, projectId] }
              : p
          ),
        })),

      removeFromProjectId: (postId, projectId) =>
        set(state => ({
          posts: state.posts.map(p =>
            p.id === postId
              ? { ...p, projectIds: p.projectIds.filter(id => id !== projectId) }
              : p
          ),
        })),

      removeByFeedPostId: (feedPostId) =>
        set(state => ({
          posts: state.posts.filter(p => p.feedPostId !== feedPostId),
        })),
    }),

    {
      name:    'buscart-inspiration',
      storage: createJSONStorage(() => AsyncStorage),
      // Sólo persiste los posts; el filtro activo se resetea en cada sesión
      partialize: (state) => ({ posts: state.posts }),
    }
  )
);
