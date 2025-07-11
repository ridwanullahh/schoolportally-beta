
import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Users, DollarSign } from 'lucide-react';

interface Program {
  id: string;
  name: string;
  slug: string;
  description: string;
  schoolId: string;
  type: string;
  duration: string;
  fee: number;
  capacity: number;
  enrolled: number;
  status: string;
  featuredImage: string;
  curriculum: string;
  prerequisites: string[];
  objectives: string[];
  schedule: any;
  teacherId: string;
  startDate: string;
  endDate: string;
  ageRange: string;
  certificationType: string;
}

const ProgramsModule: React.FC = () => {
  const { school } = useSchool();
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [programForm, setProgramForm] = useState({
    name: '',
    description: '',
    type: 'academic',
    duration: '',
    fee: 0,
    capacity: 30,
    curriculum: '',
    ageRange: '',
    startDate: '',
    endDate: '',
    certificationType: '',
  });

  useEffect(() => {
    fetchPrograms();
  }, [school]);

  const fetchPrograms = async () => {
    if (!school) return;

    setLoading(true);
    try {
      const allPrograms = await sdk.get<Program>('programs');
      const schoolPrograms = allPrograms.filter(program => program.schoolId === school.id);
      setPrograms(schoolPrograms);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProgram = async () => {
    if (!school) return;

    try {
      const slug = programForm.name.toLowerCase().replace(/\s+/g, '-');
      const newProgram = await sdk.insert<Program>('programs', {
        ...programForm,
        slug,
        schoolId: school.id,
        status: 'active',
        enrolled: 0,
        prerequisites: [],
        objectives: [],
        schedule: {},
        teacherId: '',
        featuredImage: '',
      });
      setPrograms([...programs, newProgram]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating program:', error);
    }
  };

  const handleUpdateProgram = async () => {
    if (!selectedProgram) return;

    try {
      const updatedProgram = await sdk.update<Program>('programs', selectedProgram.id, programForm);
      setPrograms(programs.map(program => 
        program.id === selectedProgram.id ? updatedProgram : program
      ));
      resetForm();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedProgram(null);
    } catch (error) {
      console.error('Error updating program:', error);
    }
  };

  const handleDeleteProgram = async (programId: string) => {
    try {
      await sdk.delete('programs', programId);
      setPrograms(programs.filter(program => program.id !== programId));
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  const resetForm = () => {
    setProgramForm({
      name: '',
      description: '',
      type: 'academic',
      duration: '',
      fee: 0,
      capacity: 30,
      curriculum: '',
      ageRange: '',
      startDate: '',
      endDate: '',
      certificationType: '',
    });
  };

  const openEditDialog = (program: Program) => {
    setSelectedProgram(program);
    setProgramForm({
      name: program.name,
      description: program.description,
      type: program.type,
      duration: program.duration,
      fee: program.fee,
      capacity: program.capacity,
      curriculum: program.curriculum,
      ageRange: program.ageRange,
      startDate: program.startDate,
      endDate: program.endDate,
      certificationType: program.certificationType,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const isAdmin = user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner');
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Programs Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {isAdmin && (
            <DialogTrigger asChild>
              <Button onClick={() => { setIsEditing(false); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                New Program
              </Button>
            </DialogTrigger>
          )}
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Program' : 'Create New Program'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Program Name *</label>
                <Input
                  value={programForm.name}
                  onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                  placeholder="Enter program name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <Select value={programForm.type} onValueChange={(value) => setProgramForm({ ...programForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="extracurricular">Extracurricular</SelectItem>
                    <SelectItem value="vocational">Vocational</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <Input
                  value={programForm.duration}
                  onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })}
                  placeholder="e.g., 1 year, 6 months"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Fee ($)</label>
                <Input
                  type="number"
                  value={programForm.fee}
                  onChange={(e) => setProgramForm({ ...programForm, fee: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Capacity</label>
                <Input
                  type="number"
                  value={programForm.capacity}
                  onChange={(e) => setProgramForm({ ...programForm, capacity: Number(e.target.value) })}
                  placeholder="30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Age Range</label>
                <Input
                  value={programForm.ageRange}
                  onChange={(e) => setProgramForm({ ...programForm, ageRange: e.target.value })}
                  placeholder="e.g., 5-7 years"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <Input
                  type="date"
                  value={programForm.startDate}
                  onChange={(e) => setProgramForm({ ...programForm, startDate: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <Input
                  type="date"
                  value={programForm.endDate}
                  onChange={(e) => setProgramForm({ ...programForm, endDate: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Certification</label>
                <Input
                  value={programForm.certificationType}
                  onChange={(e) => setProgramForm({ ...programForm, certificationType: e.target.value })}
                  placeholder="Certificate type"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={programForm.description}
                  onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                  placeholder="Program description"
                  rows={3}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Curriculum</label>
                <Textarea
                  value={programForm.curriculum}
                  onChange={(e) => setProgramForm({ ...programForm, curriculum: e.target.value })}
                  placeholder="Program curriculum details"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateProgram : handleCreateProgram}>
                {isEditing ? 'Update Program' : 'Create Program'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{programs.length}</div>
                <p className="text-xs text-muted-foreground">Total Programs</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{programs.filter(p => p.status === 'active').length}</div>
                <p className="text-xs text-muted-foreground">Active Programs</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{programs.reduce((acc, p) => acc + p.enrolled, 0)}</div>
                <p className="text-xs text-muted-foreground">Total Enrolled</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">${programs.reduce((acc, p) => acc + (p.fee * p.enrolled), 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{program.type}</Badge>
                    <Badge className={program.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {program.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {isAdmin && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(program)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteProgram(program.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{program.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span>{program.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fee:</span>
                  <span className="font-medium">${program.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Enrolled:</span>
                  <span>{program.enrolled}/{program.capacity}</span>
                </div>
                {program.ageRange && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Age Range:</span>
                    <span>{program.ageRange}</span>
                  </div>
                )}
                {program.startDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Start Date:</span>
                    <span>{new Date(program.startDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(program.enrolled / program.capacity) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((program.enrolled / program.capacity) * 100)}% filled
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {programs.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No programs found. Create your first program to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramsModule;
