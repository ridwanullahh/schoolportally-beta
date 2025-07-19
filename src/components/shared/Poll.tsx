import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import sdk from '@/lib/sdk-config';
import { useAuth } from '@/contexts/AuthContext';

const Poll = ({ classId, liveClassManager }) => {
    const { user } = useAuth();
    const [poll, setPoll] = useState(null);
    const [userVote, setUserVote] = useState(null);

    useEffect(() => {
        const unsubscribe = sdk.subscribe('class_polls', (polls) => {
            const activePoll = polls.find(p => p.classId === classId && p.status === 'open');
            setPoll(activePoll);
        });
        return () => unsubscribe();
    }, [classId]);

    const createPoll = async (question, options) => {
        const pollData = {
            classId,
            question,
            options: options.reduce((acc, option) => ({ ...acc, [option]: [] }), {}),
            status: 'open',
        };
        const newPoll = await sdk.insert('class_polls', pollData);
        liveClassManager.broadcast({ type: 'poll-created', poll: newPoll });
    };

    const handleVote = async (option) => {
        if (!poll || userVote) return; // Can't vote if no poll or already voted
        
        const updatedPoll = { ...poll };
        // Remove user from any previous vote
        Object.keys(updatedPoll.options).forEach(key => {
            updatedPoll.options[key] = updatedPoll.options[key].filter(voterId => voterId !== user.id);
        });
        
        // Add user to new vote
        updatedPoll.options[option].push(user.id);

        await sdk.update('class_polls', poll.id, { options: updatedPoll.options });
        setUserVote(option);
        liveClassManager.broadcast({ type: 'poll-voted', poll: updatedPoll });
    };

    // UI for creating a poll (teacher-only)
    if (user.userType === 'teacher' && !poll) {
        return <CreatePollForm onCreate={createPoll} />;
    }

    // UI for active poll
    if (poll) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{poll.question}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Object.keys(poll.options).map((option, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <Button
                                    onClick={() => handleVote(option)}
                                    disabled={!!userVote}
                                    variant={userVote === option ? 'default' : 'outline'}
                                >
                                    {option}
                                </Button>
                                <span>{poll.options[option].length} votes</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    return <p>No active poll.</p>;
};


const CreatePollForm = ({ onCreate }) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const handleSubmit = () => {
        if (question && options.every(o => o)) {
            onCreate(question, options);
        }
    };

    return (
        <Card>
            <CardHeader><CardTitle>Create a Poll</CardTitle></CardHeader>
            <CardContent>
                <Input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Poll Question" />
                <div className="my-4 space-y-2">
                    {options.map((option, index) => (
                        <Input key={index} value={option} onChange={e => handleOptionChange(index, e.target.value)} placeholder={`Option ${index + 1}`} />
                    ))}
                </div>
                <Button onClick={addOption}>Add Option</Button>
                <Button onClick={handleSubmit} className="ml-2">Create Poll</Button>
            </CardContent>
        </Card>
    );
};

export default Poll;