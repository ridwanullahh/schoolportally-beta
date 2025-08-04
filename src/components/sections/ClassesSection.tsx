import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import { useClasses } from '@/hooks/useClasses';
import '@/themes/styles/sections/classes-ultra-modern.css';
import sdk from '@/lib/sdk-config';
import { useSchool } from '@/contexts/SchoolContext';

interface ClassesSectionProps {
  section: Section;
}

interface ClassItem {
  id: string;
  name: string;
  description?: string;
  teacherId?: string;
  teacherName?: string;
  schedule?: string;
  time?: string;
  capacity?: number;
  enrolled?: number;
  status: 'active' | 'inactive' | 'completed';
  schoolId: string;
}

const ClassesSection: React.FC<ClassesSectionProps> = ({ section }) => {
  const { title, classesLimit = 6 } = section.content;
  const styleId = section.styleId || 'classes-floating-glass';

  // Use dynamic content from classes admin module
  const { classes, loading, error, getFeaturedClasses } = useClasses();

  const defaultClasses = [
    {
      id: '1',
      name: 'Mathematics 101',
      grade: 'Grade 10',
      teacher: 'Mr. Smith',
      capacity: 30,
      currentEnrollment: 25,
      description: 'Advanced mathematics covering algebra, geometry, and basic calculus concepts.',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
      subjects: ['Algebra', 'Geometry', 'Statistics'],
      schedule: {
        monday: [{ startTime: '09:00', endTime: '10:30', subject: 'Algebra' }],
        wednesday: [{ startTime: '09:00', endTime: '10:30', subject: 'Geometry' }],
        friday: [{ startTime: '09:00', endTime: '10:30', subject: 'Statistics' }]
      },
      room: 'Room 101',
      academicYear: '2024-2025',
      status: 'active' as const
    },
    {
      id: '2',
      name: 'History of Art',
      grade: 'Grade 11',
      teacher: 'Ms. Davis',
      capacity: 25,
      currentEnrollment: 20,
      description: 'Exploring art history from ancient civilizations to contemporary movements.',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      subjects: ['Art History', 'Cultural Studies', 'Art Criticism'],
      schedule: {
        tuesday: [{ startTime: '11:00', endTime: '12:30', subject: 'Art History' }],
        thursday: [{ startTime: '11:00', endTime: '12:30', subject: 'Cultural Studies' }]
      },
      room: 'Art Studio A',
      academicYear: '2024-2025',
      status: 'active' as const
    },
    {
      id: '3',
      name: 'Introduction to Physics',
      grade: 'Grade 12',
      teacher: 'Dr. Brown',
      capacity: 30,
      currentEnrollment: 28,
      description: 'Fundamental physics concepts including mechanics, thermodynamics, and waves.',
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=300&fit=crop',
      subjects: ['Mechanics', 'Thermodynamics', 'Wave Physics'],
      schedule: {
        monday: [{ startTime: '13:00', endTime: '14:30', subject: 'Mechanics' }],
        wednesday: [{ startTime: '13:00', endTime: '14:30', subject: 'Thermodynamics' }]
      },
      room: 'Physics Lab',
      academicYear: '2024-2025',
      status: 'active' as const
    },
    {
      id: '4',
      name: 'Creative Writing',
      grade: 'Grade 9',
      teacher: 'Mrs. Wilson',
      capacity: 20,
      currentEnrollment: 15,
      description: 'Developing creative writing skills through poetry, short stories, and essays.',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
      subjects: ['Poetry', 'Short Stories', 'Essay Writing'],
      schedule: {
        tuesday: [{ startTime: '14:00', endTime: '15:30', subject: 'Poetry' }],
        thursday: [{ startTime: '14:00', endTime: '15:30', subject: 'Creative Writing' }]
      },
      room: 'English Room 2',
      academicYear: '2024-2025',
      status: 'active' as const
    },
    {
      id: '5',
      name: 'Computer Science',
      grade: 'Grade 11',
      teacher: 'Mr. Johnson',
      capacity: 24,
      currentEnrollment: 22,
      description: 'Programming fundamentals, algorithms, and software development principles.',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
      subjects: ['Programming', 'Algorithms', 'Software Development'],
      schedule: {
        monday: [{ startTime: '10:00', endTime: '11:30', subject: 'Programming' }],
        wednesday: [{ startTime: '10:00', endTime: '11:30', subject: 'Algorithms' }],
        friday: [{ startTime: '10:00', endTime: '11:30', subject: 'Software Development' }]
      },
      room: 'Computer Lab',
      academicYear: '2024-2025',
      status: 'active' as const
    },
    {
      id: '6',
      name: 'Biology Advanced',
      grade: 'Grade 12',
      teacher: 'Dr. Martinez',
      capacity: 28,
      currentEnrollment: 26,
      description: 'Advanced biological concepts including genetics, ecology, and molecular biology.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      subjects: ['Genetics', 'Ecology', 'Molecular Biology'],
      schedule: {
        tuesday: [{ startTime: '09:00', endTime: '10:30', subject: 'Genetics' }],
        thursday: [{ startTime: '09:00', endTime: '10:30', subject: 'Ecology' }]
      },
      room: 'Biology Lab',
      academicYear: '2024-2025',
      status: 'active' as const
    }
  ];

  // Use dynamic content if available, otherwise use defaults
  const classItems = classes && classes.length > 0 ? classes.slice(0, classesLimit) : defaultClasses;

  const renderClass = (classItem: any, index: number) => {
    const classImage = classItem.image || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop';

    return (
      <div key={classItem.id} className="class-card">
        <img
          src={classImage}
          alt={classItem.name}
          className="class-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop';
          }}
        />
        <div className="class-name">{classItem.name}</div>
        <div className="class-grade">{classItem.grade}</div>
        <div className="class-teacher">Teacher: {classItem.teacher}</div>
        <div className="class-capacity">
          <span>Enrolled: {classItem.currentEnrollment}/{classItem.capacity}</span>
          <span>{Math.round((classItem.currentEnrollment / classItem.capacity) * 100)}% Full</span>
        </div>
        {classItem.description && <div className="class-description">{classItem.description}</div>}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="classes-container">
          <div className="loading-state">Loading classes...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="classes-container">
          <div className="error-state">Error loading classes. Showing default classes.</div>
          <div className="classes-container">
            {defaultClasses.map(renderClass)}
          </div>
        </div>
      );
    }

    switch (styleId) {
      case 'classes-sliding-carousel':
        return (
          <div className="classes-container">
            <div className="carousel-track">
              {classItems.map(renderClass)}
              {/* Duplicate for seamless loop */}
              {classItems.map((classItem, index) => renderClass(classItem, index + classItems.length))}
            </div>
          </div>
        );
      case 'classes-minimal-lines':
        return (
          <div className="classes-container">
            {classItems.map(renderClass)}
          </div>
        );
      default:
        return (
          <div className="classes-container">
            {classItems.map(renderClass)}
          </div>
        );
    }
  }

  return (
    <section className={`classes-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default ClassesSection;