import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/jobs.css';
import { Button } from '@/components/ui/button';

interface JobsSectionProps {
  section: Section;
}

const JobsSection: React.FC<JobsSectionProps> = ({ section }) => {
  const { title, jobs } = section.content;
  const styleId = section.styleId || 'jobs-card-postings';

  const defaultJobs = [
    { title: 'Senior Lecturer - Computer Science', location: 'Main Campus', type: 'Full-time', link: '#', tags: 'Academic,Computer Science' },
    { title: 'Admissions Officer', location: 'Administration Building', type: 'Full-time', link: '#', tags: 'Administrative' },
    { title: 'Part-time Research Assistant', location: 'Remote', type: 'Part-time', link: '#', tags: 'Research,Part-time' },
  ];

  const jobItems = jobs && jobs.length > 0 ? jobs : defaultJobs;

  const renderJob = (job: any, index: number) => {
    if (styleId === 'jobs-list-with-tags') {
      return (
        <div key={index} className="job-item">
          <div>
            <h3 className="job-title">{job.title}</h3>
            <p className="job-location">{job.location} - {job.type}</p>
          </div>
          <div className="tags">
            {job.tags?.split(',').map((tag: string) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          <Button asChild className="apply-button">
            <a href={job.link}>Apply Now</a>
          </Button>
        </div>
      )
    }
    
    return (
      <div key={index} className="job-card">
        <h3 className="job-title">{job.title}</h3>
        <p className="job-location">{job.location} - {job.type}</p>
        <Button asChild className="apply-button">
          <a href={job.link}>Apply Now</a>
        </Button>
      </div>
    );
  }

  return (
    <section className={`jobs-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="jobs-container">
          {jobItems.map(renderJob)}
        </div>
      </div>
    </section>
  );
};

export default JobsSection;