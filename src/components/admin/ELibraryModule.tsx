
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
import { Plus, Edit, Trash2, Book, Download, FileText } from 'lucide-react';

interface ELibraryItem {
  id: string;
  schoolId: string;
  title: string;
  author: string;
  description: string;
  fileUrl: string;
  fileType: string;
  category: string;
  status: string;
  createdAt: string;
}

const ELibraryModule: React.FC = () => {
  const { school } = useSchool();
  const { user } = useAuth();
  const [items, setItems] = useState<ELibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ELibraryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [itemForm, setItemForm] = useState({
    title: '',
    author: '',
    description: '',
    fileUrl: '',
    fileType: 'pdf',
    category: 'textbook',
    status: 'published'
  });

  const fileTypes = ['pdf', 'epub', 'doc', 'docx', 'ppt', 'pptx', 'other'];
  const categories = ['textbook', 'reference', 'fiction', 'non-fiction', 'journal', 'magazine', 'other'];

  useEffect(() => {
    fetchItems();
  }, [school]);

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const fetchItems = async () => {
    if (!school) return;

    setLoading(true);
    try {
      const allItems = await sdk.get<ELibraryItem>('elibrary');
      const schoolItems = allItems.filter(item => item.schoolId === school.id);
      setItems(schoolItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error fetching e-library items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async () => {
    if (!school) return;

    try {
      const newItem = await sdk.insert<ELibraryItem>('elibrary', {
        id: generateUniqueId(),
        ...itemForm,
        schoolId: school.id,
        createdAt: new Date().toISOString()
      });
      setItems([newItem, ...items]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating e-library item:', error);
    }
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) return;

    try {
      const updatedItem = await sdk.update<ELibraryItem>('elibrary', selectedItem.id, itemForm);
      setItems(items.map(item => 
        item.id === selectedItem.id ? updatedItem : item
      ));
      resetForm();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating e-library item:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await sdk.delete('elibrary', itemId);
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting e-library item:', error);
    }
  };

  const resetForm = () => {
    setItemForm({
      title: '',
      author: '',
      description: '',
      fileUrl: '',
      fileType: 'pdf',
      category: 'textbook',
      status: 'published'
    });
  };

  const openEditDialog = (item: ELibraryItem) => {
    setSelectedItem(item);
    setItemForm({
      title: item.title,
      author: item.author,
      description: item.description,
      fileUrl: item.fileUrl,
      fileType: item.fileType,
      category: item.category,
      status: item.status
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      textbook: 'bg-blue-100 text-blue-800',
      reference: 'bg-green-100 text-green-800',
      fiction: 'bg-purple-100 text-purple-800',
      'non-fiction': 'bg-orange-100 text-orange-800',
      journal: 'bg-red-100 text-red-800',
      magazine: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'epub':
        return <Book className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const isAdmin = user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner');
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">E-Library Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {(isAdmin || user?.userType === 'teacher') && (
            <DialogTrigger asChild>
              <Button onClick={() => { setIsEditing(false); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
          )}
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Library Item' : 'Add New Library Item'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  placeholder="Enter item title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <Input
                    value={itemForm.author}
                    onChange={(e) => setItemForm({ ...itemForm, author: e.target.value })}
                    placeholder="Enter author name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">File Type</label>
                  <Select value={itemForm.fileType} onValueChange={(value) => setItemForm({ ...itemForm, fileType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fileTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={itemForm.status} onValueChange={(value) => setItemForm({ ...itemForm, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">File URL *</label>
                <Input
                  value={itemForm.fileUrl}
                  onChange={(e) => setItemForm({ ...itemForm, fileUrl: e.target.value })}
                  placeholder="https://example.com/file.pdf"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="Item description"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateItem : handleCreateItem}>
                {isEditing ? 'Update Item' : 'Add Item'}
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
                <div className="text-2xl font-bold">{items.length}</div>
                <p className="text-xs text-muted-foreground">Total Items</p>
              </div>
              <Book className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{items.filter(i => i.status === 'published').length}</div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{items.filter(i => i.category === 'textbook').length}</div>
            <p className="text-xs text-muted-foreground">Textbooks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{items.filter(i => i.fileType === 'pdf').length}</div>
            <p className="text-xs text-muted-foreground">PDF Files</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  {item.author && (
                    <p className="text-sm text-gray-600 mt-1">by {item.author}</p>
                  )}
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                    <Badge variant="outline">
                      {item.fileType.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {(user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner') || user?.userType === 'teacher') && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getFileIcon(item.fileType)}
                  <span className="text-sm text-gray-500">
                    {item.fileType.toUpperCase()} File
                  </span>
                </div>
                
                {item.fileUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(item.fileUrl, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    View
                  </Button>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Added: {new Date(item.createdAt).toLocaleDateString()}</span>
                  <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {items.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No library items found. Add your first item to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default ELibraryModule;
