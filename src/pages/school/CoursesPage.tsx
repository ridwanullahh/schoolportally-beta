import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const CoursesPage = () => {
  const { school } = useSchool();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (school) {
        setLoading(true);
        const allCourses = await sdk.get('lms_courses');
        const schoolCourses = allCourses.filter((c: any) => c.schoolId === school.id && c.status === 'published');
        setCourses(schoolCourses);
        setLoading(false);
      }
    };
    fetchCourses();
  }, [school]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Our Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length > 0 ? courses.map((course: any) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{course.description?.substring(0, 150)}...</p>
              </CardContent>
              <CardFooter>
                <Link to={`/${school?.slug}/courses/${course.id}`}>
                  <Button variant="link">Enroll Now</Button>
                </Link>
              </CardFooter>
            </Card>
          )) : <p className="col-span-full text-center">No courses available at the moment.</p>}
        </div>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default CoursesPage;