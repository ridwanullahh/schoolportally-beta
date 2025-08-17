
import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';

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
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'academic',
    status: 'scheduled'
  });

  const eventTypes = ['academic', 'exam', 'holiday', 'meeting', 'event', 'other'];

  useEffect(() => {
    fetchEvents();
  }, [school]);

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

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

  const handleCreateEvent = async () => {
    if (!school) return;

    try {
      const newEvent = await sdk.insert<CalendarEvent>('calendar_events', {
        id: generateUniqueId(),
        ...eventForm,
        schoolId: school.id,
        createdAt: new Date().toISOString()
      });
      setEvents([...events, newEvent]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating calendar event:', error);
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;

    try {
      const updatedEvent = await sdk.update<CalendarEvent>('calendar_events', selectedEvent.id, eventForm);
      setEvents(events.map(event => 
        event.id === selectedEvent.id ? updatedEvent : event
      ));
      resetForm();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating calendar event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await sdk.delete('calendar_events', eventId);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting calendar event:', error);
    }
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      type: 'academic',
      status: 'scheduled'
    });
  };

  const openEditDialog = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      type: event.type,
      status: event.status
    });
    setIsEditing(true);
    setIsDialogOpen(true);
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

  const isAdmin = user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner');
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Academic Calendar</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {(isAdmin || user?.userType === 'teacher') && (
            <DialogTrigger asChild>
              <Button onClick={() => { setIsEditing(false); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </DialogTrigger>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Title *</label>
                <Input
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date *</label>
                  <Input
                    type="date"
                    value={eventForm.startDate}
                    onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <Input
                    type="date"
                    value={eventForm.endDate}
                    onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <Select value={eventForm.type} onValueChange={(value) => setEventForm({ ...eventForm, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={eventForm.status} onValueChange={(value) => setEventForm({ ...eventForm, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Event description"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateEvent : handleCreateEvent}>
                {isEditing ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{events.length}</div>
                <p className="text-xs text-muted-foreground">Total Events</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{events.filter(e => e.status === 'scheduled').length}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{events.filter(e => e.status === 'ongoing').length}</div>
            <p className="text-xs text-muted-foreground">Ongoing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{events.filter(e => e.status === 'completed').length}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

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
                <div className="flex space-x-1">
                  {(user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner') || user?.userType === 'teacher') && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(event)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
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
        
        {events.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No calendar events found. Create your first event to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarModule;
