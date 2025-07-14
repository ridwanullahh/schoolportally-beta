import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2, Save, Eye, Settings, ArrowUp, ArrowDown, Wand2, MoreVertical } from 'lucide-react';
import sdk from '@/lib/sdk-config';
import { Page, Section } from '@/types';
import { themes, Theme } from '@/themes/themeList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { defaultPages } from '@/data/defaultSiteStructure';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import SectionEditor from './SectionEditor';
import ThemeStyler from './ThemeStyler';

const SiteEditor = () => {
  const { school, setSchool } = useSchool();
  const { user } = useAuth();
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const [activeTab, setActiveTab] = useState('pages');
  const [isNewPageDialogOpen, setIsNewPageDialogOpen] = useState(false);
  const [newPageData, setNewPageData] = useState({ title: '', slug: '' });
  const [isAddSectionPanelOpen, setIsAddSectionPanelOpen] = useState(false);
  const [sectionSearchTerm, setSectionSearchTerm] = useState('');

  const [branding, setBranding] = useState(school?.branding || {});

  useEffect(() => {
    if (school) {
      fetchPages();
      setBranding(school.branding || {});
    }
  }, [school]);

  const fetchPages = async () => {
    if (!school) return;
    setLoading(true);
    try {
      const allPages = await sdk.get<Page>('pages');
      const schoolPages = allPages.filter(page => page.schoolId === school.id);
      setPages(schoolPages);
      if (schoolPages.length > 0 && !selectedPage) {
        setSelectedPage(schoolPages[0]);
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandingChange = (field: string, value: string) => {
    setBranding(prev => ({ ...prev, [field]: value }));
  };

  const saveBranding = async () => {
    if (!school) return;
    setLoading(true);
    try {
      await sdk.update('schools', school.id, { branding });
      if(setSchool) {
        setSchool(prevSchool => {
            if (!prevSchool) return null;
            return { ...prevSchool, branding };
        });
      }
      toast({
        title: 'Success',
        description: 'Branding settings saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save branding settings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const generateDefaultPages = async () => {
    if (!school) return;
    setLoading(true);
    try {
      for (const page of defaultPages) {
        await sdk.insert('pages', {
          ...page,
          schoolId: school.id,
          createdAt: new Date().toISOString(),
        });
      }
      toast({
        title: 'Success',
        description: 'Default pages have been generated.',
      });
      fetchPages();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate default pages.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async () => {
    if (!school || !newPageData.title || !newPageData.slug) {
        toast({ title: 'Error', description: 'Title and slug are required.', variant: 'destructive' });
        return;
    }
    setLoading(true);
    try {
        await sdk.insert('pages', {
            title: newPageData.title,
            slug: newPageData.slug,
            schoolId: school.id,
            type: 'custom',
            status: 'draft',
            sections: [],
            createdAt: new Date().toISOString(),
        });
        toast({ title: 'Success', description: 'Page created successfully.' });
        setIsNewPageDialogOpen(false);
        setNewPageData({ title: '', slug: '' });
        fetchPages();
    } catch (error) {
        toast({ title: 'Error', description: 'Failed to create page.', variant: 'destructive' });
    } finally {
        setLoading(false);
    }
  };

  const savePage = async (pageToSave: Page | null = selectedPage) => {
    if (!pageToSave || !isDirty) return;

    if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
    }

    setIsSaving(true);
    try {
      await sdk.update('pages', pageToSave.id, {
        title: pageToSave.title,
        slug: pageToSave.slug,
        status: pageToSave.status,
        showOnHeader: pageToSave.showOnHeader,
        showOnFooter: pageToSave.showOnFooter,
        sections: pageToSave.sections
      });
      toast({ title: 'Success', description: 'Page saved successfully.' });
      setIsDirty(false);
    } catch (error: any) {
      toast({
        title: 'Error Saving Page',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const triggerSave = (updatedPage: Page) => {
    setSelectedPage(updatedPage);
    setIsDirty(true);

    if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(() => {
        savePage(updatedPage);
    }, 30000);
  };

  const handleSectionUpdate = (sectionId: string, updates: Partial<Section>) => {
    if (!selectedPage) return;

    const updatedSections = selectedPage.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
    );

    triggerSave({ ...selectedPage, sections: updatedSections });
  };

  const addSectionToPage = async (sectionType: string) => {
    if (!selectedPage) return;

    const newSection: Section = {
        id: crypto.randomUUID(),
        type: sectionType,
        styleId: `${sectionType}-1`,
        content: {},
        settings: {},
        order: selectedPage.sections.length + 1,
        visible: true,
    };

    const updatedSections = [...selectedPage.sections, newSection];
    
    try {
        await sdk.update('pages', selectedPage.id, { sections: updatedSections });
        toast({ title: 'Success', description: 'Section added.' });
        fetchPages();
    } catch (error) {
        toast({ title: 'Error', description: 'Failed to add section.', variant: 'destructive' });
    }
  };

  const deleteSectionFromPage = async (sectionId: string) => {
    if (!selectedPage) return;

    const updatedSections = selectedPage.sections.filter(s => s.id !== sectionId);
    
    try {
        await sdk.update('pages', selectedPage.id, { sections: updatedSections });
        toast({ title: 'Success', description: 'Section deleted.' });
        fetchPages();
    } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete section.', variant: 'destructive' });
    }
  };

  const updatePageDetails = (updates: Partial<Page>) => {
    if (!selectedPage) return;
    triggerSave({ ...selectedPage, ...updates });
  };

  const deletePage = async (pageId: string) => {
    if (window.confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      setLoading(true);
      try {
        await sdk.delete('pages', pageId);
        toast({ title: 'Success', description: 'Page deleted successfully.' });
        setSelectedPage(null);
        fetchPages();
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete page.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
  };

  const renderGlobalSettings = () => (
    <Card>
      <CardHeader><CardTitle>Global Website Settings</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Website Theme</Label>
          <Select value={branding.theme || 'default'} onValueChange={(value) => handleBrandingChange('theme', value)}>
            <SelectTrigger><SelectValue placeholder="Select a theme" /></SelectTrigger>
            <SelectContent>
              {themes.map((theme: Theme) => (
                <SelectItem key={theme.name} value={theme.name}>{theme.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={saveBranding} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Branding'}
        </Button>
      </CardContent>
    </Card>
  );

  const availableSections = [
    { id: 'hero', name: 'Hero' },
    { id: 'quick_facts', name: 'Quick Facts' },
    { id: 'value_prop', name: 'Value Proposition' },
    { id: 'teaser', name: 'Teaser' },
    { id: 'features', name: 'Features' },
    { id: 'testimonials', name: 'Testimonials' },
    { id: 'events_snapshot', name: 'Events Snapshot' },
    { id: 'gallery_preview', name: 'Gallery Preview' },
    { id: 'blog_posts', name: 'Blog Posts' },
    { id: 'cta', name: 'Call to Action (CTA)' },
    { id: 'partners', name: 'Partners' },
    { id: 'mission_vision', name: 'Mission/Vision' },
    { id: 'history', name: 'History' },
    { id: 'leadership', name: 'Leadership' },
    { id: 'faculty', name: 'Faculty' },
    { id: 'classes', name: 'Classes' },
    { id: 'programs', name: 'Programs' },
    { id: 'courses', name: 'Courses' },
    { id: 'announcements', name: 'Announcements' },
    { id: 'library', name: 'Library' },
    { id: 'gallery', name: 'Gallery' },
    { id: 'knowledgebase', name: 'Knowledgebase' },
    { id: 'jobs', name: 'Jobs' },
    { id: 'faq', name: 'FAQ' },
    { id: 'academic_calendar', name: 'Academic Calendar' },
    { id: 'result_checker', name: 'Result Checker' },
    { id: 'form_embed', name: 'Form' },
    { id: 'products', name: 'Products' },
  ];

  const filteredSections = availableSections.filter(section =>
    section.name.toLowerCase().includes(sectionSearchTerm.toLowerCase())
  );

  const renderPagesContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader><CardTitle>Pages</CardTitle></CardHeader>
        <CardContent>
          <Dialog open={isNewPageDialogOpen} onOpenChange={setIsNewPageDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full mb-4"><Plus className="w-4 h-4 mr-2" /> Add Page</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create a New Page</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="page-title">Page Title</Label>
                  <Input id="page-title" value={newPageData.title} onChange={(e) => setNewPageData({...newPageData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} />
                </div>
                <div>
                  <Label htmlFor="page-slug">Page Slug</Label>
                  <Input id="page-slug" value={newPageData.slug} onChange={(e) => setNewPageData({...newPageData, slug: e.target.value})} />
                </div>
              </div>
              <Button onClick={handleCreatePage} disabled={loading}>{loading ? 'Creating...' : 'Create Page'}</Button>
            </DialogContent>
          </Dialog>
          <div className="space-y-2">
            {pages.map((page) => (
              <div key={page.id} className="flex items-center justify-between gap-2">
                <Button variant={selectedPage?.id === page.id ? "secondary" : "ghost"} className="flex-grow justify-start" onClick={() => setSelectedPage(page)}>
                  {page.title}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => deletePage(page.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="lg:col-span-3">
        {selectedPage ? (
          <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Editing: {selectedPage.title}</CardTitle>
                    <Button onClick={() => savePage()} disabled={isSaving || !isDirty}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : (isDirty ? 'Save Now' : 'Saved')}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="page-title-editor">Page Title</Label>
                        <Input id="page-title-editor" value={selectedPage.title} onChange={(e) => updatePageDetails({ title: e.target.value })} />
                    </div>
                     <div>
                        <Label htmlFor="page-slug-editor">Page Slug</Label>
                        <Input id="page-slug-editor" value={selectedPage.slug} onChange={(e) => updatePageDetails({ slug: e.target.value })} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="page-status" checked={selectedPage.status === 'published'} onCheckedChange={(checked) => updatePageDetails({ status: checked ? 'published' : 'draft' })} />
                        <Label htmlFor="page-status">Published</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Switch id="show-on-header" checked={selectedPage.showOnHeader} onCheckedChange={(checked) => updatePageDetails({ showOnHeader: checked })} />
                        <Label htmlFor="show-on-header">Show on Header</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Switch id="show-on-footer" checked={selectedPage.showOnFooter} onCheckedChange={(checked) => updatePageDetails({ showOnFooter: checked })} />
                        <Label htmlFor="show-on-footer">Show on Footer</Label>
                    </div>
                </CardContent>
            </Card>
            {selectedPage.sections.sort((a, b) => a.order - b.order).map((section, index) => (
              <SectionEditor
                key={section.id || `section-${section.type}-${index}`}
                section={section}
                onUpdate={handleSectionUpdate}
                onDelete={() => deleteSectionFromPage(section.id)}
              />
            ))}
          </div>
        ) : (
          <Card><CardContent className="text-center py-12"><p>Select a page to start editing.</p></CardContent></Card>
        )}
      </div>
      {selectedPage && (
        <>
          {/* Floating Action Buttons */}
          <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
            {(isDirty || isSaving) && (
              <Button size="lg" onClick={() => savePage()} disabled={isSaving || !isDirty} className="rounded-full shadow-lg">
                <Save className="w-6 h-6 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            )}
            <Button size="lg" onClick={() => setIsAddSectionPanelOpen(true)} className="rounded-full shadow-lg">
              <Plus className="w-6 h-6" />
            </Button>
          </div>

          {/* Add Section Panel */}
          <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white z-50 shadow-lg transform transition-transform ${isAddSectionPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Add Section</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsAddSectionPanelOpen(false)}>X</Button>
              </div>
              <div className="p-4">
                <Input
                  placeholder="Search sections..."
                  value={sectionSearchTerm}
                  onChange={(e) => setSectionSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-grow overflow-y-auto p-4 space-y-2">
                {filteredSections.map(section => (
                  <Button
                    key={section.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      addSectionToPage(section.id);
                      setIsAddSectionPanelOpen(false);
                    }}
                  >
                    {section.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          {isAddSectionPanelOpen && <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsAddSectionPanelOpen(false)} />}
        </>
      )}
    </div>
  );

  const renderOnboarding = () => (
    <Card>
      <CardHeader><CardTitle>Website Setup Onboarding</CardTitle></CardHeader>
      <CardContent className="text-center">
        <Wand2 className="h-12 w-12 mx-auto text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2">Generate Your Website Pages</h3>
        <p className="text-gray-600 mb-6">Create the default set of pages for your school website. You can customize them later.</p>
        <Button size="lg" onClick={generateDefaultPages} disabled={loading || pages.length > 0}>
          {loading ? 'Generating...' : 'Generate Default Pages'}
        </Button>
      </CardContent>
    </Card>
  );

  const isAdmin = user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner');
  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You do not have permission to view this page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Site Editor</h2>
        <Button variant="outline" onClick={() => window.open(`/${school?.slug}`, '_blank')}>
          <Eye className="w-4 h-4 mr-2" /> Preview Site
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="global">Global Settings</TabsTrigger>
          <TabsTrigger value="pages">Pages & Content</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>
        <TabsContent value="global" className="mt-4">{renderGlobalSettings()}</TabsContent>
        <TabsContent value="pages" className="mt-4">{renderPagesContent()}</TabsContent>
        <TabsContent value="onboarding" className="mt-4">{renderOnboarding()}</TabsContent>
        <TabsContent value="theme" className="mt-4"><ThemeStyler /></TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteEditor;
