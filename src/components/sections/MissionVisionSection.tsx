import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/mission-vision-ultra-modern.css';

interface MissionVisionSectionProps {
  section: Section;
}

const MissionVisionSection: React.FC<MissionVisionSectionProps> = ({ section }) => {
  const { title, mission, vision, sidebar } = section.content;
  const styleId = section.styleId || 'mission-vision-floating-glass';

  const defaultMission = 'To provide exceptional education that empowers students to achieve their full potential, fostering critical thinking, creativity, and character development in a supportive and inclusive learning environment.';
  const defaultVision = 'To be a leading educational institution that inspires lifelong learning, cultivates global citizens, and shapes future leaders who will make positive contributions to society and the world.';

  const renderContent = () => {
    switch (styleId) {
      case 'mission-vision-hexagon-frame':
      case 'mission-vision-circular-frame':
        return (
          <div className="mission-vision-container">
            <div className="mission-block">
              <h3>Our Mission</h3>
              <p>{mission || defaultMission}</p>
            </div>
            <div className="vision-block">
              <h3>Our Vision</h3>
              <p>{vision || defaultVision}</p>
            </div>
          </div>
        );
      case 'mission-vision-minimal-lines':
        return (
          <div className="mission-vision-container">
            <div className="mission-block">
              <h3>Our Mission</h3>
              <p>{mission || defaultMission}</p>
            </div>
            <div className="vision-block">
              <h3>Our Vision</h3>
              <p>{vision || defaultVision}</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="mission-vision-container">
            <div className="mission-block">
              <h3>Our Mission</h3>
              <p>{mission || defaultMission}</p>
            </div>
            <div className="vision-block">
              <h3>Our Vision</h3>
              <p>{vision || defaultVision}</p>
            </div>
          </div>
        );
    }
  }

  return (
    <section className={`mission-vision-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default MissionVisionSection;