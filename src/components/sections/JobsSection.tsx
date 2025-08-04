import React from 'react';
import { useState } from 'react';
import { Section } from '@/types';
import { useJobs } from '@/hooks/useJobs';
import '@/themes/styles/sections/all-remaining-ultra-modern.css';
import { Button } from '@/components/ui/button';

interface JobsSectionProps {
  section: Section;
}

const JobsSection: React.FC<JobsSectionProps> = ({ section }) => {
  const { title } = section.content;
  const styleId = section.styleId || 'jobs-floating-glass';

  // Use dynamic content from jobs admin module
  const { jobs, loading, error, getFeaturedJobs } = useJobs();

  const defaultJobs = [
    {
      id: '1',
      title: 'Senior Lecturer - Computer Science',
      department: 'Computer Science',
      location: 'Main Campus',
      type: 'full-time',
      description: 'We are seeking an experienced Senior Lecturer to join our Computer Science department.',
      requirements: ['PhD in Computer Science or related field', '5+ years teaching experience', 'Research publications'],
      responsibilities: ['Teach undergraduate and graduate courses', 'Conduct research', 'Supervise student projects'],
      salary: '$75,000 - $95,000',
      applicationDeadline: '2024-12-15',
      contactEmail: 'hr@school.edu',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
      featured: true,
      status: 'active'
    },
    {
      id: '2',
      title: 'Admissions Officer',
      department: 'Administration',
      location: 'Administration Building',
      type: 'full-time',
      description: 'Join our admissions team to help prospective students navigate the enrollment process.',
      requirements: ['Bachelor\'s degree required', '2+ years in admissions or student services', 'Excellent communication skills'],
      responsibilities: ['Review applications', 'Conduct interviews', 'Coordinate enrollment events'],
      salary: '$45,000 - $55,000',
      applicationDeadline: '2024-12-01',
      contactEmail: 'admissions@school.edu',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
      featured: false,
      status: 'active'
    },
    {
      id: '3',
      title: 'Research Assistant - Environmental Science',
      department: 'Environmental Science',
      location: 'Science Building',
      type: 'part-time',
      description: 'Support ongoing research projects in environmental sustainability and climate change.',
      requirements: ['Graduate student in Environmental Science', 'Research experience preferred', 'Data analysis skills'],
      responsibilities: ['Collect and analyze data', 'Assist with field work', 'Prepare research reports'],
      salary: '$20 - $25 per hour',
      applicationDeadline: '2024-11-30',
      contactEmail: 'research@school.edu',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      featured: true,
      status: 'active'
    },
    {
      id: '4',
      title: 'Library Assistant',
      department: 'Library Services',
      location: 'Main Library',
      type: 'part-time',
      description: 'Provide support services to students and faculty in our state-of-the-art library.',
      requirements: ['High school diploma', 'Customer service experience', 'Basic computer skills'],
      responsibilities: ['Assist patrons', 'Organize materials', 'Maintain library systems'],
      salary: '$15 - $18 per hour',
      applicationDeadline: '2024-12-10',
      contactEmail: 'library@school.edu',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      featured: false,
      status: 'active'
    },
    {
      id: '5',
      title: 'Marketing Coordinator',
      department: 'Marketing',
      location: 'Administration Building',
      type: 'full-time',
      description: 'Lead marketing initiatives to promote our academic programs and campus events.',
      requirements: ['Bachelor\'s in Marketing or Communications', 'Social media expertise', 'Creative design skills'],
      responsibilities: ['Develop marketing campaigns', 'Manage social media', 'Create promotional materials'],
      salary: '$50,000 - $60,000',
      applicationDeadline: '2024-12-20',
      contactEmail: 'marketing@school.edu',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      featured: true,
      status: 'active'
    },
    {
      id: '6',
      title: 'IT Support Specialist',
      department: 'Information Technology',
      location: 'IT Center',
      type: 'full-time',
      description: 'Provide technical support to students, faculty, and staff across campus.',
      requirements: ['Associate degree in IT or related field', 'Help desk experience', 'Network troubleshooting skills'],
      responsibilities: ['Resolve technical issues', 'Maintain computer systems', 'Train users on software'],
      salary: '$40,000 - $50,000',
      applicationDeadline: '2024-12-05',
      contactEmail: 'it@school.edu',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      featured: false,
      status: 'active'
    }
  ];

  // Use dynamic content if available, otherwise use defaults
  const jobItems = jobs && jobs.length > 0 ? jobs : defaultJobs;

  const renderJob = (job: any, index: number) => {
    const jobImage = job.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop';

    return (
      <div key={job.id || index} className="job-card">
        <img
          src={jobImage}
          alt={job.title}
          className="job-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop';
          }}
        />
        <div className="job-title">{job.title}</div>
        <div className="job-department">{job.department}</div>
        <div className="job-location">{job.location}</div>
        <div className="job-type">{job.type}</div>
        <div className="job-salary">{job.salary}</div>
        {job.description && <div className="job-description">{job.description}</div>}
        <div className="job-deadline">Apply by: {job.applicationDeadline}</div>
      </div>
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="jobs-container">
          <div className="loading-state">Loading job openings...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="jobs-container">
          <div className="error-state">Error loading jobs. Showing default jobs.</div>
          <div className="jobs-container">
            {defaultJobs.map(renderJob)}
          </div>
        </div>
      );
    }

    switch (styleId) {
      case 'jobs-sliding-carousel':
        return (
          <div className="jobs-container">
            <div className="carousel-track">
              {jobItems.map(renderJob)}
              {/* Duplicate for seamless loop */}
              {jobItems.map((job, index) => renderJob(job, index + jobItems.length))}
            </div>
          </div>
        );
      case 'jobs-minimal-lines':
        return (
          <div className="jobs-container">
            {jobItems.map(renderJob)}
          </div>
        );
      default:
        return (
          <div className="jobs-container">
            {jobItems.map(renderJob)}
          </div>
        );
    }
  }

  return (
    <section className={`jobs-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default JobsSection;