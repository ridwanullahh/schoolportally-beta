import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/hooks/useSchool';
import LiveClassScheduleModule from '@/components/admin/LiveClassScheduleModule';
import AttendanceModule from './AttendanceModule';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SubjectLMS = ({ subject }) => {
   const { user } = useAuth();
   const { school } = useSchool();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Hub</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            {user?.userType === 'teacher' && <TabsTrigger value="attendance">Attendance</TabsTrigger>}
            {user?.userType === 'teacher' && <TabsTrigger value="live-schedules">Live Schedules</TabsTrigger>}
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <h3 className="text-lg font-semibold">Subject Overview</h3>
            <p>{subject.description}</p>
          </TabsContent>
          <TabsContent value="materials" className="mt-4">
            <h3 className="text-lg font-semibold">Course Materials</h3>
            {/* Materials content will go here */}
            <p>No materials uploaded yet.</p>
          </TabsContent>
          <TabsContent value="assignments" className="mt-4">
            <h3 className="text-lg font-semibold">Assignments</h3>
            {/* Assignments content will go here */}
            <p>No assignments posted yet.</p>
          </TabsContent>
          <TabsContent value="grades" className="mt-4">
            <h3 className="text-lg font-semibold">Your Grades</h3>
            {/* Grades content will go here */}
            <p>No grades available yet.</p>
          </TabsContent>
           {user?.userType === 'teacher' && (
               <TabsContent value="attendance" className="mt-4">
                   <AttendanceModule />
               </TabsContent>
           )}
           {user?.userType === 'teacher' && (
             <TabsContent value="live-schedules" className="mt-4">
               <Link to={`/${school?.slug}/dashboard/live-classes`}>
                   <Button>Go to Live Class Lobby</Button>
               </Link>
             </TabsContent>
           )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SubjectLMS;