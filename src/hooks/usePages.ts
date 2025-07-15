
import { useState, useEffect } from 'react';
import { Page, Section as PageSection } from '@/types';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';

export const usePages = () => {
  const { school } = useSchool();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = () => {
    if (!school) {
      setPages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = sdk.subscribe<Page>('pages', (allPages) => {
      const schoolPages = allPages.filter(p => p.schoolId === school.id);
      setPages(schoolPages);
      setLoading(false);
    });

    return unsubscribe;
  };

  const createPage = async (pageData: Omit<Page, 'id' | 'uid'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<Page>('pages', { ...pageData, schoolId: school.id });
  };

  const updatePage = async (pageId: string, updates: Partial<Page>) => {
    return sdk.update<Page>('pages', pageId, updates);
  };

  const deletePage = async (pageId: string) => {
    return sdk.delete('pages', pageId);
  };

  const updatePageSections = async (pageId: string, sections: PageSection[]) => {
    return sdk.update<Page>('pages', pageId, { sections });
  };

  const getPageBySlug = (slug: string): Page | null => {
    return pages.find(p => p.slug === slug) || null;
  };

  const getPagesByType = (type: Page['type']): Page[] => {
    return pages.filter(p => p.type === type);
  };

  useEffect(() => {
    const unsubscribe = fetchPages();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  return {
    pages,
    loading,
    error,
    createPage,
    updatePage,
    deletePage,
    updatePageSections,
    getPageBySlug,
    getPagesByType,
    refreshPages: fetchPages
  };
};
