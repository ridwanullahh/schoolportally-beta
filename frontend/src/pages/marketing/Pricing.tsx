import React, { useState } from 'react';
import MarketingHeader from '../../components/marketing/MarketingHeader';
import MarketingFooter from '../../components/marketing/MarketingFooter';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Users, 
  Building, 
  Globe,
  Shield,
  Zap,
  Heart,
  Award,
  Clock,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small Islamic schools and madrasas',
      monthlyPrice: 29,
      yearlyPrice: 290,
      savings: 20,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      popular: false,
      features: [
        'Up to 100 students',
        'Basic student management',
        'Parent portal access',
        'Islamic calendar integration',
        'Prayer time notifications',
        'Basic reporting',
        'Email support',
        'Mobile app access',
        'Quran memorization tracking',
        'Basic financial management'
      ],
      limits: {
        students: '100',
        staff: '10',
        storage: '5GB',
        support: 'Email'
      }
    },
    {
      name: 'Professional',
      description: 'Ideal for growing Islamic educational institutions',
      monthlyPrice: 79,
      yearlyPrice: 790,
      savings: 25,
      icon: Building,
      color: 'from-green-500 to-emerald-500',
      popular: true,
      features: [
        'Up to 500 students',
        'Advanced LMS features',
        'Islamic content library',
        'Financial management',
        'Advanced reporting & analytics',
        'Priority support',
        'Custom Islamic curriculum',
        'Parent-teacher communication',
        'Attendance management',
        'Grade management',
        'Event management',
        'Library management',
        'Transport management',
        'Exam management',
        'Certificate generation'
      ],
      limits: {
        students: '500',
        staff: '50',
        storage: '50GB',
        support: 'Priority Email & Chat'
      }
    },
    {
      name: 'Enterprise',
      description: 'For large Islamic educational networks and universities',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      savings: 30,
      icon: Globe,
      color: 'from-purple-500 to-pink-500',
      popular: false,
      features: [
        'Unlimited students',
        'Multi-campus management',
        'Advanced analytics & insights',
        'Dedicated account manager',
        'Custom integrations',
        'White-label options',
        'API access',
        'Training & onboarding',
        'Advanced security features',
        'Custom workflows',
        'Advanced reporting',
        'Data export capabilities',
        'Single sign-on (SSO)',
        'Advanced user permissions',
        'Custom branding',
        'Priority phone support'
      ],
      limits: {
        students: 'Unlimited',
        staff: 'Unlimited',
        storage: 'Unlimited',
        support: 'Dedicated Support Team'
      }
    }
  ];

  const addOns = [
    {
      name: 'SMS Notifications',
      description: 'Send SMS alerts to parents and staff',
      price: 15,
      icon: MessageSquare
    },
    {
      name: 'Advanced Analytics',
      description: 'Detailed insights and custom reports',
      price: 25,
      icon: Award
    },
    {
      name: 'Priority Support',
      description: '24/7 phone and chat support',
      price: 35,
      icon: Phone
    },
    {
      name: 'Custom Training',
      description: 'Personalized training sessions',
      price: 100,
      icon: Users
    }
  ];

  const faqs = [
    {
      question: 'Is there a free trial available?',
      answer: 'Yes! We offer a 30-day free trial with full access to all features. No credit card required to start.'
    },
    {
      question: 'Can I switch plans anytime?',
      answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
    },
    {
      question: 'Is the platform Shariah-compliant?',
      answer: 'Yes, SchoolPortally is designed with Islamic principles in mind, including prayer time integration, Islamic calendar, and halal content filtering.'
    },
    {
      question: 'Do you offer discounts for multiple schools?',
      answer: 'Yes, we offer special pricing for educational networks and organizations managing multiple schools. Contact our sales team for details.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, bank transfers, and Islamic banking-compliant payment methods.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use enterprise-grade security with encryption, regular backups, and comply with international data protection standards.'
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (billingCycle === 'yearly') {
      const monthlyCost = plan.monthlyPrice * 12;
      const yearlyCost = plan.yearlyPrice;
      return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container-custom text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Simple, Transparent
              <span className="text-primary block">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your Islamic school. All plans include our core features 
              with Islamic-specific tools and 24/7 support.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingCycle === 'yearly' ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                  Save up to 30%
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`relative bg-white rounded-3xl p-8 shadow-xl ${
                    plan.popular ? 'ring-2 ring-primary scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl mb-4`}>
                      <plan.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-6">{plan.description}</p>
                    
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-4xl font-bold text-foreground">${getPrice(plan)}</span>
                      <span className="text-muted-foreground ml-1">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    
                    {billingCycle === 'yearly' && getSavings(plan) > 0 && (
                      <p className="text-green-600 text-sm font-semibold">
                        Save {getSavings(plan)}% with yearly billing
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t pt-6 mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Plan Limits</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Students:</span>
                        <span className="font-semibold">{plan.limits.students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Staff:</span>
                        <span className="font-semibold">{plan.limits.staff}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage:</span>
                        <span className="font-semibold">{plan.limits.storage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Support:</span>
                        <span className="font-semibold">{plan.limits.support}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary' : 'bg-muted'}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    asChild
                  >
                    <Link to="/signup">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Add-ons Section */}
        <section className="py-20 bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Optional Add-ons
              </h2>
              <p className="text-xl text-muted-foreground">
                Enhance your plan with additional features
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {addOns.map((addon, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                    <addon.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{addon.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{addon.description}</p>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-foreground">${addon.price}</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about our pricing
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
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
              Start your free trial today and see why thousands of Islamic schools trust SchoolPortally
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Contact Sales
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-4">
              No credit card required • 30-day free trial • Cancel anytime
            </p>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
};

export default Pricing;
