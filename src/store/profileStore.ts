// src/store/profileStore.ts
// Store global para el perfil del artista — persiste en AsyncStorage y sincroniza con backend
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import type { Artist, ArtistTag, StudyDetail, WorkExperienceDetail, CertificationDetail } from '../components/profile/types';

// ── Helpers de mapeo backend → frontend ──────────────────────────────────────

function mapBackendToArtist(user: BackendUser, artist: BackendArtist | null, firebaseUser?: { uid: string; photoURL?: string | null; displayName?: string | null }): Artist {
  const displayName = user.displayName
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
    stats: [
      { value: '0', label: 'Obras' },
      { value: '5.0', label: 'Rating' },
      { value: '0', label: 'Seguidores' },
      { value: '0', label: 'Visitas' },
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
  /** Guarda los links de redes sociales (solo local por ahora, sin endpoint dedicado) */
  saveSocialLinks: (data: { instagram: string; x: string; youtube: string; spotify: string }) => void;
  /** Guarda la descripción/bio (texto libre del "Acerca de mí") */
  saveBio: (bio: string) => Promise<void>;
  /** Actualiza el avatar en el backend */
  saveAvatar: (imageUrl: string) => Promise<void>;
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

          // Preservar datos locales que no vienen del backend (socialLinks, info detallado)
          const existing = get().artistData;
          if (existing) {
            mapped.info = existing.info ?? [];
            mapped.socialLinks = existing.socialLinks ?? [];
          }

          set({ artistData: mapped, isLoading: false, lastSynced: Date.now() });
        } catch (e: any) {
          console.error('[profileStore] loadProfile error:', e);
          // Si falla la carga, mantener datos cacheados pero reportar error
          set({ isLoading: false, error: e?.message ?? 'Error al cargar el perfil' });
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
          // Rollback
          set({ artistData: prev, isSaving: false, error: e?.message ?? 'Error al guardar' });
          throw e;
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
              bio: data.description.length > 105 ? data.description.substring(0, 105) + '...' : data.description,
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

      saveSocialLinks: (data) => {
        // Los social links se guardan en info[] del artistData local
        // No hay endpoint dedicado en el backend por ahora
        set((s) => {
          if (!s.artistData) return s;
          const baseInfo = s.artistData.info.filter(i =>
            !['Instagram', 'Twitter', 'YouTube', 'Spotify'].includes(i.label)
          );
          return {
            artistData: {
              ...s.artistData,
              info: [
                ...baseInfo,
                ...(data.instagram ? [{ label: 'Instagram', icon: 'logo-instagram', value: `https://instagram.com/${data.instagram.replace('@', '')}` }] : []),
                ...(data.x ? [{ label: 'Twitter', icon: 'logo-x', value: `https://twitter.com/${data.x.replace('@', '')}` }] : []),
                ...(data.youtube ? [{ label: 'YouTube', icon: 'logo-youtube', value: `https://youtube.com/@${data.youtube}` }] : []),
                ...(data.spotify ? [{ label: 'Spotify', icon: 'musical-notes', value: `https://open.spotify.com/artist/${data.spotify}` }] : []),
              ],
            },
          };
        });
      },

      saveBio: async (bio) => {
        set({ isSaving: true, error: null });
        set((s) => ({
          artistData: s.artistData ? { ...s.artistData, bio, description: bio } : s.artistData,
        }));
        try {
          await Promise.all([
            updateUserProfile({ bio: bio.substring(0, 500) }),
            updateArtistProfile({ description: bio }),
          ]);
          set({ isSaving: false });
        } catch (e: any) {
          console.error('[profileStore] saveBio error:', e);
          set({ isSaving: false, error: e?.message ?? 'Error al guardar' });
          throw e;
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
