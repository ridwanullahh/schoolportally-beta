import React, { useState, useEffect } from 'react';
import sdk from '../../lib/sdk-config';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MultiSelect } from '../ui/multi-select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

const SubjectsModule = ({ schoolId }) => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDescription, setNewSubjectDescription] = useState('');
  const [newSubjectTeachers, setNewSubjectTeachers] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);
  const [isEnrollmentDialogOpen, setIsEnrollmentDialogOpen] = useState(false);
  const [selectedSubjectForEnrollment, setSelectedSubjectForEnrollment] = useState(null);
  const [disabledStudents, setDisabledStudents] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (schoolId) {
      fetchClasses();
      fetchTeachers();
    }
  }, [schoolId]);

  useEffect(() => {
    if (selectedClass) {
      fetchSubjects(selectedClass);
      fetchStudents(selectedClass);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    const res = await sdk.get('classes');
    setClasses(res.filter(c => c.schoolId === schoolId));
  };

  const fetchTeachers = async () => {
    const res = await sdk.get('users');
    setTeachers(res.filter(u => u.schoolId === schoolId && u.userType === 'teacher'));
  };

  const fetchStudents = async (classId) => {
    const klasses = await sdk.get('classes');
    const targetClass = klasses.find(c => c.id === classId);
    if (targetClass) {
        const allUsers = await sdk.get('users');
        const studentDetails = allUsers.filter(u => targetClass.students.includes(u.id));
        setStudents(studentDetails);
    }
  }

  const fetchSubjects = async (classId) => {
    const res = await sdk.get('subjects');
    setSubjects(res.filter(s => s.classId === classId));
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName || !selectedClass) return;

    await sdk.insert('subjects', {
      schoolId,
      classId: selectedClass,
      name: newSubjectName,
      description: newSubjectDescription,
      teacherIds: newSubjectTeachers,
      students: students.map(s => s.id),
      disabledStudents: [],
      materials: [],
      assignments: [],
      attendance: []
    });

    fetchSubjects(selectedClass);
    setNewSubjectName('');
    setNewSubjectDescription('');
    setNewSubjectTeachers([]);
    toast({ title: 'Success', description: 'Subject created' });
  };

  const openEnrollmentDialog = (subject) => {
    setSelectedSubjectForEnrollment(subject);
    setDisabledStudents(subject.disabledStudents || []);
    setIsEnrollmentDialogOpen(true);
  };

  const handleUpdateEnrollment = async () => {
    if (!selectedSubjectForEnrollment) return;
    
    await sdk.update('subjects', selectedSubjectForEnrollment.id, {
        ...selectedSubjectForEnrollment,
        disabledStudents
    });

    fetchSubjects(selectedClass);
    setIsEnrollmentDialogOpen(false);
    toast({title: "Success", description: "Enrollment updated"})
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Subjects</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={setSelectedClass} value={selectedClass}>
          <SelectTrigger>
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedClass && (
          <div className="mt-4">
            <form onSubmit={handleCreateSubject} className="p-4 border rounded mb-4">
              <h3 className="text-lg font-semibold">New Subject</h3>
              <Input
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Subject Name"
                className="my-2"
              />
              <Input
                value={newSubjectDescription}
                onChange={(e) => setNewSubjectDescription(e.target.value)}
                placeholder="Subject Description"
                className="my-2"
              />
              <MultiSelect
                options={teachers.map((t) => ({ value: t.id, label: `${t.firstName} ${t.lastName}` }))}
                selected={newSubjectTeachers}
                onChange={setNewSubjectTeachers}
                placeholder="Select Teachers"
              />
              <Button type="submit" className="mt-4">Create Subject</Button>
            </form>

            <div className="space-y-2">
              {subjects.map((subject) => (
                <div key={subject.id} className="p-4 border rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">{subject.name}</h4>
                    <p>{subject.description}</p>
                    <p className="text-sm text-gray-500">
                      Teachers: {subject.teacherIds.map(id => teachers.find(t => t.id === id)?.firstName).join(', ')}
                    </p>
                  </div>
                  <div>
                    <Button onClick={() => openEnrollmentDialog(subject)} className="mr-2">Manage Enrollment</Button>
                    {/* Add Edit/Delete buttons here */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Dialog open={isEnrollmentDialogOpen} onOpenChange={setIsEnrollmentDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Enrollment for {selectedSubjectForEnrollment?.name}</DialogTitle>
                </DialogHeader>
                <MultiSelect 
                    options={students.map(s => ({value: s.id, label: `${s.firstName} ${s.lastName}`}))}
                    selected={disabledStudents}
                    onChange={setDisabledStudents}
                    placeholder="Select students to disable"
                />
                <Button onClick={handleUpdateEnrollment} className="mt-4">Update Enrollment</Button>
            </DialogContent>
        </Dialog>

      </CardContent>
    </Card>
  );
};

export default SubjectsModule;