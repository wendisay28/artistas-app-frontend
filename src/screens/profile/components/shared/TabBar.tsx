// ─────────────────────────────────────────────────────────────────────────────
// TabBar.tsx — Barra de pestañas (tema claro / minimalista)
// Variante "main" → tabs con ícono + label (estilo Instagram/LinkedIn)
// Variante "pill" → selector compacto redondeado (inner tabs)
// Stack: @expo/vector-icons · ../theme
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../theme/colors';
import { Radius } from '../../../../theme/radius';
import { Spacing } from '../../../../theme/spacing';
import { TabItem } from '../types';
import { useThemeStore } from '../../../../store/themeStore';

// ── Tipos ─────────────────────────────────────────────────────────────────────

type Props = {
  tabs:     TabItem[];
  active:   string;
  onSelect: (key: string) => void;
  variant?: 'main' | 'pill';
};

// ── Component ─────────────────────────────────────────────────────────────────

export const TabBar: React.FC<Props> = ({ tabs, active, onSelect, variant = 'main' }) => {
  const { isDark } = useThemeStore();

  // ── Pill / inner tab bar ──────────────────────────────────────────────────
  if (variant === 'pill') {
    return (
      <View style={[pill.container, isDark && { backgroundColor: '#1a1030', borderWidth: 1, borderColor: 'rgba(139,92,246,0.22)' }]}>
        {tabs.map(tab => {
          const isActive = tab.key === active;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[pill.tab, isActive && pill.tabActive, isActive && isDark && { backgroundColor: '#130d2a', shadowOpacity: 0.25 }]}
              onPress={() => onSelect(tab.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? (tab.iconActive ?? tab.icon) : tab.icon}
                size={15}
                color={isActive ? Colors.accent : (isDark ? 'rgba(255,255,255,0.4)' : Colors.text)}
              />
              <Text style={[pill.label, isDark && !isActive && { color: 'rgba(255,255,255,0.5)' }, isActive && pill.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  // ── Main tab bar (sticky, estilo Instagram) ───────────────────────────────
  return (
    <View style={[main.container, isDark && { backgroundColor: '#0a0618', borderTopWidth: 1, borderTopColor: 'rgba(139,92,246,0.15)' }]}>
      {tabs.map(tab => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            style={main.tab}
            onPress={() => onSelect(tab.key)}
            activeOpacity={0.75}
          >
            <Ionicons
              name={isActive ? (tab.iconActive ?? tab.icon) : tab.icon}
              size={20}
              color={isActive ? Colors.accent : (isDark ? 'rgba(255,255,255,0.35)' : Colors.textMuted)}
            />
            <Text style={[
              main.label,
              isDark && !isActive && { color: 'rgba(255,255,255,0.35)' },
              isActive && main.labelActive,
              isActive && isDark && { color: '#a78bfa' },
            ]}>
              {tab.label}
            </Text>
            {/* Indicador inferior */}
            {isActive && <View style={main.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ── Styles — Main ─────────────────────────────────────────────────────────────

const main = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.bg, // Revertido al color original
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 11,
    paddingBottom: 10,
    gap: 3,
    position: 'relative',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textMuted, // Mantenido gris claro para texto inactivo
    letterSpacing: 0.1,
  },
  labelActive: {
    color: Colors.accent,
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2.5,
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
  },
});

// ── Styles — Pill ─────────────────────────────────────────────────────────────

const pill = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface2,
    borderRadius: Radius.lg,
    padding: 3,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  tabActive: {
    backgroundColor: Colors.bg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  labelActive: {
    color: Colors.accent,
    fontWeight: '700',
  },
});
