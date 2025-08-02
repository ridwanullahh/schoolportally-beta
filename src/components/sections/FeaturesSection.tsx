import React from 'react';
import { Section } from '@/types';
import * as Icons from 'lucide-react';
import '@/themes/styles/sections/features-ultra-modern.css';

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
  const styleId = section.styleId || 'features-floating-grid';

  const defaultFeatures: Feature[] = [
    { icon: 'Check', title: 'Expert Faculty', description: 'Learn from experienced educators with advanced degrees.' },
    { icon: 'Star', title: 'Modern Facilities', description: 'State-of-the-art classrooms and learning environments.' },
    { icon: 'Zap', title: 'Student Support', description: 'Comprehensive support services for student success.' },
  ];

  const featureItems: Feature[] = features && features.length > 0 ? features : defaultFeatures;

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const IconComponent = iconName && Icons[iconName] ? Icons[iconName] : Icons.Check;
    return <IconComponent className="feature_icon" />;
  };

  const renderFeature = (feature: Feature, index: number) => {
    const commonContent = (
      <div className="feature-content">
        {getIcon(feature.icon)}
        <div className="feature_title">{feature.title}</div>
        <div className="feature_description">{feature.description}</div>
      </div>
    );

    // Handle special layouts for specific styles
    switch (styleId) {
      case 'features-hexagon':
        return (
          <div key={index} className="feature-item">
            <div className="feature-content">
              {getIcon(feature.icon)}
              <div className="feature_title">{feature.title}</div>
              <div className="feature_description">{feature.description}</div>
            </div>
          </div>
        );

      case 'features-sliding':
        return (
          <div key={index} className="feature-item">
            <div className="feature-front">
              {getIcon(feature.icon)}
              <div className="feature_title">{feature.title}</div>
              <div className="feature_description">{feature.description}</div>
            </div>
            <div className="feature-back">
              {getIcon(feature.icon)}
              <div className="feature_title">{feature.title}</div>
              <div className="feature_description">{feature.description}</div>
            </div>
          </div>
        );

      case 'features-neon-glow':
      case 'features-neon-outline':
        return (
          <div key={index} className="feature-item">
            <div className="feature-content">
              {getIcon(feature.icon)}
              <div className="feature_title">{feature.title}</div>
              <div className="feature_description">{feature.description}</div>
            </div>
          </div>
        );

      default:
        return (
          <div key={index} className="feature-item">
            {commonContent}
          </div>
        );
    }
  };

  return (
    <section className={`features-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        <div className="features-container">
          {featureItems.map(renderFeature)}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;