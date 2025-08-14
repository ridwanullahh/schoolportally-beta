import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import { useAnnouncements } from '@/hooks/useAnnouncements';



import { Megaphone, Info, AlertTriangle, CheckCircle, Search, Filter, ArrowRight, Calendar } from 'lucide-react';
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
  const { content, settings } = section;
  const { school } = useSchool();

  // Section settings with defaults
  const announcementsToShow = parseInt(settings?.announcementsToShow || content?.announcementsLimit || '6');
  const enableSearch = settings?.enableSearch !== false;
  const enableFiltering = settings?.enableFiltering !== false;
  const enableSorting = settings?.enableSorting !== false;
  const enableLoadMore = settings?.enableLoadMore !== false;
  const showViewAllButton = settings?.showViewAllButton !== false;

  // State for controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [displayedAnnouncements, setDisplayedAnnouncements] = useState(announcementsToShow);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Use dynamic content from announcements admin module
  const { announcements: dynamicAnnouncements, loading, error } = useAnnouncements();

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'announcements-modern-grid',
      '2': 'announcements-modern-timeline',
      '3': 'announcements-modern-cards',
      '4': 'announcements-modern-horizontal',
      '5': 'announcements-modern-minimal',
      '6': 'announcements-modern-bordered',
      '7': 'announcements-modern-gradient',
      '8': 'announcements-modern-split',
      '9': 'announcements-modern-compact',
      '10': 'announcements-modern-asymmetric',
      '11': 'announcements-modern-typography',
      // Existing ultra-modern styles (12+)
      '12': 'announcements-floating-glass',
      '13': 'announcements-holographic-cards',
      '14': 'announcements-neon-grid',
      '15': 'announcements-particle-bg',
      '16': 'announcements-morphing-cards',
      '17': 'announcements-cyber-grid',
      '18': 'announcements-liquid-metal',
      '19': 'announcements-aurora-bg',
      '20': 'announcements-matrix-rain',
      '21': 'announcements-quantum-field',
      '22': 'announcements-neural-network',
      '23': 'announcements-hologram-effect',
      '24': 'announcements-energy-waves',
      '25': 'announcements-digital-rain',
      '26': 'announcements-mosaic-layout'
    };
    return styleMap[styleNumber] || 'announcements-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');

  const defaultAnnouncements = [
    {
      id: '1',
      title: 'Mid-term Break Announcement',
      content: 'The school will be closed for mid-term break from November 20-24. Classes will resume on Monday, November 27th.',
      excerpt: 'School closure for mid-term break from Nov 20-24.',
      type: 'general' as const,
      priority: 'medium' as const,
      author: 'Principal Johnson',
      publishDate: '2024-10-25',
      targetAudience: 'all' as const,
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop',
      pinned: true,
      views: 245,
      likes: 18,
      status: 'published' as const,
      featured: true
    },
    {
      id: '2',
      title: 'Annual General Meeting',
      content: 'All parents and guardians are cordially invited to attend our Annual General Meeting on December 5th at 6:00 PM in the main auditorium.',
      excerpt: 'AGM scheduled for December 5th at 6:00 PM.',
      type: 'event' as const,
      priority: 'high' as const,
      author: 'School Administration',
      publishDate: '2024-11-05',
      targetAudience: 'parents' as const,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
      pinned: false,
      views: 189,
      likes: 12,
      status: 'published' as const,
      featured: true
    },
    {
      id: '3',
      title: 'Sports Day Postponed',
      content: 'Due to unfavorable weather conditions, the annual sports day has been postponed to December 15th. All participants will be notified of the new schedule.',
      excerpt: 'Sports day moved to December 15th due to weather.',
      type: 'urgent' as const,
      priority: 'urgent' as const,
      author: 'Sports Department',
      publishDate: '2024-11-10',
      targetAudience: 'students' as const,
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
      pinned: true,
      views: 312,
      likes: 25,
      status: 'published' as const,
      featured: false
    },
    {
      id: '4',
      title: 'Extended Library Hours',
      content: 'Great news! Our library will now be open with extended hours from 7:00 AM to 8:00 PM, Monday through Friday, to better serve our students.',
      excerpt: 'Library now open 7 AM - 8 PM weekdays.',
      type: 'academic' as const,
      priority: 'low' as const,
      author: 'Library Staff',
      publishDate: '2024-11-15',
      targetAudience: 'students' as const,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      pinned: false,
      views: 156,
      likes: 8,
      status: 'published' as const,
      featured: false
    },
    {
      id: '5',
      title: 'Winter Holiday Schedule',
      content: 'Winter holidays will begin on December 22nd and classes will resume on January 8th. Wishing all our students and families a wonderful holiday season!',
      excerpt: 'Winter break: Dec 22 - Jan 8.',
      type: 'holiday' as const,
      priority: 'medium' as const,
      author: 'Academic Office',
      publishDate: '2024-11-20',
      targetAudience: 'all' as const,
      image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=300&fit=crop',
      pinned: false,
      views: 203,
      likes: 15,
      status: 'published' as const,
      featured: true
    },
    {
      id: '6',
      title: 'New Science Lab Equipment',
      content: 'We are excited to announce the arrival of new state-of-the-art equipment for our science laboratories, enhancing our students\' learning experience.',
      excerpt: 'New science lab equipment installed.',
      type: 'academic' as const,
      priority: 'low' as const,
      author: 'Science Department',
      publishDate: '2024-11-25',
      targetAudience: 'students' as const,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      pinned: false,
      views: 134,
      likes: 22,
      status: 'published' as const,
      featured: false
    }
  ];

  // Use dynamic content if available, otherwise use defaults
  const announcementItems = announcements && announcements.length > 0 ? announcements.slice(0, announcementsLimit) : defaultAnnouncements;
  
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

  const renderAnnouncement = (announcement: any, index: number) => {
    const announcementImage = announcement.image || 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop';

    return (
      <div key={announcement.id} className="announcement-card">
        <img
          src={announcementImage}
          alt={announcement.title}
          className="announcement-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop';
          }}
        />
        <div className="announcement-title">{announcement.title}</div>
        <div className="announcement-type">{announcement.type}</div>
        <div className="announcement-author">By: {announcement.author}</div>
        <div className="announcement-date">{formatDate(announcement.publishDate)}</div>
        {announcement.content && <div className="announcement-content">{announcement.content}</div>}
        {announcement.pinned && <div className="pinned-badge">📌 Pinned</div>}
      </div>
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="announcements-container">
          <div className="loading-state">Loading announcements...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="announcements-container">
          <div className="error-state">Error loading announcements. Showing default announcements.</div>
          <div className="announcements-container">
            {defaultAnnouncements.map(renderAnnouncement)}
          </div>
        </div>
      );
    }

    switch (styleId) {
      case 'announcements-sliding-carousel':
        return (
          <div className="announcements-container">
            <div className="carousel-track">
              {announcementItems.map(renderAnnouncement)}
              {/* Duplicate for seamless loop */}
              {announcementItems.map((announcement, index) => renderAnnouncement(announcement, index + announcementItems.length))}
            </div>
          </div>
        );
      case 'announcements-minimal-lines':
        return (
          <div className="announcements-container">
            {announcementItems.map(renderAnnouncement)}
          </div>
        );
      default:
        return (
          <div className="announcements-container">
            {announcementItems.map(renderAnnouncement)}
          </div>
        );
    }
  }

  return (
    <section className={`announcements-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default AnnouncementsSection;