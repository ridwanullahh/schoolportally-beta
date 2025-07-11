import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/academic-calendar.css';
import { CalendarDays } from 'lucide-react';

interface AcademicCalendarSectionProps {
  section: Section;
}

const AcademicCalendarSection: React.FC<AcademicCalendarSectionProps> = ({ section }) => {
  const { title, events } = section.content;
  const styleId = section.styleId || 'academic_calendar-grid-month-view';

  const defaultEvents = [
    { date: '2024-09-01', title: 'Fall Semester Begins' },
    { date: '2024-10-14', title: 'Mid-term Break' },
    { date: '2024-12-20', title: 'Fall Semester Ends' },
  ];

  const calendarEvents = events && events.length > 0 ? events : defaultEvents;

  const renderEvent = (event: any, index: number) => (
    <div key={index} className="event-item">
      <div className="flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-primary" />
        <span className="font-bold">{event.date}</span>
      </div>
      <p className="text-muted-foreground">{event.title}</p>
    </div>
  );

  return (
    <section className={`academic-calendar-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="calendar-container">
          {calendarEvents.map(renderEvent)}
        </div>
      </div>
    </section>
  );
};

export default AcademicCalendarSection;