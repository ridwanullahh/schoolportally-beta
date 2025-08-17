import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import CreateScheduleForm from '@/components/shared/CreateScheduleForm';

const LiveClassLobbyPage = () => {
    const { user } = useAuth();
    const [schedules, setSchedules] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        const unsubscribe = sdk.subscribe('live_class_schedules', (allSchedules) => {
            // Add permission checks here based on user enrollment, etc.
            setSchedules(allSchedules);
        });
        return () => unsubscribe();
    }, []);

    const handleCreateSchedule = async (scheduleData) => {
        await sdk.insert('live_class_schedules', { ...scheduleData, schoolId: user.schoolId, teacherId: user.id, status: 'scheduled' });
        setShowCreateForm(false);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Live Class Lobby</h1>
                {user.userType === 'teacher' && (
                    <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                        {showCreateForm ? 'Cancel' : 'Schedule a Class'}
                    </Button>
                )}
            </div>

            {showCreateForm && <CreateScheduleForm onSubmit={handleCreateSchedule} />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {schedules.map(schedule => (
                    <Card key={schedule.id}>
                        <CardHeader>
                            <CardTitle>{schedule.topic}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Subject:</strong> {schedule.subjectId}</p>
                            <p><strong>Time:</strong> {new Date(schedule.startTime).toLocaleString()}</p>
                            <p><strong>Status:</strong> {schedule.status}</p>
                            <Link to={`/school/live-class/${schedule.subjectId}`}>
                                <Button className="mt-4">
                                    {user.userType === 'teacher' ? 'Start Class' : 'Join Class'}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default LiveClassLobbyPage;