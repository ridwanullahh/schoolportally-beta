import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/testimonials.css';

interface TestimonialsSectionProps {
  section: Section;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ section }) => {
  const { title, testimonials } = section.content;
  const styleId = section.styleId || 'testimonials-grid-praise';

  const defaultTestimonials = [
    { text: 'This school is amazing! My kids are thriving.', author: 'Happy Parent' },
    { text: 'The teachers are so dedicated and supportive.', author: 'Grateful Student' },
    { text: 'A wonderful and nurturing learning environment.', author: 'Alumni' },
  ];

  const testimonialItems = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  const renderTestimonial = (testimonial: any, index: number) => (
    <div key={index} className="testimonial-item">
      <blockquote className="text-lg italic">"{testimonial.text}"</blockquote>
      <p className="author mt-4 font-semibold text-right">- {testimonial.author}</p>
    </div>
  );

  return (
    <section className={`testimonials-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="testimonials-container">
          {testimonialItems.map(renderTestimonial)}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;