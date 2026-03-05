import "dotenv/config";
import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "artistas-app-frontend",
  slug: "artistas-app-frontend",
  owner: "wendisay29",
  scheme: [
    "artistas-app-frontend",
    "com.googleusercontent.apps.503562343837-8107on1n39ir43pq43ha301ui2hcsod3",
  ],
  orientation: "portrait",
  userInterfaceStyle: "light",
  ios: {
    bundleIdentifier: "com.wendy.artistasapp",
    supportsTablet: true,
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "BuscArt usa tu ubicación para mostrarte artistas cercanos y ayudarte a conectar con clientes en tu zona.",
      NSPhotoLibraryUsageDescription:
        "BuscArt necesita acceso a tu galería para que puedas subir tu foto de perfil y portada.",
      NSPhotoLibraryAddUsageDescription:
        "BuscArt necesita permiso para guardar fotos en tu galería.",
      NSCameraUsageDescription:
        "BuscArt necesita acceso a tu cámara para tomar fotos de perfil y portada.",
      NSMicrophoneUsageDescription:
        "BuscArt necesita acceso al micrófono para grabar videos de tu trabajo artístico.",
    },
  },
  android: {
    package: "com.wendy.artistasapp",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "READ_MEDIA_IMAGES",
      "READ_MEDIA_VIDEO",
      "CAMERA",
    ],
  },
  plugins: [
    "expo-web-browser",
    "expo-secure-store",
    "expo-apple-authentication",
    "expo-font",
    "expo-video",
    [
      "expo-image-picker",
      {
        photosPermission:
          "BuscArt necesita acceso a tu galería para subir fotos de perfil y portada.",
        cameraPermission:
          "BuscArt necesita acceso a tu cámara para tomar fotos de perfil y portada.",
        microphonePermission:
          "BuscArt necesita acceso al micrófono para grabar videos de tu trabajo artístico.",
      },
    ],
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "BuscArt usa tu ubicación para mostrarte artistas cercanos y ayudarte a conectar con clientes en tu zona.",
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "69ddbf0f-2791-467c-a689-f46fd6636e3f",
    },
    backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL,
    firebase: {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    },
    supabase: {
      url: process.env.EXPO_PUBLIC_SUPABASE_URL,
      anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      bucket: process.env.EXPO_PUBLIC_SUPABASE_BUCKET,
    },
  },
};

export default config;