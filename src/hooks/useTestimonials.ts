import { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';

export interface Testimonial {
  id: string;
  schoolId: string;
  text: string;
  author: string;
  role: string;
  avatar?: string;
  rating: number;
  status: 'published' | 'draft' | 'pending';
  featured: boolean;
  date: string;
  createdAt: string;
  updatedAt?: string;
}

export const useTestimonials = () => {
  const { school } = useSchool();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setTestimonials([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<Testimonial>('testimonials', (allTestimonials) => {
      const schoolTestimonials = allTestimonials.filter(t => t.schoolId === school.id);
      setTestimonials(schoolTestimonials);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createTestimonial = async (testimonialData: Omit<Testimonial, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<Testimonial>('testimonials', { 
      ...testimonialData, 
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateTestimonial = async (testimonialId: string, updates: Partial<Testimonial>) => {
    return sdk.update<Testimonial>('testimonials', testimonialId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteTestimonial = async (testimonialId: string) => {
    return sdk.delete('testimonials', testimonialId);
  };

  const getPublishedTestimonials = () => {
    return testimonials.filter(t => t.status === 'published');
  };

  const getFeaturedTestimonials = () => {
    return testimonials.filter(t => t.status === 'published' && t.featured);
  };

  const getTestimonialsByRole = (role: string) => {
    return testimonials.filter(t => t.status === 'published' && t.role === role);
  };

  return {
    testimonials,
    loading,
    error,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getPublishedTestimonials,
    getFeaturedTestimonials,
    getTestimonialsByRole,
  };
};
