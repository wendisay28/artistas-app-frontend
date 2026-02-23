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

export type MainTabParams = {
  Home: undefined;
  Favorites: undefined;
  Contract: undefined;
  Explorer: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator();

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabItem {
  name: keyof MainTabParams;
  label: string;
  iconOutline: IoniconsName;
  iconFilled: IoniconsName;
  component: React.ComponentType<any>;
}

const TAB_CONFIG: TabItem[] = [
  { name: 'Home', label: 'Inicio', iconOutline: 'home-outline', iconFilled: 'home', component: HomeScreen },
  { name: 'Favorites', label: 'Favoritos', iconOutline: 'heart-outline', iconFilled: 'heart', component: FavoritesScreen },
  { name: 'Contract', label: 'Contratar', iconOutline: 'add-circle-outline', iconFilled: 'add-circle', component: ContractsScreen },
  { name: 'Explorer', label: 'Explorar', iconOutline: 'compass-outline', iconFilled: 'compass', component: ExploreScreen },
  { name: 'Profile', label: 'Perfil', iconOutline: 'person-outline', iconFilled: 'person', component: ProfileScreen },
];

const ACTIVE_COLOR = '#9333ea';
const INACTIVE_COLOR = '#9ca3af';

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }]}>
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
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
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
