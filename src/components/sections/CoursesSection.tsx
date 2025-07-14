import React from 'react';
import { useState } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/courses.css';
import { BookOpen } from 'lucide-react';

interface CoursesSectionProps {
  section: Section;
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ section }) => {
  const { title, courses } = section.content;
  const styleId = section.styleId || 'courses-card-blocks';
  const [activeTag, setActiveTag] = useState('All');

  const defaultCourses = [
    { code: 'CS101', name: 'Introduction to Computer Science', credits: 3, tags: 'Computer Science,Introductory' },
    { code: 'ENG203', name: 'Shakespearean Literature', credits: 3, tags: 'English,Literature' },
    { code: 'MTH250', name: 'Calculus II', credits: 4, tags: 'Mathematics,Advanced' },
    { code: 'PHY110', name: 'General Physics I', credits: 4, tags: 'Physics,Science' },
  ];

  const courseItems = courses && courses.length > 0 ? courses : defaultCourses;
  
  const tags = ['All', ...new Set(courseItems.flatMap((c: any) => c.tags?.split(',')))];
  
  const filteredCourses = activeTag === 'All'
    ? courseItems
    : courseItems.filter((c: any) => c.tags?.includes(activeTag));

  const renderCourse = (course: any, index: number) => (
    <div key={index} className="course-card">
      <div className="icon mb-4">
        <BookOpen className="w-8 h-8 text-primary" />
      </div>
      <h3 className="course-name font-bold text-lg">{course.name}</h3>
      <p className="course-code text-sm text-muted-foreground">{course.code}</p>
      <p className="course-credits text-sm font-medium">{course.credits} Credits</p>
    </div>
  );
  
  const renderContent = () => {
    if (styleId === 'courses-tag-based-filters') {
      return (
        <div>
          <div className="filters flex justify-center gap-4 mb-8">
            {tags.map((tag: string) => (
              <button key={tag} className={`tag ${activeTag === tag ? 'active' : ''}`} onClick={() => setActiveTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
          <div className="courses-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(renderCourse)}
          </div>
        </div>
      )
    }

    return (
      <div className="courses-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courseItems.map(renderCourse)}
      </div>
    )
  }

  return (
    <section className={`courses-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default CoursesSection;