
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
import { Plus, Edit, Trash2, Eye, Calendar, User } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  schoolId: string;
  authorId: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage: string;
  publishedAt: string;
  tags: string[];
  categories: string[];
  readingTime: number;
  views: number;
  likes: number;
  comments: any[];
  relatedPosts: string[];
  seoTitle: string;
  seoDescription: string;
}

const BlogModule: React.FC = () => {
  const { school } = useSchool();
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft' as BlogPost['status'],
    featuredImage: '',
    tags: '',
    categories: '',
    seoTitle: '',
    seoDescription: '',
  });

  useEffect(() => {
    fetchPosts();
  }, [school]);

  const fetchPosts = async () => {
    if (!school) return;

    setLoading(true);
    try {
      const allPosts = await sdk.get<BlogPost>('blog_posts');
      const schoolPosts = allPosts.filter(post => post.schoolId === school.id);
      setPosts(schoolPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!school) return;

    try {
      const slug = postForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const readingTime = Math.ceil(postForm.content.split(' ').length / 200);
      const tags = postForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const categories = postForm.categories.split(',').map(cat => cat.trim()).filter(Boolean);
      
      const newPost = await sdk.insert<BlogPost>('blog_posts', {
        ...postForm,
        slug,
        schoolId: school.id,
        authorId: 'admin', // In real app, use current user
        publishedAt: postForm.status === 'published' ? new Date().toISOString() : '',
        tags,
        categories,
        readingTime,
        views: 0,
        likes: 0,
        comments: [],
        relatedPosts: [],
      });
      setPosts([...posts, newPost]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleUpdatePost = async () => {
    if (!selectedPost) return;

    try {
      const tags = postForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const categories = postForm.categories.split(',').map(cat => cat.trim()).filter(Boolean);
      const readingTime = Math.ceil(postForm.content.split(' ').length / 200);
      
      const updatedPost = await sdk.update<BlogPost>('blog_posts', selectedPost.id, {
        ...postForm,
        tags,
        categories,
        readingTime,
        publishedAt: postForm.status === 'published' && !selectedPost.publishedAt 
          ? new Date().toISOString() 
          : selectedPost.publishedAt,
      });
      setPosts(posts.map(post => 
        post.id === selectedPost.id ? updatedPost : post
      ));
      resetForm();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await sdk.delete('blog_posts', postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const resetForm = () => {
    setPostForm({
      title: '',
      content: '',
      excerpt: '',
      status: 'draft',
      featuredImage: '',
      tags: '',
      categories: '',
      seoTitle: '',
      seoDescription: '',
    });
  };

  const openEditDialog = (post: BlogPost) => {
    setSelectedPost(post);
    setPostForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      featuredImage: post.featuredImage,
      tags: post.tags.join(', '),
      categories: post.categories.join(', '),
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: BlogPost['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const isAdmin = user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner');
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {(isAdmin || user?.userType === 'teacher') && (
            <DialogTrigger asChild>
              <Button onClick={() => { setIsEditing(false); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
          )}
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    placeholder="Enter post title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={postForm.status} onValueChange={(value) => setPostForm({ ...postForm, status: value as BlogPost['status'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                  <Input
                    value={postForm.featuredImage}
                    onChange={(e) => setPostForm({ ...postForm, featuredImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                  <Input
                    value={postForm.tags}
                    onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
                    placeholder="news, education, announcement"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Categories (comma separated)</label>
                  <Input
                    value={postForm.categories}
                    onChange={(e) => setPostForm({ ...postForm, categories: e.target.value })}
                    placeholder="academic, sports, events"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Excerpt</label>
                  <Textarea
                    value={postForm.excerpt}
                    onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                    placeholder="Brief description of the post"
                    rows={2}
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Content *</label>
                  <Textarea
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    placeholder="Write your post content here..."
                    rows={10}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">SEO Title</label>
                  <Input
                    value={postForm.seoTitle}
                    onChange={(e) => setPostForm({ ...postForm, seoTitle: e.target.value })}
                    placeholder="SEO optimized title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">SEO Description</label>
                  <Input
                    value={postForm.seoDescription}
                    onChange={(e) => setPostForm({ ...postForm, seoDescription: e.target.value })}
                    placeholder="SEO meta description"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdatePost : handleCreatePost}>
                {isEditing ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">Total Posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{posts.filter(p => p.status === 'published').length}</div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{posts.filter(p => p.status === 'draft').length}</div>
            <p className="text-xs text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{posts.reduce((acc, p) => acc + p.views, 0)}</div>
            <p className="text-xs text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published'}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.views} views
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {post.readingTime} min read
                      </div>
                    </div>
                    
                    {post.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {(user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner') || user?.userType === 'teacher') && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(post)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeletePost(post.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {posts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No blog posts found. Create your first post to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogModule;
