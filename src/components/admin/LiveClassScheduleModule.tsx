import React, { useState, useEffect } from 'react';
import sdk from '../../lib/sdk-config';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const LiveClassScheduleModule = ({ schoolId }) => {
    const [subjects, setSubjects] = useState([]);
    const [newSchedule, setNewSchedule] = useState({ subjectId: '', topic: '', startTime: '', accessCode: '' });
    const [schedules, setSchedules] = useState([]);
    const { toast } = useToast();

    useEffect(() => {
        if(schoolId) {
            fetchSubjects();
            fetchSchedules();
        }
    }, [schoolId]);

    const fetchSubjects = async () => {
        const allSubjects = await sdk.get('subjects');
        setSubjects(allSubjects.filter(s => s.schoolId === schoolId));
    }

    const fetchSchedules = async () => {
        const allSchedules = await sdk.get('live_class_schedules');
        setSchedules(allSchedules.filter(s => s.schoolId === schoolId));
    }

    const handleCreateSchedule = async () => {
        if(!newSchedule.subjectId || !newSchedule.topic || !newSchedule.startTime) {
            toast({ title: 'Error', description: 'Please fill all fields.' });
            return;
        }

        await sdk.insert('live_class_schedules', { ...newSchedule, schoolId, status: 'scheduled' });
        fetchSchedules();
        setNewSchedule({ subjectId: '', topic: '', startTime: '', accessCode: '' });
        toast({ title: 'Success', description: 'Live class scheduled.' });
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Live Class Schedule</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <Select onValueChange={(value) => setNewSchedule({...newSchedule, subjectId: value})} value={newSchedule.subjectId}>
                        <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                        <SelectContent>
                            {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input placeholder="Topic" value={newSchedule.topic} onChange={e => setNewSchedule({...newSchedule, topic: e.target.value})} />
                    <Input type="datetime-local" value={newSchedule.startTime} onChange={e => setNewSchedule({...newSchedule, startTime: e.target.value})} />
                    <Input placeholder="Access Code (optional)" value={newSchedule.accessCode} onChange={e => setNewSchedule({...newSchedule, accessCode: e.target.value})} />
                    <Button onClick={handleCreateSchedule}>Schedule Live Class</Button>
                </div>

                <div className="space-y-2">
                    {schedules.map(schedule => (
                        <div key={schedule.id} className="p-4 border rounded">
                            <p><strong>Topic:</strong> {schedule.topic}</p>
                            <p><strong>Subject:</strong> {subjects.find(s => s.id === schedule.subjectId)?.name}</p>
                            <p><strong>Time:</strong> {new Date(schedule.startTime).toLocaleString()}</p>
                           {schedule.accessCode && <p><strong>Access Code:</strong> {schedule.accessCode}</p>}
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <h3 className="text-lg font-semibold">Security</h3>
                    <p className="text-gray-500">Granular security controls for live classes coming soon.</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default LiveClassScheduleModule;