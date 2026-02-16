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
  },
  android: {
    package: "com.wendy.artistasapp",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  plugins: ["expo-web-browser", "expo-secure-store", "expo-apple-authentication", "expo-font"],
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