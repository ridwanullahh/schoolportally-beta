import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/teaser.css';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface TeaserSectionProps {
  section: Section;
}

const TeaserSection: React.FC<TeaserSectionProps> = ({ section }) => {
  const { title, description, buttonText, buttonLink } = section.content;
  const styleId = section.styleId || 'teaser-banner-strip';

  return (
    <section className={`teaser-section py-8 ${styleId}`}>
      <div className="container mx-auto px-4">
        <div className="content">
            <h3 className="text-2xl font-bold">{title || 'This is a teaser title'}</h3>
            <p>{description || 'And a short, compelling description to go with it.'}</p>
            {buttonText && 
              <Button asChild className="mt-4">
                <a href={buttonLink || '#'}>
                  {buttonText} <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            }
        </div>
      </div>
    </section>
  );
};

export default TeaserSection;