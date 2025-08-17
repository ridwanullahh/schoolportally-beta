import React, { useState } from 'react';
import { Section } from '@/types';
import { useLibrary } from '@/hooks/useLibrary';



import { BookOpen, Download, ExternalLink, Search, Filter, Book, FileText, Video, Headphones, Bookmark } from 'lucide-react';

interface LibrarySectionProps {
  section: Section;
}

const LibrarySection: React.FC<LibrarySectionProps> = ({ section }) => {
  const { title } = section.content;

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'library-modern-grid',
      '2': 'library-modern-cards',
      '3': 'library-modern-list',
      '4': 'library-modern-minimal',
      '5': 'library-modern-bordered',
      '6': 'library-modern-gradient',
      '7': 'library-modern-compact',
      '8': 'library-modern-asymmetric',
      '9': 'library-modern-typography',
      '10': 'library-modern-split',
      '11': 'library-modern-shelf',
      // Existing ultra-modern styles (12+)
      '12': 'library-floating-glass',
      '13': 'library-holographic-books',
      '14': 'library-neon-catalog',
      '15': 'library-particle-bg',
      '16': 'library-morphing-shelves',
      '17': 'library-cyber-grid',
      '18': 'library-liquid-metal',
      '19': 'library-aurora-bg',
      '20': 'library-matrix-rain',
      '21': 'library-quantum-field',
      '22': 'library-neural-network',
      '23': 'library-hologram-effect',
      '24': 'library-energy-waves',
      '25': 'library-digital-rain',
      '26': 'library-mosaic-layout'
    };
    return styleMap[styleNumber] || 'library-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');

  // Use dynamic content from library admin module
  const { resources, loading, error, getFeaturedResources } = useLibrary();

  const defaultResources = [
    {
      id: '1',
      title: 'Introduction to Computer Science',
      author: 'John Smith',
      type: 'book',
      category: 'Computer Science',
      subject: 'Programming',
      description: 'A comprehensive introduction to computer science fundamentals and programming concepts.',
      totalCopies: 5,
      availableCopies: 3,
      location: 'Section A - Shelf 12',
      language: 'English',
      format: 'physical',
      accessLevel: 'students',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
      featured: true,
      status: 'available'
    },
    {
      id: '2',
      title: 'Advanced Mathematics',
      author: 'Jane Doe',
      type: 'journal',
      category: 'Mathematics',
      subject: 'Calculus',
      description: 'Advanced mathematical concepts including calculus, linear algebra, and differential equations.',
      totalCopies: 3,
      availableCopies: 0,
      location: 'Section B - Shelf 8',
      language: 'English',
      format: 'physical',
      accessLevel: 'faculty',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
      featured: false,
      status: 'available'
    },
    {
      id: '3',
      title: 'History of Art',
      author: 'Bob Johnson',
      type: 'digital',
      category: 'Arts',
      subject: 'Art History',
      description: 'Comprehensive guide to art history from ancient civilizations to contemporary movements.',
      totalCopies: 1,
      availableCopies: 1,
      location: 'Digital Library',
      language: 'English',
      format: 'digital',
      accessLevel: 'public',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      digitalUrl: 'https://library.example.com/art-history',
      featured: true,
      status: 'available'
    },
    {
      id: '4',
      title: 'Physics Laboratory Manual',
      author: 'Dr. Sarah Wilson',
      type: 'reference',
      category: 'Science',
      subject: 'Physics',
      description: 'Practical laboratory experiments and procedures for physics students.',
      totalCopies: 8,
      availableCopies: 6,
      location: 'Section C - Shelf 15',
      language: 'English',
      format: 'physical',
      accessLevel: 'students',
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=300&fit=crop',
      featured: false,
      status: 'available'
    },
    {
      id: '5',
      title: 'Digital Marketing Strategies',
      author: 'Marketing Institute',
      type: 'multimedia',
      category: 'Business',
      subject: 'Marketing',
      description: 'Modern digital marketing techniques and strategies for the digital age.',
      totalCopies: 2,
      availableCopies: 2,
      location: 'Multimedia Section',
      language: 'English',
      format: 'both',
      accessLevel: 'students',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      featured: true,
      status: 'available'
    },
    {
      id: '6',
      title: 'Environmental Science Research',
      author: 'Dr. Green Team',
      type: 'journal',
      category: 'Science',
      subject: 'Environmental Science',
      description: 'Latest research and findings in environmental science and sustainability.',
      totalCopies: 4,
      availableCopies: 4,
      location: 'Section D - Shelf 3',
      language: 'English',
      format: 'physical',
      accessLevel: 'faculty',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      featured: false,
      status: 'available'
    }
  ];

  // Use dynamic content if available, otherwise use defaults
  const resourceItems = resources && resources.length > 0 ? resources : defaultResources;

  const renderResource = (resource: any, index: number) => {
    const resourceImage = resource.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop';

    return (
      <div key={resource.id || index} className="resource-card">
        <img
          src={resourceImage}
          alt={resource.title}
          className="resource-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop';
          }}
        />
        <div className="resource-title">{resource.title}</div>
        <div className="resource-type">{resource.type}</div>
        <div className="resource-author">By: {resource.author}</div>
        <div className="resource-availability">
          <span>Available: {resource.availableCopies}/{resource.totalCopies}</span>
          <span>Location: {resource.location}</span>
        </div>
        {resource.description && <div className="resource-description">{resource.description}</div>}
      </div>
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="resources-container">
          <div className="loading-state">Loading library resources...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="resources-container">
          <div className="error-state">Error loading resources. Showing default resources.</div>
          <div className="resources-container">
            {defaultResources.map(renderResource)}
          </div>
        </div>
      );
    }

    switch (styleId) {
      case 'library-sliding-carousel':
        return (
          <div className="resources-container">
            <div className="carousel-track">
              {resourceItems.map(renderResource)}
              {/* Duplicate for seamless loop */}
              {resourceItems.map((resource, index) => renderResource(resource, index + resourceItems.length))}
            </div>
          </div>
        );
      case 'library-minimal-lines':
        return (
          <div className="resources-container">
            {resourceItems.map(renderResource)}
          </div>
        );
      default:
        return (
          <div className="resources-container">
            {resourceItems.map(renderResource)}
          </div>
        );
    }
  }

  return (
    <section className={`library-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default LibrarySection;