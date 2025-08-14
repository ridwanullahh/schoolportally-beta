import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { usePages } from '@/hooks/usePages';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import sdk from '@/lib/sdk-config';
import { Calendar, Clock, Users, BookOpen, Search, Filter, ArrowRight, Book, FileText, Download, Star } from 'lucide-react';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';




interface LibraryResource {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  type: 'book' | 'journal' | 'article' | 'thesis' | 'report' | 'multimedia';
  category: string;
  subject: string;
  author: string;
  publisher: string;
  publicationDate: string;
  isbn: string;
  language: string;
  pages: number;
  format: 'physical' | 'digital' | 'both';
  availability: 'available' | 'borrowed' | 'reserved' | 'maintenance';
  location: string;
  callNumber: string;
  tags: string[];
  rating: number;
  reviews: number;
  downloadUrl?: string;
  previewUrl?: string;
  coverImage?: string;
  borrowHistory: number;
  reservations: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}

const LibraryPage = () => {
  const { school } = useSchool();
  const { schoolSlug } = useParams();
  const { pages } = usePages();
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<LibraryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedAvailability, setSelectedAvailability] = useState(searchParams.get('availability') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'title');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [categories, setCategories] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);

  const getTemplateStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {
      'library-archive-style-1': 'template-style-1',
      'library-archive-style-2': 'template-style-2',
      'library-archive-style-3': 'template-style-3',
      'library-archive-style-4': 'template-style-4',
      'library-archive-style-5': 'template-style-5',
      'library-archive-style-6': 'template-style-6',
      'library-archive-style-7': 'template-style-7',
      'library-archive-style-8': 'template-style-8',
      'library-archive-style-9': 'template-style-9',
      'library-archive-style-10': 'template-style-10',
      'library-archive-style-11': 'template-style-11',
      'library-archive-style-12': 'template-style-12',
      'library-archive-style-13': 'template-style-13',
      'library-archive-style-14': 'template-style-14',
      'library-archive-style-15': 'template-style-15',
    };
    return styleMap[styleId] || 'template-style-1';
  };

  const libraryArchiveStyle = school?.libraryArchiveStyle || 'library-archive-style-1';
  const templateStyle = getTemplateStyle(libraryArchiveStyle);
  const resourcesPerPage = 12;

  useEffect(() => {
    const fetchResources = async () => {
      if (school) {
        setLoading(true);
        try {
          const allResources = await sdk.get<LibraryResource>('library');
          const schoolResources = allResources.filter((r: LibraryResource) =>
            r.schoolId === school.id && r.status === 'active'
          );
          setResources(schoolResources);

          const uniqueCategories = Array.from(
            new Set(schoolResources.map(resource => resource.category).filter(Boolean))
          );
          const uniqueSubjects = Array.from(
            new Set(schoolResources.map(resource => resource.subject).filter(Boolean))
          );
          setCategories(uniqueCategories);
          setSubjects(uniqueSubjects);
        } catch (error) {
          console.error('Failed to fetch library resources:', error);
          setResources([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchResources();
  }, [school]);

  useEffect(() => {
    let filtered = [...resources];

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (selectedAvailability !== 'all') {
      filtered = filtered.filter(resource => resource.availability === selectedAvailability);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'author':
          return a.author.localeCompare(b.author);
        case 'date':
          return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
        case 'popular':
          return b.borrowHistory - a.borrowHistory;
        case 'rating':
          return b.rating - a.rating;
        case 'title':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredResources(filtered);
  }, [resources, searchTerm, selectedType, selectedCategory, selectedAvailability, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-500';
      case 'borrowed': return 'text-red-500';
      case 'reserved': return 'text-yellow-500';
      case 'maintenance': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
  const startIndex = (currentPage - 1) * resourcesPerPage;
  const paginatedResources = filteredResources.slice(startIndex, startIndex + resourcesPerPage);

  const renderSearchAndFilters = () => (
    <div className="archive-search-bar">
      <div className="search-input-wrapper relative">
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search library..."
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
        <option value="book">Books</option>
        <option value="journal">Journals</option>
        <option value="article">Articles</option>
        <option value="thesis">Thesis</option>
        <option value="report">Reports</option>
        <option value="multimedia">Multimedia</option>
      </select>
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
        value={selectedAvailability}
        onChange={(e) => setSelectedAvailability(e.target.value)}
        className="sort-select"
      >
        <option value="all">All Availability</option>
        <option value="available">Available</option>
        <option value="borrowed">Borrowed</option>
        <option value="reserved">Reserved</option>
        <option value="maintenance">Maintenance</option>
      </select>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-select"
      >
        <option value="title">By Title</option>
        <option value="author">By Author</option>
        <option value="date">By Publication Date</option>
        <option value="popular">Most Popular</option>
        <option value="rating">By Rating</option>
      </select>
    </div>
  );

  const renderResourceCard = (resource: LibraryResource, index?: number) => {
    const defaultImage = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop';
    const resourceImage = resource.coverImage || defaultImage;

    return (
      <article key={resource.id} className="post-card">
        <img
          src={resourceImage}
          alt={resource.title}
          className="post-image"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        <div className="post-content">
          <div className="post-meta">
            <div className="post-meta-item">
              <Book className="h-4 w-4" />
              <span>{resource.type}</span>
            </div>
            <div className="post-meta-item">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(resource.publicationDate)}</span>
            </div>
            <div className="post-meta-item">
              <FileText className="h-4 w-4" />
              <span>{resource.pages} pages</span>
            </div>
            <div className="post-meta-item">
              <Star className="h-4 w-4" />
              <span>{resource.rating}/5 ({resource.reviews})</span>
            </div>
          </div>
          <span className="post-category">{resource.category}</span>
          <h2 className="post-title">
            <Link to={`/${schoolSlug}/library/${resource.id}`}>
              {resource.title}
            </Link>
          </h2>
          <p className="post-excerpt">{resource.description}</p>
          <div className="resource-details">
            <p><strong>Author:</strong> {resource.author}</p>
            <p><strong>Publisher:</strong> {resource.publisher}</p>
            <p><strong>Call Number:</strong> {resource.callNumber}</p>
            <p><strong>Location:</strong> {resource.location}</p>
            <p className={`availability ${getAvailabilityColor(resource.availability)}`}>
              <strong>Status:</strong> {resource.availability}
            </p>
            {resource.isbn && <p><strong>ISBN:</strong> {resource.isbn}</p>}
          </div>
          <div className="resource-actions">
            <Link to={`/${schoolSlug}/library/${resource.id}`} className="read-more">
              View Details <ArrowRight className="h-4 w-4" />
            </Link>
            {resource.downloadUrl && (
              <a href={resource.downloadUrl} className="download-btn" target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
                Download
              </a>
            )}
          </div>
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
          <h1 className="archive-title">Library</h1>
          <p className="archive-description">
            Explore our comprehensive collection of books, journals, and digital resources
          </p>
        </div>

        {renderSearchAndFilters()}
        
        {loading ? (
          <div className="loading-state">Loading library resources...</div>
        ) : filteredResources.length === 0 ? (
          <div className="empty-state">
            <h3>No resources found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {paginatedResources.map((resource, index) => renderResourceCard(resource, index))}
          </div>
        )}
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default LibraryPage;
