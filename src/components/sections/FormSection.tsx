import React, { useState, useEffect } from 'react';
import { Form, Section, SectionProps } from '@/types';
import sdk from '@/lib/sdk-config';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Added this import
import { FormField } from '@/types';
import '@/themes/styles/sections/all-remaining-ultra-modern.css';
import { useToast } from '@/hooks/use-toast';

const FormSection: React.FC<SectionProps> = ({ content, settings }) => {
  const { formId } = content;
  const styleId = (settings as Section).styleId || 'form-floating-glass';
  const [formData, setFormData] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissionData, setSubmissionData] = useState<Record<string, any>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchForm = async () => {
      if (!formId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const form = await sdk.getItem('forms', formId); // Using getItem as per SDK
        setFormData(form as Form);
      } catch (error) {
        console.error('Failed to fetch form:', error);
        setFormData(null);
        toast({
          title: 'Error',
          description: 'Failed to load form. Please check the form ID.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleInputChange = (fieldId: string, value: any) => {
    setSubmissionData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      await sdk.insert('form_submissions', {
        formId: formData.id,
        data: submissionData,
        submittedAt: new Date().toISOString(),
      });
      toast({
        title: 'Success',
        description: 'Form submitted successfully!',
      });
      setSubmissionData({}); // Clear form
    } catch (error) {
      console.error('Failed to submit form:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit form. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-16">Loading form...</div>;
  }

  if (!formData) {
    return <div className="text-center py-16 text-red-500">Form not found or invalid ID.</div>;
  }

  return (
    <section className={`form-section ${styleId}`}>
      <div className="container">
        <h2 className="section-title">{formData.title}</h2>
        <p className="section-description">{formData.description}</p>
        <div className="form-container">
          <div className="form-card">
            <form onSubmit={handleSubmit} className="form-content">
          {formData.fields.map(field => (
            <div key={field.id} className="form-group">
              <Label htmlFor={field.id}>{field.label}{field.required && <span className="text-red-500">*</span>}</Label>
              {field.type === 'text' || field.type === 'email' || field.type === 'number' ? (
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={submissionData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                />
              ) : field.type === 'textarea' ? (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  value={submissionData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <Select
                  value={submissionData[field.id] || ''}
                  onValueChange={(value) => handleInputChange(field.id, value)}
                  required={field.required}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={submissionData[field.id] || false}
                    onCheckedChange={(checked) => handleInputChange(field.id, checked)}
                    required={field.required}
                  />
                  <Label htmlFor={field.id}>{field.label}</Label>
                </div>
              ) : field.type === 'radio' ? (
                <RadioGroup
                  value={submissionData[field.id] || ''}
                  onValueChange={(value) => handleInputChange(field.id, value)}
                  required={field.required}
                >
                  {field.options?.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                      <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : null}
            </div>
          ))}
              <Button type="submit" className="w-full" disabled={loading}>
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormSection;