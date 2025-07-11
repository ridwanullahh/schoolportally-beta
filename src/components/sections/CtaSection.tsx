import React from 'react';
import { Section } from '@/types';
import { Button } from '@/components/ui/button';
import '@/themes/styles/sections/cta.css';

interface CtaSectionProps {
  section: Section;
}

const CtaSection: React.FC<CtaSectionProps> = ({ section }) => {
  const { title, description, buttonText, buttonLink } = section.content;
  const styleId = section.styleId || 'cta-banner-strip';

  return (
    <section className={`cta-section py-12 ${styleId}`}>
      <div className="container mx-auto px-4 cta-content">
        <div className="text-content">
            <h2 className="text-3xl font-bold mb-4">{title || 'Take the Next Step'}</h2>
            <p className="mb-8 max-w-2xl mx-auto">{description || 'Join our community and start your journey today.'}</p>
        </div>
        <div className="button-container">
            <Button asChild size="lg">
              <a href={buttonLink || '#'}>{buttonText || 'Get Started'}</a>
            </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;