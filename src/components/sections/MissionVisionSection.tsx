import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/mission-vision.css';

interface MissionVisionSectionProps {
  section: Section;
}

const MissionVisionSection: React.FC<MissionVisionSectionProps> = ({ section }) => {
  const { title, mission, vision } = section.content;
  const styleId = section.styleId || 'mission_vision-side-by-side';

  return (
    <section className={`mission-vision-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="mission-vision-container">
          <div className="mission-block">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p>{mission || 'To provide a world-class education and foster a love of learning.'}</p>
          </div>
          <div className="vision-block">
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p>{vision || 'To empower students to reach their full potential and become leaders of tomorrow.'}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;