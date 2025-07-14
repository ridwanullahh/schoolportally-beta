import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

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

  useEffect(() => {
    fetchResults();
  }, [school, user]);

  const fetchResults = async () => {
    if (!school || !user) return;

    setLoading(true);
    try {
      const allResults = await sdk.get<Result>('results');
      let userResults = [];

      if (user.userType === 'student') {
        userResults = allResults.filter(result => result.schoolId === school.id && result.studentId === user.id);
      } else if (user.userType === 'parent') {
        // This assumes that a parent has a list of their children's IDs
        // You may need to fetch this list first
        // For now, we'll assume the user object has a `children` array
        const childrenIds = user.children || [];
        userResults = allResults.filter(result => result.schoolId === school.id && childrenIds.includes(result.studentId));
      }
      
      setResults(userResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
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
        <h2 className="text-2xl font-bold">My Results</h2>
      </div>

      {results.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          No results have been published for you yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{result.term} Term, {result.session}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getGradeColor(result.grade)}>
                        Grade {result.grade}
                      </Badge>
                      <Badge variant="outline">
                        Position {result.position}
                      </Badge>
                    </div>
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
                      {result.subjects.map((subject, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="truncate">{subject.name}</span>
                          <span>{subject.score}</span>
                        </div>
                      ))}
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
        </div>
      )}
    </div>
  );
};

export default ResultsModule;