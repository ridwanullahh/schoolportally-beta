
import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Edit, Trash2, HelpCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  schoolId: string;
  category: string;
  order: number;
  status: 'published' | 'draft';
  authorId: string;
  helpful: number;
  notHelpful: number;
  tags: string[];
  relatedFaqs: string[];
  lastUpdated: string;
}

const FAQModule: React.FC = () => {
  const { school } = useSchool();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'general',
    status: 'published' as FAQ['status'],
    tags: '',
  });

  const categories = [
    'general',
    'admissions',
    'academics',
    'fees',
    'facilities',
    'extracurricular',
    'policies',
    'technology'
  ];

  useEffect(() => {
    fetchFaqs();
  }, [school]);

  const fetchFaqs = async () => {
    if (!school) return;

    setLoading(true);
    try {
      const allFaqs = await sdk.get<FAQ>('faqs');
      const schoolFaqs = allFaqs.filter(faq => faq.schoolId === school.id);
      // Sort by order and then by question
      schoolFaqs.sort((a, b) => a.order - b.order || a.question.localeCompare(b.question));
      setFaqs(schoolFaqs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFaq = async () => {
    if (!school) return;

    try {
      const tags = faqForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const newFaq = await sdk.insert<FAQ>('faqs', {
        ...faqForm,
        schoolId: school.id,
        authorId: 'admin', // In real app, use current user
        order: faqs.length,
        helpful: 0,
        notHelpful: 0,
        tags,
        relatedFaqs: [],
        lastUpdated: new Date().toISOString(),
      });
      setFaqs([...faqs, newFaq]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating FAQ:', error);
    }
  };

  const handleUpdateFaq = async () => {
    if (!selectedFaq) return;

    try {
      const tags = faqForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const updatedFaq = await sdk.update<FAQ>('faqs', selectedFaq.id, {
        ...faqForm,
        tags,
        lastUpdated: new Date().toISOString(),
      });
      setFaqs(faqs.map(faq => 
        faq.id === selectedFaq.id ? updatedFaq : faq
      ));
      resetForm();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedFaq(null);
    } catch (error) {
      console.error('Error updating FAQ:', error);
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    try {
      await sdk.delete('faqs', faqId);
      setFaqs(faqs.filter(faq => faq.id !== faqId));
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  const resetForm = () => {
    setFaqForm({
      question: '',
      answer: '',
      category: 'general',
      status: 'published',
      tags: '',
    });
  };

  const openEditDialog = (faq: FAQ) => {
    setSelectedFaq(faq);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      status: faq.status,
      tags: faq.tags.join(', '),
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const filteredFaqs = filterCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === filterCategory);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: 'bg-gray-100 text-gray-800',
      admissions: 'bg-blue-100 text-blue-800',
      academics: 'bg-green-100 text-green-800',
      fees: 'bg-yellow-100 text-yellow-800',
      facilities: 'bg-purple-100 text-purple-800',
      extracurricular: 'bg-pink-100 text-pink-800',
      policies: 'bg-red-100 text-red-800',
      technology: 'bg-indigo-100 text-indigo-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">FAQ Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setIsEditing(false); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              New FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit FAQ' : 'Create New FAQ'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Question *</label>
                <Input
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="Enter the question"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={faqForm.category} onValueChange={(value) => setFaqForm({ ...faqForm, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={faqForm.status} onValueChange={(value) => setFaqForm({ ...faqForm, status: value as FAQ['status'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                <Input
                  value={faqForm.tags}
                  onChange={(e) => setFaqForm({ ...faqForm, tags: e.target.value })}
                  placeholder="admission, requirements, documents"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Answer *</label>
                <Textarea
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Enter the detailed answer"
                  rows={6}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateFaq : handleCreateFaq}>
                {isEditing ? 'Update FAQ' : 'Create FAQ'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{faqs.length}</div>
                <p className="text-xs text-muted-foreground">Total FAQs</p>
              </div>
              <HelpCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{faqs.filter(f => f.status === 'published').length}</div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{faqs.reduce((acc, f) => acc + f.helpful, 0)}</div>
            <p className="text-xs text-muted-foreground">Helpful Votes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <label className="font-medium">Filter by category:</label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* FAQs List */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start justify-between w-full mr-4">
                      <div className="flex-1">
                        <div className="font-medium">{faq.question}</div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getCategoryColor(faq.category)}>
                            {faq.category}
                          </Badge>
                          <Badge variant={faq.status === 'published' ? 'default' : 'secondary'}>
                            {faq.status}
                          </Badge>
                          {faq.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(faq)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteFaq(faq.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4">
                      <p className="text-gray-700 mb-4">{faq.answer}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {faq.helpful} helpful
                          </div>
                          <div className="flex items-center">
                            <ThumbsDown className="w-4 h-4 mr-1" />
                            {faq.notHelpful} not helpful
                          </div>
                        </div>
                        <div>
                          Last updated: {new Date(faq.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {filterCategory === 'all' 
                ? 'No FAQs found. Create your first FAQ to get started.'
                : `No FAQs found in the ${filterCategory} category.`
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQModule;
