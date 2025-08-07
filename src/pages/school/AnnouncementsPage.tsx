import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { usePages } from '@/hooks/usePages';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import sdk from '@/lib/sdk-config';
import { Calendar, Clock, AlertTriangle, Info, CheckCircle, Megaphone, Search, Filter, ArrowRight, Eye, ChevronLeft, ChevronRight, Pin } from 'lucide-react';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import '@/themes/styles/pages/announcement-archive.css';
import '@/themes/styles/pages/archive-modern.css';
import '@/themes/styles/pages/archive-templates-ultra-modern.css';
import '@/themes/styles/pages/modern-ui-templates.css';

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
  createdAt: string;
  updatedAt?: string;
}

const AnnouncementsPage = () => {
  const { school } = useSchool();
  const { schoolSlug } = useParams();
  const { pages } = usePages();
  const [searchParams, setSearchParams] = useSearchParams();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedPriority, setSelectedPriority] = useState(searchParams.get('priority') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [priorities, setPriorities] = useState<string[]>([]);

  // Map old style names to new template system
  const getTemplateStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {
      'announcement-archive-style-1': 'template-style-1',
      'announcement-archive-style-2': 'template-style-2',
      'announcement-archive-style-3': 'template-style-3',
      'announcement-archive-style-4': 'template-style-4',
      'announcement-archive-style-5': 'template-style-5',
      'announcement-archive-style-6': 'template-style-6',
      'announcement-archive-style-7': 'template-style-7',
      'announcement-archive-style-8': 'template-style-8',
      'announcement-archive-style-9': 'template-style-9',
      'announcement-archive-style-10': 'template-style-10',
      'announcement-archive-style-11': 'template-style-11',
      'announcement-archive-style-12': 'template-style-12',
      'announcement-archive-style-13': 'template-style-13',
      'announcement-archive-style-14': 'template-style-14',
      'announcement-archive-style-15': 'template-style-15',
    };
    return styleMap[styleId] || 'template-style-1';
  };

  const announcementArchiveStyle = school?.announcementArchiveStyle || 'announcement-archive-style-1';
  const templateStyle = getTemplateStyle(announcementArchiveStyle);
  const announcementsPerPage = 12;

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (school) {
        setLoading(true);
        try {
            const allAnnouncements = await sdk.get('announcements');
            const schoolAnnouncements = allAnnouncements.filter((a: any) => a.schoolId === school.id && a.status === 'published');
            setAnnouncements(schoolAnnouncements);
        } catch (error) {
            console.error("Failed to fetch announcements:", error)
        } finally {
            setLoading(false);
        }
      }
    };
    fetchAnnouncements();
  }, [school]);

  useEffect(() => {
    let filtered = [...announcements];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(announcement => announcement.priority === selectedPriority);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'newest':
        default:
          return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
      }
    });

    setFilteredAnnouncements(filtered);
  }, [announcements, searchTerm, selectedPriority, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'normal':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Megaphone className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading || !school) return <div className="loading-state">Loading...</div>;

  return (
    <div className={`page-template ${templateStyle}`}>
      <SchoolHeader school={school} pages={pages} />
      <main className="archive-container">
        <div className="archive-header">
          <h1 className="archive-title">Announcements</h1>
          <p className="archive-description">
            Stay informed with the latest announcements and important updates
          </p>
        </div>
        <div className="posts-grid">
          {filteredAnnouncements.map(announcement => (
            <article key={announcement.id} className="post-card">
              <div className="post-content">
                <div className="post-meta">
                  <div className="post-meta-item">
                    {getPriorityIcon(announcement.priority)}
                    <span>{announcement.priority}</span>
                  </div>
                  <div className="post-meta-item">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(announcement.publishedAt || announcement.createdAt)}</span>
                  </div>
                  {announcement.pinned && (
                    <div className="post-meta-item">
                      <Pin className="h-4 w-4" />
                      <span>Pinned</span>
                    </div>
                  )}
                </div>
                <h2 className="post-title">
                  <Link to={`/${schoolSlug}/announcements/${announcement.id}`}>
                    {announcement.title}
                  </Link>
                </h2>
                <p className="post-excerpt">
                  {announcement.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
                <Link to={`/${schoolSlug}/announcements/${announcement.id}`} className="read-more">
                  Read More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default AnnouncementsPage;