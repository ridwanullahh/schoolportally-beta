
import React from 'react';
import { SignupForm } from '@/components/auth/SignupForm';
import { buildMarketingUrl } from '@/utils/routing';

const Signup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
          <p className="text-gray-600">Create your SchoolPortal account</p>
        </div>
        
        <SignupForm redirectPath={buildMarketingUrl('/onboarding')} />
        
        <div className="text-center mt-6">
          <a 
            href={buildMarketingUrl('/')} 
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
