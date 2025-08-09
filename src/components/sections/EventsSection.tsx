import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, Calendar, User, ArrowRight, ChevronDown, MapPin, Clock } from 'lucide-react';
import sdk from '@/lib/sdk-config';
import { useSchool } from '@/contexts/SchoolContext';
import { Link } from 'react-router-dom';
import '@/themes/styles/sections/events-modern.css';
import '@/themes/styles/sections/events-section-styles.css';

interface EventsSectionProps {
  section: Section;
}

const EventsSection: React.FC<EventsSectionProps> = ({ section }) => {
  const { content, settings } = section;
  const { school } = useSchool();
  const [events, setEvents] = useState<any[]>([]);

  // Section settings with defaults
  const eventsToShow = parseInt(settings?.eventsToShow || '6');
  const enableSearch = settings?.enableSearch !== false;
  const enableFiltering = settings?.enableFiltering !== false;
  const enableSorting = settings?.enableSorting !== false;
  const enableLoadMore = settings?.enableLoadMore !== false;
  const showViewAllButton = settings?.showViewAllButton !== false;

  // State for controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [displayedEvents, setDisplayedEvents] = useState(eventsToShow);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'events-modern-grid',
      '2': 'events-modern-timeline',
      '3': 'events-modern-calendar',
      '4': 'events-modern-cards',
      '5': 'events-modern-showcase',
      '6': 'events-modern-list',
      '7': 'events-modern-masonry',
      '8': 'events-modern-featured',
      '9': 'events-modern-compact',
      '10': 'events-modern-magazine',
      '11': 'events-modern-slider',
      // Existing ultra-modern styles (12+)
      '12': 'events-floating-glass',
      '13': 'events-holographic-cards',
      '14': 'events-neon-grid',
      '15': 'events-particle-bg',
      '16': 'events-morphing-cards',
      '17': 'events-cyber-grid',
      '18': 'events-liquid-metal',
      '19': 'events-aurora-bg',
      '20': 'events-matrix-rain',
      '21': 'events-quantum-field',
      '22': 'events-neural-network',
      '23': 'events-hologram-effect',
      '24': 'events-energy-waves',
      '25': 'events-digital-rain',
      '26': 'events-mosaic-layout'
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