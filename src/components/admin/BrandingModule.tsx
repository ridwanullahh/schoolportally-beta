import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ColorWheelIcon } from '@radix-ui/react-icons';
import { Branding } from '@/types';
import FontSelector from './FontSelector';

const BrandingModule = () => {
  const { school, updateSchool, loading } = useSchool();
  const { toast } = useToast();
  const [branding, setBranding] = useState<Branding>(school?.branding || {
    primaryColor: '#2d7d32',
    secondaryColor: '#4caf50',
    accentColor: '#81c784',
    primaryBackgroundColor: '#f8fffe',
    secondaryBackgroundColor: '#e8f5e8',
    lightBackgroundColor: '#ffffff',
    darkBackgroundColor: '#1a1a1a',
    primaryTextColor: '#1f2937',
    secondaryTextColor: '#6b7280',
    lightTextColor: '#ffffff',
    darkTextColor: '#000000',
    primaryButtonColor: '#2d7d32',
    secondaryButtonColor: '#4caf50',
    primaryButtonTextColor: '#ffffff',
    secondaryButtonTextColor: '#ffffff',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
    infoColor: '#3b82f6',
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFontFamily: 'Inter, system-ui, sans-serif'
  });

  useEffect(() => {
    if (school?.branding) {
      setBranding(prev => ({ ...prev, ...school.branding }));
    }
  }, [school]);

  const handleBrandingChange = (field: keyof Branding, value: string) => {
    setBranding(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveBranding = async () => {
    try {
      await updateSchool({ branding });
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
    }
  };

  const ColorInput = ({ label, field, value }: { label: string; field: keyof Branding; value: string }) => (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <div className="flex items-center space-x-2">
        <Input
          id={field}
          type="color"
          value={value || '#000000'}
          onChange={(e) => handleBrandingChange(field, e.target.value)}
          className="w-16 h-10 p-1 border rounded"
        />
        <Input
          value={value || ''}
          onChange={(e) => handleBrandingChange(field, e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ColorWheelIcon className="w-6 h-6 mr-2" />
          Brand Identity & Color Palette
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="core-colors" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="core-colors">Core Colors</TabsTrigger>
            <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
            <TabsTrigger value="text-colors">Text Colors</TabsTrigger>
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
          </TabsList>

          <TabsContent value="core-colors" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorInput
                label="Primary Color"
                field="primaryColor"
                value={branding.primaryColor || '#2d7d32'}
              />
              <ColorInput
                label="Secondary Color"
                field="secondaryColor"
                value={branding.secondaryColor || '#4caf50'}
              />
              <ColorInput
                label="Accent Color"
                field="accentColor"
                value={branding.accentColor || '#81c784'}
              />
              <div className="grid grid-cols-2 gap-2">
                <ColorInput
                  label="Success"
                  field="successColor"
                  value={branding.successColor || '#10b981'}
                />
                <ColorInput
                  label="Warning"
                  field="warningColor"
                  value={branding.warningColor || '#f59e0b'}
                />
                <ColorInput
                  label="Error"
                  field="errorColor"
                  value={branding.errorColor || '#ef4444'}
                />
                <ColorInput
                  label="Info"
                  field="infoColor"
                  value={branding.infoColor || '#3b82f6'}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="backgrounds" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorInput
                label="Primary Background"
                field="primaryBackgroundColor"
                value={branding.primaryBackgroundColor || '#f8fffe'}
              />
              <ColorInput
                label="Secondary Background"
                field="secondaryBackgroundColor"
                value={branding.secondaryBackgroundColor || '#e8f5e8'}
              />
              <ColorInput
                label="Light Background"
                field="lightBackgroundColor"
                value={branding.lightBackgroundColor || '#ffffff'}
              />
              <ColorInput
                label="Dark Background"
                field="darkBackgroundColor"
                value={branding.darkBackgroundColor || '#1a1a1a'}
              />
            </div>
          </TabsContent>

          <TabsContent value="text-colors" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorInput
                label="Primary Text"
                field="primaryTextColor"
                value={branding.primaryTextColor || '#1f2937'}
              />
              <ColorInput
                label="Secondary Text"
                field="secondaryTextColor"
                value={branding.secondaryTextColor || '#6b7280'}
              />
              <ColorInput
                label="Light Text"
                field="lightTextColor"
                value={branding.lightTextColor || '#ffffff'}
              />
              <ColorInput
                label="Dark Text"
                field="darkTextColor"
                value={branding.darkTextColor || '#000000'}
              />
            </div>
          </TabsContent>

          <TabsContent value="buttons" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorInput
                label="Primary Button"
                field="primaryButtonColor"
                value={branding.primaryButtonColor || '#2d7d32'}
              />
              <ColorInput
                label="Primary Button Text"
                field="primaryButtonTextColor"
                value={branding.primaryButtonTextColor || '#ffffff'}
              />
              <ColorInput
                label="Secondary Button"
                field="secondaryButtonColor"
                value={branding.secondaryButtonColor || '#4caf50'}
              />
              <ColorInput
                label="Secondary Button Text"
                field="secondaryButtonTextColor"
                value={branding.secondaryButtonTextColor || '#ffffff'}
              />
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4">
            {/* Advanced Font Selection System */}
            <FontSelector onFontChange={(fontId, target) => {
              // Font changes are handled automatically by the FontSelector
              // and integrated with the school branding system
            }} />

            {/* Legacy Font Settings */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Legacy Font Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Body Font Family (Legacy)</Label>
                    <Input
                      id="fontFamily"
                      type="text"
                      value={branding.fontFamily || 'Inter, system-ui, sans-serif'}
                      onChange={(e) => handleBrandingChange('fontFamily', e.target.value)}
                      placeholder="e.g., 'Inter', sans-serif"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headingFontFamily">Heading Font Family (Legacy)</Label>
                    <Input
                      id="headingFontFamily"
                      type="text"
                      value={branding.headingFontFamily || 'Inter, system-ui, sans-serif'}
                      onChange={(e) => handleBrandingChange('headingFontFamily', e.target.value)}
                      placeholder="e.g., 'Inter', sans-serif"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logo and Favicon Settings */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Logo & Favicon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      type="url"
                      value={branding.logoUrl || ''}
                      onChange={(e) => handleBrandingChange('logoUrl', e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faviconUrl">Favicon URL</Label>
                    <Input
                      id="faviconUrl"
                      type="url"
                      value={branding.faviconUrl || ''}
                      onChange={(e) => handleBrandingChange('faviconUrl', e.target.value)}
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSaveBranding} disabled={loading} size="lg">
            {loading ? 'Saving...' : 'Save Brand Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandingModule;