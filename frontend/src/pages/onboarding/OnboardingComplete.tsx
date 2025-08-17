
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ExternalLink, Settings, Users } from 'lucide-react';
import { School } from '@/types';
import { buildSchoolUrl } from '@/utils/routing';

interface OnboardingCompleteProps {
  school: School;
  onClose: () => void;
}

const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({ school, onClose }) => {
  const schoolWebsiteUrl = buildSchoolUrl(school.slug);
  const schoolAdminUrl = buildSchoolUrl(school.slug, '/admin');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            🎉 Congratulations! Your School Portal is Ready!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">{school.name}</h3>
            <p className="text-gray-600">Your digital school platform has been successfully created.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                </div>
                <h4 className="font-semibold">School Website</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Your public-facing school website where visitors can learn about your school.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(schoolWebsiteUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Website
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Settings className="h-4 w-4 text-purple-600" />
                </div>
                <h4 className="font-semibold">Admin Dashboard</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Manage your school's content, users, and settings from your admin panel.
              </p>
              <Button
                size="sm"
                className="w-full"
                onClick={() => window.location.href = schoolAdminUrl}
              >
                <Settings className="h-4 w-4 mr-2" />
                Go to Admin
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🚀 Next Steps:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Customize your website content and design</li>
              <li>• Add your school programs and classes</li>
              <li>• Set up user registration for students, teachers, and parents</li>
              <li>• Upload your school logo and branding materials</li>
              <li>• Configure contact forms and admissions</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📱 Access Information:</h4>
            <div className="text-sm space-y-1">
              <div><strong>School Website:</strong> {schoolWebsiteUrl}</div>
              <div><strong>Admin Dashboard:</strong> {schoolAdminUrl}</div>
              <div><strong>School ID:</strong> {school.slug}</div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={onClose} size="lg">
              <Settings className="h-4 w-4 mr-2" />
              Start Managing Your School
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingComplete;
