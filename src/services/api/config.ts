import axios from "axios";
import Constants from "expo-constants";

const backendUrl = (Constants.expoConfig?.extra as any)?.backendUrl as string | undefined;

if (!backendUrl) {
  throw new Error("Missing backendUrl. Set EXPO_PUBLIC_BACKEND_URL in .env");
}

export const api = axios.create({
  baseURL: backendUrl,
  timeout: 20000,
});
