import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import { useEvents, Event } from '@/hooks/useEvents';
import '@/themes/styles/sections/events-snapshot-ultra-modern.css';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventsSnapshotSectionProps {
  section: Section;
}

const EventsSnapshotSection: React.FC<EventsSnapshotSectionProps> = ({ section }) => {
  const { title, events } = section.content;
  const { getUpcomingEvents, loading } = useEvents();
  const styleId = section.styleId || 'events-floating-timeline';
  const [activeCategory, setActiveCategory] = useState('All');
  const [timeLefts, setTimeLefts] = useState<Record<number, { days: number; hours: number; minutes: number; seconds: number; } | {}>>({});
  const [activeEvent, setActiveEvent] = useState(0);

  const defaultEvents: Event[] = [
    {
      id: '1',
      schoolId: '',
      title: 'Annual Sports Day',
      description: 'Join us for our annual sports day featuring various athletic competitions and team events.',
      date: '2024-08-15',
      time: '9:00 AM',
      location: 'Main Ground',
      category: 'sports',
      organizer: 'Sports Department',
      capacity: 500,
      status: 'upcoming',
      tags: ['sports', 'annual', 'competition'],
      recurring: true,
      createdAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      schoolId: '',
      title: 'Science Fair',
      description: 'Students showcase their innovative science projects and experiments.',
      date: '2024-09-01',
      time: '10:00 AM',
      location: 'Auditorium',
      category: 'academic',
      organizer: 'Science Department',
      capacity: 300,
      status: 'upcoming',
      tags: ['science', 'exhibition', 'students'],
      recurring: false,
      createdAt: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      schoolId: '',
      title: 'Parent-Teacher Meeting',
      description: 'Important meeting to discuss student progress and academic performance.',
      date: '2024-09-15',
      time: '1:00 PM',
      location: 'Classrooms',
      category: 'meeting',
      organizer: 'Academic Office',
      capacity: 200,
      status: 'upcoming',
      tags: ['parents', 'teachers', 'academic'],
      recurring: true,
      createdAt: '2024-01-05T00:00:00Z'
    },
  ];

  // Get upcoming events from admin module or use defaults
  const upcomingEvents = getUpcomingEvents();

  // Use events from section content, upcoming events, or defaults
  const eventItems = events && events.length > 0
    ? events
    : upcomingEvents.length > 0
    ? upcomingEvents.slice(0, 6) // Limit to 6 events
    : defaultEvents;

  useEffect(() => {
    if (styleId === 'events-sliding-carousel') {
      const interval = setInterval(() => {
        setActiveEvent((prev) => (prev + 1) % eventItems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [styleId, eventItems.length]);

  useEffect(() => {
    const calculateTimeLeft = (eventDate: string, eventTime: string) => {
      const eventDateTime = new Date(`${eventDate}T${eventTime}`);
      const difference = eventDateTime.getTime() - new Date().getTime();
      return difference > 0 ? {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      } : {};
    };

    const timer = setInterval(() => {
      const newTimeLefts: Record<number, { days: number; hours: number; minutes: number; seconds: number; } | {}> = {};
      eventItems.forEach((event, index) => {
        newTimeLefts[index] = calculateTimeLeft(event.date, event.time);
      });
      setTimeLefts(newTimeLefts);
    }, 1000);

    return () => clearInterval(timer);
  }, [eventItems]);

  const renderEvent = (event: Event, index: number) => {
    const eventContent = (
      <>
        <h3 className="event-title">{event.title}</h3>
        <div className="event-meta">
          <div className="event-meta-item">
            <Calendar />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="event-meta-item">
            <Clock />
            <span>{event.time}</span>
          </div>
          <div className="event-meta-item">
            <MapPin />
            <span>{event.location}</span>
          </div>
        </div>
        {event.description && (
          <p className="event-description">{event.description}</p>
        )}
      </>
    );

    switch (styleId) {
      case 'events-sliding-carousel':
        return (
          <div
            key={index}
            className={`event-item ${index === activeEvent ? 'active' : index === activeEvent - 1 ? 'prev' : ''}`}
          >
            {eventContent}
          </div>
        );
      case 'events-hexagon-calendar':
        return (
          <div key={index} className="event-item">
            <div className="event-date">{new Date(event.date).getDate()}</div>
            <h3 className="event-title">{event.title}</h3>
            <div className="event-location">{event.location}</div>
          </div>
        );
      case 'events-circular-calendar':
        return (
          <div key={index} className="event-item">
            <div className="event-date">{new Date(event.date).getDate()}</div>
            <h3 className="event-title">{event.title}</h3>
            <div className="event-location">{event.location}</div>
          </div>
        );
      default:
        return (
          <div key={index} className="event-item">
            {eventContent}
          </div>
        );
    }
  };

  const categories = ['All', ...Array.from(new Set(eventItems.map(e => e.category || 'other')))];

  const renderContainer = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        </div>
      );
    }

    if (eventItems.length === 0) {
      return (
        <div className="empty-state text-center py-12">
          <p className="text-brand-text-secondary">No upcoming events at the moment.</p>
        </div>
      );
    }

    const filteredEvents = activeCategory === 'All' ? eventItems : eventItems.filter(e => (e.category || 'other') === activeCategory);

    switch(styleId) {
      case 'events-sliding-carousel':
        return (
          <div className="events-container">
            {eventItems.map(renderEvent)}
            <div className="carousel-controls">
              {eventItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveEvent(index)}
                  className={index === activeEvent ? 'active' : ''}
                  aria-label={`View event ${index + 1}`}
                />
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="events-container">
            {filteredEvents.map(renderEvent)}
          </div>
        );
    }
  };

  return (
    <section className={`events-snapshot-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContainer()}
      </div>
    </section>
  );
};

export default EventsSnapshotSection;