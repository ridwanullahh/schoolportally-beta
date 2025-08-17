import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { usePages } from '@/hooks/usePages';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import sdk from '@/lib/sdk-config';
import { Calendar, Clock, MapPin, Search, Filter, ArrowRight, Eye, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';



interface Event {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image?: string;
  organizer: string;
  capacity: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags: string[];
  recurring: boolean;
  registrations?: string[];
  createdAt: string;
  updatedAt?: string;
}

const EventCategoryPage = () => {
  const { school } = useSchool();
  const { schoolSlug, category } = useParams();
  const { pages } = usePages();
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'date');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

  // Map old style names to new template system
  const getTemplateStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {
      'event-archive-style-1': 'template-style-1',
      'event-archive-style-2': 'template-style-2',
      'event-archive-style-3': 'template-style-3',
      'event-archive-style-4': 'template-style-4',
      'event-archive-style-5': 'template-style-5',
      'event-archive-style-6': 'template-style-6',
      'event-archive-style-7': 'template-style-7',
      'event-archive-style-8': 'template-style-8',
      'event-archive-style-9': 'template-style-9',
      'event-archive-style-10': 'template-style-10',
      'event-archive-style-11': 'template-style-11',
      'event-archive-style-12': 'template-style-12',
      'event-archive-style-13': 'template-style-13',
      'event-archive-style-14': 'template-style-14',
      'event-archive-style-15': 'template-style-15',
    };
    return styleMap[styleId] || 'template-style-1';
  };

  const eventArchiveStyle = school?.eventArchiveStyle || 'event-archive-style-1';
  const templateStyle = getTemplateStyle(eventArchiveStyle);
  const eventsPerPage = 12;

  useEffect(() => {
    const fetchEvents = async () => {
      if (school && category) {
        setLoading(true);
        try {
          const allEvents = await sdk.get<Event>('events');
          const categoryEvents = allEvents.filter((e: Event) =>
            e.schoolId === school.id && 
            e.status !== 'cancelled' &&
            e.category === decodeURIComponent(category)
          );
          setEvents(categoryEvents);
        } catch (error) {
          console.error('Failed to fetch events:', error);
          setEvents([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchEvents();
  }, [school, category]);

  useEffect(() => {
    let filtered = [...events];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'location':
          return a.location.localeCompare(b.location);
        case 'date':
        default:
          return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (sortBy !== 'date') params.set('sort', sortBy);
    if (currentPage !== 1) params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [searchTerm, sortBy, currentPage, setSearchParams]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  const renderSearchAndFilters = () => (
    <div className="archive-search-bar">
      <div className="search-input-wrapper relative">
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input pl-10"
        />
      </div>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-select"
      >
        <option value="date">By Date</option>
        <option value="title">By Title</option>
        <option value="location">By Location</option>
      </select>
    </div>
  );

  const renderEventCard = (event: Event, index?: number) => {
    const defaultImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop';
    const eventImage = event.image || defaultImage;

    // Special layouts for specific templates
    if (templateStyle === 'template-style-8') {
      // Minimalist List Layout
      return (
        <article key={event.id} className="post-card">
          <div className="post-content">
            <h2 className="post-title">
              <Link to={`/${schoolSlug}/events/${event.id}`}>
                {event.title}
              </Link>
            </h2>
            <div className="post-meta">
              <span>{formatDate(event.date)}</span>
              <span>•</span>
              <span>{formatTime(event.time)}</span>
              <span>•</span>
              <span>{event.location}</span>
            </div>
            <p className="post-excerpt">{event.description}</p>
          </div>
        </article>
      );
    }

    if (templateStyle === 'template-style-5') {
      // Timeline Layout
      return (
        <article key={event.id} className="post-card">
          <div className="post-content">
            <h2 className="post-title">
              <Link to={`/${schoolSlug}/events/${event.id}`}>
                {event.title}
              </Link>
            </h2>
            <div className="post-meta">
              <div className="post-meta-item">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="post-meta-item">
                <Clock className="h-4 w-4" />
                <span>{formatTime(event.time)}</span>
              </div>
              <div className="post-meta-item">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>
            <p className="post-excerpt">{event.description}</p>
            <Link to={`/${schoolSlug}/events/${event.id}`} className="read-more">
              View Details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      );
    }

    // Default card layout for most templates
    return (
      <article key={event.id} className="post-card">
        <img
          src={eventImage}
          alt={event.title}
          className="post-image"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        <div className="post-content">
          <div className="post-meta">
            <div className="post-meta-item">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="post-meta-item">
              <Clock className="h-4 w-4" />
              <span>{formatTime(event.time)}</span>
            </div>
            <div className="post-meta-item">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            {event.capacity && (
              <div className="post-meta-item">
                <Users className="h-4 w-4" />
                <span>{event.registrations?.length || 0}/{event.capacity}</span>
              </div>
            )}
          </div>
          <h2 className="post-title">
            <Link to={`/${schoolSlug}/events/${event.id}`}>
              {event.title}
            </Link>
          </h2>
          <p className="post-excerpt">{event.description}</p>
          <Link to={`/${schoolSlug}/events/${event.id}`} className="read-more">
            View Details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const renderArchiveLayout = () => {
    if (loading) {
      return <div className="loading-state">Loading events...</div>;
    }

    if (filteredEvents.length === 0) {
      return (
        <div className="empty-state">
          <h3>No events found in this category</h3>
          <p>Try searching for something else or browse all events.</p>
          <Link to={`/${schoolSlug}/events`} className="btn btn-primary">
            View All Events
          </Link>
        </div>
      );
    }

    // Special layouts for specific templates
    if (templateStyle === 'template-style-2') {
      // Magazine Layout
      const [featuredEvent, ...secondaryEvents] = paginatedEvents;
      return (
        <div className="posts-grid">
          {featuredEvent && (
            <div className="featured-post">
              {renderEventCard(featuredEvent, 0)}
            </div>
          )}
          <div className="secondary-posts">
            {secondaryEvents.map((event, index) => renderEventCard(event, index + 1))}
          </div>
        </div>
      );
    }

    if (templateStyle === 'template-style-5') {
      // Timeline Layout
      return (
        <div className="posts-timeline">
          {paginatedEvents.map((event, index) => renderEventCard(event, index))}
        </div>
      );
    }

    if (templateStyle === 'template-style-8') {
      // Minimalist List Layout
      return (
        <div className="posts-list">
          {paginatedEvents.map((event, index) => renderEventCard(event, index))}
        </div>
      );
    }

    if (templateStyle === 'template-style-10') {
      // Carousel Layout
      return (
        <div className="posts-carousel">
          {paginatedEvents.map((event, index) => renderEventCard(event, index))}
        </div>
      );
    }

    if (templateStyle === 'template-style-11') {
      // Zigzag Layout
      return (
        <div className="posts-list">
          {paginatedEvents.map((event, index) => renderEventCard(event, index))}
        </div>
      );
    }

    // Default grid layout for most templates
    return (
      <div className="posts-grid">
        {paginatedEvents.map((event, index) => renderEventCard(event, index))}
      </div>
    );
  };

  if (!school) return <div className="loading-state">Loading...</div>;

  const categoryName = category ? decodeURIComponent(category) : '';

  return (
    <div className={`page-template ${templateStyle}`}>
      <SchoolHeader school={school} pages={pages} />
      <main className="archive-container">
        <div className="archive-header">
          <h1 className="archive-title">
            {categoryName} Events
          </h1>
          <p className="archive-description">
            Browse all events in the "{categoryName}" category
          </p>
          {templateStyle === 'template-style-13' && (
            <p className="archive-subtitle">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          )}
        </div>

        <div className="breadcrumb">
          <Link to={`/${schoolSlug}`}>Home</Link>
          <span> / </span>
          <Link to={`/${schoolSlug}/events`}>Events</Link>
          <span> / </span>
          <span>{categoryName}</span>
        </div>

        {renderSearchAndFilters()}
        {renderArchiveLayout()}
        {renderPagination()}
      </main>
      <SchoolFooter school={school} />
      
      {/* Floating elements for template-style-9 */}
      {templateStyle === 'template-style-9' && (
        <>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </>
      )}
    </div>
  );
};

export default EventCategoryPage;
