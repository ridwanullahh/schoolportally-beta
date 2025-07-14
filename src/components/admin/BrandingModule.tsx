import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ColorWheelIcon } from '@radix-ui/react-icons';

const BrandingModule = () => {
  const { school, updateSchool, loading } = useSchool();
  const { toast } = useToast();
  const [branding, setBranding] = useState(school?.branding || {});

  useEffect(() => {
    if (school) {
      setBranding(school.branding || {});
    }
  }, [school]);

  const handleBrandingChange = (field: string, value: string) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ColorWheelIcon className="w-6 h-6 mr-2" />
          Brand Identity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <Input
              id="primaryColor"
              type="color"
              value={branding.primaryColor || '#000000'}
              onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
              className="w-24 h-12 p-1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <Input
              id="secondaryColor"
              type="color"
              value={branding.secondaryColor || '#000000'}
              onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
              className="w-24 h-12 p-1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <Input
              id="accentColor"
              type="color"
              value={branding.accentColor || '#000000'}
              onChange={(e) => handleBrandingChange('accentColor', e.target.value)}
              className="w-24 h-12 p-1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fontFamily">Font Family</Label>
            <Input
              id="fontFamily"
              type="text"
              value={branding.fontFamily || ''}
              onChange={(e) => handleBrandingChange('fontFamily', e.target.value)}
              placeholder="e.g., 'Roboto', sans-serif"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSaveBranding} disabled={loading}>
            {loading ? 'Saving...' : 'Save Branding'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandingModule;