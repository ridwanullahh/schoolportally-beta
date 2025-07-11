import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const JobsPage = () => {
  const { school } = useSchool();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (school) {
        setLoading(true);
        const allJobs = await sdk.get('jobs');
        const schoolJobs = allJobs.filter((j: any) => j.schoolId === school.id && j.status === 'published');
        setJobs(schoolJobs);
        setLoading(false);
      }
    };
    fetchJobs();
  }, [school]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Career Opportunities</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.length > 0 ? jobs.map((job: any) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{job.location}</p>
              </CardContent>
              <CardFooter>
                <Link to={`/${school?.slug}/jobs/${job.id}`}>
                  <Button variant="link">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          )) : <p className="col-span-full text-center">No job openings at the moment.</p>}
        </div>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default JobsPage;