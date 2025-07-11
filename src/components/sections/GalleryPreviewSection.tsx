import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/gallery-preview.css';

interface GalleryPreviewSectionProps {
  section: Section;
}

const GalleryPreviewSection: React.FC<GalleryPreviewSectionProps> = ({ section }) => {
  const { title, images } = section.content;
  const styleId = section.styleId || 'gallery_preview-grid-display';

  const defaultImages = [
    { src: 'https://via.placeholder.com/400x300', alt: 'Placeholder Image 1', caption: 'First Image' },
    { src: 'https://via.placeholder.com/400x300', alt: 'Placeholder Image 2', caption: 'Second Image' },
    { src: 'https://via.placeholder.com/400x300', alt: 'Placeholder Image 3', caption: 'Third Image' },
    { src: 'https://via.placeholder.com/400x300', alt: 'Placeholder Image 4', caption: 'Fourth Image' },
  ];

  const imageItems = images && images.length > 0 ? images : defaultImages;

  const renderImage = (image: any, index: number) => (
    <div key={index} className="gallery-item">
      <img src={image.src} alt={image.alt} className="w-full h-auto" />
      {image.caption && <div className="caption">{image.caption}</div>}
    </div>
  );

  return (
    <section className={`gallery-preview-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="gallery-container">
          {imageItems.map(renderImage)}
        </div>
      </div>
    </section>
  );
};

export default GalleryPreviewSection;