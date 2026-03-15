// src/services/firebase/auth.ts
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  OAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as SecureStore from 'expo-secure-store';
import { auth } from './config';

const TOKEN_KEY = 'buscartpro_firebase_token';

// ─── Google OAuth ──────────────────────────────────────────────────────────────

export const signInWithGoogle = async (
  idToken: string | null,
  accessToken?: string | null,
): Promise<User> => {
  const credential = GoogleAuthProvider.credential(idToken, accessToken);
  const result = await signInWithCredential(auth, credential);
  await persistToken(result.user);
  return result.user;
};

// ─── Apple Sign-In ────────────────────────────────────────────────────────────

export const signInWithApple = async (): Promise<User> => {
  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  const provider = new OAuthProvider('apple.com');
  const credential = provider.credential({
    idToken: appleCredential.identityToken!,
    rawNonce: appleCredential.authorizationCode!,
  });

  const result = await signInWithCredential(auth, credential);
  await persistToken(result.user);
  return result.user;
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const signOutUser = async (): Promise<void> => {
  _memToken = null;
  _memTokenExpiry = 0;
  await signOut(auth);
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

// ─── Token persistence (SecureStore — nunca texto plano) ──────────────────────

export const persistToken = async (user: User): Promise<void> => {
  const token = await user.getIdToken();
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getStoredToken = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(TOKEN_KEY);
};

// ─── Cache en memoria del token ───────────────────────────────────────────────
// CRÍTICO: getIdToken(true) + SecureStore en CADA request = 10 forced Firebase
// round-trips al cargar Explorar (1 lista + 9 prefetch paralelos).
// Solución: cache en memoria con TTL. Solo va a Firebase cuando el token
// está a <5 min de expirar. getIdToken(false) usa el cache interno de Firebase.
let _memToken: string | null = null;
let _memTokenExpiry = 0; // epoch ms

export const refreshToken = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  const now = Date.now();
  // Reutilizar token en memoria si le quedan >5 minutos de vida
  if (_memToken && _memTokenExpiry - now > 5 * 60 * 1000) {
    return _memToken;
  }

  try {
    // false = no forzar refresh a Google — Firebase reutiliza su cache interno
    // Solo va a red cuando el token está realmente expirado (cada ~60 min)
    const token = await currentUser.getIdToken(false);
    // Parsear expiración del JWT para saber cuándo renovar
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(
        typeof atob !== 'undefined'
          ? atob(parts[1])
          : Buffer.from(parts[1], 'base64').toString('utf8')
      );
      _memToken = token;
      _memTokenExpiry = (payload.exp ?? 0) * 1000; // exp está en segundos
    } else {
      _memToken = token;
      _memTokenExpiry = now + 55 * 60 * 1000; // fallback: 55 min
    }
    // NO escribir a SecureStore aquí — solo en login/logout
    return token;
  } catch {
    return null;
  }
};

// Llamar esto al hacer login para invalidar el cache
export const invalidateTokenCache = () => {
  _memToken = null;
  _memTokenExpiry = 0;
};

// ─── Observer de estado de sesión ─────────────────────────────────────────────

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// ─── Primer login detector ────────────────────────────────────────────────────

export const isFirstLogin = async (user: User): Promise<boolean> => {
  const meta = user.metadata;
  return meta.creationTime === meta.lastSignInTime;
};