// components/favorites/FavoritesHeader.tsx

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { useThemeStore } from '../../../store/themeStore';

type TabType = 'saved' | 'projects' | 'inspiration';

interface Tab {
  key: TabType;
  label: string;
  badgeCount?: number;
}

interface FavoritesHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  savedCount?: number;
  projectsCount?: number;
  inspirationCount?: number;
}

export default function FavoritesHeader({
  activeTab,
  onTabChange,
  savedCount = 0,
  projectsCount = 0,
  inspirationCount = 0,
}: FavoritesHeaderProps) {
  const { isDark } = useThemeStore();
  
  const tabs: Tab[] = [
    { key: 'saved', label: 'Guardados', badgeCount: savedCount },
    { key: 'projects', label: 'Proyectos', badgeCount: projectsCount },
    { key: 'inspiration', label: 'Inspiración', badgeCount: inspirationCount },
  ];

  // Animación del indicador deslizante
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const tabWidths = useRef<number[]>([]);
  const tabOffsets = useRef<number[]>([]);

  const activeIndex = tabs.findIndex((t) => t.key === activeTab);

  const animateIndicator = (index: number) => {
    const offset = tabOffsets.current[index] ?? 0;
    Animated.spring(indicatorAnim, {
      toValue: offset,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  };

  useEffect(() => {
    animateIndicator(activeIndex);
  }, [activeIndex]);

  const handleTabLayout = (index: number, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    tabWidths.current[index] = width;
    tabOffsets.current[index] = x;
    // Si es el tab activo inicial, posicionamos sin animación
    if (index === activeIndex) {
      indicatorAnim.setValue(x);
    }
  };

  const handleTabPress = (tab: Tab) => {
    onTabChange(tab.key);
  };

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#0a0618', borderBottomColor: 'rgba(139,92,246,0.2)' }]}>
      <View style={styles.tabsWrapper}>
        {tabs.map((tab, index) => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => handleTabPress(tab)}
              activeOpacity={0.7}
              onLayout={(e) => handleTabLayout(index, e)}
            >
              <View style={styles.tabInner}>
                <Text
                  style={[
                    styles.tabText,
                    isDark && { color: '#71717A' },
                    isActive && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>

                {/* Badge de notificaciones */}
                {tab.badgeCount != null && tab.badgeCount > 0 && (
                  <View
                    style={[
                      styles.badge,
                      isActive ? styles.badgeActive : styles.badgeInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        isActive ? styles.badgeTextActive : styles.badgeTextInactive,
                      ]}
                    >
                      {tab.badgeCount > 99 ? '99+' : tab.badgeCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Indicador animado */}
        <Animated.View
          style={[
            styles.indicator,
            { transform: [{ translateX: indicatorAnim }] },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 16,
  },
  tabsWrapper: {
    flexDirection: 'row',
    position: 'relative',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#6b7280',
  },
  tabTextActive: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#7c3aed',
  },

  // Badge mejorado — sin posicionamiento absoluto frágil
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeActive: {
    backgroundColor: '#ddd6fe',
  },
  badgeInactive: {
    backgroundColor: '#e5e7eb',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    lineHeight: 12,
  },
  badgeTextActive: {
    color: '#7c3aed',
  },
  badgeTextInactive: {
    color: '#6b7280',
  },

  // Indicador deslizante
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    width: 0, // Se ajustará dinámicamente
    backgroundColor: '#7c3aed',
  },
});
