import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/blog-posts.css';
import { Button } from '@/components/ui/button';
import sdk from '@/lib/sdk-config';
import { useSchool } from '@/contexts/SchoolContext';
import * as Icons from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  tags?: string[];
  icon?: string;
}

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

  const renderPost = (post: BlogPost) => {
    const postContent = (
      <>
        {post.featuredImage && <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" />}
        <div className="post-content p-4">
          {styleId === 'blog_posts-icon-highlight' && <div className="icon">{getIcon(post.icon!)}</div>}
          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
          <p className="text-muted-foreground mb-4">{post.excerpt}</p>
          <Button asChild variant="link" className="p-0"><a href={`/${school?.slug}/blog/${post.slug}`}>Read More</a></Button>
        </div>
      </>
    );

    switch(styleId) {
        case 'blog_posts-post-accordions':
            return <details key={post.id} className="post-item"><summary>{post.title}</summary><div className="p-4">{postContent}</div></details>;
        case 'blog_posts-card-flip':
            return <div key={post.id} className="post-item"><div className="flip-card-inner"><div className="flip-card-front">{postContent}</div><div className="flip-card-back"><p>{post.excerpt}</p></div></div></div>;
        case 'blog_posts-expand-snippet':
            return <div key={post.id} className={`post-item ${expandedPost === post.id ? 'expanded' : ''}`} onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}>{postContent}</div>
        default:
            return <div key={post.id} className="post-item">{postContent}</div>;
    }
  };
  
  const allTags = ['All', ...Array.from(new Set(posts.flatMap(p => p.tags || [])))];
  const filteredPosts = activeTag === 'All' ? posts : posts.filter(p => p.tags?.includes(activeTag));

  const renderContent = () => {
    if (loading) return <p>Loading posts...</p>;
    if (posts.length === 0) return <p>No posts found.</p>;

    if (styleId === 'blog_posts-pinned-post') {
      const pinnedPost = posts.find((p) => p.id === pinnedPostId);
      const otherPosts = posts.filter((p) => p.id !== pinnedPostId);
      return (
        <div>
          {pinnedPost && <div className="pinned-post mb-8">{renderPost(pinnedPost)}</div>}
          <div className="other-posts grid grid-cols-1 md:grid-cols-2 gap-8">{otherPosts.map(renderPost)}</div>
        </div>
      );
    }
    
    if (styleId === 'blog_posts-tag-tabs') {
        return (
            <>
                <div className="tab-buttons">{allTags.map(tag => <button key={tag} onClick={() => setActiveTag(tag)} className={activeTag === tag ? 'active' : ''}>{tag}</button>)}</div>
                <div className="blog-posts-container">{filteredPosts.map(renderPost)}</div>
            </>
        )
    }

    return <div className="blog-posts-container">{posts.map(renderPost)}</div>;
  };

  return (
    <section className={`blog-posts-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default BlogPostsSection;