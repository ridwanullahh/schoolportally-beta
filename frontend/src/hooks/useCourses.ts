import { useState, useEffect } from 'react';
import { useSchool } from './useSchool';
import sdk from '@/lib/sdk-config';

export interface Course {
  id: string;
  uid?: string;
  schoolId: string;
  name: string;
  code: string;
  department: string;
  credits: number;
  description: string;
  prerequisites?: string[];
  instructor: string;
  instructorId?: string;
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
    room?: string;
  };
  capacity: number;
  currentEnrollment: number;
  syllabus?: string;
  textbooks?: string[];
  assessmentMethods?: string[];
  learningOutcomes?: string[];
  duration: string;
  level: 'undergraduate' | 'graduate' | 'certificate';
  fees?: number;
  image?: string;
  materials?: string[];
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  status: 'active' | 'inactive' | 'full' | 'completed';
  featured: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export const useCourses = () => {
  const { school } = useSchool();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setCourses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<Course>('courses', (allCourses) => {
      const schoolCourses = allCourses
        .filter(c => c.schoolId === school.id && c.status === 'active')
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setCourses(schoolCourses);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createCourse = async (courseData: Omit<Course, 'id' | 'uid' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<Course>('courses', {
      ...courseData,
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    return sdk.update<Course>('courses', id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteCourse = async (id: string) => {
    return sdk.delete('courses', id);
  };

  const getCoursesByDepartment = (department: string) => {
    return courses.filter(course => course.department === department);
  };

  const getCoursesByLevel = (level: string) => {
    return courses.filter(course => course.level === level);
  };

  const getFeaturedCourses = (limit?: number) => {
    return courses.filter(course => course.featured).slice(0, limit || 6);
  };

  const getAvailableCourses = () => {
    return courses.filter(course => course.currentEnrollment < course.capacity);
  };

  const getDepartments = () => {
    const departments = [...new Set(courses.map(course => course.department))];
    return departments.filter(Boolean);
  };

  return {
    courses,
    loading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    getCoursesByDepartment,
    getCoursesByLevel,
    getFeaturedCourses,
    getAvailableCourses,
    getDepartments,
  };
};
