
import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import * as Icons from 'lucide-react';
import '@/themes/styles/sections/value-proposition.css';

interface ValuePropositionSectionProps {
  section: Section;
}

const ValuePropositionSection: React.FC<ValuePropositionSectionProps> = ({ section }) => {
  const { title, propositions, comparisonHeaders } = section.content;
  const styleId = section.styleId || 'value_prop-tri-blocks';
  const [activeTab, setActiveTab] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const defaultPropositions = [
    { icon: 'CheckCircle', title: 'Expert Faculty', description: 'Learn from the best in the field.', tabName: 'Faculty' },
    { icon: 'BookOpen', title: 'Rich Curriculum', description: 'A curriculum that challenges and inspires.', tabName: 'Curriculum' },
    { icon: 'Users', title: 'Vibrant Community', description: 'A diverse and supportive student body.', tabName: 'Community' },
  ];

  const propItems = propositions && propositions.length > 0 ? propositions : defaultPropositions;

  useEffect(() => {
    if (styleId === 'value_prop-dynamic-slide-block') {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % propItems.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [styleId, propItems.length]);
  
  const getIcon = (iconName: string) => {
    // @ts-ignore
    const IconComponent = iconName && Icons[iconName] ? Icons[iconName] : Icons.CheckCircle;
    return <IconComponent className={`w-8 h-8 text-primary vp_icon vp_icon_${styleId}`} />;
  };

  const renderProposition = (prop: any, index: number) => {
    const propContent = (
      <>
        <div className="flex justify-center mb-4">{getIcon(prop.icon)}</div>
        <h3 className={`text-xl font-bold mb-2 vp_prop_title_${styleId}`}>{prop.title}</h3>
        <p className={`text-muted-foreground vp_prop_desc_${styleId}`}>{prop.description}</p>
      </>
    );

    switch (styleId) {
      case 'value_prop-flowchart':
      case 'value_prop-emphasis-steps':
        return <div key={index} className="prop-item">{propContent}</div>;
      case 'value_prop-timeline-line':
        return (
          <div key={index} className="prop-item">
            <div className="date">{prop.timelineDate}</div>
            {propContent}
          </div>
        );
       case 'value_prop-icon-punch':
         return (
            <div key={index} className="prop-item flex items-start gap-4">
                <div className="icon">{getIcon(prop.icon)}</div>
                <div>
                    <h3 className={`text-xl font-bold mb-2 vp_prop_title_${styleId}`}>{prop.title}</h3>
                    <p className={`text-muted-foreground vp_prop_desc_${styleId}`}>{prop.description}</p>
                </div>
            </div>
        )
      default:
        return <div key={index} className="prop-item p-4 text-center">{propContent}</div>;
    }
  };

  const renderContainer = () => {
    switch (styleId) {
      case 'value_prop-comparison-table':
        return (
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                {(comparisonHeaders || ['Our School', 'Others']).map((h: string, i: number) => <th key={i}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {propItems.map((prop, i) => (
                <tr key={i}>
                  <td>{prop.title}</td>
                  {(prop.comparisonValues || ['Yes', 'No']).map((v: string, j: number) => <td key={j}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'value_prop-tab-switch':
        return (
          <div>
            <div className="tab-buttons">
              {propItems.map((prop, index) => (
                <button key={index} onClick={() => setActiveTab(index)} className={activeTab === index ? 'active' : ''}>
                  {prop.tabName || `Tab ${index + 1}`}
                </button>
              ))}
            </div>
            <div className="tab-content">
              {propItems.map((prop, index) => (
                <div key={index} className={`prop-item ${activeTab === index ? 'active' : ''}`}>
                  {renderProposition(prop, index)}
                </div>
              ))}
            </div>
          </div>
        );
        case 'value_prop-dynamic-slide-block':
            return (
              <div className="proposition-container">
                {propItems.map((prop, index) => (
                  <div key={index} className={`prop-item ${index === activeSlide ? 'active' : (index < activeSlide ? 'prev' : 'next')}`}>
                    {renderProposition(prop, index)}
                  </div>
                ))}
                <div className="slide-controls">
                    {propItems.map((_, index) => (
                        <button key={index} onClick={() => setActiveSlide(index)} className={index === activeSlide ? 'active' : ''} />
                    ))}
                </div>
              </div>
            );
      default:
        return (
          <div className="proposition-container">
            {propItems.map(renderProposition)}
          </div>
        );
    }
  };

  return (
    <section className={`value-proposition-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContainer()}
      </div>
    </section>
  );
};

export default ValuePropositionSection;