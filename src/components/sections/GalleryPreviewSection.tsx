import React, { useState } from 'react';
import { Section, GalleryImage } from '@/types';
import '@/themes/styles/sections/gallery-preview.css';

interface GalleryPreviewSectionProps {
  section: Section;
}

const GalleryPreviewSection: React.FC<GalleryPreviewSectionProps> = ({ section }) => {
  const { title, images, featuredImage } = section.content;
  const styleId = section.styleId || 'gallery_preview-grid-display';
  const [activeImage, setActiveImage] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isGridView, setIsGridView] = useState(true);

  const defaultImages: GalleryImage[] = [
    { src: 'https://via.placeholder.com/400x300', alt: 'Placeholder 1', caption: 'Caption 1', category: 'Nature' },
    { src: 'https://via.placeholder.com/400x300', alt: 'Placeholder 2', caption: 'Caption 2', category: 'City' },
    { src: 'https://via.placeholder.com/400x300', alt: 'Placeholder 3', caption: 'Caption 3', category: 'Nature' },
    { src: 'https://via.placeholder.com/400x300', alt: 'Placeholder 4', caption: 'Caption 4', category: 'People' },
  ];

  const imageItems: GalleryImage[] = images && images.length > 0 ? images : defaultImages;
  const categories = ['All', ...Array.from(new Set(imageItems.map(i => i.category || 'Other')))];

  const renderImage = (image: GalleryImage, index: number) => {
    const imageContent = (
      <>
        <img src={image.src} alt={image.alt} className="w-full h-auto" />
        {image.caption && <div className="caption">{image.caption}</div>}
      </>
    );

    switch(styleId) {
        case 'gallery_preview-accordion-gallery':
            return <details key={index} className="gallery-item"><summary>{image.caption || `Image ${index + 1}`}</summary><img src={image.src} alt={image.alt} /></details>;
        case 'gallery_preview-show-hide-box':
            return <details key={index} className="gallery-item"><summary>Show/Hide</summary>{imageContent}</details>;
        default:
            return <div key={index} className="gallery-item">{imageContent}</div>;
    }
  };

  const renderContent = () => {
    const filteredImages = activeCategory === 'All' ? imageItems : imageItems.filter(i => i.category === activeCategory);

    switch(styleId) {
        case 'gallery_preview-toggle-layouts':
            return (
                <>
                    <div className="layout-toggle"><button onClick={() => setIsGridView(!isGridView)}>{isGridView ? 'List View' : 'Grid View'}</button></div>
                    <div className={`gallery-container ${isGridView ? 'grid-view' : 'list-view'}`}>{imageItems.map(renderImage)}</div>
                </>
            );
        case 'gallery_preview-dot-nav-carousel':
        case 'gallery_preview-slide-layout':
            return (
                <div className="gallery-container">
                    {imageItems.map((image, index) => <div key={index} className={`gallery-item ${index === activeImage ? 'active' : ''}`}>{renderImage(image, index)}</div>)}
                    <div className="dot-nav">{imageItems.map((_, index) => <button key={index} onClick={() => setActiveImage(index)} className={index === activeImage ? 'active' : ''} />)}</div>
                </div>
            );
        case 'gallery_preview-tabbed-sets':
            return (
                 <>
                    <div className="tab-buttons">{categories.map(c => <button key={c} onClick={() => setActiveCategory(c)} className={activeCategory === c ? 'active' : ''}>{c}</button>)}</div>
                    <div className="gallery-container">{filteredImages.map(renderImage)}</div>
                </>
            );
        case 'gallery_preview-showcase-strip':
             return (
                <div>
                  <img src={featuredImage || imageItems[activeImage]?.src} alt="Featured" className="featured-image" />
                  <div className="thumbnail-strip">{imageItems.map((img, i) => <img key={i} src={img.src} alt={img.alt} onClick={() => setActiveImage(i)} className={i === activeImage ? 'active' : ''} />)}</div>
                </div>
            );
        default:
            return <div className="gallery-container">{imageItems.map(renderImage)}</div>;
    }
  };

  return (
    <section className={`gallery-preview-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default GalleryPreviewSection;