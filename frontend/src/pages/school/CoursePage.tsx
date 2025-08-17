import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const CoursePage = () => {
  const { courseId } = useParams();
  const { school } = useSchool();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (school && courseId) {
        setLoading(true);
        const currentCourse = await sdk.getItem('lms_courses', courseId);
        setCourse(currentCourse);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [school, courseId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found.</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Instructor:</strong> {course.instructorId}</p>
            <hr className="my-4" />
            <div dangerouslySetInnerHTML={{ __html: course.description }} />
          </CardContent>
        </Card>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default CoursePage;