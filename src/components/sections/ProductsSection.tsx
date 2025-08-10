import React, { useState } from 'react';
import { Section } from '@/types';
import { useProducts } from '@/hooks/useProducts';
import '@/themes/styles/sections/products-modern.css';
import '@/themes/styles/sections/all-remaining-ultra-modern.css';
import '@/themes/styles/sections/products-section-styles.css';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye, Heart, Star, Search, Filter, Grid, List, X } from 'lucide-react';

interface ProductsSectionProps {
  section: Section;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ section }) => {
  const { title } = section.content;

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'products-modern-grid',
      '2': 'products-modern-cards',
      '3': 'products-modern-list',
      '4': 'products-modern-minimal',
      '5': 'products-modern-bordered',
      '6': 'products-modern-gradient',
      '7': 'products-modern-compact',
      '8': 'products-modern-asymmetric',
      '9': 'products-modern-typography',
      '10': 'products-modern-split',
      '11': 'products-modern-showcase',
      // Existing ultra-modern styles (12+)
      '12': 'products-floating-glass',
      '13': 'products-holographic-showcase',
      '14': 'products-neon-catalog',
      '15': 'products-particle-bg',
      '16': 'products-morphing-cards',
      '17': 'products-cyber-grid',
      '18': 'products-liquid-metal',
      '19': 'products-aurora-bg',
      '20': 'products-matrix-rain',
      '21': 'products-quantum-field',
      '22': 'products-neural-network',
      '23': 'products-hologram-effect',
      '24': 'products-energy-waves',
      '25': 'products-digital-rain',
      '26': 'products-mosaic-layout'
    };
    return styleMap[styleNumber] || 'products-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');
  const [view, setView] = useState('grid');

  // Use dynamic content from products admin module
  const { products, loading, error, getFeaturedProducts } = useProducts();

  const defaultProducts = [
    {
      id: '1',
      name: 'School Uniform',
      category: 'Clothing',
      price: 50.00,
      originalPrice: 60.00,
      description: 'High-quality school uniform with comfortable fabric and durable construction.',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=300&fit=crop',
      inStock: true,
      stockQuantity: 25,
      featured: true,
      status: 'active'
    },
    {
      id: '2',
      name: 'Textbook Set - Grade 10',
      category: 'Books',
      price: 120.00,
      originalPrice: 150.00,
      description: 'Complete set of textbooks for Grade 10 students covering all subjects.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      inStock: true,
      stockQuantity: 15,
      featured: true,
      status: 'active'
    },
    {
      id: '3',
      name: 'Premium School Bag',
      category: 'Accessories',
      price: 35.00,
      originalPrice: 45.00,
      description: 'Durable and spacious school bag with multiple compartments and ergonomic design.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
      inStock: true,
      stockQuantity: 30,
      featured: false,
      status: 'active'
    },
    {
      id: '4',
      name: 'Scientific Calculator',
      category: 'Electronics',
      price: 25.00,
      originalPrice: 30.00,
      description: 'Advanced scientific calculator perfect for mathematics and science courses.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
      inStock: true,
      stockQuantity: 20,
      featured: true,
      status: 'active'
    },
    {
      id: '5',
      name: 'Art Supply Kit',
      category: 'Supplies',
      price: 40.00,
      originalPrice: 50.00,
      description: 'Complete art supply kit including pencils, paints, brushes, and drawing paper.',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
      inStock: true,
      stockQuantity: 12,
      featured: false,
      status: 'active'
    },
    {
      id: '6',
      name: 'Sports Equipment Set',
      category: 'Sports',
      price: 80.00,
      originalPrice: 100.00,
      description: 'Essential sports equipment for physical education classes and recreational activities.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      inStock: false,
      stockQuantity: 0,
      featured: true,
      status: 'active'
    }
  ];

  // Use dynamic content if available, otherwise use defaults
  const productItems = products && products.length > 0 ? products : defaultProducts;

  const renderProduct = (product: any, index: number) => {
    const productImage = product.image || 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=300&fit=crop';

    return (
      <div key={product.id || index} className="product-card">
        <img
          src={productImage}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=300&fit=crop';
          }}
        />
        <div className="product-title">{product.name}</div>
        <div className="product-category">{product.category}</div>
        <div className="product-price">
          <span className="current-price">${product.price}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="original-price">${product.originalPrice}</span>
          )}
        </div>
        <div className="product-stock">
          {product.inStock ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
        </div>
        {product.description && <div className="product-description">{product.description}</div>}
      </div>
    );
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="products-container">
          <div className="loading-state">Loading products...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="products-container">
          <div className="error-state">Error loading products. Showing default products.</div>
          <div className="products-container">
            {defaultProducts.map(renderProduct)}
          </div>
        </div>
      );
    }

    switch (styleId) {
      case 'products-sliding-carousel':
        return (
          <div className="products-container">
            <div className="carousel-track">
              {productItems.map(renderProduct)}
              {/* Duplicate for seamless loop */}
              {productItems.map((product, index) => renderProduct(product, index + productItems.length))}
            </div>
          </div>
        );
      case 'products-minimal-lines':
        return (
          <div className="products-container">
            {productItems.map(renderProduct)}
          </div>
        );
      default:
        return (
          <div className="products-container">
            {productItems.map(renderProduct)}
          </div>
        );
    }
  }

  return (
    <section className={`products-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default ProductsSection;