import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra as any;

const firebaseConfig = extra?.firebase;

if (!firebaseConfig?.apiKey) {
  throw new Error("Missing Firebase config. Set EXPO_PUBLIC_FIREBASE_* in .env");
}

export const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
