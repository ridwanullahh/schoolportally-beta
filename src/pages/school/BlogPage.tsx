import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import '@/themes/styles/pages/blog-archive.css';
import '@/themes/styles/pages/archive-modern.css';
import { usePages } from '@/hooks/usePages';
import { Calendar, Clock, User, Search, Filter } from 'lucide-react';
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

  const blogArchiveStyle = school?.blogArchiveStyle || 'blog-archive-style-1';
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

  const renderPostCard = (post: BlogPost) => (
    <article key={post.id} className="post-card">
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          className="post-image"
          loading="lazy"
        />
      )}
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
          {post.categories && post.categories.length > 0 && (
            <span className="post-category">{post.categories[0]}</span>
          )}
        </div>
        <h2 className="post-title">
          <Link to={`/${schoolSlug}/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>
        <p className="post-excerpt">{post.excerpt}</p>
        <div className="post-footer">
          <Link to={`/${schoolSlug}/blog/${post.slug}`} className="read-more">
            Read More
          </Link>
          {post.views && <span className="post-views">{post.views} views</span>}
        </div>
      </div>
    </article>
  );

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

    return (
      <div className="posts-grid">
        {paginatedPosts.map(renderPostCard)}
      </div>
    );
  };

  if (!school) return <div className="loading-state">Loading...</div>;

  return (
    <div className={`archive-page ${blogArchiveStyle}`}>
      <SchoolHeader school={school} pages={pages} />
      <main className="archive-container">
        <div className="archive-header">
          <h1 className="archive-title">Blog</h1>
          <p className="archive-description">
            Stay updated with our latest news, insights, and educational content
          </p>
        </div>

        {renderSearchAndFilters()}
        {renderArchiveLayout()}
        {renderPagination()}
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default BlogPage;