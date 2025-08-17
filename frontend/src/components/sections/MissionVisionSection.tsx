import React, { useState } from 'react';
import { Section } from '@/types';



import { Target, Eye, Heart, Play, Star, Award, Users } from 'lucide-react';

interface MissionVisionSectionProps {
  section: Section;
}

const MissionVisionSection: React.FC<MissionVisionSectionProps> = ({ section }) => {
  const { title, mission, vision, sidebar } = section.content;

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'mission-vision-modern-split',
      '2': 'mission-vision-modern-centered',
      '3': 'mission-vision-modern-vertical',
      '4': 'mission-vision-modern-minimal',
      '5': 'mission-vision-modern-bordered',
      '6': 'mission-vision-modern-gradient',
      '7': 'mission-vision-modern-asymmetric',
      '8': 'mission-vision-modern-typography',
      '9': 'mission-vision-modern-hexagon',
      '10': 'mission-vision-modern-timeline',
      '11': 'mission-vision-modern-compact',
      // Existing ultra-modern styles (12+)
      '12': 'mission-vision-floating-glass',
      '13': 'mission-vision-holographic-cards',
      '14': 'mission-vision-neon-split',
      '15': 'mission-vision-particle-bg',
      '16': 'mission-vision-morphing-cards',
      '17': 'mission-vision-cyber-grid',
      '18': 'mission-vision-liquid-metal',
      '19': 'mission-vision-aurora-bg',
      '20': 'mission-vision-matrix-rain',
      '21': 'mission-vision-quantum-field',
      '22': 'mission-vision-neural-network',
      '23': 'mission-vision-hologram-effect',
      '24': 'mission-vision-energy-waves',
      '25': 'mission-vision-digital-rain',
      '26': 'mission-vision-mosaic-layout'
    };
    return styleMap[styleNumber] || 'mission-vision-modern-split';
  };

  const styleId = getStyleId(section.styleId || '1');

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