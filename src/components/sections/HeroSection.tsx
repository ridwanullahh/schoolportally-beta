import React from 'react';
import { Section } from '@/types';
import { ArrowRight, Play } from 'lucide-react';
import { normalizeStyleId } from '@/utils/sectionStyleUtils';
import '@/themes/styles/sections/hero-section-styles.css';

interface HeroSectionProps {
  section: Section;
}

const HeroSection: React.FC<HeroSectionProps> = ({ section }) => {
  const {
    title = 'Welcome to Our School',
    subtitle = 'Excellence in Education',
    primaryButton = 'Apply Now',
    secondaryButton = 'Learn More',
    description = 'Discover a world of knowledge and opportunity in our nurturing educational environment.',
    primaryLink = '#apply',
    secondaryLink = '#about',
    backgroundImage
  } = section.content;

  // Get the normalized style ID and create CSS class
  const styleId = normalizeStyleId(section.styleId);
  const styleClass = `hero-style-${styleId}`;

  // Determine if this is a split layout style
  const isSplitLayout = ['2', '7', '10'].includes(styleId);
  const isVideoBackground = ['4'].includes(styleId);

  const renderHeroContent = () => {
    const commonActions = (
      <div className="hero-actions">
        <a href={primaryLink} className="btn-primary">
          {primaryButton}
          <ArrowRight size={16} />
        </a>
        <a href={secondaryLink} className="btn-secondary">
          {secondaryButton}
          {isVideoBackground && <Play size={16} />}
        </a>
      </div>
    );

    const mainContent = (
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        <p className="hero-description">{description}</p>
        {commonActions}
      </div>
    );

    const visualContent = backgroundImage && (
      <div className="hero-visual">
        <img src={backgroundImage} alt="Hero" className="hero-image" />
      </div>
    );

    return (
      <div className="hero-container">
        {mainContent}
        {visualContent}
      </div>
    );
  };

  // Handle background image for video background style
  const sectionStyle = backgroundImage && isVideoBackground
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  return (
    <section
      className={`hero-section ${styleClass}`}
      style={sectionStyle}
    >
      {renderHeroContent()}
    </section>
  );
};

export default HeroSection;
