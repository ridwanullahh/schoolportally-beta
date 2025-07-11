import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/announcements.css';
import { Megaphone } from 'lucide-react';

interface AnnouncementsSectionProps {
  section: Section;
}

const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({ section }) => {
  const { title, announcements } = section.content;
  const styleId = section.styleId || 'announcements-card-notices';

  const defaultAnnouncements = [
    { title: 'Mid-term Break', date: '2024-10-25', content: 'The school will be closed for mid-term break from...' },
    { title: 'Annual General Meeting', date: '2024-11-05', content: 'All parents are invited to the AGM...' },
    { title: 'Sports Day Trials', date: '2024-11-10', content: 'Trials for the annual sports day will be held...' },
  ];

  const announcementItems = announcements && announcements.length > 0 ? announcements : defaultAnnouncements;

  const renderAnnouncement = (announcement: any, index: number) => (
    <div key={index} className="notice-card">
      <div className="flex items-center mb-2">
        <Megaphone className="w-5 h-5 mr-3 text-primary" />
        <h3 className="announcement-title font-bold text-lg">{announcement.title}</h3>
      </div>
      <p className="announcement-date text-sm text-gray-500 mb-2">{announcement.date}</p>
      <p className="announcement-content text-muted-foreground">{announcement.content}</p>
    </div>
  );

  return (
    <section className={`announcements-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="announcements-container">
          {announcementItems.map(renderAnnouncement)}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;