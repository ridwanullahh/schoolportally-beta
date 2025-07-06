
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
import { Plus, Edit, Trash2, Save, Eye, Settings, ArrowUp, ArrowDown } from 'lucide-react';
import sdk from '@/lib/sdk-config';

interface Page {
  id: string;
  uid?: string;
  schoolId: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  sections: Section[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt?: string;
}

interface Section {
  id: string;
  type: string;
  styleId: string;
  content: any;
  settings: any;
  order: number;
  visible: boolean;
}

const SiteEditor = () => {
  const { school } = useSchool();
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [showSectionForm, setShowSectionForm] = useState(false);

  const sectionTypes = [
    { value: 'hero', label: 'Hero Section' },
    { value: 'features', label: 'Features' },
    { value: 'testimonials', label: 'Testimonials' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'blog', label: 'Latest Blog Posts' },
    { value: 'events', label: 'Upcoming Events' },
    { value: 'cta', label: 'Call to Action' },
    { value: 'text', label: 'Text Content' },
  ];

  const heroStyles = [
    { id: 'hero-1', name: 'Centered with Image' },
    { id: 'hero-2', name: 'Split Layout' },
    { id: 'hero-3', name: 'Video Background' },
    { id: 'hero-4', name: 'Minimal Text' },
    { id: 'hero-5', name: 'Cards Layout' },
  ];

  useEffect(() => {
    if (school) {
      fetchPages();
    }
  }, [school]);

  const fetchPages = async () => {
    try {
      const allPages = await sdk.get<Page>('pages');
      const schoolPages = allPages.filter(page => page.schoolId === school?.id);
      setPages(schoolPages);
      if (schoolPages.length > 0 && !selectedPage) {
        setSelectedPage(schoolPages[0]);
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    }
  };

  const savePage = async (pageData: Partial<Page>) => {
    if (!selectedPage || !school) return;

    setLoading(true);
    try {
      const updatedPage = await sdk.update('pages', selectedPage.id, {
        ...pageData,
        updatedAt: new Date().toISOString()
      });
      
      setSelectedPage(updatedPage);
      await fetchPages();
      
      toast({
        title: 'Success',
        description: 'Page saved successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save page',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addSection = async (sectionType: string) => {
    if (!selectedPage) return;

    const newSection: Section = {
      id: Date.now().toString(),
      type: sectionType,
      styleId: `${sectionType}-1`,
      content: getDefaultContent(sectionType),
      settings: {},
      order: selectedPage.sections.length + 1,
      visible: true
    };

    const updatedSections = [...selectedPage.sections, newSection];
    await savePage({ sections: updatedSections });
  };

  const updateSection = async (sectionId: string, updates: Partial<Section>) => {
    if (!selectedPage) return;

    const updatedSections = selectedPage.sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    );

    await savePage({ sections: updatedSections });
  };

  const deleteSection = async (sectionId: string) => {
    if (!selectedPage) return;
    if (!window.confirm('Are you sure you want to delete this section?')) return;

    const updatedSections = selectedPage.sections.filter(section => section.id !== sectionId);
    await savePage({ sections: updatedSections });
  };

  const moveSection = async (sectionId: string, direction: 'up' | 'down') => {
    if (!selectedPage) return;

    const sections = [...selectedPage.sections];
    const index = sections.findIndex(s => s.id === sectionId);
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < sections.length) {
      [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      sections.forEach((section, i) => {
        section.order = i + 1;
      });
      await savePage({ sections });
    }
  };

  const getDefaultContent = (sectionType: string) => {
    switch (sectionType) {
      case 'hero':
        return {
          title: 'Welcome to Our School',
          subtitle: 'Excellence in Education',
          description: 'We provide quality education in a nurturing environment.',
          primaryButton: 'Learn More',
          primaryLink: '/about',
          secondaryButton: 'Apply Now',
          secondaryLink: '/admissions',
          backgroundImage: ''
        };
      case 'features':
        return {
          title: 'Why Choose Us',
          subtitle: 'Our Unique Advantages',
          features: [
            { title: 'Quality Education', description: 'Top-notch curriculum and teaching', icon: 'book' },
            { title: 'Experienced Teachers', description: 'Qualified and dedicated staff', icon: 'users' },
            { title: 'Modern Facilities', description: 'State-of-the-art infrastructure', icon: 'building' }
          ]
        };
      case 'cta':
        return {
          title: 'Ready to Join Us?',
          description: 'Take the first step towards your educational journey.',
          buttonText: 'Apply Now',
          buttonLink: '/admissions',
          backgroundColor: '#4f46e5'
        };
      default:
        return {
          title: 'Section Title',
          content: 'Section content goes here.'
        };
    }
  };

  const renderSectionEditor = (section: Section) => {
    return (
      <Card key={section.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm capitalize">{section.type} Section</CardTitle>
              <Badge variant={section.visible ? 'default' : 'secondary'}>
                {section.visible ? 'Visible' : 'Hidden'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveSection(section.id, 'up')}
                disabled={section.order === 1}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveSection(section.id, 'down')}
                disabled={section.order === selectedPage?.sections.length}
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingSection(section);
                  setShowSectionForm(true);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateSection(section.id, { visible: !section.visible })}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteSection(section.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <Label>Style</Label>
              <Select 
                value={section.styleId} 
                onValueChange={(value) => updateSection(section.id, { styleId: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {heroStyles.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {section.type === 'hero' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={section.content.title || ''}
                    onChange={(e) => updateSection(section.id, {
                      content: { ...section.content, title: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={section.content.subtitle || ''}
                    onChange={(e) => updateSection(section.id, {
                      content: { ...section.content, subtitle: e.target.value }
                    })}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={section.content.description || ''}
                    onChange={(e) => updateSection(section.id, {
                      content: { ...section.content, description: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>Primary Button Text</Label>
                  <Input
                    value={section.content.primaryButton || ''}
                    onChange={(e) => updateSection(section.id, {
                      content: { ...section.content, primaryButton: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>Primary Button Link</Label>
                  <Input
                    value={section.content.primaryLink || ''}
                    onChange={(e) => updateSection(section.id, {
                      content: { ...section.content, primaryLink: e.target.value }
                    })}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Site Editor</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.open(`/${school?.slug}`, '_blank')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Site
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Pages List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pages.map((page) => (
                <Button
                  key={page.id}
                  variant={selectedPage?.id === page.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedPage(page)}
                >
                  {page.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Page Editor */}
        <div className="lg:col-span-3">
          {selectedPage ? (
            <div className="space-y-6">
              {/* Page Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Page Settings: {selectedPage.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>SEO Title</Label>
                      <Input
                        value={selectedPage.seoTitle || selectedPage.title}
                        onChange={(e) => savePage({ seoTitle: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>SEO Description</Label>
                      <Textarea
                        value={selectedPage.seoDescription || ''}
                        onChange={(e) => savePage({ seoDescription: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {sectionTypes.map((type) => (
                      <Button
                        key={type.value}
                        variant="outline"
                        size="sm"
                        onClick={() => addSection(type.value)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sections */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Page Sections</h3>
                {selectedPage.sections
                  .sort((a, b) => a.order - b.order)
                  .map(renderSectionEditor)}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Select a page to start editing</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteEditor;
