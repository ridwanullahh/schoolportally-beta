import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { usePages } from '@/hooks/usePages';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import sdk from '@/lib/sdk-config';
import { Calendar, Clock, Users, BookOpen, Search, Filter, ArrowRight, ChevronLeft, ChevronRight, Award, DollarSign, Star } from 'lucide-react';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import '@/themes/styles/pages/archive-modern.css';
import '@/themes/styles/pages/archive-templates-ultra-modern.css';
import '@/themes/styles/pages/modern-ui-templates.css';

interface Course {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  credits: number;
  instructor: string;
  instructorId: string;
  capacity: number;
  currentEnrollment: number;
  fees: number;
  prerequisites: string[];
  learningOutcomes: string[];
  schedule: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'completed';
  rating: number;
  reviews: number;
  image?: string;
  createdAt: string;
  updatedAt?: string;
}

const CoursesPage = () => {
  const { school } = useSchool();
  const { schoolSlug } = useParams();
  const { pages } = usePages();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'title');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [categories, setCategories] = useState<string[]>([]);

  // Map old style names to new template system
  const getTemplateStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {
      'course-archive-style-1': 'template-style-1',
      'course-archive-style-2': 'template-style-2',
      'course-archive-style-3': 'template-style-3',
      'course-archive-style-4': 'template-style-4',
      'course-archive-style-5': 'template-style-5',
      'course-archive-style-6': 'template-style-6',
      'course-archive-style-7': 'template-style-7',
      'course-archive-style-8': 'template-style-8',
      'course-archive-style-9': 'template-style-9',
      'course-archive-style-10': 'template-style-10',
      'course-archive-style-11': 'template-style-11',
      'course-archive-style-12': 'template-style-12',
      'course-archive-style-13': 'template-style-13',
      'course-archive-style-14': 'template-style-14',
      'course-archive-style-15': 'template-style-15',
    };
    return styleMap[styleId] || 'template-style-1';
  };

  const courseArchiveStyle = school?.courseArchiveStyle || 'course-archive-style-1';
  const templateStyle = getTemplateStyle(courseArchiveStyle);
  const coursesPerPage = 12;

  useEffect(() => {
    const fetchCourses = async () => {
      if (school) {
        setLoading(true);
        try {
          const allCourses = await sdk.get<Course>('courses');
          const schoolCourses = allCourses.filter((c: Course) =>
            c.schoolId === school.id && c.status === 'active'
          );
          setCourses(schoolCourses);

          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(schoolCourses.map(course => course.category).filter(Boolean))
          );
          setCategories(uniqueCategories);
        } catch (error) {
          console.error('Failed to fetch courses:', error);
          setCourses([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCourses();
  }, [school]);

  useEffect(() => {
    let filtered = [...courses];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'category':
          return a.category.localeCompare(b.category);
        case 'level':
          return a.level.localeCompare(b.level);
        case 'fees':
          return a.fees - b.fees;
        case 'rating':
          return b.rating - a.rating;
        case 'duration':
          return a.duration.localeCompare(b.duration);
        case 'title':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedCategory, selectedLevel, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

  const renderSearchAndFilters = () => (
    <div className="archive-search-bar">
      <div className="search-input-wrapper relative">
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input pl-10"
        />
      </div>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="sort-select"
      >
        <option value="all">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
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
        <option value="title">By Title</option>
        <option value="category">By Category</option>
        <option value="level">By Level</option>
        <option value="fees">By Fees</option>
        <option value="rating">By Rating</option>
        <option value="duration">By Duration</option>
      </select>
    </div>
  );

  const renderCourseCard = (course: Course, index?: number) => {
    const defaultImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop';
    const courseImage = course.image || defaultImage;

    // Default card layout for most templates
    return (
      <article key={course.id} className="post-card">
        <img
          src={courseImage}
          alt={course.title}
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
              <span>{course.level}</span>
            </div>
            <div className="post-meta-item">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="post-meta-item">
              <BookOpen className="h-4 w-4" />
              <span>{course.credits} credits</span>
            </div>
            <div className="post-meta-item">
              <Users className="h-4 w-4" />
              <span>{course.currentEnrollment}/{course.capacity}</span>
            </div>
            <div className="post-meta-item">
              <Star className="h-4 w-4" />
              <span>{course.rating}/5 ({course.reviews})</span>
            </div>
          </div>
          <span className="post-category">{course.category}</span>
          <h2 className="post-title">
            <Link to={`/${schoolSlug}/courses/${course.id}`}>
              {course.title}
            </Link>
          </h2>
          <p className="post-excerpt">{course.description}</p>
          <div className="course-details">
            <p><strong>Instructor:</strong> {course.instructor}</p>
            <p><strong>Schedule:</strong> {course.schedule}</p>
            <p><strong>Start Date:</strong> {formatDate(course.startDate)}</p>
            <p><strong>Fees:</strong> ${course.fees}</p>
          </div>
          <Link to={`/${schoolSlug}/courses/${course.id}`} className="read-more">
            Enroll Now <ArrowRight className="h-4 w-4" />
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
          <h1 className="archive-title">Courses</h1>
          <p className="archive-description">
            Explore our comprehensive course catalog and advance your learning journey
          </p>
        </div>

        {renderSearchAndFilters()}
        
        {loading ? (
          <div className="loading-state">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="empty-state">
            <h3>No courses found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {paginatedCourses.map((course, index) => renderCourseCard(course, index))}
          </div>
        )}
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default CoursesPage;
