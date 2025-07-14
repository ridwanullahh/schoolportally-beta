import React, { useState, useEffect } from 'react';
import { Section, Event } from '@/types';
import '@/themes/styles/sections/events-snapshot.css';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventsSnapshotSectionProps {
  section: Section;
}

const EventsSnapshotSection: React.FC<EventsSnapshotSectionProps> = ({ section }) => {
  const { title, events } = section.content;
  const styleId = section.styleId || 'events_snapshot-grid-cards';
  const [activeCategory, setActiveCategory] = useState('All');
  const [timeLefts, setTimeLefts] = useState<Record<number, { days: number; hours: number; minutes: number; seconds: number; } | {}>>({});
  const [activeEvent, setActiveEvent] = useState(0);

  const defaultEvents: Event[] = [
    { title: 'Annual Sports Day', date: '2024-08-15', time: '9:00 AM', location: 'Main Ground', countdown: '2024-08-15T09:00:00', category: 'Sports' },
    { title: 'Science Fair', date: '2024-09-01', time: '10:00 AM', location: 'Auditorium', countdown: '2024-09-01T10:00:00', category: 'Academics' },
    { title: 'Parent-Teacher Meeting', date: '2024-09-15', time: '1:00 PM', location: 'Classrooms', countdown: '2024-09-15T13:00:00', category: 'Academics' },
  ];

  const eventItems: Event[] = events && events.length > 0 ? events : defaultEvents;

  useEffect(() => {
    if (styleId === 'events_snapshot-countdown-boxes') {
      const calculateTimeLeft = (countdown: string | undefined) => {
        if (!countdown) return {};
        const difference = +new Date(countdown) - +new Date();
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
          newTimeLefts[index] = calculateTimeLeft(event.countdown);
        });
        setTimeLefts(newTimeLefts);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [styleId, eventItems]);

  const renderEvent = (event: Event, index: number) => {
    const eventContent = (
      <>
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <div className="flex items-center text-muted-foreground text-sm mb-1"><Calendar className="w-4 h-4 mr-2" /><span>{event.date}</span></div>
        <div className="flex items-center text-muted-foreground text-sm"><MapPin className="w-4 h-4 mr-2" /><span>{event.location}</span></div>
        {styleId === 'events_snapshot-pill-tags' && event.tags && (
            <div className="tags">
                {event.tags.map((tag: string, i: number) => <span key={i} className="tag">{tag}</span>)}
            </div>
        )}
      </>
    );

    switch (styleId) {
      case 'events_snapshot-countdown-boxes':
        const timeLeft = timeLefts[index] || {};
        return (
          <div key={index} className="event-item event-box">
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
            <div className="countdown">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit}><span className="value">{value as number}</span><span className="unit text-sm">{unit}</span></div>
              ))}
            </div>
          </div>
        );
      case 'events_snapshot-accordion':
        return (
            <details key={index} className="event-item">
                <summary>{event.title}</summary>
                <div className="p-4">{eventContent}</div>
            </details>
        )
      default:
        return <div key={index} className="event-item">{eventContent}</div>;
    }
  };

  const categories = ['All', ...Array.from(new Set(eventItems.map(e => e.category || 'Other')))];

  const renderContainer = () => {
    const filteredEvents = activeCategory === 'All' ? eventItems : eventItems.filter(e => (e.category || 'Other') === activeCategory);
    
    switch(styleId) {
        case 'events_snapshot-tabbed-views':
            return (
                <>
                    <div className="tab-buttons">
                        {categories.map(c => <button key={c} onClick={() => setActiveCategory(c)} className={activeCategory === c ? 'active' : ''}>{c}</button>)}
                    </div>
                    <div className="events-container">{filteredEvents.map(renderEvent)}</div>
                </>
            );
        case 'events_snapshot-sticky-panel':
            return (
                <div className="events-container">
                    <div className="event-list">
                        {eventItems.map((event, index) => <div key={index} onClick={() => setActiveEvent(index)} className={`event-title ${index === activeEvent ? 'active' : ''}`}>{event.title}</div>)}
                    </div>
                    <div className="event-details">
                        {eventItems[activeEvent] && renderEvent(eventItems[activeEvent], activeEvent)}
                    </div>
                </div>
            )
        default:
            return <div className="events-container">{filteredEvents.map(renderEvent)}</div>;
    }
  }

  return (
    <section className={`events-snapshot-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContainer()}
      </div>
    </section>
  );
};

export default EventsSnapshotSection;