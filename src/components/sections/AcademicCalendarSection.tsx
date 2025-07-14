import React from 'react';
import { useState } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/academic-calendar.css';
import { CalendarDays } from 'lucide-react';

interface AcademicCalendarSectionProps {
  section: Section;
}

const AcademicCalendarSection: React.FC<AcademicCalendarSectionProps> = ({ section }) => {
  const { title, events } = section.content;
  const styleId = section.styleId || 'academic_calendar-grid-month-view';
  const [activeTab, setActiveTab] = useState('All');

  const defaultEvents = [
    { date: '2024-09-01', title: 'Fall Semester Begins', term: 'Fall 2024' },
    { date: '2024-10-14', title: 'Mid-term Break', term: 'Fall 2024' },
    { date: '2024-12-20', title: 'Fall Semester Ends', term: 'Fall 2024' },
    { date: '2025-01-15', title: 'Spring Semester Begins', term: 'Spring 2025' },
  ];

  const calendarEvents = events && events.length > 0 ? events : defaultEvents;
  
  const terms = ['All', ...new Set(calendarEvents.map((e: any) => e.term))];
  
  const filteredEvents = activeTab === 'All'
    ? calendarEvents
    : calendarEvents.filter((e: any) => e.term === activeTab);

  const renderEvent = (event: any, index: number) => (
    <div key={index} className="event-item">
      <div className="flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-primary" />
        <span className="font-bold">{event.date}</span>
      </div>
      <p className="text-muted-foreground">{event.title}</p>
    </div>
  );
  
  const renderContent = () => {
    if (styleId === 'academic_calendar-tab-by-term') {
      return (
        <div>
          <div className="tabs flex justify-center gap-4 mb-8">
            {terms.map(term => (
              <button key={term} className={`tab ${activeTab === term ? 'active' : ''}`} onClick={() => setActiveTab(term)}>
                {term}
              </button>
            ))}
          </div>
          <div className="calendar-container">
            {filteredEvents.map(renderEvent)}
          </div>
        </div>
      )
    }

    return (
      <div className="calendar-container">
        {calendarEvents.map(renderEvent)}
      </div>
    )
  }

  return (
    <section className={`academic-calendar-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default AcademicCalendarSection;