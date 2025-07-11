import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/features.css';
import { Check, Star, Zap } from 'lucide-react';

interface FeaturesSectionProps {
  section: Section;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ section }) => {
  const { title, features } = section.content;
  const styleId = section.styleId || 'features-icon-grid';

  const defaultFeatures = [
    { icon: 'Check', title: 'Feature One', description: 'Description for feature one.' },
    { icon: 'Star', title: 'Feature Two', description: 'Description for feature two.' },
    { icon: 'Zap', title: 'Feature Three', description: 'Description for feature three.' },
  ];

  const featureItems = features && features.length > 0 ? features : defaultFeatures;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Check': return <Check className="w-8 h-8" />;
      case 'Star': return <Star className="w-8 h-8" />;
      case 'Zap': return <Zap className="w-8 h-8" />;
      default: return <Check className="w-8 h-8" />;
    }
  };

  const renderFeature = (feature: any, index: number) => (
    <div key={index} className="feature-item">
      <div className="icon">{getIcon(feature.icon)}</div>
      <div>
        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.description}</p>
      </div>
    </div>
  );

  return (
    <section className={`features-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="features-container">
          {featureItems.map(renderFeature)}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;