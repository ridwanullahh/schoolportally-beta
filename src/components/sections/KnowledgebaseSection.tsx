import React from 'react';
import { useState } from 'react';
import { Section } from '@/types';
import { useKnowledgebase } from '@/hooks/useKnowledgebase';
import '@/themes/styles/sections/knowledgebase-modern.css';
import '@/themes/styles/sections/all-remaining-ultra-modern.css';
import { HelpCircle } from 'lucide-react';

interface KnowledgebaseSectionProps {
  section: Section;
}

const KnowledgebaseSection: React.FC<KnowledgebaseSectionProps> = ({ section }) => {
  const { title } = section.content;

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'knowledgebase-modern-grid',
      '2': 'knowledgebase-modern-cards',
      '3': 'knowledgebase-modern-list',
      '4': 'knowledgebase-modern-minimal',
      '5': 'knowledgebase-modern-bordered',
      '6': 'knowledgebase-modern-gradient',
      '7': 'knowledgebase-modern-compact',
      '8': 'knowledgebase-modern-asymmetric',
      '9': 'knowledgebase-modern-typography',
      '10': 'knowledgebase-modern-split',
      '11': 'knowledgebase-modern-search',
      // Existing ultra-modern styles (12+)
      '12': 'knowledgebase-floating-glass',
      '13': 'knowledgebase-holographic-cards',
      '14': 'knowledgebase-neon-search',
      '15': 'knowledgebase-particle-bg',
      '16': 'knowledgebase-morphing-cards',
      '17': 'knowledgebase-cyber-grid',
      '18': 'knowledgebase-liquid-metal',
      '19': 'knowledgebase-aurora-bg',
      '20': 'knowledgebase-matrix-rain',
      '21': 'knowledgebase-quantum-field',
      '22': 'knowledgebase-neural-network',
      '23': 'knowledgebase-hologram-effect',
      '24': 'knowledgebase-energy-waves',
      '25': 'knowledgebase-digital-rain',
      '26': 'knowledgebase-mosaic-layout'
    };
    return styleMap[styleNumber] || 'knowledgebase-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');
  const [activeTab, setActiveTab] = useState('All');

  // Use dynamic content from knowledgebase admin module
  const { articles, loading, error, getFeaturedArticles } = useKnowledgebase();

  const defaultArticles = [
    {
      id: '1',
      title: 'How to Reset Your Password',
      category: 'Account',
      content: 'Step-by-step guide to reset your password and regain access to your account.',
      excerpt: 'Learn how to reset your password quickly and securely.',
      author: 'IT Support Team',
      tags: ['password', 'account', 'security'],
      image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400&h=300&fit=crop',
      views: 1250,
      helpful: 89,
      lastUpdated: '2024-11-15',
      featured: true,
      status: 'published'
    },
    {
      id: '2',
      title: 'Understanding Course Requirements',
      category: 'Academic',
      content: 'Learn about course prerequisites, requirements, and how to plan your academic journey.',
      excerpt: 'Complete guide to course requirements and prerequisites.',
      author: 'Academic Office',
      tags: ['courses', 'requirements', 'academic'],
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
      views: 890,
      helpful: 76,
      lastUpdated: '2024-11-10',
      featured: true,
      status: 'published'
    },
    {
      id: '3',
      title: 'Library Access and Resources',
      category: 'Resources',
      content: 'How to access library resources, databases, and digital collections.',
      excerpt: 'Comprehensive guide to library services and resources.',
      author: 'Library Staff',
      tags: ['library', 'resources', 'research'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      views: 654,
      helpful: 82,
      lastUpdated: '2024-11-08',
      featured: false,
      status: 'published'
    },
    {
      id: '4',
      title: 'Student Support Services',
      category: 'Support',
      content: 'Available support services for students including counseling, tutoring, and career guidance.',
      excerpt: 'Overview of all student support services available.',
      author: 'Student Services',
      tags: ['support', 'counseling', 'services'],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
      views: 432,
      helpful: 91,
      lastUpdated: '2024-11-05',
      featured: true,
      status: 'published'
    },
    {
      id: '5',
      title: 'Online Learning Platform Guide',
      category: 'Technology',
      content: 'Complete guide to using our online learning platform and digital tools.',
      excerpt: 'Master the online learning platform with this guide.',
      author: 'Tech Support',
      tags: ['online', 'platform', 'technology'],
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      views: 789,
      helpful: 85,
      lastUpdated: '2024-11-12',
      featured: false,
      status: 'published'
    },
    {
      id: '6',
      title: 'Financial Aid and Scholarships',
      category: 'Financial',
      content: 'Information about financial aid options, scholarships, and payment plans.',
      excerpt: 'Everything you need to know about financial assistance.',
      author: 'Financial Aid Office',
      tags: ['financial aid', 'scholarships', 'payment'],
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
      views: 1123,
      helpful: 94,
      lastUpdated: '2024-11-18',
      featured: true,
      status: 'published'
    }
  ];

  // Use dynamic content if available, otherwise use defaults
  const kbArticles = articles && articles.length > 0 ? articles : defaultArticles;
  
  const renderArticle = (article: any, index: number) => {
    const articleImage = article.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop';

    return (
      <div key={article.id || index} className="item-card">
        <img
          src={articleImage}
          alt={article.title}
          className="item-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop';
          }}
        />
        <div className="item-title">{article.title}</div>
        <div className="item-category">{article.category}</div>
        <div className="item-author">By: {article.author}</div>
        <div className="item-stats">
          <span>Views: {article.views}</span>
          <span>Helpful: {article.helpful}%</span>
        </div>
        {article.content && <div className="item-description">{article.content}</div>}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="items-container">
          <div className="loading-state">Loading knowledge base articles...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="items-container">
          <div className="error-state">Error loading articles. Showing default articles.</div>
          <div className="items-container">
            {defaultArticles.map(renderArticle)}
          </div>
        </div>
      );
    }

    switch (styleId) {
      case 'knowledgebase-sliding-carousel':
        return (
          <div className="items-container">
            <div className="carousel-track">
              {kbArticles.map(renderArticle)}
              {/* Duplicate for seamless loop */}
              {kbArticles.map((article, index) => renderArticle(article, index + kbArticles.length))}
            </div>
          </div>
        );
      case 'knowledgebase-minimal-lines':
        return (
          <div className="items-container">
            {kbArticles.map(renderArticle)}
          </div>
        );
      default:
        return (
          <div className="items-container">
            {kbArticles.map(renderArticle)}
          </div>
        );
    }
  }

  return (
    <section className={`knowledgebase-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default KnowledgebaseSection;