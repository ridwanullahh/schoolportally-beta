import React, { useEffect, useRef, useState } from 'react';
import { Section } from '@/types';
import { ArrowRight, Play } from 'lucide-react';
import { getStyleNumber } from '@/utils/sectionStyleUtils';

interface HeroSectionProps {
  section: Section;
}

// Map numeric style number to semantic class keys from task.md
const HERO_STYLE_MAP: Record<string, string> = {
  '1': 'hero-center-stage',
  '2': 'hero-split-columns',
  '3': 'hero-full-card',
  '4': 'hero-overlay-frame',
  '5': 'hero-grid-power',
  '6': 'hero-minimal-punch',
  '7': 'hero-dynamic-fold',
  '8': 'hero-sticky-topline',
  '9': 'hero-block-statement',
  '10': 'hero-slide-reveal',
  '11': 'hero-skew-panel',
  // Extended styles (12-26) per spec
  '12': 'hero-minimalist-clean',
  '13': 'hero-bold-geometric',
  '14': 'hero-gradient-waves',
  '15': 'hero-split-yin-yang',
  '16': 'hero-floating-deck',
  '17': 'hero-dot-matrix',
  '18': 'hero-typography-sculpture',
  '19': 'hero-liquid-wave', // using liquid-wave naming for 25 in spec to keep green brand
  '20': 'hero-magazine-editorial',
  '21': 'hero-neumorphic',
  '22': 'hero-ribbon-flow',
  '23': 'hero-organic-blob',
  '24': 'hero-terminal',
  '25': 'hero-art-deco',
  '26': 'hero-flowing-lines',
};

const HeroSection: React.FC<HeroSectionProps> = ({ section }) => {
  const {
    title = 'Welcome to Our School',
    subtitle = 'Excellence in Education',
    primaryButton = 'Apply Now',
    secondaryButton = 'Learn More',
    description = 'Discover a world of knowledge and opportunity in our nurturing educational environment.',
    primaryLink = '#apply',
    secondaryLink = '#about',
  } = section.content || {} as any;

  const styleNumber = String(getStyleNumber(section.styleId));
  const heroClassKey = HERO_STYLE_MAP[styleNumber] || HERO_STYLE_MAP['1'];

  // Sticky behavior for style 8
  const rootRef = useRef<HTMLElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (heroClassKey !== 'hero-sticky-topline') return;
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [heroClassKey]);

  // Common content block
  const Buttons = ({ alt = false }: { alt?: boolean }) => (
    <div className="hero-buttons clean-buttons grid-buttons compact-buttons neon-buttons ribbon-buttons depth-buttons isometric-buttons organic-buttons editorial-buttons flow-buttons">
      <a href={primaryLink} className={`btn-primary ${alt ? '' : 'primary-btn'}`}>
        {primaryButton}
        <ArrowRight size={16} />
      </a>
      <a href={secondaryLink} className={`btn-outline ${alt ? '' : 'secondary-btn'}`}>
        {secondaryButton}
        <Play size={16} />
      </a>
    </div>
  );

  const StandardCopy = () => (
    <>
      <h1 className="headline shadowed-headline grid-headline compact-headline ribbon-headline deco-headline depth-headline isometric-headline organic-headline flow-headline neon-headline">
        {title}
      </h1>
      <p className="sub-headline grid-sub compact-sub neon-sub editorial-sub perspective-sub">
        {subtitle}
      </p>
      <p className="description grid-desc compact-description neon-description editorial-content perspective-description">
        {description}
      </p>
      <Buttons />
    </>
  );

  const renderByStyle = () => {
    switch (heroClassKey) {
      case 'hero-center-stage':
        return <StandardCopy />;

      case 'hero-split-columns':
        return (
          <>
            <div className="content-column">
              <StandardCopy />
            </div>
            <div className="spacer-column" />
          </>
        );

      case 'hero-full-card':
        return (
          <div className="card-container">
            <h1 className="shadowed-headline">{title}</h1>
            <p className="sub-headline">{subtitle}</p>
            <p className="description">{description}</p>
            <Buttons />
          </div>
        );

      case 'hero-overlay-frame':
        return (
          <>
            <div className="frame-overlay" />
            <div className="floating-title">
              <h1 className="headline">{title}</h1>
            </div>
            <div className="hero-content">
              <p className="sub-headline">{subtitle}</p>
              <p className="description">{description}</p>
              <Buttons />
            </div>
          </>
        );

      case 'hero-grid-power':
        return (
          <div className="grid-layout">
            <h1 className="grid-headline">{title}</h1>
            <div className="grid-sub">{subtitle}</div>
            <div className="grid-desc">{description}</div>
            <div className="grid-buttons"><Buttons /></div>
          </div>
        );

      case 'hero-minimal-punch':
        return (
          <>
            <h1 className="compact-headline">{title}</h1>
            <div className="compact-sub">{subtitle}</div>
            <div className="compact-description">{description}</div>
            <div className="compact-buttons"><Buttons /></div>
          </>
        );

      case 'hero-dynamic-fold':
        return (
          <div className="fold-section">
            <div className="fold-accent" />
            <StandardCopy />
          </div>
        );

      case 'hero-sticky-topline':
        return (
          <div className={`sticky-content ${scrolled ? 'scrolled' : ''}`}>
            <h1 className="sticky-headline headline">{title}</h1>
            <p className="sub-headline">{subtitle}</p>
            <p className="description">{description}</p>
            <Buttons alt />
          </div>
        );

      case 'hero-block-statement':
        return (
          <>
            <div className="floating-block">
              <div className="sharp-headline">{title}</div>
            </div>
            <div className="main-content">
              <div className="content-block">
                <div className="sub-headline">{subtitle}</div>
                <div className="description">{description}</div>
                <Buttons />
              </div>
            </div>
          </>
        );

      case 'hero-slide-reveal':
        return (
          <div className="slide-container">
            <div className="slide-content">
              <div className="reveal-headline">{title}</div>
              <div className="sub-headline">{subtitle}</div>
              <div className="description">{description}</div>
              <Buttons />
            </div>
          </div>
        );

      case 'hero-skew-panel':
        return (
          <div className="skew-content">
            <div className="skew-headline">{title}</div>
            <div className="sub-headline">{subtitle}</div>
            <div className="description">{description}</div>
            <div className="skew-buttons"><Buttons alt /></div>
          </div>
        );

      case 'hero-minimalist-clean':
        return (
          <div className="clean-content">
            <div className="clean-headline">{title}</div>
            <div className="sub-headline">{subtitle}</div>
            <div className="description">{description}</div>
            <div className="clean-accent-line" />
            <Buttons />
          </div>
        );

      case 'hero-bold-geometric':
        return (
          <>
            <div className="geometric-content">
              <div className="geometric-headline">{title}</div>
              <div className="sub-headline">{subtitle}</div>
              <div className="description">{description}</div>
              <div className="geometric-buttons"><Buttons /></div>
            </div>
            <div className="geometric-shapes">
              <div className="shape-triangle" />
              <div className="shape-circle" />
              <div className="shape-polygon" />
            </div>
          </>
        );

      case 'hero-gradient-waves':
        return (
          <div className="wave-content">
            <div className="wave-headline wave-glow">{title}</div>
            <div className="sub-headline">{subtitle}</div>
            <div className="description">{description}</div>
            <Buttons alt />
            <div className="wave-shape" />
          </div>
        );

      case 'hero-split-yin-yang':
        return (
          <>
            <div className="diagonal-split" />
            <div className="split-content-green">
              <div className="yin-yang-headline">{title}</div>
              <div className="sub-headline">{subtitle}</div>
            </div>
            <div className="split-content-white">
              <div className="description">{description}</div>
              <Buttons />
            </div>
          </>
        );

      case 'hero-floating-deck':
        return (
          <div className="card-stack">
            <div className="floating-card card-3" />
            <div className="floating-card card-2" />
            <div className="floating-card card-1">
              <div className="deck-headline">{title}</div>
              <div className="sub-headline">{subtitle}</div>
              <div className="description">{description}</div>
              <Buttons />
            </div>
          </div>
        );

      case 'hero-dot-matrix':
        return (
          <>
            <div className="dot-background" />
            <div className="matrix-content">
              <div className="matrix-headline">{title}</div>
              <div className="sub-headline">{subtitle}</div>
              <div className="description">{description}</div>
              <Buttons />
            </div>
          </>
        );

      case 'hero-typography-sculpture':
        return (
          <div className="typo-container">
            <div className="sculpture-headline filled-text">{title}</div>
            <div className="sub-headline">{subtitle}</div>
            <div className="description">{description}</div>
            <Buttons />
          </div>
        );

      case 'hero-magazine-editorial':
        return (
          <>
            <div className="editorial-headline">{title}</div>
            <div className="editorial-sub">{subtitle}</div>
            <div className="editorial-content">{description}</div>
            <aside className="editorial-sidebar">
              <div className="pull-quote">“We shape the future.”</div>
              <div className="quote-attribution">— School Board</div>
            </aside>
            <div className="editorial-buttons">
              <a className="editorial-btn editorial-btn-primary" href={primaryLink}>{primaryButton}</a>
              <a className="editorial-btn editorial-btn-secondary" href={secondaryLink}>{secondaryButton}</a>
            </div>
          </>
        );

      case 'hero-neumorphic':
        return (
          <div className="neuro-container">
            <div className="neuro-panel">
              <div className="neuro-headline">{title}</div>
              <div className="sub-headline">{subtitle}</div>
              <div className="description">{description}</div>
              <div className="neuro-buttons">
                <a className="neuro-btn neuro-btn-primary" href={primaryLink}>{primaryButton}</a>
                <a className="neuro-btn" href={secondaryLink}>{secondaryButton}</a>
              </div>
            </div>
          </div>
        );

      case 'hero-ribbon-flow':
        return (
          <div className="ribbon-system">
            <div className="ribbon-banner">{subtitle}</div>
            <div className="ribbon-content-main">
              <div className="ribbon-headline">{title}</div>
              <div className="description">{description}</div>
            </div>
            <div className="ribbon-accent-1" />
            <div className="ribbon-accent-2" />
            <div className="ribbon-buttons"><Buttons alt /></div>
          </div>
        );

      case 'hero-organic-blob':
        return (
          <div className="blob-system">
            <div className="organic-shape blob-1" />
            <div className="organic-shape blob-2" />
            <div className="organic-shape blob-3" />
            <div className="organic-content">
              <div className="organic-headline">{title}</div>
              <div className="sub-headline">{subtitle}</div>
              <div className="description">{description}</div>
              <div className="organic-buttons"><Buttons /></div>
            </div>
          </div>
        );

      case 'hero-terminal':
        return (
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="terminal-dots" />
              <span className="terminal-dots" />
              <span className="terminal-dots" />
              <span className="terminal-title">Terminal</span>
            </div>
            <div className="terminal-body">
              <div className="terminal-headline">{title}<span className="cursor" /></div>
              <div className="terminal-line"><span className="terminal-prompt">$</span><span className="terminal-command">echo \"{subtitle}\"</span></div>
              <div className="terminal-output">{description}</div>
              <div className="terminal-buttons">
                <a className="terminal-btn terminal-btn-primary" href={primaryLink}>{primaryButton}</a>
                <a className="terminal-btn" href={secondaryLink}>{secondaryButton}</a>
              </div>
            </div>
          </div>
        );

      case 'hero-art-deco':
        return (
          <div className="deco-frame">
            <div className="deco-corner corner-tl" />
            <div className="deco-corner corner-tr" />
            <div className="deco-corner corner-bl" />
            <div className="deco-corner corner-br" />
            <div className="deco-pattern" />
            <div className="deco-headline">{title}</div>
            <div className="deco-ornament">✦ ✦ ✦</div>
            <div className="deco-content">{description}</div>
            <div className="deco-buttons">
              <a className="deco-btn" href={primaryLink}>{primaryButton}</a>
              <a className="deco-btn" href={secondaryLink}>{secondaryButton}</a>
            </div>
          </div>
        );

      case 'hero-flowing-lines':
        return (
          <>
            <div className="line-art-container">
              <div className="flowing-line line-1" />
              <div className="flowing-line line-2" />
              <div className="flowing-line line-3" />
              <div className="curved-path" />
            </div>
            <div className="flowing-content">
              <div className="flow-headline">{title}</div>
              <div className="sub-headline">{subtitle}</div>
              <div className="description">{description}</div>
              <div className="flow-buttons"><Buttons /></div>
            </div>
          </>
        );

      default:
        return <StandardCopy />;
    }
  };

  return (
    <section ref={rootRef as any} className={`hero-section ${heroClassKey} ${scrolled && heroClassKey === 'hero-sticky-topline' ? 'scrolled' : ''}`}>
      {renderByStyle()}
    </section>
  );
};

export default HeroSection;