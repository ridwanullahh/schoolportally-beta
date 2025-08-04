import React, { useState } from 'react';
import { Section } from '@/types';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import '@/themes/styles/sections/blog-posts-ultra-modern.css';

interface BlogPostsSectionProps {
  section: Section;
}

const BlogPostsSection: React.FC<BlogPostsSectionProps> = ({ section }) => {
  const { title } = section.content;
  const { posts, loading, error, getFeaturedPosts } = useBlogPosts();
  const styleId = section.styleId || 'blog-posts-floating-glass';

  const defaultPosts = [
    {
      id: '1',
      title: 'Welcome to Our New Academic Year',
      excerpt: 'We are excited to welcome all students back for another year of learning and growth.',
      author: 'Principal Johnson',
      publishedAt: '2024-11-20',
      category: 'News',
      tags: ['academic', 'welcome', 'students'],
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      featured: false,
      status: 'published'
    }
  ];

  // Use dynamic content if available, otherwise use defaults
  const postItems = posts && posts.length > 0 ? posts : defaultPosts;

  const renderPost = (post: any, index: number) => {
    const postImage = post.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop';
    
    return (
      <div key={post.id || index} className="post-card">
        <img 
          src={postImage} 
          alt={post.title} 
          className="post-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop';
          }}
        />
        <div className="post-title">{post.title}</div>
        <div className="post-category">{post.category}</div>
        <div className="post-author">By: {post.author}</div>
        <div className="post-date">{post.publishedAt}</div>
        {post.excerpt && <div className="post-description">{post.excerpt}</div>}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="posts-container">
          <div className="loading-state">Loading blog posts...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="posts-container">
          <div className="error-state">Error loading posts. Showing default posts.</div>
          <div className="posts-container">
            {defaultPosts.map(renderPost)}
          </div>
        </div>
      );
    }

    switch (styleId) {
      case 'blog-posts-sliding-carousel':
        return (
          <div className="posts-container">
            <div className="carousel-track">
              {postItems.map(renderPost)}
              {/* Duplicate for seamless loop */}
              {postItems.map((post, index) => renderPost(post, index + postItems.length))}
            </div>
          </div>
        );
      case 'blog-posts-minimal-lines':
        return (
          <div className="posts-container">
            {postItems.map(renderPost)}
          </div>
        );
      default:
        return (
          <div className="posts-container">
            {postItems.map(renderPost)}
          </div>
        );
    }
  };

  return (
    <section className={`blog-posts-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default BlogPostsSection;
