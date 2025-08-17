import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import sdk from '../../lib/sdk-config';
import Forum from '../../components/shared/Forum';
import SubjectLMS from '../../components/users/lms/SubjectLMS';
import ModernLiveClass from '../../components/shared/ModernLiveClass';
import { useSchool } from '../../hooks/useSchool';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const SubjectPage = () => {
  const { subjectId } = useParams();
  const { school } = useSchool();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const allSubjects = await sdk.get('subjects');
        const res = allSubjects.find(s => s.id === subjectId);
        setSubject(res);
      } catch (error) {
        console.error("Failed to fetch subject", error);
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchSubject();
    }
  }, [subjectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!subject) {
    return <div>Subject not found.</div>;
  }

  return (
   <div> 
        <h1 className="text-3xl font-bold mb-4">{subject.name}</h1>
        <p className="mb-6">{subject.description}</p>
        
        <Tabs defaultValue="lms">
            <TabsList>
                <TabsTrigger value="lms">LMS</TabsTrigger>
                <TabsTrigger value="forum">Forum</TabsTrigger>
                <TabsTrigger value="live-class">Live Class</TabsTrigger>
            </TabsList>
            <TabsContent value="lms">
                <SubjectLMS subject={subject} />
            </TabsContent>
            <TabsContent value="forum">
                <Forum scopeId={subject.id} scopeType="subject" />
            </TabsContent>
            <TabsContent value="live-class">
                <ModernLiveClass />
            </TabsContent>
        </Tabs>
   </div>
  );
};

export default SubjectPage;