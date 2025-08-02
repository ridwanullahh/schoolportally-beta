import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/hero-ultra-modern.css';

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

  // Use modern style naming convention - 15 available styles
  const styleId = section.styleId || 'hero-floating-glass';

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

    switch (styleId) {
      case 'hero-floating-glass':
        return (
          <div className="glass-container">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>
            <p className="hero-description">{description}</p>
            {commonActions}
          </div>
        );

      case 'hero-split-modern':
        return (
          <>
            <div className="content-side">
              <h1 className="hero-title">{title}</h1>
              <p className="hero-subtitle">{subtitle}</p>
              <p className="hero-description">{description}</p>
              {commonActions}
            </div>
            <div className="visual-side">
              <div className="geometric-pattern"></div>
              {backgroundImage && (
                <img src={backgroundImage} alt="Hero" className="hero-image" />
              )}
            </div>
          </>
        );

      case 'hero-minimal-centered':
        return (
          <div className="content-container">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>
            {commonActions}
          </div>
        );

      case 'hero-gradient-mesh':
        return (
          <div className="content-container">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>
            <p className="hero-description">{description}</p>
            {commonActions}
          </div>
        );

      case 'hero-asymmetric':
        return (
          <>
            <div className="content-area">
              <h1 className="hero-title">{title}</h1>
              <p className="hero-subtitle">{subtitle}</p>
              <p className="hero-description">{description}</p>
              {commonActions}
            </div>
            <div className="visual-area">
              {backgroundImage && (
                <img src={backgroundImage} alt="Hero" className="hero-image" />
              )}
            </div>
          </>
        );

      case 'hero-layered-cards':
        return (
          <div className="cards-container">
            <div className="card-layer">
              <h1 className="hero-title">{title}</h1>
              <p className="hero-subtitle">{subtitle}</p>
              <p className="hero-description">{description}</p>
              {commonActions}
            </div>
          </div>
        );

      case 'hero-diagonal-split':
        return (
          <>
            <div className="diagonal-bg"></div>
            <div className="diagonal-accent"></div>
            <div className="content-wrapper">
              <div className="text-content">
                <h1 className="hero-title">{title}</h1>
                <p className="hero-subtitle">{subtitle}</p>
                <p className="hero-description">{description}</p>
                {commonActions}
              </div>
              <div className="visual-content">
                {backgroundImage && (
                  <img src={backgroundImage} alt="Hero" className="hero-image" />
                )}
              </div>
            </div>
          </>
        );

      case 'hero-neumorphism':
        return (
          <div className="neuro-container">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>
            <p className="hero-description">{description}</p>
            {commonActions}
          </div>
        );

      case 'hero-animated-particles':
        return (
          <>
            <div className="particles-bg"></div>
            <div className="content-container">
              <h1 className="hero-title">{title}</h1>
              <p className="hero-subtitle">{subtitle}</p>
              <p className="hero-description">{description}</p>
              {commonActions}
            </div>
          </>
        );

      case 'hero-typography-focus':
        return (
          <div className="content-container">
            <h1 className="hero-title">
              {title.split(' ').map((word: string, index: number) =>
                index === 0 ? <span key={index} className="highlight">{word}</span> : ` ${word}`
              )}
            </h1>
            <p className="hero-subtitle">{subtitle}</p>
            {commonActions}
          </div>
        );

      case 'hero-geometric-shapes':
        return (
          <>
            <div className="shape-circle"></div>
            <div className="shape-triangle"></div>
            <div className="shape-square"></div>
            <div className="content-container">
              <h1 className="hero-title">{title}</h1>
              <p className="hero-subtitle">{subtitle}</p>
              <p className="hero-description">{description}</p>
              {commonActions}
            </div>
          </>
        );

      case 'hero-video-bg':
        return (
          <>
            <div className="video-overlay"></div>
            <div className="content-container">
              <h1 className="hero-title">{title}</h1>
              <p className="hero-subtitle">{subtitle}</p>
              <p className="hero-description">{description}</p>
              {commonActions}
            </div>
          </>
        );

      case 'hero-parallax-layers':
        return (
          <>
            <div className="parallax-layer layer-1"></div>
            <div className="parallax-layer layer-2"></div>
            <div className="parallax-layer layer-3"></div>
            <div className="content-container">
              <h1 className="hero-title">{title}</h1>
              <p className="hero-subtitle">{subtitle}</p>
              <p className="hero-description">{description}</p>
              {commonActions}
            </div>
          </>
        );

      case 'hero-morphing-blob':
        return (
          <>
            <div className="blob-shape"></div>
            <div className="content-container">
              <h1 className="hero-title">{title}</h1>
              <p className="hero-subtitle">{subtitle}</p>
              <p className="hero-description">{description}</p>
              {commonActions}
            </div>
          </>
        );

      case 'hero-interactive-grid':
        return (
          <>
            {Array.from({ length: 96 }, (_, i) => (
              <div key={i} className="grid-item"></div>
            ))}
            <div className="content-overlay">
              <div className="content-container">
                <h1 className="hero-title">{title}</h1>
                <p className="hero-subtitle">{subtitle}</p>
                <p className="hero-description">{description}</p>
                {commonActions}
              </div>
            </div>
          </>
        );

      default:
        return (
          <div className="glass-container">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>
            <p className="hero-description">{description}</p>
            {commonActions}
          </div>
        );
    }
  };

  // Handle background image for specific styles
  const sectionStyle = backgroundImage && ['hero-video-bg'].includes(styleId)
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  return (
    <section 
      className={`hero-section ${styleId}`}
      style={sectionStyle}
    >
      {renderHeroContent()}
    </section>
  );
};

export default HeroSection;
