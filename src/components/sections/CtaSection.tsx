import React, { useState, useEffect, useRef } from 'react';
import { Section } from '@/types';
import { Button } from '@/components/ui/button';
import '@/themes/styles/sections/cta.css';

interface CtaSectionProps {
  section: Section;
}

const CtaSection: React.FC<CtaSectionProps> = ({ section }) => {
  const { title, description, buttonText, buttonLink, backgroundImage } = section.content;
  const styleId = section.styleId || 'cta-banner-strip';
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

  const content = (
    <>
      <div className="text-content">
        <h2 className="text-3xl font-bold mb-4">{title || 'Take the Next Step'}</h2>
        <p className="mb-8 max-w-2xl mx-auto">{description || 'Join our community and start your journey today.'}</p>
      </div>
      <div className="button-container">
        <Button asChild size="lg">
          <a href={buttonLink || '#'}>{buttonText || 'Get Started'}</a>
        </Button>
      </div>
    </>
  );

  if (styleId === 'cta-toggle-display') {
    return (
      <section ref={sectionRef} className={`cta-section py-12 ${styleId} ${isExpanded ? 'expanded' : ''}`}>
        <div className="container mx-auto px-4 cta-content">
          {isExpanded && content}
          <Button onClick={() => setIsExpanded(!isExpanded)} className="toggle-button">
            {isExpanded ? 'Hide' : 'Show'}
          </Button>
        </div>
      </section>
    );
  }
  
  if (styleId === 'cta-layered-cta') {
    return (
        <section ref={sectionRef} className={`cta-section py-20 ${styleId}`}>
            <div className="cta-background" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
            <div className="cta-overlay"></div>
            <div className="container mx-auto px-4 cta-content relative z-10">{content}</div>
        </section>
    )
  }

  return (
    <section ref={sectionRef} className={`cta-section py-12 ${styleId} ${isInView ? 'in-view' : ''}`}>
      <div className="container mx-auto px-4 cta-content">
        {content}
      </div>
    </section>
  );
};

export default CtaSection;