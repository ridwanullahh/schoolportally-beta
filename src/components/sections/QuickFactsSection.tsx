import React from 'react';
import { Section } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Users, GraduationCap, Ratio, Award } from 'lucide-react';
import '@/themes/styles/sections/quick-facts.css';

interface QuickFactsSectionProps {
  section: Section;
}

const QuickFactsSection: React.FC<QuickFactsSectionProps> = ({ section }) => {
  const { title, facts } = section.content;
  const styleId = section.styleId || 'quick_facts-fact-strip';

  const defaultFacts = [
    { icon: 'Users', label: 'School Capacity', value: '1,200+' },
    { icon: 'Ratio', label: 'Student-Teacher Ratio', value: '15:1' },
    { icon: 'GraduationCap', label: 'Graduation Rate', value: '98%' },
    { icon: 'Award', label: 'Accreditations', value: 'Fully Accredited' },
  ];

  const factItems = facts && facts.length > 0 ? facts : defaultFacts;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return <Users className="w-8 h-8 text-primary" />;
      case 'Ratio': return <Ratio className="w-8 h-8 text-primary" />;
      case 'GraduationCap': return <GraduationCap className="w-8 h-8 text-primary" />;
      case 'Award': return <Award className="w-8 h-8 text-primary" />;
      default: return null;
    }
  };

  const renderFact = (fact: any, index: number) => {
    // Specific rendering logic for different styles can be added here if needed
    return (
      <div key={index} className="fact-item p-4 text-center">
        <div className="mb-4 flex justify-center">{getIcon(fact.icon)}</div>
        <h3 className="text-3xl font-bold">{fact.value}</h3>
        <p className="text-muted-foreground">{fact.label}</p>
      </div>
    );
  };
  
  return (
    <section className={`quick-facts-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>}
        <div className="fact-container">
            {factItems.map(renderFact)}
        </div>
      </div>
    </section>
  );
};

export default QuickFactsSection;