import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import sdk from '@/lib/sdk-config';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormSectionEditorProps {
  section: Section;
  onUpdate: (sectionId: string, updates: Partial<Section>) => void;
}

interface Form {
  id: string;
  title: string;
}

const FormSectionEditor: React.FC<FormSectionEditorProps> = ({ section, onUpdate }) => {
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    sdk.get<Form>('forms').then(setForms);
  }, []);

  const handleFormChange = (formId: string) => {
    onUpdate(section.id, { content: { ...section.content, formId } });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Select Form</Label>
        <Select value={section.content.formId || ''} onValueChange={handleFormChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a form" />
          </SelectTrigger>
          <SelectContent>
            {forms.map(form => (
              <SelectItem key={form.id} value={form.id}>
                {form.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FormSectionEditor;