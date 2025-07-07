
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSchool } from '@/contexts/SchoolContext';
import { Plus, Edit, Trash2, Users, BookOpen, Calendar } from 'lucide-react';
import sdk from '@/lib/sdk-config';

interface Course {
  id: string;
  uid?: string;
  schoolId: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName?: string;
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

const LMSModule = () => {
  const { school } = useSchool();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructorId: '',
    publishStatus: 'draft' as 'draft' | 'published' | 'scheduled',
    scheduledDate: ''
  });

  useEffect(() => {
    if (school) {
      fetchCourses();
      fetchTeachers();
    }
  }, [school]);

  const fetchCourses = async () => {
    try {
      const allCourses = await sdk.get<Course>('lms_courses');
      const schoolCourses = allCourses.filter(course => course.schoolId === school?.id);
      
      // Fetch teacher names for courses
      const teachers = await sdk.get<Teacher>('users');
      const coursesWithTeachers = schoolCourses.map(course => ({
        ...course,
        instructorName: teachers.find(t => t.id === course.instructorId)?.firstName + ' ' + 
                      teachers.find(t => t.id === course.instructorId)?.lastName
      }));
      
      setCourses(coursesWithTeachers);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const allUsers = await sdk.get<any>('users');
      const schoolTeachers = allUsers.filter(user => 
        user.schoolId === school?.id && 
        (user.roles?.includes('teacher') || user.roles?.includes('school_admin'))
      );
      setTeachers(schoolTeachers);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;

    setLoading(true);
    try {
      const courseData = {
        ...formData,
        schoolId: school.id,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingCourse) {
        await sdk.update('lms_courses', editingCourse.id, {
          ...courseData,
          updatedAt: new Date().toISOString()
        });
        toast({
          title: 'Success',
          description: 'Course updated successfully',
        });
      } else {
        await sdk.insert('lms_courses', courseData);
        toast({
          title: 'Success',
          description: 'Course created successfully',
        });
      }

      fetchCourses();
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save course',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      instructorId: course.instructorId,
      publishStatus: course.publishStatus,
      scheduledDate: course.scheduledDate || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await sdk.delete('lms_courses', courseId);
      toast({
        title: 'Success',
        description: 'Course deleted successfully',
      });
      fetchCourses();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete course',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructorId: '',
      publishStatus: 'draft',
      scheduledDate: ''
    });
    setEditingCourse(null);
    setShowForm(false);
  };

  const getStatusBadge = (publishStatus: string) => {
    const statusConfig: { [key: string]: { variant: "default" | "destructive" | "outline" | "secondary", className?: string } } = {
      draft: { variant: 'secondary' },
      published: { variant: 'default', className: 'bg-green-100 text-green-800 hover:bg-green-200' },
      scheduled: { variant: 'outline', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' }
    };
    
    const config = statusConfig[publishStatus] || statusConfig.draft;
    return (
      <Badge variant={config.variant} className={config.className}>
        {publishStatus.charAt(0).toUpperCase() + publishStatus.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Learning Management System</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="instructorId">Instructor</Label>
                <Select value={formData.instructorId} onValueChange={(value) => setFormData({...formData, instructorId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="publishStatus">Publish Status</Label>
                <Select value={formData.publishStatus} onValueChange={(value: 'draft' | 'published' | 'scheduled') => setFormData({...formData, publishStatus: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.publishStatus === 'scheduled' && (
                <div>
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    {getStatusBadge(course.publishStatus)}
                  </div>
                  <p className="text-gray-600 mb-2">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Instructor: {course.instructorName || 'Not assigned'}
                    </span>
                    {course.scheduledDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Scheduled: {new Date(course.scheduledDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(course)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(course.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {courses.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-4">Create your first course to get started with the LMS.</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LMSModule;
