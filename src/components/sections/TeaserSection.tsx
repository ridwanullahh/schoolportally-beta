
import React, { useState, useEffect, useRef } from 'react';
import { Section } from '@/types';
import * as Icons from 'lucide-react';
import '@/themes/styles/sections/teaser.css';
import { Button } from '@/components/ui/button';

interface TeaserSectionProps {
  section: Section;
}

const TeaserSection: React.FC<TeaserSectionProps> = ({ section }) => {
  const { title, description, buttonText, buttonLink, icon, flippedContent, collapsedHeight } = section.content;
  const styleId = section.styleId || 'teaser-banner-strip';
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // @ts-ignore
  const IconComponent = icon && Icons[icon] ? Icons[icon] : Icons.Megaphone;
  
  useEffect(() => {
    if (styleId === 'teaser-focus-overlay') {
      const observer = new IntersectionObserver(
        ([entry]) => setIsInView(entry.isIntersecting),
        { threshold: 0.5 }
      );
      if (sectionRef.current) observer.observe(sectionRef.current);
      return () => observer.disconnect();
    }
  }, [styleId]);

  const renderContent = () => {
    const baseContent = (
      <>
        <h3 className={`text-2xl font-bold teaser_title_${styleId}`}>{title || 'This is a teaser title'}</h3>
        <p className={`teaser_desc_${styleId}`}>{description || 'And a short, compelling description to go with it.'}</p>
        {buttonText && (
          <Button asChild className={`mt-4 teaser_btn_${styleId}`}>
            <a href={buttonLink || '#'}>{buttonText}</a>
          </Button>
        )}
      </>
    );

    switch (styleId) {
      case 'teaser-flip-panel':
        return (
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">{baseContent}</div>
              <div className="flip-card-back">
                <p>{flippedContent || 'More details on the flip side!'}</p>
              </div>
            </div>
          </div>
        );
      case 'teaser-collapsible-card':
        return (
          <div className="collapsible-container">
            <div className={`collapsible-content ${isExpanded ? 'expanded' : ''}`} style={{ '--collapsed-height': collapsedHeight || '50px' } as React.CSSProperties}>
              {baseContent}
            </div>
            <Button onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? 'Show Less' : 'Show More'}</Button>
          </div>
        );
      case 'teaser-inline-icons':
        return (
          <div className="container">
            <IconComponent className={`w-8 h-8 text-primary icon teaser_icon_${styleId}`} />
            <div className="text-content">{baseContent}</div>
          </div>
        );
      case 'teaser-dotline-cta':
         return (
            <div className="container">
                <h3 className={`text-2xl font-bold teaser_title_${styleId}`}>{title || 'This is a teaser title'}</h3>
                <p className={`teaser_desc_${styleId}`}>{description || 'And a short, compelling description to go with it.'}</p>
                {buttonText && <a href={buttonLink || '#'} className={`button-link teaser_btn_link_${styleId}`}>{buttonText}</a>}
            </div>
         );
      default:
        return <div className="container">{baseContent}</div>;
    }
  };

  return (
    <section ref={sectionRef} className={`teaser-section py-8 ${styleId} ${isInView ? 'in-view' : ''}`}>
      {renderContent()}
    </section>
  );
};

export default TeaserSection;