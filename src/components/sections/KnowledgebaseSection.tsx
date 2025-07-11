import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/knowledgebase.css';
import { HelpCircle } from 'lucide-react';

interface KnowledgebaseSectionProps {
  section: Section;
}

const KnowledgebaseSection: React.FC<KnowledgebaseSectionProps> = ({ section }) => {
  const { title, articles } = section.content;
  const styleId = section.styleId || 'knowledgebase-accordion-q-a';

  const defaultArticles = [
    { question: 'How do I enroll?', answer: 'You can enroll by visiting the admissions page and filling out the online form.' },
    { question: 'What are the school hours?', answer: 'The school is open from 8:00 AM to 4:00 PM, Monday to Friday.' },
    { question: 'What is the student-teacher ratio?', answer: 'We maintain a low student-teacher ratio of 15:1 to ensure personalized attention.' },
  ];

  const kbArticles = articles && articles.length > 0 ? articles : defaultArticles;

  const renderArticle = (article: any, index: number) => (
    <details key={index} className="faq-item">
      <summary className="question flex items-center">
        <HelpCircle className="w-5 h-5 mr-3 text-primary" />
        {article.question}
      </summary>
      <div className="answer p-4">
        {article.answer}
      </div>
    </details>
  );

  return (
    <section className={`knowledgebase-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="knowledgebase-container">
          {kbArticles.map(renderArticle)}
        </div>
      </div>
    </section>
  );
};

export default KnowledgebaseSection;