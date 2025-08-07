import React from 'react';
import MarketingHeader from '../../components/marketing/MarketingHeader';
import MarketingFooter from '../../components/marketing/MarketingFooter';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  Globe, 
  GraduationCap,
  CreditCard,
  FileText,
  Clock,
  Smartphone,
  Database,
  Settings,
  Award,
  Heart,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

const Features = () => {
  const featureCategories = [
    {
      title: 'Student Information System',
      description: 'Comprehensive student management with Islamic values integration',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      features: [
        { name: 'Complete Student Profiles', description: 'Detailed records including Islamic studies progress, Quran memorization tracking, and character development' },
        { name: 'Enrollment Management', description: 'Streamlined admission process with Islamic school-specific requirements and documentation' },
        { name: 'Academic Progress Tracking', description: 'Monitor both secular and Islamic studies performance with comprehensive reporting' },
        { name: 'Behavioral Assessment', description: 'Track Islamic character development, Akhlaq progress, and social behavior patterns' },
        { name: 'Health & Medical Records', description: 'Maintain health records with consideration for Islamic dietary requirements and prayer times' },
        { name: 'Family Information', description: 'Complete family profiles with emergency contacts and Islamic community connections' }
      ]
    },
    {
      title: 'Islamic Learning Management System',
      description: 'Shariah-compliant LMS with Islamic content integration',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
      features: [
        { name: 'Quran & Hadith Integration', description: 'Built-in Quranic verses and Hadith references with authentic sources and translations' },
        { name: 'Islamic Curriculum Management', description: 'Structured Islamic studies curriculum with Fiqh, Aqeedah, Seerah, and Arabic language' },
        { name: 'Memorization Tracking', description: 'Track Quran memorization progress with audio recording and verification features' },
        { name: 'Prayer Time Integration', description: 'Automatic prayer time calculations and class scheduling around Salah times' },
        { name: 'Islamic Calendar', description: 'Hijri calendar integration with Islamic holidays and important dates' },
        { name: 'Halal Content Filtering', description: 'Ensure all educational content meets Islamic guidelines and values' }
      ]
    },
    {
      title: 'Communication & Parent Engagement',
      description: 'Strengthen school-family relationships with transparent communication',
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500',
      features: [
        { name: 'Real-time Parent Portal', description: 'Parents access grades, attendance, assignments, and Islamic studies progress instantly' },
        { name: 'Multi-language Support', description: 'Support for Arabic, English, and other languages common in Muslim communities' },
        { name: 'Islamic Event Notifications', description: 'Automated notifications for Islamic holidays, school events, and important announcements' },
        { name: 'Secure Messaging', description: 'Safe communication platform between teachers, parents, and administrators' },
        { name: 'Mobile App Access', description: 'Native mobile apps for iOS and Android with push notifications' },
        { name: 'Community Building', description: 'Foster Islamic community connections through school-wide communication features' }
      ]
    },
    {
      title: 'Financial Management & Billing',
      description: 'Comprehensive financial tools with Islamic banking compliance',
      icon: CreditCard,
      color: 'from-orange-500 to-red-500',
      features: [
        { name: 'Automated Fee Collection', description: 'Streamlined tuition and fee collection with multiple payment gateway support' },
        { name: 'Islamic Banking Integration', description: 'Support for Shariah-compliant payment methods and Islamic banking principles' },
        { name: 'Zakat & Donation Management', description: 'Track and manage Zakat contributions and charitable donations to the school' },
        { name: 'Scholarship Management', description: 'Manage need-based and merit-based scholarships with Islamic criteria' },
        { name: 'Financial Reporting', description: 'Comprehensive financial reports with transparency for board members and stakeholders' },
        { name: 'Payment Plans', description: 'Flexible payment plans to accommodate different family financial situations' }
      ]
    },
    {
      title: 'Staff & Teacher Management',
      description: 'Empower educators with comprehensive management tools',
      icon: GraduationCap,
      color: 'from-indigo-500 to-blue-500',
      features: [
        { name: 'Islamic Teacher Qualifications', description: 'Track Islamic studies certifications, Ijazah, and religious qualifications' },
        { name: 'Professional Development', description: 'Manage Islamic education training, workshops, and continuing education' },
        { name: 'Performance Evaluation', description: 'Comprehensive evaluation system including Islamic character and teaching effectiveness' },
        { name: 'Scheduling & Substitutes', description: 'Automated scheduling with consideration for prayer times and Islamic obligations' },
        { name: 'Payroll Integration', description: 'Streamlined payroll processing with Islamic employment law compliance' },
        { name: 'Resource Management', description: 'Manage Islamic books, teaching materials, and educational resources' }
      ]
    },
    {
      title: 'Analytics & Reporting',
      description: 'Data-driven insights for educational excellence',
      icon: BarChart3,
      color: 'from-teal-500 to-cyan-500',
      features: [
        { name: 'Academic Performance Analytics', description: 'Detailed analytics on both secular and Islamic studies performance' },
        { name: 'Attendance Insights', description: 'Track attendance patterns including Friday prayers and Islamic events' },
        { name: 'Financial Dashboards', description: 'Real-time financial health monitoring with Islamic accounting principles' },
        { name: 'Parent Engagement Metrics', description: 'Measure and improve parent involvement in school activities' },
        { name: 'Custom Report Builder', description: 'Create custom reports for board meetings, accreditation, and compliance' },
        { name: 'Predictive Analytics', description: 'AI-powered insights to identify at-risk students and improvement opportunities' }
      ]
    }
  ];

  const additionalFeatures = [
    { icon: Shield, title: 'Security & Privacy', description: 'Enterprise-grade security with FERPA compliance and data protection' },
    { icon: Globe, title: 'Multi-Campus Support', description: 'Manage multiple school locations from a single dashboard' },
    { icon: Smartphone, title: 'Mobile-First Design', description: 'Responsive design that works perfectly on all devices' },
    { icon: Database, title: 'Cloud Infrastructure', description: '99.9% uptime with automatic backups and disaster recovery' },
    { icon: Settings, title: 'Custom Integrations', description: 'API access and custom integrations with existing systems' },
    { icon: Award, title: 'Accreditation Support', description: 'Built-in tools to support Islamic school accreditation processes' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container-custom text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Comprehensive Features for
              <span className="text-primary block">Islamic Schools</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Everything you need to run a modern Islamic educational institution efficiently, 
              while maintaining Islamic values and principles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Categories */}
        <section className="py-20">
          <div className="container-custom">
            <div className="space-y-20">
              {featureCategories.map((category, index) => (
                <div key={index} className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-5 rounded-3xl`}></div>
                  <div className="relative bg-white rounded-3xl p-12 shadow-xl">
                    <div className="flex items-center mb-8">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl mr-6`}>
                        <category.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-foreground mb-2">{category.title}</h2>
                        <p className="text-lg text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {category.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-2">{feature.name}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Additional Powerful Features
              </h2>
              <p className="text-xl text-muted-foreground">
                Built with modern technology and Islamic principles in mind
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-6">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="container-custom text-center">
            <h2 className="text-4xl font-bold mb-6">
              Experience the Difference
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of Islamic schools that have transformed their operations with SchoolPortally
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Contact Sales
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-4">
              No credit card required • 30-day free trial • Full feature access
            </p>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
};

export default Features;
