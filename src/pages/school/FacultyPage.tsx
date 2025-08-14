import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { usePages } from '@/hooks/usePages';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import sdk from '@/lib/sdk-config';
import { Calendar, Clock, Users, BookOpen, Search, Filter, ArrowRight, ChevronLeft, ChevronRight, Award, Mail, Phone, GraduationCap } from 'lucide-react';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';




interface Faculty {
  id: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  title: string;
  department: string;
  position: string;
  bio: string;
  qualifications: string[];
  specializations: string[];
  experience: number;
  email: string;
  phone: string;
  officeHours: string;
  officeLocation: string;
  courses: string[];
  research: string[];
  publications: string[];
  awards: string[];
  status: 'active' | 'inactive';
  joinDate: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
}

const FacultyPage = () => {
  const { school } = useSchool();
  const { schoolSlug } = useParams();
  const { pages } = usePages();
  const [searchParams, setSearchParams] = useSearchParams();
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get('department') || 'all');
  const [selectedPosition, setSelectedPosition] = useState(searchParams.get('position') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [departments, setDepartments] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);

  // Map old style names to new template system
  const getTemplateStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {
      'faculty-archive-style-1': 'template-style-1',
      'faculty-archive-style-2': 'template-style-2',
      'faculty-archive-style-3': 'template-style-3',
      'faculty-archive-style-4': 'template-style-4',
      'faculty-archive-style-5': 'template-style-5',
      'faculty-archive-style-6': 'template-style-6',
      'faculty-archive-style-7': 'template-style-7',
      'faculty-archive-style-8': 'template-style-8',
      'faculty-archive-style-9': 'template-style-9',
      'faculty-archive-style-10': 'template-style-10',
      'faculty-archive-style-11': 'template-style-11',
      'faculty-archive-style-12': 'template-style-12',
      'faculty-archive-style-13': 'template-style-13',
      'faculty-archive-style-14': 'template-style-14',
      'faculty-archive-style-15': 'template-style-15',
    };
    return styleMap[styleId] || 'template-style-1';
  };

  const facultyArchiveStyle = school?.facultyArchiveStyle || 'faculty-archive-style-1';
  const templateStyle = getTemplateStyle(facultyArchiveStyle);
  const facultyPerPage = 12;

  useEffect(() => {
    const fetchFaculty = async () => {
      if (school) {
        setLoading(true);
        try {
          const allFaculty = await sdk.get<Faculty>('faculty');
          const schoolFaculty = allFaculty.filter((f: Faculty) =>
            f.schoolId === school.id && f.status === 'active'
          );
          setFaculty(schoolFaculty);

          // Extract unique departments and positions
          const uniqueDepartments = Array.from(
            new Set(schoolFaculty.map(f => f.department).filter(Boolean))
          );
          const uniquePositions = Array.from(
            new Set(schoolFaculty.map(f => f.position).filter(Boolean))
          );
          setDepartments(uniqueDepartments);
          setPositions(uniquePositions);
        } catch (error) {
          console.error('Failed to fetch faculty:', error);
          setFaculty([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFaculty();
  }, [school]);

  useEffect(() => {
    let filtered = [...faculty];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(member => member.department === selectedDepartment);
    }

    // Apply position filter
    if (selectedPosition !== 'all') {
      filtered = filtered.filter(member => member.position === selectedPosition);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'department':
          return a.department.localeCompare(b.department);
        case 'position':
          return a.position.localeCompare(b.position);
        case 'experience':
          return b.experience - a.experience;
        case 'joinDate':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'name':
        default:
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      }
    });

    setFilteredFaculty(filtered);
  }, [faculty, searchTerm, selectedDepartment, selectedPosition, sortBy]);

  const totalPages = Math.ceil(filteredFaculty.length / facultyPerPage);
  const startIndex = (currentPage - 1) * facultyPerPage;
  const paginatedFaculty = filteredFaculty.slice(startIndex, startIndex + facultyPerPage);

  const renderSearchAndFilters = () => (
    <div className="archive-search-bar">
      <div className="search-input-wrapper relative">
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search faculty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input pl-10"
        />
      </div>
      <select
        value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
        className="sort-select"
      >
        <option value="all">All Departments</option>
        {departments.map(dept => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>
      <select
        value={selectedPosition}
        onChange={(e) => setSelectedPosition(e.target.value)}
        className="sort-select"
      >
        <option value="all">All Positions</option>
        {positions.map(pos => (
          <option key={pos} value={pos}>{pos}</option>
        ))}
      </select>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-select"
      >
        <option value="name">By Name</option>
        <option value="department">By Department</option>
        <option value="position">By Position</option>
        <option value="experience">By Experience</option>
        <option value="joinDate">By Join Date</option>
      </select>
    </div>
  );

  const renderFacultyCard = (member: Faculty, index?: number) => {
    const defaultImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop';
    const memberImage = member.image || defaultImage;

    // Default card layout for most templates
    return (
      <article key={member.id} className="post-card">
        <img
          src={memberImage}
          alt={`${member.firstName} ${member.lastName}`}
          className="post-image"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        <div className="post-content">
          <div className="post-meta">
            <div className="post-meta-item">
              <GraduationCap className="h-4 w-4" />
              <span>{member.position}</span>
            </div>
            <div className="post-meta-item">
              <BookOpen className="h-4 w-4" />
              <span>{member.department}</span>
            </div>
            <div className="post-meta-item">
              <Award className="h-4 w-4" />
              <span>{member.experience} years</span>
            </div>
          </div>
          <span className="post-category">{member.department}</span>
          <h2 className="post-title">
            <Link to={`/${schoolSlug}/faculty/${member.id}`}>
              {member.title} {member.firstName} {member.lastName}
            </Link>
          </h2>
          <p className="post-excerpt">{member.bio}</p>
          <div className="faculty-details">
            <p><strong>Position:</strong> {member.position}</p>
            <p><strong>Office:</strong> {member.officeLocation}</p>
            {member.specializations && member.specializations.length > 0 && (
              <p><strong>Specializations:</strong> {member.specializations.slice(0, 2).join(', ')}</p>
            )}
            <div className="contact-info">
              <div className="contact-item">
                <Mail className="h-4 w-4" />
                <span>{member.email}</span>
              </div>
              {member.phone && (
                <div className="contact-item">
                  <Phone className="h-4 w-4" />
                  <span>{member.phone}</span>
                </div>
              )}
            </div>
          </div>
          <Link to={`/${schoolSlug}/faculty/${member.id}`} className="read-more">
            View Profile <ArrowRight className="h-4 w-4" />
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
          <h1 className="archive-title">Faculty</h1>
          <p className="archive-description">
            Meet our dedicated faculty members and academic professionals
          </p>
        </div>

        {renderSearchAndFilters()}
        
        {loading ? (
          <div className="loading-state">Loading faculty...</div>
        ) : filteredFaculty.length === 0 ? (
          <div className="empty-state">
            <h3>No faculty members found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {paginatedFaculty.map((member, index) => renderFacultyCard(member, index))}
          </div>
        )}
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default FacultyPage;
