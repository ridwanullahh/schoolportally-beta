import React, { useState, useEffect, useRef } from 'react';
import { Section } from '@/types';
import { Button } from '@/components/ui/button';
import '@/themes/styles/sections/cta-ultra-modern.css';

interface CtaSectionProps {
  section: Section;
}

const CtaSection: React.FC<CtaSectionProps> = ({ section }) => {
  const { title, description, buttonText, buttonLink, backgroundImage } = section.content;
  const styleId = section.styleId || 'cta-floating-glass';
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