import React from 'react';
import { useState } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/gallery.css';

interface GallerySectionProps {
  section: Section;
}

const GallerySection: React.FC<GallerySectionProps> = ({ section }) => {
  const { title, images } = section.content;
  const styleId = section.styleId || 'gallery-lightbox-grid';
  const [activeTab, setActiveTab] = useState('All');

  const defaultImages = [
    { src: 'https://via.placeholder.com/400x300?text=Image+1', alt: 'Image 1', album: 'Nature' },
    { src: 'https://via.placeholder.com/400x300?text=Image+2', alt: 'Image 2', album: 'People' },
    { src: 'https://via.placeholder.com/400x300?text=Image+3', alt: 'Image 3', album: 'Nature' },
    { src: 'https://via.placeholder.com/400x300?text=Image+4', alt: 'Image 4', album: 'Architecture' },
    { src: 'https://via.placeholder.com/400x300?text=Image+5', alt: 'Image 5', album: 'People' },
    { src: 'https://via.placeholder.com/400x300?text=Image+6', alt: 'Image 6', album: 'Architecture' },
  ];

  const galleryImages = images && images.length > 0 ? images : defaultImages;
  
  const albums = ['All', ...new Set(galleryImages.map((img: any) => img.album))];
  
  const filteredImages = activeTab === 'All'
    ? galleryImages
    : galleryImages.filter((img: any) => img.album === activeTab);

  const renderImage = (image: any, index: number) => (
    <div key={index} className="gallery-item">
      <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
    </div>
  );
  
  const renderContent = () => {
    if (styleId === 'gallery-tabs-by-album') {
      return (
        <div>
          <div className="tabs flex justify-center gap-4 mb-8">
            {albums.map((album: string) => (
              <button key={album} className={`tab ${activeTab === album ? 'active' : ''}`} onClick={() => setActiveTab(album)}>
                {album}
              </button>
            ))}
          </div>
          <div className="gallery-container grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredImages.map(renderImage)}
          </div>
        </div>
      )
    }

    return (
      <div className="gallery-container grid grid-cols-2 md:grid-cols-3 gap-4">
        {galleryImages.map(renderImage)}
      </div>
    )
  }

  return (
    <section className={`gallery-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default GallerySection;