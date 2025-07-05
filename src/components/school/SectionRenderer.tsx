
import React from 'react';
import { PageSection, School } from '@/types';
import { sectionStyles } from '@/data/sectionStyles';

interface SectionRendererProps {
  section: PageSection;
  school: School;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section, school }) => {
  const sectionStyle = sectionStyles.find(style => style.id === section.styleId);
  
  if (!sectionStyle) {
    return (
      <div className="py-8 text-center text-gray-500">
        Section style not found: {section.styleId}
      </div>
    );
  }

  // Apply theme colors
  const themeStyle = {
    '--primary-color': school.branding?.primaryColor || '#4f46e5',
    '--secondary-color': school.branding?.secondaryColor || '#06b6d4',
    '--accent-color': school.branding?.accentColor || '#f59e0b',
    '--font-family': school.branding?.fontFamily || 'Inter',
  } as React.CSSProperties;

  // Render based on section type and style
  if (section.type === 'hero') {
    return (
      <section className="hero-section py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white" style={themeStyle}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {section.content.title || 'Welcome to Our School'}
          </h1>
          <p className="text-xl mb-4">
            {section.content.subtitle || 'Excellence in Education'}
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            {section.content.description || 'We provide quality education in a nurturing environment.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {section.content.primaryButton && (
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {section.content.primaryButton}
              </button>
            )}
            {section.content.secondaryButton && (
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                {section.content.secondaryButton}
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'features') {
    return (
      <section className="features-section py-16" style={themeStyle}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {section.content.title || 'Why Choose Us'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {section.content.description || 'Discover what makes our school special'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* This would be populated with actual feature data */}
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Education</h3>
              <p className="text-gray-600">Comprehensive curriculum designed for student success</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Faculty</h3>
              <p className="text-gray-600">Dedicated teachers committed to student growth</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Modern Facilities</h3>
              <p className="text-gray-600">State-of-the-art learning environments</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default fallback rendering
  return (
    <section className="py-12" style={themeStyle}>
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {section.content.title || `Section: ${section.type}`}
          </h2>
          <p className="text-gray-600">
            {section.content.description || 'This section is being customized.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SectionRenderer;
