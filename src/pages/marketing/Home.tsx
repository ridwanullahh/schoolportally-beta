
import React from 'react';
import MarketingHeader from '../../components/marketing/MarketingHeader';
import MarketingFooter from '../../components/marketing/MarketingFooter';
import HeroSection from '../../components/marketing/HeroSection';
import FeaturesSection from '../../components/marketing/FeaturesSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  BarChart3,
  Shield,
  Globe,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Award,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';

const Home = () => {
  const stats = [
    { number: '10,000+', label: 'Students Managed', icon: Users },
    { number: '500+', label: 'Schools Worldwide', icon: GraduationCap },
    { number: '99.9%', label: 'Uptime Guarantee', icon: Shield },
    { number: '24/7', label: 'Support Available', icon: Clock }
  ];

  const testimonials = [
    {
      name: 'Dr. Ahmed Hassan',
      role: 'Principal, Al-Noor Islamic Academy',
      content: 'SchoolPortally transformed our school management completely. The Islamic-friendly features and comprehensive tools have made our operations 300% more efficient.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Sister Fatima Al-Zahra',
      role: 'Administrator, Madinah Girls School',
      content: 'The parent portal and communication features have revolutionized how we connect with families. Parents love the real-time updates and transparency.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Ustadh Omar Ibrahim',
      role: 'IT Director, Quranic Learning Center',
      content: 'The LMS integration with Islamic content and the billing system has streamlined everything. We can focus on education instead of administration.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increase Efficiency by 300%',
      description: 'Automate administrative tasks and focus on what matters most - education.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Improve Parent Engagement',
      description: 'Real-time communication and transparency builds stronger school-family relationships.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      title: 'Enhance Academic Performance',
      description: 'Data-driven insights help identify and support student success.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Reduce Operational Costs',
      description: 'Eliminate paper-based processes and reduce administrative overhead.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for small Islamic schools',
      features: [
        'Up to 100 students',
        'Basic student management',
        'Parent portal',
        'Email support',
        'Islamic calendar integration'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'Ideal for growing institutions',
      features: [
        'Up to 500 students',
        'Advanced LMS features',
        'Financial management',
        'Priority support',
        'Custom Islamic content',
        'Mobile app access',
        'Analytics dashboard'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'For large educational networks',
      features: [
        'Unlimited students',
        'Multi-campus management',
        'Advanced reporting',
        'Dedicated support',
        'Custom integrations',
        'White-label options',
        'API access',
        'Training included'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <main>
        <HeroSection />

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FeaturesSection />

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Transform Your School with Proven Results
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Join thousands of Islamic schools that have revolutionized their operations with SchoolPortally
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-lg mb-6`}>
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Loved by Educators Worldwide
              </h2>
              <p className="text-xl text-muted-foreground">
                See what school leaders are saying about SchoolPortally
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-muted-foreground">
                Choose the perfect plan for your Islamic school
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white p-8 rounded-2xl shadow-lg relative ${
                    plan.popular ? 'ring-2 ring-primary scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? 'bg-primary' : 'bg-muted'}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="container-custom text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your School?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of Islamic schools worldwide that trust SchoolPortally for their digital transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-4">
              No credit card required • 30-day free trial • Cancel anytime
            </p>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Trusted by Leading Islamic Educational Institutions
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
              <div className="flex items-center justify-center h-16 bg-white rounded-lg shadow-sm">
                <span className="font-semibold text-muted-foreground">Al-Azhar Academy</span>
              </div>
              <div className="flex items-center justify-center h-16 bg-white rounded-lg shadow-sm">
                <span className="font-semibold text-muted-foreground">Madinah School</span>
              </div>
              <div className="flex items-center justify-center h-16 bg-white rounded-lg shadow-sm">
                <span className="font-semibold text-muted-foreground">Quranic Institute</span>
              </div>
              <div className="flex items-center justify-center h-16 bg-white rounded-lg shadow-sm">
                <span className="font-semibold text-muted-foreground">Islamic College</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
};

export default Home;
