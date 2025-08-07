import React, { useState, useEffect } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, Settings, 
  Calendar, Clock, Users, Lock, Unlock,
  Play, Plus, Search, Filter, MoreVertical
} from 'lucide-react';
import { LiveClass } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface PreLiveClassInterfaceProps {
  onJoinClass: () => void;
  onCancel: () => void;
}

export const PreLiveClassInterface: React.FC<PreLiveClassInterfaceProps> = ({
  onJoinClass,
  onCancel
}) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'live' | 'ended'>('all');
  const [accessCode, setAccessCode] = useState('');
  const [showAccessCodeModal, setShowAccessCodeModal] = useState<string | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<{
    camera?: string;
    microphone?: string;
    speaker?: string;
  }>({});

  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    // Mock data - replace with actual API call
    const mockClasses: LiveClass[] = [
      {
        id: 'class-1',
        schoolId: user?.schoolId || '',
        teacherId: 'teacher-1',
        title: 'Mathematics - Algebra Basics',
        description: 'Introduction to algebraic expressions and equations',
        subject: 'Mathematics',
        classId: 'class-10a',
        roomId: 'room-1',
        accessCode: isTeacher ? undefined : 'MATH123',
        requiresAccessCode: !isTeacher,
        maxParticipants: 30,
        status: 'scheduled',
        startTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
        endTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(), // 90 minutes from now
        settings: {
          allowStudentCamera: true,
          allowStudentMicrophone: true,
          allowStudentScreenShare: false,
          allowStudentChat: true,
          muteStudentsOnJoin: true,
          disableStudentCameraOnJoin: false,
          enableWaitingRoom: true,
          enableRecording: true,
          enableBreakoutRooms: false,
          maxChatMessageLength: 500,
          allowHandRaising: true,
          allowPrivateChat: false,
          enableWhiteboard: true,
          enableFileSharing: true
        },
        participants: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'class-2',
        schoolId: user?.schoolId || '',
        teacherId: 'teacher-2',
        title: 'Science - Physics Lab',
        description: 'Virtual physics experiments and demonstrations',
        subject: 'Physics',
        classId: 'class-10b',
        roomId: 'room-2',
        requiresAccessCode: false,
        maxParticipants: 25,
        status: 'live',
        startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // Started 15 minutes ago
        endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes remaining
        actualStartTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        settings: {
          allowStudentCamera: true,
          allowStudentMicrophone: false,
          allowStudentScreenShare: false,
          allowStudentChat: true,
          muteStudentsOnJoin: true,
          disableStudentCameraOnJoin: true,
          enableWaitingRoom: false,
          enableRecording: true,
          enableBreakoutRooms: true,
          maxChatMessageLength: 300,
          allowHandRaising: true,
          allowPrivateChat: true,
          enableWhiteboard: true,
          enableFileSharing: true
        },
        participants: [
          {
            id: 'p1',
            userId: 'teacher-2',
            userType: 'teacher',
            displayName: 'Dr. Smith',
            joinedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            status: 'joined',
            permissions: {
              camera: true,
              microphone: true,
              screenShare: true,
              chat: true,
              handRaised: false
            },
            connectionStatus: 'connected',
            mediaStatus: {
              camera: true,
              microphone: true,
              screenShare: false
            }
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setClasses(mockClasses);
  };

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || cls.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleJoinClass = (classData: LiveClass) => {
    if (classData.requiresAccessCode && !isTeacher) {
      setShowAccessCodeModal(classData.id);
    } else {
      onJoinClass(classData.id);
    }
  };

  const handleJoinWithAccessCode = () => {
    if (showAccessCodeModal && accessCode.trim()) {
      onJoinClass(showAccessCodeModal, accessCode.trim());
      setShowAccessCodeModal(null);
      setAccessCode('');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-500';
      case 'scheduled':
        return 'bg-blue-500';
      case 'ended':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTimeUntilStart = (startTime: string) => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const diff = start - now;
    
    if (diff <= 0) return 'Started';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `Starts in ${hours}h ${minutes % 60}m`;
    } else {
      return `Starts in ${minutes}m`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Live Classes</h1>
              <p className="text-gray-600 mt-2">
                {isTeacher ? 'Manage and start your live classes' : 'Join your scheduled classes'}
              </p>
            </div>
            
            {isTeacher && (
              <Button onClick={onCreateClass} className="bg-blue-600 hover:bg-blue-700">
                <Plus size={20} className="mr-2" />
                Create Class
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search classes..."
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              {['all', 'scheduled', 'live', 'ended'].map(filterOption => (
                <Button
                  key={filterOption}
                  variant={filter === filterOption ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(filterOption as any)}
                  className="capitalize"
                >
                  {filterOption}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map(classData => (
            <Card key={classData.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {classData.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {classData.description}
                    </p>
                  </div>
                  
                  <Badge className={`${getStatusColor(classData.status)} text-white ml-2`}>
                    {classData.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Class Info */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(classData.startTime)}
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {formatTime(classData.startTime)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users size={14} className="mr-1" />
                      {classData.participants.length}/{classData.maxParticipants || '∞'}
                    </div>
                    {classData.requiresAccessCode && (
                      <div className="flex items-center">
                        <Lock size={14} className="mr-1" />
                        Access Code Required
                      </div>
                    )}
                  </div>

                  {classData.subject && (
                    <Badge variant="secondary" className="text-xs">
                      {classData.subject}
                    </Badge>
                  )}

                  {/* Time Until Start */}
                  {classData.status === 'scheduled' && (
                    <div className="text-sm font-medium text-blue-600">
                      {getTimeUntilStart(classData.startTime)}
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    {classData.status === 'live' ? (
                      <Button
                        onClick={() => handleJoinClass(classData)}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        <Play size={16} className="mr-2" />
                        Join Live Class
                      </Button>
                    ) : classData.status === 'scheduled' ? (
                      isTeacher ? (
                        <Button
                          onClick={() => onStartClass(classData.id)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Play size={16} className="mr-2" />
                          Start Class
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleJoinClass(classData)}
                          className="w-full"
                          disabled={new Date(classData.startTime).getTime() - Date.now() > 10 * 60 * 1000} // Can join 10 minutes before
                        >
                          <Play size={16} className="mr-2" />
                          Join Class
                        </Button>
                      )
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        Class Ended
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <Video size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : isTeacher 
                  ? 'Create your first live class to get started'
                  : 'No classes are scheduled at the moment'
              }
            </p>
          </div>
        )}
      </div>

      {/* Access Code Modal */}
      {showAccessCodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Enter Access Code</h3>
            <p className="text-gray-600 mb-4">
              This class requires an access code to join.
            </p>
            <Input
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter access code"
              className="mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleJoinWithAccessCode()}
            />
            <div className="flex space-x-3">
              <Button
                onClick={handleJoinWithAccessCode}
                disabled={!accessCode.trim()}
                className="flex-1"
              >
                Join Class
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAccessCodeModal(null);
                  setAccessCode('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreLiveClassInterface;
