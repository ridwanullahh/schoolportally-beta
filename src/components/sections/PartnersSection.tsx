import React, { useState, useEffect, useRef } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/partners-modern.css';
import '@/themes/styles/sections/partners-ultra-modern.css';

interface PartnersSectionProps {
  section: Section;
}

const PartnersSection: React.FC<PartnersSectionProps> = ({ section }) => {
  const { title, partners } = section.content;

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'partners-modern-grid',
      '2': 'partners-modern-slider',
      '3': 'partners-modern-minimal',
      '4': 'partners-modern-cards',
      '5': 'partners-modern-horizontal',
      '6': 'partners-modern-bordered',
      '7': 'partners-modern-circular',
      '8': 'partners-modern-gradient',
      '9': 'partners-modern-compact',
      '10': 'partners-modern-asymmetric',
      '11': 'partners-modern-typography',
      // Existing ultra-modern styles (12+)
      '12': 'partners-floating-glass',
      '13': 'partners-holographic-grid',
      '14': 'partners-neon-logos',
      '15': 'partners-particle-bg',
      '16': 'partners-morphing-cards',
      '17': 'partners-cyber-grid',
      '18': 'partners-liquid-metal',
      '19': 'partners-aurora-bg',
      '20': 'partners-matrix-rain',
      '21': 'partners-quantum-field',
      '22': 'partners-neural-network',
      '23': 'partners-hologram-effect',
      '24': 'partners-energy-waves',
      '25': 'partners-digital-rain',
      '26': 'partners-mosaic-layout'
    };
    return styleMap[styleNumber] || 'partners-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');
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