import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const CreateScheduleForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [startTime, setStartTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, subjectId, startTime });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Schedule a New Class</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Class Title" required />
                    <Input value={subjectId} onChange={e => setSubjectId(e.target.value)} placeholder="Subject ID" required />
                    <Input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                    <Button type="submit">Schedule</Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateScheduleForm;