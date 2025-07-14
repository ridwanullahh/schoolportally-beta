import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/classes.css';

interface ClassesSectionProps {
  section: Section;
}

const ClassesSection: React.FC<ClassesSectionProps> = ({ section }) => {
  const { title, classes } = section.content;
  const styleId = section.styleId || 'classes-grade-grid';

  const defaultClasses = [
    { name: 'Mathematics 101', teacher: 'Mr. Smith', schedule: 'Mon, Wed, Fri', time: '9:00 AM' },
    { name: 'History of Art', teacher: 'Ms. Davis', schedule: 'Tue, Thu', time: '11:00 AM' },
    { name: 'Introduction to Physics', teacher: 'Dr. Brown', schedule: 'Mon, Wed', time: '1:00 PM' },
    { name: 'Creative Writing', teacher: 'Mrs. Wilson', schedule: 'Tue, Thu', time: '2:00 PM' },
  ];

  const classItems = classes && classes.length > 0 ? classes : defaultClasses;

  const renderClass = (classItem: any, index: number) => (
    <div key={index} className="class-card">
      <h3 className="class-name font-bold text-lg">{classItem.name}</h3>
      <p className="class-teacher text-muted-foreground">Taught by: {classItem.teacher}</p>
      <p className="class-schedule text-sm text-gray-500">{classItem.schedule}</p>
    </div>
  );
  
  const renderContent = () => {
    if (styleId === 'classes-timetable-style') {
      return (
        <table className="timetable w-full">
          <thead>
            <tr>
              <th>Time</th>
              <th>Class</th>
              <th>Teacher</th>
            </tr>
          </thead>
          <tbody>
            {classItems.map((classItem: any, index: number) => (
              <tr key={index}>
                <td>{classItem.time}</td>
                <td>{classItem.name}</td>
                <td>{classItem.teacher}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    return (
      <div className="classes-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {classItems.map(renderClass)}
      </div>
    )
  }

  return (
    <section className={`classes-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default ClassesSection;