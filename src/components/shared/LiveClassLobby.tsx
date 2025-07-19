import React, { useState, useEffect } from 'react';
import sdk from '@/lib/sdk-config';
import { useSchool } from '@/hooks/useSchool';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Link } from 'react-router-dom';

const LiveClassLobby = () => {
    const { school } = useSchool();
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        if (school) {
            const unsubscribe = sdk.subscribe('live_class_schedules', (allSchedules) => {
                setSchedules(allSchedules.filter(s => s.schoolId === school.id && s.status !== 'finished'));
            });
            return () => unsubscribe();
        }
    }, [school]);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Live Classes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedules.map(schedule => (
                    <Card key={schedule.id}>
                        <CardHeader>
                            <CardTitle>{schedule.topic}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Time:</strong> {new Date(schedule.startTime).toLocaleString()}</p>
                            <Link to={`/dashboard/live-class/${schedule.subjectId}`}>
                                <Button className="mt-4">
                                    {schedule.status === 'scheduled' ? 'Join' : 'Enter'}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
};

export default LiveClassLobby;