// ─────────────────────────────────────────────────────────────────────────────
// DrawerPanel.tsx — Panel lateral · Rediseño refinado
// Header elegante · jerarquía clara · editar perfil · animación suave
// Stack: expo-linear-gradient · @expo/vector-icons · ../theme
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons }       from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../../theme';
import { auth }           from '../../services/firebase/config';
import { useAuthStore }   from '../../store/authStore';

// ── Constantes ────────────────────────────────────────────────────────────────

const { width: SCREEN_W } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_W * 0.72, 300);

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface MenuOption {
  key:          string;
  icon:         React.ComponentProps<typeof Ionicons>['name'];
  iconActive?:  React.ComponentProps<typeof Ionicons>['name'];
  label:        string;
  onPress:      () => void;
  badge?:       number;        // número de notificaciones
  color?:       string;
  destructive?: boolean;
  dividerAbove?: boolean;
}

interface DrawerPanelProps {
  visible:       boolean;
  onClose:       () => void;
  topInset:      number;
  onEditProfile?: () => void;
  customOptions?: MenuOption[];
}

// ── Grupos de opciones ────────────────────────────────────────────────────────

const buildMenuOptions = (
  onClose:       () => void,
  handleLogout:  () => void,
  onEditProfile?: () => void,
  customOptions: MenuOption[] = [],
): MenuOption[] => [
  // Opciones custom primero
  ...customOptions,

  // ── Cuenta ──────────────────────────────────────────────────────────────
  {
    key:     'perfil',
    icon:    'person-outline',
    iconActive: 'person',
    label:   'Mi perfil',
    onPress: onClose,
  },
  {
    key:     'editar-perfil',
    icon:    'create-outline',
    iconActive: 'create',
    label:   'Editar perfil',
    onPress: () => { onEditProfile?.(); onClose(); },
  },
  {
    key:     'notificaciones',
    icon:    'notifications-outline',
    iconActive: 'notifications',
    label:   'Notificaciones',
    onPress: onClose,
    badge:   3,
  },

  // ── App ─────────────────────────────────────────────────────────────────
  {
    key:          'configuracion',
    icon:         'settings-outline',
    iconActive:   'settings',
    label:        'Configuración',
    onPress:      onClose,
    dividerAbove: true,
  },
  {
    key:     'privacidad',
    icon:    'shield-checkmark-outline',
    iconActive: 'shield-checkmark',
    label:   'Privacidad',
    onPress: onClose,
  },
  {
    key:     'ayuda',
    icon:    'help-circle-outline',
    iconActive: 'help-circle',
    label:   'Ayuda y soporte',
    onPress: onClose,
  },
  {
    key:     'acerca',
    icon:    'information-circle-outline',
    iconActive: 'information-circle',
    label:   'Acerca de',
    onPress: onClose,
  },

  // ── Sesión ───────────────────────────────────────────────────────────────
  {
    key:          'logout',
    icon:         'log-out-outline',
    label:        'Cerrar sesión',
    onPress:      handleLogout,
    color:        '#EF4444',
    destructive:  true,
    dividerAbove: true,
  },
];

// ── Item de menú ──────────────────────────────────────────────────────────────

const MenuItem: React.FC<{ option: MenuOption }> = ({ option }) => {
  const iconColor = option.color ?? Colors.text2;

  return (
    <>
      {option.dividerAbove && <View style={item.divider} />}
      <TouchableOpacity
        style={item.row}
        onPress={option.onPress}
        activeOpacity={0.6}
      >
        {/* Ícono */}
        <View style={[item.iconWrap, option.color && { backgroundColor: option.color + '18' }]}>
          <Ionicons name={option.icon} size={17} color={iconColor} />
        </View>

        {/* Label */}
        <Text style={[item.label, option.color && { color: option.color }]} numberOfLines={1}>
          {option.label}
        </Text>

        {/* Badge de notificaciones */}
        {option.badge !== undefined && option.badge > 0 && (
          <View style={item.badge}>
            <Text style={item.badgeText}>{option.badge > 9 ? '9+' : option.badge}</Text>
          </View>
        )}

        {/* Chevron */}
        <Ionicons
          name="chevron-forward"
          size={14}
          color={option.color ? option.color + '80' : Colors.text3}
        />
      </TouchableOpacity>
    </>
  );
};

const item = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 13,
    marginHorizontal: Spacing.sm,
    borderRadius: Radius.md,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface2,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    letterSpacing: 0.1,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
    marginVertical: 6,
  },
});

// ── Component principal ───────────────────────────────────────────────────────

export default function DrawerPanel({
  visible,
  onClose,
  topInset,
  onEditProfile,
  customOptions = [],
}: DrawerPanelProps) {
  const user   = auth.currentUser;
  const logout = useAuthStore((s) => s.logout);

  const slideAnim   = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // ── Animación abrir ────────────────────────────────────────────────────────
  const openDrawer = useCallback(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue:     0,
        useNativeDriver: true,
        tension:     68,
        friction:    12,
      }),
      Animated.timing(overlayAnim, {
        toValue:  1,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, overlayAnim]);

  // ── Animación cerrar ───────────────────────────────────────────────────────
  const closeDrawer = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue:  DRAWER_WIDTH,
        duration: 210,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue:  0,
        duration: 210,
        useNativeDriver: true,
      }),
    ]).start(onClose);
  }, [slideAnim, overlayAnim, onClose]);

  const handleLogout = useCallback(() => {
    logout();
    closeDrawer();
  }, [logout, closeDrawer]);

  useEffect(() => {
    if (visible) openDrawer();
  }, [visible, openDrawer]);

  const menuOptions = buildMenuOptions(onClose, handleLogout, onEditProfile, customOptions);

  // Iniciales para avatar placeholder
  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeDrawer}
      statusBarTranslucent
    >
      {/* ── Overlay oscuro ── */}
      <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeDrawer} />
      </Animated.View>

      {/* ── Panel ── */}
      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >

        {/* ── Header ── */}
        <LinearGradient
          colors={['#1e1035', '#3b1f6e', '#5b3a8a']}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: topInset + 24 }]}
        >
          {/* Botón cerrar */}
          <TouchableOpacity style={styles.closeBtn} onPress={closeDrawer} activeOpacity={0.75}>
            <Ionicons name="close" size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          {/* Avatar */}
          <View style={styles.avatarWrap}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}
            {/* Dot online */}
            <View style={styles.onlineDot} />
          </View>

          {/* Nombre y email */}
          <Text style={styles.userName} numberOfLines={1}>
            {user?.displayName ?? 'Usuario'}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user?.email ?? ''}
          </Text>

          {/* Botón editar perfil rápido */}
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => { onEditProfile?.(); onClose(); }}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={12} color="rgba(255,255,255,0.9)" />
            <Text style={styles.editProfileText}>Editar perfil</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* ── Lista de opciones ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {menuOptions.map(option => (
            <MenuItem key={option.key} option={option} />
          ))}
        </ScrollView>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Artistas App · v1.0</Text>
        </View>
      </Animated.View>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  // ── Panel ────────────────────────────────────────────────────────────────
  drawer: {
    position:        'absolute',
    top:             0,
    bottom:          0,
    right:           0,
    width:           DRAWER_WIDTH,
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    overflow:        'hidden',
    ...Platform.select({
      ios: {
        shadowColor:   '#000',
        shadowOffset:  { width: -6, height: 0 },
        shadowOpacity: 0.16,
        shadowRadius:  20,
      },
      android: { elevation: 20 },
    }),
  },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom:     24,
    alignItems:        'center',
    gap:               6,
  },
  closeBtn: {
    position:   'absolute',
    top:        16,
    right:      Spacing.md,
    width:      28,
    height:     28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrap: {
    position:     'relative',
    marginBottom: 4,
    marginTop:    8,
  },
  avatar: {
    width:        64,
    height:       64,
    borderRadius: 32,
    borderWidth:  2.5,
    borderColor:  'rgba(255,255,255,0.25)',
  },
  avatarPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  avatarInitials: {
    fontSize:   22,
    fontWeight: '700',
    color:      '#fff',
    letterSpacing: -0.5,
  },
  onlineDot: {
    position:        'absolute',
    bottom:          2,
    right:           2,
    width:           12,
    height:          12,
    borderRadius:    6,
    backgroundColor: '#10B981',
    borderWidth:     2,
    borderColor:     '#2d1d47',
  },
  userName: {
    fontSize:      17,
    fontWeight:    '700',
    color:         '#fff',
    letterSpacing: -0.2,
    textAlign:     'center',
  },
  userEmail: {
    fontSize:   12,
    fontWeight: '400',
    color:      'rgba(255,255,255,0.60)',
    textAlign:  'center',
  },
  editProfileBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             5,
    marginTop:       8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius:    Radius.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth:     1,
    borderColor:     'rgba(255,255,255,0.18)',
  },
  editProfileText: {
    fontSize:   12,
    fontWeight: '600',
    color:      'rgba(255,255,255,0.90)',
  },

  // ── Lista ────────────────────────────────────────────────────────────────
  listContent: {
    paddingVertical: Spacing.sm,
  },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical:   16,
    borderTopWidth:    StyleSheet.hairlineWidth,
    borderTopColor:    Colors.border,
    alignItems:        'center',
  },
  footerText: {
    fontSize:   11,
    fontWeight: '500',
    color:      Colors.text3,
    letterSpacing: 0.3,
  },
});