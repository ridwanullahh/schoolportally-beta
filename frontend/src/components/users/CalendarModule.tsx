import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

interface CalendarEvent {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  createdAt: string;
}

const CalendarModule: React.FC = () => {
  const { school } = useSchool();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [school]);

  const fetchEvents = async () => {
    if (!school) return;

    setLoading(true);
    try {
      const allEvents = await sdk.get<CalendarEvent>('calendar_events');
      const schoolEvents = allEvents.filter(event => event.schoolId === school.id);
      setEvents(schoolEvents.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      academic: 'bg-blue-100 text-blue-800',
      exam: 'bg-red-100 text-red-800',
      holiday: 'bg-green-100 text-green-800',
      meeting: 'bg-purple-100 text-purple-800',
      event: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Academic Calendar</h2>
      </div>

      {events.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          No calendar events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                      <Badge variant="outline">
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Start: {new Date(event.startDate).toLocaleDateString()}</span>
                  </div>
                  
                  {event.endDate && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>End: {new Date(event.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarModule;