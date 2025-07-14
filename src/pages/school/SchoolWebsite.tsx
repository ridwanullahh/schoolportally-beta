
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import { usePages } from '@/hooks/usePages';
import { Page } from '@/types';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import PageRenderer from '@/components/school/PageRenderer';
import ThemeSwitcher from '@/components/school/ThemeSwitcher';

const SchoolWebsite: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { schoolSlug, pageSlug } = useParams();
  const { school, loading: schoolLoading } = useSchool();
  const { pages, loading: pagesLoading } = usePages();
  const [currentPage, setCurrentPage] = useState<Page | null>(null);

  useEffect(() => {
    if (!pagesLoading && pages.length > 0) {
      const slug = pageSlug || 'home';
      const page = pages.find(p => p.slug === slug);
      setCurrentPage(page || pages.find(p => p.type === 'homepage') || pages[0]);
    }
  }, [pageSlug, pages, pagesLoading]);

  useEffect(() => {
    if (school?.branding) {
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', school.branding.primaryColor || '#000000');
      root.style.setProperty('--brand-secondary', school.branding.secondaryColor || '#ffffff');
      root.style.setProperty('--brand-accent', school.branding.accentColor || '#ff0000');
    }
  }, [school]);

  if (schoolLoading || pagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">School Not Found</h1>
          <p className="text-gray-600">The school you're looking for doesn't exist or is no longer available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeSwitcher themeName={school.branding?.theme || 'default'} />
      <SchoolHeader school={school} pages={pages} />
      
      <main className="flex-1">
        {children || (currentPage ? (
          <PageRenderer page={currentPage} school={school} />
        ) : (
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to {school.name}</h1>
            <p className="text-xl text-gray-600">Your educational journey starts here.</p>
          </div>
        ))}
      </main>

      <SchoolFooter school={school} />
    </div>
  );
};

export default SchoolWebsite;
