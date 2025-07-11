import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const EventsPage = () => {
  const { school } = useSchool();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      if (school) {
        setLoading(true);
        const allEvents = await sdk.get('events');
        const schoolEvents = allEvents.filter((e: any) => e.schoolId === school.id && e.status === 'published');
        setEvents(schoolEvents);
        setLoading(false);
      }
    };
    fetchEvents();
  }, [school]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Upcoming Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.length > 0 ? events.map((event: any) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{new Date(event.date).toLocaleDateString()}</p>
                <p>{event.description?.substring(0, 150)}...</p>
              </CardContent>
              <CardFooter>
                <Link to={`/${school?.slug}/events/${event.id}`}>
                  <Button variant="link">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          )) : <p className="col-span-full text-center">No upcoming events found.</p>}
        </div>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default EventsPage;