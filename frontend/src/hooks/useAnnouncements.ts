import { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Announcement } from '@/types';

export const useAnnouncements = () => {
  const { school } = useSchool();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setAnnouncements([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<Announcement>('announcements', (allAnnouncements) => {
      const schoolAnnouncements = allAnnouncements.filter(a => a.schoolId === school.id);
      setAnnouncements(schoolAnnouncements);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'uid' | 'schoolId'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<Announcement>('announcements', { ...announcementData, schoolId: school.id });
  };

  const updateAnnouncement = async (announcementId: string, updates: Partial<Announcement>) => {
    return sdk.update<Announcement>('announcements', announcementId, updates);
  };

  const deleteAnnouncement = async (announcementId: string) => {
    return sdk.delete('announcements', announcementId);
  };

  return {
    announcements,
    loading,
    error,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  };
};