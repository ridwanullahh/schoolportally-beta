import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const ClassesPage = () => {
  const { school } = useSchool();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      if (school) {
        setLoading(true);
        const allClasses = await sdk.get('classes');
        const schoolClasses = allClasses.filter((c: any) => c.schoolId === school.id && c.status === 'published');
        setClasses(schoolClasses);
        setLoading(false);
      }
    };
    fetchClasses();
  }, [school]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Our Classes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.length > 0 ? classes.map((klass: any) => (
            <Card key={klass.id}>
              <CardHeader>
                <CardTitle>{klass.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Teacher: {klass.teacherId}</p>
                <p>Schedule: {klass.schedule}</p>
              </CardContent>
              <CardFooter>
                <Link to={`/${school?.slug}/classes/${klass.id}`}>
                  <Button variant="link">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>
          )) : <p className="col-span-full text-center">No classes available at the moment.</p>}
        </div>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default ClassesPage;