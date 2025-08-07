import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, Calendar, BookOpen, Users, Award, 
  Clock, Play, Plus, Settings, BarChart3,
  FileText, MessageSquare, HelpCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { LiveClass, LMSModule, LMSAssignment, LMSQuiz } from '@/types';
import lmsService from '@/services/lmsService';
import { EnhancedLiveClass } from './EnhancedLiveClass';
import { PreLiveClassInterface } from './PreLiveClassInterface';

interface LMSDashboardProps {
  userRole: 'teacher' | 'student' | 'admin';
}

export const LMSDashboard: React.FC<LMSDashboardProps> = ({ userRole }) => {
  const { user } = useAuth();
  const { school } = useSchool();
  const [activeTab, setActiveTab] = useState('overview');
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [modules, setModules] = useState<LMSModule[]>([]);
  const [assignments, setAssignments] = useState<LMSAssignment[]>([]);
  const [quizzes, setQuizzes] = useState<LMSQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLiveClass, setSelectedLiveClass] = useState<LiveClass | null>(null);
  const [showPreClass, setShowPreClass] = useState(false);

  useEffect(() => {
    if (school && user) {
      loadLMSData();
    }
  }, [school, user]);

  const loadLMSData = async () => {
    setLoading(true);
    try {
      // Sync existing data first
      await lmsService.syncWithExistingData();
      
      // Load all LMS data
      const [classesData, modulesData, assignmentsData, quizzesData] = await Promise.all([
        lmsService.getLiveClasses(school!.id),
        lmsService.getModules(school!.id),
        lmsService.getAssignments(school!.id),
        // lmsService.getQuizzes(school!.id) // Will implement this
      ]);

      setLiveClasses(classesData);
      setModules(modulesData);
      setAssignments(assignmentsData);
      // setQuizzes(quizzesData);
    } catch (error) {
      console.error('Error loading LMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingClasses = () => {
    const now = new Date();
    return liveClasses
      .filter(cls => new Date(cls.startTime) > now && cls.status === 'scheduled')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 5);
  };

  const getLiveClasses = () => {
    return liveClasses.filter(cls => cls.status === 'live');
  };

  const getRecentModules = () => {
    return modules
      .filter(mod => mod.status === 'published')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6);
  };

  const getPendingAssignments = () => {
    const now = new Date();
    return assignments
      .filter(assignment => new Date(assignment.dueDate) > now)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  };

  const joinLiveClass = (liveClass: LiveClass) => {
    setSelectedLiveClass(liveClass);
  };

  const startLiveClass = (liveClass: LiveClass) => {
    setSelectedLiveClass(liveClass);
    setShowPreClass(true);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Classes</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getLiveClasses().length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modules</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modules.length}</div>
            <p className="text-xs text-muted-foreground">Available modules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPendingAssignments().length}</div>
            <p className="text-xs text-muted-foreground">Pending submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Classes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Live Classes</CardTitle>
            <Badge variant="destructive" className="animate-pulse">
              {getLiveClasses().length} LIVE
            </Badge>
          </CardHeader>
          <CardContent>
            {getLiveClasses().length > 0 ? (
              <div className="space-y-3">
                {getLiveClasses().map(liveClass => (
                  <div key={liveClass.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{liveClass.title}</h4>
                      <p className="text-sm text-muted-foreground">{liveClass.subject}</p>
                    </div>
                    <Button onClick={() => joinLiveClass(liveClass)} size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No live classes at the moment</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Classes</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </CardHeader>
          <CardContent>
            {getUpcomingClasses().length > 0 ? (
              <div className="space-y-3">
                {getUpcomingClasses().map(liveClass => (
                  <div key={liveClass.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{liveClass.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(liveClass.startTime).toLocaleString()}
                      </p>
                    </div>
                    {userRole === 'teacher' && (
                      <Button onClick={() => startLiveClass(liveClass)} size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming classes scheduled</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Modules */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Modules</CardTitle>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Module
          </Button>
        </CardHeader>
        <CardContent>
          {getRecentModules().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getRecentModules().map(module => (
                <div key={module.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-medium mb-2">{module.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {module.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{module.difficulty}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {module.lessons.length} lessons
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No modules available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  if (selectedLiveClass && !showPreClass) {
    return (
      <EnhancedLiveClass
        classData={selectedLiveClass}
        onLeaveClass={() => setSelectedLiveClass(null)}
        onEndClass={() => {
          setSelectedLiveClass(null);
          loadLMSData();
        }}
      />
    );
  }

  if (showPreClass && selectedLiveClass) {
    return (
      <PreLiveClassInterface
        onJoinClass={() => setShowPreClass(false)}
        onCancel={() => {
          setShowPreClass(false);
          setSelectedLiveClass(null);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learning Management System</h1>
          <p className="text-muted-foreground">
            Comprehensive LMS with live classes, modules, and assessments
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="live-classes">Live Classes</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">{renderOverview()}</TabsContent>
        <TabsContent value="live-classes">
          <div>Live Classes Management (Coming Soon)</div>
        </TabsContent>
        <TabsContent value="modules">
          <div>Modules Management (Coming Soon)</div>
        </TabsContent>
        <TabsContent value="assignments">
          <div>Assignments Management (Coming Soon)</div>
        </TabsContent>
        <TabsContent value="quizzes">
          <div>Quizzes Management (Coming Soon)</div>
        </TabsContent>
        <TabsContent value="analytics">
          <div>Analytics Dashboard (Coming Soon)</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LMSDashboard;
