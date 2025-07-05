import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/hooks/useSchool';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { buildSchoolUrl } from '@/utils/routing';

const Onboarding = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { createSchool } = useSchool();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [schoolData, setSchoolData] = useState({
    name: '',
    slug: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    timezone: 'UTC',
    currency: 'USD',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSchoolData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Auto-generate slug from school name
    if (name === 'name') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSchoolData(prev => ({
        ...prev,
        slug,
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Include all required properties for School
      const completeSchoolData = {
        ...schoolData,
        ownerId: user?.id || '',
        status: 'active',
        subscriptionPlan: 'standard',
        subscriptionStatus: 'trial',
      };
      
      const newSchool = await createSchool(completeSchoolData);
      toast({
        title: 'Success!',
        description: 'Your school has been created successfully.',
      });
      
      // Redirect to school dashboard
      window.location.href = buildSchoolUrl(newSchool.slug, '/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create school',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">Please sign in to continue with onboarding.</p>
            <Button onClick={() => window.location.href = '/login'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step {currentStep} of 4</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {currentStep === 1 && "Welcome to SchoolPortal!"}
              {currentStep === 2 && "School Information"}
              {currentStep === 3 && "Contact Details"}
              {currentStep === 4 && "Review & Create"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">🏫</span>
                </div>
                <h2 className="text-2xl font-bold">Let's set up your school</h2>
                <p className="text-gray-600">
                  We'll help you create your school profile and get everything ready 
                  for your digital transformation journey.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Hello {user?.firstName}!</strong> You're just a few steps away 
                    from launching your school's digital platform.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
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
                  <Input
                    id="slug"
                    name="slug"
                    value={schoolData.slug}
                    onChange={handleChange}
                    placeholder="your-school-name"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Your school will be accessible at: schoolportal.top/{schoolData.slug}
                  </p>
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
            )}

            {currentStep === 3 && (
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
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Review Your Information</h3>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <strong>School Name:</strong> {schoolData.name}
                  </div>
                  <div>
                    <strong>URL:</strong> schoolportal.top/{schoolData.slug}
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
                </div>
                
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">What happens next?</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>✓ Your school profile will be created</li>
                    <li>✓ You'll get access to your dashboard</li>
                    <li>✓ You can start customizing your school website</li>
                    <li>✓ Begin adding classes, programs, and content</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 2 && (!schoolData.name || !schoolData.slug)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  disabled={loading}
                >
                  {loading ? 'Creating School...' : 'Create School'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
