
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OnboardingStepProps {
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  schoolData: any;
  setSchoolData: (data: any) => void;
  loading?: boolean;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  currentStep,
  onNext,
  onPrevious,
  onComplete,
  schoolData,
  setSchoolData,
  loading = false
}) => {
  const handleInputChange = (field: string, value: any) => {
    setSchoolData({
      ...schoolData,
      [field]: value
    });
  };

  const handleBrandingChange = (field: string, value: any) => {
    setSchoolData({
      ...schoolData,
      branding: {
        ...schoolData.branding,
        [field]: value
      }
    });
  };

  const createSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    handleInputChange('name', name);
    if (!schoolData.slug) {
      handleInputChange('slug', createSlugFromName(name));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Welcome to SchoolPortal!</h3>
              <p className="text-gray-600">
                Let's get your school set up with a professional digital presence. 
                This will take just a few minutes.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">What you'll get:</h4>
                <ul className="text-sm text-blue-700 text-left space-y-1">
                  <li>• Complete school website with customizable design</li>
                  <li>• Student and teacher management system</li>
                  <li>• Online admissions and fee collection</li>
                  <li>• Learning management system (LMS)</li>
                  <li>• Communication tools and announcements</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="schoolName">School Name *</Label>
                <Input
                  id="schoolName"
                  value={schoolData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter your school name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="schoolSlug">School URL Identifier *</Label>
                <Input
                  id="schoolSlug"
                  value={schoolData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="your-school-name"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your school will be available at: schoolportal.top/{schoolData.slug || 'your-school-name'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={schoolData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Asia/Dubai">Dubai</SelectItem>
                      <SelectItem value="Asia/Karachi">Karachi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={schoolData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="PKR">PKR (₨)</SelectItem>
                      <SelectItem value="AED">AED (د.إ)</SelectItem>
                      <SelectItem value="SAR">SAR (﷼)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">School Address</Label>
                <Textarea
                  id="address"
                  value={schoolData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your school's full address"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={schoolData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={schoolData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="info@yourschool.edu"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  value={schoolData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourschool.edu"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Brand Colors</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={schoolData.branding.primaryColor}
                      onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={schoolData.branding.primaryColor}
                      onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                      placeholder="#4f46e5"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={schoolData.branding.secondaryColor}
                      onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={schoolData.branding.secondaryColor}
                      onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                      placeholder="#06b6d4"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={schoolData.branding.accentColor}
                      onChange={(e) => handleBrandingChange('accentColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={schoolData.branding.accentColor}
                      onChange={(e) => handleBrandingChange('accentColor', e.target.value)}
                      placeholder="#f59e0b"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="logo">Logo URL (Optional)</Label>
                <Input
                  id="logo"
                  value={schoolData.branding.logo}
                  onChange={(e) => handleBrandingChange('logo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select 
                  value={schoolData.branding.fontFamily} 
                  onValueChange={(value) => handleBrandingChange('fontFamily', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold">Review Your School Setup</h3>
              <p className="text-gray-600">Please review the information below before creating your school.</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">School Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {schoolData.name}</div>
                  <div><strong>URL:</strong> schoolportal.top/{schoolData.slug}</div>
                  <div><strong>Timezone:</strong> {schoolData.timezone}</div>
                  <div><strong>Currency:</strong> {schoolData.currency}</div>
                </div>
              </div>
              
              {(schoolData.address || schoolData.phone || schoolData.email) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="text-sm space-y-1">
                    {schoolData.address && <div><strong>Address:</strong> {schoolData.address}</div>}
                    {schoolData.phone && <div><strong>Phone:</strong> {schoolData.phone}</div>}
                    {schoolData.email && <div><strong>Email:</strong> {schoolData.email}</div>}
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Brand Colors</h4>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: schoolData.branding.primaryColor }}
                    ></div>
                    <span className="text-sm">Primary</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: schoolData.branding.secondaryColor }}
                    ></div>
                    <span className="text-sm">Secondary</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: schoolData.branding.accentColor }}
                    ></div>
                    <span className="text-sm">Accent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {renderStep()}
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        {currentStep < 5 ? (
          <Button
            onClick={onNext}
            disabled={
              (currentStep === 2 && (!schoolData.name || !schoolData.slug)) ||
              loading
            }
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={onComplete}
            disabled={!schoolData.name || !schoolData.slug || loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Creating School...' : 'Create My School'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingStep;
