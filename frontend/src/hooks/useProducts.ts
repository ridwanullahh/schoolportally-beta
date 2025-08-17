import { useState, useEffect } from 'react';
import { useSchool } from './useSchool';
import sdk from '@/lib/sdk-config';

export interface Product {
  id: string;
  uid?: string;
  schoolId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  type: 'physical' | 'digital' | 'service';
  price: number;
  currency: string;
  discountPrice?: number;
  sku?: string;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  specifications?: {
    [key: string]: string;
  };
  features?: string[];
  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
    unit: string;
  };
  tags?: string[];
  brand?: string;
  manufacturer?: string;
  warranty?: string;
  returnPolicy?: string;
  shippingInfo?: string;
  availability: 'in-stock' | 'out-of-stock' | 'pre-order' | 'discontinued';
  rating?: number;
  reviewsCount: number;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'published' | 'archived';
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export const useProducts = () => {
  const { school } = useSchool();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<Product>('products', (allProducts) => {
      const schoolProducts = allProducts
        .filter(p => p.schoolId === school.id && p.status === 'published')
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setProducts(schoolProducts);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createProduct = async (productData: Omit<Product, 'id' | 'uid' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<Product>('products', {
      ...productData,
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    return sdk.update<Product>('products', id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteProduct = async (id: string) => {
    return sdk.delete('products', id);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const getProductsByType = (type: string) => {
    return products.filter(product => product.type === type);
  };

  const getFeaturedProducts = (limit?: number) => {
    return products.filter(product => product.featured).slice(0, limit || 6);
  };

  const getBestsellerProducts = (limit?: number) => {
    return products.filter(product => product.bestseller).slice(0, limit || 6);
  };

  const getNewArrivals = (limit?: number) => {
    return products.filter(product => product.newArrival).slice(0, limit || 6);
  };

  const getInStockProducts = () => {
    return products.filter(product => product.availability === 'in-stock' && product.stock > 0);
  };

  const getCategories = () => {
    const categories = [...new Set(products.map(product => product.category))];
    return categories.filter(Boolean);
  };

  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductsByType,
    getFeaturedProducts,
    getBestsellerProducts,
    getNewArrivals,
    getInStockProducts,
    getCategories,
    searchProducts,
  };
};
