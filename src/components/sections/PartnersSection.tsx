import React, { useState, useEffect, useRef } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/partners.css';

interface PartnersSectionProps {
  section: Section;
}

const PartnersSection: React.FC<PartnersSectionProps> = ({ section }) => {
  const { title, partners } = section.content;
  const styleId = section.styleId || 'partners-logo-grid';
  const [activeIndex, setActiveIndex] = useState(0);
  const partnerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const defaultPartners = [
    { name: 'Partner One', logo: 'https://via.placeholder.com/150x60?text=Partner1', description: 'Description for Partner One' },
    { name: 'Partner Two', logo: 'https://via.placeholder.com/150x60?text=Partner2', description: 'Description for Partner Two' },
    { name: 'Partner Three', logo: 'https://via.placeholder.com/150x60?text=Partner3', description: 'Description for Partner Three' },
    { name: 'Partner Four', logo: 'https://via.placeholder.com/150x60?text=Partner4', description: 'Description for Partner Four' },
    { name: 'Partner Five', logo: 'https://via.placeholder.com/150x60?text=Partner5', description: 'Description for Partner Five' },
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
    if (styleId === 'partners-center-focus') {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % partnerItems.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [styleId, partnerItems.length]);

  const renderPartner = (partner: any, index: number) => {
    const logo = <img src={partner.logo} alt={partner.name} className="max-h-16" />;
    
    switch(styleId) {
        case 'partners-stacked-partner-cards':
            return <div key={index} className="partner-card"><h3>{partner.name}</h3>{logo}<p>{partner.description}</p></div>
        case 'partners-hover-badge':
            return <div key={index} className="logo-item">{logo}<div className="tooltip">{partner.name}</div></div>
        case 'partners-accordion-blocks':
            return <details key={index}><summary>{partner.name}</summary><p>{partner.description}</p></details>
        case 'partners-list-with-text':
             return <div key={index} className="partner-item">{logo}<div><h3>{partner.name}</h3><p>{partner.description}</p></div></div>
        case 'partners-center-focus':
            return <div key={index} className={`logo-item ${index === activeIndex ? 'active' : ''}`}>{logo}</div>
        case 'partners-rotating-ring':
            return <div key={index} className="logo-item" style={{transform: `rotate(${index * (360 / partnerItems.length)}deg) translateX(150px) rotate(-${index * (360 / partnerItems.length)}deg)`}}>{logo}</div>
        default:
            return <div key={index} ref={el => partnerRefs.current[index] = el} className="logo-item">{logo}</div>
    }
  };

  return (
    <section className={`partners-section py-12 bg-gray-50 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="partners-container">
          {partnerItems.map(renderPartner)}
          {styleId === 'partners-logo-carousel' && partnerItems.map((p, i) => renderPartner(p, i + partnerItems.length))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;