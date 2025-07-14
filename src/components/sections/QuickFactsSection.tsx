import React, { useState, useEffect, useRef } from 'react';
import { Section, QuickFact } from '@/types';
import * as Icons from 'lucide-react';
import '@/themes/styles/sections/quick-facts.css';

interface QuickFactsSectionProps {
  section: Section;
}

const QuickFactsSection: React.FC<QuickFactsSectionProps> = ({ section }) => {
  const { title, facts, toggleText } = section.content;
  const styleId = section.styleId || 'quick_facts-fact-strip';
  const [activeGroup, setActiveGroup] = useState('All');
  const factRefs = useRef<(HTMLDivElement | null)[]>([]);

  const defaultFacts: QuickFact[] = [
    { icon: 'Users', label: 'School Capacity', value: '1,200+', unit: 'students' },
    { icon: 'Ratio', label: 'Student-Teacher Ratio', value: '15:1', unit: '' },
    { icon: 'GraduationCap', label: 'Graduation Rate', value: '98%', unit: 'annually' },
    { icon: 'Award', label: 'Accreditations', value: '5', unit: 'awards' },
  ];

  const factItems: QuickFact[] = facts && facts.length > 0 ? facts : defaultFacts;

  useEffect(() => {
    if (styleId === 'quick_facts-dynamic-reveal') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            }
          });
        },
        { threshold: 0.1 }
      );
      factRefs.current.forEach((ref) => ref && observer.observe(ref));
      return () => observer.disconnect();
    }
  }, [styleId, factItems]);

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const IconComponent = iconName && Icons[iconName] ? Icons[iconName] : Icons.Award;
    return <IconComponent className={`w-8 h-8 text-primary qf_icon qf_icon_${styleId}`} />;
  };

  const renderFact = (fact: QuickFact, index: number) => {
    const factContent = (
      <>
        <div className="mb-4 flex justify-center">{getIcon(fact.icon)}</div>
        <h3 className={`text-3xl font-bold qf_value qf_value_${styleId}`}>{fact.value}</h3>
        <p className={`text-muted-foreground qf_label qf_label_${styleId}`}>{fact.label}</p>
      </>
    );

    switch (styleId) {
      case 'quick_facts-fact-accordion':
        return (
          <details key={index} className="fact-item">
            <summary className={`qf_label_${styleId}`}>{fact.label}</summary>
            <div className="p-4">
              <h3 className={`text-2xl font-bold qf_value_${styleId}`}>{fact.value}</h3>
            </div>
          </details>
        );
      case 'quick_facts-badge-numbers':
        return (
          <div key={index} className="fact-item">
            <span className={`value qf_value_${styleId}`}>{fact.value}</span>
            <div className={`label qf_label_${styleId}`}>{fact.label}</div>
            <div className={`unit qf_unit_${styleId}`}>{fact.unit}</div>
          </div>
        );
      case 'quick_facts-line-graph-style':
        return (
          <div key={index} className="fact-item" style={{ left: `${(index + 1) * 20}%`, bottom: `${fact.graphPoint || 0}%` }}>
            <div className="fact-content">
              <h3 className={`text-xl font-bold qf_value_${styleId}`}>{fact.value}</h3>
              <p className={`text-sm qf_label_${styleId}`}>{fact.label}</p>
            </div>
          </div>
        );
      case 'quick_facts-skewed-boxes':
        return (
            <div key={index} className="fact-item">
                <div className="fact-content">{factContent}</div>
            </div>
        );
      default:
        return (
          <div key={index} ref={el => factRefs.current[index] = el} className={`fact-item p-4 text-center ${styleId === 'quick_facts-toggle-grid' && (activeGroup === 'All' || fact.group === activeGroup) ? 'active' : ''}`}>
            {factContent}
          </div>
        );
    }
  };

  const factGroups = ['All', ...Array.from(new Set(factItems.map(f => f.group || 'Other')))];

  return (
    <section className={`quick-facts-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>}
        {styleId === 'quick_facts-toggle-grid' && (
          <div className="toggle-buttons">
            {factGroups.map(group => (
              <button key={group} onClick={() => setActiveGroup(group)} className={activeGroup === group ? 'active' : ''}>
                {group}
              </button>
            ))}
          </div>
        )}
        <div className="fact-container">
          {factItems.map(renderFact)}
        </div>
      </div>
    </section>
  );
};

export default QuickFactsSection;