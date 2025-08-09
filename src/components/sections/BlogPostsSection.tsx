import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Search, Filter, Calendar, User, ArrowRight, ChevronDown } from 'lucide-react';
import '@/themes/styles/sections/blog-posts-modern.css';
import '@/themes/styles/sections/blog-posts-ultra-modern.css';
import '@/themes/styles/sections/blog-section-styles.css';

interface BlogPostsSectionProps {
  section: Section;
}

const BlogPostsSection: React.FC<BlogPostsSectionProps> = ({ section }) => {
  const { content, settings } = section;
  const { posts, loading, error, getFeaturedPosts } = useBlogPosts();

  // Section settings with defaults
  const postsToShow = parseInt(settings?.postsToShow || '6');
  const enableSearch = settings?.enableSearch !== false;
  const enableFiltering = settings?.enableFiltering !== false;
  const enableSorting = settings?.enableSorting !== false;
  const enableLoadMore = settings?.enableLoadMore !== false;
  const showViewAllButton = settings?.showViewAllButton !== false;

  // State for controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [displayedPosts, setDisplayedPosts] = useState(postsToShow);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'blog-modern-grid',
      '2': 'blog-modern-cards',
      '3': 'blog-modern-display',
      '4': 'blog-modern-gallery',
      '5': 'blog-modern-showcase',
      '6': 'blog-modern-timeline',
      '7': 'blog-modern-masonry',
      '8': 'blog-modern-featured',
      '9': 'blog-modern-compact',
      '10': 'blog-modern-magazine',
      '11': 'blog-modern-slider',
      // Existing ultra-modern styles (12+)
      '12': 'blog-floating-glass',
      '13': 'blog-holographic-cards',
      '14': 'blog-neon-grid',
      '15': 'blog-particle-bg',
      '16': 'blog-morphing-cards',
      '17': 'blog-cyber-grid',
      '18': 'blog-liquid-metal',
      '19': 'blog-aurora-bg',
      '20': 'blog-matrix-rain',
      '21': 'blog-quantum-field',
      '22': 'blog-neural-network',
      '23': 'blog-hologram-effect',
      '24': 'blog-energy-waves',
      '25': 'blog-digital-rain',
      '26': 'blog-mosaic-layout'
    };
    return styleMap[styleNumber] || 'blog-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');

  // Get unique categories for filtering
  const getCategories = (postList: any[]) => {
    const categories = postList.map(post => post.category).filter(Boolean);
    return ['all', ...Array.from(new Set(categories))];
  };

  // Filter and search logic
  useEffect(() => {
    let result = posts && posts.length > 0 ? posts : defaultPosts;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(post => post.category === selectedCategory);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        default:
          return 0;
      }
    });

    setFilteredPosts(result);
  }, [posts, searchTerm, selectedCategory, sortBy]);

  const defaultPosts = [
    {
      id: '1',
      title: 'Welcome to Our New Academic Year',
      excerpt: 'We are excited to welcome all students back for another year of learning and growth.',
      author: 'Principal Johnson',
      publishedAt: '2024-11-20',
      category: 'News',
      tags: ['academic', 'welcome', 'students'],
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
      featured: true,
      status: 'published'
    },
    {
      id: '2',
      title: 'Science Fair Winners Announced',
      excerpt: 'Congratulations to all participants in this year\'s science fair. Here are our winners.',
      author: 'Dr. Smith',
      publishedAt: '2024-11-18',
      category: 'Events',
      tags: ['science', 'competition', 'students'],
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
      featured: false,
      status: 'published'
    },
    {
      id: '3',
      title: 'New Library Resources Available',
      excerpt: 'Our library has expanded its digital collection with new e-books and research databases.',
      author: 'Librarian Davis',
      publishedAt: '2024-11-15',
      category: 'Resources',
      tags: ['library', 'resources', 'digital'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      featured: true,
      status: 'published'
    },
    {
      id: '4',
      title: 'Sports Team Championships',
      excerpt: 'Our basketball team has won the regional championship. Read about their journey.',
      author: 'Coach Wilson',
      publishedAt: '2024-11-12',
      category: 'Sports',
      tags: ['sports', 'basketball', 'championship'],
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
      featured: false,
      status: 'published'
    },
    {
      id: '5',
      title: 'Art Exhibition Opening',
      excerpt: 'Student artwork will be displayed in our annual art exhibition next month.',
      author: 'Art Department',
      publishedAt: '2024-11-10',
      category: 'Arts',
      tags: ['art', 'exhibition', 'students'],
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      featured: true,
      status: 'published'
    },
    {
      id: '6',
      title: 'Technology Integration Program',
      excerpt: 'Learn about our new technology integration program and how it benefits students.',
      author: 'IT Department',
      publishedAt: '2024-11-08',
      category: 'Technology',
      tags: ['technology', 'education', 'innovation'],
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      featured: false,
      status: 'published'
    }
  ];

  // Get posts to display
  const postsToDisplay = filteredPosts.slice(0, displayedPosts);
  const hasMorePosts = filteredPosts.length > displayedPosts;
  const categories = getCategories(posts && posts.length > 0 ? posts : defaultPosts);

  const handleLoadMore = () => {
    setDisplayedPosts(prev => prev + postsToShow);
  };

  const renderPost = (post: any, index: number) => {
    const postImage = post.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop';

    return (
      <div key={post.id || index} className="blog-card">
        <img
          src={postImage}
          alt={post.title}
          className="blog-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop';
          }}
        />
        <div className="blog-content">
          <h3 className="blog-title">{post.title}</h3>
          {post.excerpt && <p className="blog-excerpt">{post.excerpt}</p>}
          <div className="blog-meta">
            <div className="blog-date">
              <Calendar size={14} />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="blog-category">{post.category}</div>
          </div>
          {post.author && (
            <div className="blog-author">
              <User size={14} />
              <span>By {post.author}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderControls = () => {
    if (!enableSearch && !enableFiltering && !enableSorting) return null;

    return (
      <div className="blog-controls">
        {enableSearch && (
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        )}

        <div className="filter-controls">
          {enableFiltering && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          )}

          {enableSorting && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
            </select>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="blog-grid">
          <div className="loading-state">Loading blog posts...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="blog-grid">
          <div className="error-state">Error loading posts. Showing default posts.</div>
        </div>
      );
    }

    // Render based on style
    switch (styleId) {
      case 'blog-modern-display':
        const featuredPost = postsToDisplay.find(post => post.featured) || postsToDisplay[0];
        const otherPosts = postsToDisplay.filter(post => post.id !== featuredPost?.id);

        return (
          <>
            {featuredPost && (
              <div className="featured-post">
                <div className="featured-content">
                  <div className="featured-image" style={{
                    backgroundImage: `url(${featuredPost.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop'})`
                  }}></div>
                  <div className="featured-text">
                    <h3 className="featured-title">{featuredPost.title}</h3>
                    <p className="blog-excerpt">{featuredPost.excerpt}</p>
                    <div className="blog-meta">
                      <div className="blog-date">
                        <Calendar size={14} />
                        <span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="blog-category">{featuredPost.category}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="blog-grid">
              {otherPosts.map(renderPost)}
            </div>
          </>
        );

      case 'blog-modern-gallery':
        return (
          <div className="blog-masonry">
            {postsToDisplay.map(renderPost)}
          </div>
        );

      case 'blog-modern-showcase':
        return (
          <div className="blog-slider">
            {postsToDisplay.map(renderPost)}
          </div>
        );

      default:
        return (
          <div className="blog-grid">
            {postsToDisplay.map(renderPost)}
          </div>
        );
    }
  };

  return (
    <section className={`blog-section ${styleId}`}>
      <div className="container">
        {content?.title && <h2 className="section-title">{content.title}</h2>}
        {content?.subtitle && <p className="section-subtitle">{content.subtitle}</p>}

        {renderControls()}
        {renderContent()}

        {/* Load More / View All Controls */}
        {enableLoadMore && hasMorePosts && (
          <button
            onClick={handleLoadMore}
            className="load-more-btn"
          >
            Load More Posts
          </button>
        )}

        {showViewAllButton && (
          <a
            href="/blog"
            className="view-all-btn"
          >
            View All Posts
            <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
          </a>
        )}
      </div>
    </section>
  );
};

export default BlogPostsSection;
