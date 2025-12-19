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

  // Determine numeric style number from section.styleId
  const styleNumber = String(
    Number((section.styleId || '1').toString().split('-').pop() || '1') || 1
  );
  const sectionClass = `blog-section blog-style-${styleNumber}`;

  // Get unique categories for filtering
  const getCategories = (postList: any[]) => {
    const categories = postList.map(post => post.category).filter(Boolean);
    return ['all', ...Array.from(new Set(categories))];
  };

  // Filter and search logic
  useEffect(() => {
    let result = posts && posts.length > 0 ? [...posts] : [];

    if (searchTerm && result.length > 0) {
      result = result.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all' && result.length > 0) {
      result = result.filter(post => post.category === selectedCategory);
    }

    if (result.length > 0) {
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
    }

    setFilteredPosts(result);
  }, [posts, searchTerm, selectedCategory, sortBy]);

  const postsToDisplay = filteredPosts.slice(0, displayedPosts);
  const hasMorePosts = filteredPosts.length > displayedPosts;
  const categories = getCategories(posts && posts.length > 0 ? posts : []);

  const handleLoadMore = () => setDisplayedPosts(prev => prev + postsToShow);

  const renderPost = (post: any, index: number) => {
    const postUrl = `/${school?.slug}/blog/${post.slug || post.id}`;

    return (
      <SectionCard key={post.id || index} href={postUrl}>
        {post.featuredImage && (
          <img src={post.featuredImage} alt={post.title} className="blog-image" />
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
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}

          {enableSorting && (
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Newest</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
            </select>
          )}
        </div>
      </SectionControls>
    );
  };

  return (
    <SectionWrapper section={section} className={sectionClass}>
      {content?.title && <h2 className="section-title">{content.title}</h2>}
      {renderControls()}
      <div className="blog-grid">
        {postsToDisplay.map(renderPost)}
      </div>
      {enableLoadMore && hasMorePosts && (
        <SectionLoadMore
          onLoadMore={handleLoadMore}
          hasMore={hasMorePosts}
          loading={loading}
        />
      )}
      {showViewAllButton && (
        <div className="section-load-more">
          <Link to={`/${school?.slug}/blog`} className="btn-outline">
            View All Posts
          </Link>
        </div>
      )}
    </SectionWrapper>
  );
};

export default BlogPostsSection;
