import React, { useState } from 'react';
import { Section } from '@/types';
import { useTestimonials, Testimonial } from '@/hooks/useTestimonials';
import { getStyleNumber } from '@/utils/sectionStyleUtils';
import { Star } from 'lucide-react';

interface TestimonialsSectionProps {
  section: Section;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ section }) => {
  const { title, testimonials } = section.content;
  const { getPublishedTestimonials, loading } = useTestimonials();

  // Determine normalized style number and class
  const styleNum = String(getStyleNumber(section.styleId || '1'));
  const sectionClass = `testimonials-section testimonials-style-${styleNum}`;

  const [activeIndex, setActiveIndex] = useState(0);

  const defaultTestimonials: Testimonial[] = [
    {
      id: '1', schoolId: '', text: "This school has transformed my child's learning experience. The teachers are incredibly dedicated and the facilities are top-notch.", author: 'Sarah Johnson', role: 'Parent', rating: 5, status: 'published', featured: false, date: '2024-01-15', createdAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2', schoolId: '', text: "The supportive environment here has helped me excel academically and personally. I couldn't ask for a better educational experience.", author: 'Michael Chen', role: 'Student', rating: 5, status: 'published', featured: false, date: '2024-01-10', createdAt: '2024-01-10T00:00:00Z'
    },
    {
      id: '3', schoolId: '', text: 'As an alumnus, I can confidently say this school prepared me exceptionally well for my career. The education quality is outstanding.', author: 'Emily Rodriguez', role: 'Alumni', rating: 5, status: 'published', featured: false, date: '2024-01-05', createdAt: '2024-01-05T00:00:00Z'
    },
  ];

  const publishedTestimonials = getPublishedTestimonials();

  const testimonialItems = testimonials && testimonials.length > 0
    ? testimonials
    : publishedTestimonials.length > 0
    ? publishedTestimonials.slice(0, 6)
    : defaultTestimonials;

  const renderTestimonial = (testimonial: Testimonial, index: number) => {
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
      <div key={index} className="testimonial-card">
        {testimonial.rating && (
          <div className="testimonial-rating">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={16}
                className={`star ${i < (testimonial.rating || 0) ? 'filled' : ''}`}
                fill={i < (testimonial.rating || 0) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
        )}
        <blockquote className="testimonial-quote">{testimonial.text}</blockquote>
        <div className="testimonial-author">
          <div className="testimonial-avatar">
            {testimonial.avatar ? (
              <img src={testimonial.avatar} alt={testimonial.author} />
            ) : (
              getInitials(testimonial.author)
            )}
          </div>
          <div className="testimonial-info">
            <h4>{testimonial.author}</h4>
            {testimonial.role && <p>{testimonial.role}</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={sectionClass}>
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">{title}</h2>
          {section.content.subtitle && (
            <p className="testimonials-subtitle">{section.content.subtitle}</p>
          )}
        </div>
        {loading ? (
          <div className="loading-state">Loading testimonials...</div>
        ) : testimonialItems.length === 0 ? (
          <div className="empty-state">No testimonials available.</div>
        ) : (
          <div className="testimonials-grid">
            {testimonialItems.map(renderTestimonial)}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;