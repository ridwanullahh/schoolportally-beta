import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/faculty.css';

interface FacultySectionProps {
  section: Section;
}

const FacultySection: React.FC<FacultySectionProps> = ({ section }) => {
  const { title, faculty } = section.content;
  const styleId = section.styleId || 'faculty-card-collection';

  const defaultFaculty = [
    { name: 'Dr. Alan Grant', department: 'Paleontology', image: 'https://via.placeholder.com/120' },
    { name: 'Ms. Sarah Connor', department: 'Computer Science', image: 'https://via.placeholder.com/120' },
    { name: 'Mr. Indiana Jones', department: 'Archaeology', image: 'https://via.placeholder.com/120' },
    { name: 'Dr. Ellie Sattler', department: 'Paleobotany', image: 'https://via.placeholder.com/120' },
  ];

  const facultyMembers = faculty && faculty.length > 0 ? faculty : defaultFaculty;

  const renderMember = (member: any, index: number) => (
    <div key={index} className="faculty-card">
      <img src={member.image} alt={member.name} className="faculty-image" />
      <h3 className="faculty-name font-bold text-lg">{member.name}</h3>
      <p className="faculty-department text-muted-foreground">{member.department}</p>
    </div>
  );

  return (
    <section className={`faculty-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="faculty-container">
          {facultyMembers.map(renderMember)}
        </div>
      </div>
    </section>
  );
};

export default FacultySection;