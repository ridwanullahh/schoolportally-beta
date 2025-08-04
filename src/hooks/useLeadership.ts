import { useState, useEffect } from 'react';
import { useSchool } from './useSchool';
import sdk from '@/lib/sdk-config';

export interface LeadershipMember {
  id: string;
  uid?: string;
  schoolId: string;
  name: string;
  role: string;
  department?: string;
  bio?: string;
  image?: string;
  email?: string;
  phone?: string;
  qualifications?: string[];
  experience?: string;
  achievements?: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  order?: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export const useLeadership = () => {
  const { school } = useSchool();
  const [members, setMembers] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setMembers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<LeadershipMember>('leadership', (allMembers) => {
      const schoolMembers = allMembers
        .filter(m => m.schoolId === school.id && m.status === 'active')
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setMembers(schoolMembers);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createMember = async (memberData: Omit<LeadershipMember, 'id' | 'uid' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<LeadershipMember>('leadership', {
      ...memberData,
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateMember = async (id: string, updates: Partial<LeadershipMember>) => {
    return sdk.update<LeadershipMember>('leadership', id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteMember = async (id: string) => {
    return sdk.delete('leadership', id);
  };

  const getMembersByRole = (role: string) => {
    return members.filter(member => member.role === role);
  };

  const getMembersByDepartment = (department: string) => {
    return members.filter(member => member.department === department);
  };

  const getFeaturedMembers = (limit?: number) => {
    const featured = members.slice(0, limit || 6);
    return featured;
  };

  return {
    members,
    loading,
    error,
    createMember,
    updateMember,
    deleteMember,
    getMembersByRole,
    getMembersByDepartment,
    getFeaturedMembers,
  };
};
