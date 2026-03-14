// ─────────────────────────────────────────────────────────────────────────────
// ProfileMoreMenu.tsx — Menú desplegable de opciones del perfil
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '../../../../store/themeStore';

const { width: screenWidth } = Dimensions.get('window');

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
  destructive?: boolean;
};

type ProfileMoreMenuProps = {
  visible: boolean;
  onClose: () => void;
  items: MenuItem[];
};

export const ProfileMoreMenu: React.FC<ProfileMoreMenuProps> = ({
  visible,
  onClose,
  items,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const { isDark, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleBackdropPress = () => {
    Haptics.selectionAsync();
    onClose();
  };

  const handleMenuItemPress = (item: MenuItem) => {
    Haptics.impactAsync();
    onClose();
    item.onPress();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      {/* Backdrop — tapa toda la pantalla para cerrar al tocar fuera */}
      <Pressable style={styles.backdrop} onPress={handleBackdropPress} />

      {/* Menu Container — fuera del Pressable para no disparar el backdrop */}
      <Animated.View
        style={[
          styles.menuContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={isDark
            ? ['#1e1b4b', '#312e81', '#1e1b4b']
            : ['#ffffff', '#f8fafc', '#ffffff']
          }
          style={styles.menuGradient}
        >
          {/* Header */}
          <View style={styles.menuHeader}>
            <Text style={[styles.menuTitle, { color: isDark ? '#fff' : '#1e1b4b' }]}>
              Opciones
            </Text>
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
              onPress={onClose}
            >
              <Ionicons name="close" size={18} color={isDark ? '#fff' : '#6b7280'} />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuItems}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  item.destructive && styles.menuItemDestructive,
                  { borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                ]}
                onPress={() => handleMenuItemPress(item)}
              >
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: item.destructive
                    ? 'rgba(239,68,68,0.1)'
                    : isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)'
                  }
                ]}>
                  <Ionicons
                    name={item.icon as any}
                    size={18}
                    color={item.destructive ? '#ef4444' : '#7c3aed'}
                  />
                </View>
                <Text style={[
                  styles.menuItemText,
                  item.destructive && styles.menuItemTextDestructive,
                  { color: isDark ? '#fff' : '#1e1b4b' }
                ]}>
                  {item.label}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  menuContainer: {
    width: screenWidth * 0.75,
    maxWidth: 320,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  menuGradient: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.2)',
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(124,58,237,0.1)',
  },
  menuTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItems: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  menuItemDestructive: {
    // Estilos adicionales para items destructivos si se necesitan
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    lineHeight: 20,
  },
  menuItemTextDestructive: {
    color: '#ef4444',
  },
});
