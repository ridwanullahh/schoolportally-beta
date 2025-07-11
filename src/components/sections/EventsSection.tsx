import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import sdk from '@/lib/sdk-config';
import { useSchool } from '@/contexts/SchoolContext';
import { Link } from 'react-router-dom';

interface EventsSectionProps {
  section: Section;
}

const EventsSection: React.FC<EventsSectionProps> = ({ section }) => {
  const { title } = section.content;
  const { school } = useSchool();
  const [events, setEvents] = useState<any[]>([]);

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
    <section className="events-section py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">{title || 'Upcoming Events'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.length > 0 ? events.map((event: any) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{new Date(event.date).toLocaleDateString()}</p>
                <p>{event.description?.substring(0, 100)}...</p>
              </CardContent>
              <CardFooter>
                <Link to={`/${school?.slug}/events/${event.id}`}>
                  <Button variant="link">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          )) : <p>No upcoming events.</p>}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;