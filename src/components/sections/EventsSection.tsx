import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import sdk from '@/lib/sdk-config';
import { useSchool } from '@/contexts/SchoolContext';
import { Link } from 'react-router-dom';
import '@/themes/styles/sections/events-modern.css';

interface EventsSectionProps {
  section: Section;
}

const EventsSection: React.FC<EventsSectionProps> = ({ section }) => {
  const { title } = section.content;
  const { school } = useSchool();
  const [events, setEvents] = useState<any[]>([]);

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'events-modern-grid',
      '2': 'events-modern-timeline',
      '3': 'events-modern-horizontal',
      '4': 'events-modern-compact',
      '5': 'events-modern-featured',
      '6': 'events-modern-minimal',
      '7': 'events-modern-calendar',
      '8': 'events-modern-gradient',
      '9': 'events-modern-split',
      '10': 'events-modern-bordered',
      '11': 'events-modern-asymmetric',
      // Existing styles (12+)
      '12': 'events-grid',
      '13': 'events-list',
      '14': 'events-cards',
      '15': 'events-timeline',
      '16': 'events-calendar',
      '17': 'events-slider',
      '18': 'events-masonry',
      '19': 'events-featured',
      '20': 'events-compact',
      '21': 'events-detailed',
      '22': 'events-minimal',
      '23': 'events-modern',
      '24': 'events-classic',
      '25': 'events-elegant',
      '26': 'events-creative'
    };
    return styleMap[styleNumber] || 'events-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');

  useEffect(() => {
    const fetchEvents = async () => {
      if (school) {
        const allEvents = await sdk.get('events');
        const schoolEvents = allEvents.filter((e: any) => e.schoolId === school.id && e.status === 'published').slice(0, 3);
        setEvents(schoolEvents);
      }
    };
    fetchEvents();
  }, [school]);

  return (
    <section className={`events-section ${styleId}`}>
      <div className="container">
        {title && <h2>{title}</h2>}
        <div className="events-container">
          {events.length > 0 ? events.map((event: any) => (
            <div key={event.id} className="event-card">
              {event.image && <img src={event.image} alt={event.title} className="event-image" />}
              <div className="event-content">
                <div className="event-date">
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">
                  {event.description?.substring(0, 150)}...
                </p>
                <Link to={`/${school?.slug}/events/${event.id}`} className="event-button">
                  View Details
                </Link>
              </div>
            </div>
          )) : (
            <div className="no-events">
              <p>No upcoming events.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;