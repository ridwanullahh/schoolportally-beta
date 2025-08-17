/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { usePages } from '@/hooks/usePages';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import sdk from '@/lib/sdk-config';
import { BlogPost } from '@/types';
import { Calendar, Clock, User, Search, Filter, ArrowRight, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const BlogCategoryPage = () => {
  const { school } = useSchool();
  const { schoolSlug, category } = useParams();
  const { pages } = usePages();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

  // Map old style names to new template system
  const getTemplateStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {
      'blog-archive-style-1': 'template-style-1',
      'blog-archive-style-2': 'template-style-2',
      'blog-archive-style-3': 'template-style-3',
      'blog-archive-style-4': 'template-style-4',
      'blog-archive-style-5': 'template-style-5',
      'blog-archive-style-6': 'template-style-6',
      'blog-archive-style-7': 'template-style-7',
      'blog-archive-style-8': 'template-style-8',
      'blog-archive-style-9': 'template-style-9',
      'blog-archive-style-10': 'template-style-10',
      'blog-archive-style-11': 'template-style-11',
      'blog-archive-style-12': 'template-style-12',
      'blog-archive-style-13': 'template-style-13',
      'blog-archive-style-14': 'template-style-14',
      'blog-archive-style-15': 'template-style-15',
      'blog-archive-style-16': 'template-style-16',
      'blog-archive-style-17': 'template-style-17',
      'blog-archive-style-18': 'template-style-18',
      'blog-archive-style-19': 'template-style-19',
      'blog-archive-style-20': 'template-style-20',
      'blog-archive-style-21': 'template-style-21',
      'blog-archive-style-22': 'template-style-22',
      'blog-archive-style-23': 'template-style-23',
      'blog-archive-style-24': 'template-style-24',
      'blog-archive-style-25': 'template-style-25',
      'blog-archive-style-26': 'template-style-26',
    };
    return styleMap[styleId] || 'template-style-1';
  };

  const blogArchiveStyle = school?.blogArchiveStyle || 'blog-archive-style-1';
  const templateStyle = getTemplateStyle(blogArchiveStyle);
  const postsPerPage = 12;

  useEffect(() => {
    const fetchPosts = async () => {
      if (school && category) {
        setLoading(true);
        try {
          const allPosts = await sdk.get<BlogPost>('blog_posts');
          const categoryPosts = allPosts.filter((p: BlogPost) =>
            p.schoolId === school.id && 
            p.status === 'published' &&
            p.categories?.includes(decodeURIComponent(category))
          );
          setPosts(categoryPosts);
        } catch (error) {
          console.error('Failed to fetch blog posts:', error);
          setPosts([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPosts();
  }, [school, category]);

  useEffect(() => {
    let filtered = [...posts];

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'newest':
        default:
          return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
      }
    });

    setFilteredPosts(filtered);
  }, [posts, searchTerm, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage !== 1) params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [searchTerm, sortBy, currentPage, setSearchParams]);

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

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const getReadingTime = (content: string) => Math.ceil(content.split(/\s+/).length / 200);

  const renderPostCard = (post: BlogPost, index?: number) => {
    const defaultImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    const postImage = post.featuredImage || defaultImage;

    if (templateStyle === 'template-style-8') {
      return (
        <article key={post.id} className="post-card">
          <div className="post-content">
            <h2 className="post-title">
              <Link to={`/${schoolSlug}/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <div className="post-meta">
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              <span>•</span>
              <span>{post.readingTime || getReadingTime(post.content)} min read</span>
            </div>
            <p className="post-excerpt">{post.excerpt}</p>
          </div>
        </article>
      );
    }

    if (templateStyle === 'template-style-5') {
      return (
        <article key={post.id} className="post-card">
          <div className="post-content">
            <h2 className="post-title">
              <Link to={`/${schoolSlug}/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <div className="post-meta">
              <div className="post-meta-item"><Calendar className="h-4 w-4" /><span>{formatDate(post.publishedAt || post.createdAt)}</span></div>
              <div className="post-meta-item"><Clock className="h-4 w-4" /><span>{post.readingTime || getReadingTime(post.content)} min read</span></div>
            </div>
            <p className="post-excerpt">{post.excerpt}</p>
            <Link to={`/${schoolSlug}/blog/${post.slug}`} className="read-more">Read More <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </article>
      );
    }

    return (
      <article key={post.id} className="post-card">
        <img src={postImage} alt={post.title} className="post-image" loading="lazy" />
        <div className="post-content">
          <div className="post-meta">
            <div className="post-meta-item"><Calendar className="h-4 w-4" /><span>{formatDate(post.publishedAt || post.createdAt)}</span></div>
            <div className="post-meta-item"><Clock className="h-4 w-4" /><span>{post.readingTime || getReadingTime(post.content)} min read</span></div>
            {post.views && (<div className="post-meta-item"><Eye className="h-4 w-4" /><span>{post.views} views</span></div>)}
          </div>
          <h2 className="post-title"><Link to={`/${schoolSlug}/blog/${post.slug}`}>{post.title}</Link></h2>
          <p className="post-excerpt">{post.excerpt}</p>
        </div>
      </article>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="pagination">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}>
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button key={page} onClick={() => setCurrentPage(page)} className={`pagination-btn ${currentPage === page ? 'active' : ''}`}>{page}</button>
        ))}
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const renderArchiveLayout = () => {
    if (loading) return <div className="loading-state">Loading blog posts...</div>;
    if (filteredPosts.length === 0) {
      return (
        <div className="empty-state">
          <h3>No posts found in this category</h3>
          <p>Try searching for something else or browse all posts.</p>
          <Link to={`/${schoolSlug}/blog`} className="btn btn-primary">View All Posts</Link>
        </div>
      );
    }

    if (templateStyle === 'template-style-2') {
      const [featuredPost, ...secondaryPosts] = paginatedPosts;
      return (
        <div className="posts-grid">
          {featuredPost && (<div className="featured-post">{renderPostCard(featuredPost, 0)}</div>)}
          <div className="secondary-posts">{secondaryPosts.map((post, index) => renderPostCard(post, index + 1))}</div>
        </div>
      );
    }
    if (templateStyle === 'template-style-5') {
      return (<div className="posts-timeline">{paginatedPosts.map((post, index) => renderPostCard(post, index))}</div>);
    }
    if (templateStyle === 'template-style-8') {
      return (<div className="posts-list">{paginatedPosts.map((post, index) => renderPostCard(post, index))}</div>);
    }
    if (templateStyle === 'template-style-10') {
      return (<div className="posts-carousel">{paginatedPosts.map((post, index) => renderPostCard(post, index))}</div>);
    }
    if (templateStyle === 'template-style-11') {
      return (<div className="posts-list">{paginatedPosts.map((post, index) => renderPostCard(post, index))}</div>);
    }

    return (
      <div className="posts-grid">{paginatedPosts.map((post, index) => renderPostCard(post, index))}</div>
    );
  };

  if (!school) return <div className="loading-state">Loading...</div>;

  const categoryName = category ? decodeURIComponent(category) : '';

  return (
    <div className={`page-template ${templateStyle}`}>
      <SchoolHeader school={school} pages={pages} />
      <main className="archive-container">
        <div className="archive-header">
          <h1 className="archive-title">{categoryName} Posts</h1>
          <p className="archive-description">Browse all posts in the "{categoryName}" category</p>
          {templateStyle === 'template-style-13' && (
            <p className="archive-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          )}
        </div>
        <div className="breadcrumb"><Link to={`/${schoolSlug}`}>Home</Link><span> / </span><Link to={`/${schoolSlug}/blog`}>Blog</Link><span> / </span><span>{categoryName}</span></div>
        {renderSearchAndFilters()}
        {renderArchiveLayout()}
        {renderPagination()}
      </main>
      <SchoolFooter school={school} />
      {templateStyle === 'template-style-9' && (<><div className="floating-element"></div><div className="floating-element"></div><div className="floating-element"></div></>)}
    </div>
  );
};

export default BlogCategoryPage;