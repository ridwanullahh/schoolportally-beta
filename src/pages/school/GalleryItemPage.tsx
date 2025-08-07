import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import { usePages } from '@/hooks/usePages';
import sdk from '@/lib/sdk-config';
import { Calendar, Clock, Eye, Heart, Download, Share2, Facebook, Twitter, Linkedin, Play, Image as ImageIcon } from 'lucide-react';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import '@/themes/styles/pages/single-post-modern.css';
import '@/themes/styles/pages/single-post-templates-ultra-modern.css';

interface GalleryItem {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  imageUrl: string;
  type: 'image' | 'video';
  category: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  views: number;
  likes: number;
  featured: boolean;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt?: string;
}

const GalleryItemPage = () => {
  const { itemId, schoolSlug } = useParams();
  const { school } = useSchool();
  const { pages } = usePages();
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const itemContentRef = useRef<HTMLDivElement>(null);

  // Map old style names to new template system
  const getTemplateStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {
      'gallery-post-style-1': 'single-post-style-1',
      'gallery-post-style-2': 'single-post-style-2',
      'gallery-post-style-3': 'single-post-style-3',
      'gallery-post-style-4': 'single-post-style-4',
      'gallery-post-style-5': 'single-post-style-5',
      'gallery-post-style-6': 'single-post-style-6',
      'gallery-post-style-7': 'single-post-style-7',
      'gallery-post-style-8': 'single-post-style-8',
      'gallery-post-style-9': 'single-post-style-9',
      'gallery-post-style-10': 'single-post-style-10',
      'gallery-post-style-11': 'single-post-style-11',
      'gallery-post-style-12': 'single-post-style-12',
      'gallery-post-style-13': 'single-post-style-13',
      'gallery-post-style-14': 'single-post-style-14',
      'gallery-post-style-15': 'single-post-style-15',
    };
    return styleMap[styleId] || 'single-post-style-1';
  };

  const galleryPostStyle = school?.galleryPostStyle || 'gallery-post-style-1';
  const templateStyle = getTemplateStyle(galleryPostStyle);

  useEffect(() => {
    const fetchItem = async () => {
      if (school && itemId) {
        setLoading(true);
        try {
          const allItems = await sdk.get<GalleryItem>('gallery');
          const schoolItems = allItems.filter((i: GalleryItem) =>
            i.schoolId === school.id && i.status === 'published'
          );

          const currentItem = schoolItems.find((i: GalleryItem) => i.id === itemId);
          setItem(currentItem || null);

          // Get related items (same category)
          if (currentItem) {
            const related = schoolItems
              .filter((i: GalleryItem) =>
                i.id !== currentItem.id && 
                i.category === currentItem.category
              )
              .slice(0, 3);
            setRelatedItems(related);
          }
        } catch (error) {
          console.error('Failed to fetch gallery item:', error);
          setItem(null);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchItem();
  }, [school, itemId]);

  useEffect(() => {
    const handleScroll = () => {
      if (itemContentRef.current) {
        const element = itemContentRef.current;
        const scrollTop = window.pageYOffset;
        const docHeight = element.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        setScrollProgress(Math.min(scrollPercent * 100, 100));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderItemMeta = () => (
    <div className="post-meta">
      <div className="post-meta-item">
        <Calendar className="h-4 w-4" />
        <span>{formatDate(item!.uploadedAt)}</span>
      </div>
      <div className="post-meta-item">
        {item!.type === 'video' ? <Play className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
        <span>{item!.type}</span>
      </div>
      <div className="post-meta-item">
        <Eye className="h-4 w-4" />
        <span>{item!.views || 0} views</span>
      </div>
      <div className="post-meta-item">
        <Heart className="h-4 w-4" />
        <span>{item!.likes || 0} likes</span>
      </div>
    </div>
  );

  const renderItemContent = () => (
    <div className="post-content" ref={itemContentRef}>
      <div className="gallery-item-display">
        {item!.type === 'video' ? (
          <video controls className="w-full max-h-96 object-contain">
            <source src={item!.imageUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={item!.imageUrl}
            alt={item!.title}
            className="w-full max-h-96 object-contain"
          />
        )}
      </div>
      <div className="item-description">
        <p>{item!.description}</p>
        {item!.tags && item!.tags.length > 0 && (
          <div className="tags">
            <h4>Tags:</h4>
            <div className="tag-list">
              {item!.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSocialShare = () => {
    const itemUrl = `${window.location.origin}/${schoolSlug}/gallery/${item!.id}`;
    const shareText = `Check out this ${item!.type}: ${item!.title}`;

    return (
      <div className="social-share">
        <h3>Share this {item!.type}</h3>
        <div className="social-share-buttons">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(itemUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-share-btn facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(itemUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-share-btn twitter"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(itemUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-share-btn linkedin"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = item!.imageUrl;
              link.download = item!.title;
              link.click();
            }}
            className="social-share-btn download"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderRelatedItems = () => {
    if (relatedItems.length === 0) return null;

    return (
      <div className="related-posts">
        <h3>Related {item!.type === 'video' ? 'Videos' : 'Images'}</h3>
        <div className="related-posts-grid">
          {relatedItems.map(relatedItem => (
            <div key={relatedItem.id} className="related-post-card">
              <img
                src={relatedItem.imageUrl}
                alt={relatedItem.title}
                className="related-post-image"
              />
              <div className="related-post-content">
                <h4 className="related-post-title">
                  <a href={`/${schoolSlug}/gallery/${relatedItem.id}`}>
                    {relatedItem.title}
                  </a>
                </h4>
                <p className="related-post-meta">
                  {formatDate(relatedItem.uploadedAt)} • {relatedItem.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderItemLayout = () => {
    switch (templateStyle) {
      case 'single-post-style-2':
        return (
          <>
            <div
              className="post-hero"
              style={{ backgroundImage: `url(${item!.imageUrl})` }}
            >
              <div className="post-hero-content">
                <h1 className="post-title">{item!.title}</h1>
                {renderItemMeta()}
              </div>
            </div>
            <div className="post-container">
              {renderItemContent()}
              {renderSocialShare()}
              {renderRelatedItems()}
            </div>
          </>
        );

      case 'single-post-style-3':
        return (
          <div className="main-content">
            <div className="post-article">
              <h1 className="post-title">{item!.title}</h1>
              {renderItemMeta()}
              {renderItemContent()}
              {renderSocialShare()}
            </div>
            <div className="sidebar">
              <div className="sidebar-widget">
                <h3 className="widget-title">Item Details</h3>
                <div className="item-details">
                  <p><strong>Type:</strong> {item!.type}</p>
                  <p><strong>Category:</strong> {item!.category}</p>
                  <p><strong>Uploaded:</strong> {formatDate(item!.uploadedAt)}</p>
                  <p><strong>Views:</strong> {item!.views || 0}</p>
                  <p><strong>Likes:</strong> {item!.likes || 0}</p>
                </div>
              </div>
              {relatedItems.length > 0 && (
                <div className="sidebar-widget">
                  <h3 className="widget-title">Related Items</h3>
                  <div className="related-items-sidebar">
                    {relatedItems.map(relatedItem => (
                      <div key={relatedItem.id} className="related-item">
                        <h4>
                          <a href={`/${schoolSlug}/gallery/${relatedItem.id}`}>
                            {relatedItem.title}
                          </a>
                        </h4>
                        <p>{formatDate(relatedItem.uploadedAt)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="post-container">
            <div className="post-header">
              <h1 className="post-title">{item!.title}</h1>
              {renderItemMeta()}
            </div>
            {renderItemContent()}
            {renderSocialShare()}
            {renderRelatedItems()}
          </div>
        );
    }
  };

  if (loading) {
    return <div className="loading-state">Loading gallery item...</div>;
  }

  if (!item) {
    return (
      <div className="error-state">
        <h2>Item not found</h2>
        <p>The gallery item you're looking for doesn't exist or has been removed.</p>
        <a href={`/${schoolSlug}/gallery`} className="btn btn-primary">
          View Gallery
        </a>
      </div>
    );
  }

  return (
    <div className={`single-post-page ${templateStyle}`}>
      {templateStyle === 'single-post-style-6' && (
        <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />
      )}
      <SchoolHeader school={school} pages={pages} />
      <main className="container mx-auto px-4 py-8">
        {renderItemLayout()}
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default GalleryItemPage;
