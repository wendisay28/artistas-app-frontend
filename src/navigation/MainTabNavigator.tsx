// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

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
}

const TAB_CONFIG: TabItem[] = [
  { name: 'Home', label: 'BuscArt', iconOutline: 'home-outline', iconFilled: 'home', component: HomeScreen },
  { name: 'Favorites', label: 'Favoritos', iconOutline: 'heart-outline', iconFilled: 'heart', component: FavoritesScreen },
  { name: 'Contract', label: 'Contratar', iconOutline: 'add-circle-outline', iconFilled: 'add-circle', component: ContractsScreen },
  { name: 'Explorer', label: 'Explorar', iconOutline: 'compass-outline', iconFilled: 'compass', component: ExploreScreen },
  { name: 'Profile', label: 'Perfil', iconOutline: 'person-outline', iconFilled: 'person', component: ProfileScreen },
];

const ACTIVE_COLOR = '#111827';
const INACTIVE_COLOR = '#9CA3AF';

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }]}>
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

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <Ionicons
              name={focused ? tabConfig.iconFilled : tabConfig.iconOutline}
              size={24}
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: focused ? ACTIVE_COLOR : INACTIVE_COLOR },
                focused && styles.tabLabelActive,
              ]}
            >
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
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  tabLabelActive: {
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
