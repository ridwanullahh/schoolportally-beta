import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, Download, FileText } from 'lucide-react';

interface ELibraryItem {
  id: string;
  schoolId: string;
  title: string;
  author: string;
  description: string;
  fileUrl: string;
  fileType: string;
  category: string;
  status: string;
  createdAt: string;
}

const ELibraryModule: React.FC = () => {
  const { school } = useSchool();
  const [items, setItems] = useState<ELibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [school]);

  const fetchItems = async () => {
    if (!school) return;

    setLoading(true);
    try {
      const allItems = await sdk.get<ELibraryItem>('elibrary');
      const schoolItems = allItems.filter(item => item.schoolId === school.id && item.status === 'published');
      setItems(schoolItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error fetching e-library items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      textbook: 'bg-blue-100 text-blue-800',
      reference: 'bg-green-100 text-green-800',
      fiction: 'bg-purple-100 text-purple-800',
      'non-fiction': 'bg-orange-100 text-orange-800',
      journal: 'bg-red-100 text-red-800',
      magazine: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'epub':
        return <Book className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">E-Library</h2>
      </div>

      {items.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          No library items are available at this time.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                    {item.author && (
                      <p className="text-sm text-gray-600 mt-1">by {item.author}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                      <Badge variant="outline">
                        {item.fileType.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(item.fileType)}
                    <span className="text-sm text-gray-500">
                      {item.fileType.toUpperCase()} File
                    </span>
                  </div>
                  
                  {item.fileUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(item.fileUrl, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ELibraryModule;