// components/hiring/header/HiringHeader.tsx

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { Colors } from '../../../../theme/colors';

type TabType = 'all' | 'mine' | 'saved';

interface Tab {
  key: TabType;
  label: string;
  badgeCount?: number;
}

interface HiringHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadCount?: number;
  myOffersCount?: number;
}

export default function HiringHeader({
  activeTab,
  onTabChange,
  unreadCount = 0,
  myOffersCount = 0,
}: HiringHeaderProps) {
  const tabs: Tab[] = [
    { key: 'all', label: 'Explorar', badgeCount: unreadCount },
    { key: 'mine', label: 'Mis ofertas', badgeCount: myOffersCount },
    { key: 'saved', label: 'Guardadas' },
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
    <View style={styles.container}>
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
    backgroundColor: Colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
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
    color: Colors.textSecondary,
  },
  tabTextActive: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.primary,
  },

  // Badge mejorado — sin posicionamiento absoluto frágil
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeActive: {
    backgroundColor: Colors.primary,
  },
  badgeInactive: {
    backgroundColor: Colors.surfaceAlt ?? '#F4F6FA',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  badgeTextActive: {
    color: '#FFFFFF',
  },
  badgeTextInactive: {
    color: Colors.textSecondary,
  },

  // Indicador deslizante animado — reemplaza el borderBottom estático
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    // El ancho real se calcula por tab, aquí ponemos un valor base que se ve bien
    // Si quieres un indicador de ancho exacto al texto necesitarías medir el texto
    width: '33.33%',
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});