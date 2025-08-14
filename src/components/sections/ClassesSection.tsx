import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import { useClasses } from '@/hooks/useClasses';
import { useSchool } from '@/contexts/SchoolContext';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, Calendar, BookOpen, ArrowRight, ChevronDown } from 'lucide-react';
import SectionWrapper, { SectionCard, SectionControls, SectionLoadMore } from './SectionWrapper';



import sdk from '@/lib/sdk-config';

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

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'classes-modern-grid',
      '2': 'classes-modern-cards',
      '3': 'classes-modern-horizontal',
      '4': 'classes-modern-minimal',
      '5': 'classes-modern-bordered',
      '6': 'classes-modern-hexagon',
      '7': 'classes-modern-gradient',
      '8': 'classes-modern-split',
      '9': 'classes-modern-compact',
      '10': 'classes-modern-asymmetric',
      '11': 'classes-modern-typography',
      // Existing ultra-modern styles (12+)
      '12': 'classes-floating-glass',
      '13': 'classes-holographic-cards',
      '14': 'classes-neon-grid',
      '15': 'classes-particle-bg',
      '16': 'classes-morphing-cards',
      '17': 'classes-cyber-grid',
      '18': 'classes-liquid-metal',
      '19': 'classes-aurora-bg',
      '20': 'classes-matrix-rain',
      '21': 'classes-quantum-field',
      '22': 'classes-neural-network',
      '23': 'classes-hologram-effect',
      '24': 'classes-energy-waves',
      '25': 'classes-digital-rain',
      '26': 'classes-mosaic-layout'
    };
    return styleMap[styleNumber] || 'classes-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');

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
      subjects: ['Algebra', 'Geometry', 'Statistics'],
      slug: 'mathematics-101',
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
      subjects: ['Art History', 'Cultural Studies', 'Art Criticism'],
      slug: 'history-of-art',
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
      subjects: ['Mechanics', 'Thermodynamics', 'Wave Physics'],
      slug: 'introduction-to-physics',
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

  // Render class card
  const renderClass = (classItem: any, index: number) => {
    const classUrl = `/${school?.slug}/classes/${classItem.slug || classItem.id}`;

    return (
      <SectionCard key={classItem.id || index} href={classUrl}>
        {classItem.image && (
          <img
            src={classItem.image}
            alt={classItem.name}
            className="class-image"
          />
        )}
        <div className="class-content">
          <h3 className="class-name">{classItem.name}</h3>
          {classItem.grade && <div className="class-grade">{classItem.grade}</div>}
          {classItem.teacher && (
            <div className="class-teacher">
              <Users size={14} />
              <span>Teacher: {classItem.teacher}</span>
            </div>
          )}
          {classItem.capacity && classItem.currentEnrollment && (
            <div className="class-capacity">
              <div className="enrollment-info">
                <span>Enrolled: {classItem.currentEnrollment}/{classItem.capacity}</span>
                <span className="enrollment-percentage">
                  {Math.round((classItem.currentEnrollment / classItem.capacity) * 100)}% Full
                </span>
              </div>
              <div className="enrollment-bar">
                <div
                  className="enrollment-fill"
                  style={{ width: `${(classItem.currentEnrollment / classItem.capacity) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          {classItem.subjects && classItem.subjects.length > 0 && (
            <div className="class-subjects">
              {classItem.subjects.map((subject: string, idx: number) => (
                <span key={idx} className="subject-tag">{subject}</span>
              ))}
            </div>
          )}
          {classItem.description && (
            <p className="class-description">
              {classItem.description.length > 120
                ? `${classItem.description.substring(0, 120)}...`
                : classItem.description
              }
            </p>
          )}
          {classItem.room && (
            <div className="class-room">
              <BookOpen size={14} />
              <span>Room: {classItem.room}</span>
            </div>
          )}
        </div>
      </SectionCard>
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