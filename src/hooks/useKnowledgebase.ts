import { useState, useEffect } from 'react';
import { useSchool } from './useSchool';
import sdk from '@/lib/sdk-config';

export interface KnowledgebaseArticle {
  id: string;
  uid?: string;
  schoolId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string[];
  author: string;
  authorId?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime?: number;
  views: number;
  likes: number;
  image?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  relatedArticles?: string[];
  lastUpdated: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  searchable: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export const useKnowledgebase = () => {
  const { school } = useSchool();
  const [articles, setArticles] = useState<KnowledgebaseArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setArticles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<KnowledgebaseArticle>('knowledgebase', (allArticles) => {
      const schoolArticles = allArticles
        .filter(a => a.schoolId === school.id && a.status === 'published')
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setArticles(schoolArticles);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createArticle = async (articleData: Omit<KnowledgebaseArticle, 'id' | 'uid' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<KnowledgebaseArticle>('knowledgebase', {
      ...articleData,
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateArticle = async (id: string, updates: Partial<KnowledgebaseArticle>) => {
    return sdk.update<KnowledgebaseArticle>('knowledgebase', id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteArticle = async (id: string) => {
    return sdk.delete('knowledgebase', id);
  };

  const getArticlesByCategory = (category: string) => {
    return articles.filter(article => article.category === category);
  };

  const getArticlesByTag = (tag: string) => {
    return articles.filter(article => article.tags?.includes(tag));
  };

  const getFeaturedArticles = (limit?: number) => {
    return articles.filter(article => article.featured).slice(0, limit || 6);
  };

  const getPopularArticles = (limit?: number) => {
    return articles
      .sort((a, b) => b.views - a.views)
      .slice(0, limit || 6);
  };

  const getCategories = () => {
    const categories = [...new Set(articles.map(article => article.category))];
    return categories.filter(Boolean);
  };

  const getAllTags = () => {
    const tags = articles.flatMap(article => article.tags || []);
    return [...new Set(tags)].filter(Boolean);
  };

  const searchArticles = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return articles.filter(article => 
      article.searchable && (
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.content.toLowerCase().includes(lowercaseQuery) ||
        article.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    );
  };

  return {
    articles,
    loading,
    error,
    createArticle,
    updateArticle,
    deleteArticle,
    getArticlesByCategory,
    getArticlesByTag,
    getFeaturedArticles,
    getPopularArticles,
    getCategories,
    getAllTags,
    searchArticles,
  };
};
