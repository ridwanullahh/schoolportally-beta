
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { buildSchoolUrl } from '@/utils/routing';
import { Check, AlertCircle, ExternalLink, Settings } from 'lucide-react';

interface OnboardingStepProps {
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  schoolData: any;
  setSchoolData: (data: any) => void;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  currentStep,
  onNext,
  onPrevious,
  onComplete,
  schoolData,
  setSchoolData
}) => {
  const { user } = useAuth();
  const { checkSlugAvailability } = useSchool();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSchoolData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
    
    // Auto-generate slug from school name
    if (name === 'name') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSchoolData((prev: any) => ({
        ...prev,
        slug,
      }));
      setSlugAvailable(null);
    }
  };

  const checkSlug = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugAvailable(null);
      return;
    }

    setCheckingSlug(true);
    try {
      const available = await checkSlugAvailability(slug);
      setSlugAvailable(available);
    } catch (error) {
      console.error('Error checking slug:', error);
      setSlugAvailable(null);
    } finally {
      setCheckingSlug(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (schoolData.slug) {
        checkSlug(schoolData.slug);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [schoolData.slug]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">🏫</span>
            </div>
            <h2 className="text-3xl font-bold">Welcome to SchoolPortal!</h2>
            <p className="text-gray-600 text-lg">
              Let's set up your school's digital presence in just a few steps.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-blue-800">
                <strong>Hello {user?.firstName || user?.email}!</strong> You're about to create 
                a comprehensive digital platform for your school.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">🌐 School Website</h4>
                <p className="text-gray-600">Beautiful, customizable website for your school</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">📊 Management Dashboard</h4>
                <p className="text-gray-600">Comprehensive admin and user dashboards</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">👥 User Management</h4>
                <p className="text-gray-600">Students, teachers, parents, and staff portals</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">School Information</h3>
              <p className="text-gray-600">Tell us about your school</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">School Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={schoolData.name}
                  onChange={handleChange}
                  placeholder="Enter your school name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <div className="relative">
                  <Input
                    id="slug"
                    name="slug"
                    value={schoolData.slug}
                    onChange={handleChange}
                    placeholder="your-school-name"
                    required
                    className={`pr-10 ${
                      slugAvailable === true ? 'border-green-500' : 
                      slugAvailable === false ? 'border-red-500' : ''
                    }`}
                  />
                  {checkingSlug && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  {!checkingSlug && slugAvailable === true && (
                    <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                  {!checkingSlug && slugAvailable === false && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500">
                    Your school will be accessible at: <strong>schoolportal.top/{schoolData.slug}</strong>
                  </p>
                  {slugAvailable === false && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      This URL is already taken. Please choose a different one.
                    </p>
                  )}
                  {slugAvailable === true && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      This URL is available!
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={schoolData.timezone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Africa/Lagos">Lagos</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    name="currency"
                    value={schoolData.currency}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="NGN">NGN (₦)</option>
                    <option value="CAD">CAD (C$)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Contact & Location</h3>
              <p className="text-gray-600">Help people find and contact your school</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">School Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={schoolData.address}
                  onChange={handleChange}
                  placeholder="Enter school address"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={schoolData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="email">School Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={schoolData.email}
                  onChange={handleChange}
                  placeholder="Enter school email"
                />
              </div>
              
              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  name="website"
                  value={schoolData.website}
                  onChange={handleChange}
                  placeholder="https://yourschool.com"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Brand Identity</h3>
              <p className="text-gray-600">Customize your school's visual identity</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="primaryColor"
                      name="primaryColor"
                      value={schoolData.branding?.primaryColor || '#4f46e5'}
                      onChange={(e) => setSchoolData((prev: any) => ({
                        ...prev,
                        branding: {
                          ...prev.branding,
                          primaryColor: e.target.value
                        }
                      }))}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={schoolData.branding?.primaryColor || '#4f46e5'}
                      onChange={(e) => setSchoolData((prev: any) => ({
                        ...prev,
                        branding: {
                          ...prev.branding,
                          primaryColor: e.target.value
                        }
                      }))}
                      placeholder="#4f46e5"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="secondaryColor"
                      name="secondaryColor"
                      value={schoolData.branding?.secondaryColor || '#06b6d4'}
                      onChange={(e) => setSchoolData((prev: any) => ({
                        ...prev,
                        branding: {
                          ...prev.branding,
                          secondaryColor: e.target.value
                        }
                      }))}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={schoolData.branding?.secondaryColor || '#06b6d4'}
                      onChange={(e) => setSchoolData((prev: any) => ({
                        ...prev,
                        branding: {
                          ...prev.branding,
                          secondaryColor: e.target.value
                        }
                      }))}
                      placeholder="#06b6d4"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="accentColor"
                      name="accentColor"
                      value={schoolData.branding?.accentColor || '#f59e0b'}
                      onChange={(e) => setSchoolData((prev: any) => ({
                        ...prev,
                        branding: {
                          ...prev.branding,
                          accentColor: e.target.value
                        }
                      }))}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={schoolData.branding?.accentColor || '#f59e0b'}
                      onChange={(e) => setSchoolData((prev: any) => ({
                        ...prev,
                        branding: {
                          ...prev.branding,
                          accentColor: e.target.value
                        }
                      }))}
                      placeholder="#f59e0b"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <select
                  id="fontFamily"
                  name="fontFamily"
                  value={schoolData.branding?.fontFamily || 'Inter'}
                  onChange={(e) => setSchoolData((prev: any) => ({
                    ...prev,
                    branding: {
                      ...prev.branding,
                      fontFamily: e.target.value
                    }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Inter">Inter</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Playfair Display">Playfair Display</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Review & Confirm</h3>
              <p className="text-gray-600">Please review your information before creating your school</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <strong>School Name:</strong> {schoolData.name}
              </div>
              <div>
                <strong>URL:</strong> schoolportal.top/{schoolData.slug}
                {slugAvailable === true && (
                  <span className="ml-2 text-green-600 text-sm">✓ Available</span>
                )}
              </div>
              <div>
                <strong>Address:</strong> {schoolData.address || 'Not provided'}
              </div>
              <div>
                <strong>Phone:</strong> {schoolData.phone || 'Not provided'}
              </div>
              <div>
                <strong>Email:</strong> {schoolData.email || 'Not provided'}
              </div>
              <div>
                <strong>Timezone:</strong> {schoolData.timezone}
              </div>
              <div>
                <strong>Currency:</strong> {schoolData.currency}
              </div>
              <div className="flex items-center gap-2">
                <strong>Brand Colors:</strong>
                <div className="flex gap-1">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: schoolData.branding?.primaryColor || '#4f46e5' }}
                  ></div>
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: schoolData.branding?.secondaryColor || '#06b6d4' }}
                  ></div>
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: schoolData.branding?.accentColor || '#f59e0b' }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3">What's included in your school portal:</h4>
              <ul className="text-sm text-green-700 space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Professional school website with customizable pages
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Admin dashboard for school management
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  User portals for students, teachers, and parents
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />  
                  Content management system
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  User registration and approval system
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return schoolData.name && schoolData.slug && slugAvailable === true;
      case 3:
        return true; // Contact info is optional
      case 4:
        return true; // Branding is optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {renderStepContent()}
      
      <div className="flex justify-between pt-6 border-t">
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
            disabled={!canProceed() || checkingSlug}
          >
            {checkingSlug ? 'Checking...' : 'Next'}
          </Button>
        ) : (
          <Button
            onClick={onComplete}
            disabled={loading || !canProceed()}
          >
            {loading ? 'Creating School...' : 'Create School'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingStep;
