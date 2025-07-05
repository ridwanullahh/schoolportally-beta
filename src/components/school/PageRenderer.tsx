
import React from 'react';
import { Page, School } from '@/types';
import SectionRenderer from './SectionRenderer';

interface PageRendererProps {
  page: Page;
  school: School;
}

const PageRenderer: React.FC<PageRendererProps> = ({ page, school }) => {
  const visibleSections = page.sections?.filter(section => section.visible) || [];

  if (visibleSections.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
        <p className="text-xl text-gray-600">This page is currently being updated.</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      {visibleSections
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            school={school}
          />
        ))}
    </div>
  );
};

export default PageRenderer;
