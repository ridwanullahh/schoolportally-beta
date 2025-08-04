import React from 'react';
import { useState } from 'react';
import { Section } from '@/types';
import { useCourses } from '@/hooks/useCourses';
import '@/themes/styles/sections/courses-ultra-modern.css';
import { BookOpen } from 'lucide-react';

interface CoursesSectionProps {
  section: Section;
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ section }) => {
  const { title } = section.content;
  const styleId = section.styleId || 'courses-floating-glass';
  const [activeTag, setActiveTag] = useState('All');

  // Use dynamic content from courses admin module
  const { courses, loading, error, getFeaturedCourses } = useCourses();

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