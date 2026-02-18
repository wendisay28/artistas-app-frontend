import { useState, useCallback, useRef } from 'react';
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

const DRAWER_WIDTH = Dimensions.get('window').width * 0.65;

interface TopBarProps {
  title: string;
  topInset: number;
  rightActions?: React.ReactNode;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
}

interface MenuOption {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
  destructive?: boolean;
}

export default function TopBar({
  title,
  topInset,
  rightActions,
  onNotificationPress,
  onSettingsPress,
}: TopBarProps) {
  const user = auth.currentUser;
  const logout = useAuthStore((s) => s.logout);
  const [drawerVisible, setDrawerVisible] = useState(false);
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
      label: 'Mi perfil',
      onPress: () => closeDrawer(),
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

  return (
    <>
      <View style={[styles.container, { paddingTop: topInset + 8 }]}>
        {/* Title */}
        <Text style={[styles.title, { marginLeft: 0 }]} numberOfLines={1}>
          {title}
        </Text>

        {/* Right actions */}
        <View style={styles.rightActions}>
          {rightActions ?? (
            <>
              <Pressable
                onPress={onNotificationPress}
                style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
              >
                <Ionicons name="notifications-outline" size={22} color={colors.text} />
              </Pressable>
            </>
          )}

          {/* Avatar — abre drawer */}
          <Pressable onPress={openDrawer}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={16} color={colors.textSecondary} />
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Side Drawer */}
      <Modal
        visible={drawerVisible}
        transparent
        animationType="none"
        onRequestClose={closeDrawer}
        statusBarTranslucent
      >
        {/* Overlay */}
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
        </Animated.View>

        {/* Drawer panel */}
        <Animated.View
          style={[
            styles.drawer,
            { width: DRAWER_WIDTH, transform: [{ translateX: slideAnim }] },
          ]}
        >
          {/* Header minimalista */}
          <View style={[styles.drawerHeader, { paddingTop: topInset + 20 }]}>
            {user?.photoURL ? (
              <View style={styles.avatarContainer}>
                <Image source={{ uri: user.photoURL }} style={styles.drawerAvatar} />
              </View>
            ) : (
              <View style={styles.avatarContainer}>
                <View style={[styles.drawerAvatar, styles.drawerAvatarPlaceholder]}>
                  <Ionicons name="person" size={28} color={colors.textSecondary} />
                </View>
              </View>
            )}
            <Text style={styles.drawerUserName} numberOfLines={1}>
              {user?.displayName ?? 'Usuario'}
            </Text>
            <Text style={styles.drawerUserEmail} numberOfLines={1}>
              {user?.email ?? ''}
            </Text>
          </View>

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
                      : { backgroundColor: colors.primary + '10' },
                  ]}>
                    <Ionicons
                      name={option.icon as any}
                      size={20}
                      color={option.color ?? colors.primary}
                    />
                  </View>
                  <Text style={[
                    styles.drawerItemText,
                    option.color ? { color: option.color } : undefined,
                  ]}>
                    {option.label}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={option.color ?? colors.textLight} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.drawerFooter}>
            <Text style={styles.drawerFooterText}>Artistas App v1.0</Text>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    zIndex: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    marginLeft: 12,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  // Drawer
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
  },

  // Drawer header minimalista
  drawerHeader: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatarContainer: {
    marginBottom: 8,
  },
  drawerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  drawerAvatarPlaceholder: {
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  drawerUserName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
    textAlign: 'center',
  },
  drawerUserEmail: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Divider
  drawerDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
    marginVertical: 8,
  },

  // Content
  drawerContent: {
    paddingVertical: 4,
  },

  // Item minimalista
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  drawerItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  drawerItemText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.text,
  },

  // Footer minimalista
  drawerFooter: {
    paddingHorizontal: 24,
    paddingVertical: 16,
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
