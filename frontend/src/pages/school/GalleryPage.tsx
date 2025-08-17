import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { usePages } from '@/hooks/usePages';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import sdk from '@/lib/sdk-config';
import { Calendar, Clock, Users, BookOpen, Search, Filter, ArrowRight, ChevronLeft, ChevronRight, Image as ImageIcon, Play, Eye, Heart, Download } from 'lucide-react';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';




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

const GalleryPage = () => {
  const { school } = useSchool();
  const { schoolSlug } = useParams();
  const { pages } = usePages();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [categories, setCategories] = useState<string[]>([]);

  // Map old style names to new template system
  const getTemplateStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {
      'gallery-archive-style-1': 'template-style-1',
      'gallery-archive-style-2': 'template-style-2',
      'gallery-archive-style-3': 'template-style-3',
      'gallery-archive-style-4': 'template-style-4',
      'gallery-archive-style-5': 'template-style-5',
      'gallery-archive-style-6': 'template-style-6',
      'gallery-archive-style-7': 'template-style-7',
      'gallery-archive-style-8': 'template-style-8',
      'gallery-archive-style-9': 'template-style-9',
      'gallery-archive-style-10': 'template-style-10',
      'gallery-archive-style-11': 'template-style-11',
      'gallery-archive-style-12': 'template-style-12',
      'gallery-archive-style-13': 'template-style-13',
      'gallery-archive-style-14': 'template-style-14',
      'gallery-archive-style-15': 'template-style-15',
    };
    return styleMap[styleId] || 'template-style-1';
  };

  const galleryArchiveStyle = school?.galleryArchiveStyle || 'gallery-archive-style-1';
  const templateStyle = getTemplateStyle(galleryArchiveStyle);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchItems = async () => {
      if (school) {
        setLoading(true);
        try {
          const allItems = await sdk.get<GalleryItem>('gallery');
          const schoolItems = allItems.filter((i: GalleryItem) =>
            i.schoolId === school.id && i.status === 'published'
          );
          setItems(schoolItems);

          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(schoolItems.map(item => item.category).filter(Boolean))
          );
          setCategories(uniqueCategories);
        } catch (error) {
          console.error('Failed to fetch gallery items:', error);
          setItems([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchItems();
  }, [school]);

  useEffect(() => {
    let filtered = [...items];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popular':
          return b.views - a.views;
        case 'liked':
          return b.likes - a.likes;
        case 'newest':
        default:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
    });

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedCategory, selectedType, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const renderSearchAndFilters = () => (
    <div className="archive-search-bar">
      <div className="search-input-wrapper relative">
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search gallery..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input pl-10"
        />
      </div>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="sort-select"
      >
        <option value="all">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="sort-select"
      >
        <option value="all">All Types</option>
        <option value="image">Images</option>
        <option value="video">Videos</option>
      </select>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-select"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="title">By Title</option>
        <option value="popular">Most Popular</option>
        <option value="liked">Most Liked</option>
      </select>
    </div>
  );

  const renderGalleryItem = (item: GalleryItem, index?: number) => {
    // Default card layout for most templates
    return (
      <article key={item.id} className="post-card">
        <div className="relative">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="post-image"
            loading="lazy"
          />
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="h-12 w-12 text-white bg-black bg-opacity-50 rounded-full p-2" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            {item.type === 'video' ? (
              <Play className="h-6 w-6 text-white bg-black bg-opacity-50 rounded p-1" />
            ) : (
              <ImageIcon className="h-6 w-6 text-white bg-black bg-opacity-50 rounded p-1" />
            )}
          </div>
        </div>
        <div className="post-content">
          <div className="post-meta">
            <div className="post-meta-item">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(item.uploadedAt)}</span>
            </div>
            <div className="post-meta-item">
              <Eye className="h-4 w-4" />
              <span>{item.views} views</span>
            </div>
            <div className="post-meta-item">
              <Heart className="h-4 w-4" />
              <span>{item.likes} likes</span>
            </div>
          </div>
          <span className="post-category">{item.category}</span>
          <h2 className="post-title">
            <Link to={`/${schoolSlug}/gallery/${item.id}`}>
              {item.title}
            </Link>
          </h2>
          <p className="post-excerpt">{item.description}</p>
          <div className="gallery-details">
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Uploaded by:</strong> {item.uploadedBy}</p>
            {item.tags && item.tags.length > 0 && (
              <p><strong>Tags:</strong> {item.tags.slice(0, 3).join(', ')}</p>
            )}
          </div>
          <Link to={`/${schoolSlug}/gallery/${item.id}`} className="read-more">
            View {item.type === 'video' ? 'Video' : 'Image'} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    );
  };

  if (!school) return <div className="loading-state">Loading...</div>;

  return (
    <div className={`page-template ${templateStyle}`}>
      <SchoolHeader school={school} pages={pages} />
      <main className="archive-container">
        <div className="archive-header">
          <h1 className="archive-title">Gallery</h1>
          <p className="archive-description">
            Explore our collection of images and videos showcasing school life and activities
          </p>
        </div>

        {renderSearchAndFilters()}
        
        {loading ? (
          <div className="loading-state">Loading gallery...</div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <h3>No gallery items found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {paginatedItems.map((item, index) => renderGalleryItem(item, index))}
          </div>
        )}
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default GalleryPage;
