import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const AcademicCalendarPage = () => {
  const { school } = useSchool();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      if (school) {
        setLoading(true);
        const allEvents = await sdk.get('calendar_events');
        const schoolEvents = allEvents
          .filter((e: any) => e.schoolId === school.id)
          .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
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
        <h1 className="text-4xl font-bold text-center mb-12">Academic Calendar</h1>
        <div className="space-y-6">
          {events.length > 0 ? events.map((event: any) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </p>
                <p>{event.description}</p>
              </CardContent>
            </Card>
          )) : <p className="text-center">No academic events found.</p>}
        </div>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default AcademicCalendarPage;