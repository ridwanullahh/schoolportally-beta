
import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Award, TrendingUp, Users } from 'lucide-react';

interface Result {
  id: string;
  schoolId: string;
  studentId: string;
  classId: string;
  term: string;
  session: string;
  subjects: Array<{
    name: string;
    score: number;
    grade: string;
  }>;
  totalScore: number;
  grade: string;
  position: number;
  remarks: string;
  createdAt: string;
}

const ResultsModule: React.FC = () => {
  const { school } = useSchool();
  const { user } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [resultForm, setResultForm] = useState({
    studentId: '',
    classId: '',
    term: 'first',
    session: '2024-2025',
    subjects: [{ name: '', score: 0, grade: '' }],
    totalScore: 0,
    grade: '',
    position: 1,
    remarks: ''
  });

  const terms = ['first', 'second', 'third'];
  const grades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];

  useEffect(() => {
    fetchResults();
  }, [school]);

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const fetchResults = async () => {
    if (!school || !user) return;

    setLoading(true);
    try {
      const allResults = await sdk.get<Result>('results');
      let schoolResults = allResults.filter(result => result.schoolId === school.id);

      if (user.userType === 'student') {
        schoolResults = schoolResults.filter(result => result.studentId === user.id);
      } else if (user.userType === 'parent') {
        // This assumes that a parent has a list of their children's IDs
        // You may need to fetch this list first
        // For now, we'll assume the user object has a `children` array
        const childrenIds = user.children || [];
        schoolResults = schoolResults.filter(result => childrenIds.includes(result.studentId));
      }
      setResults(schoolResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalScore = (subjects: Array<{ name: string; score: number; grade: string }>) => {
    return subjects.reduce((total, subject) => total + subject.score, 0);
  };

  const getOverallGrade = (totalScore: number, subjectCount: number) => {
    const average = totalScore / subjectCount;
    if (average >= 90) return 'A+';
    if (average >= 80) return 'A';
    if (average >= 70) return 'B+';
    if (average >= 60) return 'B';
    if (average >= 50) return 'C+';
    if (average >= 40) return 'C';
    if (average >= 30) return 'D';
    return 'F';
  };

  const handleCreateResult = async () => {
    if (!school) return;

    try {
      const totalScore = calculateTotalScore(resultForm.subjects);
      const overallGrade = getOverallGrade(totalScore, resultForm.subjects.length);
      
      const newResult = await sdk.insert<Result>('results', {
        id: generateUniqueId(),
        ...resultForm,
        schoolId: school.id,
        totalScore,
        grade: overallGrade,
        createdAt: new Date().toISOString()
      });
      setResults([newResult, ...results]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating result:', error);
    }
  };

  const handleUpdateResult = async () => {
    if (!selectedResult) return;

    try {
      const totalScore = calculateTotalScore(resultForm.subjects);
      const overallGrade = getOverallGrade(totalScore, resultForm.subjects.length);
      
      const updatedResult = await sdk.update<Result>('results', selectedResult.id, {
        ...resultForm,
        totalScore,
        grade: overallGrade
      });
      setResults(results.map(result => 
        result.id === selectedResult.id ? updatedResult : result
      ));
      resetForm();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedResult(null);
    } catch (error) {
      console.error('Error updating result:', error);
    }
  };

  const handleDeleteResult = async (resultId: string) => {
    try {
      await sdk.delete('results', resultId);
      setResults(results.filter(result => result.id !== resultId));
    } catch (error) {
      console.error('Error deleting result:', error);
    }
  };

  const resetForm = () => {
    setResultForm({
      studentId: '',
      classId: '',
      term: 'first',
      session: '2024-2025',
      subjects: [{ name: '', score: 0, grade: '' }],
      totalScore: 0,
      grade: '',
      position: 1,
      remarks: ''
    });
  };

  const openEditDialog = (result: Result) => {
    setSelectedResult(result);
    setResultForm({
      studentId: result.studentId,
      classId: result.classId,
      term: result.term,
      session: result.session,
      subjects: result.subjects,
      totalScore: result.totalScore,
      grade: result.grade,
      position: result.position,
      remarks: result.remarks
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const addSubject = () => {
    setResultForm({
      ...resultForm,
      subjects: [...resultForm.subjects, { name: '', score: 0, grade: '' }]
    });
  };

  const removeSubject = (index: number) => {
    const newSubjects = resultForm.subjects.filter((_, i) => i !== index);
    setResultForm({ ...resultForm, subjects: newSubjects });
  };

  const updateSubject = (index: number, field: string, value: any) => {
    const newSubjects = [...resultForm.subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setResultForm({ ...resultForm, subjects: newSubjects });
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Results Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setIsEditing(false); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Result
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Result' : 'Add New Result'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Student ID *</label>
                  <Input
                    value={resultForm.studentId}
                    onChange={(e) => setResultForm({ ...resultForm, studentId: e.target.value })}
                    placeholder="Enter student ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Class ID</label>
                  <Input
                    value={resultForm.classId}
                    onChange={(e) => setResultForm({ ...resultForm, classId: e.target.value })}
                    placeholder="Enter class ID"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Term</label>
                  <Select value={resultForm.term} onValueChange={(value) => setResultForm({ ...resultForm, term: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.map((term) => (
                        <SelectItem key={term} value={term}>
                          {term.charAt(0).toUpperCase() + term.slice(1)} Term
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Session</label>
                  <Input
                    value={resultForm.session}
                    onChange={(e) => setResultForm({ ...resultForm, session: e.target.value })}
                    placeholder="2024-2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Position</label>
                  <Input
                    type="number"
                    value={resultForm.position}
                    onChange={(e) => setResultForm({ ...resultForm, position: Number(e.target.value) })}
                    placeholder="1"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Subjects</label>
                  <Button type="button" variant="outline" size="sm" onClick={addSubject}>
                    Add Subject
                  </Button>
                </div>
                <div className="space-y-2">
                  {resultForm.subjects.map((subject, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 items-center">
                      <Input
                        placeholder="Subject name"
                        value={subject.name}
                        onChange={(e) => updateSubject(index, 'name', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Score"
                        value={subject.score}
                        onChange={(e) => updateSubject(index, 'score', Number(e.target.value))}
                      />
                      <Select
                        value={subject.grade}
                        onValueChange={(value) => updateSubject(index, 'grade', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {grades.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSubject(index)}
                        disabled={resultForm.subjects.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Remarks</label>
                <Input
                  value={resultForm.remarks}
                  onChange={(e) => setResultForm({ ...resultForm, remarks: e.target.value })}
                  placeholder="Teacher's remarks"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateResult : handleCreateResult}>
                {isEditing ? 'Update Result' : 'Add Result'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{results.length}</div>
                <p className="text-xs text-muted-foreground">Total Results</p>
              </div>
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {results.filter(r => ['A+', 'A'].includes(r.grade)).length}
            </div>
            <p className="text-xs text-muted-foreground">Excellent Grades</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {Math.round(results.reduce((acc, r) => acc + r.totalScore, 0) / results.length) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Average Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {new Set(results.map(r => r.studentId)).size}
            </div>
            <p className="text-xs text-muted-foreground">Students</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Student: {result.studentId}</CardTitle>
                  <p className="text-sm text-gray-600">{result.term} Term, {result.session}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getGradeColor(result.grade)}>
                      Grade {result.grade}
                    </Badge>
                    <Badge variant="outline">
                      Position {result.position}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(result)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteResult(result.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Score:</span>
                  <span className="text-lg font-bold">{result.totalScore}</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm font-medium">Subjects ({result.subjects.length}):</span>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {result.subjects.slice(0, 4).map((subject, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="truncate">{subject.name}</span>
                        <span>{subject.score}</span>
                      </div>
                    ))}
                    {result.subjects.length > 4 && (
                      <div className="col-span-2 text-center text-gray-500">
                        +{result.subjects.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
                
                {result.remarks && (
                  <div>
                    <span className="text-sm font-medium">Remarks:</span>
                    <p className="text-sm text-gray-600 mt-1">{result.remarks}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {results.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No results found. Add your first result to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsModule;
