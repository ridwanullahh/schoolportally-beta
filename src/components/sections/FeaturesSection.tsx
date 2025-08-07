import React from 'react';
import { Section } from '@/types';
import * as Icons from 'lucide-react';
import '@/themes/styles/sections/features-modern.css';
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

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'features-modern-grid',
      '2': 'features-modern-cards',
      '3': 'features-modern-horizontal',
      '4': 'features-modern-staggered',
      '5': 'features-modern-minimal',
      '6': 'features-modern-bordered',
      '7': 'features-modern-gradient',
      '8': 'features-modern-icon-focus',
      '9': 'features-modern-split',
      '10': 'features-modern-compact',
      '11': 'features-modern-asymmetric',
      // Existing ultra-modern styles (12+)
      '12': 'features-floating-grid',
      '13': 'features-glass-cards',
      '14': 'features-neon-glow',
      '15': 'features-morphing',
      '16': 'features-hexagon',
      '17': 'features-sliding',
      '18': 'features-particle-bg',
      '19': 'features-holographic',
      '20': 'features-neon-outline',
      '21': 'features-cyber-grid',
      '22': 'features-liquid-morph',
      '23': 'features-aurora-bg',
      '24': 'features-matrix-rain',
      '25': 'features-quantum-cards',
      '26': 'features-neural-network'
    };
    return styleMap[styleNumber] || 'features-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');

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
      // New Modern Styles (1-11) - Most use default layout
      case 'features-modern-grid':
      case 'features-modern-cards':
      case 'features-modern-horizontal':
      case 'features-modern-staggered':
      case 'features-modern-minimal':
      case 'features-modern-bordered':
      case 'features-modern-compact':
      case 'features-modern-asymmetric':
        return (
          <div key={index} className="feature-item">
            {commonContent}
          </div>
        );

      case 'features-modern-gradient':
      case 'features-modern-icon-focus':
        return (
          <div key={index} className="feature-item">
            <div className="feature-content">
              {getIcon(feature.icon)}
              <div className="feature_title">{feature.title}</div>
              <div className="feature_description">{feature.description}</div>
            </div>
          </div>
        );

      case 'features-modern-split':
        return (
          <div key={index} className="feature-item">
            {getIcon(feature.icon)}
            <div className="feature-text">
              <div className="feature_title">{feature.title}</div>
              <div className="feature_description">{feature.description}</div>
            </div>
          </div>
        );

      // Existing Ultra-Modern Styles (12+)
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