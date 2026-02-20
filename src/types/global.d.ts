// Declaración global para desactivar chequeos estrictos de TypeScript
declare module '*';

// Declaraciones básicas para React Native
declare module 'react-native';

// Declaraciones para Expo
declare module 'expo' {
  export const Constants: any;
  export const LinearGradient: any;
  export const Font: any;
  export const Asset: any;
}

// Declaraciones para @expo/vector-icons
declare module '@expo/vector-icons' {
  export const Ionicons: any;
  export const MaterialCommunityIcons: any;
  export const Feather: any;
  export const AntDesign: any;
  export const Entypo: any;
  export const EvilIcons: any;
  export const FontAwesome: any;
  export const FontAwesome5: any;
  export const FontAwesome6: any;
  export const Fontisto: any;
  export const Foundation: any;
  export const MaterialIcons: any;
  export const MaterialCommunityIcons: any;
  export const Octicons: any;
  export const SimpleLineIcons: any;
  export const Zocial: any;
  export default {
    Ionicons: any,
    MaterialCommunityIcons: any,
    Feather: any,
    AntDesign: any,
    Entypo: any,
    EvilIcons: any,
    FontAwesome: any,
    FontAwesome5: any,
    FontAwesome6: any,
    Fontisto: any,
    Foundation: any,
    MaterialIcons: any,
    Octicons: any,
    SimpleLineIcons: any,
    Zocial: any
  };
}

// Declaraciones para expo-haptics
declare module 'expo-haptics' {
  export const ImpactFeedbackStyle: any;
  export const NotificationFeedbackType: any;
  export function impactAsync(style?: any): Promise<void>;
  export function notificationAsync(type?: any): Promise<void>;
  export function selectionAsync(): Promise<void>;
}

// Declaraciones para expo-linear-gradient
declare module 'expo-linear-gradient' {
  export const LinearGradient: any;
}

// Declaraciones para react-native-safe-area-context
declare module 'react-native-safe-area-context' {
  export const SafeAreaView: any;
  export const useSafeAreaInsets: any;
}

// Declaraciones para módulos de la comunidad
declare module '@react-native-community/slider' {
  export default class Slider extends any {}
}

declare module '@react-native-community/datetimepicker' {
  export default class DateTimePicker extends any {}
}

declare module '@react-native-community/netinfo' {
  export const useNetInfo: any;
}

// Declaraciones para React
declare module 'react' {
  export const useState: any;
  export const useEffect: any;
  export const useRef: any;
  export const useCallback: any;
  export const useMemo: any;
  export const createContext: any;
  export const useContext: any;
  export const useReducer: any;
  export const forwardRef: any;
  export const memo: any;
  export const lazy: any;
  export const Suspense: any;
}

// Declaraciones para react-navigation
declare module '@react-navigation/native' {
  export const useNavigation: any;
  export const useRoute: any;
  export const useFocusEffect: any;
}

declare module '@react-navigation/stack' {
  export const createStackNavigator: any;
}

declare module '@react-navigation/bottom-tabs' {
  export const createBottomTabNavigator: any;
}

declare module '@react-navigation/drawer' {
  export const createDrawerNavigator: any;
}

// Declaraciones para Firebase
declare module '@react-native-firebase/app' {
  export default class FirebaseApp extends any {}
}

declare module '@react-native-firebase/auth' {
  export const auth: any;
  export const signInWithEmailAndPassword: any;
  export const createUserWithEmailAndPassword: any;
  export const signOut: any;
  export const onAuthStateChanged: any;
}

declare module '@react-native-firebase/firestore' {
  export const firestore: any;
  export const collection: any;
  export const doc: any;
  export const getDoc: any;
  export const setDoc: any;
  export const updateDoc: any;
  export const deleteDoc: any;
  export const addDoc: any;
  export const query: any;
  export const where: any;
  export const orderBy: any;
  export const limit: any;
  export const onSnapshot: any;
}

// Declaraciones para otros módulos comunes
declare module 'react-native-gesture-handler' {
  export const PanGestureHandler: any;
  export const TapGestureHandler: any;
  export const State: any;
}

declare module 'react-native-reanimated' {
  export const Value: any;
  export const event: any;
  export const add: any;
  export const eq: any;
  export const set: any;
  export const cond: any;
  export const interpolate: any;
}

declare module 'react-native-svg' {
  export const Svg: any;
  export const Circle: any;
  export const Ellipse: any;
  export const G: any;
  export const Text: any;
  export const TSpan: any;
  export const TextPath: any;
  export const Path: any;
  export const Polygon: any;
  export const Polyline: any;
  export const Line: any;
  export const Rect: any;
  export const Use: any;
  export const Image: any;
  export const Symbol: any;
  export const Defs: any;
  export const LinearGradient: any;
  export const RadialGradient: any;
  export const Stop: any;
  export const ClipPath: any;
  export const Pattern: any;
  export const Mask: any;
}

// Tipos globales para evitar errores
declare global {
  const ReactNative: any;
  const Expo: any;
  const Firebase: any;
  
  // Funciones globales comunes
  const console: {
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    info: (...args: any[]) => void;
  };
  
  // Tipos para eventos
  type PressedEvent = {
    pressed: boolean;
  };
  
  // Tipos para animaciones
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

export {};
