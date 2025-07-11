import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/events-snapshot.css';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventsSnapshotSectionProps {
  section: Section;
}

const EventsSnapshotSection: React.FC<EventsSnapshotSectionProps> = ({ section }) => {
  const { title, events } = section.content;
  const styleId = section.styleId || 'events_snapshot-grid-cards';

  const defaultEvents = [
    { title: 'Annual Sports Day', date: '2024-08-15', time: '9:00 AM', location: 'Main Ground' },
    { title: 'Science Fair', date: '2024-09-01', time: '10:00 AM', location: 'Auditorium' },
    { title: 'Parent-Teacher Meeting', date: '2024-09-15', time: '1:00 PM', location: 'Respective Classrooms' },
  ];

  const eventItems = events && events.length > 0 ? events : defaultEvents;

  const renderEvent = (event: any, index: number) => (
    <div key={index} className="event-item">
      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
      <div className="flex items-center text-muted-foreground text-sm mb-1">
        <Calendar className="w-4 h-4 mr-2" />
        <span>{event.date}</span>
      </div>
      <div className="flex items-center text-muted-foreground text-sm mb-1">
        <Clock className="w-4 h-4 mr-2" />
        <span>{event.time}</span>
      </div>
      <div className="flex items-center text-muted-foreground text-sm">
        <MapPin className="w-4 h-4 mr-2" />
        <span>{event.location}</span>
      </div>
    </div>
  );

  return (
    <section className={`events-snapshot-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="events-container">
          {eventItems.map(renderEvent)}
        </div>
      </div>
    </section>
  );
};

export default EventsSnapshotSection;