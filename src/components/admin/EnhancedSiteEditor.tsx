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
import { Plus, Edit, Trash2, Save, Eye, Settings, Palette, Layout, ArrowRight } from 'lucide-react';
import { themes, getThemeById, Theme } from '@/data/themes';
import sdk from '@/lib/sdk-config';

interface SiteContent {
  id: string;
  schoolId: string;
  pageType: string;
  sectionType: string;
  content: any;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt?: string;
}

const pageTypes = [
  { value: 'homepage', label: 'Homepage' },
  { value: 'about', label: 'About Us' },
  { value: 'programs', label: 'Programs' },
  { value: 'classes', label: 'Classes' },
  { value: 'admissions', label: 'Admissions' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'events', label: 'Events' },
  { value: 'blog', label: 'Blog' },
  { value: 'contact', label: 'Contact' },
  { value: 'custom', label: 'Custom Page' }
];

const sectionTypes = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'features', label: 'Features' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'gallery', label: 'Gallery Preview' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'stats', label: 'Quick Facts' },
  { value: 'programs', label: 'Programs Showcase' },
  { value: 'classes', label: 'Classes Showcase' },
  { value: 'events', label: 'Upcoming Events' },
  { value: 'blog', label: 'Latest Blog Posts' },
  { value: 'team', label: 'Meet Our Team' },
  { value: 'contact', label: 'Contact Information' }
];

const EnhancedSiteEditor = () => {
  const { school, updateSchool } = useSchool();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState<string>(school?.selectedTheme || 'modern-minimal');
  const [selectedPageType, setSelectedPageType] = useState('homepage');
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);
  const [showContentForm, setShowContentForm] = useState(false);

  const [contentForm, setContentForm] = useState({
    sectionType: '',
    content: {}
  });

  useEffect(() => {
    if (school) {
      fetchSiteContent();
    }
  }, [school, selectedPageType]);

  const fetchSiteContent = async () => {
    try {
      const allContent = await sdk.get<SiteContent>('site_content');
      const schoolContent = allContent.filter(content => 
        content.schoolId === school?.id && content.pageType === selectedPageType
      ).sort((a, b) => a.order - b.order);
      setSiteContent(schoolContent);
    } catch (error) {
      console.error('Failed to fetch site content:', error);
    }
  };

  const saveThemeSelection = async (themeId: string) => {
    setLoading(true);
    try {
      await updateSchool({ selectedTheme: themeId });
      setSelectedTheme(themeId);
      toast({
        title: 'Success',
        description: 'Theme updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update theme',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (contentData: Partial<SiteContent>) => {
    if (!school) return;

    setLoading(true);
    try {
      if (editingContent) {
        await sdk.update('site_content', editingContent.id, {
          ...contentData,
          updatedAt: new Date().toISOString()
        });
        toast({
          title: 'Success',
          description: 'Content updated successfully',
        });
      } else {
        await sdk.insert('site_content', {
          ...contentData,
          schoolId: school.id,
          pageType: selectedPageType,
          order: siteContent.length + 1,
          visible: true,
          createdAt: new Date().toISOString()
        });
        toast({
          title: 'Success',
          description: 'Content added successfully',
        });
      }
      
      fetchSiteContent();
      resetContentForm();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (contentId: string) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;

    try {
      await sdk.delete('site_content', contentId);
      toast({
        title: 'Success',
        description: 'Content deleted successfully',
      });
      fetchSiteContent();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete content',
        variant: 'destructive',
      });
    }
  };

  const resetContentForm = () => {
    setContentForm({
      sectionType: '',
      content: {}
    });
    setEditingContent(null);
    setShowContentForm(false);
  };

  const renderContentForm = () => {
    const sectionType = contentForm.sectionType;
    
    if (!sectionType) return null;

    return (
      <div className="space-y-4">
        {sectionType === 'hero' && (
          <>
            <div>
              <Label>Hero Title</Label>
              <Input
                value={contentForm.content.title || ''}
                onChange={(e) => setContentForm({
                  ...contentForm,
                  content: { ...contentForm.content, title: e.target.value }
                })}
                placeholder="Welcome to Our School"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={contentForm.content.subtitle || ''}
                onChange={(e) => setContentForm({
                  ...contentForm,
                  content: { ...contentForm.content, subtitle: e.target.value }
                })}
                placeholder="Excellence in Education"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={contentForm.content.description || ''}
                onChange={(e) => setContentForm({
                  ...contentForm,
                  content: { ...contentForm.content, description: e.target.value }
                })}
                placeholder="Provide quality education in a nurturing environment..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Primary Button Text</Label>
                <Input
                  value={contentForm.content.primaryButton || ''}
                  onChange={(e) => setContentForm({
                    ...contentForm,
                    content: { ...contentForm.content, primaryButton: e.target.value }
                  })}
                  placeholder="Learn More"
                />
              </div>
              <div>
                <Label>Primary Button Link</Label>
                <Input
                  value={contentForm.content.primaryLink || ''}
                  onChange={(e) => setContentForm({
                    ...contentForm,
                    content: { ...contentForm.content, primaryLink: e.target.value }
                  })}
                  placeholder="/about"
                />
              </div>
            </div>
          </>
        )}

        {sectionType === 'features' && (
          <>
            <div>
              <Label>Section Title</Label>
              <Input
                value={contentForm.content.title || ''}
                onChange={(e) => setContentForm({
                  ...contentForm,
                  content: { ...contentForm.content, title: e.target.value }
                })}
                placeholder="Why Choose Us"
              />
            </div>
            <div>
              <Label>Section Subtitle</Label>
              <Input
                value={contentForm.content.subtitle || ''}
                onChange={(e) => setContentForm({
                  ...contentForm,
                  content: { ...contentForm.content, subtitle: e.target.value }
                })}
                placeholder="Our Unique Advantages"
              />
            </div>
          </>
        )}

        {sectionType === 'cta' && (
          <>
            <div>
              <Label>CTA Title</Label>
              <Input
                value={contentForm.content.title || ''}
                onChange={(e) => setContentForm({
                  ...contentForm,
                  content: { ...contentForm.content, title: e.target.value }
                })}
                placeholder="Ready to Join Us?"
              />
            </div>
            <div>
              <Label>CTA Description</Label>
              <Textarea
                value={contentForm.content.description || ''}
                onChange={(e) => setContentForm({
                  ...contentForm,
                  content: { ...contentForm.content, description: e.target.value }
                })}
                placeholder="Take the first step towards your educational journey."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Button Text</Label>
                <Input
                  value={contentForm.content.buttonText || ''}
                  onChange={(e) => setContentForm({
                    ...contentForm,
                    content: { ...contentForm.content, buttonText: e.target.value }
                  })}
                  placeholder="Apply Now"
                />
              </div>
              <div>
                <Label>Button Link</Label>
                <Input
                  value={contentForm.content.buttonLink || ''}
                  onChange={(e) => setContentForm({
                    ...contentForm,
                    content: { ...contentForm.content, buttonLink: e.target.value }
                  })}
                  placeholder="/admissions"
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Website Editor</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowOnboarding(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Website Setup
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(`/${school?.slug}`, '_blank')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Site
          </Button>
        </div>
      </div>

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTheme === theme.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => saveThemeSelection(theme.id)}
              >
                <div className="aspect-video bg-gray-100 rounded mb-3 overflow-hidden">
                  <img
                    src={theme.previewImage}
                    alt={theme.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZmFmYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvbWluZyBTb29uPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                <h3 className="font-semibold">{theme.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
                {selectedTheme === theme.id && (
                  <Badge className="mt-2">Currently Active</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Page Content Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pageTypes.map((page) => (
                <Button
                  key={page.value}
                  variant={selectedPageType === page.value ? "default" : "ghost"}
                  className="w-full justify-start text-sm"
                  onClick={() => setSelectedPageType(page.value)}
                >
                  <Layout className="w-4 h-4 mr-2" />
                  {page.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Management */}
        <div className="lg:col-span-3 space-y-6">
          {/* Add Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                {pageTypes.find(p => p.value === selectedPageType)?.label} Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowContentForm(true)}
                className="mb-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>

              {showContentForm && (
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {editingContent ? 'Edit Section' : 'Add New Section'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Section Type</Label>
                        <Select
                          value={contentForm.sectionType}
                          onValueChange={(value) => setContentForm({
                            ...contentForm,
                            sectionType: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select section type" />
                          </SelectTrigger>
                          <SelectContent>
                            {sectionTypes.map((section) => (
                              <SelectItem key={section.value} value={section.value}>
                                {section.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {renderContentForm()}

                      <div className="flex gap-2">
                        <Button
                          onClick={() => saveContent({
                            sectionType: contentForm.sectionType,
                            content: contentForm.content
                          })}
                          disabled={loading || !contentForm.sectionType}
                        >
                          {loading ? 'Saving...' : editingContent ? 'Update Section' : 'Add Section'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={resetContentForm}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Existing Sections */}
              <div className="space-y-4">
                {siteContent.map((content) => (
                  <Card key={content.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold capitalize">
                              {content.sectionType} Section
                            </h4>
                            <Badge variant={content.visible ? 'default' : 'secondary'}>
                              {content.visible ? 'Visible' : 'Hidden'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {content.content.title || content.content.heading || 'No title'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingContent(content);
                              setContentForm({
                                sectionType: content.sectionType,
                                content: content.content
                              });
                              setShowContentForm(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteContent(content.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {siteContent.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">No sections yet</h3>
                    <p className="text-sm">Add your first section to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSiteEditor;
