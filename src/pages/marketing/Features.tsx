
import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const Features = () => {
  const featureCategories = [
    {
      title: 'Core School Management',
      description: 'Essential tools for day-to-day school operations',
      features: [
        { name: 'Student Information System', description: 'Complete student profiles, enrollment, and academic tracking' },
        { name: 'Staff Management', description: 'Employee records, scheduling, and performance tracking' },
        { name: 'Class Scheduling', description: 'Automated timetable generation and conflict resolution' },
        { name: 'Attendance Tracking', description: 'Digital attendance with real-time parent notifications' }
      ]
    },
    {
      title: 'Academic Excellence',
      description: 'Tools to enhance teaching and learning outcomes',
      features: [
        { name: 'Learning Management System', description: 'Course delivery, assignments, and online assessments' },
        { name: 'Grade Management', description: 'Comprehensive grading system with progress tracking' },
        { name: 'Report Cards', description: 'Automated report generation with customizable templates' },
        { name: 'Academic Analytics', description: 'Data-driven insights for improving student performance' }
      ]
    },
    {
      title: 'Communication & Engagement',
      description: 'Stay connected with your school community',
      features: [
        { name: 'Parent Portal', description: 'Real-time access to student progress and school updates' },
        { name: 'Messaging System', description: 'Secure communication between staff, students, and parents' },
        { name: 'Event Management', description: 'Plan, promote, and manage school events and activities' },
        { name: 'Announcements', description: 'Broadcast important updates to targeted audiences' }
      ]
    },
    {
      title: 'Financial Management',
      description: 'Streamline your school\'s financial operations',
      features: [
        { name: 'Fee Management', description: 'Automated billing, payment processing, and financial tracking' },
        { name: 'Multiple Payment Gateways', description: 'Support for Paystack, Flutterwave, and other providers' },
        { name: 'Financial Reports', description: 'Comprehensive financial analytics and reporting' },
        { name: 'Scholarship Management', description: 'Track and manage financial aid programs' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom text-center">
            <div className="animate-fade-up">
              <h1 className="text-responsive-lg font-bold text-foreground mb-6">
                Powerful Features for{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Modern Islamic Schools
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                Discover all the tools and capabilities that make SchoolPortal the complete 
                solution for Islamic educational institutions worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Categories */}
        {featureCategories.map((category, categoryIndex) => (
          <section
            key={categoryIndex}
            className={`section-padding ${categoryIndex % 2 === 0 ? 'bg-muted/30' : ''}`}
          >
            <div className="container-custom">
              <div className="animate-fade-up mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">{category.title}</h2>
                <p className="text-xl text-muted-foreground">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {category.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${featureIndex * 0.1}s` }}
                  >
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* CTA Section */}
        <section className="section-padding bg-gradient-primary text-white">
          <div className="container-custom text-center">
            <div className="animate-fade-up">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Experience All These Features?
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of Islamic schools already using SchoolPortal to transform 
                their educational experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Start Free Trial
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
