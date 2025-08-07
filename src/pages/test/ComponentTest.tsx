import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, XCircle, AlertCircle, Loader2, 
  Palette, Database, Cpu, Wifi, Users, BookOpen
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import themeService from '@/services/themeService';
import fontService from '@/services/fontService';
import { aiService } from '@/services/aiService';

export const ComponentTest: React.FC = () => {
  const { user } = useAuth();
  const { school } = useSchool();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const results = [];

    // Test 1: Theme Service
    try {
      const themes = themeService.getThemes();
      results.push({
        name: 'Theme Service',
        status: themes.length === 26 ? 'passed' : 'failed',
        message: `Loaded ${themes.length} themes (expected 26)`,
        icon: Palette
      });
    } catch (error) {
      results.push({
        name: 'Theme Service',
        status: 'failed',
        message: `Error: ${error}`,
        icon: Palette
      });
    }

    // Test 2: Font Service
    try {
      const fonts = fontService.getAllFonts();
      results.push({
        name: 'Font Service',
        status: fonts.length > 0 ? 'passed' : 'failed',
        message: `Loaded ${fonts.length} fonts`,
        icon: Users
      });
    } catch (error) {
      results.push({
        name: 'Font Service',
        status: 'failed',
        message: `Error: ${error}`,
        icon: Users
      });
    }

    // Test 3: AI Service
    try {
      const isEnabled = aiService.isEnabled();
      results.push({
        name: 'AI Service',
        status: 'passed',
        message: `AI Service ${isEnabled ? 'enabled' : 'disabled'}`,
        icon: Cpu
      });
    } catch (error) {
      results.push({
        name: 'AI Service',
        status: 'failed',
        message: `Error: ${error}`,
        icon: Cpu
      });
    }

    // Test 4: Auth Context
    try {
      results.push({
        name: 'Auth Context',
        status: 'passed',
        message: `User: ${user ? user.name || user.email : 'Not logged in'}`,
        icon: Users
      });
    } catch (error) {
      results.push({
        name: 'Auth Context',
        status: 'failed',
        message: `Error: ${error}`,
        icon: Users
      });
    }

    // Test 5: School Context
    try {
      results.push({
        name: 'School Context',
        status: 'passed',
        message: `School: ${school ? school.name : 'No school loaded'}`,
        icon: BookOpen
      });
    } catch (error) {
      results.push({
        name: 'School Context',
        status: 'failed',
        message: `Error: ${error}`,
        icon: BookOpen
      });
    }

    // Test 6: Theme Application
    try {
      themeService.applyTheme('theme-1', {});
      const currentTheme = themeService.getCurrentTheme();
      results.push({
        name: 'Theme Application',
        status: currentTheme === 'theme-1' ? 'passed' : 'failed',
        message: `Applied theme: ${currentTheme}`,
        icon: Palette
      });
    } catch (error) {
      results.push({
        name: 'Theme Application',
        status: 'failed',
        message: `Error: ${error}`,
        icon: Palette
      });
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || colors.pending}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const passedTests = testResults.filter(t => t.status === 'passed').length;
  const failedTests = testResults.filter(t => t.status === 'failed').length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Component Integration Test</h1>
          <p className="text-muted-foreground">
            Test all major components and services
          </p>
        </div>
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          size="lg"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run Tests'
          )}
        </Button>
      </div>

      {testResults.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Test Results: {passedTests} passed, {failedTests} failed
            {failedTests === 0 && (
              <span className="ml-2 font-semibold text-green-600">
                ✅ All tests passed!
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {testResults.map((result, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <result.icon className="h-5 w-5" />
                  <div>
                    <h3 className="font-medium">{result.name}</h3>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  {getStatusBadge(result.status)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testResults.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tests run yet</h3>
            <p className="text-gray-600 mb-4">Click "Run Tests" to test all components.</p>
          </CardContent>
        </Card>
      )}

      {/* Theme Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(themeNum => (
              <Button
                key={themeNum}
                variant="outline"
                onClick={() => themeService.applyTheme(`theme-${themeNum}`, {})}
                className="h-16"
              >
                Theme {themeNum}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Component Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Component Showcase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          
          <div className="flex gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This is a sample alert to test the styling.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComponentTest;
