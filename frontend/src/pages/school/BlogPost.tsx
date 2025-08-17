/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import { usePages } from '@/hooks/usePages';
import { Calendar, Clock, Eye } from 'lucide-react';
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

  const getTemplateStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {};
    for (let i = 1; i <= 26; i++) {
      styleMap[`blog-post-style-${i}`] = `single-post-style-${i}`;
    }
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
          const schoolPosts = allPosts.filter((p: BlogPost) => p.schoolId === school.id && p.status === 'published');
          const currentPost = schoolPosts.find((p: BlogPost) => p.slug === postSlug);
          setPost(currentPost || null);
          if (currentPost) {
            const related = schoolPosts
              .filter((p: BlogPost) => p.id !== currentPost.id && ((currentPost.categories && p.categories && currentPost.categories.some(cat => p.categories?.includes(cat))) || (currentPost.tags && p.tags && currentPost.tags.some(tag => p.tags?.includes(tag)))))
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

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const getReadingTime = (content: string) => Math.ceil(content.split(' ').length / 200);

  const renderPostMeta = () => (
    <div className="post-meta">
      <div className="post-meta-item"><Calendar className="h-4 w-4" /><span>{formatDate(post.publishedAt || post.createdAt)}</span></div>
      <div className="post-meta-item"><Clock className="h-4 w-4" /><span>{post.readingTime || getReadingTime(post.content)} min read</span></div>
      {post.views && (<div className="post-meta-item"><Eye className="h-4 w-4" /><span>{post.views} views</span></div>)}
    </div>
  );

  const renderPostContent = () => (
    <div className="post-content" ref={postContentRef}><div dangerouslySetInnerHTML={{ __html: post.content }} /></div>
  );

  const renderSidebar = () => (
    <aside className="post-sidebar">
      {relatedPosts.length > 0 && (
        <div className="sidebar-widget">
          <h3>Related Posts</h3>
          <ul>
            {relatedPosts.map((relatedPost) => (
              <li key={relatedPost.id}><Link to={`/${schoolSlug}/blog/${relatedPost.slug}`}>{relatedPost.title}</Link></li>
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
            <Link key={relatedPost.id} to={`/${schoolSlug}/blog/${relatedPost.slug}`} className="related-post-card">
              {relatedPost.featuredImage && (<img src={relatedPost.featuredImage} alt={relatedPost.title} className="related-post-image" />)}
              <div className="related-post-content"><h4 className="related-post-title">{relatedPost.title}</h4><p className="related-post-excerpt">{relatedPost.excerpt}</p></div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  const renderPostLayout = () => {
    switch (templateStyle) {
      case 'single-post-style-3':
        return (
          <div className="main-content">
            <div className="post-main">
              <div className="post-header"><h1 className="post-title">{post.title}</h1>{renderPostMeta()}{post.featuredImage && (<img src={post.featuredImage} alt={post.title} className="post-featured-image" />)}</div>
              {renderPostContent()}
            </div>
            {renderSidebar()}
          </div>
        );
      default:
        return (
          <div className="post-container">
            <div className="post-header"><h1 className="post-title">{post.title}</h1>{renderPostMeta()}{post.featuredImage && (<img src={post.featuredImage} alt={post.title} className="post-featured-image" />)}</div>
            {renderPostContent()}{renderRelatedPosts()}
          </div>
        );
    }
  };

  return (
    <div className={`single-post-page ${templateStyle}`}>
      {templateStyle === 'single-post-style-6' && (<div className="progress-bar" style={{ width: `${scrollProgress}%` }} />)}
      <SchoolHeader school={school} pages={pages} />
      <main className="container mx-auto px-4 py-8">{renderPostLayout()}</main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default BlogPostPage;