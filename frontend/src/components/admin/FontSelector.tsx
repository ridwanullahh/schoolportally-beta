import React, { useState, useEffect } from 'react';
import { 
  Type, Search, Eye, Download, Upload, 
  Check, X, Filter, RefreshCw, Plus
} from 'lucide-react';
import { FontOption } from '@/types';
import { fontService } from '@/services/fontService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSchool } from '@/contexts/SchoolContext';

interface FontSelectorProps {
  onFontChange?: (fontId: string, target: 'body' | 'heading') => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({ onFontChange }) => {
  const { school, updateSchool } = useSchool();
  const [fonts, setFonts] = useState<FontOption[]>([]);
  const [filteredFonts, setFilteredFonts] = useState<FontOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedBodyFont, setSelectedBodyFont] = useState<string>('');
  const [selectedHeadingFont, setSelectedHeadingFont] = useState<string>('');
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog. 1234567890');
  const [previewFont, setPreviewFont] = useState<string | null>(null);

  useEffect(() => {
    loadFonts();
    loadCurrentFonts();
  }, []);

  useEffect(() => {
    filterFonts();
  }, [fonts, searchTerm, categoryFilter, sourceFilter]);

  const loadFonts = () => {
    setFonts(fontService.getAllFonts());
  };

  const loadCurrentFonts = () => {
    // Load current fonts from school branding
    if (school?.branding?.fontFamily) {
      const bodyFont = fontService.getAllFonts().find(f => 
        f.family === school.branding.fontFamily
      );
      if (bodyFont) setSelectedBodyFont(bodyFont.id);
    }
    
    if (school?.branding?.headingFontFamily) {
      const headingFont = fontService.getAllFonts().find(f => 
        f.family === school.branding.headingFontFamily
      );
      if (headingFont) setSelectedHeadingFont(headingFont.id);
    }
  };

  const filterFonts = () => {
    let filtered = fonts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(font =>
        font.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        font.family.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(font => font.category === categoryFilter);
    }

    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(font => font.source === sourceFilter);
    }

    setFilteredFonts(filtered);
  };

  const handleFontSelect = (fontId: string, target: 'body' | 'heading') => {
    const font = fontService.getFontById(fontId);
    if (!font) return;

    if (target === 'body') {
      setSelectedBodyFont(fontId);
      fontService.applyFont(fontId, 'body');
    } else {
      setSelectedHeadingFont(fontId);
      fontService.applyFont(fontId, 'heading');
    }

    // Update school branding
    if (school) {
      const updatedBranding = {
        ...school.branding,
        [target === 'body' ? 'fontFamily' : 'headingFontFamily']: font.family,
        [`${target === 'body' ? 'google' : 'headingGoogle'}FontFamily`]: font.source === 'google' ? font.name : undefined
      };

      updateSchool({
        ...school,
        branding: updatedBranding
      });
    }

    onFontChange?.(fontId, target);
  };

  const handlePreviewFont = (fontId: string) => {
    if (previewFont === fontId) {
      setPreviewFont(null);
      fontService.resetFont('all');
    } else {
      setPreviewFont(fontId);
      fontService.previewFont(fontId);
    }
  };

  const handleCustomFontUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create object URL for the font file
    const fontUrl = URL.createObjectURL(file);
    const fontName = file.name.replace(/\.[^/.]+$/, "");

    const customFontId = fontService.addCustomFont({
      name: fontName,
      family: `"${fontName}", sans-serif`,
      category: 'sans-serif',
      variants: ['400'],
      subsets: ['latin'],
      url: fontUrl,
      preview: previewText
    });

    loadFonts();
  };

  const FontCard: React.FC<{ font: FontOption; target?: 'body' | 'heading' }> = ({ 
    font, 
    target 
  }) => {
    const isSelected = target === 'body' 
      ? selectedBodyFont === font.id 
      : target === 'heading'
        ? selectedHeadingFont === font.id
        : false;

    return (
      <Card className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{font.name}</CardTitle>
              <p className="text-sm text-gray-600">{font.family}</p>
            </div>
            <div className="flex space-x-1">
              <Badge variant={font.source === 'google' ? 'default' : 'secondary'}>
                {font.source}
              </Badge>
              <Badge variant="outline">
                {font.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Font Preview */}
          <div 
            className="mb-4 p-3 bg-gray-50 rounded-lg"
            style={{ fontFamily: font.family }}
          >
            <p className="text-lg mb-2">Heading Example</p>
            <p className="text-sm text-gray-600">{font.preview}</p>
          </div>
          
          {/* Font Variants */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Available weights:</p>
            <div className="flex flex-wrap gap-1">
              {font.variants.map(variant => (
                <Badge key={variant} variant="outline" className="text-xs">
                  {variant}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex space-x-2">
            {target && (
              <Button
                onClick={() => handleFontSelect(font.id, target)}
                size="sm"
                className={isSelected ? 'bg-green-600' : ''}
              >
                {isSelected ? <Check size={14} /> : 'Select'}
              </Button>
            )}
            
            <Button
              onClick={() => handlePreviewFont(font.id)}
              variant="outline"
              size="sm"
            >
              <Eye size={14} />
            </Button>
            
            {font.source === 'google' && (
              <Button
                onClick={() => window.open(`https://fonts.google.com/specimen/${font.name.replace(/\s+/g, '+')}`)}
                variant="outline"
                size="sm"
              >
                <Download size={14} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Font Selection</h2>
          <p className="text-gray-600 mt-1">
            Choose fonts for your school's website typography
          </p>
        </div>
        
        <div className="flex space-x-2">
          {previewFont && (
            <Button
              onClick={() => handlePreviewFont('')}
              variant="outline"
              className="text-orange-600 border-orange-600"
            >
              <X size={16} className="mr-2" />
              Exit Preview
            </Button>
          )}
          
          <label className="cursor-pointer">
            <Button variant="outline" asChild>
              <span>
                <Upload size={16} className="mr-2" />
                Upload Font
              </span>
            </Button>
            <input
              type="file"
              accept=".woff,.woff2,.ttf,.otf"
              onChange={handleCustomFontUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Current Fonts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Body Font</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedBodyFont ? (
              <div>
                <p className="font-medium text-blue-900">
                  {fontService.getFontById(selectedBodyFont)?.name}
                </p>
                <p className="text-sm text-blue-700">
                  {fontService.getFontById(selectedBodyFont)?.family}
                </p>
              </div>
            ) : (
              <p className="text-blue-700">No body font selected</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">Heading Font</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedHeadingFont ? (
              <div>
                <p className="font-medium text-green-900">
                  {fontService.getFontById(selectedHeadingFont)?.name}
                </p>
                <p className="text-sm text-green-700">
                  {fontService.getFontById(selectedHeadingFont)?.family}
                </p>
              </div>
            ) : (
              <p className="text-green-700">No heading font selected</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search fonts..."
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="sans-serif">Sans Serif</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="monospace">Monospace</SelectItem>
            <SelectItem value="handwriting">Handwriting</SelectItem>
            <SelectItem value="display">Display</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          onClick={() => {
            setSearchTerm('');
            setCategoryFilter('all');
            setSourceFilter('all');
          }}
          variant="outline"
          size="sm"
        >
          <RefreshCw size={16} />
        </Button>
      </div>

      {/* Preview Text Input */}
      <div>
        <Label htmlFor="preview-text">Preview Text</Label>
        <Input
          id="preview-text"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          placeholder="Enter text to preview fonts..."
        />
      </div>

      <Tabs defaultValue="body" className="space-y-6">
        <TabsList>
          <TabsTrigger value="body">Body Fonts</TabsTrigger>
          <TabsTrigger value="heading">Heading Fonts</TabsTrigger>
          <TabsTrigger value="all">All Fonts</TabsTrigger>
        </TabsList>

        <TabsContent value="body" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFonts.map(font => (
              <FontCard key={font.id} font={font} target="body" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="heading" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFonts.map(font => (
              <FontCard key={font.id} font={font} target="heading" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFonts.map(font => (
              <FontCard key={font.id} font={font} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredFonts.length === 0 && (
        <div className="text-center py-12">
          <Type size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No fonts found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default FontSelector;
