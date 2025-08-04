import { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';

export interface Event {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image?: string;
  organizer: string;
  capacity: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags: string[];
  recurring: boolean;
  registrations?: string[];
  createdAt: string;
  updatedAt?: string;
}

export const useEvents = () => {
  const { school } = useSchool();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<Event>('events', (allEvents) => {
      const schoolEvents = allEvents.filter(e => e.schoolId === school.id);
      setEvents(schoolEvents);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createEvent = async (eventData: Omit<Event, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<Event>('events', { 
      ...eventData, 
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateEvent = async (eventId: string, updates: Partial<Event>) => {
    return sdk.update<Event>('events', eventId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteEvent = async (eventId: string) => {
    return sdk.delete('events', eventId);
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return events.filter(e => 
      e.status === 'upcoming' && 
      new Date(e.date) >= now
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getEventsByCategory = (category: string) => {
    return events.filter(e => e.category === category && e.status === 'upcoming');
  };

  const getFeaturedEvents = () => {
    return events.filter(e => 
      e.status === 'upcoming' && 
      e.tags.includes('featured')
    );
  };

  const getEventsThisWeek = () => {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate >= now && eventDate <= weekFromNow && e.status === 'upcoming';
    });
  };

  const getEventsThisMonth = () => {
    const now = new Date();
    const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    return events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate >= now && eventDate <= monthFromNow && e.status === 'upcoming';
    });
  };

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    getUpcomingEvents,
    getEventsByCategory,
    getFeaturedEvents,
    getEventsThisWeek,
    getEventsThisMonth,
  };
};
