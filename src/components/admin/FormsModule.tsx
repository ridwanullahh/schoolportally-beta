import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Form, FormField } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Eye, Share, Code, FileText, BarChart3 } from 'lucide-react';

const FormsModule: React.FC = () => {
  const { school } = useSchool();
  const { user } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('forms');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    fields: [] as FormField[],
    settings: {
      allowMultipleSubmissions: false,
      requireLogin: false,
      showProgressBar: true,
      customTheme: {},
      notifications: {
        email: true,
        sms: false,
        webhook: '',
      },
    },
  });

  const [newField, setNewField] = useState({
    type: 'text',
    label: '',
    placeholder: '',
    required: false,
    options: '',
  });

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'file', label: 'File Upload' },
  ];

  useEffect(() => {
    fetchForms();
  }, [school]);

  const fetchForms = async () => {
    if (!school) return;

    setLoading(true);
    try {
      const allForms = await sdk.get<Form>('forms');
      const schoolForms = allForms.filter(form => form.schoolId === school.id);
      setForms(schoolForms);
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const generateShareUrl = (slug: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${school?.slug}/forms/${slug}`;
  };

  const handleCreateForm = async () => {
    if (!school) return;

    try {
      const slug = generateSlug(formData.title);
      const newForm = await sdk.insert<Form>('forms', {
        ...formData,
        slug,
        schoolId: school.id,
        submissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin',
        shareUrl: generateShareUrl(slug),
        analytics: {
          views: 0,
          submissions: 0,
          conversionRate: 0,
        },
      });

      setForms([...forms, newForm]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating form:', error);
    }
  };

  const handleUpdateForm = async () => {
    if (!selectedForm) return;

    try {
      const updatedForm = await sdk.update<Form>('forms', selectedForm.id, {
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      setForms(forms.map(form => 
        form.id === selectedForm.id ? updatedForm : form
      ));
      resetForm();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedForm(null);
    } catch (error) {
      console.error('Error updating form:', error);
    }
  };

  const handleDeleteForm = async (formId: string) => {
    try {
      await sdk.delete('forms', formId);
      setForms(forms.filter(form => form.id !== formId));
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'draft',
      fields: [],
      settings: {
        allowMultipleSubmissions: false,
        requireLogin: false,
        showProgressBar: true,
        customTheme: {},
        notifications: {
          email: true,
          sms: false,
          webhook: '',
        },
      },
    });
    setNewField({
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
      options: '',
    });
  };

  const addField = () => {
    if (!newField.label) return;

    const field: FormField = {
      id: `field-${Date.now()}`,
      type: newField.type,
      label: newField.label,
      placeholder: newField.placeholder,
      required: newField.required,
      options: newField.options ? newField.options.split('\n').filter(Boolean) : undefined,
    };

    setFormData({
      ...formData,
      fields: [...formData.fields, field],
    });

    setNewField({
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
      options: '',
    });
  };

  const removeField = (fieldId: string) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter(field => field.id !== fieldId),
    });
  };

  const openEditDialog = (form: Form) => {
    setSelectedForm(form);
    setFormData({
      title: form.title,
      description: form.description,
      status: form.status,
      fields: form.fields,
      settings: form.settings,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const isAdmin = user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner');
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Forms Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {isAdmin && (
            <DialogTrigger asChild>
              <Button onClick={() => { setIsEditing(false); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                New Form
              </Button>
            </DialogTrigger>
          )}
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Form' : 'Create New Form'}</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="basic">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="fields">Form Fields</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Form Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter form title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Form description"
                    rows={3}
                  />
                </div>
                <div>
                 <label className="block text-sm font-medium mb-2">Status</label>
                 <Select
                   value={formData.status}
                   onValueChange={(value) => setFormData({ ...formData, status: value })}
                 >
                   <SelectTrigger>
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="draft">Draft</SelectItem>
                     <SelectItem value="published">Published</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </TabsContent>
              
              <TabsContent value="fields" className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-4">Add New Field</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Field Type</label>
                      <Select value={newField.type} onValueChange={(value) => setNewField({ ...newField, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Field Label</label>
                      <Input
                        value={newField.label}
                        onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                        placeholder="Field label"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Placeholder</label>
                      <Input
                        value={newField.placeholder}
                        onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                        placeholder="Placeholder text"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-8">
                      <Checkbox
                        checked={newField.required}
                        onCheckedChange={(checked) => setNewField({ ...newField, required: !!checked })}
                      />
                      <label className="text-sm">Required field</label>
                    </div>
                    
                    {['select', 'radio', 'checkbox'].includes(newField.type) && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">Options (one per line)</label>
                        <Textarea
                          value={newField.options}
                          onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                  
                  <Button onClick={addField} size="sm">Add Field</Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Form Fields</h4>
                  {formData.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{field.label}</span>
                        <span className="text-sm text-gray-500 ml-2">({field.type})</span>
                        {field.required && <Badge variant="outline" className="ml-2">Required</Badge>}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => removeField(field.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {formData.fields.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No fields added yet. Add your first field above.
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.settings.allowMultipleSubmissions}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, allowMultipleSubmissions: !!checked }
                      })}
                    />
                    <label className="text-sm">Allow multiple submissions</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.settings.requireLogin}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, requireLogin: !!checked }
                      })}
                    />
                    <label className="text-sm">Require login to submit</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.settings.showProgressBar}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, showProgressBar: !!checked }
                      })}
                    />
                    <label className="text-sm">Show progress bar</label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Webhook URL</label>
                    <Input
                      value={formData.settings.notifications.webhook}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          notifications: { ...formData.settings.notifications, webhook: e.target.value }
                        }
                      })}
                      placeholder="https://your-webhook-url.com"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateForm : handleCreateForm}>
                {isEditing ? 'Update Form' : 'Create Form'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="forms">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold">{forms.length}</div>
                    <p className="text-xs text-muted-foreground">Total Forms</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{forms.filter(f => f.status === 'published').length}</div>
                <p className="text-xs text-muted-foreground">Published</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{forms.reduce((acc, f) => acc + f.analytics.submissions, 0)}</div>
                <p className="text-xs text-muted-foreground">Total Submissions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{forms.reduce((acc, f) => acc + f.analytics.views, 0)}</div>
                <p className="text-xs text-muted-foreground">Total Views</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card key={form.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{form.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={form.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {form.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(form.shareUrl)}>
                        <Share className="w-4 h-4" />
                      </Button>
                      {isAdmin && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(form)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteForm(form.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{form.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fields:</span>
                      <span>{form.fields.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Submissions:</span>
                      <span>{form.analytics.submissions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Views:</span>
                      <span>{form.analytics.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Conversion:</span>
                      <span>{form.analytics.conversionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-xs text-gray-500">
                      Created: {new Date(form.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {forms.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No forms found. Create your first form to get started.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Form Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Form submissions interface will display all submitted form data here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Forms Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Analytics dashboard showing form performance, conversion rates, and submission trends.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormsModule;
