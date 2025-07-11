import React from 'react';
import { Section } from '@/types';
import { Button } from '@/components/ui/button';

interface ValuePrepositionSectionProps {
  section: Section;
}

const ValuePrepositionSection: React.FC<ValuePrepositionSectionProps> = ({ section }) => {
  const { title, propositions } = section.content;

  const defaultPropositions = [
    { title: 'Holistic Development', description: 'We focus on the academic, social, and emotional growth of every student.' },
    { title: 'Innovative Teaching', description: 'Our educators use modern, engaging methods to inspire a love for learning.' },
    { title: 'Community Focused', description: 'We foster a strong, supportive community of students, parents, and staff.' },
  ];

  const propositionItems = propositions || defaultPropositions;

  return (
    <section className="value-preposition-section py-16 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">{title || 'Our Core Values'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {propositionItems.map((prop: any, index: number) => (
            <div key={index}>
              <h3 className="text-2xl font-semibold mb-4">{prop.title}</h3>
              <p>{prop.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePrepositionSection;