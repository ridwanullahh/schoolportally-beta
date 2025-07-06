
import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Briefcase, Users, Calendar, Mail } from 'lucide-react';

interface Job {
  id: string;
  schoolId: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  type: string;
  location: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  status: string;
  postedAt: string;
  closingDate: string;
  applications: any[];
  contactEmail: string;
  benefits: string[];
}

const JobsModule: React.FC = () => {
  const { school } = useSchool();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    responsibilities: '',
    type: 'full-time',
    location: '',
    salaryMin: 0,
    salaryMax: 0,
    salaryCurrency: 'NGN',
    status: 'active',
    closingDate: '',
    contactEmail: '',
    benefits: ''
  });

  const departments = ['academic', 'administration', 'support', 'facilities', 'transport', 'security', 'health'];
  const jobTypes = ['full-time', 'part-time', 'contract', 'temporary', 'volunteer'];

  useEffect(() => {
    fetchJobs();
  }, [school]);

  const fetchJobs = async () => {
    if (!school) return;

    setLoading(true);
    try {
      const allJobs = await sdk.get<Job>('jobs');
      const schoolJobs = allJobs.filter(job => job.schoolId === school.id);
      setJobs(schoolJobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    if (!school) return;

    try {
      const requirements = jobForm.requirements.split('\n').filter(req => req.trim());
      const responsibilities = jobForm.responsibilities.split('\n').filter(resp => resp.trim());
      const benefits = jobForm.benefits.split('\n').filter(benefit => benefit.trim());
      
      const newJob = await sdk.insert<Job>('jobs', {
        ...jobForm,
        schoolId: school.id,
        requirements,
        responsibilities,
        benefits,
        salaryRange: jobForm.salaryMin > 0 ? {
          min: jobForm.salaryMin,
          max: jobForm.salaryMax,
          currency: jobForm.salaryCurrency
        } : undefined,
        applications: [],
        postedAt: new Date().toISOString()
      });
      setJobs([newJob, ...jobs]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const handleUpdateJob = async () => {
    if (!selectedJob) return;

    try {
      const requirements = jobForm.requirements.split('\n').filter(req => req.trim());
      const responsibilities = jobForm.responsibilities.split('\n').filter(resp => resp.trim());
      const benefits = jobForm.benefits.split('\n').filter(benefit => benefit.trim());
      
      const updatedJob = await sdk.update<Job>('jobs', selectedJob.id, {
        ...jobForm,
        requirements,
        responsibilities,
        benefits,
        salaryRange: jobForm.salaryMin > 0 ? {
          min: jobForm.salaryMin,
          max: jobForm.salaryMax,
          currency: jobForm.salaryCurrency
        } : undefined
      });
      setJobs(jobs.map(job => 
        job.id === selectedJob.id ? updatedJob : job
      ));
      resetForm();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await sdk.delete('jobs', jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const resetForm = () => {
    setJobForm({
      title: '',
      department: '',
      description: '',
      requirements: '',
      responsibilities: '',
      type: 'full-time',
      location: '',
      salaryMin: 0,
      salaryMax: 0,
      salaryCurrency: 'NGN',
      status: 'active',
      closingDate: '',
      contactEmail: '',
      benefits: ''
    });
  };

  const openEditDialog = (job: Job) => {
    setSelectedJob(job);
    setJobForm({
      title: job.title,
      department: job.department,
      description: job.description,
      requirements: job.requirements.join('\n'),
      responsibilities: job.responsibilities.join('\n'),
      type: job.type,
      location: job.location,
      salaryMin: job.salaryRange?.min || 0,
      salaryMax: job.salaryRange?.max || 0,
      salaryCurrency: job.salaryRange?.currency || 'NGN',
      status: job.status,
      closingDate: job.closingDate,
      contactEmail: job.contactEmail,
      benefits: job.benefits.join('\n')
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      academic: 'bg-blue-100 text-blue-800',
      administration: 'bg-purple-100 text-purple-800',
      support: 'bg-green-100 text-green-800',
      facilities: 'bg-orange-100 text-orange-800',
      transport: 'bg-yellow-100 text-yellow-800',
      security: 'bg-red-100 text-red-800',
      health: 'bg-pink-100 text-pink-800'
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Jobs & Careers</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setIsEditing(false); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Post Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Job' : 'Post New Job'}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Job Details</TabsTrigger>
                <TabsTrigger value="compensation">Compensation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title *</label>
                  <Input
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    placeholder="e.g., Mathematics Teacher"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Department</label>
                    <Select value={jobForm.department} onValueChange={(value) => setJobForm({ ...jobForm, department: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept.charAt(0).toUpperCase() + dept.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Type</label>
                    <Select value={jobForm.type} onValueChange={(value) => setJobForm({ ...jobForm, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      placeholder="e.g., Lagos, Nigeria"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <Select value={jobForm.status} onValueChange={(value) => setJobForm({ ...jobForm, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Application Deadline</label>
                    <Input
                      type="date"
                      value={jobForm.closingDate}
                      onChange={(e) => setJobForm({ ...jobForm, closingDate: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Email</label>
                    <Input
                      type="email"
                      value={jobForm.contactEmail}
                      onChange={(e) => setJobForm({ ...jobForm, contactEmail: e.target.value })}
                      placeholder="hr@school.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Job Description *</label>
                  <Textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    placeholder="Describe the job role and what the candidate will be doing"
                    rows={6}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Requirements (one per line)</label>
                  <Textarea
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    placeholder="Bachelor's degree in Education&#10;5+ years teaching experience&#10;Strong communication skills"
                    rows={6}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Responsibilities (one per line)</label>
                  <Textarea
                    value={jobForm.responsibilities}
                    onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                    placeholder="Prepare and deliver lessons&#10;Assess student progress&#10;Maintain class discipline"
                    rows={6}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Benefits (one per line)</label>
                  <Textarea
                    value={jobForm.benefits}
                    onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value })}
                    placeholder="Health insurance&#10;Professional development opportunities&#10;Flexible working hours"
                    rows={4}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="compensation" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Salary Range</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                      <Input
                        type="number"
                        value={jobForm.salaryMin}
                        onChange={(e) => setJobForm({ ...jobForm, salaryMin: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                      <Input
                        type="number"
                        value={jobForm.salaryMax}
                        onChange={(e) => setJobForm({ ...jobForm, salaryMax: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Currency</label>
                      <Select value={jobForm.salaryCurrency} onValueChange={(value) => setJobForm({ ...jobForm, salaryCurrency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NGN">NGN</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateJob : handleCreateJob}>
                {isEditing ? 'Update Job' : 'Post Job'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{jobs.length}</div>
                <p className="text-xs text-muted-foreground">Total Jobs</p>
              </div>
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{jobs.filter(j => j.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Active Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{jobs.reduce((acc, j) => acc + j.applications.length, 0)}</div>
            <p className="text-xs text-muted-foreground">Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">Departments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getDepartmentColor(job.department)}>
                      {job.department}
                    </Badge>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    <Badge variant="outline">{job.type}</Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(job)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteJob(job.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{job.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span>{job.location}</span>
                </div>
                
                {job.salaryRange && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Salary:</span>
                    <span className="font-medium">
                      {job.salaryRange.currency} {job.salaryRange.min.toLocaleString()} - {job.salaryRange.max.toLocaleString()}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Applications:</span>
                  <span>{job.applications.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Posted:</span>
                  <span>{new Date(job.postedAt).toLocaleDateString()}</span>
                </div>
                
                {job.closingDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deadline:</span>
                    <span className={new Date(job.closingDate) < new Date() ? 'text-red-600 font-medium' : ''}>
                      {new Date(job.closingDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {job.contactEmail && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contact:</span>
                    <span className="text-blue-600">{job.contactEmail}</span>
                  </div>
                )}
              </div>
              
              {job.requirements.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">Key Requirements:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <span className="line-clamp-1">{req}</span>
                      </li>
                    ))}
                    {job.requirements.length > 3 && (
                      <li className="text-blue-600">+{job.requirements.length - 3} more requirements</li>
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {jobs.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No jobs posted yet. Create your first job posting to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsModule;
