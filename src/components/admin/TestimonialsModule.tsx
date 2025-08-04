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
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Star, User, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  schoolId: string;
  text: string;
  author: string;
  role: string;
  avatar?: string;
  rating: number;
  status: 'published' | 'draft' | 'pending';
  featured: boolean;
  date: string;
  createdAt: string;
  updatedAt?: string;
}

const TestimonialsModule: React.FC = () => {
  const { school } = useSchool();
  const { user } = useAuth();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [testimonialForm, setTestimonialForm] = useState({
    text: '',
    author: '',
    role: '',
    avatar: '',
    rating: 5,
    status: 'published' as Testimonial['status'],
    featured: false,
    date: new Date().toISOString().split('T')[0],
  });

  const roles = ['Student', 'Parent', 'Alumni', 'Teacher', 'Staff', 'Visitor', 'Other'];
  const statuses = ['published', 'draft', 'pending'];

  useEffect(() => {
    fetchTestimonials();
  }, [school]);

  const fetchTestimonials = async () => {
    if (!school || !user) return;

    setLoading(true);
    try {
      const allTestimonials = await sdk.get<Testimonial>('testimonials');
      const schoolTestimonials = allTestimonials.filter(testimonial => testimonial.schoolId === school.id);
      setTestimonials(schoolTestimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school || !user) return;

    try {
      const testimonialData = {
        ...testimonialForm,
        schoolId: school.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isEditing && selectedTestimonial) {
        await sdk.update<Testimonial>('testimonials', selectedTestimonial.id, {
          ...testimonialData,
          createdAt: selectedTestimonial.createdAt,
        });
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
        });
      } else {
        await sdk.insert<Testimonial>('testimonials', testimonialData);
        toast({
          title: "Success",
          description: "Testimonial created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setTestimonialForm({
      text: testimonial.text,
      author: testimonial.author,
      role: testimonial.role,
      avatar: testimonial.avatar || '',
      rating: testimonial.rating,
      status: testimonial.status,
      featured: testimonial.featured,
      date: testimonial.date,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (testimonialId: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await sdk.delete('testimonials', testimonialId);
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setTestimonialForm({
      text: '',
      author: '',
      role: '',
      avatar: '',
      rating: 5,
      status: 'published',
      featured: false,
      date: new Date().toISOString().split('T')[0],
    });
    setSelectedTestimonial(null);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isAdmin = user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Testimonials Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {isAdmin && (
            <DialogTrigger asChild>
              <Button onClick={() => { setIsEditing(false); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
          )}
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Testimonial Text *</label>
                <Textarea
                  value={testimonialForm.text}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                  placeholder="Enter the testimonial text..."
                  required
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Author Name *</label>
                  <Input
                    value={testimonialForm.author}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, author: e.target.value })}
                    placeholder="Author name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <Select value={testimonialForm.role} onValueChange={(value) => setTestimonialForm({ ...testimonialForm, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Avatar URL</label>
                <Input
                  value={testimonialForm.avatar}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <Select value={testimonialForm.rating.toString()} onValueChange={(value) => setTestimonialForm({ ...testimonialForm, rating: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>{rating} Star{rating > 1 ? 's' : ''}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={testimonialForm.status} onValueChange={(value: Testimonial['status']) => setTestimonialForm({ ...testimonialForm, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input
                    type="date"
                    value={testimonialForm.date}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, date: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={testimonialForm.featured}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, featured: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium">Featured Testimonial</label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update' : 'Create'} Testimonial
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {testimonials.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Quote className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
              <p className="text-gray-500 text-center mb-4">
                Start collecting testimonials from your students, parents, and community.
              </p>
              {isAdmin && (
                <Button onClick={() => { setIsEditing(false); resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Testimonial
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    {testimonial.avatar ? (
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.author}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{testimonial.author}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{testimonial.role}</span>
                        {testimonial.featured && (
                          <Badge variant="secondary" className="text-xs">Featured</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(testimonial.status)}>
                      {testimonial.status}
                    </Badge>
                    {isAdmin && (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(testimonial.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-gray-700 italic mb-3">
                  "{testimonial.text}"
                </blockquote>
                <div className="flex justify-between items-center">
                  {renderStars(testimonial.rating)}
                  <span className="text-sm text-gray-500">
                    {new Date(testimonial.date).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TestimonialsModule;
