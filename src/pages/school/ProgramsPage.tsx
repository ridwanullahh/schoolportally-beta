import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const ProgramsPage = () => {
  const { school } = useSchool();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (school) {
        setLoading(true);
        const allPrograms = await sdk.get('programs');
        const schoolPrograms = allPrograms.filter((p: any) => p.schoolId === school.id && p.status === 'published');
        setPrograms(schoolPrograms);
        setLoading(false);
      }
    };
    fetchPrograms();
  }, [school]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Our Programs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.length > 0 ? programs.map((program: any) => (
            <Card key={program.id}>
              <CardHeader>
                <CardTitle>{program.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{program.description?.substring(0, 150)}...</p>
              </CardContent>
              <CardFooter>
                <Link to={`/${school?.slug}/programs/${program.id}`}>
                  <Button variant="link">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>
          )) : <p className="col-span-full text-center">No programs available at the moment.</p>}
        </div>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default ProgramsPage;