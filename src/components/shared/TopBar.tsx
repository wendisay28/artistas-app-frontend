// ─────────────────────────────────────────────────────────────────────────────
// TopBar.tsx — Barra superior global · Estilo Instagram · BuscArt
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { auth } from '../../services/firebase/config';
import { signOutUser } from '../../services/firebase/auth';
import { useAuthStore } from '../../store/authStore';
import { PortalAutorScreen } from '../../screens/artist/PortalAutorScreen';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.65;

// ── Props ──────────────────────────────────────────────────────────────────────

interface TopBarProps {
  title?: string;
  topInset: number;
  rightActions?: React.ReactNode;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
  usernameMode?: boolean;
  showLocation?: boolean;
  city?: string;
  onLocationPress?: () => void;
  locationLoading?: boolean;
  notificationCount?: number;    // Badge en el bell
  onCreatePress?: () => void;    // Botón "+" (crear publicación)
}

interface MenuOption {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
  destructive?: boolean;
}

// ── Componente ─────────────────────────────────────────────────────────────────

export default function TopBar({
  title,
  topInset,
  rightActions,
  onNotificationPress,
  onSettingsPress,
  usernameMode = false,
  showLocation = false,
  city,
  onLocationPress,
  locationLoading = false,
  notificationCount = 0,
  onCreatePress,
}: TopBarProps) {
  const user = auth.currentUser;
  const logout = useAuthStore((s) => s.logout);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [portalVisible, setPortalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const openDrawer = useCallback(() => {
    setDrawerVisible(true);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, overlayAnim]);

  const closeDrawer = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: DRAWER_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => setDrawerVisible(false));
  }, [slideAnim, overlayAnim]);

  const handleLogout = useCallback(() => {
    closeDrawer();
    setTimeout(() => {
      Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres salir?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            await signOutUser();
            logout();
          },
        },
      ]);
    }, 300);
  }, [logout, closeDrawer]);

  const menuOptions: MenuOption[] = [
    {
      icon: 'person-outline',
      label: user?.displayName || user?.email || 'Mi perfil',
      onPress: () => closeDrawer(),
    },
    {
      icon: 'star-outline',
      label: 'Portal del Autor',
      onPress: () => {
        closeDrawer();
        setTimeout(() => setPortalVisible(true), 280);
      },
    },
    {
      icon: 'settings-outline',
      label: 'Configuración',
      onPress: () => {
        closeDrawer();
        onSettingsPress?.();
      },
    },
    {
      icon: 'notifications-outline',
      label: 'Notificaciones',
      onPress: () => {
        closeDrawer();
        onNotificationPress?.();
      },
    },
    {
      icon: 'help-circle-outline',
      label: 'Ayuda y soporte',
      onPress: () => closeDrawer(),
    },
    {
      icon: 'information-circle-outline',
      label: 'Acerca de',
      onPress: () => closeDrawer(),
    },
    {
      icon: 'log-out-outline',
      label: 'Cerrar sesión',
      onPress: handleLogout,
      color: '#ef4444',
      destructive: true,
    },
  ];

  // ── Sección derecha según modo ─────────────────────────────────────────────

  const renderRightActions = () => {
    if (rightActions) return rightActions;

    // Modo perfil (usernameMode): iconos tipo Instagram perfil
    if (usernameMode) {
      return (
        <>
          {/* Añadir contenido */}
          <Pressable
            onPress={onCreatePress}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.5 }]}
            hitSlop={8}
          >
            <Ionicons name="add-outline" size={26} color={colors.text} />
          </Pressable>
          {/* Menú / drawer — hamburger */}
          <Pressable
            onPress={openDrawer}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.5 }]}
            hitSlop={8}
          >
            <Ionicons name="reorder-three-outline" size={26} color={colors.text} />
          </Pressable>
        </>
      );
    }

    // Modo home / default: bell con badge + avatar para drawer
    return (
      <>
        {/* Bell con badge de notificaciones */}
        <Pressable
          onPress={onNotificationPress}
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.5 }]}
          hitSlop={8}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </Pressable>
      </>
    );
  };

  // ── En modo perfil el drawer lo abre el hamburger, no el avatar ───────────
  const renderAvatarOrHamburger = () => {
    if (usernameMode) return null; // el hamburger ya está en renderRightActions

    return (
      <Pressable
        onPress={openDrawer}
        style={({ pressed }) => [styles.avatarBtn, pressed && { opacity: 0.75 }]}
      >
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={15} color={colors.textSecondary} />
          </View>
        )}
      </Pressable>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <View style={[styles.container, { paddingTop: topInset + 8 }]}>

        {/* ── LEFT: Logo o Título ── */}
        <View style={styles.leftSection}>
          {!title ? (
            <View style={styles.logoRow}>
              <Text style={styles.logoBusca}>Busc</Text>
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoArtBg}
              >
                <Text style={styles.logoArt}>Art</Text>
              </LinearGradient>
            </View>
          ) : usernameMode ? (
            <View style={styles.usernameRow}>
              <Text style={styles.usernameTitle} numberOfLines={1}>{title}</Text>
              <Ionicons name="chevron-down" size={15} color={colors.text} style={{ marginLeft: 3, marginTop: 2 }} />
            </View>
          ) : (
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
          )}
        </View>

        {/* ── CENTER: Location (solo en home) ── */}
        {showLocation && city ? (
          <Pressable
            onPress={onLocationPress}
            style={({ pressed }) => [styles.locationCenter, pressed && { opacity: 0.65 }]}
          >
            <Text style={styles.locationLabel}>Ubicación</Text>
            <View style={styles.locationCityRow}>
              {locationLoading ? (
                <Ionicons name="location" size={11} color="#7c3aed" />
              ) : (
                <Ionicons name="location" size={11} color="#7c3aed" />
              )}
              <Text style={styles.locationCity} numberOfLines={1}>
                {city.split(',')[0]}
              </Text>
              <Ionicons name="chevron-down" size={11} color="#7c3aed" />
            </View>
          </Pressable>
        ) : <View style={{ flex: 1 }} />}

        {/* ── RIGHT: Acciones ── */}
        <View style={styles.rightSection}>
          {renderRightActions()}
          {renderAvatarOrHamburger()}
        </View>
      </View>

      {/* Portal del Autor */}
      <Modal
        visible={portalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPortalVisible(false)}
      >
        <PortalAutorScreen onClose={() => setPortalVisible(false)} />
      </Modal>

      {/* Side Drawer */}
      <Modal
        visible={drawerVisible}
        transparent
        animationType="none"
        onRequestClose={closeDrawer}
        statusBarTranslucent
      >
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
        </Animated.View>

        <Animated.View
          style={[styles.drawer, { width: DRAWER_WIDTH, transform: [{ translateX: slideAnim }] }]}
        >
          {/* Drawer header con gradiente */}
          <LinearGradient
            colors={['#f5f3ff', '#eff6ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.drawerHeader, { paddingTop: topInset + 24 }]}
          >
            {/* Avatar con anillo gradiente */}
            <View style={styles.drawerAvatarRingOuter}>
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.drawerAvatarRing}
              >
                <View style={styles.drawerAvatarInner}>
                  {user?.photoURL ? (
                    <Image source={{ uri: user.photoURL }} style={styles.drawerAvatar} />
                  ) : (
                    <View style={[styles.drawerAvatar, styles.drawerAvatarPlaceholder]}>
                      <Ionicons name="person" size={24} color={colors.textSecondary} />
                    </View>
                  )}
                </View>
              </LinearGradient>
            </View>

            <Text style={styles.drawerUserName} numberOfLines={1}>
              {user?.displayName ?? 'Usuario'}
            </Text>
            <Text style={styles.drawerUserEmail} numberOfLines={1}>
              {user?.email ?? ''}
            </Text>

            {/* Pill de estado */}
            <View style={styles.drawerStatusPill}>
              <View style={styles.drawerStatusDot} />
              <Text style={styles.drawerStatusText}>Activo</Text>
            </View>
          </LinearGradient>

          <View style={styles.drawerDivider} />

          {/* Opciones */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.drawerContent}
          >
            {menuOptions.map((option) => (
              <View key={option.label}>
                {option.destructive && <View style={styles.drawerDivider} />}
                <TouchableOpacity
                  style={styles.drawerItem}
                  onPress={option.onPress}
                  activeOpacity={0.6}
                >
                  <View style={[
                    styles.drawerItemIcon,
                    option.color
                      ? { backgroundColor: option.color + '12' }
                      : { backgroundColor: '#7c3aed10' },
                  ]}>
                    <Ionicons
                      name={option.icon as any}
                      size={18}
                      color={option.color ?? '#7c3aed'}
                    />
                  </View>
                  <Text style={[
                    styles.drawerItemText,
                    option.color ? { color: option.color } : undefined,
                  ]}>
                    {option.label}
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color={option.color ?? colors.textLight} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.drawerFooter}>
            <Text style={styles.drawerFooterText}>BuscArt v1.0</Text>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    zIndex: 10,
  },

  // ── Sections ──
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
  },

  // ── Logo ──
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBusca: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#111827',
    letterSpacing: -0.5,
  },
  logoArtBg: {
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 1,
  },
  logoArt: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#fff',
    letterSpacing: -0.5,
  },

  // ── Title / Username ──
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameTitle: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.text,
    letterSpacing: -0.6,
  },

  // ── Location center ──
  locationCenter: {
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  locationCityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationCity: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
    maxWidth: 110,
  },

  // ── Icon buttons ──
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Notification badge ──
  badge: {
    position: 'absolute',
    top: 6,
    right: 5,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },

  // ── Avatar ──
  avatarBtn: {
    marginLeft: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  avatarPlaceholder: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Overlay ──
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  // ── Drawer ──
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 16,
  },

  // ── Drawer header con gradiente ──
  drawerHeader: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 6,
  },
  drawerAvatarRingOuter: {
    marginBottom: 6,
  },
  drawerAvatarRing: {
    width: 68,
    height: 68,
    borderRadius: 20,
    padding: 2.5,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  drawerAvatarInner: {
    flex: 1,
    borderRadius: 17,
    overflow: 'hidden',
    backgroundColor: '#ede8ff',
    borderWidth: 2,
    borderColor: '#fff',
  },
  drawerAvatar: {
    width: '100%',
    height: '100%',
  },
  drawerAvatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ede8ff',
  },
  drawerUserName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
    textAlign: 'center',
  },
  drawerUserEmail: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
  drawerStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(22,163,74,0.1)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 2,
  },
  drawerStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  drawerStatusText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#16a34a',
  },

  // ── Divider ──
  drawerDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
    marginVertical: 6,
  },

  // ── Drawer content ──
  drawerContent: {
    paddingVertical: 4,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  drawerItemIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerItemText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.text,
  },

  // ── Drawer footer ──
  drawerFooter: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  drawerFooterText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textLight,
  },
});
