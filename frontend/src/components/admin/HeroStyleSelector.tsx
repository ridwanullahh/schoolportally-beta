import React, { useState } from 'react';
import { heroStyles, heroStyleCategories, getHeroStylesByCategory, HeroStyleConfig } from '@/config/hero-styles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Eye, Palette, Zap, Minimize2, MousePointer } from 'lucide-react';

interface HeroStyleSelectorProps {
  selectedStyleId?: string;
  onStyleSelect: (styleId: string) => void;
  onPreview?: (styleId: string) => void;
}

const HeroStyleSelector: React.FC<HeroStyleSelectorProps> = ({
  selectedStyleId,
  onStyleSelect,
  onPreview
}) => {
  const [activeCategory, setActiveCategory] = useState('modern');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'modern': return <Palette className="w-4 h-4" />;
      case 'creative': return <Zap className="w-4 h-4" />;
      case 'minimal': return <Minimize2 className="w-4 h-4" />;
      case 'interactive': return <MousePointer className="w-4 h-4" />;
      default: return <Palette className="w-4 h-4" />;
    }
  };

  const StyleCard: React.FC<{ style: HeroStyleConfig }> = ({ style }) => {
    const isSelected = selectedStyleId === style.id;

    return (
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
        }`}
        onClick={() => onStyleSelect(style.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {style.name}
                {isSelected && <Check className="w-4 h-4 text-blue-500" />}
              </CardTitle>
              <CardDescription className="mt-1">
                {style.description}
              </CardDescription>
            </div>
            {onPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(style.id);
                }}
                className="ml-2"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Preview placeholder */}
          <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Preview</span>
          </div>
          
          {/* Features */}
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
              <div className="flex flex-wrap gap-1">
                {style.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {style.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{style.features.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Best For</h4>
              <div className="flex flex-wrap gap-1">
                {style.bestFor.slice(0, 2).map((use, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {use}
                  </Badge>
                ))}
                {style.bestFor.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{style.bestFor.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Hero Style</h2>
        <p className="text-gray-600">
          Select a hero section style that best represents your school's brand and personality.
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-4">
          {heroStyleCategories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="flex items-center gap-2"
            >
              {getCategoryIcon(category.id)}
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {heroStyleCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{category.name} Styles</h3>
              <p className="text-gray-600">{category.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getHeroStylesByCategory(category.id).map((style) => (
                <StyleCard key={style.id} style={style} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedStyleId && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Style Selected</h3>
          </div>
          <p className="text-blue-700">
            You've selected the <strong>{heroStyles.find(s => s.id === selectedStyleId)?.name}</strong> style. 
            This will be applied to your hero section immediately.
          </p>
        </div>
      )}
    </div>
  );
};

export default HeroStyleSelector;
