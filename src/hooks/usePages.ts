
import { useState, useEffect } from 'react';
import { Page, PageSection } from '@/types';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';

export const usePages = () => {
  const { school } = useSchool();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = async () => {
    if (!school) return;

    setLoading(true);
    setError(null);

    try {
      const allPages = await sdk.get<Page>('pages');
      const schoolPages = allPages.filter(p => p.schoolId === school.id);
      setPages(schoolPages);
    } catch (err) {
      console.error('Failed to fetch pages:', err);
      setError('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const createPage = async (pageData: Omit<Page, 'id' | 'uid'>) => {
    if (!school) throw new Error('No school context');

    try {
      const newPage = await sdk.insert<Page>('pages', {
        ...pageData,
        schoolId: school.id,
      });
      setPages([...pages, newPage]);
      return newPage;
    } catch (err) {
      console.error('Failed to create page:', err);
      throw err;
    }
  };

  const updatePage = async (pageId: string, updates: Partial<Page>) => {
    try {
      const updatedPage = await sdk.update<Page>('pages', pageId, updates);
      setPages(pages.map(p => p.id === pageId ? updatedPage : p));
      return updatedPage;
    } catch (err) {
      console.error('Failed to update page:', err);
      throw err;
    }
  };

  const deletePage = async (pageId: string) => {
    try {
      await sdk.delete('pages', pageId);
      setPages(pages.filter(p => p.id !== pageId));
    } catch (err) {
      console.error('Failed to delete page:', err);
      throw err;
    }
  };

  const updatePageSections = async (pageId: string, sections: PageSection[]) => {
    try {
      const updatedPage = await sdk.update<Page>('pages', pageId, { sections });
      setPages(pages.map(p => p.id === pageId ? updatedPage : p));
      return updatedPage;
    } catch (err) {
      console.error('Failed to update page sections:', err);
      throw err;
    }
  };

  const getPageBySlug = (slug: string): Page | null => {
    return pages.find(p => p.slug === slug) || null;
  };

  const getPagesByType = (type: Page['type']): Page[] => {
    return pages.filter(p => p.type === type);
  };

  useEffect(() => {
    fetchPages();
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
