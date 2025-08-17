import { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';

export interface BlogPost {
  id: string;
  schoolId: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  author: string;
  authorId: string;
  category: string;
  tags: string[];
  status: 'published' | 'draft' | 'scheduled';
  publishedAt?: string;
  scheduledAt?: string;
  featured: boolean;
  views: number;
  likes: number;
  comments: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt?: string;
}

export const useBlogPosts = () => {
  const { school } = useSchool();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<BlogPost>('blog_posts', (allPosts) => {
      const schoolPosts = allPosts.filter(post => post.schoolId === school.id);
      setPosts(schoolPosts);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createPost = async (postData: Omit<BlogPost, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<BlogPost>('blog_posts', { 
      ...postData, 
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updatePost = async (postId: string, updates: Partial<BlogPost>) => {
    return sdk.update<BlogPost>('blog_posts', postId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deletePost = async (postId: string) => {
    return sdk.delete('blog_posts', postId);
  };

  const getPublishedPosts = () => {
    const now = new Date();
    return posts.filter(post => 
      post.status === 'published' && 
      (!post.publishedAt || new Date(post.publishedAt) <= now)
    ).sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
  };

  const getFeaturedPosts = () => {
    return getPublishedPosts().filter(post => post.featured);
  };

  const getPostsByCategory = (category: string) => {
    return getPublishedPosts().filter(post => post.category === category);
  };

  const getPostsByTag = (tag: string) => {
    return getPublishedPosts().filter(post => post.tags.includes(tag));
  };

  const getRecentPosts = (limit: number = 10) => {
    return getPublishedPosts().slice(0, limit);
  };

  const getPopularPosts = (limit: number = 10) => {
    return getPublishedPosts()
      .sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
      .slice(0, limit);
  };

  const getCategories = () => {
    const categories = getPublishedPosts()
      .map(post => post.category)
      .filter((category, index, arr) => arr.indexOf(category) === index);
    return categories;
  };

  const getTags = () => {
    const tags = getPublishedPosts()
      .flatMap(post => post.tags)
      .filter((tag, index, arr) => arr.indexOf(tag) === index);
    return tags;
  };

  const searchPosts = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return getPublishedPosts().filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getPostBySlug = (slug: string) => {
    return getPublishedPosts().find(post => post.slug === slug);
  };

  const getRelatedPosts = (currentPost: BlogPost, limit: number = 3) => {
    return getPublishedPosts()
      .filter(post => 
        post.id !== currentPost.id && 
        (post.category === currentPost.category || 
         post.tags.some(tag => currentPost.tags.includes(tag)))
      )
      .slice(0, limit);
  };

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    getPublishedPosts,
    getFeaturedPosts,
    getPostsByCategory,
    getPostsByTag,
    getRecentPosts,
    getPopularPosts,
    getCategories,
    getTags,
    searchPosts,
    getPostBySlug,
    getRelatedPosts,
  };
};
