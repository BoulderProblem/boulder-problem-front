// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onIdTokenChanged,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { auth } from '../firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  signInWithToken: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Si tu utilises Option B (localStorage), NOM du token interne :
  const INTERNAL_TOKEN_KEY = 'adonis_token';

  // Envoie idToken Firebase au backend pour créer/obtenir le token interne
  async function sendIdTokenToBackend(idToken: string) {
    // Option A: backend renvoie cookie HTTP-only (secure) — on ne gère rien côté client
    // Option B: backend renvoie JSON { token: "..." } -> on stocke localStorage
    const res = await fetch('/auth/firebase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      credentials: 'include', // IMPORTANT si backend set-cookie
    });

    if (!res.ok) throw new Error('Backend auth failed');

    const data = await res.json().catch(() => null);

    if (data?.token) {
      // Option B: sauvegarder token interne
      localStorage.setItem(INTERNAL_TOKEN_KEY, data.token);
    }
  }

  // Fonction principale appelée après connexion Firebase
  async function signInWithToken() {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const idToken = await currentUser.getIdToken(/* forceRefresh */ true);
    await sendIdTokenToBackend(idToken);
  }

  // Logout global
  async function signOut() {
    // Si Option B : supprimer token interne
    localStorage.removeItem(INTERNAL_TOKEN_KEY);
    // Déconnecter Firebase
    await firebaseSignOut(auth);
    // Appel backend pour révoquer session si besoin
    await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  }

  useEffect(() => {
    // onIdTokenChanged gère les refreshs du token Firebase automatiquement
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          await sendIdTokenToBackend(idToken);
        } catch (err) {
          console.error('Erreur auth -> backend', err);
        }
      } else {
        // pas d'utilisateur
        localStorage.removeItem('adonis_token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signInWithToken }}>
      {children}
    </AuthContext.Provider>
  );
};
