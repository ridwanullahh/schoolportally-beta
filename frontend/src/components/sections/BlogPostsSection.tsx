import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useSchool } from '@/contexts/SchoolContext';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, User, ArrowRight, ChevronDown } from 'lucide-react';
import SectionWrapper, { SectionCard, SectionControls, SectionLoadMore } from './SectionWrapper';




interface BlogPostsSectionProps {
  section: Section;
}

const BlogPostsSection: React.FC<BlogPostsSectionProps> = ({ section }) => {
  const { content, settings } = section;
  const { posts, loading, error, getFeaturedPosts } = useBlogPosts();
  const { school } = useSchool();

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
      slug: 'welcome-to-our-new-academic-year',
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
      slug: 'science-fair-winners-announced',
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
      slug: 'new-library-resources-available',
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
      slug: 'sports-team-championships',
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
      slug: 'art-exhibition-opening',
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
      slug: 'technology-integration-program',
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
    const postUrl = `/${school?.slug}/blog/${post.slug || post.id}`;

    return (
      <SectionCard key={post.id || index} href={postUrl}>
        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="blog-image"
          />
        )}
        <div className="blog-content">
          <h3 className="blog-title">{post.title}</h3>
          {post.excerpt && <p className="blog-excerpt">{post.excerpt}</p>}
          <div className="blog-meta">
            <div className="blog-date">
              <Calendar size={14} />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            {post.category && <div className="blog-category">{post.category}</div>}
          </div>
          {post.author && (
            <div className="blog-author">
              <User size={14} />
              <span>By {post.author}</span>
            </div>
          )}
        </div>
      </SectionCard>
    );
  };

  const renderControls = () => {
    if (!enableSearch && !enableFiltering && !enableSorting) return null;

    return (
      <SectionControls>
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
      </SectionControls>
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
              <Link to={`/${school?.slug}/blog/${featuredPost.slug || featuredPost.id}`} className="featured-post">
                <div className="featured-content">
                  {featuredPost.featuredImage && (
                    <div className="featured-image" style={{
                      backgroundImage: `url(${featuredPost.featuredImage})`
                    }}></div>
                  )}
                  <div className="featured-text">
                    <h3 className="featured-title">{featuredPost.title}</h3>
                    <p className="blog-excerpt">{featuredPost.excerpt}</p>
                    <div className="blog-meta">
                      <div className="blog-date">
                        <Calendar size={14} />
                        <span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                      </div>
                      {featuredPost.category && <div className="blog-category">{featuredPost.category}</div>}
                    </div>
                  </div>
                </div>
              </Link>
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
    <SectionWrapper
      section={section}
      className={`blog-section ${styleId}`}
      itemCount={postsToDisplay.length}
      customLayout={true}
    >
      {renderControls()}
      {renderContent()}

      <SectionLoadMore
        onLoadMore={enableLoadMore && hasMorePosts ? handleLoadMore : undefined}
        hasMore={hasMorePosts}
        viewAllHref={showViewAllButton ? `/${school?.slug}/blog` : undefined}
        viewAllText="View All Posts"
      />
    </SectionWrapper>
  );
};

export default BlogPostsSection;
