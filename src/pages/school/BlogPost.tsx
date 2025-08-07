import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import '@/themes/styles/pages/blog-post.css';
import '@/themes/styles/pages/single-post-modern.css';
import '@/themes/styles/pages/single-post-templates-ultra-modern.css';
import { usePages } from '@/hooks/usePages';
import { Calendar, Clock, User, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogPost } from '@/types';

const BlogPostPage = () => {
  const { postSlug, schoolSlug } = useParams();
  const { school } = useSchool();
  const { pages } = usePages();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const postContentRef = useRef<HTMLDivElement>(null);

  // Map old style names to new template system
  const getTemplateStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {
      'blog-post-style-1': 'single-post-style-1',
      'blog-post-style-2': 'single-post-style-2',
      'blog-post-style-3': 'single-post-style-3',
      'blog-post-style-4': 'single-post-style-4',
      'blog-post-style-5': 'single-post-style-5',
      'blog-post-style-6': 'single-post-style-6',
      'blog-post-style-7': 'single-post-style-7',
      'blog-post-style-8': 'single-post-style-8',
      'blog-post-style-9': 'single-post-style-9',
      'blog-post-style-10': 'single-post-style-10',
      'blog-post-style-11': 'single-post-style-11',
      'blog-post-style-12': 'single-post-style-12',
      'blog-post-style-13': 'single-post-style-13',
      'blog-post-style-14': 'single-post-style-14',
      'blog-post-style-15': 'single-post-style-15',
    };
    return styleMap[styleId] || 'single-post-style-1';
  };

  const blogPostStyle = school?.blogPostStyle || 'blog-post-style-1';
  const templateStyle = getTemplateStyle(blogPostStyle);

  useEffect(() => {
    const fetchPost = async () => {
      if (school && postSlug) {
        setLoading(true);
        try {
          const allPosts = await sdk.get<BlogPost>('blog_posts');
          const schoolPosts = allPosts.filter((p: BlogPost) =>
            p.schoolId === school.id && p.status === 'published'
          );

          const currentPost = schoolPosts.find((p: BlogPost) => p.slug === postSlug);
          setPost(currentPost || null);

          // Get related posts (same categories or tags)
          if (currentPost) {
            const related = schoolPosts
              .filter((p: BlogPost) =>
                p.id !== currentPost.id && (
                  (currentPost.categories && p.categories &&
                   currentPost.categories.some(cat => p.categories?.includes(cat))) ||
                  (currentPost.tags && p.tags &&
                   currentPost.tags.some(tag => p.tags?.includes(tag)))
                )
              )
              .slice(0, 3);
            setRelatedPosts(related);
          }
        } catch (error) {
          console.error('Failed to fetch blog post:', error);
          setPost(null);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPost();
  }, [school, postSlug]);
  
  useEffect(() => {
    const handleScroll = () => {
      const element = document.documentElement;
      const totalHeight = element.scrollHeight - element.clientHeight;
      setScrollProgress((element.scrollTop / totalHeight) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  if (loading || !school) return <div className="loading-state">Loading...</div>;
  if (!post) return <div className="error-state">Post not found.</div>;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const renderPostMeta = () => (
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
  );

  const renderPostContent = () => (
    <div className="post-content" ref={postContentRef}>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );

  const renderSidebar = () => (
    <aside className="post-sidebar">
      <div className="sidebar-widget">
        <h3>Categories</h3>
        <ul>
          {post.categories?.map((category, index) => (
            <li key={index}>
              <Link to={`/${schoolSlug}/blog?category=${category}`}>
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-widget">
        <h3>Tags</h3>
        <div className="tag-list">
          {post.tags?.map((tag, index) => (
            <Link
              key={index}
              to={`/${schoolSlug}/blog?tag=${tag}`}
              className="tag-link"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
      {relatedPosts.length > 0 && (
        <div className="sidebar-widget">
          <h3>Related Posts</h3>
          <ul>
            {relatedPosts.map((relatedPost) => (
              <li key={relatedPost.id}>
                <Link to={`/${schoolSlug}/blog/${relatedPost.slug}`}>
                  {relatedPost.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );

  const renderRelatedPosts = () => {
    if (relatedPosts.length === 0) return null;

    return (
      <div className="related-posts">
        <h3>Related Posts</h3>
        <div className="related-posts-grid">
          {relatedPosts.map((relatedPost) => (
            <Link
              key={relatedPost.id}
              to={`/${schoolSlug}/blog/${relatedPost.slug}`}
              className="related-post-card"
            >
              {relatedPost.featuredImage && (
                <img
                  src={relatedPost.featuredImage}
                  alt={relatedPost.title}
                  className="related-post-image"
                />
              )}
              <div className="related-post-content">
                <h4 className="related-post-title">{relatedPost.title}</h4>
                <p className="related-post-excerpt">{relatedPost.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  const renderSocialShare = () => (
    <div className="social-share">
      <span className="social-share-label">Share this post:</span>
      <div className="social-share-buttons">
        <a
          href={`https://facebook.com/sharer/sharer.php?u=${window.location.href}`}
          target="_blank"
          rel="noopener noreferrer"
          className="social-share-btn facebook"
        >
          📘
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`}
          target="_blank"
          rel="noopener noreferrer"
          className="social-share-btn twitter"
        >
          🐦
        </a>
        <a
          href={`https://linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
          target="_blank"
          rel="noopener noreferrer"
          className="social-share-btn linkedin"
        >
          💼
        </a>
        <a
          href={`https://wa.me/?text=${post.title} ${window.location.href}`}
          target="_blank"
          rel="noopener noreferrer"
          className="social-share-btn whatsapp"
        >
          💬
        </a>
      </div>
    </div>
  );

  const renderPostLayout = () => {
    switch (blogPostStyle) {
      case 'blog-post-style-2':
        return (
          <>
            <div
              className="post-hero"
              style={post.featuredImage ? { backgroundImage: `url(${post.featuredImage})` } : {}}
            >
              <div className="post-hero-content">
                <h1 className="post-title">{post.title}</h1>
                {renderPostMeta()}
              </div>
            </div>
            <div className="post-container">
              {renderPostContent()}
              {renderSocialShare()}
              {renderRelatedPosts()}
            </div>
          </>
        );

      case 'blog-post-style-3':
        return (
          <div className="main-content">
            <div className="post-main">
              <div className="post-header">
                <h1 className="post-title">{post.title}</h1>
                {renderPostMeta()}
                {post.featuredImage && (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="post-featured-image"
                  />
                )}
              </div>
              {renderPostContent()}
              {renderSocialShare()}
            </div>
            {renderSidebar()}
          </div>
        );

      case 'blog-post-style-4':
        return (
          <div className="post-container">
            <div className="post-header">
              <div className="post-header-text">
                <h1>{post.title}</h1>
                <p className="post-excerpt">{post.excerpt}</p>
                {renderPostMeta()}
              </div>
              {post.featuredImage && (
                <div className="post-header-image">
                  <img src={post.featuredImage} alt={post.title} />
                </div>
              )}
            </div>
            <div className="post-content">
              {renderPostContent()}
            </div>
            {renderSocialShare()}
            {renderRelatedPosts()}
          </div>
        );

      case 'blog-post-style-5':
        return (
          <div className="post-container">
            <div className="post-header">
              <h1 className="post-title">{post.title}</h1>
              {renderPostMeta()}
            </div>
            {post.featuredImage && (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="post-featured-image"
              />
            )}
            {renderPostContent()}
            {renderSocialShare()}
            {renderRelatedPosts()}
          </div>
        );

      case 'blog-post-style-6':
        return (
          <div className="post-container">
            <div className="post-header">
              <h1 className="post-title">{post.title}</h1>
              {renderPostMeta()}
              <div className="reading-time">
                {post.readingTime || getReadingTime(post.content)} min read
              </div>
            </div>
            {post.featuredImage && (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="post-featured-image"
              />
            )}
            {renderPostContent()}
            {renderSocialShare()}
            {renderRelatedPosts()}
          </div>
        );

      case 'blog-post-style-7':
        return (
          <div className="post-container">
            <div className="post-card">
              <div
                className="post-header"
                style={post.featuredImage ? { backgroundImage: `url(${post.featuredImage})` } : {}}
              >
                <div className="post-header-content">
                  <h1 className="post-title">{post.title}</h1>
                  {renderPostMeta()}
                </div>
              </div>
              <div className="post-content">
                {renderPostContent()}
              </div>
            </div>
            {renderSocialShare()}
            {renderRelatedPosts()}
          </div>
        );

      default:
        return (
          <div className="post-container">
            <div className="post-header">
              <h1 className="post-title">{post.title}</h1>
              {renderPostMeta()}
              {post.featuredImage && (
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="post-featured-image"
                />
              )}
            </div>
            {renderPostContent()}
            {renderSocialShare()}
            {renderRelatedPosts()}
          </div>
        );
    }
  };

  // Special wrapper for glassmorphism template
  if (templateStyle === 'single-post-style-15') {
    return (
      <div className={`single-post-page ${templateStyle}`}>
        {templateStyle === 'single-post-style-6' && (
          <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />
        )}
        <SchoolHeader school={school} pages={pages} />
        <div className="post-wrapper">
          {renderPostLayout()}
        </div>
        <SchoolFooter school={school} />

        {/* Floating elements for template-style-9 */}
        {templateStyle === 'single-post-style-9' && (
          <>
            <div className="floating-element"></div>
            <div className="floating-element"></div>
            <div className="floating-element"></div>
          </>
        )}
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
        {renderPostLayout()}
      </main>
      <SchoolFooter school={school} />

      {/* Floating elements for template-style-9 */}
      {templateStyle === 'single-post-style-9' && (
        <>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </>
      )}
    </div>
  );
};

export default BlogPostPage;