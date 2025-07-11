import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/products.css';
import { Button } from '@/components/ui/button';

interface ProductsSectionProps {
  section: Section;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ section }) => {
  const { title, products } = section.content;
  const styleId = section.styleId || 'products-card-grid';

  const defaultProducts = [
    { name: 'School Uniform', price: '50.00', image: 'https://via.placeholder.com/300x200?text=Uniform', link: '#' },
    { name: 'Textbook Set', price: '120.00', image: 'https://via.placeholder.com/300x200?text=Textbooks', link: '#' },
    { name: 'School Bag', price: '35.00', image: 'https://via.placeholder.com/300x200?text=School+Bag', link: '#' },
  ];

  const productItems = products && products.length > 0 ? products : defaultProducts;

  const renderProduct = (product: any, index: number) => (
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

  return (
    <section className={`products-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="products-container">
          {productItems.map(renderProduct)}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;