import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Course {
  id: string;
  uid?: string;
  schoolId: string;
  title: string;
  description: string;
  instructorIds: string[];
  instructorNames?: string[];
  status: string;
  publishStatus: 'draft' | 'published' | 'scheduled';
  scheduledDate?: string;
  createdAt: string;
  updatedAt?: string;
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const LMSModule: React.FC = () => {
  const { school } = useSchool();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (school) {
      fetchCourses();
    }
  }, [school]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const allCourses = await sdk.get<Course>('lms_courses');
      const publishedCourses = allCourses.filter(course => course.schoolId === school?.id && course.publishStatus === 'published');
      
      const teachers = await sdk.get<Teacher>('users');
      const coursesWithInstructors = publishedCourses.map(course => {
        const instructorNames = course.instructorIds.map(id => {
          const teacher = teachers.find(t => t.id === id);
          return teacher ? `${teacher.firstName} ${teacher.lastName}` : '';
        }).filter(name => name);
        return { ...course, instructorNames };
      });

      setCourses(coursesWithInstructors);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading courses...</div>;
  }

  const isInstructor = user?.userType === 'teacher';

  if (selectedCourse) {
    return (
      <div>
        <Button onClick={() => setSelectedCourse(null)}>Back to Courses</Button>
        <CourseView course={selectedCourse} isInstructor={isInstructor} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Courses</h2>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-500">There are no courses available for enrollment at this time.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="cursor-pointer hover:shadow-lg" onClick={() => setSelectedCourse(course)}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <p className="text-gray-600 mb-2">{course.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Instructors: {course.instructorNames?.join(', ') || 'Not assigned'}
                      </span>
                      {course.scheduledDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Scheduled: {new Date(course.scheduledDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  {!isInstructor && <Button>Enroll</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const CourseView: React.FC<{ course: Course, isInstructor: boolean }> = ({ course, isInstructor }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            {isInstructor ? (
              <>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="grades">Grades</TabsTrigger>
              </>
            ) : (
              <TabsTrigger value="grades">My Grades</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="overview">
            <div className="p-4">
              <h3 className="text-xl font-semibold">Course Overview</h3>
              <p>{course.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="materials">
            <div className="p-4">
              <h3 className="text-xl font-semibold">Course Materials</h3>
              <p>Manage and share course materials.</p>
            </div>
          </TabsContent>
          <TabsContent value="assignments">
            <div className="p-4">
              <h3 className="text-xl font-semibold">Assignments</h3>
              <p>Create, distribute, and grade assignments.</p>
            </div>
          </TabsContent>
          {isInstructor ? (
            <>
              <TabsContent value="students">
                <div className="p-4">
                  <h3 className="text-xl font-semibold">Enrolled Students</h3>
                  <p>View and manage the list of enrolled students.</p>
                </div>
              </TabsContent>
              <TabsContent value="grades">
                <div className="p-4">
                  <h3 className="text-xl font-semibold">Grades</h3>
                  <p>View and manage student grades.</p>
                </div>
              </TabsContent>
            </>
          ) : (
            <TabsContent value="grades">
              <div className="p-4">
                <h3 className="text-xl font-semibold">My Grades</h3>
                <p>View your grades for assignments and exams.</p>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default LMSModule;