import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const AnnouncementsPage = () => {
  const { school } = useSchool();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (school) {
        setLoading(true);
        const allAnnouncements = await sdk.get('announcements');
        const schoolAnnouncements = allAnnouncements.filter((a: any) => a.schoolId === school.id && a.status === 'published');
        setAnnouncements(schoolAnnouncements);
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [school]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Announcements</h1>
        <div className="space-y-6">
          {announcements.length > 0 ? announcements.map((announcement: any) => (
            <Card key={announcement.id}>
              <CardHeader>
                <CardTitle>{announcement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{new Date(announcement.publishedAt).toLocaleDateString()}</p>
                <p>{announcement.content}</p>
              </CardContent>
            </Card>
          )) : <p className="text-center">No announcements at the moment.</p>}
        </div>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default AnnouncementsPage;