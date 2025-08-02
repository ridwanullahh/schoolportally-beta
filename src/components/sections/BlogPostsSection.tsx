import React, { useState, useEffect } from 'react';
import { Section, BlogPost } from '@/types';
import '@/themes/styles/sections/blog-posts.css';
import '@/themes/styles/sections/blog-posts-modern.css';
import { Button } from '@/components/ui/button';
import sdk from '@/lib/sdk-config';
import { useSchool } from '@/contexts/SchoolContext';
import * as Icons from 'lucide-react';

interface BlogPostsSectionProps {
  section: Section;
}

const BlogPostsSection: React.FC<BlogPostsSectionProps> = ({ section }) => {
  const { title, pinnedPostId, postsLimit } = section.content;
  const { school } = useSchool();
  const styleId = section.styleId || 'blog_posts-post-grid';
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('All');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!school) return;
      setLoading(true);
      try {
        const allPosts = await sdk.get<BlogPost>('blog_posts');
        const schoolPosts = allPosts.filter((post: any) => post.schoolId === school.id && post.status === 'published').slice(0, postsLimit || 10);
        setPosts(schoolPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [school, postsLimit]);
  
  const getIcon = (iconName: string) => {
    // @ts-ignore
    const IconComponent = iconName && Icons[iconName] ? Icons[iconName] : Icons.Book;
    return <IconComponent className="w-8 h-8 text-primary" />;
  };

  const renderPost = (post: BlogPost, index?: number) => {
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

    // Modern post content structure
    const modernPostContent = (
      <>
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
            <span className="post-date">{formatDate(post.publishedAt || post.createdAt)}</span>
            {post.readingTime && <span className="reading-time">{post.readingTime} min read</span>}
            {post.categories && post.categories.length > 0 && (
              <span className="post-category">{post.categories[0]}</span>
            )}
          </div>
          <h3 className="post-title">{post.title}</h3>
          <p className="post-excerpt">{post.excerpt}</p>
          <div className="post-footer">
            <a href={`/${school?.slug}/blog/${post.slug}`} className="read-more">
              Read More
            </a>
            {post.views && <span className="post-views">{post.views} views</span>}
          </div>
        </div>
      </>
    );

    // Legacy post content for backward compatibility
    const legacyPostContent = (
      <>
        {post.featuredImage && <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" />}
        <div className="post-content p-4">
          {styleId === 'blog_posts-icon-highlight' && <div className="icon">{getIcon(post.icon || 'Book')}</div>}
          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
          <p className="text-muted-foreground mb-4">{post.excerpt}</p>
          <Button asChild variant="link" className="p-0">
            <a href={`/${school?.slug}/blog/${post.slug}`}>Read More</a>
          </Button>
        </div>
      </>
    );

    // Determine which content to use based on style
    const isModernStyle = [
      'blog-posts-modern-grid',
      'blog-posts-featured-layout',
      'blog-posts-masonry-layout',
      'blog-posts-timeline-layout',
      'blog-posts-card-slider',
      'blog-posts-minimal-list'
    ].includes(styleId);

    const postContent = isModernStyle ? modernPostContent : legacyPostContent;

    switch(styleId) {
        // Modern styles
        case 'blog-posts-featured-layout':
          if (index === 0) {
            return (
              <div key={post.id} className="featured-post">
                {postContent}
              </div>
            );
          } else {
            return (
              <div key={post.id} className="sidebar-post">
                <h4 className="post-title">{post.title}</h4>
                <p className="post-excerpt">{post.excerpt}</p>
                <a href={`/${school?.slug}/blog/${post.slug}`} className="read-more">Read More</a>
              </div>
            );
          }

        case 'blog-posts-timeline-layout':
          return (
            <div key={post.id} className="post-item">
              <div className="post-content">
                <div className="post-meta">
                  <span className="post-date">{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <a href={`/${school?.slug}/blog/${post.slug}`} className="read-more">Read More</a>
              </div>
            </div>
          );

        case 'blog-posts-minimal-list':
          return (
            <div key={post.id} className="post-item">
              <div className="post-content">
                {post.featuredImage && (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="post-image"
                  />
                )}
                <div className="post-info">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-meta">
                    <span className="post-date">{formatDate(post.publishedAt || post.createdAt)}</span>
                    <a href={`/${school?.slug}/blog/${post.slug}`} className="read-more">Read More</a>
                  </div>
                </div>
              </div>
            </div>
          );

        // Legacy styles
        case 'blog_posts-post-accordions':
            return <details key={post.id} className="post-item"><summary>{post.title}</summary><div className="p-4">{legacyPostContent}</div></details>;
        case 'blog_posts-card-flip':
            return <div key={post.id} className="post-item"><div className="flip-card-inner"><div className="flip-card-front">{legacyPostContent}</div><div className="flip-card-back"><p>{post.excerpt}</p></div></div></div>;
        case 'blog_posts-expand-snippet':
            return <div key={post.id} className={`post-item ${expandedPost === post.id ? 'expanded' : ''}`} onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}>{legacyPostContent}</div>
        default:
            return <div key={post.id} className="post-item">{postContent}</div>;
    }
  };
  
  const allTags = ['All', ...Array.from(new Set(posts.flatMap(p => p.tags || [])))];
  const filteredPosts = activeTag === 'All' ? posts : posts.filter(p => p.tags?.includes(activeTag));

  const renderContent = () => {
    if (loading) return <div className="loading-state">Loading posts...</div>;
    if (posts.length === 0) return <div className="empty-state">No posts found.</div>;

    // Modern layout handling
    switch (styleId) {
      case 'blog-posts-featured-layout':
        const [featuredPost, ...sidebarPosts] = posts;
        return (
          <div className="blog-posts-container">
            {renderPost(featuredPost, 0)}
            <div className="sidebar-posts">
              {sidebarPosts.slice(0, 4).map((post, index) => renderPost(post, index + 1))}
            </div>
          </div>
        );

      case 'blog-posts-timeline-layout':
        return (
          <div className="blog-posts-container">
            {posts.map((post, index) => renderPost(post, index))}
          </div>
        );

      case 'blog-posts-card-slider':
        return (
          <div className="blog-posts-container">
            {posts.map((post, index) => renderPost(post, index))}
          </div>
        );

      case 'blog-posts-masonry-layout':
        return (
          <div className="blog-posts-container">
            {posts.map((post, index) => renderPost(post, index))}
          </div>
        );

      case 'blog-posts-minimal-list':
        return (
          <div className="blog-posts-container">
            {posts.map((post, index) => renderPost(post, index))}
          </div>
        );

      case 'blog-posts-modern-grid':
      default:
        return (
          <div className="blog-posts-container">
            {posts.map((post, index) => renderPost(post, index))}
          </div>
        );

      // Legacy layouts
      case 'blog_posts-pinned-post':
        const pinnedPost = posts.find((p) => p.id === pinnedPostId);
        const otherPosts = posts.filter((p) => p.id !== pinnedPostId);
        return (
          <div>
            {pinnedPost && <div className="pinned-post mb-8">{renderPost(pinnedPost)}</div>}
            <div className="other-posts grid grid-cols-1 md:grid-cols-2 gap-8">{otherPosts.map((post, index) => renderPost(post, index))}</div>
          </div>
        );

      case 'blog_posts-tag-tabs':
        return (
          <>
            <div className="tab-buttons">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={activeTag === tag ? 'active' : ''}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="blog-posts-container">
              {filteredPosts.map((post, index) => renderPost(post, index))}
            </div>
          </>
        );
    }
  };

  return (
    <section className={`blog-posts-section ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && (
          <div className="section-header">
            <h2 className="section-title">{title}</h2>
            {section.content.subtitle && (
              <p className="section-subtitle">{section.content.subtitle}</p>
            )}
          </div>
        )}
        {renderContent()}
      </div>
    </section>
  );
};

export default BlogPostsSection;