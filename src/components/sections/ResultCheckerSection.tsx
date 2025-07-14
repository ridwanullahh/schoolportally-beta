import React, { useState } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/result-checker.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ResultCheckerSectionProps {
  section: Section;
}

const ResultCheckerSection: React.FC<ResultCheckerSectionProps> = ({ section }) => {
  const { title, steps } = section.content;
  const styleId = section.styleId || 'result_checker-form-panel';
  const [studentId, setStudentId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleCheckResult = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (studentId === '12345') {
        setResult({
          name: 'John Doe',
          grade: 'A',
          status: 'Pass',
          subjects: [
            { name: 'Mathematics', score: 95 },
            { name: 'English', score: 88 },
            { name: 'Science', score: 92 },
          ],
        });
      } else {
        setResult(null);
        alert('Student ID not found.');
      }
      setLoading(false);
    }, 1500);
  };
  
  const renderContent = () => {
    if (styleId === 'result_checker-step-by-step-checker') {
      return (
        <div className="checker-container">
          <div className="steps-indicator">
            {steps?.map((step: any, index: number) => (
              <div key={index} className={`step-progress ${currentStep === index ? 'active' : ''}`}>
                {index + 1}
              </div>
            ))}
          </div>
          <div className="form-panel">
            <div className="form-group">
              <Label htmlFor="studentId">{steps[currentStep]?.label || 'Student ID'}</Label>
              <Input
                id="studentId"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter Student ID"
              />
            </div>
            <Button onClick={() => setCurrentStep(s => s + 1)} disabled={currentStep >= steps.length - 1}>
              Next
            </Button>
            {currentStep === steps.length - 1 && (
              <Button onClick={handleCheckResult} disabled={loading}>
                {loading ? 'Checking...' : 'Check Result'}
              </Button>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="checker-container">
        <div className="form-panel">
          <div className="form-group">
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter Student ID"
            />
          </div>
          <Button onClick={handleCheckResult} disabled={loading}>
            {loading ? 'Checking...' : 'Check Result'}
          </Button>
        </div>

        {result && (
          <div className="result-display mt-8">
            <h3 className="text-2xl font-bold mb-4">Result for {result.name}</h3>
            <p className="text-lg">Overall Grade: <span className="font-bold">{result.grade}</span></p>
            <p className="text-lg mb-4">Status: <span className="font-bold">{result.status}</span></p>
            <h4 className="text-xl font-bold mb-2">Subject Scores:</h4>
            <ul>
              {result.subjects.map((subject: any, index: number) => (
                <li key={index}>{subject.name}: {subject.score}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <section className={`result-checker-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default ResultCheckerSection;