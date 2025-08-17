import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface AIContextType {
  context: 'admin' | 'teacher' | 'student';
  contextData: {
    subject?: string;
    class?: string;
    module?: string;
    lesson?: string;
    page?: string;
  };
  isAIEnabled: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIContextProvider');
  }
  return context;
};

interface AIContextProviderProps {
  children: React.ReactNode;
}

export const AIContextProvider: React.FC<AIContextProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [contextData, setContextData] = useState<AIContextType['contextData']>({});

  // Determine user context based on role
  const getContext = (): 'admin' | 'teacher' | 'student' => {
    if (!user) return 'student';
    
    if (user.role === 'admin' || user.role === 'super_admin') return 'admin';
    if (user.role === 'teacher') return 'teacher';
    return 'student';
  };

  // Extract context data from current route
  useEffect(() => {
    const path = location.pathname;
    const newContextData: AIContextType['contextData'] = {
      page: path
    };

    // Extract context from URL patterns
    if (path.includes('/subjects/')) {
      const subjectMatch = path.match(/\/subjects\/([^\/]+)/);
      if (subjectMatch) {
        newContextData.subject = subjectMatch[1];
      }
    }

    if (path.includes('/classes/')) {
      const classMatch = path.match(/\/classes\/([^\/]+)/);
      if (classMatch) {
        newContextData.class = classMatch[1];
      }
    }

    if (path.includes('/modules/')) {
      const moduleMatch = path.match(/\/modules\/([^\/]+)/);
      if (moduleMatch) {
        newContextData.module = moduleMatch[1];
      }
    }

    if (path.includes('/lessons/')) {
      const lessonMatch = path.match(/\/lessons\/([^\/]+)/);
      if (lessonMatch) {
        newContextData.lesson = lessonMatch[1];
      }
    }

    setContextData(newContextData);
  }, [location.pathname]);

  const value: AIContextType = {
    context: getContext(),
    contextData,
    isAIEnabled: !!user && !!import.meta.env.VITE_GEMINI_API_KEY_1
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

export default AIContextProvider;
