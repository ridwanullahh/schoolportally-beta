import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const JobPage = () => {
  const { jobId } = useParams();
  const { school } = useSchool();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (school && jobId) {
        setLoading(true);
        const currentJob = await sdk.getItem('jobs', jobId);
        setJob(currentJob);
        setLoading(false);
      }
    };
    fetchJob();
  }, [school, jobId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>Job not found.</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Type:</strong> {job.type}</p>
            <hr className="my-4" />
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <div dangerouslySetInnerHTML={{ __html: job.description }} />
            <h3 className="text-xl font-semibold mt-4 mb-2">Requirements</h3>
            <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
            <Button asChild className="mt-6">
              <a href={`mailto:${school?.email}?subject=Application for ${job.title}`}>Apply Now</a>
            </Button>
          </CardContent>
        </Card>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default JobPage;