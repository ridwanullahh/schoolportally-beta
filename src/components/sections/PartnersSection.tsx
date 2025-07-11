import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/partners.css';

interface PartnersSectionProps {
  section: Section;
}

const PartnersSection: React.FC<PartnersSectionProps> = ({ section }) => {
  const { title, partners } = section.content;
  const styleId = section.styleId || 'partners-logo-grid';

  const defaultPartners = [
    { name: 'Partner One', logo: 'https://via.placeholder.com/150x60?text=Partner1' },
    { name: 'Partner Two', logo: 'https://via.placeholder.com/150x60?text=Partner2' },
    { name: 'Partner Three', logo: 'https://via.placeholder.com/150x60?text=Partner3' },
    { name: 'Partner Four', logo: 'https://via.placeholder.com/150x60?text=Partner4' },
    { name: 'Partner Five', logo: 'https://via.placeholder.com/150x60?text=Partner5' },
  ];

  const partnerItems = partners && partners.length > 0 ? partners : defaultPartners;

  const renderPartner = (partner: any, index: number) => (
    <div key={index} className="logo-item">
      <img src={partner.logo} alt={partner.name} className="max-h-16" />
    </div>
  );

  return (
    <section className={`partners-section py-12 bg-gray-50 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="partners-container">
          {partnerItems.map(renderPartner)}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;