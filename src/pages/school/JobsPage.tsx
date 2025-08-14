import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { usePages } from '@/hooks/usePages';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import sdk from '@/lib/sdk-config';
import { Calendar, Clock, Users, MapPin, Search, Filter, ArrowRight, ChevronLeft, ChevronRight, Briefcase, DollarSign, Building } from 'lucide-react';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';




interface Job {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  department: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  level: 'entry' | 'mid' | 'senior' | 'executive';
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  qualifications: string[];
  experience: string;
  skills: string[];
  applicationDeadline: string;
  startDate: string;
  contactEmail: string;
  contactPerson: string;
  status: 'open' | 'closed' | 'filled';
  applicants: number;
  postedDate: string;
  createdAt: string;
  updatedAt?: string;
}

const JobsPage = () => {
  const { school } = useSchool();
  const { schoolSlug } = useParams();
  const { pages } = usePages();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get('department') || 'all');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [departments, setDepartments] = useState<string[]>([]);

  const jobsPerPage = 12;

  useEffect(() => {
    const fetchJobs = async () => {
      if (school) {
        setLoading(true);
        try {
          const allJobs = await sdk.get<Job>('jobs');
          const schoolJobs = allJobs.filter((j: Job) =>
            j.schoolId === school.id && j.status === 'open'
          );
          setJobs(schoolJobs);

          // Extract unique departments
          const uniqueDepartments = Array.from(
            new Set(schoolJobs.map(job => job.department).filter(Boolean))
          );
          setDepartments(uniqueDepartments);
        } catch (error) {
          console.error('Failed to fetch jobs:', error);
          setJobs([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchJobs();
  }, [school]);

  useEffect(() => {
    let filtered = [...jobs];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(job => job.department === selectedDepartment);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(job => job.level === selectedLevel);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'department':
          return a.department.localeCompare(b.department);
        case 'salary':
          return b.salary.max - a.salary.max;
        case 'deadline':
          return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
        case 'newest':
        default:
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      }
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedDepartment, selectedType, selectedLevel, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (salary: Job['salary']) => {
    if (salary.min === salary.max) {
      return `${salary.currency}${salary.min.toLocaleString()}`;
    }
    return `${salary.currency}${salary.min.toLocaleString()} - ${salary.currency}${salary.max.toLocaleString()}`;
  };

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  const renderJobCard = (job: Job, index?: number) => {
    // Default card layout for most templates
    return (
      <article key={job.id} className="post-card">
        <div className="post-content">
          <div className="post-meta">
            <div className="post-meta-item">
              <Building className="h-4 w-4" />
              <span>{job.department}</span>
            </div>
            <div className="post-meta-item">
              <Briefcase className="h-4 w-4" />
              <span>{job.type}</span>
            </div>
            <div className="post-meta-item">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="post-meta-item">
              <DollarSign className="h-4 w-4" />
              <span>{formatSalary(job.salary)}</span>
            </div>
            <div className="post-meta-item">
              <Calendar className="h-4 w-4" />
              <span>Deadline: {formatDate(job.applicationDeadline)}</span>
            </div>
          </div>
          <span className="post-category">{job.department}</span>
          <h2 className="post-title">
            <Link to={`/${schoolSlug}/jobs/${job.id}`}>
              {job.title}
            </Link>
          </h2>
          <p className="post-excerpt">{job.description}</p>
          <div className="job-details">
            <p><strong>Level:</strong> {job.level}</p>
            <p><strong>Experience:</strong> {job.experience}</p>
            <p><strong>Posted:</strong> {formatDate(job.postedDate)}</p>
            {job.skills && job.skills.length > 0 && (
              <p><strong>Skills:</strong> {job.skills.slice(0, 3).join(', ')}</p>
            )}
          </div>
          <Link to={`/${schoolSlug}/jobs/${job.id}`} className="read-more">
            Apply Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    );
  };

  if (!school) return <div className="loading-state">Loading...</div>;

  return (
    <div className={`page-template template-style-1`}>
      <SchoolHeader school={school} pages={pages} />
      <main className="archive-container">
        <div className="archive-header">
          <h1 className="archive-title">Career Opportunities</h1>
          <p className="archive-description">
            Join our team and make a difference in education
          </p>
        </div>
        
        {loading ? (
          <div className="loading-state">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state">
            <h3>No job openings found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {paginatedJobs.map((job, index) => renderJobCard(job, index))}
          </div>
        )}
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default JobsPage;
