import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import { useFaculty } from '@/hooks/useFaculty';
import { Search, Filter, Mail, Phone, ArrowRight, ChevronDown, User, Award } from 'lucide-react';
import '@/themes/styles/sections/faculty-modern.css';
import '@/themes/styles/sections/faculty-ultra-modern.css';
import '@/themes/styles/sections/faculty-section-styles.css';

interface FacultySectionProps {
  section: Section;
}

const FacultySection: React.FC<FacultySectionProps> = ({ section }) => {
  const { content, settings } = section;
  const { faculty, loading, error } = useFaculty();

  // Section settings with defaults
  const facultyToShow = parseInt(settings?.facultyToShow || '6');
  const enableSearch = settings?.enableSearch !== false;
  const enableFiltering = settings?.enableFiltering !== false;
  const enableSorting = settings?.enableSorting !== false;
  const enableLoadMore = settings?.enableLoadMore !== false;
  const showViewAllButton = settings?.showViewAllButton !== false;

  // State for controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [displayedFaculty, setDisplayedFaculty] = useState(facultyToShow);
  const [filteredFaculty, setFilteredFaculty] = useState<any[]>([]);

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'faculty-modern-grid',
      '2': 'faculty-modern-cards',
      '3': 'faculty-modern-horizontal',
      '4': 'faculty-modern-minimal',
      '5': 'faculty-modern-bordered',
      '6': 'faculty-modern-hexagon',
      '7': 'faculty-modern-gradient',
      '8': 'faculty-modern-split',
      '9': 'faculty-modern-compact',
      '10': 'faculty-modern-asymmetric',
      '11': 'faculty-modern-typography',
      // Existing ultra-modern styles (12+)
      '12': 'faculty-floating-glass',
      '13': 'faculty-holographic-cards',
      '14': 'faculty-neon-profiles',
      '15': 'faculty-particle-bg',
      '16': 'faculty-morphing-cards',
      '17': 'faculty-cyber-grid',
      '18': 'faculty-liquid-metal',
      '19': 'faculty-aurora-bg',
      '20': 'faculty-matrix-rain',
      '21': 'faculty-quantum-field',
      '22': 'faculty-neural-network',
      '23': 'faculty-hologram-effect',
      '24': 'faculty-energy-waves',
      '25': 'faculty-digital-rain',
      '26': 'faculty-mosaic-layout'
    };
    return styleMap[styleNumber] || 'faculty-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');
  const [activeTab, setActiveTab] = useState('All');

  const defaultFaculty = [
    {
      id: '1',
      name: 'Dr. Alice Johnson',
      title: 'Professor of Mathematics',
      department: 'Mathematics',
      subject: 'Advanced Mathematics',
      bio: 'Dr. Johnson brings 15 years of experience in mathematical education and research, specializing in calculus and statistics.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      email: 'alice.johnson@school.edu'
    },
    {
      id: '2',
      name: 'Mr. Bob Smith',
      title: 'English Literature Teacher',
      department: 'English',
      subject: 'Literature & Writing',
      bio: 'Mr. Smith is passionate about fostering creative writing and critical thinking skills in students through literature.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      email: 'bob.smith@school.edu'
    },
    {
      id: '3',
      name: 'Ms. Carol Davis',
      title: 'Science Coordinator',
      department: 'Science',
      subject: 'Biology & Chemistry',
      bio: 'Ms. Davis coordinates our science curriculum and leads innovative laboratory experiments for hands-on learning.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      email: 'carol.davis@school.edu'
    },
    {
      id: '4',
      name: 'Dr. Michael Chen',
      title: 'Physics Professor',
      department: 'Science',
      subject: 'Physics & Engineering',
      bio: 'Dr. Chen combines theoretical physics with practical engineering applications to inspire future scientists.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      email: 'michael.chen@school.edu'
    },
    {
      id: '5',
      name: 'Ms. Sarah Wilson',
      title: 'Art & Design Teacher',
      department: 'Arts',
      subject: 'Visual Arts',
      bio: 'Ms. Wilson nurtures creativity and artistic expression through various mediums and contemporary art techniques.',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      email: 'sarah.wilson@school.edu'
    },
    {
      id: '6',
      name: 'Mr. David Kumar',
      title: 'History & Social Studies',
      department: 'Social Studies',
      subject: 'World History',
      bio: 'Mr. Kumar brings history to life through engaging storytelling and interactive learning experiences.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      email: 'david.kumar@school.edu'
    },
  ];

  // Use dynamic content if available, otherwise use defaults
  const facultyMembers = faculty && faculty.length > 0 ? faculty : defaultFaculty;
  
  const departments = getDepartments ? ['All', ...getDepartments()] : ['All', ...new Set(facultyMembers.map((m: any) => m.department))];

  const filteredMembers = activeTab === 'All'
    ? facultyMembers
    : facultyMembers.filter((m: any) => m.department === activeTab);

  const renderMember = (member: any, index: number) => {
    const memberImage = member.image || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face';

    return (
      <div key={member.id || index} className="faculty-card">
        <img
          src={memberImage}
          alt={member.name}
          className="faculty-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face';
          }}
        />
        <div className="faculty-name font-bold text-lg">{member.name}</div>
        <div className="faculty-title">{member.title}</div>
        <div className="faculty-department text-muted-foreground">{member.department}</div>
        {member.bio && <div className="faculty-bio">{member.bio}</div>}
      </div>
    );
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="faculty-container">
          <div className="loading-state">Loading faculty members...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="faculty-container">
          <div className="error-state">Error loading faculty. Showing default members.</div>
          <div className="faculty-container">
            {defaultFaculty.map(renderFacultyMember)}
          </div>
        </div>
      );
    }

    switch (styleId) {
      case 'faculty-sliding-carousel':
        return (
          <div className="faculty-container">
            <div className="carousel-track">
              {facultyMembers.map(renderFacultyMember)}
              {/* Duplicate for seamless loop */}
              {facultyMembers.map((member, index) => renderFacultyMember(member, index + facultyMembers.length))}
            </div>
          </div>
        );
      case 'faculty-minimal-lines':
        return (
          <div className="faculty-container">
            {facultyMembers.map(renderFacultyMember)}
          </div>
        );
      default:
        return (
          <div className="faculty-container">
            {facultyMembers.map(renderFacultyMember)}
          </div>
        );
    }
  }

  return (
    <section className={`faculty-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default FacultySection;