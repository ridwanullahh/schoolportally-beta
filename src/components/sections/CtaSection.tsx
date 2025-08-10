import React, { useState, useEffect, useRef } from 'react';
import { Section } from '@/types';
import { Button } from '@/components/ui/button';
import '@/themes/styles/sections/cta-modern.css';
import '@/themes/styles/sections/cta-ultra-modern.css';
import '@/themes/styles/sections/cta-section-styles.css';
import { ArrowRight, Play, Check, Star, Users, Award } from 'lucide-react';

interface CtaSectionProps {
  section: Section;
}

const CtaSection: React.FC<CtaSectionProps> = ({ section }) => {
  const { title, description, buttonText, buttonLink, backgroundImage } = section.content;

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'cta-modern-centered',
      '2': 'cta-modern-split',
      '3': 'cta-modern-gradient',
      '4': 'cta-modern-card',
      '5': 'cta-modern-bordered',
      '6': 'cta-modern-minimal',
      '7': 'cta-modern-diagonal',
      '8': 'cta-modern-layered',
      '9': 'cta-modern-geometric',
      '10': 'cta-modern-asymmetric',
      '11': 'cta-modern-typography',
      // Existing ultra-modern styles (12+)
      '12': 'cta-floating-glass',
      '13': 'cta-neon-glow',
      '14': 'cta-holographic',
      '15': 'cta-particle-bg',
      '16': 'cta-morphing-blob',
      '17': 'cta-cyber-grid',
      '18': 'cta-liquid-metal',
      '19': 'cta-aurora-bg',
      '20': 'cta-matrix-rain',
      '21': 'cta-quantum-field',
      '22': 'cta-neural-network',
      '23': 'cta-hologram-effect',
      '24': 'cta-energy-waves',
      '25': 'cta-digital-rain',
      '26': 'cta-mosaic-layout'
    };
    return styleMap[styleNumber] || 'cta-modern-centered';
  };

  const styleId = getStyleId(section.styleId || '1');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const renderContent = () => {
    const ctaContent = (
      <>
        {title && <h2 className="cta-title">{title}</h2>}
        {description && <p className="cta-description">{description}</p>}
        {buttonText && buttonLink && (
          <a href={buttonLink} className="cta-button">
            {buttonText}
          </a>
        )}
      </>
    );

    switch (styleId) {
      // New Modern Styles (1-11)
      case 'cta-modern-centered':
      case 'cta-modern-gradient':
      case 'cta-modern-card':
      case 'cta-modern-bordered':
      case 'cta-modern-minimal':
      case 'cta-modern-layered':
      case 'cta-modern-geometric':
      case 'cta-modern-typography':
        return (
          <div className="cta-content">
            {ctaContent}
          </div>
        );

      case 'cta-modern-split':
      case 'cta-modern-diagonal':
        return (
          <div className="cta-content">
            <div className="text-content">
              {title && <h2 className="cta-title">{title}</h2>}
              {description && <p className="cta-description">{description}</p>}
              {buttonText && buttonLink && (
                <a href={buttonLink} className="cta-button">
                  {buttonText}
                </a>
              )}
            </div>
            <div className="visual-content">
              {backgroundImage && (
                <img src={backgroundImage} alt="CTA" className="cta-image" />
              )}
            </div>
          </div>
        );

      case 'cta-modern-asymmetric':
        return (
          <div className="cta-content">
            <div className="text-content">
              {title && <h2 className="cta-title">{title}</h2>}
              {description && <p className="cta-description">{description}</p>}
              {buttonText && buttonLink && (
                <a href={buttonLink} className="cta-button">
                  {buttonText}
                </a>
              )}
            </div>
            <div className="accent-area"></div>
          </div>
        );

      // Existing Ultra-Modern Styles (12+)
      case 'cta-geometric-split':
        return (
          <div className="cta-content">
            <div className="text-content">
              {title && <h2 className="cta-title">{title}</h2>}
              {description && <p className="cta-description">{description}</p>}
            </div>
            <div className="button-content">
              {buttonText && buttonLink && (
                <a href={buttonLink} className="cta-button">
                  {buttonText}
                </a>
              )}
            </div>
          </div>
        );
      case 'cta-mosaic-layout':
        return (
          <div className="cta-content">
            <div className="text-section">
              {title && <h2 className="cta-title">{title}</h2>}
              {description && <p className="cta-description">{description}</p>}
              {buttonText && buttonLink && (
                <a href={buttonLink} className="cta-button">
                  {buttonText}
                </a>
              )}
            </div>
            <div className="accent-section"></div>
          </div>
        );
      default:
        return (
          <div className="cta-content">
            {ctaContent}
          </div>
        );
    }
  };

  return (
    <section ref={sectionRef} className={`cta-section ${styleId} ${isInView ? 'in-view' : ''}`}>
      <div className="container">
        {renderContent()}
      </div>
    </section>
  );
};

export default CtaSection;