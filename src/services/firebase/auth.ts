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

// ─── Refresh automático del token ─────────────────────────────────────────────

export const refreshToken = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  const token = await currentUser.getIdToken(true); // force refresh
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  return token;
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