import React, { useState, useEffect, useRef } from 'react';
import { Section } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Check, Star, Users, Award } from 'lucide-react';

interface CtaSectionProps {
  section: Section;
}

const CtaSection: React.FC<CtaSectionProps> = ({ section }) => {
  const { title, description, buttonText, buttonLink, backgroundImage } = section.content;

  // Get the proper CSS class from the new theme system
  const styleClass = `cta-style-${section.styleId?.split('-').pop() || '1'}`;

  // Extract style type for conditional rendering
  const getStyleType = (className: string): string => {
    const parts = className.split('-');
    return parts[parts.length - 1] || 'grid';
  };

  const styleType = getStyleType(styleClass);
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

    // Generic content structure that works with all styles
    return (
      <div className="cta-content">
        {ctaContent}
      </div>
    );
  };

  return (
    <section ref={sectionRef} className={`cta-section ${styleClass} ${isInView ? 'in-view' : ''}`}>
      <div className="container">
        {renderContent()}
      </div>
    </section>
  );
};

export default CtaSection;