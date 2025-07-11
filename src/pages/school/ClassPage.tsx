import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const ClassPage = () => {
  const { classId } = useParams();
  const { school } = useSchool();
  const [klass, setKlass] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      if (school && classId) {
        setLoading(true);
        const currentClass = await sdk.getItem('classes', classId);
        setKlass(currentClass);
        setLoading(false);
      }
    };
    fetchClass();
  }, [school, classId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!klass) {
    return <div>Class not found.</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>{klass.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Teacher:</strong> {klass.teacherId}</p>
            <p><strong>Schedule:</strong> {klass.schedule}</p>
            <p><strong>Capacity:</strong> {klass.capacity}</p>
            <p><strong>Enrolled:</strong> {klass.enrolled}</p>
            <hr className="my-4" />
            <div dangerouslySetInnerHTML={{ __html: klass.description }} />
          </CardContent>
        </Card>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default ClassPage;