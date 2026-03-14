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
import type { TabType, ExploreSubTab, UrgentSubTab } from '../../../../types/hiring';
import { Colors } from '../../../../theme/colors';
import { useThemeStore } from '../../../../store/themeStore';
import AvailabilitySwitch from '../shared/AvailabilitySwitch';

interface Tab {
  key: TabType;
  label: string;
  badgeCount?: number;
}

interface HiringHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadCount?: number;
  urgentCount?: number;
  myOffersCount?: number;
  exploreSubTab?: ExploreSubTab;
  onExploreSubTabChange?: (subTab: ExploreSubTab) => void;
  urgentSubTab?: UrgentSubTab;
  onUrgentSubTabChange?: (subTab: UrgentSubTab) => void;
  isArtist?: boolean;
  isAvailable?: boolean;
  onAvailabilityToggle?: (value: boolean) => void;
  realTimeOffersCount?: number;
}

export default function HiringHeader({
  activeTab,
  onTabChange,
  unreadCount = 0,
  urgentCount = 0,
  myOffersCount = 0,
  exploreSubTab = 'general',
  onExploreSubTabChange,
  urgentSubTab = 'pending',
  onUrgentSubTabChange,
  isArtist = false,
  isAvailable = false,
  onAvailabilityToggle,
  realTimeOffersCount = 0,
}: HiringHeaderProps) {
  const { isDark } = useThemeStore();
  const tabs: Tab[] = [
    { key: 'urgent', label: 'Urgentes', badgeCount: urgentCount },
    { key: 'explore', label: 'Explorar', badgeCount: unreadCount },
    { key: 'mine', label: 'Mis ofertas', badgeCount: myOffersCount },
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

      {/* Sub-tabs para Explorar */}
      {activeTab === 'explore' && onExploreSubTabChange && (
        <View style={[styles.subTabsWrapper, isDark && { backgroundColor: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.2)' }]}>
          <TouchableOpacity
            style={[styles.subTab, exploreSubTab === 'general' && styles.subTabActive]}
            onPress={() => onExploreSubTabChange('general')}
          >
            <Text style={[styles.subTabText, isDark && { color: '#71717A' }, exploreSubTab === 'general' && styles.subTabTextActive]}>
              Generales
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.subTab, exploreSubTab === 'saved' && styles.subTabActive]}
            onPress={() => onExploreSubTabChange('saved')}
          >
            <Text style={[styles.subTabText, isDark && { color: '#71717A' }, exploreSubTab === 'saved' && styles.subTabTextActive]}>
              Guardadas
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sub-tabs para Urgentes */}
      {activeTab === 'urgent' && onUrgentSubTabChange && (
        <View>
          {/* Switch de disponibilidad — solo artistas y solo en tab urgentes */}
          {isArtist && onAvailabilityToggle && (
            <AvailabilitySwitch
              isAvailable={isAvailable}
              onToggle={onAvailabilityToggle}
              nearbyOffersCount={realTimeOffersCount}
            />
          )}
          
          <View style={[styles.subTabsWrapper, isDark && { backgroundColor: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.2)' }]}>
            <TouchableOpacity
              style={[styles.subTab, urgentSubTab === 'pending' && styles.subTabActive]}
              onPress={() => onUrgentSubTabChange('pending')}
            >
              <Text style={[styles.subTabText, isDark && { color: '#71717A' }, urgentSubTab === 'pending' && styles.subTabTextActive]}>
                Pendientes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.subTab, urgentSubTab === 'in_progress' && styles.subTabActive]}
              onPress={() => onUrgentSubTabChange('in_progress')}
            >
              <Text style={[styles.subTabText, isDark && { color: '#71717A' }, urgentSubTab === 'in_progress' && styles.subTabTextActive]}>
                En curso
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.subTab, urgentSubTab === 'completed' && styles.subTabActive]}
              onPress={() => onUrgentSubTabChange('completed')}
            >
              <Text style={[styles.subTabText, isDark && { color: '#71717A' }, urgentSubTab === 'completed' && styles.subTabTextActive]}>
                Finalizadas
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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

  // Sub-tabs para Explorar
  subTabsWrapper: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
  },
  subTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  subTabActive: {
    backgroundColor: Colors.primary + '15',
  },
  subTabText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },
  subTabTextActive: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.primary,
  },
});