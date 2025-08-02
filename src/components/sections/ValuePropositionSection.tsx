import React from 'react';
import { Section } from '@/types';
import * as Icons from 'lucide-react';
import '@/themes/styles/sections/value-proposition-ultra-modern.css';

interface ValueProposition {
  icon: string;
  title: string;
  description: string;
  tabName?: string;
  comparisonValues?: string[];
}

interface ValuePropositionSectionProps {
  section: Section;
}

const ValuePropositionSection: React.FC<ValuePropositionSectionProps> = ({ section }) => {
  const { title, propositions } = section.content;
  const styleId = section.styleId || 'value-prop-floating-cards';

  const defaultPropositions: ValueProposition[] = [
    { icon: 'CheckCircle', title: 'Expert Faculty', description: 'Learn from the best in the field with our experienced educators.' },
    { icon: 'BookOpen', title: 'Rich Curriculum', description: 'A comprehensive curriculum that challenges and inspires students.' },
    { icon: 'Users', title: 'Vibrant Community', description: 'Join a diverse and supportive student body that fosters growth.' },
  ];

  const propItems: ValueProposition[] = propositions && propositions.length > 0 ? propositions : defaultPropositions;

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const IconComponent = iconName && Icons[iconName] ? Icons[iconName] : Icons.CheckCircle;
    return <IconComponent className="vp_icon" />;
  };

  const renderProposition = (prop: ValueProposition, index: number) => {
    const commonContent = (
      <div className="proposition-content">
        {getIcon(prop.icon)}
        <div className="vp_title">{prop.title}</div>
        <div className="vp_description">{prop.description}</div>
      </div>
    );

    // Handle special layouts for specific styles
    switch (styleId) {
      case 'value-prop-minimal-timeline':
        return (
          <div key={index} className="proposition-item">
            <div className="timeline-marker">
              {getIcon(prop.icon)}
            </div>
            <div className="proposition-content">
              <div className="vp_title">{prop.title}</div>
              <div className="vp_description">{prop.description}</div>
            </div>
          </div>
        );

      case 'value-prop-split-showcase':
        return (
          <div key={index} className="proposition-item">
            {getIcon(prop.icon)}
            <div>
              <div className="vp_title">{prop.title}</div>
              <div className="vp_description">{prop.description}</div>
            </div>
          </div>
        );

      case 'value-prop-hexagon':
        return (
          <div key={index} className="proposition-item">
            <div className="proposition-content">
              {getIcon(prop.icon)}
              <div className="vp_title">{prop.title}</div>
              <div className="vp_description">{prop.description}</div>
            </div>
          </div>
        );

      case 'value-prop-sliding':
        return (
          <div key={index} className="proposition-item">
            <div className="proposition-front">
              {getIcon(prop.icon)}
              <div className="vp_title">{prop.title}</div>
              <div className="vp_description">{prop.description}</div>
            </div>
            <div className="proposition-back">
              {getIcon(prop.icon)}
              <div className="vp_title">{prop.title}</div>
              <div className="vp_description">{prop.description}</div>
            </div>
          </div>
        );

      case 'value-prop-isometric':
        return (
          <div key={index} className="proposition-item">
            <div className="cube-face cube-front">
              {getIcon(prop.icon)}
              <div className="vp_title">{prop.title}</div>
              <div className="vp_description">{prop.description}</div>
            </div>
            <div className="cube-face cube-top"></div>
            <div className="cube-face cube-right"></div>
          </div>
        );

      case 'value-prop-gradient-orbs':
        return (
          <div key={index} className="proposition-item">
            <div className="orb-background"></div>
            <div className="proposition-content">
              {getIcon(prop.icon)}
              <div className="vp_title">{prop.title}</div>
              <div className="vp_description">{prop.description}</div>
            </div>
          </div>
        );

      case 'value-prop-mosaic':
        return (
          <div key={index} className="proposition-item">
            <div className="proposition-content">
              {getIcon(prop.icon)}
              <div className="vp_title">{prop.title}</div>
              <div className="vp_description">{prop.description}</div>
            </div>
          </div>
        );

      case 'value-prop-neon-glow':
      case 'value-prop-neon-outline':
      case 'value-prop-gradient-mesh':
      case 'value-prop-paper-stack':
      case 'value-prop-holographic':
      case 'value-prop-liquid':
        return (
          <div key={index} className="proposition-item">
            <div className="proposition-content">
              {getIcon(prop.icon)}
              <div className="vp_title">{prop.title}</div>
              <div className="vp_description">{prop.description}</div>
            </div>
          </div>
        );

      default:
        return (
          <div key={index} className="proposition-item">
            {commonContent}
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (styleId) {
      case 'value-prop-split-showcase':
        return (
          <>
            <div className="content-side">
              {title && <h2 className="section-title">{title}</h2>}
              <div className="propositions-container">
                {propItems.map(renderProposition)}
              </div>
            </div>
            <div className="visual-side"></div>
          </>
        );

      case 'value-prop-asymmetric':
        return (
          <>
            {title && <h2 className="section-title">{title}</h2>}
            <div className="propositions-container">
              {propItems.map(renderProposition)}
            </div>
          </>
        );

      default:
        return (
          <>
            {title && <h2 className="section-title">{title}</h2>}
            <div className="propositions-container">
              {propItems.map(renderProposition)}
            </div>
          </>
        );
    }
  };

  return (
    <section className={`value-proposition-section ${styleId}`}>
      <div className="container">
        {renderContent()}
      </div>
    </section>
  );
};

export default ValuePropositionSection;