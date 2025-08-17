import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import ModernLiveClass from '@/components/shared/ModernLiveClass';
import Forum from '@/components/shared/Forum';

const ClassPage = () => {
  const { classId } = useParams();
  const { school } = useSchool();
  const [klass, setKlass] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassAndSubjects = async () => {
      if (school && classId) {
        setLoading(true);
        const [currentClass, allSubjects] = await Promise.all([
           sdk.getItem('classes', classId),
           sdk.get('subjects')
        ]);
        setKlass(currentClass);
        setSubjects(allSubjects.filter(s => s.classId === classId));
        setLoading(false);
      }
    };
    fetchClassAndSubjects();
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
           <div dangerouslySetInnerHTML={{ __html: klass.description }} />
           <hr className="my-4" />
            <Tabs defaultValue="subjects">
                <TabsList>
                    <TabsTrigger value="subjects">Subjects</TabsTrigger>
                    <TabsTrigger value="forum">Forum</TabsTrigger>
                    <TabsTrigger value="live-class">Live Class</TabsTrigger>
                </TabsList>
                <TabsContent value="subjects">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {subjects.map(subject => (
                            <Link to={`/${school?.slug}/dashboard/subjects/${subject.id}`} key={subject.id}>
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle>{subject.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="line-clamp-3">{subject.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="forum">
                    <Forum scopeId={klass.id} scopeType="class" />
                </TabsContent>
                <TabsContent value="live-class">
                    <ModernLiveClass />
                </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default ClassPage;