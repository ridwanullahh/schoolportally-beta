import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import '@/themes/styles/pages/blog-post.css';
import { usePages } from '@/hooks/usePages';

const BlogPostPage = () => {
  const { postSlug } = useParams();
  const { school } = useSchool();
  const { pages } = usePages();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const postContentRef = useRef<HTMLDivElement>(null);
  
  const blogPostStyle = school?.branding?.blogPostStyle || 'blog-post-style-1';

  useEffect(() => {
    const fetchPost = async () => {
      if (school && postSlug) {
        setLoading(true);
        const allPosts = await sdk.get('blog_posts');
        const currentPost = allPosts.find((p: any) => p.schoolId === school.id && p.slug === postSlug);
        setPost(currentPost);
        setLoading(false);
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


  if (loading || !school) return <div>Loading...</div>;
  if (!post) return <div>Post not found.</div>;

  const renderPostContent = () => (
    <div className="post-content" ref={postContentRef}>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );

  const renderSidebar = () => (
      <aside className="sidebar">
          <div className="widget">
              <h3 className="font-bold mb-2">Recent Posts</h3>
              {/* Placeholder for recent posts */}
          </div>
           <div className="widget">
              <h3 className="font-bold mb-2">Categories</h3>
              {/* Placeholder for categories */}
          </div>
      </aside>
  )

  return (
    <div className={`blog-post-page ${blogPostStyle}`}>
      {blogPostStyle === 'blog-post-style-6' && <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />}
      <SchoolHeader school={school} pages={pages} />
      <main className="container mx-auto px-4 py-16">
        <header className="post-header" style={blogPostStyle === 'blog-post-style-2' && post.featuredImage ? {backgroundImage: `url(${post.featuredImage})`} : {}}>
            <div className="post-header-overlay">
                <h1 className="text-4xl font-bold">{post.title}</h1>
                <p className="text-lg mt-2">Published on {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </header>

        {blogPostStyle === 'blog-post-style-3' ? (
            <div className="main-content">
                {renderPostContent()}
                {renderSidebar()}
            </div>
        ) : (
            renderPostContent()
        )}
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default BlogPostPage;