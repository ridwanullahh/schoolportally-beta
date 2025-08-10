import React, { useState } from 'react';
import { Section } from '@/types';
import { useResults } from '@/hooks/useResults';
import '@/themes/styles/sections/result-checker-modern.css';
import '@/themes/styles/sections/all-remaining-ultra-modern.css';
import '@/themes/styles/sections/result-checker-section-styles.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, FileText, Download, Eye, Check, X, Clock, Award } from 'lucide-react';

interface ResultCheckerSectionProps {
  section: Section;
}

const ResultCheckerSection: React.FC<ResultCheckerSectionProps> = ({ section }) => {
  const { title } = section.content;

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'result-checker-modern-centered',
      '2': 'result-checker-modern-split',
      '3': 'result-checker-modern-minimal',
      '4': 'result-checker-modern-bordered',
      '5': 'result-checker-modern-gradient',
      '6': 'result-checker-modern-card',
      '7': 'result-checker-modern-compact',
      '8': 'result-checker-modern-asymmetric',
      '9': 'result-checker-modern-typography',
      '10': 'result-checker-modern-two-column',
      '11': 'result-checker-modern-floating',
      // Existing ultra-modern styles (12+)
      '12': 'result-checker-floating-glass',
      '13': 'result-checker-holographic-display',
      '14': 'result-checker-neon-interface',
      '15': 'result-checker-particle-bg',
      '16': 'result-checker-morphing-form',
      '17': 'result-checker-cyber-grid',
      '18': 'result-checker-liquid-metal',
      '19': 'result-checker-aurora-bg',
      '20': 'result-checker-matrix-rain',
      '21': 'result-checker-quantum-field',
      '22': 'result-checker-neural-network',
      '23': 'result-checker-hologram-effect',
      '24': 'result-checker-energy-waves',
      '25': 'result-checker-digital-rain',
      '26': 'result-checker-mosaic-layout'
    };
    return styleMap[styleNumber] || 'result-checker-modern-centered';
  };

  const styleId = getStyleId(section.styleId || '1');
  const [studentId, setStudentId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Use dynamic content from results admin module
  const { results, loading: resultsLoading, error, getStudentResult } = useResults();

  const handleCheckResult = async () => {
    if (!studentId.trim()) return;

    setLoading(true);
    try {
      // Try to get result from dynamic hook first
      const dynamicResult = await getStudentResult(studentId);
      if (dynamicResult) {
        setResult(dynamicResult);
      } else {
        // Fallback to demo data
        if (studentId === '12345') {
          setResult({
            id: '1',
            studentId: '12345',
            name: 'John Doe',
            class: 'Grade 12A',
            term: 'Fall 2024',
            overallGrade: 'A',
            gpa: 3.8,
            status: 'Pass',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
            subjects: [
              { name: 'Mathematics', score: 95, grade: 'A', credits: 4 },
              { name: 'English', score: 88, grade: 'B+', credits: 3 },
              { name: 'Science', score: 92, grade: 'A-', credits: 4 },
              { name: 'History', score: 85, grade: 'B', credits: 3 },
              { name: 'Physical Education', score: 90, grade: 'A-', credits: 2 }
            ],
            totalCredits: 16,
            remarks: 'Excellent performance. Keep up the good work!',
            publishedDate: '2024-11-20'
          });
        } else {
          setResult(null);
          alert('Student ID not found.');
        }
      }
    } catch (error) {
      console.error('Error fetching result:', error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };
  
  const renderContent = () => {
    if (resultsLoading) {
      return (
        <div className="results-container">
          <div className="loading-state">Loading result checker...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="results-container">
          <div className="error-state">Error loading result checker. Please try again.</div>
        </div>
      );
    }

    return (
      <div className="results-container">
        <div className="result-card">
          <div className="form-panel">
            <div className="form-group">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter Student ID (try: 12345)"
              />
            </div>
            <Button onClick={handleCheckResult} disabled={loading}>
              {loading ? 'Checking...' : 'Check Result'}
            </Button>
          </div>

          {result && (
            <div className="result-display">
              {result.image && (
                <img
                  src={result.image}
                  alt="Result"
                  className="result-image"
                />
              )}
              <div className="result-title">Result for {result.name}</div>
              <div className="result-type">Class: {result.class}</div>
              <div className="result-term">Term: {result.term}</div>
              <div className="result-grade">Overall Grade: {result.overallGrade}</div>
              <div className="result-gpa">GPA: {result.gpa}</div>
              <div className="result-status">Status: {result.status}</div>

              {result.subjects && (
                <div className="subjects-list">
                  <h4>Subject Scores:</h4>
                  {result.subjects.map((subject: any, index: number) => (
                    <div key={index} className="subject-score">
                      <span>{subject.name}</span>
                      <span>{subject.score}% ({subject.grade})</span>
                    </div>
                  ))}
                </div>
              )}

              {result.remarks && (
                <div className="result-description">{result.remarks}</div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <section className={`result-checker-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default ResultCheckerSection;