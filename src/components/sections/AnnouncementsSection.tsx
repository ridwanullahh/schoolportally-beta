import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/announcements.css';
import { Megaphone, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import sdk from '@/lib/sdk-config';
import { useSchool } from '@/contexts/SchoolContext';

interface AnnouncementsSectionProps {
  section: Section;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  publishedAt: string;
  status: 'draft' | 'published' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  schoolId: string;
}

const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({ section }) => {
  const { title, announcementsLimit = 6 } = section.content;
  const { school } = useSchool();
  const styleId = section.styleId || 'announcements-card-notices';
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultAnnouncements = [
    {
      id: '1',
      title: 'Mid-term Break',
      publishedAt: '2024-10-25',
      content: 'The school will be closed for mid-term break from...',
      type: 'info' as const,
      status: 'published' as const,
      priority: 'medium' as const,
      schoolId: school?.id || ''
    },
    {
      id: '2',
      title: 'Annual General Meeting',
      publishedAt: '2024-11-05',
      content: 'All parents are invited to the AGM...',
      type: 'info' as const,
      status: 'published' as const,
      priority: 'high' as const,
      schoolId: school?.id || ''
    },
    {
      id: '3',
      title: 'Sports Day Trials',
      publishedAt: '2024-11-10',
      content: 'Trials for the annual sports day will be held...',
      type: 'info' as const,
      status: 'published' as const,
      priority: 'medium' as const,
      schoolId: school?.id || ''
    },
  ];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!school) return;
      setLoading(true);
      try {
        const allAnnouncements = await sdk.get<Announcement>('announcements');
        const schoolAnnouncements = allAnnouncements
          .filter((announcement: Announcement) =>
            announcement.schoolId === school.id &&
            announcement.status === 'published'
          )
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          .slice(0, announcementsLimit);

        setAnnouncements(schoolAnnouncements.length > 0 ? schoolAnnouncements : defaultAnnouncements);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
        setAnnouncements(defaultAnnouncements);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [school, announcementsLimit]);

  const announcementItems = announcements;
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-5 h-5 mr-3 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 mr-3 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 mr-3 text-green-500" />;
      default: return <Megaphone className="w-5 h-5 mr-3 text-primary" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderAnnouncement = (announcement: Announcement, index: number) => {
    if (styleId === 'announcements-alert-strip') {
      return (
        <div key={announcement.id} className={`alert ${announcement.type}`}>
          {getIcon(announcement.type)}
          <div>
            <h3 className="announcement-title font-bold text-lg">{announcement.title}</h3>
            <p className="announcement-content">{announcement.content}</p>
            <span className="announcement-date text-sm opacity-75">
              {formatDate(announcement.publishedAt)}
            </span>
          </div>
        </div>
      )
    }

    return (
      <div key={announcement.id} className="notice-card">
        <div className="flex items-center mb-2">
          {getIcon(announcement.type)}
          <h3 className="announcement-title font-bold text-lg">{announcement.title}</h3>
          {announcement.priority === 'urgent' && (
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded">
              URGENT
            </span>
          )}
        </div>
        <p className="announcement-date text-sm text-gray-500 mb-2">
          {formatDate(announcement.publishedAt)}
        </p>
        <p className="announcement-content text-muted-foreground">{announcement.content}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <section className={`announcements-section py-16 ${styleId}`}>
        <div className="container mx-auto px-4">
          {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
          <div className="announcements-container">
            <div className="loading-state">Loading announcements...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`announcements-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="announcements-container">
          {announcementItems.length > 0 ? (
            announcementItems.map(renderAnnouncement)
          ) : (
            <div className="empty-state">No announcements available.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;