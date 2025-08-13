import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import { Search, Filter, Calendar, User, ArrowRight, ChevronDown, MapPin, Clock } from 'lucide-react';
import sdk from '@/lib/sdk-config';
import { useSchool } from '@/contexts/SchoolContext';
import { Link } from 'react-router-dom';
import SectionWrapper, { SectionCard, SectionControls, SectionLoadMore } from './SectionWrapper';
import '@/themes/styles/sections/events-modern.css';
import '@/themes/styles/sections/events-section-styles.css';

interface EventsSectionProps {
  section: Section;
}

const EventsSection: React.FC<EventsSectionProps> = ({ section }) => {
  const { content, settings } = section;
  const { school } = useSchool();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Section settings with defaults
  const eventsToShow = parseInt(settings?.eventsToShow || '6');
  const enableSearch = settings?.enableSearch !== false;
  const enableFiltering = settings?.enableFiltering !== false;
  const enableSorting = settings?.enableSorting !== false;
  const enableLoadMore = settings?.enableLoadMore !== false;
  const showViewAllButton = settings?.showViewAllButton !== false;

  // State for controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [displayedEvents, setDisplayedEvents] = useState(eventsToShow);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [hasMoreEvents, setHasMoreEvents] = useState(false);

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'events-modern-grid',
      '2': 'events-modern-timeline',
      '3': 'events-modern-calendar',
      '4': 'events-modern-cards',
      '5': 'events-modern-showcase',
      '6': 'events-modern-list',
      '7': 'events-modern-masonry',
      '8': 'events-modern-featured',
      '9': 'events-modern-compact',
      '10': 'events-modern-magazine',
      '11': 'events-modern-slider',
      // Existing ultra-modern styles (12+)
      '12': 'events-floating-glass',
      '13': 'events-holographic-cards',
      '14': 'events-neon-grid',
      '15': 'events-particle-bg',
      '16': 'events-morphing-cards',
      '17': 'events-cyber-grid',
      '18': 'events-liquid-metal',
      '19': 'events-aurora-bg',
      '20': 'events-matrix-rain',
      '21': 'events-quantum-field',
      '22': 'events-neural-network',
      '23': 'events-hologram-effect',
      '24': 'events-energy-waves',
      '25': 'events-digital-rain',
      '26': 'events-mosaic-layout'
    };
    return styleMap[styleNumber] || 'events-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');

  // Default events data for demonstration
  const defaultEvents = [
    {
      id: '1',
      title: 'Annual Science Fair',
      description: 'Join us for our annual science fair where students showcase their innovative projects and experiments.',
      date: '2024-12-15',
      time: '10:00 AM',
      location: 'Main Auditorium',
      category: 'Academic',
      organizer: 'Science Department',
      capacity: 200,
      registrations: [],
      status: 'published',
      slug: 'annual-science-fair',
      featured: true
    },
    {
      id: '2',
      title: 'Winter Sports Championship',
      description: 'Cheer on our teams as they compete in the winter sports championship games.',
      date: '2024-12-20',
      time: '2:00 PM',
      location: 'Sports Complex',
      category: 'Sports',
      organizer: 'Athletics Department',
      capacity: 500,
      registrations: [],
      status: 'published',
      slug: 'winter-sports-championship',
      featured: false
    },
    {
      id: '3',
      title: 'Holiday Concert',
      description: 'Enjoy beautiful holiday music performed by our talented students and faculty.',
      date: '2024-12-22',
      time: '7:00 PM',
      location: 'Concert Hall',
      category: 'Arts',
      organizer: 'Music Department',
      capacity: 300,
      registrations: [],
      status: 'published',
      slug: 'holiday-concert',
      featured: true
    },
    {
      id: '4',
      title: 'Parent-Teacher Conference',
      description: 'Meet with teachers to discuss your child\'s progress and academic goals.',
      date: '2024-12-18',
      time: '3:00 PM',
      location: 'Classrooms',
      category: 'Academic',
      organizer: 'Administration',
      capacity: 100,
      registrations: [],
      status: 'published',
      slug: 'parent-teacher-conference',
      featured: false
    },
    {
      id: '5',
      title: 'Art Exhibition Opening',
      description: 'Celebrate creativity at the opening of our student art exhibition.',
      date: '2024-12-25',
      time: '6:00 PM',
      location: 'Art Gallery',
      category: 'Arts',
      organizer: 'Art Department',
      capacity: 150,
      registrations: [],
      status: 'published',
      slug: 'art-exhibition-opening',
      featured: false
    },
    {
      id: '6',
      title: 'New Year Celebration',
      description: 'Ring in the new year with our school community celebration.',
      date: '2024-12-31',
      time: '8:00 PM',
      location: 'Main Campus',
      category: 'Social',
      organizer: 'Student Council',
      capacity: 400,
      registrations: [],
      status: 'published',
      slug: 'new-year-celebration',
      featured: true
    }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        if (school) {
          const allEvents = await sdk.get('events');
          const schoolEvents = allEvents.filter((e: any) =>
            e.schoolId === school.id && e.status === 'published'
          );
          setEvents(schoolEvents.length > 0 ? schoolEvents : defaultEvents);
        } else {
          setEvents(defaultEvents);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setEvents(defaultEvents);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [school]);

  // Get unique categories for filtering
  const categories = ['all', ...Array.from(new Set(events.map(event => event.category)))];

  // Filter and sort events
  useEffect(() => {
    let filtered = [...events];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
    setHasMoreEvents(filtered.length > displayedEvents);
  }, [events, searchTerm, selectedCategory, sortBy, displayedEvents]);

  // Get events to display
  const eventsToDisplay = filteredEvents.slice(0, displayedEvents);

  // Handle load more
  const handleLoadMore = () => {
    setDisplayedEvents(prev => prev + eventsToShow);
  };

  // Render controls
  const renderControls = () => {
    if (!enableSearch && !enableFiltering && !enableSorting) return null;

    return (
      <SectionControls>
        {enableSearch && (
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        )}

        <div className="filter-controls">
          {enableFiltering && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          )}

          {enableSorting && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="category">Sort by Category</option>
            </select>
          )}
        </div>
      </SectionControls>
    );
  };

  // Render event card
  const renderEvent = (event: any, index: number) => {
    const eventUrl = `/${school?.slug}/events/${event.slug || event.id}`;

    return (
      <SectionCard key={event.id || index} href={eventUrl}>
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="event-image"
          />
        )}
        <div className="event-content">
          <div className="event-meta">
            <div className="event-date">
              <Calendar size={14} />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            {event.time && (
              <div className="event-time">
                <Clock size={14} />
                <span>{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="event-location">
                <MapPin size={14} />
                <span>{event.location}</span>
              </div>
            )}
          </div>
          <h3 className="event-title">{event.title}</h3>
          {event.description && (
            <p className="event-description">
              {event.description.length > 150
                ? `${event.description.substring(0, 150)}...`
                : event.description
              }
            </p>
          )}
          {event.category && (
            <div className="event-category">{event.category}</div>
          )}
          {event.organizer && (
            <div className="event-organizer">
              <User size={14} />
              <span>By {event.organizer}</span>
            </div>
          )}
        </div>
      </SectionCard>
    );
  };

  if (loading) {
    return (
      <SectionWrapper section={section} className="events-section">
        <div className="loading-state">Loading events...</div>
      </SectionWrapper>
    );
  }

  if (error) {
    return (
      <SectionWrapper section={section} className="events-section">
        <div className="error-state">
          <p>Error loading events: {error}</p>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper
      section={section}
      className="events-section"
      itemCount={eventsToDisplay.length}
      customLayout={true}
    >
      {renderControls()}

      {eventsToDisplay.length > 0 ? (
        <div className="events-grid">
          {eventsToDisplay.map(renderEvent)}
        </div>
      ) : (
        <div className="no-events">
          <p>No events found.</p>
        </div>
      )}

      <SectionLoadMore
        onLoadMore={enableLoadMore && hasMoreEvents ? handleLoadMore : undefined}
        hasMore={hasMoreEvents}
        viewAllHref={showViewAllButton ? `/${school?.slug}/events` : undefined}
        viewAllText="View All Events"
      />
    </SectionWrapper>
  );
};

export default EventsSection;