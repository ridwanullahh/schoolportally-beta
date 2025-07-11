
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';

interface Admission {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  schoolId: string;
  programId: string;
  grade: string;
  previousSchool: string;
  documents: string[];
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  notes: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  dateOfBirth: string;
  address: string;
  medicalInfo: string;
  emergencyContact: any;
  academicRecords: any[];
  extracurriculars: any[];
  interviewDate?: string;
  interviewNotes?: string;
  testScores?: any;
  financialAid: boolean;
  tuitionPlan?: string;
}

const AdmissionsModule: React.FC = () => {
  const { school } = useSchool();
  const { user } = useAuth();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [admissionForm, setAdmissionForm] = useState({
    studentName: '',
    email: '',
    phone: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    grade: '',
    previousSchool: '',
    dateOfBirth: '',
    address: '',
    medicalInfo: '',
    financialAid: false,
    notes: '',
  });

  useEffect(() => {
    fetchAdmissions();
  }, [school]);

  const fetchAdmissions = async () => {
    if (!school) return;

    setLoading(true);
    try {
      const allAdmissions = await sdk.get<Admission>('admissions');
      const schoolAdmissions = allAdmissions.filter(admission => admission.schoolId === school.id);
      setAdmissions(schoolAdmissions);
    } catch (error) {
      console.error('Error fetching admissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmission = async () => {
    if (!school) return;

    try {
      const newAdmission = await sdk.insert<Admission>('admissions', {
        ...admissionForm,
        schoolId: school.id,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        documents: [],
        academicRecords: [],
        extracurriculars: [],
        emergencyContact: {},
      });
      setAdmissions([...admissions, newAdmission]);
      setAdmissionForm({
        studentName: '',
        email: '',
        phone: '',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        grade: '',
        previousSchool: '',
        dateOfBirth: '',
        address: '',
        medicalInfo: '',
        financialAid: false,
        notes: '',
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating admission:', error);
    }
  };

  const handleUpdateStatus = async (admissionId: string, newStatus: Admission['status']) => {
    try {
      const updatedAdmission = await sdk.update<Admission>('admissions', admissionId, {
        status: newStatus,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Admin', // In real app, use current user
      });
      setAdmissions(admissions.map(admission => 
        admission.id === admissionId ? updatedAdmission : admission
      ));
    } catch (error) {
      console.error('Error updating admission status:', error);
    }
  };

  const handleDeleteAdmission = async (admissionId: string) => {
    try {
      await sdk.delete('admissions', admissionId);
      setAdmissions(admissions.filter(admission => admission.id !== admissionId));
    } catch (error) {
      console.error('Error deleting admission:', error);
    }
  };

  const filteredAdmissions = admissions.filter(admission => {
    const matchesSearch = admission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admission.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || admission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Admission['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'waitlisted': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const isAdmin = user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner');
  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You do not have permission to view this page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admissions Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Admission Application</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-2">Student Name *</label>
                <Input
                  value={admissionForm.studentName}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, studentName: e.target.value })}
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  value={admissionForm.email}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  value={admissionForm.phone}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Grade</label>
                <Input
                  value={admissionForm.grade}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, grade: e.target.value })}
                  placeholder="Enter grade level"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Parent Name</label>
                <Input
                  value={admissionForm.parentName}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, parentName: e.target.value })}
                  placeholder="Enter parent name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Parent Email</label>
                <Input
                  type="email"
                  value={admissionForm.parentEmail}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, parentEmail: e.target.value })}
                  placeholder="Enter parent email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Parent Phone</label>
                <Input
                  value={admissionForm.parentPhone}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, parentPhone: e.target.value })}
                  placeholder="Enter parent phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <Input
                  type="date"
                  value={admissionForm.dateOfBirth}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, dateOfBirth: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Address</label>
                <Textarea
                  value={admissionForm.address}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, address: e.target.value })}
                  placeholder="Enter full address"
                  rows={2}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Previous School</label>
                <Input
                  value={admissionForm.previousSchool}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, previousSchool: e.target.value })}
                  placeholder="Enter previous school name"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Medical Information</label>
                <Textarea
                  value={admissionForm.medicalInfo}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, medicalInfo: e.target.value })}
                  placeholder="Any medical conditions or allergies"
                  rows={2}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Notes</label>
                <Textarea
                  value={admissionForm.notes}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, notes: e.target.value })}
                  placeholder="Additional notes"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAdmission}>
                Create Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="waitlisted">Waitlisted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{admissions.length}</div>
            <p className="text-xs text-muted-foreground">Total Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{admissions.filter(a => a.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{admissions.filter(a => a.status === 'approved').length}</div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{admissions.filter(a => a.status === 'rejected').length}</div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAdmissions.map((admission) => (
              <div key={admission.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold">{admission.studentName}</h3>
                      <Badge className={getStatusColor(admission.status)}>
                        {admission.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Email: {admission.email}</div>
                      <div>Grade: {admission.grade}</div>
                      <div>Parent: {admission.parentName} ({admission.parentEmail})</div>
                      <div>Submitted: {new Date(admission.submittedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Application Details - {admission.studentName}</DialogTitle>
                        </DialogHeader>
                        <Tabs defaultValue="basic" className="w-full">
                          <TabsList>
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="academic">Academic</TabsTrigger>
                            <TabsTrigger value="notes">Notes & Status</TabsTrigger>
                          </TabsList>
                          <TabsContent value="basic" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="font-medium">Student Name:</label>
                                <p>{admission.studentName}</p>
                              </div>
                              <div>
                                <label className="font-medium">Email:</label>
                                <p>{admission.email}</p>
                              </div>
                              <div>
                                <label className="font-medium">Phone:</label>
                                <p>{admission.phone}</p>
                              </div>
                              <div>
                                <label className="font-medium">Date of Birth:</label>
                                <p>{admission.dateOfBirth}</p>
                              </div>
                              <div>
                                <label className="font-medium">Grade:</label>
                                <p>{admission.grade}</p>
                              </div>
                              <div>
                                <label className="font-medium">Previous School:</label>
                                <p>{admission.previousSchool}</p>
                              </div>
                            </div>
                            <div>
                              <label className="font-medium">Address:</label>
                              <p>{admission.address}</p>
                            </div>
                            <div>
                              <label className="font-medium">Parent Information:</label>
                              <p>{admission.parentName} - {admission.parentEmail} - {admission.parentPhone}</p>
                            </div>
                          </TabsContent>
                          <TabsContent value="academic">
                            <div className="space-y-4">
                              <div>
                                <label className="font-medium">Medical Information:</label>
                                <p>{admission.medicalInfo || 'None provided'}</p>
                              </div>
                              <div>
                                <label className="font-medium">Financial Aid:</label>
                                <p>{admission.financialAid ? 'Yes' : 'No'}</p>
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="notes">
                            <div className="space-y-4">
                              <div>
                                <label className="font-medium">Current Status:</label>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Select
                                    value={admission.status}
                                    onValueChange={(value) => handleUpdateStatus(admission.id, value as Admission['status'])}
                                  >
                                    <SelectTrigger className="w-48">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="approved">Approved</SelectItem>
                                      <SelectItem value="rejected">Rejected</SelectItem>
                                      <SelectItem value="waitlisted">Waitlisted</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <label className="font-medium">Notes:</label>
                                <p>{admission.notes || 'No notes available'}</p>
                              </div>
                              {admission.reviewedAt && (
                                <div>
                                  <label className="font-medium">Reviewed:</label>
                                  <p>{new Date(admission.reviewedAt).toLocaleDateString()} by {admission.reviewedBy}</p>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAdmission(admission.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredAdmissions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No applications found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdmissionsModule;
