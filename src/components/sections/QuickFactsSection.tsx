import React from 'react';
import { Section, QuickFact } from '@/types';
import * as Icons from 'lucide-react';
import '@/themes/styles/sections/quick-facts-ultra-modern.css';

interface QuickFactsSectionProps {
  section: Section;
}

const QuickFactsSection: React.FC<QuickFactsSectionProps> = ({ section }) => {
  const { title, facts } = section.content;
  const styleId = section.styleId || 'quick-facts-floating-cards';

  const defaultFacts: QuickFact[] = [
    { icon: 'Users', label: 'School Capacity', value: '1,200+', unit: 'students' },
    { icon: 'Users', label: 'Student-Teacher Ratio', value: '15:1', unit: '' },
    { icon: 'GraduationCap', label: 'Graduation Rate', value: '98%', unit: 'annually' },
    { icon: 'Award', label: 'Accreditations', value: '5', unit: 'awards' },
  ];

  const factItems: QuickFact[] = facts && facts.length > 0 ? facts : defaultFacts;

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const IconComponent = iconName && Icons[iconName] ? Icons[iconName] : Icons.Award;
    return <IconComponent className="qf_icon" />;
  };

  const renderFact = (fact: QuickFact, index: number) => {
    const commonContent = (
      <div className="fact-content">
        {getIcon(fact.icon)}
        <div className="qf_value">{fact.value}</div>
        <div className="qf_label">{fact.label}</div>
      </div>
    );

    // Handle special layouts for specific styles
    switch (styleId) {
      case 'quick-facts-circular':
        return (
          <div key={index} className="fact-item">
            <div className="circular-progress" style={{ '--progress': '75%' } as React.CSSProperties}>
              <div className="progress-content">
                <div className="qf_value">{fact.value}</div>
                {getIcon(fact.icon)}
              </div>
            </div>
            <div className="qf_label">{fact.label}</div>
          </div>
        );

      case 'quick-facts-hexagon':
        return (
          <div key={index} className="fact-item">
            <div className="fact-content">
              {getIcon(fact.icon)}
              <div className="qf_value">{fact.value}</div>
              <div className="qf_label">{fact.label}</div>
            </div>
          </div>
        );

      case 'quick-facts-sliding':
        return (
          <div key={index} className="fact-item">
            <div className="fact-front">
              {getIcon(fact.icon)}
              <div className="qf_value">{fact.value}</div>
              <div className="qf_label">{fact.label}</div>
            </div>
            <div className="fact-back">
              {getIcon(fact.icon)}
              <div className="qf_value">{fact.value}</div>
              <div className="qf_label">{fact.label}</div>
            </div>
          </div>
        );

      case 'quick-facts-isometric':
        return (
          <div key={index} className="fact-item">
            <div className="cube-face cube-front">
              {getIcon(fact.icon)}
              <div className="qf_value">{fact.value}</div>
              <div className="qf_label">{fact.label}</div>
            </div>
            <div className="cube-face cube-top"></div>
            <div className="cube-face cube-right"></div>
          </div>
        );

      case 'quick-facts-progress':
        return (
          <div key={index} className="fact-item" style={{ '--progress': '75%' } as React.CSSProperties}>
            <div className="fact-content">
              <div className="fact-left">
                {getIcon(fact.icon)}
                <div className="qf_label">{fact.label}</div>
              </div>
              <div className="qf_value">{fact.value}</div>
            </div>
          </div>
        );

      case 'quick-facts-gradient-orbs':
        return (
          <div key={index} className="fact-item">
            <div className="orb-background"></div>
            <div className="fact-content">
              {getIcon(fact.icon)}
              <div className="qf_value">{fact.value}</div>
              <div className="qf_label">{fact.label}</div>
            </div>
          </div>
        );

      case 'quick-facts-mosaic':
        return (
          <div key={index} className="fact-item">
            <div className="fact-content">
              {getIcon(fact.icon)}
              <div className="qf_value">{fact.value}</div>
              <div className="qf_label">{fact.label}</div>
            </div>
          </div>
        );

      default:
        return (
          <div key={index} className="fact-item">
            {commonContent}
          </div>
        );
    }
  };

  return (
    <section className={`quick-facts-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        <div className="fact-container">
          {factItems.map(renderFact)}
        </div>
      </div>
    </section>
  );
};

export default QuickFactsSection;