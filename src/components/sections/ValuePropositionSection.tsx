import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/value-proposition.css';
import { CheckCircle } from 'lucide-react';

interface ValuePropositionSectionProps {
  section: Section;
}

const ValuePropositionSection: React.FC<ValuePropositionSectionProps> = ({ section }) => {
  const { title, propositions } = section.content;
  const styleId = section.styleId || 'value_prop-tri-blocks';

  const defaultPropositions = [
    { icon: 'CheckCircle', title: 'Expert Faculty', description: 'Learn from the best in the field.' },
    { icon: 'CheckCircle', title: 'State-of-the-Art Facilities', description: 'Access top-tier resources and labs.' },
    { icon: 'CheckCircle', title: 'Career-Focused Curriculum', description: 'Gain skills that are in demand.' },
  ];

  const propItems = propositions && propositions.length > 0 ? propositions : defaultPropositions;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle': return <CheckCircle className="w-8 h-8 text-primary" />;
      default: return <CheckCircle className="w-8 h-8 text-primary" />;
    }
  };
  
  const renderProposition = (prop: any, index: number) => {
    return (
      <div key={index} className="prop-block p-4">
        <div className="flex justify-center mb-4">{getIcon(prop.icon)}</div>
        <h3 className="text-xl font-bold mb-2">{prop.title}</h3>
        <p className="text-muted-foreground">{prop.description}</p>
      </div>
    );
  };

  return (
    <section className={`value-proposition-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="proposition-container">
          {propItems.map(renderProposition)}
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;