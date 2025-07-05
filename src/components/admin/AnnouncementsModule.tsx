
import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Megaphone, Pin, Eye, Calendar } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  schoolId: string;
  authorId: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  targetAudience: string[];
  status: 'published' | 'draft' | 'scheduled';
  publishedAt: string;
  expiresAt: string;
  category: string;
  attachments: string[];
  readBy: string[];
  pinned: boolean;
  sendEmail: boolean;
  sendSMS: boolean;
  views: number;
}

const AnnouncementsModule: React.FC = () => {
  const { school } = useSchool();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'normal' as Announcement['priority'],
    targetAudience: ['all'] as string[],
    status: 'published' as Announcement['status'],
    category: 'general',
    expiresAt: '',
    pinned: false,
    sendEmail: false,
    sendSMS: false,
  });

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
  ];

  const audienceOptions = [
    'all',
    'students',
    'parents',
    'teachers',
    'staff',
    'alumni'
  ];

  const categoryOptions = [
    'general',
    'academic',
    'events',
    'emergency',
    'maintenance',
    'policy',
    'sports',
    'holiday'
  ];

  useEffect(() => {
    fetchAnnouncements();
  }, [school]);

  const fetchAnnouncements = async () => {
    if (!school) return;

    setLoading(true);
    try {
      const allAnnouncements = await sdk.get<Announcement>('announcements');
      const schoolAnnouncements = allAnnouncements.filter(announcement => announcement.schoolId === school.id);
      // Sort by pinned first, then by published date
      schoolAnnouncements.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
      setAnnouncements(schoolAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!school) return;

    try {
      const newAnnouncement = await sdk.insert<Announcement>('announcements', {
        ...announcementForm,
        schoolId: school.id,
        authorId: 'admin', // In real app, use current user
        publishedAt: announcementForm.status === 'published' ? new Date().toISOString() : '',
        attachments: [],
        readBy: [],
        views: 0,
      });
      setAnnouncements([newAnnouncement, ...announcements]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const handleUpdateAnnouncement = async () => {
    if (!selectedAnnouncement) return;

    try {
      const updatedAnnouncement = await sdk.update<Announcement>('announcements', selectedAnnouncement.id, {
        ...announcementForm,
        publishedAt: announcementForm.status === 'published' && !selectedAnnouncement.publishedAt 
          ? new Date().toISOString() 
          : selectedAnnouncement.publishedAt,
      });
      setAnnouncements(announcements.map(announcement => 
        announcement.id === selectedAnnouncement.id ? updatedAnnouncement : announcement
      ));
      resetForm();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedAnnouncement(null);
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    try {
      await sdk.delete('announcements', announcementId);
      setAnnouncements(announcements.filter(announcement => announcement.id !== announcementId));
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const togglePin = async (announcementId: string, currentPinned: boolean) => {
    try {
      const updatedAnnouncement = await sdk.update<Announcement>('announcements', announcementId, {
        pinned: !currentPinned,
      });
      setAnnouncements(announcements.map(announcement => 
        announcement.id === announcementId ? updatedAnnouncement : announcement
      ));
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const resetForm = () => {
    setAnnouncementForm({
      title: '',
      content: '',
      priority: 'normal',
      targetAudience: ['all'],
      status: 'published',
      category: 'general',
      expiresAt: '',
      pinned: false,
      sendEmail: false,
      sendSMS: false,
    });
  };

  const openEditDialog = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience,
      status: announcement.status,
      category: announcement.category,
      expiresAt: announcement.expiresAt,
      pinned: announcement.pinned,
      sendEmail: announcement.sendEmail,
      sendSMS: announcement.sendSMS,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const getPriorityColor = (priority: Announcement['priority']) => {
    const option = priorityOptions.find(p => p.value === priority);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  const isExpired = (expiresAt: string) => {
    return expiresAt && new Date(expiresAt) < new Date();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Announcements Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setIsEditing(false); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  placeholder="Enter announcement title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <Select value={announcementForm.priority} onValueChange={(value) => setAnnouncementForm({ ...announcementForm, priority: value as Announcement['priority'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={announcementForm.category} onValueChange={(value) => setAnnouncementForm({ ...announcementForm, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Target Audience</label>
                <div className="grid grid-cols-3 gap-2">
                  {audienceOptions.map((audience) => (
                    <div key={audience} className="flex items-center space-x-2">
                      <Checkbox
                        id={audience}
                        checked={announcementForm.targetAudience.includes(audience)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setAnnouncementForm({
                              ...announcementForm,
                              targetAudience: [...announcementForm.targetAudience, audience]
                            });
                          } else {
                            setAnnouncementForm({
                              ...announcementForm,
                              targetAudience: announcementForm.targetAudience.filter(a => a !== audience)
                            });
                          }
                        }}
                      />
                      <label htmlFor={audience} className="text-sm capitalize">
                        {audience}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={announcementForm.status} onValueChange={(value) => setAnnouncementForm({ ...announcementForm, status: value as Announcement['status'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Expires At</label>
                  <Input
                    type="datetime-local"
                    value={announcementForm.expiresAt}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, expiresAt: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <Textarea
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  placeholder="Write your announcement content here..."
                  rows={6}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pinned"
                    checked={announcementForm.pinned}
                    onCheckedChange={(checked) => setAnnouncementForm({ ...announcementForm, pinned: checked as boolean })}
                  />
                  <label htmlFor="pinned" className="text-sm">Pin this announcement</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendEmail"
                    checked={announcementForm.sendEmail}
                    onCheckedChange={(checked) => setAnnouncementForm({ ...announcementForm, sendEmail: checked as boolean })}
                  />
                  <label htmlFor="sendEmail" className="text-sm">Send email notification</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendSMS"
                    checked={announcementForm.sendSMS}
                    onCheckedChange={(checked) => setAnnouncementForm({ ...announcementForm, sendSMS: checked as boolean })}
                  />
                  <label htmlFor="sendSMS" className="text-sm">Send SMS notification</label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateAnnouncement : handleCreateAnnouncement}>
                {isEditing ? 'Update Announcement' : 'Create Announcement'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{announcements.length}</div>
                <p className="text-xs text-muted-foreground">Total Announcements</p>
              </div>
              <Megaphone className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{announcements.filter(a => a.status === 'published').length}</div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{announcements.filter(a => a.pinned).length}</div>
            <p className="text-xs text-muted-foreground">Pinned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{announcements.reduce((acc, a) => acc + a.views, 0)}</div>
            <p className="text-xs text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className={`border rounded-lg p-4 ${isExpired(announcement.expiresAt) ? 'opacity-60 bg-gray-50' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {announcement.pinned && <Pin className="w-4 h-4 text-blue-600" />}
                      <h3 className="font-semibold text-lg">{announcement.title}</h3>
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                      <Badge variant="outline">{announcement.category}</Badge>
                      {isExpired(announcement.expiresAt) && (
                        <Badge variant="destructive">Expired</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{announcement.content}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {announcement.publishedAt ? new Date(announcement.publishedAt).toLocaleDateString() : 'Not published'}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {announcement.views} views
                      </div>
                      {announcement.expiresAt && (
                        <div>
                          Expires: {new Date(announcement.expiresAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {announcement.targetAudience.map((audience, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => togglePin(announcement.id, announcement.pinned)}
                    >
                      <Pin className={`w-4 h-4 ${announcement.pinned ? 'text-blue-600' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(announcement)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteAnnouncement(announcement.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {announcements.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No announcements found. Create your first announcement to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementsModule;
