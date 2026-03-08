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
  ArtistProfileResponse,
} from '../services/api/profile';
import { registerOrSyncUser } from '../services/api/users';
import type { Artist, ArtistTag, StudyDetail, WorkExperienceDetail, CertificationDetail } from '../screens/profile/components/types';

// ── Helpers de mapeo backend → frontend ──────────────────────────────────────

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

function mapBackendToArtist(user: BackendUser, artist: BackendArtist | null, firebaseUser?: { uid: string; photoURL?: string | null; displayName?: string | null }, artistResponse?: ArtistProfileResponse | null): Artist {
  const displayName = artist?.artistName ?? user.displayName
    ?? user.email?.split('@')[0]
    ?? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
    ?? firebaseUser?.displayName
    ?? 'Artista';


  const tags: ArtistTag[] = Array.isArray(artist?.tags)
    ? artist!.tags.map((t, i) => ({ label: t, genre: i === 0 }))
    : [];

  const info: Artist['info'] = [];

  // Info profesional desde el backend del artista
  if (artist?.yearsOfExperience) {
    info.push({ label: 'Experiencia', icon: 'briefcase-outline', value: `${artist.yearsOfExperience} años` });
  }
  const metadata = (artist as any)?.metadata as Record<string, string> | null | undefined;
  if (metadata?.style) info.push({ label: 'Estilo', icon: 'color-palette-outline', value: metadata.style });
  if (metadata?.artistAvailability) info.push({ label: 'Disponibilidad', icon: 'calendar-outline', value: metadata.artistAvailability });
  if (metadata?.responseTime) info.push({ label: 'Tiempo de resp.', icon: 'chatbubble-ellipses-outline', value: metadata.responseTime });

  // Redes sociales desde user.socialMedia (backend)
  const sm = (user as any).socialMedia as Record<string, string> | null | undefined;
  if (sm?.instagram) info.push({ label: 'Instagram', icon: 'logo-instagram', value: `https://instagram.com/${sm.instagram.replace('@', '')}` });
  if ((sm as any)?.tiktok) info.push({ label: 'TikTok', icon: 'logo-tiktok', value: `https://tiktok.com/@${(sm as any).tiktok.replace('@', '')}` });
  if ((sm as any)?.twitter) info.push({ label: 'Twitter', icon: 'logo-x', value: `https://twitter.com/${(sm as any).twitter.replace('@', '')}` });
  if (sm?.youtube) info.push({ label: 'YouTube', icon: 'logo-youtube', value: `https://youtube.com/@${sm.youtube}` });
  if (sm?.spotify) info.push({ label: 'Spotify', icon: 'musical-notes', value: `https://open.spotify.com/artist/${sm.spotify}` });

  return {
    id: user.id ?? firebaseUser?.uid ?? '1',
    name: displayName,
    handle: user.username ? `@${user.username}` : `@${displayName.toLowerCase().replace(/\s+/g, '_')}`,
    location: user.city ?? '',
    avatar: user.profileImageUrl ?? firebaseUser?.photoURL ?? '',
    coverImage: user.coverImageUrl,
    isVerified: user.isVerified ?? false,
    isOnline: true,
    // bio: texto CORTO del header (avatar + nombre). Fuente: users.bio. NO es "Acerca de mí".
    bio: user.bio ?? '',
    // description/acercaDeMi: texto LARGO de la sección "Acerca de mí". Fuente: artists.description. DISTINTO a bio.
    description: artist?.description ?? '',
    tags,
    // Estadísticas reales desde backend
    stats: [
      { value: formatNumber(user.worksCount ?? 0), label: 'Obras' },
      { value: Number(user.rating ?? 5.0).toFixed(1), label: 'Rating' },
      { value: formatNumber(user.followersCount ?? 0), label: 'Seguidores' },
      { value: formatNumber(user.viewsCount ?? 0), label: 'Visitas' },
    ],
    socialLinks: [],
    info,
    isOwner: true,
    role: artist?.stageName ?? '',
    // Construir category desde los objetos joinados del backend (que tienen el 'code' = slug)
    category: artistResponse?.category?.code ? {
      categoryId: artistResponse.category.code,
      disciplineId: artistResponse.discipline?.code ?? '',
      roleId: artistResponse.role?.code ?? '',
    } : undefined,
    // specialty y niche son texto libre guardados en artist.metadata
    specialty: (artist as any)?.metadata?.specialty ?? '',
    niche: (artist as any)?.metadata?.niche ?? '',
    studies: (artist?.education as StudyDetail[] | undefined) ?? [],
    workExperience: (artist?.workExperience as WorkExperienceDetail[] | undefined) ?? [],
    certifications: (artist?.certifications as CertificationDetail[] | undefined) ?? [],
    yearsOfExperience: artist?.yearsOfExperience ?? 0,
    artistId: artist?.id,
    userType: user.userType ?? 'artist',
    companyName: user.companyName,
    companyDescription: user.companyDescription,
    schedule: (user as any).schedule ?? '',
  };
}

// ── Estado del store ──────────────────────────────────────────────────────────

interface ProfileState {
  artistData: Artist | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  lastSynced: number | null; // timestamp
  hasServices: boolean;
  hasPortfolio: boolean;
  savedDeliveryMode: 'presencial' | 'digital' | 'hibrido' | null;
  hasLegal: boolean;
  hasPayment: boolean;
}

interface ProfileActions {
  /** Carga el perfil desde el backend (usuario + artista) */
  loadProfile: (firebaseUid?: string, firebasePhotoURL?: string | null, firebaseDisplayName?: string | null) => Promise<void>;
  /** Guarda los campos del header (nombre, handle, bio corta, ubicación, horario, tags) */
  saveHeader: (data: {
    name: string;
    handle: string;
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
  saveSocialLinks: (data: { instagram: string; tiktok: string; youtube: string; spotify: string; x?: string; twitter?: string }) => Promise<void>;
  /** Guarda la descripción/bio (texto libre del "Acerca de mí") */
  saveBio: (bio: string) => Promise<void>;
  /** Guarda la descripción larga del artista ("Acerca de mí") en el backend */
  saveDescription: (description: string) => Promise<void>;
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
  /** Marca flags de completitud del portal */
  setContentFlags: (flags: { hasServices?: boolean; hasPortfolio?: boolean; savedDeliveryMode?: 'presencial' | 'digital' | 'hibrido' | null; hasLegal?: boolean; hasPayment?: boolean }) => void;
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
      hasServices: false,
      hasPortfolio: false,
      savedDeliveryMode: null,
      hasLegal: false,
      hasPayment: false,

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
            { uid: firebaseUid ?? user.id, photoURL: firebasePhotoURL, displayName: firebaseDisplayName },
            artistResponse
          );

          // Preservar datos locales que el backend no guarda como slugs de string
          const existing = get().artistData;
          if (existing) {
            if (!mapped.location && existing.location) mapped.location = existing.location;
            if (!mapped.role && existing.role) mapped.role = existing.role;
            if (!(mapped as any).schedule && (existing as any).schedule) {
              (mapped as any).schedule = (existing as any).schedule;
            }
            // Si el backend no devolvió categoría/specialty/niche, preservar los del store local
            if (!mapped.category)  mapped.category  = existing.category;
            if (!mapped.specialty) mapped.specialty = existing.specialty;
            if (!mapped.niche)     mapped.niche     = existing.niche;
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
                },
                isLoading: false,
                error: null,
              });
              return;
            }

            // No hay datos locales: crear perfil vacío desde Firebase como base
            if (firebaseUser) {
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
            bio: data.bio.trim(),
            city: data.location,
            schedule: data.schedule,
          };

          const artistPayload: UpdateArtistPayload = {
            artistName: data.name.trim(),
            tags: data.tags.filter(Boolean),
          };

          await Promise.all([
            updateUserProfile(userPayload),
            updateArtistProfile(artistPayload),
          ]);

          set({ isSaving: false });
        } catch (e: any) {
          console.warn('[profileStore] saveHeader:', e?.message);
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
          // El optimistic update ya se aplicó — guardar localmente aunque el backend falle
          console.warn('[profileStore] saveSobreMi: backend no disponible, guardado solo localmente:', e?.message);
          set({ isSaving: false });
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
          await updateArtistProfile({
            // Guardar experience como texto en metadata en lugar de número
            style:              data.style || undefined,
            artistAvailability: data.availability || undefined,
            responseTime:       data.responseTime || undefined,
            // Guardar yearsExperience en metadata para preservar el texto original
            metadata: {
              ...(data.yearsExperience && { yearsExperience: data.yearsExperience }),
            },
          });
          set({ isSaving: false });
        } catch (e: any) {
          console.warn('[profileStore] saveProInfo: backend no disponible, guardado solo localmente:', e?.message);
          set({ isSaving: false });
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
          console.warn('[profileStore] saveStudies: backend no disponible, guardado solo localmente:', e?.message);
          set({ isSaving: false });
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
          console.warn('[profileStore] saveExperience: backend no disponible, guardado solo localmente:', e?.message);
          set({ isSaving: false });
        }
      },

      saveSocialLinks: async (data) => {
        set({ isSaving: true, error: null });

        const twitterHandle = (data as any)?.x || (data as any)?.twitter;
        const isX = !!(data as any)?.x; // Detectar si es X o Twitter
        
        // Optimistic update: actualizar info[] con los valores nuevos
        set((s) => {
          if (!s.artistData) return s;
          const baseInfo = s.artistData.info.filter(i =>
            !['Instagram', 'TikTok', 'Twitter', 'YouTube', 'Spotify'].includes(i.label)
          );
          return {
            artistData: {
              ...s.artistData,
              info: [
                ...baseInfo,
                ...(data.instagram ? [{ label: 'Instagram', icon: 'logo-instagram', value: `https://instagram.com/${data.instagram.replace('@', '')}` }] : []),
                // Si es X, mostrar como TikTok; si es tiktok, mostrar como TikTok
                ...(data.tiktok || isX ? [{ label: 'TikTok', icon: 'logo-tiktok', value: `https://tiktok.com/@${(data.tiktok || twitterHandle).replace('@', '')}` }] : []),
                ...(twitterHandle && !isX ? [{ label: 'Twitter', icon: 'logo-x', value: `https://twitter.com/${String(twitterHandle).replace('@', '')}` }] : []),
                ...(data.youtube ? [{ label: 'YouTube', icon: 'logo-youtube', value: `https://youtube.com/@${data.youtube}` }] : []),
                ...(data.spotify ? [{ label: 'Spotify', icon: 'musical-notes', value: `https://open.spotify.com/artist/${data.spotify}` }] : []),
              ],
            },
          };
        });

        try {
          // Guardar en backend
          await updateUserProfile({
            socialMedia: {
              instagram: data.instagram,
              // Si es X, guardar como tiktok; si no, guardar como tiktok normal
              tiktok: data.tiktok || twitterHandle,
              youtube: data.youtube,
              spotify: data.spotify,
              // Guardar como twitter solo si no es X
              ...(twitterHandle && !isX ? { twitter: twitterHandle } : {}),
            },
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
        // description = texto largo del "Sobre mí" → se guarda en saveDescription
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

      saveDescription: async (description) => {
        set({ isSaving: true, error: null });
        set((s) => ({
          artistData: s.artistData ? { ...s.artistData, description } : s.artistData,
        }));
        try {
          await updateArtistProfile({ description });
        } catch (e: any) {
          console.warn('[profileStore] saveDescription:', e?.message);
          set({ error: 'Error al guardar en el backend' });
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
        set((s) => {
          // Si no existe artistData, crear un objeto Artist válido con datos mínimos
          if (!s.artistData) {
            const baseArtist: Artist = {
              id: '',
              name: '',
              handle: '',
              location: '',
              avatar: '',
              isVerified: false,
              isOnline: false,
              bio: '',
              tags: [],
              stats: [],
              socialLinks: [],
              info: [],
              specialty: '',
              niche: '',
              category: undefined,
              availability: 'available',
            };
            return { artistData: { ...baseArtist, ...data } };
          }
          // Si ya existe, actualizar con los nuevos datos
          return { artistData: { ...s.artistData, ...data } };
        });
      },

      setContentFlags: (flags) => set((s) => ({
        hasServices:       flags.hasServices       ?? s.hasServices,
        hasPortfolio:      flags.hasPortfolio      ?? s.hasPortfolio,
        savedDeliveryMode: flags.savedDeliveryMode !== undefined ? flags.savedDeliveryMode : s.savedDeliveryMode,
        hasLegal:          flags.hasLegal          ?? s.hasLegal,
        hasPayment:        flags.hasPayment        ?? s.hasPayment,
      })),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'buscartpro-profile',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistir el artistData cacheado, no estados de loading/error
      partialize: (state) => ({
        artistData:        state.artistData,
        lastSynced:        state.lastSynced,
        hasServices:       state.hasServices,
        hasPortfolio:      state.hasPortfolio,
        savedDeliveryMode: state.savedDeliveryMode,
        hasLegal:          state.hasLegal,
        hasPayment:        state.hasPayment,
      }),
    }
  )
);
