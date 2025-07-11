import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const EventPage = () => {
  const { eventId } = useParams();
  const { school } = useSchool();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (school && eventId) {
        setLoading(true);
        const currentEvent = await sdk.getItem('events', eventId);
        setEvent(currentEvent);
        setLoading(false);
      }
    };
    fetchEvent();
  }, [school, eventId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found.</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Date: {new Date(event.date).toLocaleDateString()} | Location: {event.location}
            </p>
            <div dangerouslySetInnerHTML={{ __html: event.description }} />
          </CardContent>
        </Card>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default EventPage;