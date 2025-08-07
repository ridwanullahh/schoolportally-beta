import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { usePages } from '@/hooks/usePages';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import sdk from '@/lib/sdk-config';
import { Calendar, Clock, Users, BookOpen, Search, Filter, ArrowRight, ChevronLeft, ChevronRight, Award, DollarSign } from 'lucide-react';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import '@/themes/styles/pages/archive-modern.css';
import '@/themes/styles/pages/archive-templates-ultra-modern.css';
import '@/themes/styles/pages/modern-ui-templates.css';

interface Program {
  id: string;
  schoolId: string;
  name: string;
  description: string;
  type: 'academic' | 'extracurricular' | 'sports' | 'arts';
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  capacity: number;
  currentEnrollment: number;
  instructor: string;
  schedule: string;
  fees: number;
  requirements: string[];
  benefits: string[];
  status: 'active' | 'inactive';
  startDate: string;
  endDate: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
}

const ProgramsPage = () => {
  const { school } = useSchool();
  const { schoolSlug } = useParams();
  const { pages } = usePages();
  const [searchParams, setSearchParams] = useSearchParams();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

  // Map old style names to new template system
  const getTemplateStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {
      'program-archive-style-1': 'template-style-1',
      'program-archive-style-2': 'template-style-2',
      'program-archive-style-3': 'template-style-3',
      'program-archive-style-4': 'template-style-4',
      'program-archive-style-5': 'template-style-5',
      'program-archive-style-6': 'template-style-6',
      'program-archive-style-7': 'template-style-7',
      'program-archive-style-8': 'template-style-8',
      'program-archive-style-9': 'template-style-9',
      'program-archive-style-10': 'template-style-10',
      'program-archive-style-11': 'template-style-11',
      'program-archive-style-12': 'template-style-12',
      'program-archive-style-13': 'template-style-13',
      'program-archive-style-14': 'template-style-14',
      'program-archive-style-15': 'template-style-15',
    };
    return styleMap[styleId] || 'template-style-1';
  };

  const programArchiveStyle = school?.programArchiveStyle || 'program-archive-style-1';
  const templateStyle = getTemplateStyle(programArchiveStyle);
  const programsPerPage = 12;

  useEffect(() => {
    const fetchPrograms = async () => {
      if (school) {
        setLoading(true);
        try {
          const allPrograms = await sdk.get<Program>('programs');
          const schoolPrograms = allPrograms.filter((p: Program) =>
            p.schoolId === school.id && p.status === 'active'
          );
          setPrograms(schoolPrograms);
        } catch (error) {
          console.error('Failed to fetch programs:', error);
          setPrograms([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPrograms();
  }, [school]);

  useEffect(() => {
    let filtered = [...programs];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(program =>
        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(program => program.type === selectedType);
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(program => program.level === selectedLevel);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'type':
          return a.type.localeCompare(b.type);
        case 'level':
          return a.level.localeCompare(b.level);
        case 'fees':
          return a.fees - b.fees;
        case 'duration':
          return a.duration.localeCompare(b.duration);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredPrograms(filtered);
  }, [programs, searchTerm, selectedType, selectedLevel, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalPages = Math.ceil(filteredPrograms.length / programsPerPage);
  const startIndex = (currentPage - 1) * programsPerPage;
  const paginatedPrograms = filteredPrograms.slice(startIndex, startIndex + programsPerPage);

  const renderSearchAndFilters = () => (
    <div className="archive-search-bar">
      <div className="search-input-wrapper relative">
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input pl-10"
        />
      </div>
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="sort-select"
      >
        <option value="all">All Types</option>
        <option value="academic">Academic</option>
        <option value="extracurricular">Extracurricular</option>
        <option value="sports">Sports</option>
        <option value="arts">Arts</option>
      </select>
      <select
        value={selectedLevel}
        onChange={(e) => setSelectedLevel(e.target.value)}
        className="sort-select"
      >
        <option value="all">All Levels</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-select"
      >
        <option value="name">By Name</option>
        <option value="type">By Type</option>
        <option value="level">By Level</option>
        <option value="fees">By Fees</option>
        <option value="duration">By Duration</option>
      </select>
    </div>
  );

  const renderProgramCard = (program: Program, index?: number) => {
    const defaultImage = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop';
    const programImage = program.image || defaultImage;

    // Default card layout for most templates
    return (
      <article key={program.id} className="post-card">
        <img
          src={programImage}
          alt={program.name}
          className="post-image"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        <div className="post-content">
          <div className="post-meta">
            <div className="post-meta-item">
              <Award className="h-4 w-4" />
              <span>{program.level}</span>
            </div>
            <div className="post-meta-item">
              <Clock className="h-4 w-4" />
              <span>{program.duration}</span>
            </div>
            <div className="post-meta-item">
              <Users className="h-4 w-4" />
              <span>{program.currentEnrollment}/{program.capacity}</span>
            </div>
            <div className="post-meta-item">
              <DollarSign className="h-4 w-4" />
              <span>${program.fees}</span>
            </div>
          </div>
          <span className="post-category">{program.type}</span>
          <h2 className="post-title">
            <Link to={`/${schoolSlug}/programs/${program.id}`}>
              {program.name}
            </Link>
          </h2>
          <p className="post-excerpt">{program.description}</p>
          <div className="program-details">
            <p><strong>Instructor:</strong> {program.instructor}</p>
            <p><strong>Schedule:</strong> {program.schedule}</p>
            <p><strong>Start Date:</strong> {formatDate(program.startDate)}</p>
          </div>
          <Link to={`/${schoolSlug}/programs/${program.id}`} className="read-more">
            Learn More <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    );
  };

  if (!school) return <div className="loading-state">Loading...</div>;

  return (
    <div className={`page-template ${templateStyle}`}>
      <SchoolHeader school={school} pages={pages} />
      <main className="archive-container">
        <div className="archive-header">
          <h1 className="archive-title">Programs</h1>
          <p className="archive-description">
            Discover our comprehensive range of academic and extracurricular programs
          </p>
        </div>

        {renderSearchAndFilters()}
        
        {loading ? (
          <div className="loading-state">Loading programs...</div>
        ) : filteredPrograms.length === 0 ? (
          <div className="empty-state">
            <h3>No programs found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {paginatedPrograms.map((program, index) => renderProgramCard(program, index))}
          </div>
        )}
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default ProgramsPage;
