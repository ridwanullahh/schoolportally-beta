import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import { usePrograms } from '@/hooks/usePrograms';
import { Search, Filter, Calendar, User, ArrowRight, ChevronDown, Clock, Users } from 'lucide-react';



import { Button } from '@/components/ui/button';

interface ProgramsSectionProps {
  section: Section;
}

const ProgramsSection: React.FC<ProgramsSectionProps> = ({ section }) => {
  const { content, settings } = section;

  // Section settings with defaults
  const programsToShow = parseInt(settings?.programsToShow || '6');
  const enableSearch = settings?.enableSearch !== false;
  const enableFiltering = settings?.enableFiltering !== false;
  const enableSorting = settings?.enableSorting !== false;
  const enableLoadMore = settings?.enableLoadMore !== false;
  const showViewAllButton = settings?.showViewAllButton !== false;

  // State for controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [displayedPrograms, setDisplayedPrograms] = useState(programsToShow);
  const [filteredPrograms, setFilteredPrograms] = useState<any[]>([]);

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'programs-modern-grid',
      '2': 'programs-modern-cards',
      '3': 'programs-modern-horizontal',
      '4': 'programs-modern-minimal',
      '5': 'programs-modern-bordered',
      '6': 'programs-modern-hexagon',
      '7': 'programs-modern-gradient',
      '8': 'programs-modern-split',
      '9': 'programs-modern-compact',
      '10': 'programs-modern-asymmetric',
      '11': 'programs-modern-typography',
      // Existing ultra-modern styles (12+)
      '12': 'programs-floating-glass',
      '13': 'programs-holographic-cards',
      '14': 'programs-neon-grid',
      '15': 'programs-particle-bg',
      '16': 'programs-morphing-cards',
      '17': 'programs-cyber-grid',
      '18': 'programs-liquid-metal',
      '19': 'programs-aurora-bg',
      '20': 'programs-matrix-rain',
      '21': 'programs-quantum-field',
      '22': 'programs-neural-network',
      '23': 'programs-hologram-effect',
      '24': 'programs-energy-waves',
      '25': 'programs-digital-rain',
      '26': 'programs-mosaic-layout'
    };
    return styleMap[styleNumber] || 'programs-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');

  // Use dynamic content from programs admin module
  const { programs, loading, error, getFeaturedPrograms } = usePrograms();

  const defaultPrograms = [
    {
      id: '1',
      name: 'Computer Science Program',
      type: 'academic',
      description: 'Comprehensive computer science education covering programming, algorithms, and software development.',
      duration: '4 years',
      level: 'undergraduate',
      capacity: 50,
      currentEnrollment: 42,
      instructor: 'Dr. Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
      schedule: {
        days: ['Monday', 'Wednesday', 'Friday'],
        startTime: '09:00',
        endTime: '12:00'
      },
      location: 'Computer Lab A',
      fees: 15000,
      startDate: '2024-09-01',
      featured: true,
      status: 'active'
    },
    {
      id: '2',
      name: 'Digital Arts Workshop',
      type: 'arts',
      description: 'Creative digital arts program focusing on graphic design, animation, and multimedia production.',
      duration: '6 months',
      level: 'intermediate',
      capacity: 25,
      currentEnrollment: 20,
      instructor: 'Ms. Emily Chen',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      schedule: {
        days: ['Tuesday', 'Thursday'],
        startTime: '14:00',
        endTime: '17:00'
      },
      location: 'Art Studio B',
      fees: 8000,
      startDate: '2024-10-15',
      featured: true,
      status: 'active'
    },
    {
      id: '3',
      name: 'Basketball Training',
      type: 'sports',
      description: 'Professional basketball training program for students of all skill levels.',
      duration: '3 months',
      level: 'beginner',
      capacity: 30,
      currentEnrollment: 28,
      instructor: 'Coach Michael Davis',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
      schedule: {
        days: ['Monday', 'Wednesday', 'Friday'],
        startTime: '16:00',
        endTime: '18:00'
      },
      location: 'Sports Complex',
      fees: 5000,
      startDate: '2024-11-01',
      featured: false,
      status: 'active'
    },
    {
      id: '4',
      name: 'Robotics Club',
      type: 'technology',
      description: 'Hands-on robotics program where students build and program robots for competitions.',
      duration: '1 year',
      level: 'intermediate',
      capacity: 20,
      currentEnrollment: 18,
      instructor: 'Dr. James Wilson',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
      schedule: {
        days: ['Saturday'],
        startTime: '10:00',
        endTime: '15:00'
      },
      location: 'Tech Lab',
      fees: 12000,
      startDate: '2024-09-15',
      featured: true,
      status: 'active'
    },
    {
      id: '5',
      name: 'Music Theory & Practice',
      type: 'arts',
      description: 'Comprehensive music education covering theory, composition, and performance.',
      duration: '2 years',
      level: 'beginner',
      capacity: 35,
      currentEnrollment: 30,
      instructor: 'Prof. Lisa Martinez',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      schedule: {
        days: ['Tuesday', 'Thursday'],
        startTime: '11:00',
        endTime: '13:00'
      },
      location: 'Music Hall',
      fees: 10000,
      startDate: '2024-09-01',
      featured: false,
      status: 'active'
    },
    {
      id: '6',
      name: 'Environmental Science',
      type: 'academic',
      description: 'Study environmental systems, sustainability, and conservation practices.',
      duration: '3 years',
      level: 'undergraduate',
      capacity: 40,
      currentEnrollment: 35,
      instructor: 'Dr. Robert Green',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      schedule: {
        days: ['Monday', 'Wednesday'],
        startTime: '13:00',
        endTime: '16:00'
      },
      location: 'Science Building',
      fees: 18000,
      startDate: '2024-09-01',
      featured: true,
      status: 'active'
    }
  ];

  // Use dynamic content if available, otherwise use defaults
  const programItems = programs && programs.length > 0 ? programs : defaultPrograms;
  
  const renderProgram = (program: any, index: number) => {
    const programImage = program.image || 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop';

    return (
      <div key={program.id || index} className="program-card">
        <img
          src={programImage}
          alt={program.name}
          className="program-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop';
          }}
        />
        <div className="program-name">{program.name}</div>
        <div className="program-type">{program.type}</div>
        <div className="program-instructor">Instructor: {program.instructor}</div>
        <div className="program-details">
          <span>Duration: {program.duration}</span>
          <span>Level: {program.level}</span>
        </div>
        <div className="program-details">
          <span>Enrolled: {program.currentEnrollment}/{program.capacity}</span>
          <span>{program.fees ? `$${program.fees}` : 'Free'}</span>
        </div>
        {program.description && <div className="program-description">{program.description}</div>}
      </div>
    );
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="programs-container">
          <div className="loading-state">Loading programs...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="programs-container">
          <div className="error-state">Error loading programs. Showing default programs.</div>
          <div className="programs-container">
            {defaultPrograms.map(renderProgram)}
          </div>
        </div>
      );
    }

    switch (styleId) {
      case 'programs-sliding-carousel':
        return (
          <div className="programs-container">
            <div className="carousel-track">
              {programItems.map(renderProgram)}
              {/* Duplicate for seamless loop */}
              {programItems.map((program, index) => renderProgram(program, index + programItems.length))}
            </div>
          </div>
        );
      case 'programs-minimal-lines':
        return (
          <div className="programs-container">
            {programItems.map(renderProgram)}
          </div>
        );
      default:
        return (
          <div className="programs-container">
            {programItems.map(renderProgram)}
          </div>
        );
    }
  }

  return (
    <section className={`programs-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default ProgramsSection;