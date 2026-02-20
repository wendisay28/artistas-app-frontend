import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    loading: false,
    error: null,
  });

  // Simular autenticación - reemplazar con lógica real
  useEffect(() => {
    // Aquí iría la lógica de verificación de token, etc.
    const mockUser: User = {
      id: 'mock-user-id',
      email: 'user@example.com',
      name: 'Usuario Mock',
    };
    
    setAuthState({
      user: mockUser,
      token: 'mock-token',
      loading: false,
      error: null,
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    // Lógica de login real aquí
    setAuthState(prev => ({ ...prev, loading: false }));
  };

  const signOut = () => {
    setAuthState({
      user: null,
      token: null,
      loading: false,
      error: null,
    });
  };

  return {
    ...authState,
    signIn,
    signOut,
  };
};
