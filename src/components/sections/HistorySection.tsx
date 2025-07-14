import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/history.css';

interface HistorySectionProps {
  section: Section;
}

const HistorySection: React.FC<HistorySectionProps> = ({ section }) => {
  const { title, milestones } = section.content;
  const styleId = section.styleId || 'history-timeline-vertical';

  const defaultMilestones = [
    { year: '1990', description: 'The school was founded with a small group of students.', decade: '1990s' },
    { year: '2005', description: 'Opened a new state-of-the-art science wing.', decade: '2000s' },
    { year: '2015', description: 'Celebrated 25 years of excellence in education.', decade: '2010s' },
    { year: '2023', description: 'Launched a new digital learning initiative.', decade: '2020s' },
  ];

  const historyItems = milestones && milestones.length > 0 ? milestones : defaultMilestones;
  
  const renderMilestone = (milestone: any, index: number) => (
    <div key={index} className="milestone">
      <div className="milestone-dot"></div>
      <div className="milestone-content">
        <h3 className="year text-xl font-bold mb-2">{milestone.year}</h3>
        <p className="description text-muted-foreground">{milestone.description}</p>
      </div>
    </div>
  );

  const renderContent = () => {
    if (styleId === 'history-grid-by-decade') {
      const decades = [...new Set(historyItems.map((item: any) => item.decade))];
      return (
        <div>
          {decades.map((decade: any) => (
            <div key={decade} className="decade">
              <h3 className="decade-title">{decade}</h3>
              <div className="milestone-grid">
                {historyItems.filter((item: any) => item.decade === decade).map(renderMilestone)}
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="history-container">
        {historyItems.map(renderMilestone)}
      </div>
    )
  }

  return (
    <section className={`history-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default HistorySection;