import { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Branding } from '@/types';

export const useBranding = () => {
  const { school, setSchool } = useSchool();
  const [branding, setBranding] = useState<Branding | null>(school?.branding || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (school) {
      setBranding(school.branding || {});
      setLoading(false);
    }
  }, [school]);

  const updateBranding = async (updates: Partial<Branding>) => {
    if (!school) throw new Error('No school context');
    
    const updatedBranding = { ...branding, ...updates };
    
    // Optimistic update
    if(setSchool) {
        setSchool(prev => prev ? ({ ...prev, branding: updatedBranding as Branding }) : null);
    }
    
    try {
      await sdk.update('schools', school.id, { branding: updatedBranding });
    } catch (err) {
      // Revert on error
      if(setSchool) {
        setSchool(prev => prev ? ({ ...prev, branding: school.branding }) : null);
      }
      console.error('Failed to update branding:', err);
      throw err;
    }
    
    return updatedBranding;
  };

  return {
    branding,
    loading,
    error,
    updateBranding,
  };
};