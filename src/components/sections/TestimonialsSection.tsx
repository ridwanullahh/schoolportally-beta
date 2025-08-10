import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import { useTestimonials, Testimonial } from '@/hooks/useTestimonials';
import '@/themes/styles/sections/testimonials-modern.css';
import '@/themes/styles/sections/testimonials-ultra-modern.css';
import '@/themes/styles/sections/testimonials-section-styles.css';
import { Star, Quote, Play, Filter, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialsSectionProps {
  section: Section;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ section }) => {
  const { title, testimonials } = section.content;
  const { getPublishedTestimonials, loading } = useTestimonials();

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'testimonials-modern-grid',
      '2': 'testimonials-modern-centered',
      '3': 'testimonials-modern-horizontal',
      '4': 'testimonials-modern-masonry',
      '5': 'testimonials-modern-minimal',
      '6': 'testimonials-modern-bordered',
      '7': 'testimonials-modern-gradient',
      '8': 'testimonials-modern-quote',
      '9': 'testimonials-modern-split',
      '10': 'testimonials-modern-compact',
      '11': 'testimonials-modern-asymmetric',
      // Existing ultra-modern styles (12+)
      '12': 'testimonials-floating-glass',
      '13': 'testimonials-circular',
      '14': 'testimonials-sliding',
      '15': 'testimonials-hexagon',
      '16': 'testimonials-geometric',
      '17': 'testimonials-isometric',
      '18': 'testimonials-liquid',
      '19': 'testimonials-gradient-orbs',
      '20': 'testimonials-paper-stack',
      '21': 'testimonials-neon-outline',
      '22': 'testimonials-mosaic',
      '23': 'testimonials-holographic',
      '24': 'testimonials-progress',
      '25': 'testimonials-minimal-lines',
      '26': 'testimonials-carousel'
    };
    return styleMap[styleNumber] || 'testimonials-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');
  const [activeIndex, setActiveIndex] = useState(0);

  const defaultTestimonials: Testimonial[] = [
    {
      id: '1',
      schoolId: '',
      text: 'This school has transformed my child\'s learning experience. The teachers are incredibly dedicated and the facilities are top-notch.',
      author: 'Sarah Johnson',
      role: 'Parent',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      status: 'published',
      featured: false,
      date: '2024-01-15',
      createdAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      schoolId: '',
      text: 'The supportive environment here has helped me excel academically and personally. I couldn\'t ask for a better educational experience.',
      author: 'Michael Chen',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      status: 'published',
      featured: false,
      date: '2024-01-10',
      createdAt: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      schoolId: '',
      text: 'As an alumnus, I can confidently say this school prepared me exceptionally well for my career. The education quality is outstanding.',
      author: 'Emily Rodriguez',
      role: 'Alumni',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      status: 'published',
      featured: false,
      date: '2024-01-05',
      createdAt: '2024-01-05T00:00:00Z'
    },
  ];

  // Get published testimonials from admin module or use defaults
  const publishedTestimonials = getPublishedTestimonials();

  // Use testimonials from section content, published testimonials, or defaults
  const testimonialItems = testimonials && testimonials.length > 0
    ? testimonials
    : publishedTestimonials.length > 0
    ? publishedTestimonials.slice(0, 6) // Limit to 6 testimonials
    : defaultTestimonials;

  useEffect(() => {
    if (styleId === 'testimonials-sliding' || styleId === 'testimonials-carousel') {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialItems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [styleId, testimonialItems.length]);

  const renderTestimonial = (testimonial: Testimonial, index: number) => {
    const testimonialContent = (
      <>
        <blockquote>"{testimonial.text}"</blockquote>
        <p className="author">- {testimonial.author}</p>
        {testimonial.role && <p className="role">{testimonial.role}</p>}
        {testimonial.rating && (
          <div className="rating">
            {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
          </div>
        )}
      </>
    );

    switch (styleId) {
      // New Modern Styles (1-11) - Most use default layout
      case 'testimonials-modern-grid':
      case 'testimonials-modern-centered':
      case 'testimonials-modern-masonry':
      case 'testimonials-modern-minimal':
      case 'testimonials-modern-bordered':
      case 'testimonials-modern-gradient':
      case 'testimonials-modern-quote':
      case 'testimonials-modern-split':
      case 'testimonials-modern-compact':
      case 'testimonials-modern-asymmetric':
        return (
          <div key={index} className="testimonial-item">
            {testimonialContent}
          </div>
        );

      case 'testimonials-modern-horizontal':
        return (
          <div key={index} className="testimonial-item">
            <div className="testimonial-content">
              {testimonialContent}
            </div>
          </div>
        );

      // Existing Ultra-Modern Styles (12+)
      case 'testimonials-circular':
        return (
          <div key={index} className="testimonial-item">
            {testimonial.avatar && (
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="avatar"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
                }}
              />
            )}
            {testimonialContent}
          </div>
        );
      case 'testimonials-sliding':
        return (
          <div
            key={index}
            className={`testimonial-item ${index === activeIndex ? 'active' : index === activeIndex - 1 ? 'prev' : ''}`}
          >
            {testimonialContent}
          </div>
        );
      case 'testimonials-hexagon':
      case 'testimonials-geometric':
      case 'testimonials-isometric':
      case 'testimonials-liquid':
      case 'testimonials-gradient-orbs':
      case 'testimonials-paper-stack':
      case 'testimonials-neon-outline':
      case 'testimonials-mosaic':
      case 'testimonials-holographic':
      case 'testimonials-progress':
        return (
          <div key={index} className="testimonial-item">
            {testimonialContent}
          </div>
        );
      default:
        return (
          <div key={index} className="testimonial-item">
            {testimonialContent}
          </div>
        );
    }
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        </div>
      );
    }

    if (testimonialItems.length === 0) {
      return (
        <div className="empty-state text-center py-12">
          <p className="text-brand-text-secondary">No testimonials available at the moment.</p>
        </div>
      );
    }

    switch (styleId) {
      case 'testimonials-sliding':
        return (
          <div className="testimonials-container">
            {testimonialItems.map(renderTestimonial)}
            <div className="slider-controls">
              {testimonialItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={index === activeIndex ? 'active' : ''}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        );
      case 'testimonials-minimal-lines':
      case 'testimonials-progress':
        return (
          <div className="testimonials-container">
            {testimonialItems.map(renderTestimonial)}
          </div>
        );
      default:
        return (
          <div className="testimonials-container">
            {testimonialItems.map(renderTestimonial)}
          </div>
        );
    }
  };

  return (
    <section className={`testimonials-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default TestimonialsSection;