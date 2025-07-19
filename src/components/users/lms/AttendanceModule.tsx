import React, { useState, useEffect } from 'react';
import sdk from '@/lib/sdk-config';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const AttendanceModule = () => {
    const { user } = useAuth();
    const { school } = useSchool();
    const { toast } = useToast();
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [attendance, setAttendance] = useState({});

    useEffect(() => {
        if (user && school) {
            fetchSubjects();
        }
    }, [user, school]);

    useEffect(() => {
        if(selectedSubject) {
            fetchStudents();
        }
    }, [selectedSubject]);

    const fetchSubjects = async () => {
        const allSubjects = await sdk.get('subjects');
        const teacherSubjects = allSubjects.filter(s => s.schoolId === school.id && s.teacherIds.includes(user.id));
        setSubjects(teacherSubjects);
    }
    
    const fetchStudents = async () => {
        const subject = subjects.find(s => s.id === selectedSubject);
        if(subject) {
            const allUsers = await sdk.get('users');
            const subjectStudents = allUsers.filter(u => subject.students.includes(u.id) && !subject.disabledStudents.includes(u.id));
            setStudents(subjectStudents);
        }
    }

    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    }

    const submitAttendance = async () => {
        const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const records = Object.keys(attendance).map(studentId => ({
            subjectId: selectedSubject,
            studentId,
            date,
            status: attendance[studentId]
        }));
        
        await sdk.bulkInsert('subject_attendance', records);
        toast({ title: "Success", description: "Attendance submitted." });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Take Attendance</CardTitle>
            </CardHeader>
            <CardContent>
                <Select onValueChange={setSelectedSubject} value={selectedSubject}>
                    <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                    <SelectContent>
                        {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                </Select>

                {selectedSubject && (
                    <div className="mt-4">
                        {students.map(student => (
                            <div key={student.id} className="flex items-center justify-between p-2 border-b">
                                <p>{student.firstName} {student.lastName}</p>
                                <div className="flex gap-2">
                                    <label className="flex items-center gap-1">
                                        <Checkbox checked={attendance[student.id] === 'present'} onCheckedChange={() => handleAttendanceChange(student.id, 'present')} /> Present
                                    </label>
                                    <label className="flex items-center gap-1">
                                        <Checkbox checked={attendance[student.id] === 'absent'} onCheckedChange={() => handleAttendanceChange(student.id, 'absent')} /> Absent
                                    </label>
                                     <label className="flex items-center gap-1">
                                        <Checkbox checked={attendance[student.id] === 'late'} onCheckedChange={() => handleAttendanceChange(student.id, 'late')} /> Late
                                    </label>
                                </div>
                            </div>
                        ))}
                        <Button onClick={submitAttendance} className="mt-4">Submit Attendance</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default AttendanceModule;