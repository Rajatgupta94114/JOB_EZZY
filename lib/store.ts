import { create } from 'zustand';

export type UserRole = 'company' | 'recruiter' | 'candidate' | 'admin' | 'kyc_validator' | 'verifier';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: 'company' | 'recruiter' | 'candidate' | 'admin' | 'kyc_validator' | 'verifier';
  walletAddress: string;
  telegramId?: string;
  telegramUsername?: string;
  tonDNS?: string;
  rating: number;
  kycStatus: 'pending' | 'verified' | 'rejected';
  pointsBalance: number;
  createdAt: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  showAuthModal: boolean;
  showSplashScreen: boolean;
  selectedRole: 'company' | 'candidate' | null;
  setUser: (user: User) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setShowAuthModal: (value: boolean) => void;
  setShowSplashScreen: (value: boolean) => void;
  setSelectedRole: (role: 'company' | 'candidate' | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  showAuthModal: false,
  showSplashScreen: false,
  selectedRole: null,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsLoading: (value) => set({ isLoading: value }),
  setShowAuthModal: (value) => set({ showAuthModal: value }),
  setShowSplashScreen: (value) => set({ showSplashScreen: value }),
  setSelectedRole: (role) => set({ selectedRole: role }),
  logout: () => set({ 
    user: null, 
    isAuthenticated: false, 
    selectedRole: null,
    showSplashScreen: true,
    showAuthModal: false,
  }),
}));
