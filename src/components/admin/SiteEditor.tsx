import React, { useState } from 'react';
import { usePages } from '@/hooks/usePages';
import { useSchool } from '@/contexts/SchoolContext';
import { Page, PageSection } from '@/types';
import { getStylesByCategory, allSectionStyles } from '@/data/sectionStyles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Eye, Move, Settings } from 'lucide-react';

const SiteEditor: React.FC = () => {
  const { school } = useSchool();
  const { pages, createPage, updatePage, deletePage, updatePageSections } = usePages();
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [isPageDialogOpen, setIsPageDialogOpen] = useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);

  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    type: 'custom' as Page['type'],
  });

  const [sectionForm, setSectionForm] = useState({
    type: 'hero',
    styleId: '',
    content: {} as any,
  });

  const handleCreatePage = async () => {
    if (!school) return;
    
    try {
      await createPage({
        ...pageForm,
        schoolId: school.id,
        sections: [],
        status: 'published',
      });
      setPageForm({ title: '', slug: '', type: 'custom' });
      setIsPageDialogOpen(false);
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };

  const handleAddSection = async () => {
    if (!selectedPage) return;

    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type: sectionForm.type as any,
      styleId: sectionForm.styleId,
      content: sectionForm.content,
      settings: {},
      order: selectedPage.sections?.length || 0,
      visible: true,
    };

    const updatedSections = [...(selectedPage.sections || []), newSection];
    await updatePageSections(selectedPage.id, updatedSections);
    setSelectedPage({ ...selectedPage, sections: updatedSections });
    setSectionForm({ type: 'hero', styleId: '', content: {} });
    setIsSectionDialogOpen(false);
  };

  const handleUpdateSection = async () => {
    if (!selectedPage || !editingSection) return;

    const updatedSections = selectedPage.sections?.map(section =>
      section.id === editingSection.id
        ? { ...section, content: sectionForm.content }
        : section
    ) || [];

    await updatePageSections(selectedPage.id, updatedSections);
    setSelectedPage({ ...selectedPage, sections: updatedSections });
    setEditingSection(null);
    setIsSectionDialogOpen(false);
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!selectedPage) return;

    const updatedSections = selectedPage.sections?.filter(section => section.id !== sectionId) || [];
    await updatePageSections(selectedPage.id, updatedSections);
    setSelectedPage({ ...selectedPage, sections: updatedSections });
  };

  const openSectionEditor = (section: PageSection) => {
    setEditingSection(section);
    setSectionForm({
      type: section.type,
      styleId: section.styleId,
      content: section.content,
    });
    setIsSectionDialogOpen(true);
  };

  const sectionTypeOptions = Object.keys(allSectionStyles);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Site Editor</h2>
        <Dialog open={isPageDialogOpen} onOpenChange={setIsPageDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Page</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Page Title</label>
                <Input
                  value={pageForm.title}
                  onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                  placeholder="Enter page title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Page Slug</label>
                <Input
                  value={pageForm.slug}
                  onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                  placeholder="enter-page-slug"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Page Type</label>
                <Select value={pageForm.type} onValueChange={(value) => setPageForm({ ...pageForm, type: value as Page['type'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Page</SelectItem>
                    <SelectItem value="homepage">Homepage</SelectItem>
                    <SelectItem value="about">About</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="programs">Programs</SelectItem>
                    <SelectItem value="classes">Classes</SelectItem>
                    <SelectItem value="admissions">Admissions</SelectItem>
                    <SelectItem value="gallery">Gallery</SelectItem>
                    <SelectItem value="calendar">Calendar</SelectItem>
                    <SelectItem value="faq">FAQ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreatePage}>Create Page</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pages List */}
        <Card>
          <CardHeader>
            <CardTitle>Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPage?.id === page.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedPage(page)}
                >
                  <div className="font-medium">{page.title}</div>
                  <div className="text-sm text-gray-500">/{page.slug}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Page Editor */}
        {selectedPage && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Editing: {selectedPage.title}</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Section
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingSection ? 'Edit Section' : 'Add New Section'}
                        </DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="type" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="type">Type & Style</TabsTrigger>
                          <TabsTrigger value="content">Content</TabsTrigger>
                          <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="type" className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Section Type</label>
                            <Select 
                              value={sectionForm.type} 
                              onValueChange={(value) => setSectionForm({ ...sectionForm, type: value, styleId: '' })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {sectionTypeOptions.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {sectionForm.type && (
                            <div>
                              <label className="block text-sm font-medium mb-2">Style</label>
                              <Select 
                                value={sectionForm.styleId} 
                                onValueChange={(value) => setSectionForm({ ...sectionForm, styleId: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a style" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getStylesByCategory(sectionForm.type).map((style) => (
                                    <SelectItem key={style.id} value={style.id}>
                                      {style.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="content" className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Title</label>
                            <Input
                              value={sectionForm.content.title || ''}
                              onChange={(e) => setSectionForm({
                                ...sectionForm,
                                content: { ...sectionForm.content, title: e.target.value }
                              })}
                              placeholder="Section title"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Subtitle</label>
                            <Input
                              value={sectionForm.content.subtitle || ''}
                              onChange={(e) => setSectionForm({
                                ...sectionForm,
                                content: { ...sectionForm.content, subtitle: e.target.value }
                              })}
                              placeholder="Section subtitle"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <Textarea
                              value={sectionForm.content.description || ''}
                              onChange={(e) => setSectionForm({
                                ...sectionForm,
                                content: { ...sectionForm.content, description: e.target.value }
                              })}
                              placeholder="Section description"
                              rows={4}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Primary Button Text</label>
                            <Input
                              value={sectionForm.content.primaryButton || ''}
                              onChange={(e) => setSectionForm({
                                ...sectionForm,
                                content: { ...sectionForm.content, primaryButton: e.target.value }
                              })}
                              placeholder="Button text"
                            />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="settings">
                          <div className="text-sm text-gray-500">
                            Additional settings will be available here.
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsSectionDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={editingSection ? handleUpdateSection : handleAddSection}>
                          {editingSection ? 'Update Section' : 'Add Section'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedPage.sections?.map((section, index) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="font-medium">
                          {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                        </div>
                        <div className="text-sm text-gray-500">
                          Style: {section.styleId}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openSectionEditor(section)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Move className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteSection(section.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {section.content.title && <div>Title: {section.content.title}</div>}
                      {section.content.description && (
                        <div className="truncate">Description: {section.content.description}</div>
                      )}
                    </div>
                  </div>
                ))}
                
                {(!selectedPage.sections || selectedPage.sections.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    No sections added yet. Click "Add Section" to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SiteEditor;
