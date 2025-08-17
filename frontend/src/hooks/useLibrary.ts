import { useState, useEffect } from 'react';
import { useSchool } from './useSchool';
import sdk from '@/lib/sdk-config';

export interface LibraryResource {
  id: string;
  uid?: string;
  schoolId: string;
  title: string;
  type: 'book' | 'journal' | 'digital' | 'multimedia' | 'reference';
  author?: string;
  isbn?: string;
  publisher?: string;
  publishedDate?: string;
  category: string;
  subject: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
  location: string;
  callNumber?: string;
  language: string;
  pages?: number;
  format: 'physical' | 'digital' | 'both';
  accessLevel: 'public' | 'students' | 'faculty' | 'restricted';
  image?: string;
  digitalUrl?: string;
  tags?: string[];
  summary?: string;
  reviews?: {
    rating: number;
    comment: string;
    reviewer: string;
    date: string;
  }[];
  status: 'available' | 'maintenance' | 'restricted';
  featured: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export const useLibrary = () => {
  const { school } = useSchool();
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setResources([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<LibraryResource>('library', (allResources) => {
      const schoolResources = allResources
        .filter(r => r.schoolId === school.id && r.status === 'available')
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setResources(schoolResources);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createResource = async (resourceData: Omit<LibraryResource, 'id' | 'uid' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<LibraryResource>('library', {
      ...resourceData,
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateResource = async (id: string, updates: Partial<LibraryResource>) => {
    return sdk.update<LibraryResource>('library', id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteResource = async (id: string) => {
    return sdk.delete('library', id);
  };

  const getResourcesByType = (type: string) => {
    return resources.filter(resource => resource.type === type);
  };

  const getResourcesByCategory = (category: string) => {
    return resources.filter(resource => resource.category === category);
  };

  const getFeaturedResources = (limit?: number) => {
    return resources.filter(resource => resource.featured).slice(0, limit || 6);
  };

  const getAvailableResources = () => {
    return resources.filter(resource => resource.availableCopies > 0);
  };

  const getCategories = () => {
    const categories = [...new Set(resources.map(resource => resource.category))];
    return categories.filter(Boolean);
  };

  const getSubjects = () => {
    const subjects = [...new Set(resources.map(resource => resource.subject))];
    return subjects.filter(Boolean);
  };

  return {
    resources,
    loading,
    error,
    createResource,
    updateResource,
    deleteResource,
    getResourcesByType,
    getResourcesByCategory,
    getFeaturedResources,
    getAvailableResources,
    getCategories,
    getSubjects,
  };
};
