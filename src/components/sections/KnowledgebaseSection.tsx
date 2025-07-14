import React from 'react';
import { useState } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/knowledgebase.css';
import { HelpCircle } from 'lucide-react';

interface KnowledgebaseSectionProps {
  section: Section;
}

const KnowledgebaseSection: React.FC<KnowledgebaseSectionProps> = ({ section }) => {
  const { title, articles } = section.content;
  const styleId = section.styleId || 'knowledgebase-accordion-q-a';
  const [activeTab, setActiveTab] = useState('All');

  const defaultArticles = [
    { question: 'How do I enroll?', answer: 'You can enroll by visiting the admissions page and filling out the online form.', category: 'Admissions' },
    { question: 'What are the school hours?', answer: 'The school is open from 8:00 AM to 4:00 PM, Monday to Friday.', category: 'General' },
    { question: 'What is the student-teacher ratio?', answer: 'We maintain a low student-teacher ratio of 15:1 to ensure personalized attention.', category: 'Academics' },
  ];

  const kbArticles = articles && articles.length > 0 ? articles : defaultArticles;
  
  const categories = ['All', ...new Set(kbArticles.map((a: any) => a.category))];
  
  const filteredArticles = activeTab === 'All'
    ? kbArticles
    : kbArticles.filter((a: any) => a.category === activeTab);

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
  
  const renderContent = () => {
    if (styleId === 'knowledgebase-category-tabs') {
      return (
        <div>
          <div className="tabs flex justify-center gap-4 mb-8">
            {categories.map(category => (
              <button key={category} className={`tab ${activeTab === category ? 'active' : ''}`} onClick={() => setActiveTab(category)}>
                {category}
              </button>
            ))}
          </div>
          <div className="knowledgebase-container">
            {filteredArticles.map(renderArticle)}
          </div>
        </div>
      )
    }
    
    return (
      <div className="knowledgebase-container">
        {kbArticles.map(renderArticle)}
      </div>
    )
  }

  return (
    <section className={`knowledgebase-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default KnowledgebaseSection;