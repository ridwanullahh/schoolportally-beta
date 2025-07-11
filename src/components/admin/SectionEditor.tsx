import React from 'react';
import { Section } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sectionStyles } from '@/data/section-styles';
import FormSectionEditor from './editors/FormSectionEditor';

interface SectionEditorProps {
  section: Section;
  onUpdate: (sectionId: string, updates: Partial<Section>) => void;
  onDelete: (sectionId: string) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, onUpdate, onDelete }) => {
  const handleContentChange = (field: string, value: any) => {
    onUpdate(section.id, { content: { ...section.content, [field]: value } });
  };

  const handleStyleChange = (styleId: string) => {
    onUpdate(section.id, { styleId });
  };

  const handleRepeaterChange = (repeaterField: string, index: number, itemField: string, value: any) => {
    const updatedItems = [...(section.content[repeaterField] || [])];
    updatedItems[index] = { ...updatedItems[index], [itemField]: value };
    handleContentChange(repeaterField, updatedItems);
  };

  const addRepeaterItem = (repeaterField: string, newItem: any) => {
    const updatedItems = [...(section.content[repeaterField] || []), newItem];
    handleContentChange(repeaterField, updatedItems);
  };

  const removeRepeaterItem = (repeaterField: string, index: number) => {
    const updatedItems = (section.content[repeaterField] || []).filter((_: any, i: number) => i !== index);
    handleContentChange(repeaterField, updatedItems);
  };

  const renderFields = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label>Headline</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <div>
              <Label>Subtext</Label>
              <Input value={section.content.subtitle || ''} onChange={(e) => handleContentChange('subtitle', e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={section.content.description || ''} onChange={(e) => handleContentChange('description', e.target.value)} />
            </div>
            <div>
              <Label>Primary Button Text</Label>
              <Input value={section.content.primaryButton || ''} onChange={(e) => handleContentChange('primaryButton', e.target.value)} />
            </div>
            <div>
              <Label>Primary Button Link</Label>
              <Input value={section.content.primaryLink || ''} onChange={(e) => handleContentChange('primaryLink', e.target.value)} />
            </div>
            <div>
              <Label>Secondary Button Text</Label>
              <Input value={section.content.secondaryButton || ''} onChange={(e) => handleContentChange('secondaryButton', e.target.value)} />
            </div>
            <div>
              <Label>Secondary Button Link</Label>
              <Input value={section.content.secondaryLink || ''} onChange={(e) => handleContentChange('secondaryLink', e.target.value)} />
            </div>
            <div>
              <Label>Background Image URL</Label>
              <Input value={section.content.backgroundImage || ''} onChange={(e) => handleContentChange('backgroundImage', e.target.value)} />
            </div>
          </div>
        );
      case 'features':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Features</Label>
            {(section.content.features || []).map((feature: any, index: number) => (
              <div key={`feature-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Feature Title" value={feature.title} onChange={(e) => handleRepeaterChange('features', index, 'title', e.target.value)} />
                  <Textarea placeholder="Feature Description" value={feature.description} onChange={(e) => handleRepeaterChange('features', index, 'description', e.target.value)} />
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('features', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('features', { title: '', description: '' })}><Plus className="w-4 h-4 mr-2" />Add Feature</Button>
          </div>
        );
      case 'testimonials':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Testimonials</Label>
            {(section.content.testimonials || []).map((testimonial: any, index: number) => (
              <div key={`testimonial-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Author Name" value={testimonial.author} onChange={(e) => handleRepeaterChange('testimonials', index, 'author', e.target.value)} />
                  <Textarea placeholder="Testimonial Text" value={testimonial.text} onChange={(e) => handleRepeaterChange('testimonials', index, 'text', e.target.value)} />
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('testimonials', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('testimonials', { author: '', text: '' })}><Plus className="w-4 h-4 mr-2" />Add Testimonial</Button>
          </div>
        );
      case 'cta':
         return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={section.content.description || ''} onChange={(e) => handleContentChange('description', e.target.value)} />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input value={section.content.buttonText || ''} onChange={(e) => handleContentChange('buttonText', e.target.value)} />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input value={section.content.buttonLink || ''} onChange={(e) => handleContentChange('buttonLink', e.target.value)} />
            </div>
          </div>
        );
      case 'form_embed':
        return <FormSectionEditor section={section} onUpdate={onUpdate} />;
      default:
        return <p>This section type has no specific editor fields.</p>;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="capitalize">{section.type.replace('_', ' ')} Section</CardTitle>
        <Button variant="destructive" size="sm" onClick={() => onDelete(section.id)}>
          <Trash2 className="w-4 h-4 mr-2" /> Delete Section
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Section Style</Label>
            <Select value={section.styleId} onValueChange={handleStyleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>
              <SelectContent>
                {(sectionStyles[section.type] || []).map(style => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {renderFields()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionEditor;