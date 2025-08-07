import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/gallery-modern.css';
import '@/themes/styles/sections/gallery.css';
import sdk from '@/lib/sdk-config';
import { useSchool } from '@/contexts/SchoolContext';

interface GallerySectionProps {
  section: Section;
}

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category?: string;
  tags?: string[];
  uploadedAt: string;
  schoolId: string;
  status: 'active' | 'inactive';
}

const GallerySection: React.FC<GallerySectionProps> = ({ section }) => {
  const { title, imagesLimit = 12 } = section.content;
  const { school } = useSchool();

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'gallery-modern-grid',
      '2': 'gallery-modern-masonry',
      '3': 'gallery-modern-cards',
      '4': 'gallery-modern-minimal',
      '5': 'gallery-modern-hexagon',
      '6': 'gallery-modern-bordered',
      '7': 'gallery-modern-staggered',
      '8': 'gallery-modern-polaroid',
      '9': 'gallery-modern-mosaic',
      '10': 'gallery-modern-circular',
      '11': 'gallery-modern-asymmetric',
      // Existing styles (12+)
      '12': 'gallery-lightbox-grid',
      '13': 'gallery-masonry',
      '14': 'gallery-carousel',
      '15': 'gallery-lightbox',
      '16': 'gallery-tiles',
      '17': 'gallery-slider',
      '18': 'gallery-collage',
      '19': 'gallery-pinterest',
      '20': 'gallery-justified',
      '21': 'gallery-cube',
      '22': 'gallery-flip',
      '23': 'gallery-zoom',
      '24': 'gallery-fade',
      '25': 'gallery-stack',
      '26': 'gallery-parallax'
    };
    return styleMap[styleNumber] || 'gallery-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');
  const [activeTab, setActiveTab] = useState('All');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultImages = [
    {
      id: '1',
      title: 'School Campus',
      imageUrl: 'https://via.placeholder.com/400x300?text=School+Campus',
      category: 'Campus',
      uploadedAt: new Date().toISOString(),
      schoolId: school?.id || '',
      status: 'active' as const
    },
    {
      id: '2',
      title: 'Students in Class',
      imageUrl: 'https://via.placeholder.com/400x300?text=Students+in+Class',
      category: 'Academic',
      uploadedAt: new Date().toISOString(),
      schoolId: school?.id || '',
      status: 'active' as const
    },
    {
      id: '3',
      title: 'Library',
      imageUrl: 'https://via.placeholder.com/400x300?text=Library',
      category: 'Facilities',
      uploadedAt: new Date().toISOString(),
      schoolId: school?.id || '',
      status: 'active' as const
    },
    {
      id: '4',
      title: 'Sports Field',
      imageUrl: 'https://via.placeholder.com/400x300?text=Sports+Field',
      category: 'Sports',
      uploadedAt: new Date().toISOString(),
      schoolId: school?.id || '',
      status: 'active' as const
    },
    {
      id: '5',
      title: 'Science Lab',
      imageUrl: 'https://via.placeholder.com/400x300?text=Science+Lab',
      category: 'Academic',
      uploadedAt: new Date().toISOString(),
      schoolId: school?.id || '',
      status: 'active' as const
    },
    {
      id: '6',
      title: 'Graduation Ceremony',
      imageUrl: 'https://via.placeholder.com/400x300?text=Graduation+Ceremony',
      category: 'Events',
      uploadedAt: new Date().toISOString(),
      schoolId: school?.id || '',
      status: 'active' as const
    },
  ];

  useEffect(() => {
    const fetchImages = async () => {
      if (!school) return;
      setLoading(true);
      try {
        const allImages = await sdk.get<GalleryImage>('gallery');
        const schoolImages = allImages
          .filter((image: GalleryImage) =>
            image.schoolId === school.id &&
            image.status === 'active'
          )
          .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
          .slice(0, imagesLimit);

        setImages(schoolImages.length > 0 ? schoolImages : defaultImages);
      } catch (error) {
        console.error('Failed to fetch gallery images:', error);
        setImages(defaultImages);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [school, imagesLimit]);

  const galleryImages = images;
  
  const categories = ['All', ...new Set(galleryImages.map((img: GalleryImage) => img.category).filter(Boolean))];

  const filteredImages = activeTab === 'All'
    ? galleryImages
    : galleryImages.filter((img: GalleryImage) => img.category === activeTab);

  const renderImage = (image: GalleryImage, index: number) => (
    <div key={image.id} className="gallery-item">
      <img
        src={image.thumbnailUrl || image.imageUrl}
        alt={image.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="gallery-overlay">
        <h4 className="gallery-title">{image.title}</h4>
        {image.description && (
          <p className="gallery-description">{image.description}</p>
        )}
      </div>
    </div>
  );
  
  const renderContent = () => {
    if (loading) {
      return <div className="loading-state">Loading gallery...</div>;
    }

    if (galleryImages.length === 0) {
      return <div className="empty-state">No images available.</div>;
    }

    if (styleId === 'gallery-tabs-by-album') {
      return (
        <div>
          <div className="tabs flex justify-center gap-4 mb-8">
            {categories.map((category: string) => (
              <button
                key={category}
                className={`tab ${activeTab === category ? 'active' : ''}`}
                onClick={() => setActiveTab(category)}
              >
                {category}
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