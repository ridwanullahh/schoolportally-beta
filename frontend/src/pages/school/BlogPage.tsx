import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';









import { usePages } from '@/hooks/usePages';
import { Calendar, Clock, User, Search, Filter, ArrowRight, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogPost } from '@/types';

const BlogPage = () => {
  const { school } = useSchool();
  const { schoolSlug } = useParams();
  const { pages } = usePages();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [categories, setCategories] = useState<string[]>([]);

  // Map style numbers to comprehensive blog section styles
  const getBlogArchiveStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {
      // Modern styles (1-11)
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
      // Ultra-modern styles (12-26)
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
      '26': 'blog-mosaic-layout',
      // Legacy support
      'blog-archive-style-1': 'blog-modern-grid',
      'blog-archive-style-2': 'blog-modern-cards',
      'blog-archive-style-3': 'blog-modern-display',
      'blog-archive-style-4': 'blog-modern-gallery',
      'blog-archive-style-5': 'blog-modern-showcase',
      'template-style-1': 'blog-modern-grid',
      'template-style-2': 'blog-modern-cards',
      'template-style-3': 'blog-modern-display',
      'template-style-4': 'blog-modern-gallery',
      'template-style-5': 'blog-modern-showcase'
    };
    return styleMap[styleId] || 'blog-modern-grid';
  };

  const blogArchiveStyle = school?.branding?.blogArchiveStyle || 'blog-archive-style-1';
  const templateStyle = getBlogArchiveStyle(blogArchiveStyle);
  const postsPerPage = 12;

  useEffect(() => {
    const fetchPosts = async () => {
      if (school) {
        setLoading(true);
        try {
          const allPosts = await sdk.get<BlogPost>('blog_posts');
          const schoolPosts = allPosts.filter((p: BlogPost) =>
            p.schoolId === school.id && p.status === 'published'
          );
          setPosts(schoolPosts);

          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(schoolPosts.flatMap(post => post.categories || []))
          );
          setCategories(uniqueCategories);
        } catch (error) {
          console.error('Failed to fetch blog posts:', error);
          setPosts([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPosts();
  }, [school]);

  // Filter and sort posts
  useEffect(() => {
    let filtered = [...posts];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post =>
        post.categories?.includes(selectedCategory)
      );
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.publishedAt || a.createdAt).getTime() -
                 new Date(b.publishedAt || b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        default: // newest
          return new Date(b.publishedAt || b.createdAt).getTime() -
                 new Date(a.publishedAt || a.createdAt).getTime();
      }
    });

    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [posts, searchTerm, selectedCategory, sortBy]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());

    setSearchParams(params);
  }, [searchTerm, selectedCategory, sortBy, currentPage, setSearchParams]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const renderSearchAndFilters = () => (
    <div className="archive-search-bar">
      <div className="search-input-wrapper relative">
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search posts..."
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
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-select"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="title">By Title</option>
        <option value="popular">Most Popular</option>
      </select>
    </div>
  );

  const renderPostCard = (post: BlogPost, index?: number) => {
    const defaultImage = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop';
    const postImage = post.featuredImage || defaultImage;

    // Special layouts for specific templates
    if (templateStyle === 'template-style-8') {
      // Minimalist List Layout
      return (
        <article key={post.id} className="post-card">
          <div className="post-content">
            <h2 className="post-title">
              <Link to={`/${schoolSlug}/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            <div className="post-meta">
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              <span>•</span>
              <span>{post.readingTime || getReadingTime(post.content)} min read</span>
              {post.categories && post.categories.length > 0 && (
                <>
                  <span>•</span>
                  <span>{post.categories[0]}</span>
                </>
              )}
            </div>
            <p className="post-excerpt">{post.excerpt}</p>
          </div>
        </article>
      );
    }

    if (templateStyle === 'template-style-5') {
      // Timeline Layout
      return (
        <article key={post.id} className="post-card">
          <div className="post-content">
            <h2 className="post-title">
              <Link to={`/${schoolSlug}/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            <div className="post-meta">
              <div className="post-meta-item">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </div>
              <div className="post-meta-item">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime || getReadingTime(post.content)} min read</span>
              </div>
            </div>
            <p className="post-excerpt">{post.excerpt}</p>
            <Link to={`/${schoolSlug}/blog/${post.slug}`} className="read-more">
              Read More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      );
    }

    // Default card layout for most templates
    return (
      <article key={post.id} className="post-card">
        <img
          src={postImage}
          alt={post.title}
          className="post-image"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        <div className="post-content">
          <div className="post-meta">
            <div className="post-meta-item">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>
            <div className="post-meta-item">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime || getReadingTime(post.content)} min read</span>
            </div>
            {post.views && (
              <div className="post-meta-item">
                <Eye className="h-4 w-4" />
                <span>{post.views} views</span>
              </div>
            )}
          </div>
          {post.categories && post.categories.length > 0 && (
            <span className="post-category">{post.categories[0]}</span>
          )}
          <h2 className="post-title">
            <Link to={`/${schoolSlug}/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
          <p className="post-excerpt">{post.excerpt}</p>
          <Link to={`/${schoolSlug}/blog/${post.slug}`} className="read-more">
            Read More <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
        >
          ←
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
        >
          →
        </button>
      </div>
    );
  };

  const renderArchiveLayout = () => {
    if (loading) {
      return <div className="loading-state">Loading blog posts...</div>;
    }

    if (filteredPosts.length === 0) {
      return (
        <div className="empty-state">
          <h3>No posts found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      );
    }

    // Special layouts for specific templates
    if (templateStyle === 'template-style-2') {
      // Magazine Layout
      const [featuredPost, ...secondaryPosts] = paginatedPosts;
      return (
        <div className="posts-grid">
          {featuredPost && (
            <div className="featured-post">
              {renderPostCard(featuredPost, 0)}
            </div>
          )}
          <div className="secondary-posts">
            {secondaryPosts.map((post, index) => renderPostCard(post, index + 1))}
          </div>
        </div>
      );
    }

    if (templateStyle === 'template-style-5') {
      // Timeline Layout
      return (
        <div className="posts-timeline">
          {paginatedPosts.map((post, index) => renderPostCard(post, index))}
        </div>
      );
    }

    if (templateStyle === 'template-style-8') {
      // Minimalist List Layout
      return (
        <div className="posts-list">
          {paginatedPosts.map((post, index) => renderPostCard(post, index))}
        </div>
      );
    }

    if (templateStyle === 'template-style-10') {
      // Carousel Layout
      return (
        <div className="posts-carousel">
          {paginatedPosts.map((post, index) => renderPostCard(post, index))}
        </div>
      );
    }

    if (templateStyle === 'template-style-11') {
      // Zigzag Layout
      return (
        <div className="posts-list">
          {paginatedPosts.map((post, index) => renderPostCard(post, index))}
        </div>
      );
    }

    // Default grid layout for most templates
    return (
      <div className="posts-grid">
        {paginatedPosts.map((post, index) => renderPostCard(post, index))}
      </div>
    );
  };

  if (!school) return <div className="loading-state">Loading...</div>;

  return (
    <div className={`page-template ${templateStyle}`}>
      <SchoolHeader school={school} pages={pages} />
      <main className="archive-container">
        <div className="archive-header">
          <h1 className="archive-title">Blog</h1>
          <p className="archive-description">
            Stay updated with our latest news, insights, and educational content
          </p>
          {templateStyle === 'template-style-13' && (
            <p className="archive-subtitle">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>

        {renderSearchAndFilters()}
        {renderArchiveLayout()}
        {renderPagination()}
      </main>
      <SchoolFooter school={school} />

      {/* Floating elements for template-style-9 */}
      {templateStyle === 'template-style-9' && (
        <>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </>
      )}
    </div>
  );
};

export default BlogPage;