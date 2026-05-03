import { create } from 'zustand';
import type { User, Profile } from '../types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, profile: Profile) => void;
  setProfile: (profile: Profile) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  setAuth: (user, profile) => set({ user, profile, isAuthenticated: true, isLoading: false }),
  setProfile: (profile) => set({ profile }),
  clearAuth: () => {
    localStorage.removeItem('spark_access_token');
    set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
  },
  setLoading: (isLoading) => set({ isLoading }),
}));
