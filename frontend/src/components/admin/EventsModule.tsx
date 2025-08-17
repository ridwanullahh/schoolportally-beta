
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
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Clock } from 'lucide-react';

interface Event {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  organizer: string;
  capacity: number;
  registrations: any[];
  status: string;
  tags: string[];
  recurring: boolean;
  recurringPattern?: any;
  createdAt: string;
}

const EventsModule: React.FC = () => {
  const { school } = useSchool();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'academic',
    image: '',
    organizer: '',
    capacity: 100,
    status: 'upcoming',
    tags: '',
    recurring: false
  });

  const categories = ['academic', 'sports', 'cultural', 'social', 'meeting', 'workshop', 'ceremony', 'other'];

  useEffect(() => {
    fetchEvents();
  }, [school]);

  const fetchEvents = async () => {
    if (!school) return;

    setLoading(true);
    try {
      const allEvents = await sdk.get<Event>('events');
      const schoolEvents = allEvents.filter(event => event.schoolId === school.id);
      setEvents(schoolEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!school) return;

    try {
      const tags = eventForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const newEvent = await sdk.insert<Event>('events', {
        ...eventForm,
        schoolId: school.id,
        tags,
        registrations: [],
        createdAt: new Date().toISOString()
      });
      setEvents([...events, newEvent]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;

    try {
      const tags = eventForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const updatedEvent = await sdk.update<Event>('events', selectedEvent.id, {
        ...eventForm,
        tags
      });
      setEvents(events.map(event => 
        event.id === selectedEvent.id ? updatedEvent : event
      ));
      resetForm();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await sdk.delete('events', eventId);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: 'academic',
      image: '',
      organizer: '',
      capacity: 100,
      status: 'upcoming',
      tags: '',
      recurring: false
    });
  };

  const openEditDialog = (event: Event) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      image: event.image,
      organizer: event.organizer,
      capacity: event.capacity,
      status: event.status,
      tags: event.tags.join(', '),
      recurring: event.recurring
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      academic: 'bg-purple-100 text-purple-800',
      sports: 'bg-green-100 text-green-800',
      cultural: 'bg-pink-100 text-pink-800',
      social: 'bg-blue-100 text-blue-800',
      meeting: 'bg-orange-100 text-orange-800',
      workshop: 'bg-indigo-100 text-indigo-800',
      ceremony: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const isAdmin = user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner');
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Events Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {(user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner') || user?.userType === 'teacher') && (
            <DialogTrigger asChild>
              <Button onClick={() => { setIsEditing(false); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </DialogTrigger>
          )}
          <DialogContent className="max-w-2xl">
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
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <Input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <Input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={eventForm.category} onValueChange={(value) => setEventForm({ ...eventForm, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
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
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="Event location"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Organizer</label>
                <Input
                  value={eventForm.organizer}
                  onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })}
                  placeholder="Event organizer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Capacity</label>
                <Input
                  type="number"
                  value={eventForm.capacity}
                  onChange={(e) => setEventForm({ ...eventForm, capacity: Number(e.target.value) })}
                  placeholder="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <Input
                  value={eventForm.image}
                  onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                <Input
                  value={eventForm.tags}
                  onChange={(e) => setEventForm({ ...eventForm, tags: e.target.value })}
                  placeholder="sports day, annual, outdoor"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Event description"
                  rows={4}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={eventForm.recurring}
                  onChange={(e) => setEventForm({ ...eventForm, recurring: e.target.checked })}
                />
                <label>Recurring Event</label>
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
            <div className="text-2xl font-bold">{events.filter(e => e.status === 'upcoming').length}</div>
            <p className="text-xs text-muted-foreground">Upcoming</p>
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
            <div className="text-2xl font-bold">{events.reduce((acc, e) => acc + e.registrations.length, 0)}</div>
            <p className="text-xs text-muted-foreground">Total Registrations</p>
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
                    <Badge className={getCategoryColor(event.category)}>
                      {event.category}
                    </Badge>
                    <Badge className={getStatusColor(event.status)}>
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
              {event.image && (
                <img src={event.image} alt={event.title} className="w-full h-32 object-cover rounded mb-4" />
              )}
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  {event.time && <span className="ml-2">{event.time}</span>}
                </div>
                
                {event.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{event.registrations.length}/{event.capacity} registered</span>
                </div>
                
                {event.organizer && (
                  <div className="flex items-center">
                    <span className="text-gray-500">Organizer:</span>
                    <span className="ml-1">{event.organizer}</span>
                  </div>
                )}
              </div>
              
              {event.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(event.registrations.length / event.capacity) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {events.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No events found. Create your first event to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsModule;
