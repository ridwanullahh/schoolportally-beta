import React, { useState } from 'react';
import { Section } from '@/types';
import { useGallery, GalleryImage } from '@/hooks/useGallery';



interface GalleryPreviewSectionProps {
  section: Section;
}

const GalleryPreviewSection: React.FC<GalleryPreviewSectionProps> = ({ section }) => {
  const { title, images, featuredImage } = section.content;
  const { getRecentImages, loading } = useGallery();

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'gallery-preview-modern-grid',
      '2': 'gallery-preview-modern-masonry',
      '3': 'gallery-preview-modern-featured',
      '4': 'gallery-preview-modern-cards',
      '5': 'gallery-preview-modern-minimal',
      '6': 'gallery-preview-modern-bordered',
      '7': 'gallery-preview-modern-gradient',
      '8': 'gallery-preview-modern-compact',
      '9': 'gallery-preview-modern-asymmetric',
      '10': 'gallery-preview-modern-typography',
      '11': 'gallery-preview-modern-slider',
      // Existing ultra-modern styles (12+)
      '12': 'gallery-floating-masonry',
      '13': 'gallery-holographic-grid',
      '14': 'gallery-neon-showcase',
      '15': 'gallery-particle-bg',
      '16': 'gallery-morphing-tiles',
      '17': 'gallery-cyber-grid',
      '18': 'gallery-liquid-metal',
      '19': 'gallery-aurora-bg',
      '20': 'gallery-matrix-rain',
      '21': 'gallery-quantum-field',
      '22': 'gallery-neural-network',
      '23': 'gallery-hologram-effect',
      '24': 'gallery-energy-waves',
      '25': 'gallery-digital-rain',
      '26': 'gallery-mosaic-layout'
    };
    return styleMap[styleNumber] || 'gallery-preview-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');
  const [activeImage, setActiveImage] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isGridView, setIsGridView] = useState(true);

  const defaultImages: GalleryImage[] = [
    {
      id: '1',
      schoolId: '',
      title: 'School Campus',
      description: 'Beautiful view of our main campus building',
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=150&fit=crop',
      category: 'Campus',
      tags: ['campus', 'building', 'architecture'],
      uploadedAt: '2024-01-15T00:00:00Z',
      status: 'active',
      featured: true,
      createdAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      schoolId: '',
      title: 'Science Laboratory',
      description: 'State-of-the-art science lab facilities',
      imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=150&fit=crop',
      category: 'Facilities',
      tags: ['science', 'laboratory', 'education'],
      uploadedAt: '2024-01-10T00:00:00Z',
      status: 'active',
      featured: false,
      createdAt: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      schoolId: '',
      title: 'Library Reading Area',
      description: 'Quiet study spaces in our modern library',
      imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=150&fit=crop',
      category: 'Facilities',
      tags: ['library', 'study', 'books'],
      uploadedAt: '2024-01-05T00:00:00Z',
      status: 'active',
      featured: false,
      createdAt: '2024-01-05T00:00:00Z'
    },
    {
      id: '4',
      schoolId: '',
      title: 'Sports Complex',
      description: 'Our comprehensive sports and fitness facilities',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop',
      category: 'Sports',
      tags: ['sports', 'fitness', 'gymnasium'],
      uploadedAt: '2024-01-01T00:00:00Z',
      status: 'active',
      featured: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
  ];

  // Get recent images from admin module or use defaults
  const recentImages = getRecentImages(8);

  // Use images from section content, recent images, or defaults
  const imageItems = images && images.length > 0
    ? images
    : recentImages.length > 0
    ? recentImages
    : defaultImages;

  const categories = ['All', ...Array.from(new Set(imageItems.map(i => i.category || 'Other')))];

  const renderImage = (image: GalleryImage, index: number) => {
    const imageContent = (
      <>
        <img
          src={image.thumbnailUrl || image.imageUrl}
          alt={image.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop';
          }}
        />
        {image.title && <p className="caption">{image.title}</p>}
      </>
    );

    switch(styleId) {
      case 'gallery-sliding-lightbox':
        return (
          <div
            key={index}
            className={`gallery-item ${index === activeImage ? 'active' : index === activeImage - 1 ? 'prev' : ''}`}
          >
            <img
              src={image.imageUrl}
              alt={image.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop';
              }}
            />
            {image.title && <p className="caption">{image.title}</p>}
          </div>
        );
      case 'gallery-hexagon-grid':
      case 'gallery-circular-frames':
        return (
          <div key={index} className="gallery-item">
            <div className="image-frame">
              <img
                src={image.thumbnailUrl || image.imageUrl}
                alt={image.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=400&fit=crop';
                }}
              />
            </div>
            {image.title && <p className="caption">{image.title}</p>}
          </div>
        );
      default:
        return (
          <div key={index} className="gallery-item">
            {imageContent}
          </div>
        );
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        </div>
      );
    }

    if (imageItems.length === 0) {
      return (
        <div className="empty-state text-center py-12">
          <p className="text-brand-text-secondary">No images available at the moment.</p>
        </div>
      );
    }

    const filteredImages = activeCategory === 'All' ? imageItems : imageItems.filter(i => i.category === activeCategory);

    switch(styleId) {
        case 'gallery-sliding-lightbox':
            return (
                <div className="gallery-container">
                    {imageItems.map(renderImage)}
                    <div className="lightbox-controls">
                        {imageItems.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImage(index)}
                                className={index === activeImage ? 'active' : ''}
                                aria-label={`View image ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            );
        default:
            return <div className="gallery-container">{filteredImages.map(renderImage)}</div>;
    }
  };

  return (
    <section className={`gallery-preview-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default GalleryPreviewSection;