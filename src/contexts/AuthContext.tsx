
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
          // Get all users and find current user by token
          const users = await sdk.get<User>('users');
          const currentUser = users.find(u => u.id === token || u.email === token);
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
      const users = await sdk.get<User>('users');
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const userToken = foundUser.id || foundUser.email;
        localStorage.setItem('auth_token', userToken);
        setToken(userToken);
        setUser(foundUser);
      } else {
        throw new Error('Invalid credentials');
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
      const newUser = await sdk.insert<User>('users', {
        email,
        password,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        roles: profile.roles || ['school_owner'],
        verified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...profile
      });
      
      const userToken = newUser.id || newUser.email;
      localStorage.setItem('auth_token', userToken);
      setToken(userToken);
      setUser(newUser);
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
      const users = await sdk.get<User>('users');
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser) {
        const userToken = foundUser.id || foundUser.email;
        localStorage.setItem('auth_token', userToken);
        setToken(userToken);
        setUser(foundUser);
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const requestPasswordReset = async (email: string) => {
    try {
      console.log('Password reset requested for:', email);
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      const users = await sdk.get<User>('users');
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser && foundUser.id) {
        await sdk.update('users', foundUser.id, { password: newPassword });
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false;
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
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
