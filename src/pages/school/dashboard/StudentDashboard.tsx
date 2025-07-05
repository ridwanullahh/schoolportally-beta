
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { Book, Calendar, Bell, FileText, Users, Clock } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { school } = useSchool();

  const quickStats = [
    { title: 'Enrolled Classes', value: '6', icon: Book, color: 'bg-blue-500' },
    { title: 'Upcoming Events', value: '3', icon: Calendar, color: 'bg-green-500' },
    { title: 'Announcements', value: '2', icon: Bell, color: 'bg-yellow-500' },
    { title: 'Assignments Due', value: '4', icon: FileText, color: 'bg-red-500' },
  ];

  const upcomingClasses = [
    { name: 'Mathematics', time: '09:00 AM', teacher: 'Mr. Smith', room: 'Room 101' },
    { name: 'English Literature', time: '11:00 AM', teacher: 'Ms. Johnson', room: 'Room 205' },
    { name: 'Science', time: '02:00 PM', teacher: 'Dr. Brown', room: 'Lab 1' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName || 'Student'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening at {school?.name} today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((cls, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">{cls.name}</h4>
                    <p className="text-sm text-gray-600">{cls.teacher} • {cls.room}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{cls.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">School Holiday Notice</h4>
                <p className="text-sm text-blue-700 mt-1">
                  The school will be closed on Friday for a public holiday.
                </p>
                <p className="text-xs text-blue-600 mt-2">2 hours ago</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">Sports Day Registration</h4>
                <p className="text-sm text-green-700 mt-1">
                  Registration for annual sports day is now open.
                </p>
                <p className="text-xs text-green-600 mt-2">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Due Soon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assignments Due Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Assignment</th>
                  <th className="text-left py-2">Subject</th>
                  <th className="text-left py-2">Due Date</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Math Problem Set 5</td>
                  <td className="py-2">Mathematics</td>
                  <td className="py-2">Tomorrow</td>
                  <td className="py-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                      Not Started
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Book Report</td>
                  <td className="py-2">English</td>
                  <td className="py-2">In 3 days</td>
                  <td className="py-2">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      In Progress
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
