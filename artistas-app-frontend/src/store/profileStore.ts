// src/store/profileStore.ts
// Store global para el perfil del artista — persiste en AsyncStorage y sincroniza con backend
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../services/firebase/config';
import {
  getMyUserProfile,
  getMyArtistProfile,
  updateUserProfile,
  updateArtistProfile,
  updateUserType,
  UpdateUserPayload,
  UpdateArtistPayload,
  BackendUser,
  BackendArtist,
} from '../services/api/profile';
import { registerOrSyncUser } from '../services/api/users';
import type { Artist, ArtistTag, StudyDetail, WorkExperienceDetail, CertificationDetail } from '../screens/profile/components/types';

// ── Helpers de mapeo backend → frontend ──────────────────────────────────────

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

function mapBackendToArtist(user: BackendUser, artist: BackendArtist | null, firebaseUser?: { uid: string; photoURL?: string | null; displayName?: string | null }): Artist {
  const displayName = artist?.artistName ?? user.displayName
    ?? user.email?.split('@')[0]
    ?? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
    ?? firebaseUser?.displayName
    ?? 'Artista';


  const tags: ArtistTag[] = Array.isArray(artist?.tags)
    ? artist!.tags.map((t, i) => ({ label: t, genre: i === 0 }))
    : [];

  const info: Artist['info'] = [];

  // Social links se guardan en info[], el SobreMiSection los consume por label
  // Los llenamos desde el store cuando el usuario los edita (no vienen del backend directamente)

  return {
    id: user.id ?? firebaseUser?.uid ?? '1',
    name: displayName,
    handle: user.username ? `@${user.username}` : `@${displayName.toLowerCase().replace(/\s+/g, '_')}`,
    location: user.city ?? '',
    avatar: user.profileImageUrl ?? firebaseUser?.photoURL ?? '',
    coverImage: user.coverImageUrl,
    isVerified: user.isVerified ?? false,
    isOnline: true,
    bio: user.bio ?? '',
    // Descripción larga del artista (Sobre mí completo)
    description: artist?.description ?? '',
    tags,
    // Estadísticas reales desde backend
    stats: [
      { value: formatNumber(user.worksCount ?? 0), label: 'Obras' },
      { value: (user.rating ?? 5.0).toFixed(1), label: 'Rating' },
      { value: formatNumber(user.followersCount ?? 0), label: 'Seguidores' },
      { value: formatNumber(user.viewsCount ?? 0), label: 'Visitas' },
    ],
    socialLinks: [],
    info,
    isOwner: true,
    role: artist?.stageName ?? '',
    specialty: '',
    niche: '',
    studies: (artist?.education as StudyDetail[] | undefined) ?? [],
    workExperience: (artist?.workExperience as WorkExperienceDetail[] | undefined) ?? [],
    certifications: (artist?.certifications as CertificationDetail[] | undefined) ?? [],
    yearsOfExperience: artist?.yearsOfExperience ?? 0,
    artistId: artist?.id,
    userType: user.userType ?? 'artist',
    companyName: user.companyName,
    companyDescription: user.companyDescription,
  };
}

// ── Estado del store ──────────────────────────────────────────────────────────

interface ProfileState {
  artistData: Artist | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  lastSynced: number | null; // timestamp
}

interface ProfileActions {
  /** Carga el perfil desde el backend (usuario + artista) */
  loadProfile: (firebaseUid?: string, firebasePhotoURL?: string | null, firebaseDisplayName?: string | null) => Promise<void>;
  /** Guarda los campos del header (nombre, handle, bio corta, ubicación, horario, tags) */
  saveHeader: (data: {
    name: string;
    handle: string;
    role: string;
    location: string;
    schedule: string;
    bio: string;
    tags: [string, string, string];
  }) => Promise<void>;
  /** Guarda el contenido de "Sobre mí" (descripción larga, info pro, estudios, experiencia) */
  saveSobreMi: (data: {
    description: string;
    yearsExperience: string;
    style: string;
    availability: string;
    responseTime: string;
    specialty: string;
    niche: string;
    studies: StudyDetail[];
    workExperience: WorkExperienceDetail[];
    certifications: CertificationDetail[];
  }) => Promise<void>;
  /** Guarda la información profesional */
  saveProInfo: (data: {
    yearsExperience: string;
    style: string;
    availability: string;
    responseTime: string;
  }) => Promise<void>;
  /** Guarda los estudios */
  saveStudies: (studies: StudyDetail[]) => Promise<void>;
  /** Guarda la experiencia laboral */
  saveExperience: (workExperience: WorkExperienceDetail[]) => Promise<void>;
  /** Guarda los links de redes sociales (ahora con backend) */
  saveSocialLinks: (data: { instagram: string; tiktok: string; youtube: string; spotify: string }) => Promise<void>;
  /** Guarda la descripción/bio (texto libre del "Acerca de mí") */
  saveBio: (bio: string) => Promise<void>;
  /** Actualiza el avatar en el backend */
  saveAvatar: (imageUrl: string) => Promise<void>;
  /** Actualiza la imagen de portada en el backend */
  saveCoverImage: (imageUrl: string) => Promise<void>;
  /** Convierte el perfil a empresa */
  convertToCompany: (companyData: {
    companyName: string;
    companyDescription: string;
    taxId?: string;
  }) => Promise<void>;
  /** Actualiza el estado local directamente (para optimistic updates) */
  setArtistData: (data: Partial<Artist>) => void;
  clearError: () => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useProfileStore = create<ProfileState & ProfileActions>()(
  persist(
    (set, get) => ({
      artistData: null,
      isLoading: false,
      isSaving: false,
      error: null,
      lastSynced: null,

      loadProfile: async (firebaseUid, firebasePhotoURL, firebaseDisplayName) => {
        set({ isLoading: true, error: null });
        try {
          const [user, artistResponse] = await Promise.all([
            getMyUserProfile(),
            getMyArtistProfile(),
          ]);

          const artist = artistResponse?.artist ?? null;

          const mapped = mapBackendToArtist(
            user,
            artist,
            { uid: firebaseUid ?? user.id, photoURL: firebasePhotoURL, displayName: firebaseDisplayName }
          );

          // Preservar datos locales que no vienen del backend o que el backend aún no tiene
          const existing = get().artistData;
          if (existing) {
            mapped.info        = existing.info        ?? [];
            mapped.socialLinks = existing.socialLinks ?? [];
            // Si el backend devuelve vacío pero tenemos datos locales, conservarlos
            if (!mapped.bio         && existing.bio)         mapped.bio         = existing.bio;
            if (!mapped.description && existing.description) mapped.description = existing.description;
            if (!mapped.location    && existing.location)    mapped.location    = existing.location;
            if (!mapped.role        && existing.role)        mapped.role        = existing.role;
            if (!(mapped as any).schedule && (existing as any).schedule) {
              (mapped as any).schedule = (existing as any).schedule;
            }
            if ((!mapped.tags || mapped.tags.length === 0) && existing.tags?.length) {
              mapped.tags = existing.tags;
            }
            // Preservar categoría artística (elegida en onboarding o editada en perfil)
            if (!mapped.category    && existing.category)    mapped.category    = existing.category;
            if (!mapped.specialty   && existing.specialty)   mapped.specialty   = existing.specialty;
            if (!mapped.niche       && existing.niche)       mapped.niche       = existing.niche;
          }

          set({ artistData: mapped, isLoading: false, lastSynced: Date.now() });
        } catch (e: any) {
          // 404 = perfil aún no creado en el backend → comportamiento esperado, no loguear como error
          if (e?.response?.status !== 404) {
            console.warn('[profileStore] loadProfile error:', e);
          }

          const existing = get().artistData;

          // Si el backend falla (401, 404, 500) — preservar datos locales ante todo
          if (e?.response?.status >= 400 || !e?.response) {
            const firebaseUser = auth.currentUser;

            if (existing) {
              // Ya hay datos guardados localmente: mantenerlos y solo refrescar
              // nombre/avatar desde Firebase si están vacíos
              set({
                artistData: {
                  ...existing,
                  name:   existing.name   || firebaseUser?.displayName || 'Artista',
                  avatar: existing.avatar || firebaseUser?.photoURL    || '',
                  // Preservar explícitamente los campos locales que no vienen del backend
                  category:  existing.category,
                  specialty: existing.specialty,
                  niche:     existing.niche,
                },
                isLoading: false,
                error: null,
              });
              return;
            }

            // No hay datos locales: crear perfil vacío desde Firebase como base
            if (firebaseUser) {
              console.log('[profileStore] Sin datos locales, creando perfil base desde Firebase');
              set({
                artistData: {
                  id: firebaseUser.uid,
                  name: firebaseUser.displayName || 'Artista',
                  handle: `@${(firebaseUser.displayName || 'artista').toLowerCase().replace(/\s+/g, '_')}`,
                  location: '',
                  avatar: firebaseUser.photoURL || '',
                  isVerified: false,
                  isOnline: true,
                  bio: '',
                  tags: [],
                  stats: [
                    { value: '0', label: 'Obras' },
                    { value: '5.0', label: 'Rating' },
                    { value: '0', label: 'Seguidores' },
                    { value: '0', label: 'Visitas' },
                  ],
                  socialLinks: [],
                  info: [],
                  isOwner: true,
                  role: '',
                  specialty: '',
                  niche: '',
                  studies: [],
                  workExperience: [],
                  certifications: [],
                  yearsOfExperience: 0,
                  artistId: undefined,
                  userType: 'artist',
                  companyName: undefined,
                  companyDescription: undefined,
                  availability: 'available',
                },
                isLoading: false,
                error: null,
              });
              return;
            }
          }

          set({ isLoading: false, error: e?.message || 'Error cargando perfil' });
        }
      },

      saveHeader: async (data) => {
        set({ isSaving: true, error: null });

        // Optimistic update
        const prev = get().artistData;
        const tags = data.tags.filter(Boolean).map((t, i) => ({ label: t, genre: i === 0 }));
        set((s) => ({
          artistData: s.artistData ? {
            ...s.artistData,
            name: data.name,
            handle: `@${data.handle}`,
            role: data.role,
            location: data.location,
            schedule: data.schedule,
            bio: data.bio,
            tags,
          } : s.artistData,
        }));

        try {
          // Nombres: separar en firstName/lastName
          const nameParts = data.name.trim().split(' ');
          const firstName = nameParts[0] ?? '';
          const lastName = nameParts.slice(1).join(' ') || undefined;

          const userPayload: UpdateUserPayload = {
            firstName,
            ...(lastName && { lastName }),
            username: data.handle.replace(/^@/, ''),
            bio: data.bio,
            city: data.location,
          };

          const artistPayload: UpdateArtistPayload = {
            stageName: data.role,
            tags: data.tags.filter(Boolean),
          };

          await Promise.all([
            updateUserProfile(userPayload),
            updateArtistProfile(artistPayload),
          ]);

          set({ isSaving: false });
        } catch (e: any) {
          console.error('[profileStore] saveHeader error:', e);
          
          // Si el backend falla, mantener los cambios localmente y mostrar advertencia
          // Mantener el optimistic update local aunque el backend falle
          console.warn('[profileStore] saveHeader: backend no disponible, guardado solo localmente:', e?.message);
          set({ isSaving: false });
        }
      },

      saveSobreMi: async (data) => {
        set({ isSaving: true, error: null });

        // Optimistic update: actualizar info[] con los valores nuevos
        set((s) => {
          if (!s.artistData) return s;
          const baseInfo = s.artistData.info.filter(i =>
            !['Experiencia', 'Estilo', 'Disponibilidad', 'Tiempo de resp.', 'Estudios Detallados', 'Experiencia Detallada', 'Certificaciones'].includes(i.label)
          );
          const newInfo = [
            ...baseInfo,
            { label: 'Experiencia', icon: 'briefcase-outline', value: data.yearsExperience },
            { label: 'Estilo', icon: 'color-palette-outline', value: data.style },
            { label: 'Disponibilidad', icon: 'calendar-outline', value: data.availability },
            { label: 'Tiempo de resp.', icon: 'chatbubble-ellipses-outline', value: data.responseTime },
          ];
          return {
            artistData: {
              ...s.artistData,
              description: data.description,
              // bio corta NO se toca aquí — se edita independientemente en saveBio
              specialty: data.specialty,
              niche: data.niche,
              studies: data.studies,
              workExperience: data.workExperience,
              certifications: data.certifications,
              info: newInfo,
            },
          };
        });

        try {
          const yearsNum = parseInt(data.yearsExperience) || undefined;
          await updateArtistProfile({
            description: data.description,
            yearsOfExperience: yearsNum,
            workExperience: data.workExperience,
            education: data.studies,
            certifications: data.certifications,
          });
          set({ isSaving: false });
        } catch (e: any) {
          console.error('[profileStore] saveSobreMi error:', e);
          set({ isSaving: false, error: e?.message ?? 'Error al guardar' });
          throw e;
        }
      },

      saveProInfo: async (data) => {
        set({ isSaving: true, error: null });

        set((s) => {
          if (!s.artistData) return s;
          const baseInfo = s.artistData.info.filter(i =>
            !['Experiencia', 'Estilo', 'Disponibilidad', 'Tiempo de resp.'].includes(i.label)
          );
          return {
            artistData: {
              ...s.artistData,
              info: [
                ...baseInfo,
                { label: 'Experiencia', icon: 'briefcase-outline', value: data.yearsExperience },
                { label: 'Estilo', icon: 'color-palette-outline', value: data.style },
                { label: 'Disponibilidad', icon: 'calendar-outline', value: data.availability },
                { label: 'Tiempo de resp.', icon: 'chatbubble-ellipses-outline', value: data.responseTime },
              ],
            },
          };
        });

        try {
          const yearsNum = parseInt(data.yearsExperience) || undefined;
          await updateArtistProfile({ yearsOfExperience: yearsNum });
          set({ isSaving: false });
        } catch (e: any) {
          console.error('[profileStore] saveProInfo error:', e);
          set({ isSaving: false, error: e?.message ?? 'Error al guardar' });
          throw e;
        }
      },

      saveStudies: async (studies) => {
        set({ isSaving: true, error: null });
        set((s) => ({
          artistData: s.artistData ? { ...s.artistData, studies } : s.artistData,
        }));
        try {
          await updateArtistProfile({ education: studies });
          set({ isSaving: false });
        } catch (e: any) {
          console.error('[profileStore] saveStudies error:', e);
          set({ isSaving: false, error: e?.message ?? 'Error al guardar' });
          throw e;
        }
      },

      saveExperience: async (workExperience) => {
        set({ isSaving: true, error: null });
        set((s) => ({
          artistData: s.artistData ? { ...s.artistData, workExperience } : s.artistData,
        }));
        try {
          await updateArtistProfile({ workExperience });
          set({ isSaving: false });
        } catch (e: any) {
          console.error('[profileStore] saveExperience error:', e);
          set({ isSaving: false, error: e?.message ?? 'Error al guardar' });
          throw e;
        }
      },

      saveSocialLinks: async (data) => {
        set({ isSaving: true, error: null });
        
        // Optimistic update: actualizar info[] con los valores nuevos
        set((s) => {
          if (!s.artistData) return s;
          const baseInfo = s.artistData.info.filter(i =>
            !['Instagram', 'TikTok', 'YouTube', 'Spotify'].includes(i.label)
          );
          return {
            artistData: {
              ...s.artistData,
              info: [
                ...baseInfo,
                ...(data.instagram ? [{ label: 'Instagram', icon: 'logo-instagram', value: `https://instagram.com/${data.instagram.replace('@', '')}` }] : []),
                ...(data.tiktok ? [{ label: 'TikTok', icon: 'logo-tiktok', value: `https://tiktok.com/@${data.tiktok.replace('@', '')}` }] : []),
                ...(data.youtube ? [{ label: 'YouTube', icon: 'logo-youtube', value: `https://youtube.com/@${data.youtube}` }] : []),
                ...(data.spotify ? [{ label: 'Spotify', icon: 'musical-notes', value: `https://open.spotify.com/artist/${data.spotify}` }] : []),
              ],
            },
          };
        });

        try {
          // Guardar en backend (solo las redes soportadas por ahora)
          await updateUserProfile({
            instagramUrl: data.instagram ? `https://instagram.com/${data.instagram.replace('@', '')}` : undefined,
            youtubeUrl: data.youtube ? `https://youtube.com/@${data.youtube}` : undefined,
            spotifyUrl: data.spotify ? `https://open.spotify.com/artist/${data.spotify}` : undefined,
            // Nota: TikTok se guardará localmente hasta que el backend lo soporte
          });
          set({ isSaving: false });
        } catch (e: any) {
          console.error('[profileStore] saveSocialLinks error:', e);
          set({ isSaving: false, error: e?.message ?? 'Error al guardar redes sociales' });
          throw e;
        }
      },

      saveBio: async (bio) => {
        // Bio corta — solo actualiza `bio`, NO `description` (son campos independientes)
        // description = texto largo del "Sobre mí" → se guarda en saveSobreMi
        set({ isSaving: true, error: null });
        set((s) => ({
          artistData: s.artistData ? { ...s.artistData, bio } : s.artistData,
        }));
        try {
          await updateUserProfile({ bio: bio.substring(0, 300) });
        } catch (e: any) {
          console.warn('[profileStore] saveBio: backend no disponible, guardado solo localmente:', e?.message);
        } finally {
          set({ isSaving: false });
        }
      },

      saveAvatar: async (imageUrl) => {
        set({ isSaving: true, error: null });
        set((s) => ({
          artistData: s.artistData ? { ...s.artistData, avatar: imageUrl } : s.artistData,
        }));
        try {
          await updateUserProfile({ profileImageUrl: imageUrl });
          set({ isSaving: false });
        } catch (e: any) {
          console.error('[profileStore] saveAvatar error:', e);
          set({ isSaving: false, error: e?.message ?? 'Error al guardar' });
          throw e;
        }
      },

      saveCoverImage: async (imageUrl) => {
        set({ isSaving: true, error: null });
        set((s) => ({
          artistData: s.artistData ? { ...s.artistData, coverImage: imageUrl } : s.artistData,
        }));
        try {
          await updateUserProfile({ coverImageUrl: imageUrl });
          set({ isSaving: false });
        } catch (e: any) {
          console.error('[profileStore] saveCoverImage error:', e);
          set({ isSaving: false, error: e?.message ?? 'Error al guardar' });
          throw e;
        }
      },

      convertToCompany: async (companyData) => {
        set({ isSaving: true, error: null });
        try {
          await Promise.all([
            updateUserType('company'),
            updateUserProfile({
              userType: 'company',
              companyName: companyData.companyName,
              companyDescription: companyData.companyDescription,
              ...(companyData.taxId && { taxId: companyData.taxId }),
            }),
          ]);
          set((s) => ({
            artistData: s.artistData ? {
              ...s.artistData,
              userType: 'company',
              companyName: companyData.companyName,
              companyDescription: companyData.companyDescription,
            } : s.artistData,
            isSaving: false,
          }));
        } catch (e: any) {
          console.error('[profileStore] convertToCompany error:', e);
          set({ isSaving: false, error: e?.message ?? 'Error al convertir a empresa' });
          throw e;
        }
      },

      setArtistData: (data) => {
        set((s) => ({
          artistData: s.artistData ? { ...s.artistData, ...data } : (data as Artist),
        }));
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'buscartpro-profile',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistir el artistData cacheado, no estados de loading/error
      partialize: (state) => ({
        artistData: state.artistData,
        lastSynced: state.lastSynced,
      }),
    }
  )
);
