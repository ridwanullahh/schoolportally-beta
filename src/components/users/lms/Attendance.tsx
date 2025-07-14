import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface AttendanceRecord {
  id: string;
  classId: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

interface AttendanceProps {
  classId: string;
}

const Attendance: React.FC<AttendanceProps> = ({ classId }) => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
    fetchAttendance();
  }, [classId, date]);

  const fetchStudents = async () => {
    try {
      const allUsers = await sdk.get<any>('users');
      const allClasses = await sdk.get<any>('classes');
      const classDetails = allClasses.find(cls => cls.id === classId);
      const studentUsers = allUsers.filter(user => classDetails.students.includes(user.id));
      setStudents(studentUsers);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const allAttendance = await sdk.get<AttendanceRecord>('class_attendance');
      const classAttendance = allAttendance.filter(record => record.classId === classId && record.date === date);
      setAttendance(classAttendance);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = async (studentId: string, status: 'present' | 'absent' | 'late') => {
    try {
      const existingRecord = attendance.find(record => record.studentId === studentId);
      if (existingRecord) {
        await sdk.update('class_attendance', existingRecord.id, { status });
      } else {
        await sdk.insert('class_attendance', {
          classId,
          studentId,
          date,
          status,
          createdAt: new Date().toISOString(),
        });
      }
      fetchAttendance();
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const isTeacher = user?.userType === 'teacher';

  if (loading) {
    return <div>Loading attendance...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Attendance</h3>
        {isTeacher && (
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-48"
          />
        )}
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {students.map(student => {
              const record = attendance.find(r => r.studentId === student.id);
              return (
                <div key={student.id} className="flex justify-between items-center">
                  <span>{student.firstName} {student.lastName}</span>
                  {isTeacher ? (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`present-${student.id}`}
                          checked={record?.status === 'present'}
                          onCheckedChange={() => handleAttendanceChange(student.id, 'present')}
                        />
                        <label htmlFor={`present-${student.id}`}>Present</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`absent-${student.id}`}
                          checked={record?.status === 'absent'}
                          onCheckedChange={() => handleAttendanceChange(student.id, 'absent')}
                        />
                        <label htmlFor={`absent-${student.id}`}>Absent</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`late-${student.id}`}
                          checked={record?.status === 'late'}
                          onCheckedChange={() => handleAttendanceChange(student.id, 'late')}
                        />
                        <label htmlFor={`late-${student.id}`}>Late</label>
                      </div>
                    </div>
                  ) : (
                    <span>{record?.status || 'Not Recorded'}</span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;