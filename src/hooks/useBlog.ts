import { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Blog } from '@/types';

export const useBlog = () => {
  const { school } = useSchool();
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<Blog>('blog', (allPosts) => {
      const schoolPosts = allPosts.filter(p => p.schoolId === school.id);
      setPosts(schoolPosts);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createPost = async (postData: Omit<Blog, 'id' | 'uid' | 'schoolId'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<Blog>('blog', { ...postData, schoolId: school.id });
  };

  const updatePost = async (postId: string, updates: Partial<Blog>) => {
    return sdk.update<Blog>('blog', postId, updates);
  };

  const deletePost = async (postId: string) => {
    return sdk.delete('blog', postId);
  };

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
  };
};