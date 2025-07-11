import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const ProgramPage = () => {
  const { programId } = useParams();
  const { school } = useSchool();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      if (school && programId) {
        setLoading(true);
        const currentProgram = await sdk.getItem('programs', programId);
        setProgram(currentProgram);
        setLoading(false);
      }
    };
    fetchProgram();
  }, [school, programId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!program) {
    return <div>Program not found.</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>{program.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Duration:</strong> {program.duration}</p>
            <p><strong>Price:</strong> {program.price}</p>
            <hr className="my-4" />
            <div dangerouslySetInnerHTML={{ __html: program.description }} />
          </CardContent>
        </Card>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default ProgramPage;