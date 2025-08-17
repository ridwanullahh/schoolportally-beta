
import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      icon: '🏫',
      title: 'Complete School Management',
      description: 'Manage students, staff, classes, programs, and academic operations from one unified platform.',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: '📚',
      title: 'Islamic-Friendly LMS',
      description: 'Built-in Learning Management System with Shariah-compliant content delivery and assessment tools.',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: '💰',
      title: 'Integrated Billing',
      description: 'Automated fee collection, invoicing, and payment processing with multiple gateway support.',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      icon: '🌐',
      title: 'Custom School Websites',
      description: 'Professional websites with 15+ templates per section, fully customizable without coding.',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      icon: '👥',
      title: 'Role-Based Access',
      description: 'Secure multi-role system for administrators, teachers, students, and parents.',
      gradient: 'from-indigo-500 to-blue-600'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Fully responsive design that works perfectly on all devices and screen sizes.',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: '🤖',
      title: 'AI-Powered Features',
      description: 'Intelligent automation for grading, scheduling, and administrative tasks.',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description: 'Bank-level security with encryption, backups, and compliance with global standards.',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      icon: '📊',
      title: 'Analytics & Reports',
      description: 'Comprehensive reporting and analytics to track student progress and school performance.',
      gradient: 'from-violet-500 to-purple-600'
    }
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
            ✨ Comprehensive Features
          </div>
          <h2 className="text-responsive-lg font-bold text-foreground mb-6">
            Everything Your School Needs,{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              All in One Platform
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From student management to website creation, billing to learning management - 
            we've got every aspect of your school's digital transformation covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-card border border-border rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-up">
          <p className="text-lg text-muted-foreground mb-6">
            Ready to transform your school's digital experience?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Explore All Features
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="btn-outline">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
