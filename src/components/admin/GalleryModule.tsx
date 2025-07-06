
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
import { Plus, Edit, Trash2, Upload, Image, Video, Star } from 'lucide-react';

interface GalleryItem {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  url: string;
  type: string;
  category: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  featured: boolean;
  visibility: string;
  metadata?: any;
}

const GalleryModule: React.FC = () => {
  const { school } = useSchool();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const [itemForm, setItemForm] = useState({
    title: '',
    description: '',
    url: '',
    type: 'image',
    category: 'general',
    tags: '',
    featured: false,
    visibility: 'public'
  });

  const categories = ['general', 'sports', 'academics', 'events', 'facilities', 'achievements', 'staff', 'students'];
  const types = ['image', 'video', 'document'];

  useEffect(() => {
    fetchGalleryItems();
  }, [school]);

  const fetchGalleryItems = async () => {
    if (!school) return;

    setLoading(true);
    try {
      const allItems = await sdk.get<GalleryItem>('gallery');
      const schoolItems = allItems.filter(item => item.schoolId === school.id);
      setGalleryItems(schoolItems.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()));
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async () => {
    if (!school) return;

    try {
      const tags = itemForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const newItem = await sdk.insert<GalleryItem>('gallery', {
        ...itemForm,
        schoolId: school.id,
        tags,
        uploadedBy: 'admin',
        uploadedAt: new Date().toISOString()
      });
      setGalleryItems([newItem, ...galleryItems]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating gallery item:', error);
    }
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) return;

    try {
      const tags = itemForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const updatedItem = await sdk.update<GalleryItem>('gallery', selectedItem.id, {
        ...itemForm,
        tags
      });
      setGalleryItems(galleryItems.map(item => 
        item.id === selectedItem.id ? updatedItem : item
      ));
      resetForm();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating gallery item:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await sdk.delete('gallery', itemId);
      setGalleryItems(galleryItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting gallery item:', error);
    }
  };

  const handleToggleFeatured = async (itemId: string, featured: boolean) => {
    try {
      const updatedItem = await sdk.update<GalleryItem>('gallery', itemId, { featured: !featured });
      setGalleryItems(galleryItems.map(item => 
        item.id === itemId ? updatedItem : item
      ));
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  const resetForm = () => {
    setItemForm({
      title: '',
      description: '',
      url: '',
      type: 'image',
      category: 'general',
      tags: '',
      featured: false,
      visibility: 'public'
    });
  };

  const openEditDialog = (item: GalleryItem) => {
    setSelectedItem(item);
    setItemForm({
      title: item.title,
      description: item.description,
      url: item.url,
      type: item.type,
      category: item.category,
      tags: item.tags.join(', '),
      featured: item.featured,
      visibility: item.visibility
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: 'bg-gray-100 text-gray-800',
      sports: 'bg-green-100 text-green-800',
      academics: 'bg-blue-100 text-blue-800',
      events: 'bg-purple-100 text-purple-800',
      facilities: 'bg-orange-100 text-orange-800',
      achievements: 'bg-yellow-100 text-yellow-800',
      staff: 'bg-indigo-100 text-indigo-800',
      students: 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      default: return <Image className="w-4 h-4" />;
    }
  };

  const filteredItems = galleryItems.filter(item => {
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const typeMatch = filterType === 'all' || item.type === filterType;
    return categoryMatch && typeMatch;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setIsEditing(false); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Media' : 'Add New Media'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  placeholder="Enter media title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Media URL *</label>
                <Input
                  value={itemForm.url}
                  onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <Select value={itemForm.type} onValueChange={(value) => setItemForm({ ...itemForm, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={itemForm.category} onValueChange={(value) => setItemForm({ ...itemForm, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Visibility</label>
                <Select value={itemForm.visibility} onValueChange={(value) => setItemForm({ ...itemForm, visibility: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="restricted">Restricted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                <Input
                  value={itemForm.tags}
                  onChange={(e) => setItemForm({ ...itemForm, tags: e.target.value })}
                  placeholder="sports day, annual, outdoor"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="Media description"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={itemForm.featured}
                  onChange={(e) => setItemForm({ ...itemForm, featured: e.target.checked })}
                />
                <label>Featured</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateItem : handleCreateItem}>
                {isEditing ? 'Update Media' : 'Add Media'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{galleryItems.length}</div>
                <p className="text-xs text-muted-foreground">Total Items</p>
              </div>
              <Image className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{galleryItems.filter(i => i.type === 'image').length}</div>
            <p className="text-xs text-muted-foreground">Images</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{galleryItems.filter(i => i.type === 'video').length}</div>
            <p className="text-xs text-muted-foreground">Videos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{galleryItems.filter(i => i.featured).length}</div>
            <p className="text-xs text-muted-foreground">Featured</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 mb-6">
            <div>
              <label className="font-medium mr-2">Category:</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="font-medium mr-2">Type:</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow relative">
                {item.featured && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-0">
                  <div className="relative">
                    {item.type === 'image' ? (
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-48 object-cover rounded-t-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.png';
                        }}
                      />
                    ) : item.type === 'video' ? (
                      <video 
                        src={item.url} 
                        className="w-full h-48 object-cover rounded-t-lg"
                        controls
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                        <Image className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className="bg-white">
                        {getTypeIcon(item.type)}
                        <span className="ml-1">{item.type}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleFeatured(item.id, item.featured)}
                        >
                          <Star className={`w-3 h-3 ${item.featured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(item.category)} variant="outline">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(item.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {item.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No media items found. Add your first media to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryModule;
