import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePages } from '@/hooks/usePages';
import '@/themes/styles/pages/announcement-archive.css';

const AnnouncementsPage = () => {
  const { school } = useSchool();
  const { pages } = usePages();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState('All');

  const announcementArchiveStyle = school?.branding?.announcementArchiveStyle || 'announcement-archive-style-1';

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

  if (loading || !school) return <div>Loading...</div>;
  
  const months = ['All', ...Array.from(new Set(announcements.map(a => new Date(a.createdAt).toLocaleString('default', { month: 'long' }))))];
  const filteredAnnouncements = activeMonth === 'All' ? announcements : announcements.filter(a => new Date(a.createdAt).toLocaleString('default', { month: 'long' }) === activeMonth);

  const renderAnnouncement = (announcement: any) => (
     <div key={announcement.id} className="announcement-item" data-date={new Date(announcement.createdAt).toLocaleDateString()}>
        <h2 className="text-2xl font-bold mb-2">{announcement.title}</h2>
        <p className="text-muted-foreground mb-4">
            Posted on {new Date(announcement.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <div dangerouslySetInnerHTML={{ __html: announcement.content.substring(0, 200) + '...' }} />
        <Button asChild className="mt-4">
            <Link to={`/${school?.slug}/announcements/${announcement.slug}`}>Read More</Link>
        </Button>
    </div>
  )

  return (
    <div className={`announcement-archive-page ${announcementArchiveStyle}`}>
      <SchoolHeader school={school} pages={pages} />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Announcements</h1>
        {announcementArchiveStyle === 'announcement-archive-style-6' && (
            <div className="tab-buttons">
                {months.map(month => <button key={month} onClick={() => setActiveMonth(month)} className={activeMonth === month ? 'active' : ''}>{month}</button>)}
            </div>
        )}
        <div className="announcements-container">
          {filteredAnnouncements.map(renderAnnouncement)}
        </div>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default AnnouncementsPage;