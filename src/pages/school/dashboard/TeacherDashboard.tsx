
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { Users, Book, FileText, Calendar, Clock, CheckCircle } from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { school } = useSchool();

  const quickStats = [
    { title: 'My Classes', value: '4', icon: Book, color: 'bg-blue-500' },
    { title: 'Total Students', value: '120', icon: Users, color: 'bg-green-500' },
    { title: 'Pending Grades', value: '15', icon: FileText, color: 'bg-yellow-500' },
    { title: 'Today\'s Classes', value: '3', icon: Clock, color: 'bg-purple-500' },
  ];

  const todayClasses = [
    { name: 'Grade 10 Mathematics', time: '09:00 AM', students: 25, room: 'Room 101' },
    { name: 'Grade 11 Mathematics', time: '11:00 AM', students: 22, room: 'Room 101' },
    { name: 'Grade 12 Advanced Math', time: '02:00 PM', students: 18, room: 'Room 205' },
  ];

  const recentSubmissions = [
    { student: 'John Doe', assignment: 'Algebra Quiz', subject: 'Math', submitted: '2 hours ago' },
    { student: 'Jane Smith', assignment: 'Geometry Homework', subject: 'Math', submitted: '5 hours ago' },
    { student: 'Mike Johnson', assignment: 'Calculus Problem Set', subject: 'Math', submitted: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Good morning, {user?.firstName || 'Teacher'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Ready to inspire minds at {school?.name} today?
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
        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.map((cls, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">{cls.name}</h4>
                    <p className="text-sm text-gray-600">{cls.students} students • {cls.room}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{cls.time}</p>
                    <button className="text-sm text-blue-600 hover:underline mt-1">
                      Take Attendance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">{submission.student}</h4>
                    <p className="text-sm text-gray-600">{submission.assignment}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{submission.submitted}</p>
                    <button className="text-sm text-green-600 hover:underline mt-1">
                      Grade Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Create Assignment</p>
            </button>
            <button className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Grade Submissions</p>
            </button>
            <button className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Manage Classes</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
