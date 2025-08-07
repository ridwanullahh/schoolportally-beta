import React from 'react';
import { Section } from '@/types';
import * as Icons from 'lucide-react';
import '@/themes/styles/sections/value-proposition-modern.css';
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

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'value-proposition-modern-grid',
      '2': 'value-proposition-modern-cards',
      '3': 'value-proposition-modern-horizontal',
      '4': 'value-proposition-modern-minimal',
      '5': 'value-proposition-modern-bordered',
      '6': 'value-proposition-modern-hexagon',
      '7': 'value-proposition-modern-gradient',
      '8': 'value-proposition-modern-split',
      '9': 'value-proposition-modern-compact',
      '10': 'value-proposition-modern-asymmetric',
      '11': 'value-proposition-modern-typography',
      // Existing ultra-modern styles (12+)
      '12': 'value-prop-floating-cards',
      '13': 'value-prop-holographic-grid',
      '14': 'value-prop-neon-icons',
      '15': 'value-prop-particle-bg',
      '16': 'value-prop-morphing-cards',
      '17': 'value-prop-cyber-grid',
      '18': 'value-prop-liquid-metal',
      '19': 'value-prop-aurora-bg',
      '20': 'value-prop-matrix-rain',
      '21': 'value-prop-quantum-field',
      '22': 'value-prop-neural-network',
      '23': 'value-prop-hologram-effect',
      '24': 'value-prop-energy-waves',
      '25': 'value-prop-digital-rain',
      '26': 'value-prop-mosaic-layout'
    };
    return styleMap[styleNumber] || 'value-proposition-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');

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