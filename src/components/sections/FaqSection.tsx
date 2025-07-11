import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/faq.css';
import { ChevronDown } from 'lucide-react';

interface FAQSectionProps {
  section: Section;
}

const FAQSection: React.FC<FAQSectionProps> = ({ section }) => {
  const { title, questions } = section.content;
  const styleId = section.styleId || 'faq-accordion-faq';

  const defaultQuestions = [
    { question: 'What is your admissions process?', answer: 'Our admissions process involves an online application, submission of academic records, and an interview.' },
    { question: 'Do you offer scholarships?', answer: 'Yes, we offer a range of merit-based and need-based scholarships. Please visit our financial aid page for more details.' },
    { question: 'What extracurricular activities are available?', answer: 'We have a wide variety of clubs and activities, including sports, arts, and academic societies.' },
  ];

  const faqItems = questions && questions.length > 0 ? questions : defaultQuestions;

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

  return (
    <section className={`faq-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="faq-container">
          {faqItems.map(renderFAQ)}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;