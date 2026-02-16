// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../constants/colors';

import HomeScreen from '../screens/home/index';
import FavoritesScreen from '../screens/favorites/index';
import ContractsScreen from '../screens/contracts/index';
import ExploreScreen from '../screens/explore/index';
import ProfileScreen from '../screens/profile/index';

export type MainTabParams = {
  Home: undefined;
  Favorites: undefined;
  Contract: undefined;
  Explorer: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParams>();

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabItem {
  name: keyof MainTabParams;
  label: string;
  iconOutline: IoniconsName;
  iconFilled: IoniconsName;
  component: React.ComponentType<any>;
  isFab?: boolean;
}

const TAB_CONFIG: TabItem[] = [
  { name: 'Home', label: 'Inicio', iconOutline: 'home-outline', iconFilled: 'home', component: HomeScreen },
  { name: 'Favorites', label: 'Favoritos', iconOutline: 'heart-outline', iconFilled: 'heart', component: FavoritesScreen },
  { name: 'Contract', label: 'Contratar', iconOutline: 'add', iconFilled: 'add', component: ContractsScreen, isFab: true },
  { name: 'Explorer', label: 'Explorar', iconOutline: 'compass-outline', iconFilled: 'compass', component: ExploreScreen },
  { name: 'Profile', label: 'Perfil', iconOutline: 'person-outline', iconFilled: 'person', component: ProfileScreen },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const tabConfig = TAB_CONFIG[index];
          const focused = state.index === index;

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

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // FAB central
          if (tabConfig.isFab) {
            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                onLongPress={onLongPress}
                style={({ pressed }) => [styles.fabWrapper, pressed && { transform: [{ scale: 0.92 }] }]}
              >
                <LinearGradient
                  colors={[colors.primary, colors.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.fab}
                >
                  <Ionicons name="add" size={28} color="#fff" />
                </LinearGradient>
              </Pressable>
            );
          }

          // Normal tab — icon only
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              <View style={[styles.tabInner, focused && styles.tabInnerActive]}>
                <Ionicons
                  name={focused ? tabConfig.iconFilled : tabConfig.iconOutline}
                  size={22}
                  color={focused ? colors.primary : colors.textLight}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export const MainTabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    {TAB_CONFIG.map((tab) => (
      <Tab.Screen
        key={tab.name}
        name={tab.name}
        component={tab.component}
        options={{ tabBarLabel: tab.label }}
      />
    ))}
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 12,
    width: '100%',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  tabInnerActive: {
    backgroundColor: colors.primary + '15',
  },
  fabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -32,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
});
