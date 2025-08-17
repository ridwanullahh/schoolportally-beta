import { useState, useEffect } from 'react';
import { useSchool } from './useSchool';
import sdk from '@/lib/sdk-config';

export interface CalendarEvent {
  id: string;
  uid?: string;
  schoolId: string;
  title: string;
  description?: string;
  type: 'academic' | 'exam' | 'holiday' | 'event' | 'deadline' | 'meeting';
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  allDay: boolean;
  recurring: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
  };
  attendees?: string[];
  organizer?: string;
  organizerId?: string;
  color?: string;
  priority: 'low' | 'medium' | 'high';
  reminders?: {
    type: 'email' | 'notification';
    time: number; // minutes before event
  }[];
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  tags?: string[];
  academicYear: string;
  semester?: string;
  grade?: string;
  subject?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  visibility: 'public' | 'students' | 'faculty' | 'admin';
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export const useAcademicCalendar = () => {
  const { school } = useSchool();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<CalendarEvent>('calendar', (allEvents) => {
      const schoolEvents = allEvents
        .filter(e => e.schoolId === school.id && e.status !== 'cancelled')
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      setEvents(schoolEvents);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createEvent = async (eventData: Omit<CalendarEvent, 'id' | 'uid' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<CalendarEvent>('calendar', {
      ...eventData,
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    return sdk.update<CalendarEvent>('calendar', id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteEvent = async (id: string) => {
    return sdk.delete('calendar', id);
  };

  const getEventsByType = (type: string) => {
    return events.filter(event => event.type === type);
  };

  const getEventsByDateRange = (startDate: string, endDate: string) => {
    return events.filter(event => 
      event.startDate >= startDate && event.startDate <= endDate
    );
  };

  const getUpcomingEvents = (limit?: number) => {
    const now = new Date().toISOString();
    return events
      .filter(event => event.startDate >= now)
      .slice(0, limit || 10);
  };

  const getEventsByMonth = (year: number, month: number) => {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0).toISOString();
    return getEventsByDateRange(startDate, endDate);
  };

  const getEventTypes = () => {
    const types = [...new Set(events.map(event => event.type))];
    return types.filter(Boolean);
  };

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByType,
    getEventsByDateRange,
    getUpcomingEvents,
    getEventsByMonth,
    getEventTypes,
  };
};
