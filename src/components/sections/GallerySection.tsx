import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/gallery.css';

interface GallerySectionProps {
  section: Section;
}

const GallerySection: React.FC<GallerySectionProps> = ({ section }) => {
  const { title, images } = section.content;
  const styleId = section.styleId || 'gallery-lightbox-grid';

  const defaultImages = [
    { src: 'https://via.placeholder.com/400x300?text=Image+1', alt: 'Image 1' },
    { src: 'https://via.placeholder.com/400x300?text=Image+2', alt: 'Image 2' },
    { src: 'https://via.placeholder.com/400x300?text=Image+3', alt: 'Image 3' },
    { src: 'https://via.placeholder.com/400x300?text=Image+4', alt: 'Image 4' },
    { src: 'https://via.placeholder.com/400x300?text=Image+5', alt: 'Image 5' },
    { src: 'https://via.placeholder.com/400x300?text=Image+6', alt: 'Image 6' },
  ];

  const galleryImages = images && images.length > 0 ? images : defaultImages;

  const renderImage = (image: any, index: number) => (
    <div key={index} className="gallery-item">
      <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
    </div>
  );

  return (
    <section className={`gallery-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="gallery-container">
          {galleryImages.map(renderImage)}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;