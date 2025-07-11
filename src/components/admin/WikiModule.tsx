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
import { Plus, Edit, Trash2, Eye, Search, BookOpen, Folder, Star } from 'lucide-react';

interface WikiArticle {
  id: string;
  schoolId: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  authorId: string;
  category: string;
  tags: string[];
  status: string;
  visibility: string;
  version: number;
  parentId: string;
  order: number;
  attachments: string[];
  relatedArticles: string[];
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface WikiCategory {
  id: string;
  schoolId: string;
  name: string;
  slug: string;
  description: string;
  parentId: string;
  order: number;
  icon: string;
  color: string;
  status: string;
}

const WikiModule: React.FC = () => {
  const { school } = useSchool();
  const { user } = useAuth();
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [categories, setCategories] = useState<WikiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<WikiArticle | null>(null);
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('articles');
  const [searchTerm, setSearchTerm] = useState('');

  const [articleForm, setArticleForm] = useState({
    title: '',
    content: '',
    summary: '',
    category: '',
    tags: '',
    status: 'draft',
    visibility: 'public',
    parentId: '',
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    parentId: '',
    icon: 'folder',
    color: '#4f46e5',
  });

  useEffect(() => {
    fetchData();
  }, [school]);

  const fetchData = async () => {
    if (!school) return;

    setLoading(true);
    try {
      const [allArticles, allCategories] = await Promise.all([
        sdk.get<WikiArticle>('wiki_articles'),
        sdk.get<WikiCategory>('wiki_categories')
      ]);

      const schoolArticles = allArticles.filter(article => article.schoolId === school.id);
      const schoolCategories = allCategories.filter(category => category.schoolId === school.id);

      setArticles(schoolArticles);
      setCategories(schoolCategories);
    } catch (error) {
      console.error('Error fetching wiki data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = async () => {
    if (!school) return;

    try {
      const slug = articleForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const tags = articleForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const newArticle = await sdk.insert<WikiArticle>('wiki_articles', {
        ...articleForm,
        slug,
        schoolId: school.id,
        authorId: 'admin',
        tags,
        version: 1,
        order: articles.length,
        attachments: [],
        relatedArticles: [],
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: articleForm.status === 'published' ? new Date().toISOString() : '',
      });
      
      setArticles([...articles, newArticle]);
      resetArticleForm();
      setIsArticleDialogOpen(false);
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  const handleUpdateArticle = async () => {
    if (!selectedArticle) return;

    try {
      const tags = articleForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      const updatedArticle = await sdk.update<WikiArticle>('wiki_articles', selectedArticle.id, {
        ...articleForm,
        tags,
        version: selectedArticle.version + 1,
        updatedAt: new Date().toISOString(),
        publishedAt: articleForm.status === 'published' && !selectedArticle.publishedAt 
          ? new Date().toISOString() 
          : selectedArticle.publishedAt,
      });
      
      setArticles(articles.map(article => 
        article.id === selectedArticle.id ? updatedArticle : article
      ));
      resetArticleForm();
      setIsArticleDialogOpen(false);
      setIsEditing(false);
      setSelectedArticle(null);
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    try {
      await sdk.delete('wiki_articles', articleId);
      setArticles(articles.filter(article => article.id !== articleId));
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleCreateCategory = async () => {
    if (!school) return;

    try {
      const slug = categoryForm.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const newCategory = await sdk.insert<WikiCategory>('wiki_categories', {
        ...categoryForm,
        slug,
        schoolId: school.id,
        order: categories.length,
        status: 'active',
      });
      
      setCategories([...categories, newCategory]);
      resetCategoryForm();
      setIsCategoryDialogOpen(false);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await sdk.delete('wiki_categories', categoryId);
      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const resetArticleForm = () => {
    setArticleForm({
      title: '',
      content: '',
      summary: '',
      category: '',
      tags: '',
      status: 'draft',
      visibility: 'public',
      parentId: '',
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      parentId: '',
      icon: 'folder',
      color: '#4f46e5',
    });
  };

  const openEditDialog = (article: WikiArticle) => {
    setSelectedArticle(article);
    setArticleForm({
      title: article.title,
      content: article.content,
      summary: article.summary,
      category: article.category,
      tags: article.tags.join(', '),
      status: article.status,
      visibility: article.visibility,
      parentId: article.parentId,
    });
    setIsEditing(true);
    setIsArticleDialogOpen(true);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const isAdmin = user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner');
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Knowledge Base</h2>
        <div className="flex space-x-2">
          {(user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner') || user?.userType === 'teacher') && (
            <>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => resetCategoryForm()}>
                    <Folder className="w-4 h-4 mr-2" />
                    New Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category Name *</label>
                      <Input
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        placeholder="Enter category name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        placeholder="Category description"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Parent Category</label>
                      <Select value={categoryForm.parentId} onValueChange={(value) => setCategoryForm({ ...categoryForm, parentId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None (Root Category)</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Icon</label>
                        <Input
                          value={categoryForm.icon}
                          onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                          placeholder="folder"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Color</label>
                        <Input
                          type="color"
                          value={categoryForm.color}
                          onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCategory}>
                      Create Category
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
          
              <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setIsEditing(false); resetArticleForm(); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Article
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Article' : 'Create New Article'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Article Title *</label>
                      <Input
                        value={articleForm.title}
                        onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                        placeholder="Enter article title"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <Select value={articleForm.category} onValueChange={(value) => setArticleForm({ ...articleForm, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <Select value={articleForm.status} onValueChange={(value) => setArticleForm({ ...articleForm, status: value })}>
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
                        <label className="block text-sm font-medium mb-2">Visibility</label>
                        <Select value={articleForm.visibility} onValueChange={(value) => setArticleForm({ ...articleForm, visibility: value })}>
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
                        <label className="block text-sm font-medium mb-2">Parent Article</label>
                        <Select value={articleForm.parentId} onValueChange={(value) => setArticleForm({ ...articleForm, parentId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select parent article" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {articles.map((article) => (
                              <SelectItem key={article.id} value={article.id}>
                                {article.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                      <Input
                        value={articleForm.tags}
                        onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                        placeholder="help, tutorial, guide"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Summary</label>
                      <Textarea
                        value={articleForm.summary}
                        onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                        placeholder="Brief summary of the article"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Content *</label>
                      <Textarea
                        value={articleForm.content}
                        onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                        placeholder="Write your article content here..."
                        rows={12}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setIsArticleDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={isEditing ? handleUpdateArticle : handleCreateArticle}>
                      {isEditing ? 'Update Article' : 'Create Article'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold">{articles.length}</div>
                      <p className="text-xs text-muted-foreground">Total Articles</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{articles.filter(a => a.status === 'published').length}</div>
                  <p className="text-xs text-muted-foreground">Published</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{categories.length}</div>
                  <p className="text-xs text-muted-foreground">Categories</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{articles.reduce((acc, a) => acc + a.views, 0)}</div>
                  <p className="text-xs text-muted-foreground">Total Views</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{article.title}</h3>
                          <Badge className={article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {article.status}
                          </Badge>
                          <Badge variant="outline">{article.visibility}</Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{article.summary}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>Category: {getCategoryName(article.category)}</span>
                          <span>Views: {article.views}</span>
                          <span>Likes: {article.likes}</span>
                          <span>Version: {article.version}</span>
                        </div>
                        
                        {article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {article.tags.map((tag, index) => (
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
                            <Button variant="outline" size="sm" onClick={() => openEditDialog(article)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteArticle(article.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredArticles.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No articles found matching your search.' : 'No articles found. Create your first article to get started.'}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                    {(user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner') || user?.userType === 'teacher') && (
                      <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                  <div className="text-xs text-gray-500">
                    {articles.filter(a => a.category === category.id).length} articles
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {categories.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No categories found. Create your first category to organize your articles.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Analytics dashboard showing article views, search queries, popular content, and user engagement metrics.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WikiModule;
