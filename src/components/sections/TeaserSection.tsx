
import React, { useState, useEffect, useRef } from 'react';
import { Section } from '@/types';
import * as Icons from 'lucide-react';
import '@/themes/styles/sections/teaser-modern.css';
import '@/themes/styles/sections/teaser.css';
import '@/themes/styles/sections/teaser-section-styles.css';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, User, Search, Filter, Tag } from 'lucide-react';

interface TeaserSectionProps {
  section: Section;
}

const TeaserSection: React.FC<TeaserSectionProps> = ({ section }) => {
  const { title, description, buttonText, buttonLink, icon, flippedContent, collapsedHeight } = section.content;

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'teaser-modern-banner',
      '2': 'teaser-modern-card',
      '3': 'teaser-modern-split',
      '4': 'teaser-modern-minimal',
      '5': 'teaser-modern-bordered',
      '6': 'teaser-modern-gradient',
      '7': 'teaser-modern-compact',
      '8': 'teaser-modern-asymmetric',
      '9': 'teaser-modern-typography',
      '10': 'teaser-modern-floating',
      '11': 'teaser-modern-interactive',
      // Existing styles (12+)
      '12': 'teaser-banner-strip',
      '13': 'teaser-floating-card',
      '14': 'teaser-split-content',
      '15': 'teaser-minimal-text',
      '16': 'teaser-gradient-bg',
      '17': 'teaser-bordered-box',
      '18': 'teaser-icon-focus',
      '19': 'teaser-call-to-action',
      '20': 'teaser-expandable',
      '21': 'teaser-flip-card',
      '22': 'teaser-animated-bg',
      '23': 'teaser-parallax',
      '24': 'teaser-video-bg',
      '25': 'teaser-countdown',
      '26': 'teaser-interactive'
    };
    return styleMap[styleNumber] || 'teaser-modern-banner';
  };

  const styleId = getStyleId(section.styleId || '1');
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