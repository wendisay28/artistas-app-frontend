// src/screens/auth/login/hooks/useLogin.ts
import { useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import { useAuthStore } from '../../../../store/authStore';
import { signInWithGoogle } from '../../../../services/firebase/auth';
import { registerOrSyncUser } from '../../../../services/api/users';

WebBrowser.maybeCompleteAuthSession();

// ── Google OAuth (desde env) ─────────────────────────────────────────────────
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';
const REDIRECT_URI = GOOGLE_IOS_CLIENT_ID
  ? `com.googleusercontent.apps.${GOOGLE_IOS_CLIENT_ID.replace(/\.apps\.googleusercontent\.com$/, '')}:/oauthredirect`
  : '';

// ── PKCE helpers ────────────────────────────────────────────────────────────

async function generateCodeVerifier(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(32);
  return base64URLEncode(bytes);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    verifier,
    { encoding: Crypto.CryptoEncoding.BASE64 },
  );
  // Convertir base64 estándar a base64url
  return digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64URLEncode(bytes: Uint8Array): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < bytes.length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

// ── Hook ────────────────────────────────────────────────────────────────────

export const useLogin = () => {
  const { setUser, setToken, setError } = useAuthStore();
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const [isAppleLoading, setAppleLoading] = useState(false);

  const handleGoogleLogin = useCallback(async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      // 1. Generar PKCE (code_verifier + code_challenge)
      const codeVerifier = await generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = Crypto.randomUUID();

      // 2. Construir URL de autorización
      if (!GOOGLE_IOS_CLIENT_ID || !REDIRECT_URI) {
        throw new Error('Configura EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID en .env');
      }
      const params = new URLSearchParams({
        client_id: GOOGLE_IOS_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'openid profile email',
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        access_type: 'offline',
      });

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      console.log('Abriendo Google OAuth (code flow + PKCE)...');

      // 3. Abrir browser del sistema (ASWebAuthenticationSession en iOS)
      const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);

      if (result.type !== 'success') {
        console.log('Login cancelado por el usuario');
        setGoogleLoading(false);
        return;
      }

      // 4. Extraer el code de la URL de callback
      const callbackUrl = result.url;
      const urlParams = new URLSearchParams(callbackUrl.split('?')[1] || '');
      const code = urlParams.get('code');
      const returnedState = urlParams.get('state');

      if (returnedState !== state) {
        throw new Error('State mismatch');
      }

      if (!code) {
        const error = urlParams.get('error');
        throw new Error(error || 'No se recibió código de autorización');
      }

      console.log('Código de autorización recibido');

      // 5. Intercambiar code por tokens (iOS client = public client, no necesita secret)
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: GOOGLE_IOS_CLIENT_ID,
          code,
          code_verifier: codeVerifier,
          grant_type: 'authorization_code',
          redirect_uri: REDIRECT_URI,
        }).toString(),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        console.error('Token exchange error:', tokenData);
        throw new Error(tokenData.error_description || 'Error al obtener tokens');
      }

      const { id_token: idToken, access_token: accessToken } = tokenData;
      console.log('Tokens obtenidos:', { hasIdToken: !!idToken, hasAccessToken: !!accessToken });

      if (!idToken) {
        throw new Error('No se recibió id_token de Google');
      }

      // 6. Autenticar en Firebase
      const firebaseUser = await signInWithGoogle(idToken, accessToken);
      const firebaseToken = await firebaseUser.getIdToken();
      console.log('Firebase OK:', firebaseUser.email);

      // 7. Sincronizar con backend INMEDIATAMENTE después del login
      try {
        const { registerOrSyncUser } = await import('../../../../services/api/users');
        await registerOrSyncUser();
        console.log('[Login] Usuario sincronizado con backend');
      } catch (syncError: any) {
        console.warn('[Login] Error sincronizando con backend:', syncError?.message);
        // No bloquear el login si falla la sincronización
      }

      // 8. Establecer usuario INMEDIATAMENTE para garantizar isAuthenticated=true
      //    sin depender del timing de onAuthChange (que es async y puede tardar).
      //    Solo si el perfil no estaba ya completo (evita pisar usuarios que regresan).
      const { pendingRole, isProfileComplete: alreadyComplete } = useAuthStore.getState();
      setToken(firebaseToken);
      if (!alreadyComplete) {
        setUser({
          id: firebaseUser.uid,
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || null,
          role: (pendingRole as any) || 'client',
          isCompany: false,
          city: null,
          bio: null,
          isProfileComplete: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      console.log('Login completado exitosamente (solo Firebase)');
    } catch (err: any) {
      console.error('Error Google Login:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setGoogleLoading(false);
    }
  }, [setUser, setToken, setError]);

  const handleAppleLogin = useCallback(async () => {
    // Tu código de Apple aquí
  }, []);

  const handleTempLogin = useCallback(async () => {
    setUser({
      id: 'temp-123',
      firebaseUid: 'temp-123',
      email: 'test@buscartpro.com',
      displayName: 'Usuario Test',
      photoURL: null,
      role: 'client' as const,
      isCompany: false,
      city: null,
      bio: null,
      isProfileComplete: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setToken('temp-token');
  }, [setUser, setToken]);

  return {
    handleGoogleLogin,
    handleAppleLogin,
    handleTempLogin,
    isGoogleLoading,
    isAppleLoading,
  };
};
