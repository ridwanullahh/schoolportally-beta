import React from 'react';
import { Section } from '@/types';
import * as Icons from 'lucide-react';
import { normalizeStyleId } from '@/utils/sectionStyleUtils';


interface Feature {
  icon: string;
  title: string;
  description: string;
  tabName?: string;
}

interface FeaturesSectionProps {
  section: Section;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ section }) => {
  const { title, features } = section.content;

  // Get the normalized style ID and create CSS class
  const styleId = normalizeStyleId(section.styleId);
  const sectionClass = `features-section features-style-${styleId}`;

  const defaultFeatures: Feature[] = [
    { icon: 'Check', title: 'Expert Faculty', description: 'Learn from experienced educators with advanced degrees.' },
    { icon: 'Star', title: 'Modern Facilities', description: 'State-of-the-art classrooms and learning environments.' },
    { icon: 'Zap', title: 'Student Support', description: 'Comprehensive support services for student success.' },
  ];

  const featureItems: Feature[] = features && features.length > 0 ? features : defaultFeatures;

  const renderFeature = (feature: Feature, index: number) => {
    const IconComponent = Icons[feature.icon as keyof typeof Icons] as React.ComponentType<any>;

    return (
      <div key={index} className="feature-card">
        <div className="feature-icon">
          {IconComponent && <IconComponent size={48} />}
        </div>
        <div className="feature-content">
          <h3 className="feature-title">{feature.title}</h3>
          <p className="feature-description">{feature.description}</p>
        </div>
      </div>
    );
  };

  return (
    <section className={sectionClass}>
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">{title}</h2>
          {section.content.subtitle && (
            <p className="features-subtitle">{section.content.subtitle}</p>
          )}
        </div>
        <div className="features-grid">
          {featureItems.map(renderFeature)}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;