import { useState, useEffect } from 'react';
import { useSchool } from './useSchool';
import sdk from '@/lib/sdk-config';

export interface StudentResult {
  id: string;
  uid?: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  class: string;
  grade: string;
  academicYear: string;
  semester: string;
  examType: 'midterm' | 'final' | 'quiz' | 'assignment' | 'project';
  subjects: {
    name: string;
    code: string;
    score: number;
    maxScore: number;
    grade: string;
    remarks?: string;
    teacher: string;
  }[];
  totalScore: number;
  maxTotalScore: number;
  percentage: number;
  overallGrade: string;
  position?: number;
  totalStudents?: number;
  gpa?: number;
  cgpa?: number;
  remarks?: string;
  publishDate: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private';
  parentNotified: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export const useResults = () => {
  const { school } = useSchool();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<StudentResult>('results', (allResults) => {
      const schoolResults = allResults
        .filter(r => r.schoolId === school.id && r.status === 'published')
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
      setResults(schoolResults);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createResult = async (resultData: Omit<StudentResult, 'id' | 'uid' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<StudentResult>('results', {
      ...resultData,
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateResult = async (id: string, updates: Partial<StudentResult>) => {
    return sdk.update<StudentResult>('results', id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteResult = async (id: string) => {
    return sdk.delete('results', id);
  };

  const getResultsByStudent = (studentId: string) => {
    return results.filter(result => result.studentId === studentId);
  };

  const getResultsByClass = (className: string) => {
    return results.filter(result => result.class === className);
  };

  const getResultsByExamType = (examType: string) => {
    return results.filter(result => result.examType === examType);
  };

  const getResultsByAcademicYear = (academicYear: string) => {
    return results.filter(result => result.academicYear === academicYear);
  };

  const searchResultsByStudentNumber = (studentNumber: string) => {
    return results.filter(result => 
      result.studentNumber.toLowerCase().includes(studentNumber.toLowerCase())
    );
  };

  const getClasses = () => {
    const classes = [...new Set(results.map(result => result.class))];
    return classes.filter(Boolean);
  };

  const getAcademicYears = () => {
    const years = [...new Set(results.map(result => result.academicYear))];
    return years.filter(Boolean).sort().reverse();
  };

  const getExamTypes = () => {
    const types = [...new Set(results.map(result => result.examType))];
    return types.filter(Boolean);
  };

  return {
    results,
    loading,
    error,
    createResult,
    updateResult,
    deleteResult,
    getResultsByStudent,
    getResultsByClass,
    getResultsByExamType,
    getResultsByAcademicYear,
    searchResultsByStudentNumber,
    getClasses,
    getAcademicYears,
    getExamTypes,
  };
};
