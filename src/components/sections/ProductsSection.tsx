import React from 'react';
import { useState } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/products.css';
import { Button } from '@/components/ui/button';
import { List, Grid } from 'lucide-react';

interface ProductsSectionProps {
  section: Section;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ section }) => {
  const { title, products } = section.content;
  const styleId = section.styleId || 'products-card-grid';
  const [view, setView] = useState('grid');

  const defaultProducts = [
    { name: 'School Uniform', price: '50.00', image: 'https://via.placeholder.com/300x200?text=Uniform', link: '#' },
    { name: 'Textbook Set', price: '120.00', image: 'https://via.placeholder.com/300x200?text=Textbooks', link: '#' },
    { name: 'School Bag', price: '35.00', image: 'https://via.placeholder.com/300x200?text=School+Bag', link: '#' },
  ];

  const productItems = products && products.length > 0 ? products : defaultProducts;

  const renderProduct = (product: any, index: number) => {
    if (view === 'list') {
      return (
        <div key={index} className="product-list-item flex items-center gap-4">
          <img src={product.image} alt={product.name} className="w-24 h-24 object-cover" />
          <div>
            <h3 className="product-title">{product.name}</h3>
            <p className="product-price">${product.price}</p>
          </div>
          <Button asChild className="ml-auto">
            <a href={product.link}>View</a>
          </Button>
        </div>
      )
    }

    return (
      <div key={index} className="product-card">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="card-content">
          <h3 className="product-title">{product.name}</h3>
          <p className="product-price">${product.price}</p>
          <Button asChild className="cta-button">
            <a href={product.link}>View Details</a>
          </Button>
        </div>
      </div>
    );
  };
  
  const renderContent = () => {
    if (styleId === 'products-list-with-toggle') {
      return (
        <div>
          <div className="toggle-buttons flex justify-center gap-2 mb-8">
            <Button variant={view === 'grid' ? 'default' : 'outline'} onClick={() => setView('grid')}><Grid className="w-4 h-4" /></Button>
            <Button variant={view === 'list' ? 'default' : 'outline'} onClick={() => setView('list')}><List className="w-4 h-4" /></Button>
          </div>
          <div className={`products-container ${view === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-8' : 'flex flex-col gap-4'}`}>
            {productItems.map(renderProduct)}
          </div>
        </div>
      )
    }

    return (
       <div className="products-container grid grid-cols-1 md:grid-cols-3 gap-8">
          {productItems.map(renderProduct)}
        </div>
    )
  }

  return (
    <section className={`products-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default ProductsSection;