import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/testimonials.css';

interface TestimonialsSectionProps {
  section: Section;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ section }) => {
  const { title, testimonials } = section.content;
  const styleId = section.styleId || 'testimonials-grid-praise';
  const [activeIndex, setActiveIndex] = useState(0);

  const defaultTestimonials = [
    { text: 'This school is amazing! My kids are thriving.', author: 'Happy Parent', role: 'Parent', avatar: 'https://via.placeholder.com/50' },
    { text: 'The teachers are so dedicated and supportive.', author: 'Grateful Student', role: 'Student', avatar: 'https://via.placeholder.com/50' },
    { text: 'A wonderful and nurturing learning environment.', author: 'Alumni', role: 'Alumni', avatar: 'https://via.placeholder.com/50' },
  ];

  const testimonialItems = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  useEffect(() => {
    if (styleId === 'testimonials-faded-rotate' || styleId === 'testimonials-carousel') {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialItems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [styleId, testimonialItems.length]);

  const renderTestimonial = (testimonial: any, index: number) => {
    const testimonialContent = (
      <>
        <blockquote className="text-lg italic">"{testimonial.text}"</blockquote>
        <p className="author mt-4 font-semibold text-right">- {testimonial.author}</p>
        {testimonial.role && <p className="role text-sm text-gray-500 text-right">{testimonial.role}</p>}
      </>
    );

    switch (styleId) {
      case 'testimonials-flip-cards':
        return (
          <div key={index} className="testimonial-item">
            <div className="flip-card-inner">
              <div className="flip-card-front">{testimonialContent}</div>
              <div className="flip-card-back"><p>{testimonial.author}</p></div>
            </div>
          </div>
        );
      case 'testimonials-stacked-bubbles':
        return (
          <div key={index} className="testimonial-item">
            <img src={testimonial.avatar || 'https://via.placeholder.com/50'} alt={testimonial.author} className="avatar" />
            <div className="bubble">{testimonialContent}</div>
          </div>
        );
      case 'testimonials-timeline-voices':
        return (
           <div key={index} className="testimonial-item">
             <div className="date">{testimonial.date || '2024'}</div>
             {testimonialContent}
           </div>
        );
      case 'testimonials-accordion-quotes':
        return (
            <details key={index} className="testimonial-item">
                <summary>{testimonial.author}</summary>
                <div className="p-4">{testimonialContent}</div>
            </details>
        )
      default:
        return <div key={index} className="testimonial-item">{testimonialContent}</div>;
    }
  };
  
  const renderContent = () => {
    switch (styleId) {
        case 'testimonials-side-quote-bar':
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="author-list col-span-1">
                        {testimonialItems.map((testimonial, index) => (
                             <div key={index} className={`author-name ${index === activeIndex ? 'active' : ''}`} onClick={() => setActiveIndex(index)}>
                                <p className="font-semibold">{testimonial.author}</p>
                                <p className="text-sm text-gray-500">{testimonial.role}</p>
                            </div>
                        ))}
                    </div>
                    <div className="quote-display col-span-2 flex items-center">
                        <blockquote className="text-2xl italic">
                        "{testimonialItems[activeIndex]?.text}"
                        </blockquote>
                    </div>
                </div>
            );
        case 'testimonials-carousel':
        case 'testimonials-quote-slider':
             return (
                <div className="testimonials-container relative">
                    {testimonialItems.map((testimonial, index) => (
                        <div key={index} className={`testimonial-item ${index === activeIndex ? 'active' : ''}`}>
                            {renderTestimonial(testimonial, index)}
                        </div>
                    ))}
                     <div className="slider-controls">
                        {testimonialItems.map((_, index) => (
                            <button key={index} onClick={() => setActiveIndex(index)} className={index === activeIndex ? 'active' : ''}></button>
                        ))}
                    </div>
                </div>
            );
        default:
            return (
                <div className="testimonials-container">
                    {testimonialItems.map(renderTestimonial)}
                </div>
            );
    }
  }

  return (
    <section className={`testimonials-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default TestimonialsSection;