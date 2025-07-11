import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/blog-posts.css';
import { Button } from '@/components/ui/button';

interface BlogPostsSectionProps {
  section: Section;
}

const BlogPostsSection: React.FC<BlogPostsSectionProps> = ({ section }) => {
  const { title, posts } = section.content;
  const styleId = section.styleId || 'blog_posts-post-grid';

  const defaultPosts = [
    { title: 'First Blog Post', excerpt: 'This is a short summary of the first blog post...', link: '#', image: 'https://via.placeholder.com/400x250' },
    { title: 'Second Blog Post', excerpt: 'This is a short summary of the second blog post...', link: '#', image: 'https://via.placeholder.com/400x250' },
    { title: 'Third Blog Post', excerpt: 'This is a short summary of the third blog post...', link: '#', image: 'https://via.placeholder.com/400x250' },
  ];

  const postItems = posts && posts.length > 0 ? posts : defaultPosts;

  const renderPost = (post: any, index: number) => (
    <div key={index} className="post-item post-card">
      {post.image && <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />}
      <div className="post-content p-4">
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-muted-foreground mb-4">{post.excerpt}</p>
        <Button asChild variant="link" className="p-0">
          <a href={post.link}>Read More</a>
        </Button>
      </div>
    </div>
  );

  return (
    <section className={`blog-posts-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="blog-posts-container">
          {postItems.map(renderPost)}
        </div>
      </div>
    </section>
  );
};

export default BlogPostsSection;