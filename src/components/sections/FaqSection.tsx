import React, { useState } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/faq-modern.css';
import '@/themes/styles/sections/faq.css';
import '@/themes/styles/sections/faq-section-styles.css';
import { ChevronDown, Search, HelpCircle, Filter, ArrowRight } from 'lucide-react';

interface FAQSectionProps {
  section: Section;
}

const FAQSection: React.FC<FAQSectionProps> = ({ section }) => {
  const { title, faqs } = section.content;

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'faq-modern-accordion',
      '2': 'faq-modern-cards',
      '3': 'faq-modern-split',
      '4': 'faq-modern-minimal',
      '5': 'faq-modern-bordered',
      '6': 'faq-modern-gradient',
      '7': 'faq-modern-compact',
      '8': 'faq-modern-asymmetric',
      '9': 'faq-modern-typography',
      '10': 'faq-modern-timeline',
      '11': 'faq-modern-tabbed',
      // Existing styles (12+)
      '12': 'faq-accordion-faq',
      '13': 'faq-grid',
      '14': 'faq-tabs',
      '15': 'faq-minimal',
      '16': 'faq-cards',
      '17': 'faq-timeline',
      '18': 'faq-collapsible',
      '19': 'faq-search',
      '20': 'faq-category',
      '21': 'faq-modern',
      '22': 'faq-classic',
      '23': 'faq-elegant',
      '24': 'faq-creative',
      '25': 'faq-professional',
      '26': 'faq-academic'
    };
    return styleMap[styleNumber] || 'faq-modern-accordion';
  };

  const styleId = getStyleId(section.styleId || '1');
  const [activeTab, setActiveTab] = useState('All');

  const defaultFaqs = [
    { question: 'What is your admissions process?', answer: 'Our admissions process involves an online application, submission of academic records, and an interview.', category: 'Admissions' },
    { question: 'Do you offer scholarships?', answer: 'Yes, we offer a range of merit-based and need-based scholarships. Please visit our financial aid page for more details.', category: 'Admissions' },
    { question: 'What extracurricular activities are available?', answer: 'We have a wide variety of clubs and activities, including sports, arts, and academic societies.', category: 'Student Life' },
  ];

  const faqItems = faqs && faqs.length > 0 ? faqs : defaultFaqs;
  
  const categories = ['All', ...new Set(faqItems.map((faq: any) => faq.category))];
  
  const filteredFaqs = activeTab === 'All'
    ? faqItems
    : faqItems.filter((faq: any) => faq.category === activeTab);

  const renderFAQ = (faq: any, index: number) => (
    <details key={index} className="faq-item">
      <summary className="question">
        {faq.question}
        <ChevronDown className="w-4 h-4 ml-2 inline-block" />
      </summary>
      <div className="answer">
        {faq.answer}
      </div>
    </details>
  );
  
  const renderContent = () => {
    if (styleId === 'faq-tabbed-faqs') {
      return (
        <div>
          <div className="tabs flex justify-center gap-4 mb-8">
            {categories.map((category: string) => (
              <button key={category} className={`tab ${activeTab === category ? 'active' : ''}`} onClick={() => setActiveTab(category)}>
                {category}
              </button>
            ))}
          </div>
          <div className="faq-container">
            {filteredFaqs.map(renderFAQ)}
          </div>
        </div>
      )
    }

    return (
      <div className="faq-container">
        {faqItems.map(renderFAQ)}
      </div>
    )
  }

  return (
    <section className={`faq-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default FAQSection;