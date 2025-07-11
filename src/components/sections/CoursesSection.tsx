import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/courses.css';
import { BookOpen } from 'lucide-react';

interface CoursesSectionProps {
  section: Section;
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ section }) => {
  const { title, courses } = section.content;
  const styleId = section.styleId || 'courses-card-blocks';

  const defaultCourses = [
    { code: 'CS101', name: 'Introduction to Computer Science', credits: 3 },
    { code: 'ENG203', name: 'Shakespearean Literature', credits: 3 },
    { code: 'MTH250', name: 'Calculus II', credits: 4 },
    { code: 'PHY110', name: 'General Physics I', credits: 4 },
  ];

  const courseItems = courses && courses.length > 0 ? courses : defaultCourses;

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

  return (
    <section className={`courses-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="courses-container">
          {courseItems.map(renderCourse)}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;