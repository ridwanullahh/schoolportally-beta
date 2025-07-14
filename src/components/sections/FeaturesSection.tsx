import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import * as Icons from 'lucide-react';
import '@/themes/styles/sections/features.css';

interface FeaturesSectionProps {
  section: Section;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ section }) => {
  const { title, features } = section.content;
  const styleId = section.styleId || 'features-icon-grid';
  const [activeTab, setActiveTab] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  const defaultFeatures = [
    { icon: 'Check', title: 'Feature One', description: 'Description for feature one.', tabName: 'One' },
    { icon: 'Star', title: 'Feature Two', description: 'Description for feature two.', tabName: 'Two' },
    { icon: 'Zap', title: 'Feature Three', description: 'Description for feature three.', tabName: 'Three' },
  ];

  const featureItems = features && features.length > 0 ? features : defaultFeatures;

  useEffect(() => {
    if (styleId === 'features-rotating-view') {
      const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % featureItems.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [styleId, featureItems.length]);

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const IconComponent = iconName && Icons[iconName] ? Icons[iconName] : Icons.Check;
    return <IconComponent className="w-8 h-8" />;
  };

  const renderFeature = (feature: any, index: number) => {
    const featureContent = (
      <>
        <div className="icon inline-block text-primary mb-4">{getIcon(feature.icon)}</div>
        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.description}</p>
      </>
    );

    switch (styleId) {
      case 'features-vertical-steps':
        return (
          <div key={index} className="feature-item">
            <div className="step-number">{index + 1}</div>
            <div className="content">
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        );
      case 'features-accordion-list':
        return (
          <details key={index} className="feature-item">
            <summary>{feature.title}</summary>
            <p className="p-4">{feature.description}</p>
          </details>
        );
      case 'features-split-highlights':
        return (
          <div key={index} className="feature-item">
            <div className="text-content">{featureContent}</div>
            <img src={feature.image || 'https://via.placeholder.com/400'} alt={feature.title} className="feature-image" />
          </div>
        );
       case 'features-flip-panels':
        return (
          <div key={index} className="feature-item">
            <div className="flip-card-inner">
              <div className="flip-card-front">{getIcon(feature.icon)}<h3>{feature.title}</h3></div>
              <div className="flip-card-back"><p>{feature.description}</p></div>
            </div>
          </div>
        );
      default:
        return <div key={index} className="feature-item text-center">{featureContent}</div>;
    }
  };

  const renderContainer = () => {
    switch (styleId) {
      case 'features-tabbed-features':
        return (
          <>
            <div className="tab-buttons">
              {featureItems.map((feature, index) => (
                <button key={index} onClick={() => setActiveTab(index)} className={activeTab === index ? 'active' : ''}>
                  {feature.tabName || `Feature ${index + 1}`}
                </button>
              ))}
            </div>
            <div className="features-container">
              {featureItems.map((feature, index) => (
                <div key={index} className={`feature-item ${activeTab === index ? 'active' : ''}`}>
                  {renderFeature(feature, index)}
                </div>
              ))}
            </div>
          </>
        );
      case 'features-rotating-view':
        return (
          <div className="features-container">
            {featureItems.map((feature, index) => (
              <div key={index} className={`feature-item ${activeFeature === index ? 'active' : ''}`}>
                {renderFeature(feature, index)}
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="features-container">
            {featureItems.map(renderFeature)}
          </div>
        );
    }
  };

  return (
    <section className={`features-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContainer()}
      </div>
    </section>
  );
};

export default FeaturesSection;