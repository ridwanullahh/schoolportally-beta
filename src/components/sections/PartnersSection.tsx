import React, { useState, useEffect, useRef } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/partners-ultra-modern.css';

interface PartnersSectionProps {
  section: Section;
}

const PartnersSection: React.FC<PartnersSectionProps> = ({ section }) => {
  const { title, partners } = section.content;
  const styleId = section.styleId || 'partners-floating-glass';
  const [activeIndex, setActiveIndex] = useState(0);
  const partnerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const defaultPartners = [
    {
      name: 'Microsoft Education',
      logo: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=150&h=60&fit=crop',
      description: 'Leading technology partner for educational solutions'
    },
    {
      name: 'Google for Education',
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=150&h=60&fit=crop',
      description: 'Cloud-based learning platform and tools'
    },
    {
      name: 'Cambridge Assessment',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=60&fit=crop',
      description: 'International education assessment and certification'
    },
    {
      name: 'Pearson Education',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=60&fit=crop',
      description: 'Global learning company and educational publisher'
    },
    {
      name: 'Khan Academy',
      logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=150&h=60&fit=crop',
      description: 'Free online learning platform for students'
    },
    {
      name: 'UNESCO',
      logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=60&fit=crop',
      description: 'United Nations Educational, Scientific and Cultural Organization'
    },
  ];

  const partnerItems = partners && partners.length > 0 ? partners : defaultPartners;

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        },
        { threshold: 0.1 }
    );

    partnerRefs.current.forEach(ref => {
        if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [partnerItems]);

  useEffect(() => {
    if (styleId === 'partners-sliding-carousel') {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % partnerItems.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [styleId, partnerItems.length]);

  const renderPartner = (partner: any, index: number) => {
    const partnerContent = (
      <>
        <img
          src={partner.logo}
          alt={partner.name}
          className="partner-logo"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=60&fit=crop';
          }}
        />
        <div className="partner-name">{partner.name}</div>
        {partner.description && <div className="partner-description">{partner.description}</div>}
      </>
    );

    switch(styleId) {
      case 'partners-sliding-carousel':
        return (
          <div key={index} className="partner-item">
            {partnerContent}
          </div>
        );
      default:
        return (
          <div key={index} ref={el => partnerRefs.current[index] = el} className="partner-item">
            {partnerContent}
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (styleId) {
      case 'partners-sliding-carousel':
        return (
          <div className="partners-container">
            <div className="carousel-track">
              {partnerItems.map(renderPartner)}
              {/* Duplicate for seamless loop */}
              {partnerItems.map((partner, index) => renderPartner(partner, index + partnerItems.length))}
            </div>
          </div>
        );
      default:
        return (
          <div className="partners-container">
            {partnerItems.map(renderPartner)}
          </div>
        );
    }
  };

  return (
    <section className={`partners-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default PartnersSection;