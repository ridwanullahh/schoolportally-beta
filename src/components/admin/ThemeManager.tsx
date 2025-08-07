import React, { useState, useEffect } from 'react';
import { 
  Palette, Eye, Settings, Download, Upload, 
  Check, X, Edit, Trash2, Copy, RefreshCw
} from 'lucide-react';
import { Theme, BreadcrumbStyle } from '@/types';
import { themeService } from '@/services/themeService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSchool } from '@/contexts/SchoolContext';

interface ThemeManagerProps {
  onThemeChange?: (themeId: string) => void;
}

export const ThemeManager: React.FC<ThemeManagerProps> = ({ onThemeChange }) => {
  const { school, updateSchool } = useSchool();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [breadcrumbStyles, setBreadcrumbStyles] = useState<BreadcrumbStyle[]>([]);
  const [currentTheme, setCurrentTheme] = useState<string>('');
  const [selectedBreadcrumb, setSelectedBreadcrumb] = useState<string>('');
  const [previewMode, setPreviewMode] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customTheme, setCustomTheme] = useState<Partial<Theme>>({
    name: '',
    description: '',
    category: 'modern',
    colorScheme: {
      primary: '#2563eb',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: '#ffffff',
      text: '#1f2937'
    },
    typography: {
      fontFamily: 'Inter',
      headingFont: 'Inter',
      bodyFont: 'Inter'
    }
  });

  useEffect(() => {
    loadThemes();
    loadBreadcrumbStyles();
    setCurrentTheme(themeService.getCurrentTheme());
  }, []);

  const loadThemes = () => {
    setThemes(themeService.getThemes());
  };

  const loadBreadcrumbStyles = () => {
    setBreadcrumbStyles(themeService.getBreadcrumbStyles());
  };

  const handleThemeSelect = (themeId: string) => {
    setCurrentTheme(themeId);
    themeService.applyTheme(themeId, school?.branding || {});
    onThemeChange?.(themeId);
    
    // Update school settings
    if (school) {
      updateSchool({
        ...school,
        branding: {
          ...school.branding,
          currentTheme: themeId
        }
      });
    }
  };

  const handleBreadcrumbSelect = (breadcrumbId: string) => {
    setSelectedBreadcrumb(breadcrumbId);
    
    // Update school settings
    if (school) {
      updateSchool({
        ...school,
        branding: {
          ...school.branding,
          breadcrumbStyle: breadcrumbId
        }
      });
    }
  };

  const handlePreviewTheme = (themeId: string) => {
    if (previewMode) {
      // Reset to current theme
      themeService.applyTheme(currentTheme, school?.branding || {});
      setPreviewMode(false);
    } else {
      // Apply preview theme
      themeService.applyTheme(themeId, school?.branding || {});
      setPreviewMode(true);
    }
  };

  const handleCustomThemeCreate = () => {
    // Implementation for creating custom themes
    console.log('Creating custom theme:', customTheme);
  };

  const exportTheme = (theme: Theme) => {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const theme = JSON.parse(e.target?.result as string);
        // Validate and add theme
        console.log('Importing theme:', theme);
      } catch (error) {
        console.error('Invalid theme file:', error);
      }
    };
    reader.readAsText(file);
  };

  const ThemeCard: React.FC<{ theme: Theme }> = ({ theme }) => (
    <Card className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
      currentTheme === theme.id ? 'ring-2 ring-blue-500' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{theme.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
          </div>
          <Badge variant={theme.category === 'modern' ? 'default' : 'secondary'}>
            {theme.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Color Preview */}
        <div className="flex space-x-2 mb-4">
          <div 
            className="w-6 h-6 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: theme.colorScheme.primary }}
            title="Primary Color"
          />
          <div 
            className="w-6 h-6 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: theme.colorScheme.secondary }}
            title="Secondary Color"
          />
          <div 
            className="w-6 h-6 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: theme.colorScheme.accent }}
            title="Accent Color"
          />
        </div>
        
        {/* Typography Preview */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Typography</p>
          <p style={{ fontFamily: theme.typography.fontFamily }} className="text-sm">
            {theme.typography.fontFamily}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            onClick={() => handleThemeSelect(theme.id)}
            size="sm"
            className={currentTheme === theme.id ? 'bg-green-600' : ''}
          >
            {currentTheme === theme.id ? <Check size={14} /> : 'Select'}
          </Button>
          
          <Button
            onClick={() => handlePreviewTheme(theme.id)}
            variant="outline"
            size="sm"
          >
            <Eye size={14} />
          </Button>
          
          <Button
            onClick={() => exportTheme(theme)}
            variant="outline"
            size="sm"
          >
            <Download size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Theme Manager</h2>
          <p className="text-gray-600 mt-1">
            Customize your school's website appearance with pre-designed themes
          </p>
        </div>
        
        <div className="flex space-x-2">
          {previewMode && (
            <Button
              onClick={() => handlePreviewTheme('')}
              variant="outline"
              className="text-orange-600 border-orange-600"
            >
              <X size={16} className="mr-2" />
              Exit Preview
            </Button>
          )}
          
          <Button
            onClick={() => setShowCustomizer(true)}
            variant="outline"
          >
            <Settings size={16} className="mr-2" />
            Customize
          </Button>
          
          <label className="cursor-pointer">
            <Button variant="outline" asChild>
              <span>
                <Upload size={16} className="mr-2" />
                Import Theme
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={importTheme}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <Tabs defaultValue="themes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="breadcrumbs">Breadcrumbs</TabsTrigger>
          <TabsTrigger value="customizer">Customizer</TabsTrigger>
        </TabsList>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-6">
          {/* Current Theme Info */}
          {currentTheme && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Palette className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium text-blue-900">
                      Current Theme: {themes.find(t => t.id === currentTheme)?.name}
                    </p>
                    <p className="text-sm text-blue-700">
                      {themes.find(t => t.id === currentTheme)?.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Themes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map(theme => (
              <ThemeCard key={theme.id} theme={theme} />
            ))}
          </div>
        </TabsContent>

        {/* Breadcrumbs Tab */}
        <TabsContent value="breadcrumbs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {breadcrumbStyles.map(style => (
              <Card 
                key={style.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedBreadcrumb === style.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleBreadcrumbSelect(style.id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{style.name}</CardTitle>
                  <Badge variant="secondary">{style.category}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm font-mono">{style.preview}</p>
                  </div>
                  <Button
                    size="sm"
                    className={selectedBreadcrumb === style.id ? 'bg-green-600' : ''}
                  >
                    {selectedBreadcrumb === style.id ? <Check size={14} /> : 'Select'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Customizer Tab */}
        <TabsContent value="customizer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Theme</CardTitle>
              <p className="text-gray-600">
                Design your own theme with custom colors and typography
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme-name">Theme Name</Label>
                    <Input
                      id="theme-name"
                      value={customTheme.name}
                      onChange={(e) => setCustomTheme(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Custom Theme"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="theme-description">Description</Label>
                    <Textarea
                      id="theme-description"
                      value={customTheme.description}
                      onChange={(e) => setCustomTheme(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="A beautiful custom theme for our school"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="theme-category">Category</Label>
                    <Select
                      value={customTheme.category}
                      onValueChange={(value) => setCustomTheme(prev => ({ ...prev, category: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Color Scheme</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="primary-color"
                          type="color"
                          value={customTheme.colorScheme?.primary}
                          onChange={(e) => setCustomTheme(prev => ({
                            ...prev,
                            colorScheme: { ...prev.colorScheme!, primary: e.target.value }
                          }))}
                          className="w-16 h-10"
                        />
                        <Input
                          value={customTheme.colorScheme?.primary}
                          onChange={(e) => setCustomTheme(prev => ({
                            ...prev,
                            colorScheme: { ...prev.colorScheme!, primary: e.target.value }
                          }))}
                          placeholder="#2563eb"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="secondary-color"
                          type="color"
                          value={customTheme.colorScheme?.secondary}
                          onChange={(e) => setCustomTheme(prev => ({
                            ...prev,
                            colorScheme: { ...prev.colorScheme!, secondary: e.target.value }
                          }))}
                          className="w-16 h-10"
                        />
                        <Input
                          value={customTheme.colorScheme?.secondary}
                          onChange={(e) => setCustomTheme(prev => ({
                            ...prev,
                            colorScheme: { ...prev.colorScheme!, secondary: e.target.value }
                          }))}
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accent-color">Accent Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="accent-color"
                          type="color"
                          value={customTheme.colorScheme?.accent}
                          onChange={(e) => setCustomTheme(prev => ({
                            ...prev,
                            colorScheme: { ...prev.colorScheme!, accent: e.target.value }
                          }))}
                          className="w-16 h-10"
                        />
                        <Input
                          value={customTheme.colorScheme?.accent}
                          onChange={(e) => setCustomTheme(prev => ({
                            ...prev,
                            colorScheme: { ...prev.colorScheme!, accent: e.target.value }
                          }))}
                          placeholder="#60a5fa"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="text-color">Text Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="text-color"
                          type="color"
                          value={customTheme.colorScheme?.text}
                          onChange={(e) => setCustomTheme(prev => ({
                            ...prev,
                            colorScheme: { ...prev.colorScheme!, text: e.target.value }
                          }))}
                          className="w-16 h-10"
                        />
                        <Input
                          value={customTheme.colorScheme?.text}
                          onChange={(e) => setCustomTheme(prev => ({
                            ...prev,
                            colorScheme: { ...prev.colorScheme!, text: e.target.value }
                          }))}
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button onClick={handleCustomThemeCreate}>
                  Create Theme
                </Button>
                <Button variant="outline">
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThemeManager;
