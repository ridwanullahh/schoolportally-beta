import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/history-ultra-modern.css';

interface HistorySectionProps {
  section: Section;
}

const HistorySection: React.FC<HistorySectionProps> = ({ section }) => {
  const { title, milestones } = section.content;
  const styleId = section.styleId || 'history-floating-timeline';

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