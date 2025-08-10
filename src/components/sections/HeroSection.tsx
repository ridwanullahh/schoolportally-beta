import React from 'react';
import { Section } from '@/types';
import { themeIntegrationService } from '@/services/themeIntegrationService';
import '@/themes/styles/sections/hero-modern.css';
import '@/themes/styles/sections/hero-ultra-modern.css';
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

  // Get the proper CSS class from theme integration service
  const styleClass = themeIntegrationService.getSectionStyleClass('hero', section.styleId || '1');

  // Extract style type for conditional rendering
  const getStyleType = (className: string): string => {
    const parts = className.split('-');
    return parts[parts.length - 1] || 'grid';
  };

  const styleType = getStyleType(styleClass);

  // Note: Brand colors are automatically applied by ThemeSwitcher component
  // No manual CSS property setting needed here

  const renderHeroContent = () => {
    const commonActions = (
      <div className="hero-actions">
        <a href={primaryLink} className="btn-primary">
          {primaryButton}
        </a>
        <a href={secondaryLink} className="btn-secondary">
          {secondaryButton}
        </a>
      </div>
    );

    // Generic content structure that works with all styles
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

    // Return content structure that works with CSS-based styling
    return (
      <div className="hero-container">
        {mainContent}
        {visualContent}
      </div>
    );
  };

  // Handle background image for specific styles
  const sectionStyle = backgroundImage && styleType === 'video-bg'
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
