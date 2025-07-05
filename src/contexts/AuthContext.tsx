
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/sdk';
import sdk from '@/lib/sdk-config';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, profile?: Partial<User>) => Promise<void>;
  logout: () => void;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const currentUser = sdk.getCurrentUser(token);
          if (currentUser) {
            setUser(currentUser);
          } else {
            localStorage.removeItem('auth_token');
            setToken(null);
          }
        } catch (error) {
          console.error('Failed to verify token:', error);
          localStorage.removeItem('auth_token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await sdk.login(email, password);
      if (typeof result === 'string') {
        // Direct login success
        localStorage.setItem('auth_token', result);
        setToken(result);
        const currentUser = sdk.getCurrentUser(result);
        setUser(currentUser);
      } else {
        // OTP required
        throw new Error('OTP_REQUIRED');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, profile: Partial<User> = {}) => {
    setLoading(true);
    try {
      const newUser = await sdk.register(email, password, profile);
      // Check if OTP is required for registration
      const authConfig = sdk.getConfig('authConfig');
      if (!authConfig?.otpTriggers?.includes('register')) {
        const loginToken = await sdk.login(email, password);
        if (typeof loginToken === 'string') {
          localStorage.setItem('auth_token', loginToken);
          setToken(loginToken);
          setUser(newUser);
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    setLoading(true);
    try {
      const loginToken = await sdk.verifyLoginOTP(email, otp);
      localStorage.setItem('auth_token', loginToken);
      setToken(loginToken);
      const currentUser = sdk.getCurrentUser(loginToken);
      setUser(currentUser);
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (token) {
      sdk.destroySession(token);
    }
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const requestPasswordReset = async (email: string) => {
    try {
      await sdk.requestPasswordReset(email);
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      await sdk.resetPassword(email, otp, newPassword);
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false;
  };

  const hasPermission = (permission: string): boolean => {
    return sdk.hasPermission(user, permission);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    verifyOTP,
    requestPasswordReset,
    resetPassword,
    isAuthenticated: !!user && !!token,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
