import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Assignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  createdAt: string;
}

interface AssignmentsProps {
  classId: string;
}

const Assignments: React.FC<AssignmentsProps> = ({ classId }) => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxScore: 100,
  });

  useEffect(() => {
    fetchAssignments();
  }, [classId]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const allAssignments = await sdk.get<Assignment>('class_assignments');
      const classAssignments = allAssignments.filter(assignment => assignment.classId === classId);
      setAssignments(classAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    try {
      const newAssignment = await sdk.insert<Assignment>('class_assignments', {
        ...assignmentForm,
        classId,
        createdAt: new Date().toISOString(),
      });
      setAssignments([...assignments, newAssignment]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleUpdateAssignment = async () => {
    if (!selectedAssignment) return;
    try {
      const updatedAssignment = await sdk.update<Assignment>('class_assignments', selectedAssignment.id, assignmentForm);
      setAssignments(assignments.map(assignment =>
        assignment.id === selectedAssignment.id ? updatedAssignment : assignment
      ));
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      await sdk.delete('class_assignments', assignmentId);
      setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const resetForm = () => {
    setAssignmentForm({
      title: '',
      description: '',
      dueDate: '',
      maxScore: 100,
    });
    setIsEditing(false);
    setSelectedAssignment(null);
  };

  const openEditDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setAssignmentForm({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      maxScore: assignment.maxScore,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const isTeacher = user?.userType === 'teacher';

  if (loading) {
    return <div>Loading assignments...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Assignments</h3>
        {isTeacher && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Assignment' : 'Add New Assignment'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Title"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                />
                <Input
                  type="date"
                  value={assignmentForm.dueDate}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Max Score"
                  value={assignmentForm.maxScore}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, maxScore: Number(e.target.value) })}
                />
                <Button onClick={isEditing ? handleUpdateAssignment : handleCreateAssignment}>
                  {isEditing ? 'Update' : 'Create'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="space-y-4">
        {assignments.map(assignment => (
          <Card key={assignment.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{assignment.title}</h4>
                <p className="text-sm text-gray-500">{assignment.description}</p>
                <p className="text-sm text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                {!isTeacher && <Button>Submit</Button>}
                {isTeacher && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(assignment)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteAssignment(assignment.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Assignments;