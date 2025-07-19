import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import sdk from '@/lib/sdk-config';
import { useAuth } from '@/contexts/AuthContext';

const QandA = ({ classId }) => {
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');

    const handleAskQuestion = async () => {
        if (!newQuestion) return;
        const question = {
            classId,
            userId: user.id,
            question: newQuestion,
            answered: false
        };
        await sdk.insert('class_questions', question);
        setNewQuestion('');
    };
    
    // In a real implementation, we would subscribe to updates
    // For now, we'll just add to the local state for immediate feedback
    const fetchQuestions = async () => {
        const allQuestions = await sdk.get('class_questions');
        setQuestions(allQuestions.filter(q => q.classId === classId));
    }

    // fetch on mount
    React.useEffect(() => {
        fetchQuestions();
    }, [classId])


    return (
        <div className="p-4">
            <h3 className="text-lg font-bold mb-4">Q&A</h3>
            <div className="flex gap-2 mb-4">
                <Input value={newQuestion} onChange={e => setNewQuestion(e.target.value)} placeholder="Ask a question" />
                <Button onClick={handleAskQuestion}>Ask</Button>
            </div>
            <div className="space-y-2">
                {questions.map((q, i) => (
                    <div key={i} className="p-2 bg-gray-700 rounded-lg">
                        <p>{q.question}</p>
                        {/* UI for answers would go here */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QandA;