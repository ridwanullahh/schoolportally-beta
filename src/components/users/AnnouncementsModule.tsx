import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pin, Calendar, Eye } from 'lucide-react';

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
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
  ];

  useEffect(() => {
    fetchAnnouncements();
  }, [school, user]);

  const fetchAnnouncements = async () => {
    if (!school || !user) return;

    setLoading(true);
    try {
      const allAnnouncements = await sdk.get<Announcement>('announcements');
      let schoolAnnouncements = allAnnouncements.filter(announcement => 
        announcement.schoolId === school.id &&
        (announcement.targetAudience.includes('all') || announcement.targetAudience.includes(user.userType)) &&
        announcement.status === 'published'
      );

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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Announcements</h2>
      </div>

      <Card>
        <CardContent className="p-4">
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
                    
                    <p className="text-gray-600 mb-3">{announcement.content}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(announcement.publishedAt).toLocaleDateString()}
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
                  </div>
                </div>
              </div>
            ))}
            
            {announcements.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No announcements to display at this time.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementsModule;