import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/programs.css';
import { Button } from '@/components/ui/button';

interface ProgramsSectionProps {
  section: Section;
}

const ProgramsSection: React.FC<ProgramsSectionProps> = ({ section }) => {
  const { title, programs } = section.content;
  const styleId = section.styleId || 'programs-tile-showcase';

  const defaultPrograms = [
    { name: 'Undergraduate Studies', description: 'Explore a wide range of bachelor\'s degree programs.', link: '#' },
    { name: 'Graduate School', description: 'Advance your career with our master\'s and doctoral programs.', link: '#' },
    { name: 'Continuing Education', description: 'Lifelong learning opportunities for professional development.', link: '#' },
  ];

  const programItems = programs && programs.length > 0 ? programs : defaultPrograms;

  const renderProgram = (program: any, index: number) => (
    <div key={index} className="program-card">
      <div className="card-content">
        <h3 className="program-name font-bold text-xl mb-2">{program.name}</h3>
        <p className="program-description text-muted-foreground mb-4">{program.description}</p>
        <Button asChild>
          <a href={program.link}>Learn More</a>
        </Button>
      </div>
    </div>
  );

  return (
    <section className={`programs-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="programs-container">
          {programItems.map(renderProgram)}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;