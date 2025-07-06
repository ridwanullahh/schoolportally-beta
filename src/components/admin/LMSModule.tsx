
import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Play, Users, BookOpen, Award, FileText } from 'lucide-react';

interface Course {
  id: string;
  schoolId: string;
  title: string;
  slug: string;
  description: string;
  instructorId: string;
  duration: string;
  difficulty: string;
  price: number;
  thumbnail: string;
  status: string;
  enrollmentCount: number;
  maxEnrollment: number;
  startDate: string;
  endDate: string;
  modules: any[];
  assignments: any[];
  resources: any[];
  requirements: string[];
  objectives: string[];
  category: string;
  tags: string[];
  rating: number;
  reviews: any[];
}

const LMSModule: React.FC = () => {
  const { school } = useSchool();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    instructorId: '',
    duration: '',
    difficulty: 'beginner',
    price: 0,
    thumbnail: '',
    maxEnrollment: 50,
    startDate: '',
    endDate: '',
    category: 'general',
    tags: '',
    requirements: '',
    objectives: '',
  });

  useEffect(() => {
    fetchCourses();
  }, [school]);

  const fetchCourses = async () => {
    if (!school) return;

    setLoading(true);
    try {
      const allCourses = await sdk.get<Course>('courses');
      const schoolCourses = allCourses.filter(course => course.schoolId === school.id);
      setCourses(schoolCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!school) return;

    try {
      const slug = courseForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const tags = courseForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const requirements = courseForm.requirements.split('\n').filter(Boolean);
      const objectives = courseForm.objectives.split('\n').filter(Boolean);

      const newCourse = await sdk.insert<Course>('courses', {
        ...courseForm,
        slug,
        schoolId: school.id,
        status: 'draft',
        enrollmentCount: 0,
        modules: [],
        assignments: [],
        resources: [],
        requirements,
        objectives,
        tags,
        rating: 0,
        reviews: [],
      });
      setCourses([...courses, newCourse]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;

    try {
      const tags = courseForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const requirements = courseForm.requirements.split('\n').filter(Boolean);
      const objectives = courseForm.objectives.split('\n').filter(Boolean);

      const updatedCourse = await sdk.update<Course>('courses', selectedCourse.id, {
        ...courseForm,
        tags,
        requirements,
        objectives,
      });
      setCourses(courses.map(course => 
        course.id === selectedCourse.id ? updatedCourse : course
      ));
      resetForm();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await sdk.delete('courses', courseId);
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const resetForm = () => {
    setCourseForm({
      title: '',
      description: '',
      instructorId: '',
      duration: '',
      difficulty: 'beginner',
      price: 0,
      thumbnail: '',
      maxEnrollment: 50,
      startDate: '',
      endDate: '',
      category: 'general',
      tags: '',
      requirements: '',
      objectives: '',
    });
  };

  const openEditDialog = (course: Course) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      instructorId: course.instructorId,
      duration: course.duration,
      difficulty: course.difficulty,
      price: course.price,
      thumbnail: course.thumbnail,
      maxEnrollment: course.maxEnrollment,
      startDate: course.startDate,
      endDate: course.endDate,
      category: course.category,
      tags: course.tags.join(', '),
      requirements: course.requirements.join('\n'),
      objectives: course.objectives.join('\n'),
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Learning Management System</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setIsEditing(false); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Course' : 'Create New Course'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Course Title *</label>
                <Input
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="Enter course title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={courseForm.category} onValueChange={(value) => setCourseForm({ ...courseForm, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="language">Language</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <Select value={courseForm.difficulty} onValueChange={(value) => setCourseForm({ ...courseForm, difficulty: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <Input
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                  placeholder="e.g., 8 weeks, 40 hours"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Price ($)</label>
                <Input
                  type="number"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Max Enrollment</label>
                <Input
                  type="number"
                  value={courseForm.maxEnrollment}
                  onChange={(e) => setCourseForm({ ...courseForm, maxEnrollment: Number(e.target.value) })}
                  placeholder="50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                <Input
                  value={courseForm.thumbnail}
                  onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <Input
                  type="date"
                  value={courseForm.startDate}
                  onChange={(e) => setCourseForm({ ...courseForm, startDate: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <Input
                  type="date"
                  value={courseForm.endDate}
                  onChange={(e) => setCourseForm({ ...courseForm, endDate: e.target.value })}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                <Input
                  value={courseForm.tags}
                  onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value })}
                  placeholder="programming, web development, javascript"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Course description"
                  rows={4}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Prerequisites (one per line)</label>
                <Textarea
                  value={courseForm.requirements}
                  onChange={(e) => setCourseForm({ ...courseForm, requirements: e.target.value })}
                  placeholder="Basic computer skills\nHigh school mathematics"
                  rows={3}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Learning Objectives (one per line)</label>
                <Textarea
                  value={courseForm.objectives}
                  onChange={(e) => setCourseForm({ ...courseForm, objectives: e.target.value })}
                  placeholder="Understand basic programming concepts\nBuild web applications"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateCourse : handleCreateCourse}>
                {isEditing ? 'Update Course' : 'Create Course'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold">{courses.length}</div>
                    <p className="text-xs text-muted-foreground">Total Courses</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{courses.filter(c => c.status === 'published').length}</div>
                <p className="text-xs text-muted-foreground">Published</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{courses.reduce((acc, c) => acc + c.enrollmentCount, 0)}</div>
                <p className="text-xs text-muted-foreground">Total Enrollments</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">${courses.reduce((acc, c) => acc + (c.price * c.enrollmentCount), 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  {course.thumbnail && (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover rounded-md mb-4" />
                  )}
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">{course.category}</Badge>
                        <Badge className={getStatusColor(course.status)}>
                          {course.status}
                        </Badge>
                        <Badge className={getDifficultyColor(course.difficulty)}>
                          {course.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(course)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteCourse(course.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-medium">${course.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Enrolled:</span>
                      <span>{course.enrollmentCount}/{course.maxEnrollment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rating:</span>
                      <span>★ {course.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(course.enrollmentCount / course.maxEnrollment) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((course.enrollmentCount / course.maxEnrollment) * 100)}% filled
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {courses.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No courses found. Create your first course to get started.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="enrollments">
          <Card>
            <CardHeader>
              <CardTitle>Course Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Enrollment management interface will display student enrollments across all courses.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Course Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Assignment management interface for creating and grading course assignments.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>LMS Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Analytics dashboard showing course performance, student progress, and engagement metrics.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LMSModule;
