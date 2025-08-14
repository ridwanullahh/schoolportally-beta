import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { usePages } from '@/hooks/usePages';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import sdk from '@/lib/sdk-config';
import { Calendar, Clock, Users, BookOpen, Search, Filter, ArrowRight, ChevronLeft, ChevronRight, GraduationCap, MapPin } from 'lucide-react';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';




interface Class {
  id: string;
  schoolId: string;
  name: string;
  description: string;
  grade: string;
  section: string;
  capacity: number;
  currentEnrollment: number;
  teacher: string;
  teacherId: string;
  room: string;
  schedule: string;
  subjects: string[];
  academicYear: string;
  status: 'active' | 'inactive';
  fees: number;
  image?: string;
  createdAt: string;
  updatedAt?: string;
}

const ClassesPage = () => {
  const { school } = useSchool();
  const { schoolSlug } = useParams();
  const { pages } = usePages();
  const [searchParams, setSearchParams] = useSearchParams();
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedGrade, setSelectedGrade] = useState(searchParams.get('grade') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [grades, setGrades] = useState<string[]>([]);

  // Map old style names to new template system
  const getTemplateStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {
      'class-archive-style-1': 'template-style-1',
      'class-archive-style-2': 'template-style-2',
      'class-archive-style-3': 'template-style-3',
      'class-archive-style-4': 'template-style-4',
      'class-archive-style-5': 'template-style-5',
      'class-archive-style-6': 'template-style-6',
      'class-archive-style-7': 'template-style-7',
      'class-archive-style-8': 'template-style-8',
      'class-archive-style-9': 'template-style-9',
      'class-archive-style-10': 'template-style-10',
      'class-archive-style-11': 'template-style-11',
      'class-archive-style-12': 'template-style-12',
      'class-archive-style-13': 'template-style-13',
      'class-archive-style-14': 'template-style-14',
      'class-archive-style-15': 'template-style-15',
    };
    return styleMap[styleId] || 'template-style-1';
  };

  const classArchiveStyle = school?.classArchiveStyle || 'class-archive-style-1';
  const templateStyle = getTemplateStyle(classArchiveStyle);
  const classesPerPage = 12;

  useEffect(() => {
    const fetchClasses = async () => {
      if (school) {
        setLoading(true);
        try {
          const allClasses = await sdk.get<Class>('classes');
          const schoolClasses = allClasses.filter((c: Class) =>
            c.schoolId === school.id && c.status === 'active'
          );
          setClasses(schoolClasses);

          // Extract unique grades
          const uniqueGrades = Array.from(
            new Set(schoolClasses.map(cls => cls.grade).filter(Boolean))
          );
          setGrades(uniqueGrades);
        } catch (error) {
          console.error('Failed to fetch classes:', error);
          setClasses([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchClasses();
  }, [school]);

  useEffect(() => {
    let filtered = [...classes];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(cls =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply grade filter
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(cls => cls.grade === selectedGrade);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'grade':
          return a.grade.localeCompare(b.grade);
        case 'teacher':
          return a.teacher.localeCompare(b.teacher);
        case 'capacity':
          return b.capacity - a.capacity;
        case 'enrollment':
          return b.currentEnrollment - a.currentEnrollment;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredClasses(filtered);
  }, [classes, searchTerm, selectedGrade, sortBy]);

  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);
  const startIndex = (currentPage - 1) * classesPerPage;
  const paginatedClasses = filteredClasses.slice(startIndex, startIndex + classesPerPage);

  const renderSearchAndFilters = () => (
    <div className="archive-search-bar">
      <div className="search-input-wrapper relative">
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input pl-10"
        />
      </div>
      <select
        value={selectedGrade}
        onChange={(e) => setSelectedGrade(e.target.value)}
        className="sort-select"
      >
        <option value="all">All Grades</option>
        {grades.map(grade => (
          <option key={grade} value={grade}>{grade}</option>
        ))}
      </select>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-select"
      >
        <option value="name">By Name</option>
        <option value="grade">By Grade</option>
        <option value="teacher">By Teacher</option>
        <option value="capacity">By Capacity</option>
        <option value="enrollment">By Enrollment</option>
      </select>
    </div>
  );

  const renderClassCard = (classItem: Class, index?: number) => {
    const defaultImage = 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop';
    const classImage = classItem.image || defaultImage;

    // Default card layout for most templates
    return (
      <article key={classItem.id} className="post-card">
        <img
          src={classImage}
          alt={classItem.name}
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
              <span>Grade {classItem.grade}</span>
            </div>
            <div className="post-meta-item">
              <Users className="h-4 w-4" />
              <span>{classItem.currentEnrollment}/{classItem.capacity} students</span>
            </div>
            <div className="post-meta-item">
              <MapPin className="h-4 w-4" />
              <span>Room {classItem.room}</span>
            </div>
          </div>
          <span className="post-category">Grade {classItem.grade}</span>
          <h2 className="post-title">
            <Link to={`/${schoolSlug}/classes/${classItem.id}`}>
              {classItem.name}
            </Link>
          </h2>
          <p className="post-excerpt">{classItem.description}</p>
          <div className="class-details">
            <p><strong>Teacher:</strong> {classItem.teacher}</p>
            <p><strong>Schedule:</strong> {classItem.schedule}</p>
            {classItem.subjects && classItem.subjects.length > 0 && (
              <p><strong>Subjects:</strong> {classItem.subjects.slice(0, 3).join(', ')}</p>
            )}
          </div>
          <Link to={`/${schoolSlug}/classes/${classItem.id}`} className="read-more">
            View Details <ArrowRight className="h-4 w-4" />
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
          <h1 className="archive-title">Classes</h1>
          <p className="archive-description">
            Explore our diverse range of classes and academic programs
          </p>
        </div>

        {renderSearchAndFilters()}
        
        {loading ? (
          <div className="loading-state">Loading classes...</div>
        ) : filteredClasses.length === 0 ? (
          <div className="empty-state">
            <h3>No classes found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {paginatedClasses.map((classItem, index) => renderClassCard(classItem, index))}
          </div>
        )}
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default ClassesPage;
