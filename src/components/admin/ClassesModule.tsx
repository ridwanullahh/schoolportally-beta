
import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Users, Clock, BookOpen } from 'lucide-react';

interface Class {
  id: string;
  name: string;
  slug: string;
  description: string;
  schoolId: string;
  teacherId: string;
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
  const [programs, setPrograms] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [classForm, setClassForm] = useState({
    name: '',
    description: '',
    teacherId: '',
    programId: '',
    capacity: 30,
    fee: 0,
    room: '',
    gradeLevel: '',
    subject: '',
    schedule: {
      monday: { start: '', end: '' },
      tuesday: { start: '', end: '' },
      wednesday: { start: '', end: '' },
      thursday: { start: '', end: '' },
      friday: { start: '', end: '' },
    }
  });

  useEffect(() => {
    fetchData();
  }, [school]);

  const fetchData = async () => {
    if (!school || !user) return;

    setLoading(true);
    try {
      const [allClasses, allPrograms, allStaff] = await Promise.all([
        sdk.get<Class>('classes'),
        sdk.get('programs'),
        sdk.get('staff')
      ]);

      let schoolClasses = allClasses.filter(cls => cls.schoolId === school.id);

      if (user.userType === 'teacher') {
        schoolClasses = schoolClasses.filter(cls => cls.teacherId === user.id);
      } else if (user.userType === 'student') {
        schoolClasses = schoolClasses.filter(cls => cls.students.includes(user.id));
      }
      const schoolPrograms = allPrograms.filter(prog => prog.schoolId === school.id);
      const schoolTeachers = allStaff.filter(staff => staff.schoolId === school.id && staff.position === 'teacher');

      setClasses(schoolClasses);
      setPrograms(schoolPrograms);
      setTeachers(schoolTeachers);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async () => {
    if (!school) return;

    try {
      const slug = classForm.name.toLowerCase().replace(/\s+/g, '-');
      const newClass = await sdk.insert<Class>('classes', {
        ...classForm,
        slug,
        schoolId: school.id,
        status: 'active',
        enrolled: 0,
        students: [],
        materials: [],
        assignments: [],
        attendance: [],
      });
      setClasses([...classes, newClass]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const handleUpdateClass = async () => {
    if (!selectedClass) return;

    try {
      const updatedClass = await sdk.update<Class>('classes', selectedClass.id, classForm);
      setClasses(classes.map(cls => 
        cls.id === selectedClass.id ? updatedClass : cls
      ));
      resetForm();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedClass(null);
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      await sdk.delete('classes', classId);
      setClasses(classes.filter(cls => cls.id !== classId));
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const resetForm = () => {
    setClassForm({
      name: '',
      description: '',
      teacherId: '',
      programId: '',
      capacity: 30,
      fee: 0,
      room: '',
      gradeLevel: '',
      subject: '',
      schedule: {
        monday: { start: '', end: '' },
        tuesday: { start: '', end: '' },
        wednesday: { start: '', end: '' },
        thursday: { start: '', end: '' },
        friday: { start: '', end: '' },
      }
    });
  };

  const openEditDialog = (classItem: Class) => {
    setSelectedClass(classItem);
    setClassForm({
      name: classItem.name,
      description: classItem.description,
      teacherId: classItem.teacherId,
      programId: classItem.programId,
      capacity: classItem.capacity,
      fee: classItem.fee,
      room: classItem.room,
      gradeLevel: classItem.gradeLevel,
      subject: classItem.subject,
      schedule: classItem.schedule || {
        monday: { start: '', end: '' },
        tuesday: { start: '', end: '' },
        wednesday: { start: '', end: '' },
        thursday: { start: '', end: '' },
        friday: { start: '', end: '' },
      }
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Unassigned';
  };

  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    return program ? program.name : 'No Program';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Classes Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setIsEditing(false); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Class
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Class' : 'Create New Class'}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Class Name *</label>
                    <Input
                      value={classForm.name}
                      onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                      placeholder="Enter class name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Teacher</label>
                    <Select value={classForm.teacherId} onValueChange={(value) => setClassForm({ ...classForm, teacherId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Program</label>
                    <Select value={classForm.programId} onValueChange={(value) => setClassForm({ ...classForm, programId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      value={classForm.subject}
                      onChange={(e) => setClassForm({ ...classForm, subject: e.target.value })}
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Grade Level</label>
                    <Input
                      value={classForm.gradeLevel}
                      onChange={(e) => setClassForm({ ...classForm, gradeLevel: e.target.value })}
                      placeholder="e.g., Grade 5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Room</label>
                    <Input
                      value={classForm.room}
                      onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                      placeholder="e.g., Room 101"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Capacity</label>
                    <Input
                      type="number"
                      value={classForm.capacity}
                      onChange={(e) => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
                      placeholder="30"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Fee ($)</label>
                    <Input
                      type="number"
                      value={classForm.fee}
                      onChange={(e) => setClassForm({ ...classForm, fee: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={classForm.description}
                      onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
                      placeholder="Class description"
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4">
                <div className="space-y-4">
                  {Object.entries(classForm.schedule).map(([day, times]) => (
                    <div key={day} className="grid grid-cols-3 gap-4 items-center">
                      <label className="font-medium capitalize">{day}:</label>
                      <div>
                        <Input
                          type="time"
                          value={(times as any).start}
                          onChange={(e) => setClassForm({
                            ...classForm,
                            schedule: {
                              ...classForm.schedule,
                              [day]: { ...(times as any), start: e.target.value }
                            }
                          })}
                          placeholder="Start time"
                        />
                      </div>
                      <div>
                        <Input
                          type="time"
                          value={(times as any).end}
                          onChange={(e) => setClassForm({
                            ...classForm,
                            schedule: {
                              ...classForm.schedule,
                              [day]: { ...(times as any), end: e.target.value }
                            }
                          })}
                          placeholder="End time"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="text-sm text-gray-500">
                  Additional class settings will be available here.
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateClass : handleCreateClass}>
                {isEditing ? 'Update Class' : 'Create Class'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{classes.length}</div>
                <p className="text-xs text-muted-foreground">Total Classes</p>
              </div>
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{classes.filter(c => c.status === 'active').length}</div>
                <p className="text-xs text-muted-foreground">Active Classes</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{classes.reduce((acc, c) => acc + c.enrolled, 0)}</div>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{teachers.length}</div>
                <p className="text-xs text-muted-foreground">Teachers</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{classItem.subject}</Badge>
                    <Badge className={classItem.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {classItem.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(classItem)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteClass(classItem.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{classItem.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Teacher:</span>
                  <span>{getTeacherName(classItem.teacherId)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Program:</span>
                  <span>{getProgramName(classItem.programId)}</span>
                </div>
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
                {classItem.fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fee:</span>
                    <span className="font-medium">${classItem.fee}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(classItem.enrolled / classItem.capacity) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((classItem.enrolled / classItem.capacity) * 100)}% filled
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {classes.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No classes found. Create your first class to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesModule;
