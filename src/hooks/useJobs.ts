import { useState, useEffect } from 'react';
import { useSchool } from './useSchool';
import sdk from '@/lib/sdk-config';

export interface Job {
  id: string;
  uid?: string;
  schoolId: string;
  title: string;
  department: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  location: string;
  remote: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  experience: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  benefits?: string[];
  applicationDeadline: string;
  startDate?: string;
  contactEmail: string;
  contactPerson?: string;
  applicationUrl?: string;
  applicationInstructions?: string;
  tags?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  applicationsCount: number;
  maxApplications?: number;
  status: 'draft' | 'published' | 'closed' | 'filled';
  featured: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export const useJobs = () => {
  const { school } = useSchool();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setJobs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<Job>('jobs', (allJobs) => {
      const schoolJobs = allJobs
        .filter(j => j.schoolId === school.id && j.status === 'published')
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setJobs(schoolJobs);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createJob = async (jobData: Omit<Job, 'id' | 'uid' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<Job>('jobs', {
      ...jobData,
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    return sdk.update<Job>('jobs', id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteJob = async (id: string) => {
    return sdk.delete('jobs', id);
  };

  const getJobsByType = (type: string) => {
    return jobs.filter(job => job.type === type);
  };

  const getJobsByDepartment = (department: string) => {
    return jobs.filter(job => job.department === department);
  };

  const getFeaturedJobs = (limit?: number) => {
    return jobs.filter(job => job.featured).slice(0, limit || 6);
  };

  const getUrgentJobs = () => {
    return jobs.filter(job => job.priority === 'urgent');
  };

  const getRemoteJobs = () => {
    return jobs.filter(job => job.remote);
  };

  const getDepartments = () => {
    const departments = [...new Set(jobs.map(job => job.department))];
    return departments.filter(Boolean);
  };

  const getJobTypes = () => {
    const types = [...new Set(jobs.map(job => job.type))];
    return types.filter(Boolean);
  };

  return {
    jobs,
    loading,
    error,
    createJob,
    updateJob,
    deleteJob,
    getJobsByType,
    getJobsByDepartment,
    getFeaturedJobs,
    getUrgentJobs,
    getRemoteJobs,
    getDepartments,
    getJobTypes,
  };
};
