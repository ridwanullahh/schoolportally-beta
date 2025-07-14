import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/mission-vision.css';

interface MissionVisionSectionProps {
  section: Section;
}

const MissionVisionSection: React.FC<MissionVisionSectionProps> = ({ section }) => {
  const { title, mission, vision, sidebar } = section.content;
  const styleId = section.styleId || 'mission_vision-side-by-side';

  const renderContent = () => {
    if (styleId === 'mission_vision-sticky-sidebar') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="sidebar col-span-1">
            <div className="sticky top-24 p-4 border rounded-lg">
              <h4 className="font-bold text-lg mb-4">At a Glance</h4>
              <div dangerouslySetInnerHTML={{ __html: sidebar || ''}} />
            </div>
          </div>
          <div className="main-content col-span-2">
            <div className="mission-block mb-8">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p>{mission || 'To provide a world-class education and foster a love of learning.'}</p>
            </div>
            <div className="vision-block">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p>{vision || 'To empower students to reach their full potential and become leaders of tomorrow.'}</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="mission-vision-container grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="mission-block">
          <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
          <p>{mission || 'To provide a world-class education and foster a love of learning.'}</p>
        </div>
        <div className="vision-block">
          <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
          <p>{vision || 'To empower students to reach their full potential and become leaders of tomorrow.'}</p>
        </div>
      </div>
    )
  }

  return (
    <section className={`mission-vision-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default MissionVisionSection;