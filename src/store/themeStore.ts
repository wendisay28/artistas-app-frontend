// ─────────────────────────────────────────────────────────────────────────────
// themeStore.ts — Store para gestión del tema oscuro/claro
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, darkColors } from '../constants/colors';

type ThemeStore = {
  isDark: boolean;
  colors: typeof colors;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDark: false,
      colors,
      toggleTheme: () => {
        const newIsDark = !get().isDark;
        set({ 
          isDark: newIsDark,
          colors: newIsDark ? darkColors : colors 
        });
      },
      setTheme: (isDark) => set({ 
        isDark,
        colors: isDark ? darkColors : colors 
      }),
    }),
    {
      name: 'buscartpro-theme',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.colors = state.isDark ? darkColors : colors;
        }
      },
    },
  ),
);
