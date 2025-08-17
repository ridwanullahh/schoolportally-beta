
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/sdk';
import sdk from '@/lib/sdk-config';
import { fallbackAuth } from '@/utils/fallbackAuth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
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

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Try GitHub SDK first
          const users = await sdk.get<User>('users');
          const currentUser = users.find(u => u.id === token || u.email === token);
          if (currentUser) {
            console.log('User found in SDK:', currentUser);
            setUser(currentUser);
          } else {
            console.log('User not found in SDK, clearing token');
            localStorage.removeItem('auth_token');
            setToken(null);
          }
        } catch (error) {
          console.log('SDK not available, trying fallback auth');
          // Fallback to local storage
          const localUser = fallbackAuth.getCurrentUser();
          if (localUser && localUser.id === token) {
            setUser(localUser as User);
          } else {
            localStorage.removeItem('auth_token');
            setToken(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  useEffect(() => {
    const pollUserData = async () => {
        if (!user?.id) return;
        try {
            const freshUser = await sdk.getItem<User>('users', user.id);
            if (JSON.stringify(freshUser) !== JSON.stringify(user)) {
                setUser(freshUser);
            }
        } catch (error) {
            console.error('Polling failed to fetch user data:', error);
        }
    };

    const intervalId = setInterval(pollUserData, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [user]);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      try {
        // Try GitHub SDK first
        const users = await sdk.get<User>('users');
        const foundUser = users.find(u => u.email === email);
        
        if (foundUser && foundUser.password && sdk.verifyPassword(password, foundUser.password)) {
          const userToken = foundUser.id || foundUser.email;
          localStorage.setItem('auth_token', userToken);
          setToken(userToken);
          setUser(foundUser);
          console.log('Login successful with SDK:', foundUser);
          return foundUser;
        }
      } catch (error) {
        console.log('SDK login failed, trying fallback');
        // GitHub not available, use fallback
        const localUser = fallbackAuth.login(email, password);
        const userToken = localUser.id;
        localStorage.setItem('auth_token', userToken);
        setToken(userToken);
        setUser(localUser as User);
        console.log('Login successful with fallback:', localUser);
        return localUser as User;
      }
      
      throw new Error('Invalid credentials');
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
      const userId = generateUniqueId();
      
      try {
        // Try GitHub SDK first
        const hashedPassword = sdk.hashPassword(password);
        const newUser = await sdk.insert<User>('users', {
          id: userId,
          email,
          password: hashedPassword,
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          roles: profile.roles || ['school_owner'],
          permissions: profile.permissions || [],
          verified: false,
          userType: 'school_owner',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...profile
        });
        
        const userToken = newUser.id || newUser.email;
        localStorage.setItem('auth_token', userToken);
        setToken(userToken);
        setUser(newUser);
        console.log('Registration successful with SDK:', newUser);
      } catch (error) {
        console.log('SDK registration failed, trying fallback');
        // GitHub not available, use fallback
        const localUser = fallbackAuth.register(email, password, {
          id: userId,
          ...profile
        });
        const userToken = localUser.id;
        localStorage.setItem('auth_token', userToken);
        setToken(userToken);
        setUser(localUser as User);
        console.log('Registration successful with fallback:', localUser);
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
        // Fallback for OTP
        throw new Error('OTP verification not available in demo mode');
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
    fallbackAuth.logout();
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
      try {
        const users = await sdk.get<User>('users');
        const foundUser = users.find(u => u.email === email);
        
        if (foundUser && foundUser.id) {
          const hashedPassword = sdk.hashPassword(newPassword);
          await sdk.update('users', foundUser.id, { password: hashedPassword });
        }
      } catch (error) {
        throw new Error('Password reset not available in demo mode');
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
