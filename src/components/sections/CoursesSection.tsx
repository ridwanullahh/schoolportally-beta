import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import { useCourses } from '@/hooks/useCourses';
import '@/themes/styles/sections/courses-modern.css';
import '@/themes/styles/sections/courses-ultra-modern.css';
import '@/themes/styles/sections/courses-section-styles.css';
import { BookOpen, Clock, Users, Star, Search, Filter, ArrowRight, User } from 'lucide-react';

interface CoursesSectionProps {
  section: Section;
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ section }) => {
  const { content, settings } = section;
  const { courses, loading, error } = useCourses();

  // Section settings with defaults
  const coursesToShow = parseInt(settings?.coursesToShow || '6');
  const enableSearch = settings?.enableSearch !== false;
  const enableFiltering = settings?.enableFiltering !== false;
  const enableSorting = settings?.enableSorting !== false;
  const enableLoadMore = settings?.enableLoadMore !== false;
  const showViewAllButton = settings?.showViewAllButton !== false;

  // State for controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [displayedCourses, setDisplayedCourses] = useState(coursesToShow);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'courses-modern-grid',
      '2': 'courses-modern-cards',
      '3': 'courses-modern-horizontal',
      '4': 'courses-modern-minimal',
      '5': 'courses-modern-bordered',
      '6': 'courses-modern-hexagon',
      '7': 'courses-modern-gradient',
      '8': 'courses-modern-split',
      '9': 'courses-modern-compact',
      '10': 'courses-modern-asymmetric',
      '11': 'courses-modern-typography',
      // Existing ultra-modern styles (12+)
      '12': 'courses-floating-glass',
      '13': 'courses-holographic-cards',
      '14': 'courses-neon-grid',
      '15': 'courses-particle-bg',
      '16': 'courses-morphing-cards',
      '17': 'courses-cyber-grid',
      '18': 'courses-liquid-metal',
      '19': 'courses-aurora-bg',
      '20': 'courses-matrix-rain',
      '21': 'courses-quantum-field',
      '22': 'courses-neural-network',
      '23': 'courses-hologram-effect',
      '24': 'courses-energy-waves',
      '25': 'courses-digital-rain',
      '26': 'courses-mosaic-layout'
    };
    return styleMap[styleNumber] || 'courses-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');
  const [activeTag, setActiveTag] = useState('All');

  const defaultCourses = [
    {
      id: '1',
      name: 'Introduction to Computer Science',
      code: 'CS101',
      department: 'Computer Science',
      credits: 3,
      description: 'Fundamental concepts of computer science including programming, algorithms, and data structures.',
      instructor: 'Dr. Sarah Smith',
      capacity: 40,
      currentEnrollment: 35,
      duration: '16 weeks',
      level: 'undergraduate',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
      schedule: {
        days: ['Monday', 'Wednesday', 'Friday'],
        startTime: '09:00',
        endTime: '10:30',
        room: 'CS Lab 1'
      },
      fees: 1200,
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      featured: true,
      status: 'active'
    },
    {
      id: '2',
      name: 'Calculus I',
      code: 'MATH101',
      department: 'Mathematics',
      credits: 4,
      description: 'Introduction to differential and integral calculus with applications.',
      instructor: 'Prof. Michael Johnson',
      capacity: 50,
      currentEnrollment: 45,
      duration: '16 weeks',
      level: 'undergraduate',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
      schedule: {
        days: ['Tuesday', 'Thursday'],
        startTime: '11:00',
        endTime: '12:30',
        room: 'Math 201'
      },
      fees: 1000,
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      featured: true,
      status: 'active'
    },
    {
      id: '3',
      name: 'English Composition',
      code: 'ENG101',
      department: 'English',
      credits: 3,
      description: 'Academic writing skills, critical thinking, and literary analysis.',
      instructor: 'Ms. Emily Davis',
      capacity: 30,
      currentEnrollment: 28,
      duration: '16 weeks',
      level: 'undergraduate',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
      schedule: {
        days: ['Monday', 'Wednesday'],
        startTime: '14:00',
        endTime: '15:30',
        room: 'English 105'
      },
      fees: 900,
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      featured: false,
      status: 'active'
    },
    {
      id: '4',
      name: 'Physics Laboratory',
      code: 'PHYS201',
      department: 'Physics',
      credits: 2,
      description: 'Hands-on laboratory experiments in mechanics, thermodynamics, and electromagnetism.',
      instructor: 'Dr. Robert Chen',
      capacity: 24,
      currentEnrollment: 22,
      duration: '16 weeks',
      level: 'undergraduate',
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=300&fit=crop',
      schedule: {
        days: ['Friday'],
        startTime: '13:00',
        endTime: '16:00',
        room: 'Physics Lab'
      },
      fees: 800,
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      featured: true,
      status: 'active'
    },
    {
      id: '5',
      name: 'Digital Marketing',
      code: 'MKT301',
      department: 'Business',
      credits: 3,
      description: 'Modern digital marketing strategies, social media, and online advertising.',
      instructor: 'Ms. Lisa Wilson',
      capacity: 35,
      currentEnrollment: 32,
      duration: '16 weeks',
      level: 'undergraduate',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      schedule: {
        days: ['Tuesday', 'Thursday'],
        startTime: '15:00',
        endTime: '16:30',
        room: 'Business 302'
      },
      fees: 1100,
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      featured: false,
      status: 'active'
    },
    {
      id: '6',
      name: 'Organic Chemistry',
      code: 'CHEM301',
      department: 'Chemistry',
      credits: 4,
      description: 'Advanced organic chemistry covering reaction mechanisms and synthesis.',
      instructor: 'Dr. Amanda Martinez',
      capacity: 28,
      currentEnrollment: 25,
      duration: '16 weeks',
      level: 'undergraduate',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      schedule: {
        days: ['Monday', 'Wednesday', 'Friday'],
        startTime: '10:00',
        endTime: '11:30',
        room: 'Chemistry Lab'
      },
      fees: 1300,
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      featured: true,
      status: 'active'
    }
  ];

  // Use dynamic content if available, otherwise use defaults
  const courseItems = courses && courses.length > 0 ? courses : defaultCourses;
  const renderCourse = (course: any, index: number) => {
    const courseImage = course.image || 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop';

    return (
      <div key={course.id || index} className="course-card">
        <img
          src={courseImage}
          alt={course.name}
          className="course-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop';
          }}
        />
        <div className="course-name">{course.name}</div>
        <div className="course-code">{course.code}</div>
        <div className="course-instructor">Instructor: {course.instructor}</div>
        <div className="course-details">
          <span>Credits: {course.credits}</span>
          <span>Level: {course.level}</span>
        </div>
        <div className="course-details">
          <span>Enrolled: {course.currentEnrollment}/{course.capacity}</span>
          <span>{course.fees ? `$${course.fees}` : 'Free'}</span>
        </div>
        {course.description && <div className="course-description">{course.description}</div>}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="courses-container">
          <div className="loading-state">Loading courses...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="courses-container">
          <div className="error-state">Error loading courses. Showing default courses.</div>
          <div className="courses-container">
            {defaultCourses.map(renderCourse)}
          </div>
        </div>
      );
    }

    switch (styleId) {
      case 'courses-sliding-carousel':
        return (
          <div className="courses-container">
            <div className="carousel-track">
              {courseItems.map(renderCourse)}
              {/* Duplicate for seamless loop */}
              {courseItems.map((course, index) => renderCourse(course, index + courseItems.length))}
            </div>
          </div>
        );
      case 'courses-minimal-lines':
        return (
          <div className="courses-container">
            {courseItems.map(renderCourse)}
          </div>
        );
      default:
        return (
          <div className="courses-container">
            {courseItems.map(renderCourse)}
          </div>
        );
    }
  }

  return (
    <section className={`courses-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default CoursesSection;