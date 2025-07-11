import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/hero.css';

interface HeroSectionProps {
  section: Section;
}

const HeroSection: React.FC<HeroSectionProps> = ({ section }) => {
  const { title, subtitle, primaryButton, secondaryButton, description, primaryLink, secondaryLink, backgroundImage } = section.content;
  const styleId = section.styleId || 'hero-center-stage';

  const sectionStyle = backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {};

  return (
    <section className={`hero-section ${styleId}`} style={sectionStyle}>
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-6">{title || 'Welcome'}</h1>
        <h2 className="text-2xl mb-4">{subtitle || 'Subtitle goes here'}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">{description || 'Description goes here'}</p>
        <div className="flex gap-4 justify-center buttons">
          {primaryButton && <a href={primaryLink || '#'} className="btn btn-primary">{primaryButton}</a>}
          {secondaryButton && <a href={secondaryLink || '#'} className="btn btn-secondary">{secondaryButton}</a>}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;