import React, { useState } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/history-modern.css';
import '@/themes/styles/sections/history-ultra-modern.css';
import '@/themes/styles/sections/history-section-styles.css';
import { Calendar, Award, Users, BookOpen, Clock, Star, TrendingUp } from 'lucide-react';

interface HistorySectionProps {
  section: Section;
}

const HistorySection: React.FC<HistorySectionProps> = ({ section }) => {
  const { title, milestones } = section.content;

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'history-modern-timeline',
      '2': 'history-modern-cards',
      '3': 'history-modern-vertical',
      '4': 'history-modern-minimal',
      '5': 'history-modern-bordered',
      '6': 'history-modern-gradient',
      '7': 'history-modern-compact',
      '8': 'history-modern-asymmetric',
      '9': 'history-modern-typography',
      '10': 'history-modern-split',
      '11': 'history-modern-circular',
      // Existing ultra-modern styles (12+)
      '12': 'history-floating-timeline',
      '13': 'history-holographic-cards',
      '14': 'history-neon-timeline',
      '15': 'history-particle-bg',
      '16': 'history-morphing-cards',
      '17': 'history-cyber-grid',
      '18': 'history-liquid-metal',
      '19': 'history-aurora-bg',
      '20': 'history-matrix-rain',
      '21': 'history-quantum-field',
      '22': 'history-neural-network',
      '23': 'history-hologram-effect',
      '24': 'history-energy-waves',
      '25': 'history-digital-rain',
      '26': 'history-mosaic-layout'
    };
    return styleMap[styleNumber] || 'history-modern-timeline';
  };

  const styleId = getStyleId(section.styleId || '1');

  const defaultMilestones = [
    {
      year: '1950',
      description: 'Founded as a small community school with just 50 students, dedicated to providing quality education in our local community.'
    },
    {
      year: '1975',
      description: 'Expanded to include secondary education and built our first science laboratory, marking a significant milestone in our academic growth.'
    },
    {
      year: '1990',
      description: 'Introduced computer education and established our technology center, embracing the digital revolution in education.'
    },
    {
      year: '2005',
      description: 'Achieved national recognition for academic excellence and innovation, establishing ourselves as a leading educational institution.'
    },
    {
      year: '2020',
      description: 'Adapted to digital learning and launched our comprehensive online education platform, ensuring continuity during challenging times.'
    },
  ];

  const historyItems = milestones && milestones.length > 0 ? milestones : defaultMilestones;
  
  const renderMilestone = (milestone: any, index: number) => {
    switch (styleId) {
      case 'history-circular-timeline':
        return (
          <div key={index} className="milestone">
            <div className="year">{milestone.year}</div>
            <div className="description">{milestone.description}</div>
          </div>
        );
      default:
        return (
          <div key={index} className="milestone">
            <div className="year">{milestone.year}</div>
            <div className="description">{milestone.description}</div>
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (styleId) {
      case 'history-circular-timeline':
        return (
          <div className="history-container">
            <div className="timeline-circle">
              {historyItems.slice(0, 5).map(renderMilestone)}
            </div>
          </div>
        );
      case 'history-sliding-carousel':
        return (
          <div className="history-container">
            <div className="carousel-track">
              {historyItems.map(renderMilestone)}
              {/* Duplicate for seamless loop */}
              {historyItems.map((milestone, index) => renderMilestone(milestone, index + historyItems.length))}
            </div>
          </div>
        );
      default:
        return (
          <div className="history-container">
            {historyItems.map(renderMilestone)}
          </div>
        );
    }
  }

  return (
    <section className={`history-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default HistorySection;