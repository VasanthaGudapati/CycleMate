import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: Partial<User>) => Promise<void>;
  logout: () => void;
  loginDemo: () => Promise<void>;
  refreshUser: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loginDemo: async () => {},
  refreshUser: async () => {},
  addXP: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await apiService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to load user', err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await apiService.login(email, password);
      setUser(loggedUser);
      showToast(`Welcome back, ${loggedUser.name}! 👋`, 'success');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      const newUser = await apiService.register(data);
      setUser(newUser);
      showToast(`Welcome to CycleMate, ${newUser.name}! Let's ride! 🚴`, 'success');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

  const loginDemo = async () => {
    setIsLoading(true);
    try {
      const demo = await apiService.getCurrentUser();
      setUser(demo);
      showToast('Logged in as Alex Morgan (Demo Account) 🚴', 'success');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    const updated = await apiService.getCurrentUser();
    setUser(updated);
  };

  const addXP = async (amount: number) => {
    if (!user) return;
    const { user: updated, levelUp } = await apiService.addXP(amount);
    setUser(updated);
    if (levelUp) {
      showToast(`🎉 LEVEL UP! You reached Level ${updated.level}!`, 'success');
    } else {
      showToast(`+${amount} XP earned! ⚡`, 'info');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        loginDemo,
        refreshUser,
        addXP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
