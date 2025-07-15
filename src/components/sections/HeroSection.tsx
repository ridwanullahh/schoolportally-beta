import React, { useEffect } from 'react';
import { Section } from '@/types';
import { useSchool } from '@/contexts/SchoolContext';
import '@/themes/styles/sections/hero.css';

interface HeroSectionProps {
  section: Section;
}

const HeroSection: React.FC<HeroSectionProps> = ({ section }) => {
  const { school } = useSchool();
  const {
    title = 'Welcome to Our School',
    subtitle = 'A place to learn and grow',
    primaryButton = 'Get Started',
    secondaryButton = 'Learn More',
    description = 'Discover a world of knowledge and opportunity.',
    primaryLink = '#',
    secondaryLink = '#',
    backgroundImage
  } = section.content;

  const styleId = section.styleId || 'hero-center-stage';

  useEffect(() => {
    // Dark mode detection
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (event.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });

    // Sticky scroll effect for hero-sticky-topline
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

  // Dynamic CSS variables from school branding
  const sectionStyle: React.CSSProperties = {
    '--primary-green': school?.branding?.primaryColor || '#2d7d32',
    '--secondary-green': school?.branding?.secondaryColor || '#4caf50',
    '--light-green': school?.branding?.accentColor || '#81c784',
    '--lighter-green': '#a5d6a7',
    '--background-light': '#f8fffe',
    '--background-medium': '#e8f5e8',
    '--font-family': school?.branding?.fontFamily || 'system-ui, -apple-system, sans-serif',
    ...(backgroundImage && { backgroundImage: `url(${backgroundImage})` }),
  } as React.CSSProperties;

  const renderContent = () => {
    switch (styleId) {
      case 'hero-center-stage':
        return (
          <div className="content-container">
            <h1 className="headline">{title}</h1>
            <h2 className="sub-headline">{subtitle}</h2>
            <p className="description">{description}</p>
            <div className="buttons">
              {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
              {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
            </div>
          </div>
        );

      case 'hero-split-columns':
        return (
          <>
            <div className="content-column">
              <h1 className="headline">{title}</h1>
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="buttons">
                {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
              </div>
            </div>
            <div className="spacer-column"></div>
          </>
        );

      case 'hero-full-card':
        return (
          <div className="card-container">
            <h1 className="shadowed-headline">{title}</h1>
            <h2 className="sub-headline">{subtitle}</h2>
            <p className="description">{description}</p>
            <div className="buttons">
              {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
              {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
            </div>
          </div>
        );

      case 'hero-overlay-frame':
        return (
          <>
            <div className="frame-overlay"></div>
            <div className="floating-title">
              <h1 className="headline">{title}</h1>
            </div>
            <div className="content-container">
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="buttons">
                {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
              </div>
            </div>
          </>
        );

      case 'hero-grid-power':
        return (
          <div className="content-container">
            <h1 className="grid-headline">{title}</h1>
            <h2 className="grid-sub">{subtitle}</h2>
            <p className="grid-desc">{description}</p>
            <div className="grid-buttons">
              {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
              {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
            </div>
          </div>
        );

      case 'hero-minimal-punch':
        return (
          <div className="content-container">
            <h1 className="compact-headline">{title}</h1>
            <h2 className="compact-sub">{subtitle}</h2>
            <p className="compact-description">{description}</p>
            <div className="compact-buttons">
              {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
              {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
            </div>
          </div>
        );

      case 'hero-dynamic-fold':
        return (
          <div className="fold-section">
            <div className="fold-accent"></div>
            <h1 className="headline">{title}</h1>
            <h2 className="sub-headline">{subtitle}</h2>
            <p className="description">{description}</p>
            <div className="buttons">
              {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
              {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
            </div>
          </div>
        );

      case 'hero-sticky-topline':
        return (
          <div className="sticky-content">
            <h1 className="sticky-headline">{title}</h1>
            <h2 className="sub-headline">{subtitle}</h2>
            <p className="description">{description}</p>
            <div className="buttons">
              {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
              {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
            </div>
          </div>
        );

      case 'hero-block-statement':
        return (
          <>
            <div className="floating-block">
              <h1 className="sharp-headline">{title}</h1>
            </div>
            <div className="main-content">
              <div className="content-block">
                <h2 className="sub-headline">{subtitle}</h2>
                <p className="description">{description}</p>
                <div className="buttons">
                  {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
                  {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
                </div>
              </div>
            </div>
          </>
        );

      case 'hero-slide-reveal':
        return (
          <div className="slide-container">
            <div className="slide-content">
              <h1 className="reveal-headline">{title}</h1>
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="buttons">
                {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
              </div>
            </div>
          </div>
        );

      case 'hero-skew-panel':
        return (
          <div className="skew-content">
            <h1 className="skew-headline">{title}</h1>
            <h2 className="sub-headline">{subtitle}</h2>
            <p className="description">{description}</p>
            <div className="skew-buttons">
              {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
              {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
            </div>
          </div>
        );

      case 'hero-minimalist-clean':
        return (
          <div className="clean-content">
            <h1 className="clean-headline">{title}</h1>
            <div className="clean-accent-line"></div>
            <h2 className="sub-headline">{subtitle}</h2>
            <p className="description">{description}</p>
            <div className="clean-buttons">
              {primaryButton && <a href={primaryLink} className="clean-primary">{primaryButton}</a>}
              {secondaryButton && <a href={secondaryLink} className="clean-secondary">{secondaryButton}</a>}
            </div>
          </div>
        );

      case 'hero-bold-geometric':
        return (
          <>
            <div className="geometric-content">
              <h1 className="geometric-headline">{title}</h1>
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="buttons">
                {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
              </div>
            </div>
            <div className="geometric-shapes">
              <div className="shape-triangle"></div>
              <div className="shape-circle"></div>
              <div className="shape-polygon"></div>
            </div>
          </>
        );

      case 'hero-gradient-waves':
        return (
          <div className="wave-content">
            <h1 className="wave-headline wave-glow">{title}</h1>
            <h2 className="sub-headline">{subtitle}</h2>
            <p className="description">{description}</p>
            <div className="buttons">
              {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
              {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
            </div>
            <div className="wave-shape"></div>
          </div>
        );

      case 'hero-split-yin-yang':
        return (
          <>
            <div className="diagonal-split"></div>
            <div className="split-content-green">
              <h1 className="yin-yang-headline">{title}</h1>
              <h2 className="sub-headline">{subtitle}</h2>
            </div>
            <div className="split-content-white">
              <p className="description">{description}</p>
              <div className="buttons">
                {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
              </div>
            </div>
          </>
        );

      case 'hero-floating-card-deck':
        return (
          <div className="card-stack">
            <div className="floating-card card-3"></div>
            <div className="floating-card card-2"></div>
            <div className="floating-card card-1">
              <h1 className="deck-headline">{title}</h1>
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="buttons">
                {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
              </div>
            </div>
          </div>
        );

      case 'hero-dot-matrix':
        return (
          <>
            <div className="dot-background"></div>
            <div className="matrix-content">
              <h1 className="matrix-headline">{title}</h1>
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="buttons">
                {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
              </div>
            </div>
          </>
        );

      case 'hero-typography-sculpture':
        return (
          <div className="typo-container">
            <h1 className="sculpture-headline">
              <span className="filled-text">{title?.slice(0, 4) || 'Welc'}</span>{title?.slice(4) || 'ome to Our School'}
            </h1>
            <div className="decorative-text decorative-1">Modern</div>
            <div className="decorative-text decorative-2">Creative</div>
            <div className="typo-content">
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="sculpture-buttons">
                {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
              </div>
            </div>
          </div>
        );

      case 'hero-hexagonal-grid':
        return (
          <>
            <div className="hex-background">
              <div className="hexagon hex-1"></div>
              <div className="hexagon hex-2"></div>
              <div className="hexagon hex-3"></div>
            </div>
            <div className="hex-content">
              <h1 className="hex-headline">{title}</h1>
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="hex-buttons">
                {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
              </div>
            </div>
          </>
        );

      case 'hero-circular-orbit':
        return (
          <div className="orbit-system">
            <div className="orbit-center">
              <h1 className="orbit-headline">{title}</h1>
            </div>
            <div className="orbit-ring orbit-1">
              <div className="orbit-element"></div>
            </div>
            <div className="orbit-ring orbit-2">
              <div className="orbit-element"></div>
            </div>
            <div className="orbit-content">
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="buttons">
                {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
              </div>
            </div>
          </div>
        );

      case 'hero-glass-morphism':
        return (
          <div className="glass-stack">
            <div className="glass-panel glass-panel-3"></div>
            <div className="glass-panel glass-panel-2"></div>
            <div className="glass-panel glass-panel-1">
              <h1 className="glass-headline">{title}</h1>
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="glass-buttons">
                {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
              </div>
            </div>
          </div>
        );

      case 'hero-skewed-perspective':
        return (
          <div className="perspective-container">
            <div className="skewed-content">
              <h1 className="perspective-headline">{title}</h1>
              <h2 className="perspective-sub">{subtitle}</h2>
              <p className="perspective-description">{description}</p>
              <div className="perspective-buttons">
                {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
              </div>
            </div>
          </div>
        );

      case 'hero-neumorphic':
        return (
          <div className="neuro-container">
            <div className="neuro-panel">
              <h1 className="neuro-headline">{title}</h1>
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="neuro-buttons">
                {primaryButton && <a href={primaryLink} className="neuro-btn neuro-btn-primary">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="neuro-btn">{secondaryButton}</a>}
              </div>
            </div>
          </div>
        );

      case 'hero-magazine-editorial':
        return (
          <>
            <h1 className="editorial-headline">{title}</h1>
            <h2 className="editorial-sub">{subtitle}</h2>
            <div className="editorial-content">
              <p>{description}</p>
            </div>
            <div className="editorial-buttons">
              {primaryButton && <a href={primaryLink} className="editorial-btn editorial-btn-primary">{primaryButton}</a>}
              {secondaryButton && <a href={secondaryLink} className="editorial-btn editorial-btn-secondary">{secondaryButton}</a>}
            </div>
            <div className="editorial-sidebar">
              <p className="pull-quote">"Education is the most powerful weapon which you can use to change the world."</p>
              <p className="quote-attribution">- Nelson Mandela</p>
            </div>
          </>
        );

      case 'hero-liquid-wave':
        return (
          <>
            <div className="liquid-background">
              <div className="wave-layer wave-1"></div>
              <div className="wave-layer wave-2"></div>
              <div className="wave-layer wave-3"></div>
            </div>
            <div className="liquid-content">
              <h1 className="liquid-headline">{title}</h1>
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="liquid-buttons">
                {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
              </div>
            </div>
          </>
        );

      case 'hero-brutalist':
        return (
          <div className="brutalist-container">
            <div className="brutal-block">
              <div className="brutal-accent"></div>
              <h1 className="brutalist-headline">{title}</h1>
              <div className="brutal-stripe"></div>
              <div className="brutalist-content">
                <h2 className="sub-headline">{subtitle}</h2>
                <p className="description">{description}</p>
              </div>
              <div className="brutalist-buttons">
                {primaryButton && <a href={primaryLink} className="brutal-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="brutal-btn">{secondaryButton}</a>}
              </div>
            </div>
          </div>
        );

      case 'hero-neon-cyber':
        return (
          <>
            <div className="cyber-grid"></div>
            <div className="neon-content">
              <h1 className="neon-headline">{title}</h1>
              <h2 className="neon-sub">{subtitle}</h2>
              <p className="neon-description">{description}</p>
              <div className="neon-buttons">
                {primaryButton && <a href={primaryLink} className="neon-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="neon-btn">{secondaryButton}</a>}
              </div>
            </div>
          </>
        );

      case 'hero-3d-isometric':
        return (
          <div className="isometric-scene">
            <div className="iso-shadow"></div>
            <div className="iso-block iso-block-accent-1"></div>
            <div className="iso-block iso-block-accent-2"></div>
            <div className="iso-block iso-block-main">
              <h1 className="isometric-headline">{title}</h1>
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="isometric-buttons">
                {primaryButton && <a href={primaryLink} className="iso-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="iso-btn">{secondaryButton}</a>}
              </div>
            </div>
          </div>
        );

      case 'hero-origami-folds':
        return (
          <div className="origami-container">
            <div className="origami-layers">
              <div className="layer-3"></div>
              <div className="layer-2"></div>
              <div className="paper-fold">
                <div className="fold-corner"></div>
                <div className="fold-crease"></div>
                <h1 className="origami-headline">{title}</h1>
                <h2 className="sub-headline">{subtitle}</h2>
                <p className="description">{description}</p>
                <div className="origami-buttons">
                  {primaryButton && <a href={primaryLink} className="origami-btn origami-btn-primary">{primaryButton}</a>}
                  {secondaryButton && <a href={secondaryLink} className="origami-btn origami-btn-secondary">{secondaryButton}</a>}
                </div>
              </div>
            </div>
          </div>
        );

      case 'hero-particle-burst':
        return (
          <>
            <div className="particle-system">
              {Array.from({ length: 12 }).map((_, i) => <div key={i} className="particle"></div>)}
            </div>
            <div className="burst-content">
              <h1 className="burst-headline">{title}</h1>
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="burst-buttons">
                {primaryButton && <a href={primaryLink} className="burst-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="burst-btn">{secondaryButton}</a>}
              </div>
            </div>
          </>
        );

      case 'hero-layered-depth':
        return (
          <>
            <div className="depth-layer layer-background"></div>
            <div className="depth-layer layer-middle">
              <div className="middle-shape"></div>
            </div>
            <div className="depth-layer layer-foreground">
              <div className="depth-content">
                <h1 className="depth-headline">{title}</h1>
                <h2 className="sub-headline">{subtitle}</h2>
                <p className="description">{description}</p>
                <div className="depth-buttons">
                  {primaryButton && <a href={primaryLink} className="depth-btn">{primaryButton}</a>}
                  {secondaryButton && <a href={secondaryLink} className="depth-btn">{secondaryButton}</a>}
                </div>
              </div>
            </div>
            <div className="depth-layer layer-accent">
              <div className="accent-elements"></div>
            </div>
          </>
        );

      case 'hero-ribbon-flow':
        return (
          <div className="ribbon-system">
            <div className="ribbon-banner">
              <h2 className="sub-headline">{subtitle}</h2>
            </div>
            <div className="ribbon-content-main">
              <h1 className="ribbon-headline">{title}</h1>
              <p className="description">{description}</p>
              <div className="ribbon-buttons">
                {primaryButton && <a href={primaryLink} className="ribbon-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="ribbon-btn">{secondaryButton}</a>}
              </div>
            </div>
            <div className="ribbon-accent-1"></div>
            <div className="ribbon-accent-2"></div>
          </div>
        );

      case 'hero-organic-blob':
        return (
          <div className="blob-system">
            <div className="organic-shape blob-1"></div>
            <div className="organic-shape blob-2"></div>
            <div className="organic-shape blob-3"></div>
            <div className="organic-content">
              <h1 className="organic-headline">{title}</h1>
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="organic-buttons">
                {primaryButton && <a href={primaryLink} className="organic-btn organic-btn-primary">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="organic-btn organic-btn-secondary">{secondaryButton}</a>}
              </div>
            </div>
          </div>
        );

      case 'hero-terminal':
        return (
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dots"></div>
              <div className="terminal-dots"></div>
              <div className="terminal-dots"></div>
              <div className="terminal-title">School Portal</div>
            </div>
            <div className="terminal-body">
              <div className="terminal-line">
                <span className="terminal-prompt">user@school:~$</span>
                <span className="terminal-command">./welcome</span>
              </div>
              <div className="terminal-output">
                <h1 className="terminal-headline">{title}</h1>
                <h2 className="sub-headline">{subtitle}</h2>
                <p>{description}</p>
                <div className="terminal-buttons">
                  {primaryButton && <a href={primaryLink} className="terminal-btn terminal-btn-primary">{primaryButton}</a>}
                  {secondaryButton && <a href={secondaryLink} className="terminal-btn">{secondaryButton}</a>}
                </div>
              </div>
              <div className="terminal-line">
                <span className="terminal-prompt">user@school:~$</span>
                <div className="cursor"></div>
              </div>
            </div>
          </div>
        );

      case 'hero-art-deco':
        return (
          <div className="deco-frame">
            <div className="deco-corner corner-tl"></div>
            <div className="deco-corner corner-tr"></div>
            <div className="deco-corner corner-bl"></div>
            <div className="deco-corner corner-br"></div>
            <div className="deco-pattern"></div>
            <h1 className="deco-headline">{title}</h1>
            <div className="deco-ornament">◆</div>
            <div className="deco-content">
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
            </div>
            <div className="deco-buttons">
              {primaryButton && <a href={primaryLink} className="deco-btn">{primaryButton}</a>}
              {secondaryButton && <a href={secondaryLink} className="deco-btn">{secondaryButton}</a>}
            </div>
          </div>
        );

      case 'hero-flowing-lines':
        return (
          <>
            <div className="line-art-container">
              <div className="flowing-line line-1"></div>
              <div className="flowing-line line-2"></div>
              <div className="flowing-line line-3"></div>
              <div className="curved-path"></div>
            </div>
            <div className="flowing-content">
              <h1 className="flow-headline">{title}</h1>
              <h2 className="sub-headline">{subtitle}</h2>
              <p className="description">{description}</p>
              <div className="flow-buttons">
                {primaryButton && <a href={primaryLink} className="flow-btn">{primaryButton}</a>}
                {secondaryButton && <a href={secondaryLink} className="flow-btn">{secondaryButton}</a>}
              </div>
            </div>
          </>
        );

      default:
        return (
          <div className="content-container">
            <h1 className="headline">{title}</h1>
            <h2 className="sub-headline">{subtitle}</h2>
            <p className="description">{description}</p>
            <div className="buttons">
              {primaryButton && <a href={primaryLink} className="primary-btn">{primaryButton}</a>}
              {secondaryButton && <a href={secondaryLink} className="secondary-btn">{secondaryButton}</a>}
            </div>
          </div>
        );
    }
  };

  return (
    <section className={`hero-section ${styleId}`} style={sectionStyle}>
      {renderContent()}
    </section>
  );
};

export default HeroSection;