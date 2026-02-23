// Declaraciones de tipos para módulos sin tipos definidos

// Tipos comunes para eventos
declare type PressedEvent = {
  pressed: boolean;
};

declare module 'expo-haptics' {
  export const ImpactFeedbackStyle: {
    Light: any;
    Medium: any;
    Heavy: any;
  };
  export function impactAsync(style?: any): Promise<void>;
  export function notificationAsync(type?: any): Promise<void>;
  export function selectionAsync(): Promise<void>;
}

// Declaración global para Animated
declare global {
  const RNAnimated: {
    View: any;
    Text: any;
    Image: any;
    ScrollView: any;
    Value: any;
    spring: any;
    timing: any;
  };
}

declare module 'expo-linear-gradient' {
  import { View, ViewProps } from 'react-native';
  export interface LinearGradientProps extends ViewProps {
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    locations?: number[];
  }
  export const LinearGradient: React.FC<LinearGradientProps>;
}

declare module 'react-native-safe-area-context' {
  import { View, ViewProps } from 'react-native';
  export interface SafeAreaViewProps extends ViewProps {
    edges?: ('top' | 'bottom' | 'left' | 'right' | 'all')[];
  }
  const SafeAreaView: React.FC<SafeAreaViewProps>;
  export default SafeAreaView;
  export const useSafeAreaInsets: () => {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

declare module '@expo/vector-icons' {
  import React from 'react';
  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
  }
  export const Ionicons: React.FC<IconProps>;
  export const MaterialCommunityIcons: React.FC<IconProps>;
  export const Feather: React.FC<IconProps>;
  export default {
    Ionicons: React.FC<IconProps>,
    MaterialCommunityIcons: React.FC<IconProps>,
    Feather: React.FC<IconProps>
  };
}

// Módulos de la comunidad
declare module '@react-native-community/slider' {
  import React from 'react';
  export interface SliderProps {
    value?: number;
    minimumValue?: number;
    maximumValue?: number;
    step?: number;
    minimumTrackTintColor?: string;
    maximumTrackTintColor?: string;
    thumbTintColor?: string;
    onValueChange?: (value: number) => void;
    onSlidingComplete?: (value: number) => void;
  }
  export default class Slider extends React.Component<SliderProps> {}
}

declare module '@react-native-community/datetimepicker' {
  import React from 'react';
  export interface DateTimePickerEvent {
    type: 'set' | 'dismissed';
    nativeEvent: {
      timestamp?: number;
      utcOffset?: number;
    };
  }
  export interface DateTimePickerProps {
    value?: Date;
    mode?: 'date' | 'time' | 'datetime';
    display?: 'default' | 'spinner' | 'compact' | 'inline';
    onChange?: (event: DateTimePickerEvent, date?: Date) => void;
    minimumDate?: Date;
    maximumDate?: Date;
  }
  export default class DateTimePicker extends React.Component<DateTimePickerProps> {}
}

// Declaraciones para artistCategories
declare module '../../../constants/artistCategories' {
  export function getSuggestedDisciplines(categoryId: string): any[];
  export function getSuggestedStats(disciplineId: string): any[];
  export const SuggestedStat: any;
  export function getLocalizedCategoryName(categoryId: string): string;
  export function getLocalizedDisciplineName(disciplineId: string): string;
  export function getLocalizedRoleName(roleId: string): string;
  export function getLocalizedSpecializationName(specializationId: string): string;
}
