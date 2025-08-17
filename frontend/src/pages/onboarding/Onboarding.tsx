
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { School, Page } from '@/types';
import OnboardingStep from './OnboardingStep';
import OnboardingComplete from './OnboardingComplete';
import sdk from '@/lib/sdk-config';

const Onboarding = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { school, loading: schoolLoading } = useSchool();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completedSchool, setCompletedSchool] = useState<School | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  
  const [schoolData, setSchoolData] = useState({
    name: '',
    slug: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    timezone: 'UTC',
    currency: 'USD',
    branding: {
      primaryColor: '#4f46e5',
      secondaryColor: '#06b6d4',
      accentColor: '#f59e0b',
      fontFamily: 'Inter',
      logo: '',
      favicon: '',
      headerStyle: 'default',
      footerStyle: 'default',
    }
  });

  // Check if user already has a school
  useEffect(() => {
    if (isAuthenticated && user && !authLoading && !schoolLoading) {
      if (school && school.onboardingCompleted) {
        // User already has a completed school, redirect to admin
        window.location.href = `/${school.slug}/admin`;
        return;
      }
    }
  }, [isAuthenticated, user, school, authLoading, schoolLoading]);

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const createSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Generate unique ID and slug if not provided
      const schoolId = generateUniqueId();
      const schoolSlug = schoolData.slug || createSlugFromName(schoolData.name);
      
      const completeSchoolData = {
        id: schoolId,
        uid: schoolId,
        ...schoolData,
        slug: schoolSlug,
        ownerId: user?.id || '',
        status: 'active',
        subscriptionPlan: 'standard',
        subscriptionStatus: 'trial',
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('Creating school with data:', completeSchoolData);
      
      const newSchool = await sdk.insert<School>('schools', completeSchoolData);
      
      // Update user with schoolId
      if (user && user.id) {
        await sdk.update('users', user.id, { schoolId: newSchool.id });
      }

      // Create default pages for the school
      await createDefaultPages(newSchool.id);
      
      setCompletedSchool(newSchool);
      setShowComplete(true);
      
      toast({
        title: 'Success!',
        description: 'Your school has been created successfully.',
      });
    } catch (error: any) {
      console.error('School creation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create school',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPages = async (schoolId: string) => {
    const defaultPages = [
      {
        id: generateUniqueId(),
        uid: generateUniqueId(),
        schoolId,
        title: 'Home',
        slug: 'home',
        type: 'homepage' as const,
        status: 'published' as const,
        sections: [
          {
            id: '1',
            type: 'hero',
            styleId: 'hero-1',
            content: {
              title: 'Welcome to Our School',
              subtitle: 'Excellence in Education',
              description: 'We provide quality education in a nurturing environment.',
              primaryButton: 'Learn More',
              primaryLink: '/about',
              secondaryButton: 'Apply Now',
              secondaryLink: '/admissions'
            },
            settings: {},
            order: 1,
            visible: true
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateUniqueId(),
        uid: generateUniqueId(),
        schoolId,
        title: 'About Us',
        slug: 'about',
        type: 'about' as const,
        status: 'published' as const,
        sections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateUniqueId(),
        uid: generateUniqueId(),
        schoolId,
        title: 'Programs',
        slug: 'programs',
        type: 'programs' as const,
        status: 'published' as const,
        sections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateUniqueId(),
        uid: generateUniqueId(),
        schoolId,
        title: 'Classes',
        slug: 'classes',
        type: 'classes' as const,
        status: 'published' as const,
        sections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateUniqueId(),
        uid: generateUniqueId(),
        schoolId,
        title: 'Admissions',
        slug: 'admissions',
        type: 'admissions' as const,
        status: 'published' as const,
        sections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateUniqueId(),
        uid: generateUniqueId(),
        schoolId,
        title: 'Contact',
        slug: 'contact',
        type: 'contact' as const,
        status: 'published' as const,
        sections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Create pages individually
    for (const pageData of defaultPages) {
      try {
        await sdk.insert<Page>('pages', pageData);
        console.log(`Created page: ${pageData.title}`);
      } catch (error) {
        console.error(`Failed to create page ${pageData.title}:`, error);
      }
    }
  };

  const handleCloseComplete = () => {
    setShowComplete(false);
    if (completedSchool) {
      window.location.href = `/${completedSchool.slug}/admin`;
    }
  };

  if (authLoading || schoolLoading) {
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
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Sign In
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Step {currentStep} of 5</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 5) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {currentStep === 1 && "Welcome to SchoolPortal!"}
                {currentStep === 2 && "School Information"}
                {currentStep === 3 && "Contact & Location"}
                {currentStep === 4 && "Brand Identity"}
                {currentStep === 5 && "Review & Create"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OnboardingStep
                currentStep={currentStep}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onComplete={handleComplete}
                schoolData={schoolData}
                setSchoolData={setSchoolData}
                loading={loading}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {showComplete && completedSchool && (
        <OnboardingComplete
          school={completedSchool}
          onClose={handleCloseComplete}
        />
      )}
    </>
  );
};

export default Onboarding;
