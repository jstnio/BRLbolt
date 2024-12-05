import { create } from 'zustand';
import { User } from '../types';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  initialize: async () => {
    set({ loading: true });
    
    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                ...userDoc.data()
              } as User;
              set({ user: userData, loading: false, initialized: true });
            } else {
              set({ user: null, loading: false, initialized: true });
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            set({ user: null, loading: false, initialized: true });
          }
        } else {
          set({ user: null, loading: false, initialized: true });
        }
        resolve();
      });

      return () => unsubscribe();
    });
  },

  logout: async () => {
    try {
      await auth.signOut();
      set({ user: null });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },
}));