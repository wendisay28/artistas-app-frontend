// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import FavoritesScreen from '../screens/favorites/index';
import ContractsScreen from '../screens/contracts/index';
import ExploreScreen from '../screens/explore/index';
import ProfileScreen from '../screens/profile/index';
import HomeScreen from '../screens/home/index';
import StripeSetupScreen from '../screens/payments/StripeSetupScreen';
import { WalletScreen } from '../screens/payments/WalletScreen';

export type MainTabParams = {
  Home: undefined;
  Favorites: undefined;
  Contract: undefined;
  Explorer: undefined;
  Profile: undefined;
  StripeSetup: undefined;
  Wallet: undefined;
};

const Tab = createBottomTabNavigator<MainTabParams>();

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabItem {
  name: keyof MainTabParams;
  label: string;
  iconOutline: IoniconsName;
  iconFilled: IoniconsName;
  component: React.ComponentType<any>;
}

// Solo las 5 tabs visibles
const TAB_CONFIG: TabItem[] = [
  { name: 'Home',      label: 'Inicio',   iconOutline: 'home-outline',        iconFilled: 'home',        component: HomeScreen },
  { name: 'Favorites', label: 'Favoritos',iconOutline: 'heart-outline',       iconFilled: 'heart',       component: FavoritesScreen },
  { name: 'Contract',  label: 'Contratar',iconOutline: 'add-circle-outline',  iconFilled: 'add-circle',  component: ContractsScreen },
  { name: 'Explorer',  label: 'Explorar', iconOutline: 'compass-outline',     iconFilled: 'compass',     component: ExploreScreen },
  { name: 'Profile',   label: 'Perfil',   iconOutline: 'person-outline',      iconFilled: 'person',      component: ProfileScreen },
];

const ACTIVE_COLOR   = '#9333ea';
const INACTIVE_COLOR = '#9ca3af';

// Nombres de tabs visibles para filtrar en la barra
const VISIBLE_TAB_NAMES = new Set(TAB_CONFIG.map(t => t.name));

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Solo renderizar las tabs visibles (ignorar StripeSetup, Wallet, etc.)
  const visibleRoutes = state.routes.filter(r => VISIBLE_TAB_NAMES.has(r.name as any));

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }]}>
      {visibleRoutes.map((route) => {
        const tabConfig = TAB_CONFIG.find(t => t.name === route.name)!;
        const focused = state.routes[state.index].name === route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            style={styles.tabItem}
          >
            {focused ? (
              <LinearGradient
                colors={['#9333ea', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activeIconWrap}
              >
                <Ionicons name={tabConfig.iconFilled} size={20} color="#fff" />
              </LinearGradient>
            ) : (
              <View style={styles.inactiveIconWrap}>
                <Ionicons name={tabConfig.iconOutline} size={22} color={INACTIVE_COLOR} />
              </View>
            )}
            <Text style={[
              styles.tabLabel,
              { color: focused ? ACTIVE_COLOR : INACTIVE_COLOR },
              focused && styles.tabLabelActive,
            ]}>
              {tabConfig.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const MainTabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    {/* Tabs visibles */}
    {TAB_CONFIG.map((tab) => (
      <Tab.Screen
        key={tab.name}
        name={tab.name}
        component={tab.component}
        options={{ tabBarLabel: tab.label }}
      />
    ))}

    {/* Pantallas de pagos — página completa con barra de navegación, sin tab visible */}
    <Tab.Screen
      name="StripeSetup"
      component={StripeSetupScreen}
      options={{ tabBarButton: () => null }}
    />
    <Tab.Screen
      name="Wallet"
      component={WalletScreen}
      options={{ tabBarButton: () => null }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#f3e8ff',
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  activeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveIconWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  tabLabelActive: {
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
