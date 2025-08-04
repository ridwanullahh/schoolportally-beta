import { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';

export interface GalleryImage {
  id: string;
  schoolId: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category?: string;
  tags?: string[];
  uploadedAt: string;
  status: 'active' | 'inactive';
  featured?: boolean;
  albumId?: string;
  createdAt: string;
  updatedAt?: string;
}

export const useGallery = () => {
  const { school } = useSchool();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setImages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<GalleryImage>('gallery', (allImages) => {
      const schoolImages = allImages.filter(img => img.schoolId === school.id);
      setImages(schoolImages);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createImage = async (imageData: Omit<GalleryImage, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<GalleryImage>('gallery', { 
      ...imageData, 
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateImage = async (imageId: string, updates: Partial<GalleryImage>) => {
    return sdk.update<GalleryImage>('gallery', imageId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteImage = async (imageId: string) => {
    return sdk.delete('gallery', imageId);
  };

  const getActiveImages = () => {
    return images.filter(img => img.status === 'active');
  };

  const getFeaturedImages = () => {
    return images.filter(img => img.status === 'active' && img.featured);
  };

  const getImagesByCategory = (category: string) => {
    return images.filter(img => img.status === 'active' && img.category === category);
  };

  const getImagesByAlbum = (albumId: string) => {
    return images.filter(img => img.status === 'active' && img.albumId === albumId);
  };

  const getRecentImages = (limit: number = 10) => {
    return images
      .filter(img => img.status === 'active')
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, limit);
  };

  const getCategories = () => {
    const categories = images
      .filter(img => img.status === 'active' && img.category)
      .map(img => img.category!)
      .filter((category, index, arr) => arr.indexOf(category) === index);
    return categories;
  };

  const searchImages = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return images.filter(img => 
      img.status === 'active' && (
        img.title.toLowerCase().includes(lowercaseQuery) ||
        img.description?.toLowerCase().includes(lowercaseQuery) ||
        img.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    );
  };

  return {
    images,
    loading,
    error,
    createImage,
    updateImage,
    deleteImage,
    getActiveImages,
    getFeaturedImages,
    getImagesByCategory,
    getImagesByAlbum,
    getRecentImages,
    getCategories,
    searchImages,
  };
};
