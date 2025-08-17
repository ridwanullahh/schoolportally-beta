import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen } from 'lucide-react';
import Materials from './lms/Materials';
import Assignments from './lms/Assignments';
import Attendance from './lms/Attendance';

interface Class {
  id: string;
  name: string;
  slug: string;
  description: string;
  schoolId: string;
  teacherIds: string[];
  programId: string;
  schedule: any;
  capacity: number;
  enrolled: number;
  fee: number;
  status: string;
  room: string;
  gradeLevel: string;
  subject: string;
  students: string[];
  materials: string[];
  assignments: string[];
  attendance: any[];
}

const ClassesModule: React.FC = () => {
  const { school } = useSchool();
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  useEffect(() => {
    fetchData();
  }, [school, user]);

  const fetchData = async () => {
    if (!school || !user) return;

    setLoading(true);
    try {
      const allClasses = await sdk.get<Class>('classes');
      let userClasses = [];

      if (user.userType === 'teacher') {
        userClasses = allClasses.filter(cls => cls.schoolId === school.id && cls.teacherIds.includes(user.id));
      } else if (user.userType === 'student') {
        userClasses = allClasses.filter(cls => cls.schoolId === school.id && cls.students.includes(user.id));
      }
      
      setClasses(userClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner');
  const isTeacher = user?.userType === 'teacher';
  const isStudent = user?.userType === 'student';

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (selectedClass) {
    return (
      <div>
        <Button onClick={() => setSelectedClass(null)}>Back to Classes</Button>
        <LMSView classItem={selectedClass} isTeacher={isTeacher} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Classes</h2>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {isTeacher && 'You are not currently assigned to any classes.'}
          {isStudent && 'You are not currently enrolled in any classes.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedClass(classItem)}>
              <CardHeader>
                <CardTitle className="text-lg">{classItem.name}</CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline">{classItem.subject}</Badge>
                  {isTeacher && (
                    <Badge className={classItem.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {classItem.status}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{classItem.description}</p>
                {isTeacher && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Grade Level:</span>
                      <span>{classItem.gradeLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Room:</span>
                      <span>{classItem.room}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Enrolled:</span>
                      <span>{classItem.enrolled}/{classItem.capacity}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const LMSView: React.FC<{ classItem: Class, isTeacher: boolean }> = ({ classItem, isTeacher }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>LMS for {classItem.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            {isTeacher ? (
              <>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
              </>
            ) : (
              <TabsTrigger value="grades">Grades</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="overview">
            <div className="p-4">
              <h3 className="text-xl font-semibold">Class Overview</h3>
              <p>LMS features for this class will be implemented here.</p>
            </div>
          </TabsContent>
          <TabsContent value="materials">
            <Materials classId={classItem.id} />
          </TabsContent>
          <TabsContent value="assignments">
            <Assignments classId={classItem.id} />
          </TabsContent>
          {isTeacher ? (
            <>
              <TabsContent value="students">
                <div className="p-4">
                  <h3 className="text-xl font-semibold">Enrolled Students</h3>
                  <p>View and manage the list of enrolled students.</p>
                </div>
              </TabsContent>
              <TabsContent value="attendance">
                <Attendance classId={classItem.id} />
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

export default ClassesModule;