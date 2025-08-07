import React from 'react';
import { useState } from 'react';
import { Section } from '@/types';
import { useAcademicCalendar } from '@/hooks/useAcademicCalendar';
import '@/themes/styles/sections/academic-calendar-modern.css';
import '@/themes/styles/sections/all-remaining-ultra-modern.css';
import { CalendarDays } from 'lucide-react';

interface AcademicCalendarSectionProps {
  section: Section;
}

const AcademicCalendarSection: React.FC<AcademicCalendarSectionProps> = ({ section }) => {
  const { title } = section.content;

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'academic-calendar-modern-grid',
      '2': 'academic-calendar-modern-timeline',
      '3': 'academic-calendar-modern-cards',
      '4': 'academic-calendar-modern-minimal',
      '5': 'academic-calendar-modern-bordered',
      '6': 'academic-calendar-modern-gradient',
      '7': 'academic-calendar-modern-compact',
      '8': 'academic-calendar-modern-asymmetric',
      '9': 'academic-calendar-modern-typography',
      '10': 'academic-calendar-modern-split',
      '11': 'academic-calendar-modern-calendar',
      // Existing ultra-modern styles (12+)
      '12': 'academic-calendar-floating-glass',
      '13': 'academic-calendar-holographic-cards',
      '14': 'academic-calendar-neon-timeline',
      '15': 'academic-calendar-particle-bg',
      '16': 'academic-calendar-morphing-cards',
      '17': 'academic-calendar-cyber-grid',
      '18': 'academic-calendar-liquid-metal',
      '19': 'academic-calendar-aurora-bg',
      '20': 'academic-calendar-matrix-rain',
      '21': 'academic-calendar-quantum-field',
      '22': 'academic-calendar-neural-network',
      '23': 'academic-calendar-hologram-effect',
      '24': 'academic-calendar-energy-waves',
      '25': 'academic-calendar-digital-rain',
      '26': 'academic-calendar-mosaic-layout'
    };
    return styleMap[styleNumber] || 'academic-calendar-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');
  const [activeTab, setActiveTab] = useState('All');

  // Use dynamic content from academic calendar admin module
  const { events, loading, error, getUpcomingEvents } = useAcademicCalendar();

  const defaultEvents = [
    {
      id: '1',
      title: 'Fall Semester Begins',
      date: '2024-09-01',
      endDate: '2024-09-01',
      type: 'academic',
      term: 'Fall 2024',
      description: 'First day of classes for the Fall 2024 semester.',
      location: 'Campus Wide',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
      featured: true,
      status: 'published'
    },
    {
      id: '2',
      title: 'Mid-term Break',
      date: '2024-10-14',
      endDate: '2024-10-18',
      type: 'holiday',
      term: 'Fall 2024',
      description: 'Mid-semester break for students and faculty.',
      location: 'Campus Wide',
      image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=300&fit=crop',
      featured: false,
      status: 'published'
    },
    {
      id: '3',
      title: 'Fall Semester Ends',
      date: '2024-12-20',
      endDate: '2024-12-20',
      type: 'academic',
      term: 'Fall 2024',
      description: 'Last day of classes and final exams for Fall 2024.',
      location: 'Campus Wide',
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop',
      featured: true,
      status: 'published'
    },
    {
      id: '4',
      title: 'Spring Semester Begins',
      date: '2025-01-15',
      endDate: '2025-01-15',
      type: 'academic',
      term: 'Spring 2025',
      description: 'First day of classes for the Spring 2025 semester.',
      location: 'Campus Wide',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
      featured: true,
      status: 'published'
    },
    {
      id: '5',
      title: 'Spring Break',
      date: '2025-03-10',
      endDate: '2025-03-14',
      type: 'holiday',
      term: 'Spring 2025',
      description: 'Spring break vacation for students and faculty.',
      location: 'Campus Wide',
      image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=300&fit=crop',
      featured: false,
      status: 'published'
    },
    {
      id: '6',
      title: 'Graduation Ceremony',
      date: '2025-05-15',
      endDate: '2025-05-15',
      type: 'ceremony',
      term: 'Spring 2025',
      description: 'Annual graduation ceremony for graduating students.',
      location: 'Main Auditorium',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
      featured: true,
      status: 'published'
    }
  ];

  // Use dynamic content if available, otherwise use defaults
  const calendarEvents = events && events.length > 0 ? events : defaultEvents;
  
  const renderEvent = (event: any, index: number) => {
    const eventImage = event.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop';

    return (
      <div key={event.id || index} className="event-card">
        <img
          src={eventImage}
          alt={event.title}
          className="event-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop';
          }}
        />
        <div className="event-title">{event.title}</div>
        <div className="event-type">{event.type}</div>
        <div className="event-date">{event.date}</div>
        {event.endDate && event.endDate !== event.date && (
          <div className="event-end-date">to {event.endDate}</div>
        )}
        <div className="event-location">{event.location}</div>
        {event.description && <div className="event-description">{event.description}</div>}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="events-container">
          <div className="loading-state">Loading academic calendar...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="events-container">
          <div className="error-state">Error loading calendar. Showing default events.</div>
          <div className="events-container">
            {defaultEvents.map(renderEvent)}
          </div>
        </div>
      );
    }

    switch (styleId) {
      case 'academic-calendar-sliding-carousel':
        return (
          <div className="events-container">
            <div className="carousel-track">
              {calendarEvents.map(renderEvent)}
              {/* Duplicate for seamless loop */}
              {calendarEvents.map((event, index) => renderEvent(event, index + calendarEvents.length))}
            </div>
          </div>
        );
      case 'academic-calendar-minimal-lines':
        return (
          <div className="events-container">
            {calendarEvents.map(renderEvent)}
          </div>
        );
      default:
        return (
          <div className="events-container">
            {calendarEvents.map(renderEvent)}
          </div>
        );
    }
  }

  return (
    <section className={`academic-calendar-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default AcademicCalendarSection;