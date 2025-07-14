import React, { useEffect } from 'react';
import { Section } from '@/types';
import * as Icons from 'lucide-react';
import '@/themes/styles/sections/hero.css';
import '@/themes/styles/sections/hero-styles.css';

interface HeroSectionProps {
  section: Section;
}

const HeroSection: React.FC<HeroSectionProps> = ({ section }) => {
  const {
    title, subtitle, primaryButton, secondaryButton, description,
    primaryLink, secondaryLink, backgroundImage, icon,
    borderColor, framePadding, gridGap, animationDuration,
    shrinkScale, slideDirection, skewAngle,
    cssShapes, glassPanels, threeDBlocks, parallaxLayers
  } = section.content;
  
  const styleId = section.styleId || 'hero-center-stage';

  useEffect(() => {
    if (styleId === 'hero-sticky-topline') {
      const handleScroll = () => {
        const hero = document.querySelector('.hero-sticky-topline');
        if (window.scrollY > 50) {
          hero?.classList.add('scrolled');
        } else {
          hero?.classList.remove('scrolled');
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [styleId]);

  const sectionStyle: React.CSSProperties = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    '--border-color': borderColor,
    '--frame-padding': framePadding,
    '--grid-gap': gridGap,
    '--animation-duration': animationDuration,
    '--shrink-scale': shrinkScale,
    '--skew-angle': skewAngle,
  } as React.CSSProperties;

  // @ts-ignore
  const IconComponent = icon && Icons[icon] ? Icons[icon] : null;

  const renderButtons = () => (
    <div className="flex gap-4 justify-center buttons">
      {primaryButton && <a href={primaryLink || '#'} className={`btn btn-primary heroprimarybutton heroprimarybutton_${styleId}`}>{primaryButton}</a>}
      {secondaryButton && <a href={secondaryLink || '#'} className={`btn btn-secondary herosecondarybutton herosecondarybutton_${styleId}`}>{secondaryButton}</a>}
    </div>
  );

  const renderBaseContent = () => (
    <>
      <h1 className={`heroheadline heroheadline_${styleId}`}>{title || 'Welcome to Our School'}</h1>
      <h2 className={`herosubtext herosubtext_${styleId}`}>{subtitle || 'A place to learn and grow'}</h2>
      <p className={`herodescription herodescription_${styleId}`}>{description || 'Discover a world of knowledge and opportunity.'}</p>
      {renderButtons()}
    </>
  );

  const renderContent = () => {
    switch (styleId) {
      case 'hero-split-columns':
        return (
          <div className="container">
            <div className="text-content">
              {renderBaseContent()}
            </div>
            <div className="icon-area flex justify-center items-center">
              {IconComponent && <IconComponent className={`heroicon_${styleId}`} size={96} />}
            </div>
          </div>
        );
      case 'hero-grid-power':
        return (
          <div className="container">
            <h1 className={`heroheadline heroheadline_${styleId}`}>{title || 'Welcome'}</h1>
            <h2 className={`herosubtext herosubtext_${styleId}`}>{subtitle || 'Subtitle'}</h2>
            <p className={`herodescription herodescription_${styleId}`}>{description || 'Description'}</p>
            <div className="buttons">{renderButtons()}</div>
          </div>
        );
      case 'hero-block-statement':
         return (
          <div className="container">
            <h1 className={`heroheadline heroheadline_${styleId}`}>{title || 'Welcome'}</h1>
            <div>
              <h2 className={`herosubtext herosubtext_${styleId}`}>{subtitle || 'Subtitle'}</h2>
              <p className={`herodescription herodescription_${styleId}`}>{description || 'Description'}</p>
              {renderButtons()}
            </div>
          </div>
        );
      case 'style-1':
        return <div className="container minimalist-clean">{renderBaseContent()}</div>;
      case 'style-2':
        return <div className="container bold-geometric-shapes">{renderBaseContent()}<div>{cssShapes}</div></div>;
      case 'style-3':
        return <div className="container gradient-waves">{renderBaseContent()}</div>;
      case 'style-4':
        return <div className="container split-screen-yin-yang">{renderBaseContent()}</div>;
      case 'style-5':
        return <div className="container floating-card-deck">{renderBaseContent()}</div>;
      case 'style-6':
        return <div className="container animated-dot-matrix">{renderBaseContent()}</div>;
      case 'style-7':
        return <div className="container typography-sculpture">{renderBaseContent()}</div>;
      case 'style-8':
        return <div className="container hexagonal-grid">{renderBaseContent()}</div>;
      case 'style-9':
        return <div className="container circular-orbit">{renderBaseContent()}</div>;
      case 'style-10':
        return <div className="container glass-morphism-stack">{renderBaseContent()}<div>{glassPanels}</div></div>;
      case 'style-11':
        return <div className="container skewed-perspective">{renderBaseContent()}</div>;
      case 'style-12':
        return <div className="container neumorphic-landscape">{renderBaseContent()}</div>;
      case 'style-13':
        return <div className="container magazine-editorial">{renderBaseContent()}</div>;
      case 'style-14':
        return <div className="container liquid-wave-motion">{renderBaseContent()}</div>;
      case 'style-15':
        return <div className="container brutalist-concrete">{renderBaseContent()}</div>;
      case 'style-16':
        return <div className="container neon-cyber-glow">{renderBaseContent()}</div>;
      case 'style-17':
        return <div className="container three-d-isometric-blocks">{renderBaseContent()}<div>{threeDBlocks}</div></div>;
      case 'style-18':
        return <div className="container origami-paper-folds">{renderBaseContent()}</div>;
      case 'style-19':
        return <div className="container particle-burst">{renderBaseContent()}</div>;
      case 'style-20':
        return <div className="container layered-depth-parallax">{renderBaseContent()}<div>{parallaxLayers}</div></div>;
      case 'style-21':
        return <div className="container ribbon-banner-flow">{renderBaseContent()}</div>;
      case 'style-22':
        return <div className="container organic-blob-shapes">{renderBaseContent()}</div>;
      case 'style-23':
        return <div className="container terminal-command-line">{renderBaseContent()}</div>;
      case 'style-24':
        return <div className="container art-deco-geometric">{renderBaseContent()}</div>;
      case 'style-25':
        return <div className="container flowing-line-art">{renderBaseContent()}</div>;
      default:
        return <div className="container">{renderBaseContent()}</div>;
    }
  };

  const slideClassName = slideDirection === 'right' ? 'slide-from-right' : '';

  return (
    <section className={`hero-section ${styleId} ${slideClassName}`} style={sectionStyle}>
      {renderContent()}
    </section>
  );
};

export default HeroSection;