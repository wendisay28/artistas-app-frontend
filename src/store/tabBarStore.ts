// src/store/tabBarStore.ts
import { create } from 'zustand';

interface TabBarStore {
  visible: boolean;
  show: () => void;
  hide: () => void;
}

export const useTabBarStore = create<TabBarStore>((set) => ({
  visible: true,
  show: () => set({ visible: true }),
  hide: () => set({ visible: false }),
}));
