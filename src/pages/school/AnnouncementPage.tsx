import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import { usePages } from '@/hooks/usePages';
import '@/themes/styles/pages/announcement-post.css';

const AnnouncementPage = () => {
  const { announcementSlug } = useParams();
  const { school } = useSchool();
  const { pages } = usePages();
  const [announcement, setAnnouncement] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const announcementPostStyle = school?.branding?.announcementPostStyle || 'announcement-post-style-1';

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (school && announcementSlug) {
        setLoading(true);
        try {
            const allAnnouncements = await sdk.get('announcements');
            const currentAnnouncement = allAnnouncements.find((a: any) => a.schoolId === school.id && a.slug === announcementSlug);
            setAnnouncement(currentAnnouncement);
        } catch (error) {
            console.error("Failed to fetch announcement:", error)
        } finally {
            setLoading(false);
        }
      }
    };
    fetchAnnouncement();
  }, [school, announcementSlug]);

  if (loading || !school) return <div>Loading...</div>;
  if (!announcement) return <div>Announcement not found.</div>;

  return (
    <div className={`announcement-post-page ${announcementPostStyle}`}>
      <SchoolHeader school={school} pages={pages} />
      <main className="container mx-auto px-4 py-16">
        <header className="post-header">
            <h1 className="text-4xl font-bold mb-4">{announcement.title}</h1>
            <p className="text-muted-foreground mb-8">
            Posted on {new Date(announcement.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </header>
        <div className="post-content">
            <div dangerouslySetInnerHTML={{ __html: announcement.content }} />
        </div>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default AnnouncementPage;