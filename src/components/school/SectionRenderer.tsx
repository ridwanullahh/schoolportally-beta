
import React from 'react';
import { PageSection, School } from '@/types';
import { getStyleById } from '@/data/sectionStyles';

interface SectionRendererProps {
  section: PageSection;
  school: School;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section, school }) => {
  const sectionStyle = getStyleById(section.styleId);
  
  if (!sectionStyle) {
    return (
      <div className="py-8 text-center text-gray-500">
        Section style not found: {section.styleId}
      </div>
    );
  }

  // Apply theme colors
  const themeStyle = {
    '--primary-color': school.branding?.primaryColor || '#4f46e5',
    '--secondary-color': school.branding?.secondaryColor || '#06b6d4',
    '--accent-color': school.branding?.accentColor || '#f59e0b',
    '--font-family': school.branding?.fontFamily || 'Inter',
  } as React.CSSProperties;

  // Render based on section type and style
  if (section.type === 'hero') {
    if (section.styleId === 'hero-1') {
      return (
        <section className="hero-section py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white" style={themeStyle}>
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              {section.content.title || 'Welcome to Our School'}
            </h1>
            <p className="text-xl mb-4">
              {section.content.subtitle || 'Excellence in Education'}
            </p>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              {section.content.description || 'We provide quality education in a nurturing environment.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {section.content.primaryButton && (
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  {section.content.primaryButton}
                </button>
              )}
              {section.content.secondaryButton && (
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  {section.content.secondaryButton}
                </button>
              )}
            </div>
          </div>
        </section>
      );
    }

    if (section.styleId === 'hero-2') {
      return (
        <section className="hero-section py-20" style={themeStyle}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-bold mb-6">
                  {section.content.title || 'Welcome to Our School'}
                </h1>
                <p className="text-xl mb-4 text-gray-600">
                  {section.content.subtitle || 'Excellence in Education'}
                </p>
                <p className="text-lg mb-8 text-gray-700">
                  {section.content.description || 'We provide quality education in a nurturing environment.'}
                </p>
                {section.content.primaryButton && (
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    {section.content.primaryButton}
                  </button>
                )}
              </div>
              <div>
                {section.content.image && (
                  <img src={section.content.image} alt="Hero" className="w-full h-auto rounded-lg shadow-lg" />
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (section.styleId === 'hero-3') {
      return (
        <section className="hero-section relative py-20 overflow-hidden" style={themeStyle}>
          {section.content.videoUrl && (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={section.content.videoUrl} type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl font-bold mb-6 text-white">
              {section.content.title || 'Welcome to Our School'}
            </h1>
            <p className="text-xl mb-4 text-white">
              {section.content.subtitle || 'Excellence in Education'}
            </p>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-white">
              {section.content.description || 'We provide quality education in a nurturing environment.'}
            </p>
            {section.content.primaryButton && (
              <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {section.content.primaryButton}
              </button>
            )}
          </div>
        </section>
      );
    }
  }

  if (section.type === 'features') {
    if (section.styleId === 'features-1') {
      return (
        <section className="features-section py-16" style={themeStyle}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {section.content.title || 'Why Choose Us'}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {section.content.description || 'Discover what makes our school special'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Education</h3>
                <p className="text-gray-600">Comprehensive curriculum designed for student success</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Faculty</h3>
                <p className="text-gray-600">Dedicated teachers committed to student growth</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Modern Facilities</h3>
                <p className="text-gray-600">State-of-the-art learning environments</p>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (section.styleId === 'features-2') {
      const features = [
        {
          title: 'Advanced Learning',
          description: 'Cutting-edge educational methods',
          image: '/placeholder.svg'
        },
        {
          title: 'Expert Teachers',
          description: 'Qualified and experienced educators',
          image: '/placeholder.svg'
        },
        {
          title: 'Modern Campus',
          description: 'State-of-the-art facilities and technology',
          image: '/placeholder.svg'
        }
      ];

      return (
        <section className="features-section py-16" style={themeStyle}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {section.content.title || 'Our Features'}
              </h2>
            </div>
            <div className="space-y-16">
              {features.map((feature, index) => (
                <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-lg text-gray-600">{feature.description}</p>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <img src={feature.image} alt={feature.title} className="w-full h-64 object-cover rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
  }

  if (section.type === 'about') {
    return (
      <section className="about-section py-16" style={themeStyle}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {section.content.title || 'About Our School'}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {section.content.description || 'We are committed to providing excellent education and nurturing future leaders.'}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-gray-600">Teachers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
                  <div className="text-gray-600">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
            <div>
              {section.content.image && (
                <img src={section.content.image} alt="About" className="w-full h-auto rounded-lg shadow-lg" />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'testimonials') {
    const testimonials = [
      {
        name: 'Sarah Johnson',
        role: 'Parent',
        content: 'This school has transformed my child\'s learning experience.',
        avatar: '/placeholder.svg'
      },
      {
        name: 'Michael Chen',
        role: 'Alumni',
        content: 'The education I received here prepared me for success.',
        avatar: '/placeholder.svg'
      },
      {
        name: 'Emily Davis',
        role: 'Current Student',
        content: 'I love the supportive environment and excellent teachers.',
        avatar: '/placeholder.svg'
      }
    ];

    return (
      <section className="testimonials-section py-16 bg-gray-50" style={themeStyle}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {section.content.title || 'What People Say'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'cta') {
    return (
      <section className="cta-section py-16 bg-blue-600 text-white" style={themeStyle}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {section.content.title || 'Ready to Join Us?'}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {section.content.description || 'Take the first step towards an excellent education.'}
          </p>
          {section.content.buttonText && (
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {section.content.buttonText}
            </button>
          )}
        </div>
      </section>
    );
  }

  if (section.type === 'contact') {
    return (
      <section className="contact-section py-16" style={themeStyle}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {section.content.title || 'Contact Us'}
            </h2>
            <p className="text-lg text-gray-600">
              {section.content.description || 'Get in touch with us for more information.'}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600">📍</span>
                  </div>
                  <div>
                    <div className="font-semibold">Address</div>
                    <div className="text-gray-600">123 School Street, Education City</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600">📞</span>
                  </div>
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-gray-600">(555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600">✉️</span>
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-gray-600">info@school.edu</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default fallback rendering
  return (
    <section className="py-12" style={themeStyle}>
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {section.content.title || `Section: ${section.type}`}
          </h2>
          <p className="text-gray-600">
            {section.content.description || 'This section is being customized.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SectionRenderer;
