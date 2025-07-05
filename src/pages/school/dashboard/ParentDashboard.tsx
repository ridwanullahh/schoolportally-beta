
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { User, Book, Calendar, FileText, DollarSign, Bell } from 'lucide-react';

const ParentDashboard = () => {
  const { user } = useAuth();
  const { school } = useSchool();

  const children = [
    { name: 'Alex Johnson', grade: 'Grade 10', class: '10A', id: '1' },
    { name: 'Emma Johnson', grade: 'Grade 7', class: '7B', id: '2' },
  ];

  const quickStats = [
    { title: 'Children Enrolled', value: '2', icon: User, color: 'bg-blue-500' },
    { title: 'Total Classes', value: '12', icon: Book, color: 'bg-green-500' },
    { title: 'Upcoming Events', value: '4', icon: Calendar, color: 'bg-yellow-500' },
    { title: 'Pending Fees', value: '$250', icon: DollarSign, color: 'bg-red-500' },
  ];

  const recentActivities = [
    { child: 'Alex Johnson', activity: 'Submitted Math Assignment', time: '2 hours ago', type: 'assignment' },
    { child: 'Emma Johnson', activity: 'Attended Science Class', time: '4 hours ago', type: 'attendance' },
    { child: 'Alex Johnson', activity: 'Received Grade: A- in English', time: '1 day ago', type: 'grade' },
  ];

  const upcomingEvents = [
    { title: 'Parent-Teacher Meeting', date: 'Tomorrow', time: '2:00 PM', child: 'Alex Johnson' },
    { title: 'Science Fair', date: 'Next Week', time: '10:00 AM', child: 'Emma Johnson' },
    { title: 'Sports Day', date: 'Next Month', time: 'All Day', child: 'Both' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.firstName || 'Parent'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Stay connected with your children's education at {school?.name}.
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

      {/* Children Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            My Children
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children.map((child) => (
              <div key={child.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{child.name}</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {child.grade}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">Class: {child.class}</p>
                <div className="flex gap-2">
                  <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                    View Progress
                  </button>
                  <button className="text-sm border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">
                    Message Teacher
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'assignment' ? 'bg-blue-100' :
                    activity.type === 'attendance' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {activity.type === 'assignment' && <FileText className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'attendance' && <User className="h-4 w-4 text-green-600" />}
                    {activity.type === 'grade' && <Book className="h-4 w-4 text-yellow-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.child}</p>
                    <p className="text-sm text-gray-600">{activity.activity}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {event.date} at {event.time}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">For: {event.child}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentDashboard;
